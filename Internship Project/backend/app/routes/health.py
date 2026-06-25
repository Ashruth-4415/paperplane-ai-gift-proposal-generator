from flask import Blueprint, jsonify
import datetime

# Create a Blueprint named 'health_bp'. 
# Blueprints allow us to organize related routes together.
health_bp = Blueprint('health', __name__)

@health_bp.route('/health', methods=['GET'])
def health_check():
    """
    GET /api/v1/health
    Returns the server status and current time.
    """
    return jsonify({
        "success": True,
        "data": {
            "status": "ok",
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }
    }), 200
