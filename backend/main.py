from dataclasses import dataclass
from typing import Annotated, ClassVar, Iterator
from annotated_types import (
    SLOTS,
    BaseMetadata,
    GroupedMetadata,
    Ge,
    Le,
    MultipleOf,
    Predicate,
    doc,
)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from pydantic import ConfigDict, Field
from pydantic_forms.core import FormPage, post_form
from pydantic_forms.types import State
from pydantic_forms.exception_handlers.fastapi import form_error_handler
from pydantic_forms.exceptions import FormException
from pydantic_forms.core import FormPage as PydanticFormsFormPage
from pydantic_forms.types import JSON
from pydantic_forms.validators import (
    LongText,
    Label,
    Divider,
    Hidden,
    Choice,
    choice_list,
)

# Choice,
# CustomerId,
# DisplaySubscription,
# ListOfOne,
# ListOfTwo,
# migration_summary


class FormPage(PydanticFormsFormPage):
    meta__: ClassVar[JSON] = {"hasNext": True}


class SubmitFormPage(FormPage):
    meta__: ClassVar[JSON] = {"hasNext": False}


app = FastAPI()
# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
app.add_exception_handler(FormException, form_error_handler)  # type: ignore[arg-type]


@app.get("/")
def read_root():
    return {"Hello": "World"}


@dataclass(frozen=True, **SLOTS)
class ExtraData(GroupedMetadata):
    props: dict

    def __iter__(self) -> Iterator[BaseMetadata]:
        yield Field(json_schema_extra=self.props)


def example_backend_validation(val: int) -> bool:
    if val == 9:
        raise ValueError("Value cannot be 9")
    return True


NumberExample = Annotated[
    int, Ge(1), Le(10), MultipleOf(multiple_of=3), Predicate(example_backend_validation)
]


class DropdownChoices(Choice):
    _1 = ("1", "Option 1")
    _2 = ("2", "Option 2")
    _3 = ("3", "Option 3")
    _4 = ("4", "Option 4")


class RadioChoices(Choice):
    _1 = ("1", "Option 1")
    _2 = ("2", "Option 2")
    _3 = ("3", "Option 3")


class MultiCheckBoxChoices(Choice):
    _1 = ("1", "Option 1")
    _2 = ("2", "Option 2")
    _3 = ("3", "Option 3")
    _4 = ("4", "Option 4")


class ListChoices(Choice):
    _0 = ("0", "Option 0")
    _1 = ("1", "Option 1")
    _2 = ("2", "Option 2")
    _3 = ("3", "Option 3")
    _4 = ("4", "Option 4")
    _5 = ("5", "Option 5")
    _6 = ("6", "Option 6")


@app.post("/form")
async def form(form_data: list[dict] = []):
    def form_generator(state: State):
        class TestForm(FormPage):
            model_config = ConfigDict(title="Form Title")

            number: NumberExample = 1
            text: Annotated[str, Field(min_length=3, max_length=12)] = "Default text"
            textArea: LongText = "Default text area"
            divider: Divider
            label: Label = "Label"
            hidden: Hidden = "Hidden"
            # When there are > 3 choices a dropdown will be rendered
            dropdown: DropdownChoices = "2"
            # When there are <= 3 choices a radio group will be rendered
            radio: RadioChoices = "3"
            checkbox: bool = True
            multicheckbox: choice_list(MultiCheckBoxChoices) = "1"
            list: choice_list(ListChoices) = [0, 1]

        form_data_1 = yield TestForm

        class TestForm2(SubmitFormPage):
            model_config = ConfigDict(title="Form 2 Title")

            name_2: str | None = None

        form_data_2 = yield TestForm2

        return form_data_1.model_dump() | form_data_2.model_dump()

    post_form(form_generator, state={}, user_inputs=form_data)
    return "OK!"
