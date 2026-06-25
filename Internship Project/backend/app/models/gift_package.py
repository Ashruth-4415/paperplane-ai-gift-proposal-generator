from datetime import datetime, timezone
from app.extensions import db

class GiftPackage(db.Model):
    """
    Model representing a pre-defined gift package in the product catalogue.
    """
    __tablename__ = 'gift_packages'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    # The name must be unique so we don't have duplicate packages
    name = db.Column(db.String(150), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=False)
    
    # Category for filtering in the dashboard
    category = db.Column(
        db.Enum('FESTIVAL', 'CORPORATE', 'PREMIUM', 'BUDGET', name='package_category_enum'), 
        nullable=False
    )
    
    # Quantity rules
    min_quantity = db.Column(db.Integer, nullable=False, default=1)
    # NULL max_quantity implies there is no upper limit on orders
    max_quantity = db.Column(db.Integer, nullable=True)
    
    # Pricing configuration
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    bulk_discount_pct = db.Column(db.Numeric(5, 2), default=0.00)
    
    # We will store lists as comma-separated strings to help the generation engine match packages to clients
    suitable_occasions = db.Column(db.Text, nullable=True)
    suitable_client_types = db.Column(db.Text, nullable=True)
    
    # Allows us to "hide" packages that are sold out without deleting their history
    is_active = db.Column(db.Boolean, default=True)
    
    # Frontend-specific fields for mockProducts alignment
    public_id = db.Column(db.String(50), nullable=True) # e.g. P001
    rating = db.Column(db.Float, default=0.0)
    tags_json = db.Column(db.Text, nullable=True) # JSON array of tags
    bg_color = db.Column(db.String(100), nullable=True)
    emoji = db.Column(db.String(10), nullable=True)
    in_stock = db.Column(db.Boolean, default=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        import json
        tags = []
        if self.tags_json:
            try:
                tags = json.loads(self.tags_json)
            except:
                tags = []
                
        return {
            'id': self.public_id or f"P{self.id:03d}",
            'name': self.name,
            'category': self.category,
            'price': float(self.unit_price),
            'minQty': self.min_quantity,
            'rating': self.rating,
            'tags': tags,
            'description': self.description,
            'bgColor': self.bg_color,
            'emoji': self.emoji,
            'inStock': self.in_stock
        }

    def __repr__(self):
        return f"<GiftPackage {self.id} - {self.name}>"
