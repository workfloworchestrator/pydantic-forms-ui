# Styling your form

In this tutorial you replace the plain HTML fields of `pydantic-forms` with
styled fields, and you style the labels, errors and buttons. You change which
component renders a field and keep the validation and the backend as they are.

The tutorial uses [Tailwind CSS][Tailwind CSS]. The steps are the same for other
styling or component libraries, such as [Elastic UI][Elastic UI] (EUI), because
a field is just a React component. Only the markup inside the components changes.
EUI does not support React 19 yet, so use React 18 with it.

You need the app of [Creating your first form][first form], with the backend
running on port 8000.

## 1. Add Tailwind CSS to the app

In the `frontend` folder, install Tailwind and its PostCSS plugin:

```bash
npm install tailwindcss @tailwindcss/postcss postcss
```

Create `postcss.config.mjs`:

```js
const config = {
    plugins: {
        '@tailwindcss/postcss': {},
    },
};

export default config;
```

Replace the content of `app/globals.css` with a single line:

```css
@import 'tailwindcss';
```

If you create a new app instead, leave out `--no-tailwind` in
`create-next-app` and this step is done for you.

## 2. Write a Tailwind text field

A field component receives the field as `pydanticFormField` and, for inputs, the
`value`, `onChange`, `onBlur` and `disabled` props from React Hook Form. Create
`components/tailwind/TextField.tsx`:

```tsx
import type { ChangeEvent } from 'react';

import type { PydanticFormControlledElementProps } from 'pydantic-forms';

export const TextField = ({
    value,
    onChange,
    onBlur,
    disabled,
}: PydanticFormControlledElementProps) => {
    const fieldValue = value ?? '';
    const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value);

    return (
        <input
            type="text"
            value={fieldValue}
            onChange={handleChange}
            onBlur={onBlur}
            disabled={disabled}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50"
        />
    );
};
```

The label is not part of the field component. The package renders it around the
component, which you change in step 4.

The example app has Tailwind versions of other field types, such as number,
textarea, dropdown, radio, checkbox and date, in [`example-tailwind`][tailwind fields].

## 3. Add a matcher for the text field

The package uses a list of matchers to decide which component renders a field.
A matcher has these parts:

- `id`: the name of the matcher.
- `matcher`: a function that returns `true` for the fields it handles.
- `validator` (optional): returns the Zod schema that validates the field.
- `ElementMatch`: the component that renders the field.

The first matcher in the list that returns `true` for a field is used. Add your
own matcher in front of the default ones and keep the defaults after it.
Create `components/tailwind/matchers.ts`:

```ts
import {
    PydanticFormFieldFormat,
    PydanticFormFieldType,
    zodValidationPresets,
} from 'pydantic-forms';
import type { PydanticComponentMatcher } from 'pydantic-forms';

import { TextField } from './TextField';

export const tailwindMatchers = (
    currentMatchers: PydanticComponentMatcher[],
): PydanticComponentMatcher[] => [
    {
        id: 'text',
        ElementMatch: { Element: TextField, isControlledElement: true },
        matcher(field) {
            // Plain strings only, so that fields with choices keep using
            // the default matchers
            return (
                field.type === PydanticFormFieldType.STRING &&
                field.format === PydanticFormFieldFormat.DEFAULT &&
                !field.options?.length
            );
        },
        validator: zodValidationPresets.string,
    },
    ...currentMatchers,
];
```

The `validator` keeps the validation of string fields, such as the minimum
length. Pass the function to the form in `app/page.tsx`:

```tsx
import { tailwindMatchers } from '../components/tailwind/matchers';

// ...
config={{ apiProvider, componentMatcherExtender: tailwindMatchers }}
```

Reload. The name and email fields are now Tailwind inputs. Fields that no
matcher of yours handles, such as the checkbox on the second page, keep their
default component. The default matchers are listed in the [reference][default matchers].

## 4. Style the labels and errors

