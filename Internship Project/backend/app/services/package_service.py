from app.extensions import db
from app.models.gift_package import GiftPackage

def select_best_package(proposal):
    """
    Core rule engine logic to select the most suitable gift package from the catalogue
    based on the client's budget, quantity, occasion, and company type.
    """
    # 1. Base Filter: Must be active and must fit within their budget!
    # We use <= because we can never exceed the client's stated budget.
    query = db.select(GiftPackage).filter(
        GiftPackage.is_active == True,
        GiftPackage.unit_price <= proposal.budget_per_unit
    )
    
    available_packages = db.session.execute(query).scalars().all()
    
    # 2. Scoring System: We will iterate through available packages and score them.
    # The package with the highest score wins.
    best_package = None
    highest_score = -1
    
    for package in available_packages:
        # RULE 1: Quantity Constraints (Strict)
        # If the client wants 5 gifts, but the package requires a minimum of 50, skip it entirely.
        if proposal.quantity < package.min_quantity:
            continue
        if package.max_quantity and proposal.quantity > package.max_quantity:
            continue
            
        score = 0
        
        # RULE 2: Occasion Matching (+10 points)
        # Check if the client's occasion string exists inside the package's comma-separated list
        if package.suitable_occasions and proposal.occasion in package.suitable_occasions:
            score += 10
            
        # RULE 3: Client Type Matching (+5 points)
        if package.suitable_client_types and proposal.client_type in package.suitable_client_types:
            score += 5
            
        # RULE 4: Budget Maximization (Up to +5 points)
        # If the client has a 2500 budget, a 2400 package is a better business fit than a 250 package.
        budget_utilization = float(package.unit_price) / float(proposal.budget_per_unit)
        score += (budget_utilization * 5)
        
        # Keep track of the winner
        if score > highest_score:
            highest_score = score
            best_package = package
            
    # Returns the winning GiftPackage object, or None if literally nothing fits
    return best_package
