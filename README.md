# Pydantic Forms

Generate frontend forms from Pydantic models.

This repository holds a working example of a [FastAPI][fastapi] backend and a
React frontend that work together. It also holds the source of the
[`pydantic-forms` npm package][npm], which renders forms in React.

You describe a form in Python with Pydantic models, on top of the
[`pydantic-forms` Python package][pypi]. The backend serves it as JSON schema,
and the npm package renders it as a form and sends the answers back. Validation
runs in the browser for a quick response and again on the backend.

## What is Pydantic Forms?

Pydantic Forms derives form fields, validation rules and layout from your
backend data models, so you do not write form UI code by hand.

- **Automatic form generation**: define the model once in Python and the form is generated.
- **Full-stack validation**: rules from the Pydantic model are enforced on the backend and in the browser.
- **Multi-page forms**: build multi-step forms with Python generator functions.
- **Custom components**: replace any field with your own component.
- **Framework agnostic**: works in any React app, the examples use Next.js.

## How it works

1. **Backend**: define a Pydantic model with validation rules and constraints.
2. **Form generator**: use a Python generator function with `yield` to create a form flow. Each `yield` is a form page.
3. **JSON schema**: the backend generates a JSON schema from the model.
4. **Frontend**: the React component receives the schema and renders the fields.
5. **Validation**: input is validated in the browser (JSON schema and Zod) and on the backend (Pydantic).
6. **Submission**: the form data is sent to the backend, which returns the next page or the result.

```python
class UserForm(FormPage):
    name: str = Field(min_length=2, max_length=100)
    age: Annotated[int, Ge(18), Le(99)]
    email: str = Field(pattern=r"^[\w\.-]+@[\w\.-]+\.\w+$")
```

The frontend renders a text input, a number input and an email input with the
same limits.

## Documentation

The [documentation][docs] has a tutorial, how-to guides, reference and
explanation:

- [Creating your first form][first form] builds a working form from scratch.
- [Requirements][requirements] lists the versions the backend and the frontend need.
- The [backend documentation][pydantic-forms docs] covers the Python package.

The package README on [npm][npm] shows how to install and use the package.

## Run the examples

The backend is a FastAPI application and the frontend is an npm workspace with
two example apps.

### Backend

```bash
cd backend
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
pip install -r requirements.txt
fastapi dev main.py
```

The API documentation is at <http://127.0.0.1:8000/docs>.

### Frontend

The monorepo tooling needs Node.js 24.9 or later.

```bash
cd frontend
npm install
npm run dev  # Runs all example apps
```

- **example**: basic demo at <http://127.0.0.1:3000> with CSS modules.
- **example-tailwind**: demo at <http://127.0.0.1:3001> with Tailwind CSS and shadcn/ui components.

The `pydantic-forms` package lives in `frontend/packages/pydantic-forms/` and is
built on install.

## Contributing

Set up the pre-commit hooks with [pre-commit][pre-commit], for example
`brew install pre-commit`:

```bash
pre-commit install
```

On commit the hooks run:

- **Black** on Python files.
- **TypeScript compilation**, **ESLint** and **Prettier** on frontend files.

### Pull requests

Open PRs as **draft** and click *Ready for review* once CI passes. That triggers one Greptile review.

- To request another review, add the `greptile-review` label. The number of reviews per PR is limited; admins can exceed it.
- PRs from authors without write access are not reviewed automatically; a maintainer adds `greptile-review`.
- Admins can add `greptile-review-trex` for an in-depth review.

## Publishing to NPM

The `pydantic-forms` package is published with [changesets][changesets]. The
`publish-to-npm` GitHub Action in `.github/workflows` does the publishing.

### Snapshot release

You can also publish an experimental [snapshot][snapshot] release to test a
branch. In GitHub go to Actions, Publish to NPM, Run workflow. Pick your branch
in the "Use workflow from" dropdown.

This publishes the package under the `snapshot` tag with a version like
`0.0.0-20261020090905`, which you can then install.

[docs]: mkdocs/docs/index.md
[first form]: mkdocs/docs/tutorials/create-first-form.md
[requirements]: mkdocs/docs/reference/requirements.md

[fastapi]: https://fastapi.tiangolo.com/
[pypi]: https://pypi.org/project/pydantic-forms
[npm]: https://www.npmjs.com/package/pydantic-forms
[pydantic-forms docs]: https://workfloworchestrator.org/pydantic-forms/
[pre-commit]: https://pre-commit.com/#install
[changesets]: https://github.com/changesets/changesets
[snapshot]: https://changesets.dev/guide/snapshot-releases
