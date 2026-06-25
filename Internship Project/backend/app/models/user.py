from app.extensions import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # Using string IDs like 'USR-101' for frontend compatibility if needed, but Integer is better for DB. 
    # Let's add a public_id for frontend matching if necessary, or just use string id.
    public_id = db.Column(db.String(50), unique=True, nullable=False) 
    
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    
    role = db.Column(db.String(20), nullable=False, default='customer') # 'admin' or 'customer'
    company = db.Column(db.String(150), nullable=True) # For customers
    department = db.Column(db.String(100), nullable=True) # For admins
    phone = db.Column(db.String(20), nullable=True)
    avatar = db.Column(db.String(255), nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.public_id, # Frontend expects string IDs
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'company': self.company,
            'department': self.department,
            'phone': self.phone,
            'avatar': self.avatar
        }
