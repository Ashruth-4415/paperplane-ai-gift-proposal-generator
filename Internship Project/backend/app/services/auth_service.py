from app.extensions import db
from app.models.user import User
from flask_jwt_extended import create_access_token
import uuid

def register_user(data):
    if User.query.filter_by(email=data['email']).first():
        raise ValueError("Email already exists")
        
    public_id = f"USR-{uuid.uuid4().hex[:6].upper()}"
    user = User(
        public_id=public_id,
        name=data['name'],
        email=data['email'],
        role=data.get('role', 'customer'),
        company=data.get('company'),
        department=data.get('department'),
        phone=data.get('phone'),
        avatar=data.get('avatar')
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return user

def authenticate_user(email, password):
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return None
        
    access_token = create_access_token(identity=user.public_id)
    return {
        'token': access_token,
        'user': user.to_dict()
    }

def get_user_by_public_id(public_id):
    return User.query.filter_by(public_id=public_id).first()
