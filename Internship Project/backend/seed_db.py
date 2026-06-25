from app import create_app
from app.extensions import db
from app.models.gift_package import GiftPackage

# Create the app context so we can talk to the database
app = create_app()

def seed_packages():
    """
    Pre-fills the database with sample gift packages.
    Our AI/Rule engine will need these to actually generate a proposal!
    """
    with app.app_context():
        # Check if the database already has packages so we don't accidentally insert duplicates
        existing = db.session.scalars(db.select(GiftPackage)).first()
        if existing:
            print("Database already contains gift packages. Skipping seed.")
            return

        print("Seeding gift packages...")

        # Create a list of 4 diverse packages
        packages = [
            GiftPackage(
                name="Premium Diwali Box",
                description="A luxurious box containing premium dates, dry fruits, and a copper glass set.",
                category="FESTIVAL",
                min_quantity=10,
                unit_price=2500.00,
                bulk_discount_pct=5.00,
                suitable_occasions="FESTIVAL",
                suitable_client_types="ENTERPRISE,SME"
            ),
            GiftPackage(
                name="Welcome Aboard Kit",
                description="Essential employee onboarding kit including a branded notebook, pen, and coffee mug.",
                category="CORPORATE",
                min_quantity=1,
                unit_price=800.00,
                bulk_discount_pct=0.00,
                suitable_occasions="EMPLOYEE_WELCOME",
                suitable_client_types="STARTUP,SME,ENTERPRISE"
            ),
            GiftPackage(
                name="Executive Conference Hamper",
                description="High-end leather diary, power bank, and gourmet chocolates.",
                category="PREMIUM",
                min_quantity=50,
                unit_price=4500.00,
                bulk_discount_pct=10.00,
                suitable_occasions="CONFERENCE,ANNIVERSARY",
                suitable_client_types="ENTERPRISE,GOVERNMENT"
            ),
            GiftPackage(
                name="Budget Team Treats",
                description="A sweet box with assorted cookies and a thank-you card.",
                category="BUDGET",
                min_quantity=100,
                unit_price=250.00,
                bulk_discount_pct=2.00,
                suitable_occasions="CUSTOM,FESTIVAL",
                suitable_client_types="NGO,STARTUP"
            )
        ]

        # Bulk save is a fast way to insert many rows at once
        db.session.add_all(packages)
        db.session.commit()
        
        print("Success! Inserted 4 gift packages into the catalogue.")

def seed_users():
    from app.models.user import User
    with app.app_context():
        if db.session.scalars(db.select(User)).first():
            print("Users already exist. Skipping seed.")
            return

        print("Seeding default users...")
        admin = User(
            public_id='USR-001',
            name='Ashruth',
            email='Ashruth@paperplane.in',
            role='admin',
            department='Sales & Design',
            avatar='https://api.dicebear.com/7.x/avataaars/svg?seed=Ashruth'
        )
        admin.set_password('password123')

        customer = User(
            public_id='USR-101',
            name='Customer',
            email='customer@company.in',
            role='customer',
            company='Company',
            phone='+91 98765 43210',
            avatar='https://api.dicebear.com/7.x/avataaars/svg?seed=Customer'
        )
        customer.set_password('password123')

        db.session.add_all([admin, customer])
        db.session.commit()
        print("Success! Inserted default admin and customer (Password: password123).")

if __name__ == '__main__':
    seed_packages()
    seed_users()
