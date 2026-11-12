# Custom fields

Complete description of the types and options for custom field components.

## Component matcher

`PydanticComponentMatcher` connects a field in the schema to a component:

| Property       | Type                                | Required | Description                                                                 |
| -------------- | ----------------------------------- | -------- | --------------------------------------------------------------------------- |
| `id`           | `string`                            | yes      | Name of the matcher.                                                        |
| `matcher`      | `(field: PydanticFormField) => boolean` | yes  | Returns `true` when the component should render this field.                 |
| `ElementMatch` | `ElementMatch`                      | yes      | The component and whether it is controlled.                                 |
| `validator`    | `(field) => z.ZodTypeAny`           | no       | Returns the Zod schema used to validate the field in the browser.           |

The first matcher that returns `true` is used. Matchers you add are normally put
before the defaults.

### ElementMatch

| `isControlledElement` | `Element` type                    | Use for                                 |
| --------------------- | --------------------------------- | --------------------------------------- |
| `false`               | `PydanticFormElement`             | Fields that show something, no value.   |
| `true`                | `PydanticFormControlledElement`   | Inputs that hold a value.               |

### componentMatcherExtender

Set on the `config` of `PydanticForm`. It receives the default matchers and
returns the list to use, so you can add, reorder or remove entries:

```ts
type ComponentMatcherExtender = (
    currentMatchers: PydanticComponentMatcher[],
) => PydanticComponentMatcher[];
```

## Component props

| Prop                | Available when | Description                                                            |
| ------------------- | -------------- | ---------------------------------------------------------------------- |
| `pydanticFormField` | always         | The field: `id`, `title`, `description`, `type`, `format`, `schema`, ... |
| `value`, `onChange`, `onBlur`, `name`, `disabled` | controlled | React Hook Form's `ControllerRenderProps`, without `ref`. |

`PydanticFormElementProps<TSchema>` and
`PydanticFormControlledElementProps<TSchema>` type the props. `TSchema` types
`pydanticFormField.schema`, so your custom keys are available with types.

## Custom keys in the schema

Keys set with `json_schema_extra` on the backend end up in
`pydanticFormField.schema`. The key `format` is the usual way to select a
component. The older `uniforms` key is deprecated in favour of
`extraProperties`.

## Default matchers

These are the matchers of the package, in the order they are tried. Matchers you
add with `componentMatcherExtender` are usually put in front of them, as in
[Styling your form][style tutorial].

| `id`             | Matches                                      | Controlled |
| ---------------- | -------------------------------------------- | ---------- |
| `integerfield`   | `integer`                                    | yes        |
| `textareafield`  | `string` with format `long`                  | yes        |
| `label`          | `string` with format `label`                 | no         |
| `divider`        | `string` with format `divider`               | no         |
| `hidden`         | `string` with format `hidden`                | no         |
| `radio`          | `string` with 1 to 3 options                 | yes        |
| `dropdown`       | `string` with 4 or more options              | yes        |
| `boolean`        | `boolean`                                    | yes        |
| `multicheckbox`  | `array` of up to 5 options                   | yes        |
| `list`           | `array` of options                           | yes        |
| `object`         | `object`                                     | no         |
| `array`          | `array`                                      | yes        |
| `text`           | any other `string`                           | yes        |

A field that no matcher handles, such as a `number`, gets the text field. The
list is in
[`defaultComponentMatchers.ts`][default matchers source].

## Demo

- Backend: `NoticeField` and the `/form-simple` endpoint in [`backend/main.py`].
- Frontend: the `notice` matcher in [`componentMatcher.ts`] and the
  `HelpBanner` component of the Tailwind example.

[style tutorial]: ../tutorials/style-your-form.md

[`backend/main.py`]: https://github.com/workfloworchestrator/pydantic-forms-ui/blob/main/backend/main.py
[`componentMatcher.ts`]: https://github.com/workfloworchestrator/pydantic-forms-ui/blob/main/frontend/apps/example-tailwind/src/shared/componentMatcher.ts
[default matchers source]: https://github.com/workfloworchestrator/pydantic-forms-ui/blob/main/frontend/packages/pydantic-forms/src/components/defaultComponentMatchers.ts
