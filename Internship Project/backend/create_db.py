from app import create_app
from app.extensions import db
from app import models  # This ensures SQLAlchemy sees all our tables before creating them!

# Create the Flask app so we have our database configuration
app = create_app()

def initialize_database():
    """Creates all database tables based on our SQLAlchemy models."""
    # We must operate inside the 'app_context' so Flask knows WHICH database to connect to.
    with app.app_context():
        print("Connecting to database...")
        db.drop_all() # Added to ensure a clean slate for our massive schema update
        db.create_all()
        print("Success! All tables have been created.")

if __name__ == '__main__':
    initialize_database()
