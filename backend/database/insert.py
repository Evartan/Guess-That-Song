# Citation for the following code:
# Date of retrieval: 14/02/2023
# Title of the application: How to Use Python with MongoDB
# Type: Source code
# Author name: MongoDB
# Based on source URL: https://www.mongodb.com/languages/python

# Get the database using the method we defined in pymongo_insert file
from get_database import get_database

from passlib.context import CryptContext
from dotenv import load_dotenv
import os

import uuid
import time

load_dotenv()

# Initialize database and collection
dbname = get_database()
user_collection = dbname["users"]
session_collection = dbname["sessions"]

# Citation for the following code:
# Date of retrieval: 14/02/2023
# Title of the application: hash-and-verify-the-passwords
# Type: Source code
# Author name: fastapi
# Based on source URL: https://passlib.readthedocs.io/en/stable/narr/context-tutorial.html#basic-usage
#                      https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/#hash-and-verify-the-passwords

# Hash a password for dummy user db item
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
hashed_password = pwd_context.hash(os.getenv("DUMMY_PASSWORD"))

# Initialize dummy user db item
user_1 = {"_id": str(uuid.uuid4()), "username": "user", "password": hashed_password}

# Insert dummy user item into collections
user_collection.insert_one(user_1)

# Query dummy user item with username being user to get its ObjectId, _id.
user_item = user_collection.find_one({"username": "user"})
print(user_item)

# Initialize dummy session db item
session_1 = {
    "_id": str(uuid.uuid4()),
    "user_id": user_item["_id"],
    "total_correct_guesses": 0,
    "streak": 0,
    "created_at": time.time_ns(),
}

# Insert dummy session item into collections
session_collection.insert_one(session_1)
