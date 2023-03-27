# Citation for the following code:
# Date of retrieval: 21/02/2023
# Title: Getting random tracks using the Spotify API.
# Type: Medium article
# Author name: Perry Janssen
# Based on source URL: https://perryjanssen.medium.com/getting-random-tracks-using-the-spotify-api-61889b0c0c27

import random


def get_random_search():
    random_search_data = {}

    # list of chars to choose from
    characters = "abcdefghijklmnopqrstuvwxyz"

    # Get a random character from the char string
    random_char = random.choice(characters)
    random_search = ""
    random_int = random.randint(0, 1)

    if random_int == 0:
        random_search = random_char + "%"
    else:
        random_search = "%" + random_char + "%"

    random_offset = random.randint(0, 1000)
    random_search_data["random_search"] = random_search
    random_search_data["random_offset"] = random_offset

    return random_search_data
