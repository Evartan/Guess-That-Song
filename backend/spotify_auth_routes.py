from fastapi import APIRouter

import os

from dotenv import load_dotenv

import base64
import random
import urllib.parse

from fastapi.responses import RedirectResponse
from requests import post

load_dotenv()

# Initialize FastAPI router
router = APIRouter()

# SPOTIFY
client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")

# Citation for the following code:
# Date of retrieval: 14/02/2023
# Title of the application: Spotify OAuth 2.0 framework -> Authorization Code Flow
# Type: Source code
# Author name: Spotify
# Based on source URL: https://developer.spotify.com/documentation/web-playback-sdk/guide/
#                      https://developer.spotify.com/documentation/general/guides/authorization/
#                      https://developer.spotify.com/documentation/general/guides/authorization/code-flow/
#                      https://github.com/spotify/spotify-web-playback-sdk-example

# Spotify Music Player (authentication)
self_URL = os.getenv("API_GW_URL")
redirect_uri = self_URL + "/auth/callback"


def generate_random_string(length):
    text = ""
    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for i in range(length):
        text += possible[int(random.random() * len(possible))]
    return text


@router.get("/login")
def auth_login():
    scope = "streaming user-read-email user-read-private user-library-read \
        user-library-modify user-read-playback-state user-modify-playback-state"
    state = generate_random_string(16)

    query_parameters = {
        "response_type": "code",
        "client_id": client_id,
        "scope": scope,
        "redirect_uri": redirect_uri,
        "state": state,
    }

    query_string = urllib.parse.urlencode(query_parameters)
    redirect_URL = "https://accounts.spotify.com/authorize/?" + query_string
    return RedirectResponse(redirect_URL)


@router.get("/callback")
def auth_callback(code):
    print("hello")
    auth_string = client_id + ":" + client_secret
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")
    auth_options = {
        "url": "https://accounts.spotify.com/api/token",
        "data": {
            "code": code,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code",
        },
        "headers": {
            "Authorization": "Basic " + auth_base64,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    }

    response = post(**auth_options)
    if response.status_code == 200:
        global access_token
        access_token = response.json()["access_token"]
        return RedirectResponse(os.getenv("FRONTEND_URL"))


@router.get("/token")
def auth_token():
    try:
        print(access_token)
        return {"access_token": access_token}
    except NameError:
        return {"access_token": ""}
