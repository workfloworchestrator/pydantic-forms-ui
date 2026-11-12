# Custom fields

Recipes for adding your own field types. A custom field has two parts: a marker
in the backend schema and a component in the frontend that matches it. For all
types see the [custom fields reference].

## Add a field that shows a notice

This adds a banner that shows a message, as in the demo forms.

### 1. Mark the field in the backend

Use `json_schema_extra` to set a `format` and any data the component needs.
Wrapping it in `GroupedMetadata` makes it reusable:

```python
from dataclasses import dataclass
from typing import Annotated, Iterator, Optional
from annotated_types import BaseMetadata, GroupedMetadata
from pydantic import Field


@dataclass(frozen=True)
class NoticeField(GroupedMetadata):
    variant: str
    message: str

    def __iter__(self) -> Iterator[BaseMetadata]:
        yield Field(
            json_schema_extra={
                "format": "notice",
                "variant": self.variant,
                "message": self.message,
            }
        )


class SignupForm(FormPage):
    age_notice: Annotated[
        Optional[str],
        NoticeField(variant="warning", message="You must be at least 18."),
    ] = None
```

### 2. Write the component

The component gets the field as `pydanticFormField`. The extra keys are on
`pydanticFormField.schema`:

```tsx
import type { PydanticFormElementProps } from 'pydantic-forms';

type NoticeSchema = { message: string; variant?: 'info' | 'warning' };

export const Notice = ({
    pydanticFormField,
}: PydanticFormElementProps<NoticeSchema>) => {
    const { message, variant = 'info' } = pydanticFormField.schema;
    return <div className={`notice notice-${variant}`}>{message}</div>;
};
```

### 3. Register it with a matcher

Add a matcher with `componentMatcherExtender`. Put it before the default
matchers, as the first matching entry is used:

```tsx
import {
    PydanticForm,
    type PydanticComponentMatcher,
} from 'pydantic-forms';

const componentMatcher = (
    currentMatchers: PydanticComponentMatcher[],
): PydanticComponentMatcher[] => [
    {
        id: 'notice',
        ElementMatch: { Element: Notice, isControlledElement: false },
        matcher: (field) => field.schema.format === 'notice',
    },
    ...currentMatchers,
];

<PydanticForm
    formKey="signup"
    config={{ apiProvider, componentMatcherExtender: componentMatcher }}
/>;
```

`isControlledElement: false` is right for a field that shows something but
holds no value. For an input, see the next recipe.

## Add an input that holds a value

Set `isControlledElement: true`. The component then also receives `value`,
`onChange`, `onBlur`, `name` and `disabled` from React Hook Form:

```tsx
import type { PydanticFormControlledElementProps } from 'pydantic-forms';

export const ColorField = ({
    value,
    onChange,
    pydanticFormField,
}: PydanticFormControlledElementProps) => (
    <input
        type="color"
        id={pydanticFormField.id}
        value={value ?? '#000000'}
        onChange={(e) => onChange(e.target.value)}
    />
);
```

```tsx
{
    id: 'color',
    ElementMatch: { Element: ColorField, isControlledElement: true },
    matcher: (field) => field.schema.format === 'color',
}
```

On the backend, mark a `str` field with `json_schema_extra={"format": "color"}`.

## Replace how an existing type is rendered

A matcher can match on any property of the field. To render all long text with
your own component, match the built-in type and format and put the matcher first:

```tsx
matcher: (field) =>
    field.type === PydanticFormFieldType.STRING &&
    field.format === PydanticFormFieldFormat.LONG,
```

## Add validation for a custom field

Give the matcher a `validator` that returns a Zod schema for the field:

```tsx
import { z } from 'zod';

{
    id: 'color',
    ElementMatch: { Element: ColorField, isControlledElement: true },
    matcher: (field) => field.schema.format === 'color',
    validator: () => z.string().regex(/^#[0-9a-f]{6}$/i),
}
```

## Fill a grid cell

See [Make a custom field fill its grid cell].

## Migrating from uniforms

Earlier versions used `uniforms`. The mapping to `pydantic-forms`:

| Before (uniforms)                          | Now (pydantic-forms)                                  |
| ------------------------------------------ | ----------------------------------------------------- |
| `__modify_schema__` and `uniforms` key     | `json_schema_extra` with `format` and your own keys   |
| `AutoFieldLoader.tsx` switch on `format`   | an entry in `componentMatcherExtender`                |
| `connectField(...)`                        | `PydanticFormControlledElementProps` (`value`, `onChange`) |
| props such as `groupId` on the component   | `pydanticFormField.schema.groupId`                    |

The `uniforms` key is deprecated in the schema, use `extraProperties`.

[custom fields reference]: ../reference/custom-fields.md
[Make a custom field fill its grid cell]: layout.md#make-a-custom-field-fill-its-grid-cell
