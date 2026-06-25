from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager

# We initialize our database extension here.
# Notice we DO NOT pass the 'app' variable into it yet.
db = SQLAlchemy()

# We initialize our CORS extension here to allow our React frontend to talk to our backend.
cors = CORS()

# Initialize JWT Manager
jwt = JWTManager()
