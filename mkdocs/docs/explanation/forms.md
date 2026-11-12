# How forms are generated

A form is described once, in Python, and rendered by the frontend. The backend
owns the structure and validation, the frontend only draws what it is given.

## One page per yield

A form is a generator. Each `yield` produces one page, and what the user submits
is sent back into the generator as the result of that `yield`:

```python
def form_generator(state):
    first = yield FirstPage      # page 1
    second = yield SecondPage    # page 2, can use `first`
    return first.model_dump() | second.model_dump()
```

This keeps multi-page flows in plain Python: branching is an `if`, a loop is a
`for`.

## Replaying instead of storing

The backend keeps no session. On each request the frontend sends all pages
submitted so far, and `post_form` runs the generator again from the top,
feeding in those answers. The first page without an answer is returned as the
next schema. When the generator finishes, the form is done.

The backend side is described in [How it works].

Because of this, the generator has to be deterministic for the same input, and
side effects belong after the form, not inside it.

## From model to schema to component

```
Pydantic model -> JSON schema -> PydanticFormField -> matcher -> component
```

The backend turns the page class into a JSON schema. The frontend package
parses it into fields and, for each, picks a component with the first matching
entry in the component matchers. The defaults match on type and format, such as
`integer` or `string` with format `long`. Your own matchers go first, which is
how you add or replace a component without changing the package.

## Validation in two places

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

[How the layout grid works]: layout-grid.md

[How it works]: https://workfloworchestrator.org/pydantic-forms/how-it-works/
