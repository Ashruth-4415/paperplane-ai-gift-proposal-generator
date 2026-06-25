from app.extensions import db

class ProposalItem(db.Model):
    """
    Model representing an individual product/line-item inside a Proposal Version.
    """
    __tablename__ = 'proposal_items'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    # Foreign Key linking this item to a specific proposal version
    proposal_version_id = db.Column(db.Integer, db.ForeignKey('proposal_versions.id'), nullable=False)
    
    # Item details
    item_name = db.Column(db.String(150), nullable=False)
    item_description = db.Column(db.Text, nullable=True)
    
    # Price for a single unit of this specific item
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    
    # How many of this item are included in ONE gift set
    quantity_per_gift = db.Column(db.Integer, nullable=False, default=1)
    
    # Used to ensure items are displayed in a specific order on the frontend or PDF
    sort_order = db.Column(db.Integer, nullable=False, default=0)

    def __repr__(self):
        return f"<ProposalItem '{self.item_name}' (Version {self.proposal_version_id})>"
