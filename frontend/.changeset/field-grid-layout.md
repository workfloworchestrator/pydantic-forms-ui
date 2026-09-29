---
"pydantic-forms": minor
---

Add a column layout for form fields. Fields are now rendered on a 12-column CSS grid and can be placed side by side using a `layout` object in the field's JSON schema (`{"span": 6, "start": 7, "newRow": true, "rowSpan": 2, "align": "end"}`), for example via `json_schema_extra` on the backend. `rowSpan` lets a field take up multiple rows, with the following fields placed next to it. `align` sets the vertical position of the field in its row. Fields without a layout take the full width, so existing forms render as before.

The grid container has the `pf-grid` class and each cell a `pf-col-span-{n}` class, so apps can override the layout with CSS (e.g. collapse to one column on small screens).

For fields with a layout, the default `TextField`, `IntegerField`, `DropdownField` and `TextAreaField` inputs take the full width of their grid cell, so they grow with the field's span. Fields without a layout keep the browser's default input width.
