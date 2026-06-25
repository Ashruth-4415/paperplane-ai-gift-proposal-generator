from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.auth_service import register_user, authenticate_user, get_user_by_public_id

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not all(k in data for k in ("name", "email", "password")):
        return jsonify({"success": False, "error": "Missing required fields (name, email, password)"}), 400
    try:
        user = register_user(data)
        return jsonify({"success": True, "data": user.to_dict()}), 201
    except ValueError as e:
        return jsonify({"success": False, "error": str(e)}), 400
    except Exception as e:
        return jsonify({"success": False, "error": "Registration failed", "details": str(e)}), 500

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"success": False, "error": "Missing email or password"}), 400
        
    auth_data = authenticate_user(data['email'], data['password'])
    if not auth_data:
        return jsonify({"success": False, "error": "Invalid email or password"}), 401
        
    return jsonify({"success": True, "data": auth_data}), 200

@auth_bp.route('/auth/me', methods=['GET'])
@jwt_required()
def get_me():
    current_user_id = get_jwt_identity()
    user = get_user_by_public_id(current_user_id)
    if not user:
        return jsonify({"success": False, "error": "User not found"}), 404
        
    return jsonify({"success": True, "data": user.to_dict()}), 200
