import datetime
from flask import Blueprint, request, jsonify, send_file
from marshmallow import ValidationError
from app.extensions import db
from app.models.proposal import Proposal
from app.models.proposal_version import ProposalVersion
from app.utils.validators import ProposalRequestSchema
from app.services.proposal_service import create_proposal, get_proposals, get_proposal_detail, update_proposal_status
from app.services.generation_service import generate_proposal_content
from app.services.pdf_service import generate_pdf_buffer

proposals_bp = Blueprint('proposals', __name__)

@proposals_bp.route('/proposals', methods=['POST'])
def create_new_proposal():
    try:
        json_data = request.get_json()
        if not json_data:
            return jsonify({"success": False, "error": "No JSON data provided"}), 400
            
        schema = ProposalRequestSchema()
        validated_data = schema.load(json_data)
        proposal = create_proposal(validated_data)
        
        return jsonify({
            "success": True,
            "data": {
                "proposal_id": proposal.id,
                "status": proposal.status,
                "created_at": proposal.created_at.isoformat()
            }
        }), 201
    except ValidationError as err:
        return jsonify({"success": False, "error": "Validation failed", "details": err.messages}), 400
    except Exception as e:
        return jsonify({"success": False, "error": "An unexpected error occurred.", "details": str(e)}), 500

@proposals_bp.route('/proposals', methods=['GET'])
def list_proposals():
    try:
        filters = {
            'status': request.args.get('status'),
            'client_type': request.args.get('client_type'),
            'occasion': request.args.get('occasion'),
            'from_date': request.args.get('from_date'),
            'to_date': request.args.get('to_date')
        }
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        paginated = get_proposals(filters, page, per_page)
        
        proposals_list = []
        for p in paginated.items:
            proposals_list.append({
                "id": p.id,
                "client_name": p.client_name,
                "client_company": p.client_company,
                "client_type": p.client_type,
                "occasion": p.occasion,
                "budget_per_unit": float(p.budget_per_unit), 
                "quantity": p.quantity,
                "status": p.status,
                "created_at": p.created_at.isoformat()
            })
            
        return jsonify({
            "success": True,
            "data": {
                "proposals": proposals_list,
                "total": paginated.total,
                "page": paginated.page,
                "per_page": paginated.per_page
            }
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": "Failed to retrieve proposals", "details": str(e)}), 500

@proposals_bp.route('/proposals/<int:proposal_id>', methods=['GET'])
def get_single_proposal(proposal_id):
    try:
        data = get_proposal_detail(proposal_id)
        if not data:
            return jsonify({"success": False, "error": "Proposal not found"}), 404
            
        proposal = data['proposal']
        
        status_history = []
        for log in data['status_history']:
            status_history.append({
                "from_status": log.from_status,
                "to_status": log.to_status,
                "changed_by": log.changed_by,
                "notes": log.notes,
                "changed_at": log.changed_at.isoformat()
            })
            
        versions = []
        for v in data['versions']:
            versions.append({
                "version_number": v.version_number,
                "title": v.title,
                "total_price": float(v.total_price),
                "created_at": v.created_at.isoformat()
            })
            
        current_version_data = None
        if data['current_version_data']:
            v_data = data['current_version_data']['version']
            items = []
            for item in data['current_version_data']['items']:
                items.append({
                    "item_name": item.item_name,
                    "unit_price": float(item.unit_price),
                    "quantity": item.quantity_per_gift
                })
                
            current_version_data = {
                "version_number": v_data.version_number,
                "title": v_data.title,
                "executive_summary": v_data.executive_summary,
                "closing_pitch": v_data.closing_pitch,
                "delivery_timeline": v_data.delivery_timeline,
                "total_price": float(v_data.total_price),
                "items": items
            }
            
        return jsonify({
            "success": True,
            "data": {
                "proposal": {
                    "id": proposal.id,
                    "client_name": proposal.client_name,
                    "client_company": proposal.client_company,
                    "status": proposal.status,
                    "budget_per_unit": float(proposal.budget_per_unit),
                    "quantity": proposal.quantity,
                    "created_at": proposal.created_at.isoformat()
                },
                "current_version": current_version_data,
                "versions": versions,
                "status_history": status_history
            }
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": "Failed to retrieve proposal details", "details": str(e)}), 500

@proposals_bp.route('/proposals/<int:proposal_id>/generate', methods=['POST'])
def generate_proposal(proposal_id):
    try:
        proposal = db.session.get(Proposal, proposal_id)
        if not proposal:
            return jsonify({"success": False, "error": "Proposal not found"}), 404
            
        json_data = request.get_json(silent=True) or {}
        engine = json_data.get('engine', 'RULE_ENGINE')
        
        new_version = generate_proposal_content(proposal, engine_preference=engine)
        
        return jsonify({
            "success": True,
            "data": {
                "version_id": new_version.id,
                "version_number": new_version.version_number,
                "title": new_version.title,
                "total_price": float(new_version.total_price)
            }
        }), 201
    except ValueError as ve:
        return jsonify({"success": False, "error": str(ve)}), 422
    except Exception as e:
        return jsonify({"success": False, "error": "Generation failed", "details": str(e)}), 500

@proposals_bp.route('/proposals/<int:proposal_id>/status', methods=['PATCH'])
def update_status(proposal_id):
    try:
        json_data = request.get_json()
        if not json_data or 'new_status' not in json_data or 'changed_by' not in json_data:
            return jsonify({"success": False, "error": "Missing required fields"}), 400
            
        proposal, old_status = update_proposal_status(
            proposal_id=proposal_id,
            new_status=json_data['new_status'],
            changed_by=json_data['changed_by'],
            notes=json_data.get('notes')
        )
        
        return jsonify({
            "success": True,
            "data": {
                "proposal_id": proposal.id,
                "old_status": old_status,
                "new_status": proposal.status,
                "changed_at": datetime.datetime.now().isoformat()
            }
        }), 200
    except ValueError as ve:
        status_code = 404 if "not found" in str(ve).lower() else 400
        return jsonify({"success": False, "error": str(ve)}), status_code
    except Exception as e:
        return jsonify({"success": False, "error": "Status update failed", "details": str(e)}), 500

@proposals_bp.route('/proposals/<int:proposal_id>/pdf', methods=['GET'])
def download_pdf(proposal_id):
    """
    GET /api/v1/proposals/:id/pdf
    Generates and returns the PDF document for the current version of the proposal.
    """
    try:
        proposal = db.session.get(Proposal, proposal_id)
        if not proposal:
            return jsonify({"success": False, "error": "Proposal not found"}), 404
            
        # Check if they generated a draft yet
        if not proposal.current_version_id:
            return jsonify({"success": False, "error": "No proposal document has been generated yet. Please generate one first."}), 400
            
        # Fetch the active version
        current_version = db.session.get(ProposalVersion, proposal.current_version_id)
        
        # Hand the objects to our PDF engine
        pdf_buffer = generate_pdf_buffer(current_version, proposal)
        
        # Create a beautiful, clean filename by removing weird characters from the company name
        company_name_clean = "".join(x for x in proposal.client_company if x.isalnum() or x in " -_").strip()
        filename = f"PaperPlane_{company_name_clean}_v{current_version.version_number}.pdf"
        
        # send_file automatically reads the memory buffer and sets the correct HTTP headers for a file download
        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name=filename,
            mimetype='application/pdf'
        )
        
    except Exception as e:
        return jsonify({"success": False, "error": "Failed to generate PDF", "details": str(e)}), 500
