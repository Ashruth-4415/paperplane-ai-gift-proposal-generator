from flask import Flask
from .config import Config
from .extensions import db, cors, jwt

def create_app(config_class=Config):
    """
    App Factory function to create and configure the Flask application.
    """
    # Initialize the core Flask application
    app = Flask(__name__)
    
    # Load all settings from the Config class we created earlier
    app.config.from_object(config_class)
    
    # Bind the extensions to our app instance
    db.init_app(app)
    
    # Configure CORS (Cross-Origin Resource Sharing)
    # This allows Student 1's frontend (running on a different port like localhost:3000) 
    # to securely request data from our backend (localhost:5000) without the browser blocking it.
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})
    
    # Initialize JWT for authentication
    jwt.init_app(app)
    
    # Import and register our blueprints
    # We import inside the function to avoid circular imports
    from .routes.health import health_bp
    app.register_blueprint(health_bp, url_prefix='/api/v1')
    
    from .routes.proposals import proposals_bp
    app.register_blueprint(proposals_bp, url_prefix='/api/v1')
    
    from .routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/v1')
    
    from .routes.tickets import tickets_bp
    app.register_blueprint(tickets_bp, url_prefix='/api/v1')
    
    from .routes.orders import orders_bp
    app.register_blueprint(orders_bp, url_prefix='/api/v1')
    
    from .routes.designs import designs_bp
    app.register_blueprint(designs_bp, url_prefix='/api/v1')
    
    from .routes.notifications import notifications_bp
    app.register_blueprint(notifications_bp, url_prefix='/api/v1')
    
    return app
