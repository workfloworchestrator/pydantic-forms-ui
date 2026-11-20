# Creating your first form

In this tutorial you build a small app from scratch: a FastAPI backend that
defines a form with Pydantic, and a Next.js frontend that renders it with the
`pydantic-forms` npm package. You will end with a two-page form.

You need Python 3.10+ and Node.js 20+. See the [requirements] for all versions.

!!! note "Next.js is optional"
    The frontend uses Next.js because the demo apps do, but the `pydantic-forms`
    package works in any React app, for instance with Vite.

## 1. Set up the backend

Create a folder `backend` with a virtual environment and install the
dependencies:

```bash
mkdir backend && cd backend
python -m venv venv
source venv/bin/activate
pip install "fastapi[standard]" "pydantic-forms[fastapi]" structlog
```

## 2. Define the form

A form page is a class that extends `FormPage`. Its fields become the form
fields, and their types and constraints become validation. A form is a
generator function: each `yield` shows one page and returns what the user
filled in. Create `main.py`:

```python
from pydantic import ConfigDict, Field
from pydantic_forms.core import FormPage
from pydantic_forms.types import State


class ContactForm(FormPage):
    model_config = ConfigDict(title="Contact")

    name: str = Field(title="Name", min_length=2)
    email: str = Field(title="Email")


def contact_form(state: State):
    user_input = yield ContactForm
    return user_input.model_dump()
```

Yield the class itself, not an instance: `yield ContactForm`, not
`yield ContactForm()`.

## 3. Serve it with FastAPI

Add the app and an endpoint to `main.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic_forms.core import post_form
from pydantic_forms.exception_handlers.fastapi import form_error_handler
from pydantic_forms.exceptions import FormException

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_exception_handler(FormException, form_error_handler)


@app.post("/contact")
async def contact(form_data: list[dict] = []):
    post_form(contact_form, state={}, user_inputs=form_data)
    return "OK!"
```

The exception handler turns a `FormException` raised by the library into a
response the frontend understands: the next page to show, or validation errors.
See the [backend error reference] for all exceptions and status
codes.

`post_form` replays the pages submitted so far through the generator. At the
first page without input it raises a `FormException`, and the handler returns
that page's schema (status 510). Invalid input gives status 400. When the
generator returns, the endpoint answers with status 200.

Start the backend:

```bash
fastapi dev main.py
```

It runs at <http://127.0.0.1:8000>. Calling `POST /contact` with an empty body
returns the JSON schema of the form.

## 4. Set up the frontend

In the folder next to `backend`, create a Next.js app and add the package:

```bash
npx create-next-app@latest frontend --ts --app --no-tailwind --no-src-dir --eslint --use-npm
cd frontend
npm install pydantic-forms
```

npm installs the dependencies of `pydantic-forms` for you.

## 5. Render the form

`PydanticForm` needs an `apiProvider`: a function that sends the request body to
your backend and returns the result with its status. Replace `app/page.tsx`:

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

    // 510: next page to show, 400: validation errors, 200: form finished
    return { ...data, status: response.status };
};

export default function Home() {
    const onSuccess = (
        _: unknown,
        response: PydanticFormSuccessResponse,
    ) => {
        alert(`Submitted: ${JSON.stringify(response.data)}`);
    };

    return (
        <main style={{ maxWidth: 600, margin: '2rem auto' }}>
            <PydanticForm
                formKey="contact"
                formId="contact"
                title="Contact"
                onSuccess={onSuccess}
                config={{ apiProvider }}
            />
        </main>
    );
}
```

Start it:

```bash
npm run dev
```

Open <http://localhost:3000>. You see a form with a name and an email field.
Enter a name of one character and submit: the validation error from your
`min_length=2` appears at the field. Fill it in properly and the success alert
shows what the backend returned.

The fields use the package's unstyled defaults. To restyle them, see
[Custom fields].

## 6. Put fields next to each other

By default every field takes the full width of the form, so fields are stacked.
The form has a 12-column grid, and `Layout` sets how many columns a field takes.
Annotate name and email with `span=6`. Two fields of 6 columns fill a row:

```python
from typing import Annotated
from pydantic_forms.validators import Layout


class ContactForm(FormPage):
    model_config = ConfigDict(title="Contact")

    name: Annotated[str, Layout(span=6)] = Field(title="Name", min_length=2)
    email: Annotated[str, Layout(span=6)] = Field(title="Email")
```

Reload the page. Name and email now sit side by side. A field without `Layout`
spans all 12 columns and gets a row of its own. See [Layout] for taller fields,
gaps and alignment.

## 7. Add a second page

Yield again in `main.py`. The second page can use the answers of the first, and
the form is only finished after the last `yield`. Add a `SubmitFormPage`, which
tells the frontend to show a Submit button instead of Next:

```python
from typing import ClassVar
from pydantic_forms.types import JSON


class FirstPage(FormPage):
    meta__: ClassVar[JSON] = {"hasNext": True}


class SubmitFormPage(FormPage):
    meta__: ClassVar[JSON] = {"hasNext": False}
```

Make `ContactForm` extend `FirstPage`, then replace the generator:

```python
def contact_form(state: State):
    contact = yield ContactForm

    class ConfirmForm(SubmitFormPage):
        model_config = ConfigDict(title="Confirm")

        confirmed: bool = Field(title=f"Is {contact.email} correct?")

    confirm = yield ConfirmForm

    return contact.model_dump() | confirm.model_dump()
```

The backend reloads by itself. Reload the page in the browser: the first page
now has a Next button, and the second page asks you to confirm the address you
entered, with a Submit button.

## What you did

You defined a form with a Pydantic model, served it with a generator, rendered
it with `PydanticForm`, placed fields on a grid and combined two pages, with no per-field frontend code.

## Next steps

- Style the form with your own fields, labels and buttons: [Styling your form].
- Solve specific problems: [How-to guides].
- Place fields on the grid: [Layout options][Layout reference] and the
  [layout grid explanation][How the layout grid works].
- Add your own field type: [Custom fields].
- Learn more about the backend: the [pydantic-forms usage guide]
  and [reference].
- Understand the flow: [How forms are generated].
- See complete forms and the Tailwind and shadcn setups in the demo
  [`backend/main.py`]
  and [`frontend/apps`].

[requirements]: ../reference/requirements.md
[Styling your form]: style-your-form.md
[Layout]: ../how-to/layout.md
[Custom fields]: ../how-to/custom-fields.md
[How-to guides]: ../how-to/forms.md
[Layout reference]: ../reference/layout.md
[How the layout grid works]: ../explanation/layout-grid.md
[How forms are generated]: ../explanation/forms.md

[backend error reference]: https://workfloworchestrator.org/pydantic-forms/errors/
[pydantic-forms usage guide]: https://workfloworchestrator.org/pydantic-forms/usage/
[reference]: https://workfloworchestrator.org/pydantic-forms/reference/
[`backend/main.py`]: https://github.com/workfloworchestrator/pydantic-forms-ui/blob/main/backend/main.py
[`frontend/apps`]: https://github.com/workfloworchestrator/pydantic-forms-ui/tree/main/frontend/apps
