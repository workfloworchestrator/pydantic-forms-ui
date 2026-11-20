# Layout

Complete description of the layout configuration, from the Python `Layout` class to the frontend.

## Layout options

`Layout` is part of the `pydantic-forms` Python package
(`pydantic_forms.validators.Layout`). It is used as `Annotated` metadata.

| Python (`Layout`) | JSON schema (`layout`) | Type                                        | Default          | Description                                                               |
| ----------------- | ---------------------- | ------------------------------------------- | ---------------- | ------------------------------------------------------------------------- |
| `span`            | `span`                 | `int`, 1-12                                 | 12 (full width)  | Width of the field in columns.                                            |
| `start`           | `start`                | `int`, 1-12                                 | next free column | Column to start at. Leaves empty space before the field.                  |
| `new_row`         | `newRow`               | `bool`                                      | `False`          | Always start the field on a new row, even when the current row has space. |
| `row_span`        | `rowSpan`              | `int`, >= 1                                 | 1                | Height of the field in rows. Following fields are placed next to it.      |
| `align`           | `align`                | `"start"`, `"center"`, `"end"`, `"stretch"` | `"stretch"`      | Vertical position of the field within its row.                            |

### Behaviour notes

- `Layout()` without any options writes nothing to the schema and behaves the
  same as no layout.
- `new_row` is ignored when `start` is also set.
- A field without a layout has a span of 12.

## Layout JSON schema

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

The keys are listed in [Layout options](#layout-options).

Without `Layout`, the same result can be reached directly with
`json_schema_extra`:

```python
comments: LongText = Field(
    title="Comments", json_schema_extra={"layout": {"span": 6, "rowSpan": 2}}
)
```

The frontend reads this object into `PydanticFormField.layout` (type
`PydanticFormFieldLayout`). Values outside the grid are clamped to 1-12 on the
frontend; there is no further validation on that side.

## Layout frontend API

No configuration is needed in the `PydanticForm` component: every form is
rendered on the grid. Forms without any `layout` render as before.

### CSS classes

| Class             | Element                                             |
| ----------------- | --------------------------------------------------- |
| `pf-grid`         | The grid container (one per form and nested object) |
| `pf-col-span-{n}` | The cell of each field, `n` is the effective span   |

The grid also has inline styles. Overriding them requires `!important`.

### Helper functions

Exported from `pydantic-forms`, for use in custom renderers:

- `GRID_COLUMNS`: the number of columns (12).
- `getLayoutColumns(layout)`: returns the clamped `{ start, span }`.
- `getLayoutStyle(layout)`: returns the `gridColumn`, `gridRow` and `alignSelf`
  styles for a field's cell.
- `getLayoutFieldWidthStyle(pydanticFormField)`: makes an input fill its cell
  when the field has a layout.

### Built-in components

`TextField`, `IntegerField`, `DropdownField` and `TextAreaField` take the full
width of their grid cell when the field has a layout.

### Types

- `PydanticFormField.layout`: of type `PydanticFormFieldLayout`.

## Demo forms

The demo forms in
[`backend/main.py`](https://github.com/workfloworchestrator/pydantic-forms-ui/blob/main/backend/main.py)
use the layout:

| Endpoint             | Shows                                                                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `/form-simple-layout`| All options, including `row_span`, `new_row` and `start`.                                                                                   |
| `/form-full`         | Numbers side by side on the first page, date and time fields and optional fields in two columns, and layout in a nested object (`Address`). |
| `/form-simple`       | No layout, every field takes the full width.                                                                                                |
| `/form`              | Two fields on one row on the first page, and layout in nested models (`Person`, `Education`), also as list items (`TestPersonList`).        |
