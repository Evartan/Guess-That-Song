import requests
import pprint
import random
import re
import string
import os

from dotenv import load_dotenv

load_dotenv()

# Citation for the following code:
# Date of retrieval: 14/02/2023
# Title of the application: spotify-lyrics-api
# Type: Source code
# Author name: akashrchandran
# Based on source URL: https://github.com/akashrchandran/spotify-lyrics-api

# Citation for the following code:
# Date of retrieval: 14/02/2023
# Title of the application: Genius API
# Type: Source code
# Author name: Genius
# Based on source URL: https://docs.genius.com/

# Constant
SPOTIFY_LYRICS_BASE_URL = "https://spotify-lyric-api.herokuapp.com/?trackid="
GENIUS_BASE_URL = "https://api.genius.com/search?q="
GENIUS_API_TOKEN = os.getenv("GENIUS_API_TOKEN")


# Get lyrics
def get_lyrics(spotify_track_id):
    response = requests.get(f"{SPOTIFY_LYRICS_BASE_URL}{spotify_track_id}")
    return response.json()


# Parse lyrics
def parse_lyrics(lyrics):
    line_by_line_lyrics = {}
    one_line_lyrics = ""

    for index, lyric in enumerate(lyrics["lines"]):
        line_by_line_lyrics[index] = lyric["words"]
        one_line_lyrics += " " + lyric["words"]

    output = {
        "line_by_line_lyrics": line_by_line_lyrics,
        "one_line_lyrics": one_line_lyrics,
    }
    return output


# Citation for the following code:
# Date of retrieval: 14/02/2023
# Title of the application: Extract words from random string
# Type: Source code
# Author name: Geeks for Geeks
# Based on source URL: https://www.geeksforgeeks.org/python-extract-words-from-given-string/


def extract_random_word_from_lyrics(one_line_lyrics):
    # Extract words ignoring punctuation with regex
    splitted_one_lyrics = re.sub(
        "[" + string.punctuation + "]", "", one_line_lyrics
    ).split()

    # Filter same characters
    splitted_one_lyrics_set = set(splitted_one_lyrics)
    splitted_one_lyrics_unique_word_only_list = list(splitted_one_lyrics_set)

    splitted_one_lyrics_unique_word_only_list_length = len(
        splitted_one_lyrics_unique_word_only_list
    )

    # Get a word that does not include any special characters
    # Regex above may not be exclude special characters that is other than string.punctuation,
    # where "\\good" would be included in the list.
    # only find a word again for 5 times instead of infinite time till correct word found,
    # to avoid any unexpected infinite loop.
    counter = 5
    while counter > 0:
        random_index = random.randint(
            0, splitted_one_lyrics_unique_word_only_list_length - 1
        )

        random_word = splitted_one_lyrics_unique_word_only_list[random_index]
        if random_word.isalpha():
            return random_word

        counter -= 1
        print(
            f"special char is included in this word, find another again. {counter} tries left."
        )

    # if no correct word found, just returns the first word by default
    return splitted_one_lyrics_unique_word_only_list[0]


def search_songs_by_word(word):
    headers = {"Authorization": f"Bearer {GENIUS_API_TOKEN}"}
    response = requests.get(f"{GENIUS_BASE_URL}{word}", headers=headers)
    return response.json()


def parse_searched_songs(songs):
    parsed_songs = []
    for song in songs["response"]["hits"]:
        # Skip non-song
        if song["type"] != "song":
            continue

        song_dict = {}
        song_dict["song_name"] = song["result"]["title"]
        song_dict["artist_name"] = song["result"]["artist_names"]
        parsed_songs.append(song_dict)

    output = {"results": parsed_songs}
    return output


if __name__ == "__main__":
    # lyrics = get_lyrics("7v8wKvNQQIxkugCFFjrkaO")  # Zankyou sanka by Aimer
    # parsed_lyrics = parse_lyrics(lyrics)
    # pprint.pprint(parsed_lyrics)

    # Test: Get lyrics by spotify ID
    # lyrics = get_lyrics("4VrWlk8IQxevMvERoX08iC")  # Chandelier by Sia
    # parsed_lyrics = parse_lyrics(lyrics)

    # Test: extract random word from lyrics
    # pprint.pprint(parsed_lyrics)
    # print(extract_random_word_from_lyrics("extracted random word:", parsed_lyrics["one_line_lyrics"]))

    # Test: Search songs by word
    songs = search_songs_by_word("night")
    parsed_songs = parse_searched_songs(songs)
    pprint.pprint(parsed_songs)
