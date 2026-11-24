# pydantic-forms-ui

Generate frontend forms from Pydantic models.

You describe a form in Python with Pydantic models: fields, types, validation
rules and layout. The backend serves it as JSON schema,
and the `pydantic-forms` React package renders it as a form and sends the
answers back. Validation runs in the browser and again on the backend.

It consists of two packages that work together:

- **`pydantic-forms`** ([PyPI]): the Python library that turns Pydantic models into
  form pages and handles multi-page flows. See the [backend docs][pydantic-forms docs].
- **`pydantic-forms`** ([npm]): the React package that renders the forms. It is
  not tied to a UI library or to Next.js, and you can replace any field with
  your own component.

This site documents the frontend package, how it works together with the
backend, and the demo apps in this repository. See the
[requirements](reference/requirements.md) to check what you need.

## Where to go

- [Tutorials](tutorials/index.md) take you through a first project step by step.
  Start here if you are new.
- [How-to guides](how-to/index.md) are recipes for specific problems.
- [Reference](reference/index.md) describes options, schema, API and
  [requirements](reference/requirements.md) in full.
- [Explanation](explanation/index.md) gives background on how things work and
  why.

[pydantic-forms docs]: https://workfloworchestrator.org/pydantic-forms/
[PyPI]: https://pypi.org/project/pydantic-forms/
[npm]: https://www.npmjs.com/package/pydantic-forms
