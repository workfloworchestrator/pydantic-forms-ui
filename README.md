# Pydantic forms example

This repository contains a working example of a [FastAPI][1] application with the pydantic forms frontend and backend modules working together.
It shows how you can use the [pydantic forms pypy module][2] on top of pydantic models to automatically generate forms on the frontend using the [pydantic forms npm module][3] that ask for user input. It also show validation and processing of the user input.

## Installation

This example application creates as FastApi application to serve as a backend for a react frontend.

### backend

To install using a virtual environment:

```
$ cd backend
$ python -m venv env
$ source env/bin/activate
$ pip install -r requirements.txt
$ fastapi dev main.py
```

Visit [http://127.0.0.1:8000/docs][4] to view the api documentation

### frontend

```
$ cd frontend
$ npm i
$ npm run dev
```

Visit [http://127.0.0.1:3000][5] to view the api documentation

## Publishing to npm

This repository is also used to publish the pydantic forms ui package to NPM.
<TODO: Publish instructions>

[1]: https://fastapi.tiangolo.com/
[2]: https://pypi.org/project/pydantic-forms
[3]: https://www.npmjs.com/package/pydantic-forms
[4]: http://127.0.0.1:8000/docs
[5]: http://127.0.0.1:3000
