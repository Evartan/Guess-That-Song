import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from pymongo import MongoClient

from backend.session_routes import router as session_router
from backend.songs_routes import router as songs_router
from backend.spotify_auth_routes import router as spotify_auth_router
from backend.user_auth_routes import router as user_auth_router

load_dotenv()
app = FastAPI()

# adding auth to the following origins to circumvent CORS restrictions

origins = [
    os.getenv("FRONTEND_URL"),
    "https://accounts.spotify.com",
    "https://spotify.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def landing():
    return "HI!"


# Citation for the following code:
# Date of retrieval: 14/02/2023
# Title of the application: pymongo-tutorial
# Type: Source code
# Author name: mongodb
# Based on source URL: https://www.mongodb.com/languages/python/pymongo-tutorial


# Connect to the Atlas cluster when the application start
@app.on_event("startup")
def startup_db_client():
    app.mongodb_client = MongoClient(os.getenv("CONNECTION_STRING"))
    app.database = app.mongodb_client[os.getenv("DB_NAME")]
    print("Connected to the MongoDB database!")


# Close connection to the Atlas cluster when the application stops
@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()


# Include router
app.include_router(session_router, tags=["sessions"], prefix="/sessions")
app.include_router(songs_router, tags=["songs"], prefix="/songs")
app.include_router(spotify_auth_router, tags=["auth"], prefix="/auth")
app.include_router(user_auth_router, tags=["user"])
