from app.extensions import db
from datetime import datetime
import json

class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    public_id = db.Column(db.String(50), unique=True, nullable=False) # e.g. ORD-1234
    
    customer_name = db.Column(db.String(100), nullable=False)
    customer_email = db.Column(db.String(150), nullable=False)
    company_name = db.Column(db.String(150), nullable=True)
    
    order_date = db.Column(db.DateTime, default=datetime.utcnow)
    total = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='Pending')
    
    # Store items as JSON to avoid complex relationships for now, since frontend expects simple array
    items_json = db.Column(db.Text, nullable=False)

    def to_dict(self):
        items = []
        if self.items_json:
            try:
                items = json.loads(self.items_json)
            except:
                pass
                
        return {
            'id': self.public_id,
            'customerName': self.customer_name,
            'customerEmail': self.customer_email,
            'companyName': self.company_name,
            'orderDate': self.order_date.strftime('%d %b %Y'), # Format expected by frontend '24 Jun 2026'
            'items': items,
            'total': self.total,
            'status': self.status
        }
