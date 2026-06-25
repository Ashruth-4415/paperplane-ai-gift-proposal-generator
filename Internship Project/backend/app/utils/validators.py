from marshmallow import Schema, fields, validate, validates, ValidationError
from datetime import date

class ProposalRequestSchema(Schema):
    """
    Marshmallow schema to validate incoming JSON data for creating a new proposal.
    Ensures the frontend sends exactly what we expect.
    """
    client_name = fields.String(required=True, validate=validate.Length(min=2, max=100))
    client_company = fields.String(required=True, validate=validate.Length(min=2, max=150))
    client_email = fields.Email(required=True)
    client_phone = fields.String(required=False)
    
    client_type = fields.String(required=True, validate=validate.OneOf(
        ['STARTUP', 'SME', 'ENTERPRISE', 'NGO', 'GOVERNMENT']
    ))
    occasion = fields.String(required=True, validate=validate.OneOf(
        ['FESTIVAL', 'EMPLOYEE_WELCOME', 'ANNIVERSARY', 'CONFERENCE', 'CUSTOM']
    ))
    
    budget_per_unit = fields.Float(required=True, validate=validate.Range(min=100, max=100000))
    quantity = fields.Integer(required=True, validate=validate.Range(min=1, max=50000))
    
    delivery_deadline = fields.Date(required=True)
    branding_required = fields.Boolean(load_default=False)
    branding_notes = fields.String(required=False)

    @validates('delivery_deadline')
    def validate_deadline(self, value):
        """Custom validator to ensure the deadline is in the future."""
        if value <= date.today():
            raise ValidationError("Delivery deadline must be a future date.")
