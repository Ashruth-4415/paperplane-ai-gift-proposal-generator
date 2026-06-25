import os
from dotenv import load_dotenv

# Load variables from the .env file into the environment
load_dotenv()

class Config:
    """Base configuration class."""
    
    # Flask Security Key
    # We use os.environ.get so that if the variable is missing from .env, 
    # it won't crash the app (it provides a default fallback if desired, though here we just get None if missing).
    SECRET_KEY = os.environ.get('SECRET_KEY', 'default-dev-key-do-not-use-in-prod')
    
    # SQLAlchemy (Database) Configuration
    # This tells Flask-SQLAlchemy exactly how to connect to our MySQL database.
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    
    # Disable a feature of SQLAlchemy that tracks every modification to objects.
    # It takes up extra memory and is generally disabled unless explicitly needed.
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # AI Service Configuration
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
    
    # JWT Configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-super-secret-key-change-in-prod')
