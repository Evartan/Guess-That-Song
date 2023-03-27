# How to develop

Strongly suggest to use docker for development.
Please see [Develop in docker](#develop-in-docker)

## Virtual environment

Suggest to create one.
<https://code.visualstudio.com/docs/python/environments#_create-a-virtual-environment-in-the-terminal>
`source .venv/bin/activate`

## Dependencies

Could be found in `requirements.txt`.
To install: `pip install -r requirements.txt`

If you install new dependencies for the project,
please do not forget to `pip freeze > requirements.txt` in `backend` directory.

## Spotify Token .env

You need a Premium Spotify account for development

1. Create App in Spotify: <https://developer.spotify.com/documentation/general/guides/authorization/app-settings/>
2. Follow instructions to get Client ID & Client Secret
3. Create `.env` in `backend` directory
4. Write `CLIENT_ID` & Set equal to given Client ID
5. Write `CLIENT_SECRET` & Set equal to given Client Secret
6. Add your developer dashboard, at edit settings interface, add `http://localhost:8000/auth/callback` as your Redirect URIs.

## Python FastAPI backend

<https://fastapi.tiangolo.com/tutorial/first-steps/>
To start locally: `uvicorn main:app --host 0.0.0.0 --port 8000 --reload`

## Spotify API

Append `/ACDC` to your URL to display top 10 songs of ACDC

## MongoDB Atlas

### How to populate data into database

You may use scripts in `<root_directory>/backend/database` to create new database and populate dummy items to db for testing.
Please note that, MongoDB doesn’t create a database until you have collections and documents in it.  
So, please create collection first with the MongoDB client created in `pymongo_get_database.py`.

Before that, you need to setup credential as followings.  

1. Create `.env` file in `<root_directory>/backend/`
2. Enter credential as followings.  

```text
CONNECTION_STRING="mongodb+srv://<username>:<password>@cluster0.rtdjfuu.mongodb.net/?retryWrites=true&w=majority"
```

3. Change the `username` and `password` in the connection string
4. Go to MongoDB dashboard, <https://cloud.mongodb.com/v2>
5. Navigate to Network Access tab
6. Add your IP Address
  
### How to test CRUD database with API endpoints in `routes.py`  

1. Create `.env` file in `<root_directory>/backend/`  
2. Enter credential as followings.  

```text
CONNECTION_STRING="mongodb+srv://<username>:<password>@cluster0.rtdjfuu.mongodb.net/?retryWrites=true&w=majority"
DB_NAME=YOUR_DB_NAME
```

3. Change the `username` and `password` in the connection string
4. Go to MongoDB dashboard, <https://cloud.mongodb.com/v2>
5. Navigate to Network Access tab
6. Add your IP Address
7 Assumming using docker, fire up your FastAPI server locally
8. Navigate `localhost:80/docs`
9. Click `Try it out` button to show the `execute` button to call the CRUD API

### References

How to get `connection-string`  
<https://www.mongodb.com/docs/guides/atlas/connection-string/>  

## Develop in Docker

### Prerequisite

Docker Desktop

### Usage

In `backend` root directory, execute

```Shell
docker-compose up --build
```

Once you execute the command above for once to build an image and start a container,  
the next time you just have to execute below command to re-run the container

```Shell
docker-compose up
```

When you edit file in `backend` directory,
Docker container will be restarted automatically,
and you may see you direct changes.

## Formatter

`black` is used.
To format python file,

```Shell
black <python_file_name.py>
```

## Helper function

To use `get_songs_by_word(word)` in `lyrics.py`, please add token in `.env` with environment variable name as `GENIUS_API_TOKEN`

## Authentication

Below explains how to test authentication

1. In `<rootDirectory>/backend` directory, add `DUMMY_PASSWORD` and `SECRET_KEY` and `ALGORITHM` secrets for validation of JWT token and hashed password.
2. Navigate to `<yourLocalHostAddress>/docs` on your browser.
3. Create a new account calling `/register` API
4. Login the new created account clicking the `Authorize` button on the most top right in that openAPI docs UI.
5. After successful login, the openAPI docs would automatically add the JWT token whenever calling any APIs in that docs UI.
6. For example, you may try calling `/user/me/` API endpoint to get current logged in account profile.
