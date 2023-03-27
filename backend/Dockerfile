# Citation for the following code:
# Date of retrieval: 30/01/2023
# Title of the application: docker deployment
# Type: Source code
# Author name: fastapi
# Based on source URL: https://fastapi.tiangolo.com/deployment/docker/

# Belows is the step that Docker would take to setup envinronment, build a container image
FROM python:3.9.13

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . /code/backend

ENV PYTHONPATH /code/backend

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
