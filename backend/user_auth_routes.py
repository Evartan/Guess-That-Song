# Citation for the following code:
# Date of retrieval: 25/02/2023
# Title of the application: pymongo tutorial
# Type: Source code
# Author name: MongoDB
# Based on source URL: https://www.mongodb.com/languages/python/pymongo-tutorial

from datetime import timedelta

from fastapi import APIRouter, Body, Request, HTTPException, status, Depends, Response
from fastapi.encoders import jsonable_encoder
from backend.models import UserIn, UserOut, User, Token, CookieToken

from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext

from backend.database.get_database import get_database
from backend.user_auth import (
    authenticate_user,
    create_access_token,
    get_current_user,
)

# Initialize database and collection
dbname = get_database()
user_collection = dbname["users"]

# Initialize FastAPI router
router = APIRouter()

# Hash a password for dummy user db item
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Register new user
@router.post("/register", response_model=UserOut)
def register_user(request: Request, user: UserIn = Body(...)):
    user = jsonable_encoder(user)

    # Check if username existed already
    db_item = request.app.database["users"].find_one({"username": user["username"]})
    if db_item is not None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"username '{user['username']}' existed",
        )

    # Hash user password
    hashed_password = pwd_context.hash(user["password"])
    user["password"] = hashed_password

    # Register new user
    new_user = request.app.database["users"].insert_one(user)
    created_user = request.app.database["users"].find_one({"_id": new_user.inserted_id})

    return created_user


# Citation for the following code:
# Date of retrieval: 25/02/2023
# Title of the application: OAuth2 with Password (and hashing), Bearer with JWT tokens
# Type: Source code
# Author name: FastAPI
# Based on source URL: https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/

# Constant
ACCESS_TOKEN_EXPIRE_MINUTES = 720


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(user_collection, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/me/", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/cookie/set")
async def create_cookie(cookie_token: CookieToken, response: Response):
    access_token = cookie_token.token
    response.set_cookie(key="auth", value=access_token, secure=True, samesite="none", max_age=1000)
    return "OK"
