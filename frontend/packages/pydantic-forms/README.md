# `pydantic-forms`

React components that render a form from a JSON schema and send the answers
back to your API. It validates the input in the browser and supports multi-page
forms, nested objects, lists, choices and a layout grid. Any field can be
replaced with your own component.

This package is the frontend only. It works in combination with the
[`pydantic-forms` Python package][pydantic-forms python], which generates the
schema from Pydantic models and validates the submitted data. The
[repository][repo] includes a FastAPI backend with example forms.

## Requirements

Works in any React app. It does not depend on Next.js. It expects React and
the form libraries it builds on, such as React Hook Form, Zod,
`@hookform/resolvers` and `swr`, to be installed. The exact versions are in
[`package.json`][package.json].

## Installation

```bash
npm install pydantic-forms
```

## Usage

`PydanticForm` needs an `apiProvider`: a function that sends the request body to
your API and returns the response with its HTTP status. The `pydantic-forms`
Python package returns the next form page or the result.

```tsx
'use client';

import { PydanticForm } from 'pydantic-forms';
import type {
    PydanticFormApiProvider,
    PydanticFormSuccessResponse,
} from 'pydantic-forms';

const apiProvider: PydanticFormApiProvider = async ({ requestBody }) => {
    const response = await fetch('http://localhost:8000/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
    });
    const data = await response.json();

    return { ...data, status: response.status };
};

export default function Contact() {
    const onSuccess = (_: unknown, response: PydanticFormSuccessResponse) => {
        alert(`Submitted: ${JSON.stringify(response.data)}`);
    };

    return (
        <PydanticForm
            formKey="contact"
            formId="contact"
            title="Contact"
            onSuccess={onSuccess}
            config={{ apiProvider }}
        />
    );
}
```

The backend side is a FastAPI endpoint that calls `post_form` with a generator
that yields one `FormPage` per form page, see the
[backend documentation][pydantic-forms python docs].

## Customization

`config` also accepts:

- `componentMatcherExtender` to add or replace field components.
- `labelProvider` and `customDataProvider` to supply labels and default values.
- `customTranslations` and `locale` to change texts.
- `formRenderer`, `headerRenderer`, `footerRenderer` and `rowRenderer` to
  change the layout around the fields.
- `loadingComponent` and `errorComponent`.

## Documentation and examples

- [Documentation][docs]: tutorial, how-to guides, reference and explanation.
- [Example apps][examples], with plain CSS, Tailwind and shadcn/ui.
- [Example backend][backend], a FastAPI application with the forms the example
  apps use.

## License

Apache-2.0

[pydantic-forms python]: https://pypi.org/project/pydantic-forms/
[pydantic-forms python docs]: https://workfloworchestrator.org/pydantic-forms/
[repo]: https://github.com/workfloworchestrator/pydantic-forms-ui
[package.json]: https://github.com/workfloworchestrator/pydantic-forms-ui/blob/main/frontend/packages/pydantic-forms/package.json
[docs]: https://github.com/workfloworchestrator/pydantic-forms-ui/tree/main/mkdocs/docs
[examples]: https://github.com/workfloworchestrator/pydantic-forms-ui/tree/main/frontend/apps
[backend]: https://github.com/workfloworchestrator/pydantic-forms-ui/tree/main/backend
