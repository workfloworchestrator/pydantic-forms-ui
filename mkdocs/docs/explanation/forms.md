# How forms are rendered

A form is described once, in Python, and rendered by the frontend. The backend
owns the structure and validation, the frontend only draws what it is given.

The backend side, how a generator produces one page per `yield` and how a form
stays stateless, is described in [How it works]. This page follows the form
from the JSON schema the backend sends to the components on the screen.

## From schema to fields

```
JSON schema -> field tree -> PydanticFormField -> matcher -> component
```

The package turns the page class into a JSON schema on the backend, and
parses that schema into a tree of fields in the browser. Every field gets a
type, a format and, if it has them, options, constraints and custom metadata.

## From field to component

For each field, the package picks a component with the first matching entry in
its component matchers. The defaults match on type and format, such as
`integer` or `string` with format `long`. Your own matchers go first, which is
how you add or replace a component without changing the package. See
[Custom fields][custom fields] for the matcher API.

A field is placed in a row, the row in a grid and the fields in a form that
handles the state. To change the markup around a field, or the grid, the
package accepts your own row, header, footer and form renderers.

## Where validation runs

Constraints in the schema are checked in the browser through Zod, so users get
quick feedback. The same Pydantic model validates again on the backend, which
is also where rules that need Python (`Predicate`) run. The browser check is a
convenience, the backend check is the one that counts.

## Why `format` and `json_schema_extra`

JSON schema only knows basic types. To say "this string is a notice" or "this
string is a color", the backend sets a `format` and any extra keys with
`json_schema_extra`. This is a convention between your backend and your
frontend, so any frontend that understands the keys can render the same form.
For how fields are placed, see [How the layout grid works].

[How it works]: https://workfloworchestrator.org/pydantic-forms/how-it-works/
[How the layout grid works]: layout-grid.md
[Custom fields]: ../how-to/custom-fields.md
