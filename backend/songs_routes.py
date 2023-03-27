from fastapi import APIRouter

from backend.lyrics import (
    get_lyrics,
    parse_lyrics,
    extract_random_word_from_lyrics,
    search_songs_by_word,
    parse_searched_songs,
)

import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import os
from dotenv import load_dotenv
from backend.random_search import get_random_search

load_dotenv()

# Constant
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")

# Citation for the following code:
# Date of retrieval: 21/02/2023
# Title of the application: spotipy SDK
# Type: Source code
# Author name: Spotify
# Based on source URL: https://github.com/spotipy-dev/spotipy#quick-start

# Initialize spotipy sdk object
sp = spotipy.Spotify(
    auth_manager=SpotifyClientCredentials(
        client_id=CLIENT_ID, client_secret=CLIENT_SECRET
    )
)

# Initialize FastAPI router
router = APIRouter()


# Get random song with help of helper function get_random_search
@router.get("/random-song")
def get_random_song():
    random_song_info = get_random_search()

    query = random_song_info["random_search"]

    random_offset = random_song_info["random_offset"]

    results = sp.search(q=query, type="track", offset=random_offset, limit=1)

    return results


# Get 10 recommend songs from top 100 billboard playlist
# top 100 billboard playlist spotify id : 6UeSakyzhiEt4NB3UAd6NQ
@router.get("/random-recommended-songs")
def get_random_recommended_songs_online():
    response = sp.playlist_items(
        "6UeSakyzhiEt4NB3UAd6NQ", limit=10, fields="items(track(name,id, artists))"
    )

    # Parse response
    recommend_songs = {}
    recommend_songs["results"] = []

    for track in response["items"]:
        track_id = track["track"]["id"]
        track_name = track["track"]["name"]
        track_artist = track["track"]["artists"][0]["name"]

        track_detail = {}
        track_detail["track_id"] = track_id
        track_detail["track_name"] = track_name
        track_detail["track_artist"] = track_artist

        recommend_songs["results"].append(track_detail)

    return recommend_songs


# Get lyrics with spotify track id
@router.get("/lyrics/")
def get_lyrics_online(id):
    lyrics = get_lyrics(id)

    # Handle no lyrics found
    if lyrics["error"] is True:
        return lyrics["message"]

    # Parse lyrics and return to client
    parsed_lyrics = parse_lyrics(lyrics)
    return parsed_lyrics


# Search songs by words
@router.get("/search-songs-by-words/")
def search_songs_by_word_online(word):
    songs = search_songs_by_word(word)
    parsed_songs = parse_searched_songs(songs)

    return parsed_songs


# Search artist by name and song by name
# This API returns one artist and song result that is closest to the provided artist and song name
# It means that they may returns something that does not match the correct artist or song name.
# Hence, it is better to check if provided artist,
# and song name is the same value (case-insensitive) with the one returned by this API.
@router.get("/search-artist-and-song-by-name/")
def search_artist_and_song_by_name(artist_name, song_name):
    query = f"track:{song_name} artist:{artist_name}"
    artist_and_song_name = sp.search(query, limit=1)

    response = {}

    try:
        response["result"] = {
            "artist_name": artist_and_song_name["tracks"]["items"][0]["album"][
                "artists"
            ][0]["name"],
            "thumbnail": artist_and_song_name["tracks"]["items"][0]["album"]["images"][
                0
            ]["url"],
            "album": artist_and_song_name["tracks"]["items"][0]["album"]["name"],
            "release_date": artist_and_song_name["tracks"]["items"][0]["album"][
                "release_date"
            ],
            "song_name": artist_and_song_name["tracks"]["items"][0]["name"],
            "song_id": artist_and_song_name["tracks"]["items"][0]["id"],
        }
    except IndexError:
        response["result"] = {}

    return response


@router.get("/extract-random-word-from-one-line-lyrics/")
def extract_random_word_from_one_line_lyrics(one_line_lyrics):
    random_word = extract_random_word_from_lyrics(one_line_lyrics)

    response = {"result": random_word}

    return response
