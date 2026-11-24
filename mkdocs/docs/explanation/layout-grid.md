# How the layout grid works

By default every form field takes the full width of the form, so fields are
stacked below each other. The layout configuration lets you place fields next to
each other on a **12-column grid**, set how many rows a field takes and align
fields vertically within their row.

```
| full_name (span=6)           | age (span=3) | birth_date (3) |
| comments (span=6, row_span=2)| contact (3)  | preference (3) |
|                              | subscribe (span=6)            |
```

## From Python to CSS

The layout is decided on the backend, per field. It ends up as a `layout` object
in the field's JSON schema, and the `pydantic-forms` frontend package uses it to
place the field on a CSS grid. The backend owns the structure of the form, so
the same schema works for any frontend that understands the `layout` object.

## Placement

Fields are placed in the order they are defined on the model, from left to
right. When a field doesn't fit in the remaining columns of a row, it wraps to
the next row. This is the normal auto-placement of a CSS grid. That is also why
a field without a layout, with a span of 12, always gets a row of its own.

Explicit options override auto-placement: `start` pins a column, `new_row`
forces a break and `row_span` makes later fields flow around a tall field.

## Why the grid is nested

The grid is also used for the fields of nested models and list items. Each
nested object has its own 12 columns, so a nested model can be laid out without
knowing where it will be placed in the parent form.

## Why there are no breakpoints

The layout describes the form's intent in a device-independent way. How it
adapts to screen sizes is a presentation concern, so the grid ships CSS classes
(`pf-grid`, `pf-col-span-{n}`) and leaves breakpoints to the app. See
[Make the layout responsive](../how-to/layout.md#make-the-layout-responsive).

## Why validation happens on the backend

`Layout` validates its options when the form class is defined, so mistakes are
found at startup rather than by a user. The frontend only clamps values to the
grid and does no further validation.
