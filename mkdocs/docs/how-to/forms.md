# Forms

Recipes for defining forms in the backend. For the frontend side of custom
fields see [Custom fields].

!!! note "In the orchestrator"
    The Python library behind these examples is documented
    in the [pydantic-forms docs].

    The orchestrator core re-exports these classes from `orchestrator.forms`
    and `orchestrator.forms.validators`. The examples work the same there.

## Let users pick from choices

Subclass `Choice`. Each member is a `(value, label)` tuple: the value is what
you receive, the label is what the user sees.

```python
from pydantic_forms.validators import Choice


class ContactMethods(Choice):
    _email = ("email", "Email")
    _phone = ("phone", "Phone")


class ContactForm(FormPage):
    method: ContactMethods
```

### Let users pick several

Wrap the choice in `choice_list`. `min_items` and `max_items` are the number of
choices the user must or may make, not the number of options:

```python
from pydantic_forms.validators import choice_list

methods: choice_list(ContactMethods, min_items=1, max_items=2, unique_items=True)
```

With `min_items=1, max_items=1` one choice is shown and it cannot be extended.
With `max_items=3` the user can add up to three. The result is always a list,
even for one choice:

```python
user_input = yield ContactForm
method = user_input.methods[0]
```

## Build the options at runtime

`Choice` classes are normal Python, so create one from data when the form is
built, for instance from an inventory system. Use the same value as label when
they don't need to differ:

```python
def equipment_choice() -> type[Choice]:
    names = [eq["name"] for eq in get_planned_equipment()]
    return Choice("EquipmentEnum", zip(names, names))


def form_generator(state: State):
    class SelectEquipmentForm(FormPage):
        equipment: choice_list(equipment_choice(), min_items=1, max_items=1)

    user_input = yield SelectEquipmentForm
```

## Show read-only information

Show a payload in a `LongText` field and add a `bool` to have the user confirm
it:

```python
from pydantic_forms.validators import LongText


class ConfirmDryRun(FormPage):
    dry_run_results: LongText = dry_run_results
    confirmed: bool = Field(title="The result is correct")
```

## Mix with regular Python types

Validated types and plain Python types can sit side by side:

```python
class CreateServiceForm(FormPage):
    ticket_id: str = ""
    shutdown_remote_port: bool = True
    speed: Annotated[int, Ge(100), Le(10000)] = 1000
    contacts: unique_conlist(Person, min_items=1, max_items=5)
```

## Build a multi-page form

Yield once per page and combine the results at the end. Pages can use earlier
answers:

```python
def form_generator(state: State):
    class NodeForm(FormPage):
        location_code: str
        ticket_id: str = ""

    node = yield NodeForm

    class NodeIdForm(SubmitFormPage):
        node_id: Annotated[str, Field(description=f"Node at {node.location_code}")]

    node_id = yield NodeIdForm

    return node.model_dump() | node_id.model_dump()
```

### Change the Next and Submit buttons

A page tells the frontend about itself through `meta__`. `hasNext` decides
between Next and Submit. In this repository `FormPage` has `hasNext: True` and
`SubmitFormPage` has `hasNext: False`:

```python
class FormPage(PydanticFormsFormPage):
    meta__: ClassVar[JSON] = {"hasNext": True}


class SubmitFormPage(FormPage):
    meta__: ClassVar[JSON] = {"hasNext": False}
```

Use `customButtons` to change the text and color per page:

```python
meta__: ClassVar[JSON] = {
    "hasNext": True,
    "customButtons": {
        "next": {"text": "Continue", "color": "#16a34a"},
        "previous": {"text": "Back", "color": "#374bbd"},
    },
}
```

## Validate on the backend

Pydantic constraints (`Ge`, `Le`, `min_length`, ...) are sent to the frontend
as JSON schema and checked there. For rules that need Python, add a `Predicate`.
It runs on the backend, and the `ValueError` message is shown at the field:

```python
def not_nine(val: int) -> bool:
    if val == 9:
        raise ValueError("Value cannot be 9")
    return True


number: Annotated[int, Ge(18), Le(99), Predicate(not_nine)]
```

## Pass extra data to the frontend

`json_schema_extra` adds arbitrary keys to a field's schema. Wrap it in a
`GroupedMetadata` class to reuse it, as the demo does for `ExtraData` and
`NoticeField`. Your custom components read the values, see
[Custom fields].

For placing fields on a grid, see [Layout].

[Custom fields]: custom-fields.md
[Layout]: layout.md

[pydantic-forms docs]: https://workfloworchestrator.org/pydantic-forms/usage/
