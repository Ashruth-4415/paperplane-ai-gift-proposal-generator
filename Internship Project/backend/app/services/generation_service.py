import datetime
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
        # If the student wants to upgrade to AI later, they would call OpenAI here!
        raise NotImplementedError("AI generation is disabled pending API key setup. Use RULE_ENGINE.")
        
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
