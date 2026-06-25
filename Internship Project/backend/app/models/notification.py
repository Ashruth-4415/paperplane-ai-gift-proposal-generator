from app.extensions import db
from datetime import datetime

class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    public_id = db.Column(db.String(50), unique=True, nullable=False)
    
    role = db.Column(db.String(20), nullable=False) # 'admin' or 'customer'
    customer_email = db.Column(db.String(150), nullable=True) # If targeting specific customer
    company_name = db.Column(db.String(150), nullable=True)
    
    type = db.Column(db.String(50), nullable=False, default='message') # message, alert, success
    message = db.Column(db.String(255), nullable=False)
    link = db.Column(db.String(255), nullable=True)
    
    read_status = db.Column(db.Boolean, default=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.public_id,
            'role': self.role,
            'customerEmail': self.customer_email,
            'companyName': self.company_name,
            'type': self.type,
            'message': self.message,
            'link': self.link,
            'readStatus': self.read_status,
            'timestamp': self.timestamp.strftime('%Y-%m-%dT%H:%M:%SZ')
        }
