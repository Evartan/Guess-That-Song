# Citation for the following code:
# Date of retrieval: 27/01/2023
# Title of the application: How to Use Python with MongoDB
# Type: Source code
# Author name: MongoDB
# Based on source URL: https://www.mongodb.com/languages/python

import os

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()


def get_database():
    # Provide the mongodb atlas url to connect python to mongodb using pymongo
    CONNECTION_STRING = os.getenv("CONNECTION_STRING")

    # Create a connection using MongoClient. You can import MongoClient or use pymongo.MongoClient
    client = MongoClient(CONNECTION_STRING)

    # Create the database for our example (we will use the same database throughout the tutorial
    return client[os.getenv("DB_NAME")]


# This is added so that many files can reuse the function get_database()
if __name__ == "__main__":
    # Get the database
    dbname = get_database()
