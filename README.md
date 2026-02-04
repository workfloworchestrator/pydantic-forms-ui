# Pydantic Forms

This repository contains a working example of a [FastAPI][1] application with the pydantic forms frontend and backend modules working together.
It shows how you can use the [pydantic forms pypy module][2] on top of pydantic models to automatically generate forms on the frontend using the [pydantic forms npm module][3] to ask for user input. It also handles validation and processing of the user input from the backend whilst doing some simple validation pre-submit to get a nice user experience..

## What is Pydantic Forms?

Pydantic Forms is a library that automatically generates dynamic, type-safe web forms from Pydantic models. It eliminates the need to manually write form UI code by deriving form fields, validation rules, and UI components directly from your backend data models.

**Key Features:**
- **Automatic Form Generation**: Define your data model once in Python using Pydantic, and the frontend form is generated automatically
- **Full-Stack Type Safety**: Validation rules defined in Pydantic models are enforced on both backend and frontend
- **Multi-Page Forms**: Support for complex, multi-step forms using Python generator functions
- **Custom Components**: Extensible component system allows custom field types and UI components
- **Framework Agnostic**: Works with any React application (Next.js examples included)

## How It Works

1. **Backend**: Define your data models using Pydantic with validation rules and constraints
2. **Form Generator**: Use Python generator functions with `yield` to create multi-page form flows
3. **JSON Schema**: The backend generates JSON schemas from your Pydantic models
4. **Frontend**: The React component receives the schema and automatically renders appropriate form fields
5. **Validation**: User input is validated client-side (via JSON schema/Zod) and server-side (via Pydantic)
6. **Submission**: Form data is sent back to the backend for processing

```python
# Backend example
class UserForm(FormPage):
    name: str = Field(min_length=2, max_length=100)
    age: Annotated[int, Ge(18), Le(99)]
    email: str = Field(pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$')
```

The frontend automatically generates appropriate input fields (text input, number input with validation, email input) based on the Pydantic model definition.

## Installation

This example application creates as FastApi application to serve as a backend for a react frontend.

### Backend

To install using a virtual environment:

```bash
cd backend
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
pip install -r requirements.txt
fastapi dev main.py
```

Visit [http://127.0.0.1:8000/docs][4] to view the API documentation.

### Frontend

This is a pnpm workspace monorepo with multiple example applications:

```bash
cd frontend
pnpm install
pnpm dev  # Runs all example apps
```

**Example Applications:**
- **example**: Basic demo at [http://127.0.0.1:3000][5] using CSS modules
- **example-tailwind**: Tailwind CSS demo at http://127.0.0.1:3001 with shadcn/ui components

The `pydantic-forms` package is located in `frontend/packages/pydantic-forms/` and is automatically built on install.

## Contributing

When setting up this repo to contribute, initialize the pre-commit hooks using [pre-commit][6] (e.g., `brew install pre-commit`):

```bash
pre-commit install
```

Pre-commit hooks will run:
- **Black** formatting on Python files
- **TypeScript compilation**, **ESLint**, and **Prettier** on frontend files

## Publishing to NPM

This repository is also used to publish the `pydantic-forms` package to NPM:

```bash
cd frontend
pnpm packages:publish
```

This runs build, lint, and tests, then uses [changesets](https://github.com/changesets/changesets) to handle versioning and publishing.

[1]: https://fastapi.tiangolo.com/
[2]: https://pypi.org/project/pydantic-forms
[3]: https://www.npmjs.com/package/pydantic-forms
[4]: http://127.0.0.1:8000/docs
[5]: http://127.0.0.1:3000
[6]: https://pre-commit.com/#install