The label, description and error message of a field come from a row renderer.
Create `components/tailwind/FormRow.tsx`:

```tsx
import type { RowRenderComponent } from 'pydantic-forms';

export const FormRow: RowRenderComponent = ({
    title,
    description,
    required,
    isInvalid,
    error,
    children,
}) => {
    const requiredMark = required ? (
        <span className="text-red-600"> *</span>
    ) : null;
    const descriptionText = description ? (
        <p className="mt-1 text-xs text-slate-500">{description}</p>
    ) : null;
    const errorText =
        isInvalid && error ? (
            <p className="mt-1 text-xs text-red-600">{error}</p>
        ) : null;

    return (
        <div className="mb-5">
            <label className="mb-1 block text-sm font-medium text-slate-900">
                {title}
                {requiredMark}
            </label>
            {children}
            {descriptionText}
            {errorText}
        </div>
    );
};
```

## 5. Style the buttons

The footer has the buttons. It also tells you whether the form has a next page
and a previous page. Create `components/tailwind/FormFooter.tsx`:

```tsx
import type { PydanticFormFooterProps } from 'pydantic-forms';

export const FormFooter = ({
    hasNext,
    hasPrevious,
    onPrevious,
    buttons,
}: PydanticFormFooterProps) => {
    const previousLabel = buttons.previous?.text ?? 'Previous';
    const submitLabel = buttons.next?.text ?? (hasNext ? 'Next' : 'Submit');
    const handlePrevious = () => onPrevious?.();

    const previousButton = hasPrevious ? (
        <button
            type="button"
            onClick={handlePrevious}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
            {previousLabel}
        </button>
    ) : null;

    return (
        <div className="mt-6 flex items-center gap-3">
            {previousButton}
            <button
                type="submit"
                className="ml-auto rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
                {submitLabel}
            </button>
        </div>
    );
};
```

Add both to `config` in `app/page.tsx`:

```tsx
import { FormFooter } from '../components/tailwind/FormFooter';
import { FormRow } from '../components/tailwind/FormRow';

// ...
config={{
    apiProvider,
    componentMatcherExtender: tailwindMatchers,
    rowRenderer: FormRow,
    footerRenderer: FormFooter,
}}
```

Reload and enter a name of one character. The error from the `min_length=2`
constraint appears below the field, in red.

Enter a valid name and email and click Next. The second page shows a Previous
and a Submit button.

## What you did

You replaced the text field, the labels and errors and the buttons of the form
with Tailwind styled ones, without changing the backend, the validation or the
way the form is submitted.

## Next steps

- Style the other field types: the example app has Tailwind versions of all the
  default fields in [`example-tailwind`][tailwind fields], such as number,
  textarea, dropdown, radio, checkbox and date. Its
  [`componentMatcher.ts`][tailwind matchers] shows how they are registered.
- Prefer [shadcn/ui][shadcn]? The same app has those versions in
  [`fields/shadcn`][shadcn fields].
- Add fields that are not in the defaults: [Custom fields].
- See every matcher property: [Custom fields reference].

[first form]: create-first-form.md
[Custom fields]: ../how-to/custom-fields.md
[Custom fields reference]: ../reference/custom-fields.md
[default matchers]: ../reference/custom-fields.md#default-matchers

[Tailwind CSS]: https://tailwindcss.com/
[Elastic UI]: https://eui.elastic.co/
[shadcn]: https://ui.shadcn.com/
[tailwind fields]: https://github.com/workfloworchestrator/pydantic-forms-ui/tree/main/frontend/apps/example-tailwind/src/components/fields/tailwind
[shadcn fields]: https://github.com/workfloworchestrator/pydantic-forms-ui/tree/main/frontend/apps/example-tailwind/src/components/fields/shadcn
[tailwind matchers]: https://github.com/workfloworchestrator/pydantic-forms-ui/blob/main/frontend/apps/example-tailwind/src/shared/componentMatcher.ts
