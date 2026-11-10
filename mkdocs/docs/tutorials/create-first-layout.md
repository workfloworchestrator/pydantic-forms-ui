# Creating your first layout

In this tutorial you will build a small contact form and place its fields on a
grid, so that two fields share a row. You will need the backend of this
repository running (see the repository README).

## 1. Start with a plain form

By default every field takes the full width, so fields are stacked:

```python
from pydantic import Field
from pydantic_forms.core import FormPage


class ContactForm(FormPage):
    first_name: str = Field(title="First name")
    last_name: str = Field(title="Last name")
    email: str = Field(title="Email")
```

Open the form in the frontend. You see three fields below each other.

## 2. Put two fields on one row

Import `Layout` and annotate the first two fields with `span=6`. The grid has
12 columns, so two fields of 6 columns fill a row:

```python
from typing import Annotated
from pydantic import Field
from pydantic_forms.core import FormPage
from pydantic_forms.validators import Layout


class ContactForm(FormPage):
    first_name: Annotated[str, Layout(span=6)] = Field(title="First name")
    last_name: Annotated[str, Layout(span=6)] = Field(title="Last name")
    email: str = Field(title="Email")
```

Reload the form. First name and last name now sit side by side, and email still
takes a row of its own, because a field without `Layout` spans all 12 columns.

## 3. Make a field taller

Add a long text field next to two smaller fields using `row_span`:

```python
comments: Annotated[LongText, Layout(span=6, row_span=2)]
contact_method: Annotated[ContactMethods, Layout(span=3)]
preference: Annotated[SimpleChoices, Layout(span=3)]
subscribe: Annotated[bool, Layout(span=6)]
```

Reload. The comments field is two rows high, and the fields that follow are
placed in the columns next to it.

## What you did

You placed fields on a 12-column grid with `span` and `row_span`, without
changing the frontend.

## Next steps

- Solve specific problems: [How-to guides](../how-to/layout.md).
- Look up every option: [Layout options](../reference/layout.md).
- Understand the model behind it: [How the layout grid works](../explanation/layout-grid.md).
- See complete forms in the demo
  [`backend/main.py`](https://github.com/workfloworchestrator/pydantic-forms-ui/blob/main/backend/main.py).
