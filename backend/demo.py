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

from pydantic import BaseModel, ConfigDict, Field
from pydantic_forms.core import FormPage, post_form
from pydantic_forms.types import State
from pydantic_forms.exception_handlers.fastapi import form_error_handler
from pydantic_forms.exceptions import FormException
from pydantic_forms.core import FormPage as PydanticFormsFormPage
from pydantic_forms.types import JSON

from pydantic_forms.validators import (
    unique_conlist,
)


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
    if val == "Karel":
        raise ValueError("No not Karel!")
    return True


NumberExample = Annotated[
    int,
    Ge(18),
    Le(99),
    MultipleOf(multiple_of=3),
    Predicate(example_backend_validation),
]

StringExample = Annotated[
    str,
    Field(min_length=2, max_length=10),
    Predicate(example_backend_validation),
]


@app.post("/form")
async def form(form_data: list[dict] = []):
    def form_generator(state: State):

        class NameForm(FormPage):
            model_config = ConfigDict(title="Demo form step 1")
            name: str

        name_form_data = yield NameForm

        class NameValidationForm(FormPage):
            model_config = ConfigDict(title="Demo form step 1")
            name_with_validation: StringExample

        name_validation_form_data = yield NameValidationForm

        class NameAgeForm(FormPage):
            model_config = ConfigDict(title="Demo form step 1")
            name: StringExample
            age: NumberExample

        name_age_form_data = yield NameAgeForm

        class PersonObjectForm(FormPage):
            class Person(BaseModel):
                name: StringExample
                age: NumberExample

            model_config = ConfigDict(title="Demo form step 1")
            person: Person

        person_object_form_data = yield PersonObjectForm

        class PersonArrayForm(FormPage):
            class Person(BaseModel):
                name: StringExample
                age: NumberExample

            model_config = ConfigDict(title="Demo form step 1")
            PersonList: unique_conlist(Person, min_items=1, max_items=3)

        person_array_form_data = yield PersonArrayForm

        return (
            name_form_data.model_dump()
            | name_validation_form_data.model_dump()
            | name_age_form_data.model_dump()
            | person_object_form_data.model_dump()
            | person_array_form_data.model_dump()
        )

    post_form(form_generator, state={}, user_inputs=form_data)
    return "OK!"
