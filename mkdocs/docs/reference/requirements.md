# Requirements

What the backend and the frontend need.

## Backend

The Python package [`pydantic-forms`][pydantic-forms on PyPI].

| Requirement | Version              |
| ----------- | -------------------- |
| Python      | 3.10 to 3.15         |
| Pydantic    | 2.9 or later         |

The package is not tied to a web framework. For FastAPI, install the `fastapi`
extra, which provides the exception handler
(`pydantic_forms.exception_handlers.fastapi.form_error_handler`):

```bash
pip install "pydantic-forms[fastapi]" structlog
```

`structlog` is imported by `pydantic-forms` but is not installed with it, so
add it yourself.

See the [installation guide][pydantic-forms installation] for the other extras.

## Frontend

The npm package [`pydantic-forms`][pydantic-forms on npm] works in any React
app. It does not depend on Next.js: the tutorial and the demo apps use Next.js,
but the package does not import `next`, so it works in a Vite app as well.
`next-intl` below is a React library despite its name, used for translations.

| Peer dependency      | Version              |
| -------------------- | -------------------- |
| `react`, `react-dom` | 18.2 or 19           |
| `react-hook-form`    | 7.77 or later 7.x    |
| `zod`                | 4.3 or later 4.x     |
| `@hookform/resolvers`| 5.2 or later 5.x     |
| `swr`                | 2.4 or later 2.x     |
| `next-intl`          | 4.14 or later 4.x    |

npm installs the peer dependencies for you, except that it picks Zod 3, which
does not fit. Name `zod@4` in the install command. Without it
`npm install pydantic-forms` fails with an `ERESOLVE` error:

```bash
npm install pydantic-forms zod@4
```

### An API provider is required

`PydanticForm` needs an `apiProvider` in its `config`. It is a function that
sends the request body to your backend and returns the response with its
status. You can use `fetch`, axios or any other client, see
[Creating your first form][first form].

## Demo apps

The apps in this repository need Node.js 24.9 or later to run the monorepo
tooling. The package itself sets no Node.js requirement.

[first form]: ../tutorials/create-first-form.md

[pydantic-forms on PyPI]: https://pypi.org/project/pydantic-forms/
[pydantic-forms on npm]: https://www.npmjs.com/package/pydantic-forms
[pydantic-forms installation]: https://workfloworchestrator.org/pydantic-forms/installation/
