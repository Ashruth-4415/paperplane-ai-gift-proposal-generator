from datetime import datetime, timezone
from app.extensions import db

class StatusLog(db.Model):
    """
    Append-only audit trail for proposal status changes.
    Records every status transition a proposal goes through.
    """
    __tablename__ = 'status_logs'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    # Foreign Key linking to the parent proposal
    proposal_id = db.Column(db.Integer, db.ForeignKey('proposals.id'), nullable=False)
    
    # The status before the change. 
    # This is nullable because when a proposal is first created, there is no "previous" status.
    from_status = db.Column(
        db.Enum('DRAFT', 'SENT', 'APPROVED', 'REJECTED', 'REVISED', 'CLOSED', name='from_status_enum'), 
        nullable=True
    )
    
    # The new status after the change
    to_status = db.Column(
        db.Enum('DRAFT', 'SENT', 'APPROVED', 'REJECTED', 'REVISED', 'CLOSED', name='to_status_enum'), 
        nullable=False
    )
    
    # Records who triggered the change (e.g., 'Store Admin' or 'SYSTEM')
    changed_by = db.Column(db.String(100), nullable=False)
    
    # Optional comment (e.g., if a client rejects a proposal, the admin can log the reason here)
    notes = db.Column(db.Text, nullable=True)
    
    # Timestamp of the change
    changed_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f"<StatusLog Proposal {self.proposal_id}: {self.from_status} -> {self.to_status}>"
