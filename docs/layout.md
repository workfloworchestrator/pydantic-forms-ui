# Form layout

By default every form field takes the full width of the form, so fields are
stacked below each other. The layout configuration lets you place fields next
to each other on a **12-column grid**, set how many rows a field takes and
align fields vertically within their row.

The layout is set per field on the backend. It ends up as a `layout` object in
the field's JSON schema, and the `pydantic-forms` frontend package uses it to
place the field on a CSS grid.

```
| full_name (span=6)           | age (span=3) | birth_date (3) |
| comments (span=6, row_span=2)| contact (3)  | preference (3) |
|                              | subscribe (span=6)            |
```

## Quick start

```python
from typing import Annotated
from pydantic import Field
from pydantic_forms.core import FormPage
from pydantic_forms.validators import Layout


class ContactForm(FormPage):
    # Row 1: two fields of half the width
    first_name: Annotated[str, Layout(span=6)] = Field(title="First name")
    last_name: Annotated[str, Layout(span=6)] = Field(title="Last name")

    # Row 2: no Layout, takes the full width
    email: str = Field(title="Email")
```

`Layout` is part of the `pydantic-forms` Python package
(`pydantic_forms.validators.Layout`). Without it, the same result can be
reached by writing the `layout` object to the JSON schema yourself (see
[JSON schema format](#json-schema-format)).

## Options

| Python (`Layout`) | JSON schema (`layout`) | Type                                            | Default        | Description                                                                 |
| ----------------- | ---------------------- | ----------------------------------------------- | -------------- | --------------------------------------------------------------------------- |
| `span`            | `span`                 | `int`, 1-12                                     | 12 (full width) | Width of the field in columns.                                              |
| `start`           | `start`                | `int`, 1-12                                     | next free column | Column to start at. Leaves empty space before the field.                  |
| `new_row`         | `newRow`               | `bool`                                          | `False`        | Always start the field on a new row, even when the current row has space.   |
| `row_span`        | `rowSpan`              | `int`, >= 1                                     | 1              | Height of the field in rows. Following fields are placed next to it.        |
| `align`           | `align`                | `"start"`, `"center"`, `"end"`, `"stretch"`     | `"stretch"`    | Vertical position of the field within its row.                              |

`Layout` validates its options when the form class is defined: `span` and
`start` must be within 1-12, `start + span - 1` may not exceed 12 and
`row_span` must be at least 1. An invalid layout raises a `ValueError`.

`Layout()` without any options writes nothing to the schema and behaves the
same as no layout at all.

## How fields are placed

Fields are placed in the order they are defined on the model, from left to
right. When a field doesn't fit in the remaining columns of a row, it wraps to
the next row. This is the normal auto-placement of a CSS grid.

### Fields side by side: `span`

The spans of fields in one row should add up to 12 to fill the row:

```python
full_name: Annotated[str, Layout(span=6)]
age: Annotated[int, Layout(span=3)]
birth_date: Annotated[date, Layout(span=3)]
```

```
| full_name                    | age          | birth_date     |
```

Fields without a layout have a span of 12, so a field without a layout always
gets a row of its own.

### Leaving a gap: `start`

`start` places a field at a specific column. The columns before it stay empty:

```python
notice: Annotated[Optional[str], Layout(span=6, start=7)] = None
```

```
|                              | notice                        |
```

If the columns from `start` are already taken in the current row, the field
moves to the next row.

### Forcing a new row: `new_row`

A field is placed in the current row as long as it fits. Use `new_row=True` to
always start on a new row, for instance to start a new group of fields:

```python
street: Annotated[str, Layout(span=8)]
house_number: Annotated[str, Layout(span=4)]
# Would fit after a span=4 field, but should start a new row
city: Annotated[str, Layout(span=4, new_row=True)]
```

`new_row` is ignored when `start` is also set: `start` then decides the
column. Use `start=1` to get both a fixed column and a new row.

### Taller fields: `row_span`

`row_span` makes a field take up multiple rows. The fields that follow are
placed in the columns next to it:

```python
comments: Annotated[LongText, Layout(span=6, row_span=2)]
contact_method: Annotated[ContactMethods, Layout(span=3)]
preference: Annotated[SimpleChoices, Layout(span=3)]
subscribe: Annotated[bool, Layout(span=6)]
```

```
| comments                     | contact_method | preference   |
|                              | subscribe                     |
```

### Vertical alignment: `align`

Fields in the same row get the height of the tallest field in that row. When
one field has a description and its neighbour doesn't, their inputs don't line
up. Use `align="end"` to push the shorter field to the bottom of the row so
the inputs line up:

```python
name: Annotated[str, Layout(span=6)] = Field(description="Your full name")
age: Annotated[int, Layout(span=6, align="end")]
```

### Nested objects and lists

The grid is also used for the fields of nested models and for list items, so
`Layout` works the same inside a nested `BaseModel`. The 12 columns are the
width of the nested object, not of the whole form:

```python
class Address(BaseModel):
    street: Annotated[str, Layout(span=8)] = Field(title="Street")
    postal_code: Annotated[str, Layout(span=4)] = Field(title="Postal code")
    city: Annotated[str, Layout(span=6)] = Field(title="City")
    country: Annotated[str, Layout(span=6)] = Field(title="Country")
```

### Combining with other annotations

`Layout` is a regular `Annotated` metadata item, so it can be combined with
constraints, `Field(...)` and custom metadata such as `ExtraData`:

```python
age: Annotated[
    int, Ge(18), Le(99), MultipleOf(multiple_of=3), Layout(span=6, align="end")
]
age_notice: Annotated[
    Optional[str], _age_notice, Layout(span=4, new_row=True)
] = None
```

## JSON schema format

`Layout` writes a `layout` object into the field's schema through
`json_schema_extra`. Option names are camelCase and unset options are left out:

```json
{
  "title": "Comments",
  "type": "string",
  "format": "long",
  "layout": { "span": 6, "rowSpan": 2 }
}
```

Without `Layout`, the same result can be reached directly with
`json_schema_extra`:

```python
comments: LongText = Field(
    title="Comments", json_schema_extra={"layout": {"span": 6, "rowSpan": 2}}
)
```

The frontend reads this object into `PydanticFormField.layout`
(type `PydanticFormFieldLayout`). Values outside the grid are clamped to
1-12 on the frontend; there is no further validation on that side.

## Frontend

No configuration is needed in the `PydanticForm` component: every form is
rendered on the grid. Forms without any `layout` render as before, because all
fields take the full width.

### Input width

For fields with a layout, the built-in `TextField`, `IntegerField`,
`DropdownField` and `TextAreaField` take the full width of their grid cell, so
they grow and shrink with `span`. Fields without a layout keep the browser's
default input width.

Custom field components can get the same behaviour with
`getLayoutFieldWidthStyle`:

```tsx
import { getLayoutFieldWidthStyle } from 'pydantic-forms';

export const MyField = ({ pydanticFormField, value, onChange }) => (
    <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={getLayoutFieldWidthStyle(pydanticFormField)}
    />
);
```

### Styling and responsive layouts

The grid has inline styles, but also CSS classes so apps can override it:

| Class              | Element                                              |
| ------------------ | ---------------------------------------------------- |
| `pf-grid`          | The grid container (one per form and nested object)  |
| `pf-col-span-{n}`  | The cell of each field, `n` is the effective span    |

The grid itself has no breakpoints. To stack the fields on small screens, add
something like this to the global CSS of your app (as done in both example
apps). `!important` is needed to override the inline styles:

```css
@media (max-width: 640px) {
    .pf-grid > * {
        grid-column: 1 / -1 !important;
        grid-row: auto !important;
    }
}
```

The class names can also be used for other tweaks, for example to keep only
the narrow fields side by side on medium screens:

```css
@media (max-width: 1024px) {
    .pf-grid > :is(.pf-col-span-6, .pf-col-span-8) {
        grid-column: 1 / -1 !important;
    }
}
```

### Helper functions

The helpers that map a layout to CSS are exported from `pydantic-forms`, for
use in custom renderers:

- `GRID_COLUMNS`: the number of columns (12).
- `getLayoutColumns(layout)`: returns the clamped `{ start, span }`.
- `getLayoutStyle(layout)`: returns the `gridColumn`, `gridRow` and `alignSelf`
  styles for a field's cell.
- `getLayoutFieldWidthStyle(pydanticFormField)`: makes an input fill its cell
  when the field has a layout.

## Examples

The demo forms in [`backend/main.py`](../backend/main.py) use the layout:

- `/form-simple`: all options, including `row_span`, `new_row` and `start`.
- `/form-full`: layout in a nested object (`Address`).
- `/form`: two fields on one row on the first page, and layout in nested
  models (`Person`, `Education`), also as list items (`TestPersonList`).
