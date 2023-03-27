# Citation for the following code:
# Date of retrieval: 14/02/2023
# Title of the application: pymongo tutorial
# Type: Source code
# Author name: MongoDB
# Based on source URL: https://www.mongodb.com/languages/python/pymongo-tutorial


# Database crud routes
from fastapi import APIRouter, Body, Request, Response, HTTPException, status, Depends
from fastapi.encoders import jsonable_encoder
from typing import List
from fastapi.security import OAuth2PasswordBearer

from backend.models import Session, SessionUpdate

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


router = APIRouter()


# Create new game session
@router.post(
    "/",
    response_description="Create a new game session",
    status_code=status.HTTP_201_CREATED,
    response_model=Session,
)
def create_session(request: Request, session: Session = Body(...)):
    print(session)
    session = jsonable_encoder(session)
    new_session = request.app.database["sessions"].insert_one(session)
    created_session = request.app.database["sessions"].find_one(
        {"_id": new_session.inserted_id}
    )

    return created_session


# Update a game session
@router.put(
    "/{id}", response_description="Update a game session", response_model=SessionUpdate
)
def update_session(id: str, request: Request, session: SessionUpdate = Body(...)):
    session = {k: v for k, v in session.dict().items() if v is not None}
    if len(session) >= 1:
        update_result = request.app.database["sessions"].update_one(
            {"_id": id}, {"$set": session}
        )

        if update_result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Game session with ID {id} not found",
            )

    if (
        existing_session := request.app.database["sessions"].find_one({"_id": id})
    ) is not None:
        return existing_session

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Game session with ID {id} not found",
    )


# Get all game session
@router.get(
    "/", response_description="List all game sessions", response_model=List[Session]
)
def list_sessions(request: Request, token: str = Depends(oauth2_scheme)):
    sessions = list(request.app.database["sessions"].find(limit=100))
    return sessions


# Get all user's sessions
@router.get(
    "/user/{user_id}",
    response_description="List all user game sessions",
    response_model=List[Session],
)
def list_user_sessions(
    user_id: str, request: Request, token: str = Depends(oauth2_scheme)
):
    sessions = list(request.app.database["sessions"].find({"user_id": user_id}))
    return sessions


# Get a game session by id
@router.get(
    "/{id}", response_description="Get a game session by id", response_model=Session
)
def find_session(id: str, request: Request):
    if (book := request.app.database["sessions"].find_one({"_id": id})) is not None:
        return book
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Game session with ID {id} not found",
    )


# Delete a game session
@router.delete("/{id}", response_description="Delete a game session")
def delete_session(id: str, request: Request, response: Response):
    delete_result = request.app.database["sessions"].delete_one({"_id": id})

    if delete_result.deleted_count == 1:
        response.status_code = status.HTTP_204_NO_CONTENT
        return response

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Game session with ID {id} not found",
    )
