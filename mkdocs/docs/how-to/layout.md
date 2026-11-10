# Layout

Recipes for placing fields on the 12-column grid. For the full list of options see the [layout reference](../reference/layout.md).

## Place fields side by side and leave gaps

### Put fields on one row

Give each field a `span`. Spans in one row should add up to 12:

```python
full_name: Annotated[str, Layout(span=6)]
age: Annotated[int, Layout(span=3)]
birth_date: Annotated[date, Layout(span=3)]
```

```
| full_name                    | age          | birth_date     |
```

### Make a field span multiple rows

Use `row_span`. The fields that follow are placed in the columns next to it:

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

### Leave empty columns before a field

Use `start` to place a field at a specific column:

```python
notice: Annotated[Optional[str], Layout(span=6, start=7)] = None
```

```
|                              | notice                        |
```

If the columns from `start` are already taken in the current row, the field
moves to the next row.

### Combine with other annotations

`Layout` is a regular `Annotated` metadata item, so it works with constraints,
`Field(...)` and custom metadata such as `ExtraData`:

```python
age: Annotated[
    int, Ge(18), Le(99), MultipleOf(multiple_of=3), Layout(span=6, align="end")
]
age_notice: Annotated[
    Optional[str], _age_notice, Layout(span=4, new_row=True)
] = None
```

## Force a field onto a new row

A field is placed in the current row as long as it fits. Use `new_row=True` to
always start on a new row, for instance to start a new group of fields:

```python
street: Annotated[str, Layout(span=8)]
house_number: Annotated[str, Layout(span=4)]
# Would fit after a span=4 field, but should start a new row
city: Annotated[str, Layout(span=4, new_row=True)]
```

`new_row` is ignored when `start` is also set. To get both a fixed column and a
new row, use `start=1`.

## Align fields vertically

Fields in the same row get the height of the tallest field in that row. When one
field has a description and its neighbour doesn't, their inputs don't line up.

Use `align="end"` on the shorter field to push it to the bottom of the row:

```python
name: Annotated[str, Layout(span=6)] = Field(description="Your full name")
age: Annotated[int, Layout(span=6, align="end")]
```

See [Layout options](../reference/layout.md#layout-options) for the other values.

## Lay out nested objects and list items

`Layout` works the same inside a nested `BaseModel` and for list items. The 12
columns are the width of the nested object, not of the whole form:

```python
class Address(BaseModel):
    street: Annotated[str, Layout(span=8)] = Field(title="Street")
    postal_code: Annotated[str, Layout(span=4)] = Field(title="Postal code")
    city: Annotated[str, Layout(span=6)] = Field(title="City")
    country: Annotated[str, Layout(span=6)] = Field(title="Country")
```

## Make the layout responsive

The grid has no breakpoints. Stack the fields on small screens by adding this to
the global CSS of your app (both example apps do this). `!important` is needed
to override the inline styles:

```css
@media (max-width: 640px) {
    .pf-grid > * {
        grid-column: 1 / -1 !important;
        grid-row: auto !important;
    }
}
```

### Keep only narrow fields side by side

Use the `pf-col-span-{n}` classes to target fields by their effective span. For
example, stack the wide fields on medium screens:

```css
@media (max-width: 1024px) {
    .pf-grid > :is(.pf-col-span-6, .pf-col-span-8) {
        grid-column: 1 / -1 !important;
    }
}
```

The available classes are listed in the
[frontend reference](../reference/layout.md#css-classes).

## Make a custom field fill its grid cell

The built-in `TextField`, `IntegerField`, `DropdownField` and `TextAreaField`
already fill their cell. For your own field components, apply
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

Fields without a layout keep the browser's default input width.
