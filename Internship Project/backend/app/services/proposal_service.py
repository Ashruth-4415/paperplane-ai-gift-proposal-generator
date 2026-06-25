from app.extensions import db
from app.models.proposal import Proposal
from app.models.status_log import StatusLog
from app.models.proposal_version import ProposalVersion
from app.models.proposal_item import ProposalItem

def create_proposal(data):
    try:
        new_proposal = Proposal(
            client_name=data['client_name'],
            client_company=data['client_company'],
            client_email=data['client_email'],
            client_phone=data.get('client_phone'),
            client_type=data['client_type'],
            occasion=data['occasion'],
            budget_per_unit=data['budget_per_unit'],
            quantity=data['quantity'],
            delivery_deadline=data['delivery_deadline'],
            branding_required=data.get('branding_required', False),
            branding_notes=data.get('branding_notes')
        )
        db.session.add(new_proposal)
        db.session.flush() 
        
        initial_log = StatusLog(
            proposal_id=new_proposal.id,
            from_status=None,
            to_status='DRAFT',
            changed_by='SYSTEM',
            notes='Initial proposal request submitted by client'
        )
        db.session.add(initial_log)
        db.session.commit()
        return new_proposal
    except Exception as e:
        db.session.rollback()
        raise e

def get_proposals(filters, page=1, per_page=20):
    stmt = db.select(Proposal).order_by(Proposal.created_at.desc())
    if filters.get('status'):
        stmt = stmt.filter_by(status=filters['status'])
    if filters.get('client_type'):
        stmt = stmt.filter_by(client_type=filters['client_type'])
    if filters.get('occasion'):
        stmt = stmt.filter_by(occasion=filters['occasion'])
    if filters.get('from_date'):
        stmt = stmt.filter(Proposal.created_at >= filters['from_date'])
    if filters.get('to_date'):
        stmt = stmt.filter(Proposal.created_at <= filters['to_date'])
    return db.paginate(stmt, page=page, per_page=per_page, error_out=False)

def get_proposal_detail(proposal_id):
    proposal = db.session.get(Proposal, proposal_id)
    if not proposal:
        return None 
        
    logs_stmt = db.select(StatusLog).filter_by(proposal_id=proposal.id).order_by(StatusLog.changed_at.asc())
    status_history = db.session.execute(logs_stmt).scalars().all()
    
    vers_stmt = db.select(ProposalVersion).filter_by(proposal_id=proposal.id).order_by(ProposalVersion.version_number.desc())
    versions = db.session.execute(vers_stmt).scalars().all()
    
    current_version_data = None
    if proposal.current_version_id:
        curr_ver = db.session.get(ProposalVersion, proposal.current_version_id)
        if curr_ver:
            items_stmt = db.select(ProposalItem).filter_by(proposal_version_id=curr_ver.id).order_by(ProposalItem.sort_order.asc())
            items = db.session.execute(items_stmt).scalars().all()
            current_version_data = {
                "version": curr_ver,
                "items": items
            }
            
    return {
        "proposal": proposal,
        "status_history": status_history,
        "versions": versions,
        "current_version_data": current_version_data
    }

def update_proposal_status(proposal_id, new_status, changed_by, notes=None):
    """
    Updates the status of a proposal and creates an audit log.
    Enforces strict business rules on status transitions!
    """
    proposal = db.session.get(Proposal, proposal_id)
    if not proposal:
        raise ValueError("Proposal not found")
        
    old_status = proposal.status
    
    # 1. Define allowed transitions (State Machine)
    # This prevents an admin from changing a 'CLOSED' proposal back to 'DRAFT'
    ALLOWED_TRANSITIONS = {
        'DRAFT': ['SENT'],
        'SENT': ['APPROVED', 'REJECTED'],
        'APPROVED': ['CLOSED'],
        'REJECTED': ['REVISED'],
        'REVISED': ['SENT'],
        'CLOSED': [] # Once closed, it cannot be changed again
    }
    
    # 2. Check if the transition is legal
    if new_status not in ALLOWED_TRANSITIONS.get(old_status, []):
        raise ValueError(f"Invalid status transition from {old_status} to {new_status}")
        
    try:
        # 3. Update the main proposal
        proposal.status = new_status
        
        # 4. Create the new audit log entry
        log = StatusLog(
            proposal_id=proposal.id,
            from_status=old_status,
            to_status=new_status,
            changed_by=changed_by,
            notes=notes
        )
        
        db.session.add(log)
        db.session.commit()
        
        return proposal, old_status
        
    except Exception as e:
        db.session.rollback()
        raise e
