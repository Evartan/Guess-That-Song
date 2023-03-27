# Citation for the following code:
# Date of retrieval: 14/02/2023
# Title of the application: pymongo tutorial
# Type: Source code
# Author name: MongoDB
# Based on source URL: https://www.mongodb.com/languages/python/pymongo-tutorial

from typing import Optional, Union
from pydantic import BaseModel, Field
import time
import uuid
from dotenv import load_dotenv

load_dotenv()


# Pydantic model
class Session(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    user_id: str = Field(...)
    total_correct_guesses: int = 0
    streak: int = 0
    created_at: int = Field(default_factory=time.time_ns)

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "user_id": "d6b43d23-be28-4671-8790-f2a90c019552",
            }
        }


class SessionUpdate(BaseModel):
    total_correct_guesses: Optional[int]
    streak: Optional[int]

    class Config:
        schema_extra = {
            "example": {
                "total_correct_guesses": 10,
                "streak": 7,
            }
        }


# Citation for the following code:
# Date of retrieval: 25/02/2023
# Title of the application: Response Model - Return Type
# Type: Source code
# Author name: FastAPI
# Based on source URL: https://fastapi.tiangolo.com/tutorial/response-model/
class UserIn(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    username: str = Field(...)
    password: str = Field(...)

    class Config:
        schema_extra = {"example": {"username": "user", "password": "password"}}


class UserOut(BaseModel):
    id: str = Field(alias="_id")
    username: str

    class Config:
        schema_extra = {
            "example": {
                "_id": "d6b43d23-be28-4671-8790-f2a90c019552",
                "username": "user",
            }
        }


# Citation for the following code:
# Date of retrieval: 25/02/2023
# Title of the application: pymongo tutorial
# Type: Source code
# Author name: FastAPI OAuth2 with Password (and hashing), Bearer with JWT tokens
# Based on source URL: https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/
class User(BaseModel):
    id: str = Field(alias="_id")
    username: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Union[str, None] = None


class UserInDB(User):
    password: str


class CookieToken(BaseModel):
    token: str
