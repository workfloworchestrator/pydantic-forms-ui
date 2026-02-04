# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This repository demonstrates how to use the pydantic-forms library to automatically generate frontend forms from Pydantic models. It consists of:
- A FastAPI backend that defines Pydantic models with validation rules
- A React frontend (Next.js) that dynamically renders forms based on JSON schemas
- A publishable npm package (`pydantic-forms`) that provides the form generation logic

## Repository Structure

### Monorepo Layout
This is a pnpm workspace monorepo with the following structure:

```
├── backend/                      # FastAPI application
│   ├── main.py                   # Main API with form endpoints
│   ├── demo.py                   # Additional demo forms
│   └── tests/                    # Backend tests
├── frontend/                     # Frontend monorepo (pnpm workspace)
│   ├── packages/
│   │   └── pydantic-forms/       # NPM package for form generation
│   │       ├── src/
│   │       │   ├── components/   # Form field components
│   │       │   ├── core/         # Core form logic (hooks, handlers)
│   │       │   ├── PydanticForm.tsx  # Main form component
│   │       │   └── types.ts      # TypeScript definitions
│   └── apps/
│       ├── example/              # Basic Next.js demo app
│       └── example-tailwind/     # Tailwind-based demo app
```

### Key Architecture Points

**Backend (FastAPI + pydantic-forms Python package)**:
- Uses generator functions with `yield` to define multi-page forms
- Each `yield` statement creates a form page with validation
- Form pages extend `FormPage` (has next) or `SubmitFormPage` (final page)
- Validation happens on both frontend (via JSON schema) and backend (via Pydantic)
- Custom validators can be added using `Annotated` types with `Predicate`

**Frontend (React + pydantic-forms npm package)**:
- `PydanticForm` is the main entry point component
- Takes an `apiProvider` that communicates with the backend
- Dynamically generates form fields based on JSON schema from backend
- Uses React Hook Form for form state management
- Component matching system allows custom field components via `componentMatcherExtender`
- Supports custom translations, label providers, and custom data providers

**Form Generation Flow**:
1. Frontend calls backend API with current form data
2. Backend generator yields next form page schema
3. Frontend renders form fields based on schema
4. User fills form, validation happens client-side
5. On submit, data sent back to backend for next page or final processing

## Development Commands

### Backend

**Python Virtual Environment**:

The backend uses a Python virtual environment located at `backend/venv/` (excluded from git via .gitignore).

**Initial setup**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Activate the venv** (required before running any backend commands):
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

**Verify venv is active**:
```bash
which python  # Should show: /Users/.../backend/venv/bin/python
python --version  # Check Python version
pip list  # List installed packages
```

**Deactivate the venv** (when you're done):
```bash
deactivate
```

**IMPORTANT**: Always ensure the venv is activated before:
- Running the FastAPI development server
- Installing packages with pip
- Running tests
- Using any Python commands related to this project

**Run development server**:
```bash
cd backend
fastapi dev main.py
```
Backend runs at http://127.0.0.1:8000
API docs available at http://127.0.0.1:8000/docs

**Run tests** (ensure venv is activated):
```bash
cd backend
source venv/bin/activate  # Activate venv first
pytest  # Run all tests
pytest tests/unit_tests/test_example_form.py -v  # Run specific test file
pytest -k "test_form_complete" -v  # Run specific test by name
```

**Code formatting**:
```bash
# Backend uses black (configured in pre-commit)
# Ensure venv is activated first
black backend/
```

### Frontend

**Setup**:
```bash
cd frontend
pnpm install
```

**Run all apps in development**:
```bash
cd frontend
pnpm dev
```

**Run specific app**:
```bash
cd frontend/apps/example
pnpm dev  # Runs on http://127.0.0.1:3000
```

```bash
cd frontend/apps/example-tailwind
pnpm dev  # Runs on http://127.0.0.1:3001
```

**Build all packages and apps**:
```bash
cd frontend
pnpm build
```

**Lint and type check**:
```bash
cd frontend
pnpm lint      # ESLint
pnpm tsc       # TypeScript type checking
pnpm prettier  # Check formatting
```

**Run tests**:
```bash
cd frontend
pnpm test
```

**Clean**:
```bash
cd frontend
pnpm clean  # Removes node_modules and build artifacts
```

### Working with the pydantic-forms Package

**Build the package after changes**:
```bash
cd frontend/packages/pydantic-forms
pnpm build
```

**Watch mode during development**:
```bash
cd frontend/packages/pydantic-forms
pnpm dev
```

Note: The monorepo automatically builds packages on `pnpm install` via the `postinstall` hook.

## Pre-commit Hooks

This repository uses pre-commit hooks:

**Setup**:
```bash
brew install pre-commit  # or pip install pre-commit
pre-commit install
```

**What runs on commit**:
- Backend: Black formatting on Python files
- Frontend: TypeScript compilation, linting, and Prettier formatting (via `frontend/pre-commit.sh`)

## Publishing to NPM

The `pydantic-forms` package is published to NPM. To publish:

```bash
cd frontend
pnpm packages:publish
```

This runs build, lint, and tests, then uses changesets to handle versioning and publishing.

## Key Technologies

- **Backend**: FastAPI, Pydantic, pydantic-forms (PyPI package)
- **Frontend Package Manager**: pnpm with workspaces
- **Frontend Build Tool**: Turbo (turborepo)
- **Frontend Framework**: Next.js 14-16, React 18-19
- **Form Management**: React Hook Form, Zod validation
- **Styling**:
  - `example` app: CSS modules
  - `example-tailwind` app: Tailwind CSS 4 + shadcn/ui components
- **Package Building**: tsup for the pydantic-forms package

## Port Configuration

- Backend API: 8000
- example app: 3000
- example-tailwind app: 3001
