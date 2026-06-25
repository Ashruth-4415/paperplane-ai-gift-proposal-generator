import datetime
import json
import os
from groq import Groq
from flask import current_app
from app.extensions import db
from app.models.proposal_version import ProposalVersion
from app.models.proposal_item import ProposalItem
from app.services.package_service import select_best_package

def generate_proposal_content(proposal, engine_preference='RULE_ENGINE'):
    """
    Takes a Proposal, finds the best package, and generates a new ProposalVersion.
    This creates the actual "document" data that the client will see.
    """
    # 1. Ask our smart package service to pick the winning package
    package = select_best_package(proposal)
    if not package:
        raise ValueError("No suitable package found for this budget and quantity constraints.")
        
    # 2. Figure out the Version Number
    # We query the database to find the most recent version. If none exists, this is Version 1.
    last_version = db.session.scalars(
        db.select(ProposalVersion)
        .filter_by(proposal_id=proposal.id)
        .order_by(ProposalVersion.version_number.desc())
    ).first()
    
    next_version_num = (last_version.version_number + 1) if last_version else 1
    
    # Calculate the final total price applying the bulk discount
    discount_multiplier = (100 - float(package.bulk_discount_pct)) / 100.0
    total_price = float(package.unit_price) * proposal.quantity * discount_multiplier

    # 3. Generate the Content! 
    if engine_preference == 'RULE_ENGINE':
        # We use simple string formatting to dynamically write a professional proposal
        title = f"{package.name} Proposal for {proposal.client_company}"
        
        executive_summary = (
            f"Dear {proposal.client_name}, based on your request for a {proposal.occasion.lower()} gift "
            f"for your team, we are thrilled to propose our '{package.name}'. "
            f"We believe this perfectly aligns with your vision and budget."
        )
        
        closing_pitch = "Paper Plane is dedicated to high-quality corporate gifting. We look forward to fulfilling this order."
        
        # We assume production takes 5 days
        prod_start = proposal.delivery_deadline - datetime.timedelta(days=5)
        delivery_timeline = f"Production starts: {prod_start.strftime('%Y-%m-%d')} | Delivery: {proposal.delivery_deadline.strftime('%Y-%m-%d')}"
    else:
        api_key = current_app.config.get('GROQ_API_KEY') or os.environ.get('GROQ_API_KEY')
        if not api_key:
            raise ValueError("GROQ_API_KEY is not configured on the server!")
            
        client = Groq(api_key=api_key)
        
        prompt = f"""
        You are an expert corporate gifting salesperson. 
        The client '{proposal.client_name}' from '{proposal.client_company}' has requested a {proposal.occasion.lower()} gift for their team.
        We are proposing the '{package.name}' which costs ${package.unit_price} each.
        
        Return ONLY a JSON object with the following exactly matching keys:
        "title": A catchy, professional title for the proposal.
        "executive_summary": A warm, persuasive 2-3 sentence introduction explaining why this package is perfect for them.
        "closing_pitch": A confident 1-2 sentence closing statement looking forward to working with them.
        """

        try:
            response = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama3-8b-8192",
                response_format={"type": "json_object"},
                temperature=0.7
            )
            result = json.loads(response.choices[0].message.content)
            
            title = result.get('title', f"{package.name} Proposal")
            executive_summary = result.get('executive_summary', "Here is your proposal.")
            closing_pitch = result.get('closing_pitch', "Thank you.")
        except Exception as e:
            print(f"Groq API Error: {str(e)}")
            raise ValueError("AI Generation failed. Please try again or use the Rule Engine.")
            
        prod_start = proposal.delivery_deadline - datetime.timedelta(days=5)
        delivery_timeline = f"Production starts: {prod_start.strftime('%Y-%m-%d')} | Delivery: {proposal.delivery_deadline.strftime('%Y-%m-%d')}"
        
    # 4. Save the generated draft to the database
    new_version = ProposalVersion(
        proposal_id=proposal.id,
        version_number=next_version_num,
        generated_by=engine_preference,
        title=title,
        executive_summary=executive_summary,
        proposed_package_id=package.id,
        total_price=total_price,
        closing_pitch=closing_pitch,
        delivery_timeline=delivery_timeline
    )
    
    db.session.add(new_version)
    db.session.flush() # Flush to get the ID
    
    # 5. Add the actual physical items to this version
    # Since our catalogue currently treats the whole "Package" as one item, we add it directly.
    item = ProposalItem(
        proposal_version_id=new_version.id,
        item_name=package.name,
        item_description=package.description,
        unit_price=package.unit_price,
        quantity_per_gift=1,
        sort_order=1
    )
    db.session.add(item)
    
    # 6. Crucial Step: Tell the main Proposal that THIS is the newly active version!
    proposal.current_version_id = new_version.id
    
    db.session.commit()
    return new_version
