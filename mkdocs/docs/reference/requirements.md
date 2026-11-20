# Requirements

What the backend and the frontend need.

## Backend

The Python package [`pydantic-forms`][pydantic-forms on PyPI] turns Pydantic
models into form pages. See the [installation guide][pydantic-forms
installation] for the supported Python and Pydantic versions and the extras,
such as the FastAPI exception handler.

## Frontend

The npm package [`pydantic-forms`][pydantic-forms on npm] works in any React
app. It does not depend on Next.js: the tutorial and the demo apps use Next.js,
but the package does not import `next`, so it works in a Vite app as well.

The package needs [React][react] and [React Hook Form][react hook form]: it
renders React components, and the field components receive their props from
React Hook Form. It also expects `@hookform/resolvers`, `swr` and `next-intl`
(a React library despite its name, used for translations). The supported
versions of these packages and of React are listed in
[`package.json`][pydantic-forms package.json]. npm installs them for you.

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
[pydantic-forms package.json]: https://github.com/workfloworchestrator/pydantic-forms-ui/blob/main/frontend/packages/pydantic-forms/package.json
[react]: https://react.dev/
[react hook form]: https://react-hook-form.com/
