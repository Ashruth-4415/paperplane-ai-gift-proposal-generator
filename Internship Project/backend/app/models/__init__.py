# This file makes the models folder a Python package.
# By importing all models here, we ensure SQLAlchemy is aware of them
# when we run our db.create_all() command.

from .proposal import Proposal
from .gift_package import GiftPackage
from .proposal_version import ProposalVersion
from .proposal_item import ProposalItem
from .status_log import StatusLog

# New Models
from .user import User
from .ticket import Ticket
from .order import Order
from .return_request import ReturnRequest
from .design import PersonalizedDesign
from .notification import Notification
