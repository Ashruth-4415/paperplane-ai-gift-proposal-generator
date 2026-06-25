from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.notification import Notification
from app.models.user import User
import uuid

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('/notifications', methods=['GET'])
@jwt_required(optional=True)
def get_notifications():
    notifications = Notification.query.order_by(Notification.timestamp.desc()).all()
    return jsonify({"success": True, "data": [n.to_dict() for n in notifications]})

@notifications_bp.route('/notifications', methods=['POST'])
@jwt_required()
def create_notification():
    data = request.get_json()
    
    notification = Notification(
        public_id=f"NOTIF-{uuid.uuid4().hex[:8].upper()}",
        role=data.get('role', 'customer'),
        customer_email=data.get('customerEmail'),
        company_name=data.get('companyName'),
        type=data.get('type', 'message'),
        message=data.get('message', ''),
        link=data.get('link')
    )
    db.session.add(notification)
    db.session.commit()
    return jsonify({"success": True, "data": notification.to_dict()}), 201

@notifications_bp.route('/notifications/<public_id>/read', methods=['PATCH'])
@jwt_required()
def mark_read(public_id):
    notification = Notification.query.filter_by(public_id=public_id).first_or_404()
    notification.read_status = True
    db.session.commit()
    return jsonify({"success": True, "data": notification.to_dict()})

@notifications_bp.route('/notifications/read-all', methods=['PATCH'])
@jwt_required()
def mark_all_read():
    user = User.query.filter_by(public_id=get_jwt_identity()).first()
    if not user:
        return jsonify({"success": False, "error": "Unauthorized"}), 401
        
    notifications = Notification.query.filter_by(role=user.role).all()
    for n in notifications:
        n.read_status = True
        
    db.session.commit()
    return jsonify({"success": True, "message": "All marked as read"})
