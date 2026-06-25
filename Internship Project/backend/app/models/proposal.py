from datetime import datetime, timezone
from app.extensions import db

class Proposal(db.Model):
    """
    Core model representing a corporate gift proposal request.
    """
    __tablename__ = 'proposals'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    # Client Information
    client_name = db.Column(db.String(100), nullable=False)
    client_company = db.Column(db.String(150), nullable=False)
    client_email = db.Column(db.String(150), nullable=False)
    client_phone = db.Column(db.String(20), nullable=True)
    
    # Using Enum to strictly enforce valid client types
    client_type = db.Column(
        db.Enum('STARTUP', 'SME', 'ENTERPRISE', 'NGO', 'GOVERNMENT', name='client_type_enum'), 
        nullable=False
    )
    
    # Request Details
    occasion = db.Column(
        db.Enum('FESTIVAL', 'EMPLOYEE_WELCOME', 'ANNIVERSARY', 'CONFERENCE', 'CUSTOM', name='occasion_enum'), 
        nullable=False
    )
    budget_per_unit = db.Column(db.Numeric(10, 2), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    delivery_deadline = db.Column(db.Date, nullable=False)
    
    # Branding Preferences
    branding_required = db.Column(db.Boolean, default=False)
    branding_notes = db.Column(db.Text, nullable=True)
    
    # Workflow Status
    status = db.Column(
        db.Enum('DRAFT', 'SENT', 'APPROVED', 'REJECTED', 'REVISED', 'CLOSED', name='status_enum'), 
        default='DRAFT'
    )
    
    # Links to the active generated proposal version
    # Note: The 'proposal_versions' table does not exist yet; we will build it in Phase 6.
    current_version_id = db.Column(db.Integer, db.ForeignKey('proposal_versions.id'), nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f"<Proposal {self.id} - {self.client_company}>"
