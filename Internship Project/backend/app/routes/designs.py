from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.design import PersonalizedDesign
from app.models.user import User
import uuid

designs_bp = Blueprint('designs', __name__)

@designs_bp.route('/designs', methods=['GET'])
@jwt_required(optional=True)
def get_designs():
    designs = PersonalizedDesign.query.all()
    return jsonify({"success": True, "data": [d.to_dict() for d in designs]})

@designs_bp.route('/designs', methods=['POST'])
@jwt_required()
def create_design():
    data = request.get_json()
    user = User.query.filter_by(public_id=get_jwt_identity()).first()
    
    design = PersonalizedDesign(
        public_id=f"DES-{uuid.uuid4().hex[:6].upper()}",
        customer_name=user.name if user else data.get('customerName', 'Unknown'),
        customer_email=user.email if user else data.get('customerEmail', 'Unknown'),
        company_name=user.company if user else data.get('companyName', ''),
        product_id=data.get('productId', ''),
        product_name=data.get('productName', ''),
        custom_text=data.get('customText'),
        color=data.get('color'),
        logo_url=data.get('logoUrl'),
        notes=data.get('notes'),
        status='Pending'
    )
    db.session.add(design)
    db.session.commit()
    return jsonify({"success": True, "data": design.to_dict()}), 201

@designs_bp.route('/designs/<public_id>/status', methods=['PATCH'])
@jwt_required()
def update_design_status(public_id):
    data = request.get_json()
    design = PersonalizedDesign.query.filter_by(public_id=public_id).first_or_404()
    
    if 'status' in data:
        design.status = data['status']
    if 'adminFeedback' in data:
        design.admin_feedback = data['adminFeedback']
        
    db.session.commit()
    return jsonify({"success": True, "data": design.to_dict()})
