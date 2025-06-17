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
    LongText,
    Label,
    Divider,
    Hidden,
    Choice,
    choice_list,
    unique_conlist,
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
    int,
    Ge(18),
    Le(99),
    MultipleOf(multiple_of=3),
    Predicate(example_backend_validation),
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


TestString = Annotated[str, Field(min_length=2, max_length=10)]


class Education(BaseModel):
    degree: str
    years: int | None


def example_list_validation(val: int) -> bool:
    return True


TestExampleNumberList = Annotated[
    unique_conlist(NumberExample, min_items=2, max_items=5),
    Predicate(example_list_validation),
]


class Education2(BaseModel):
    degree: str
    years: int | None
    options: ListChoices
    languages: TestExampleNumberList


class Person(BaseModel):
    name: str
    age: Annotated[int, Ge(18), Le(99), MultipleOf(multiple_of=3)]
    education: Education


class Person2(BaseModel):
    name: str
    age: Annotated[int, Ge(18), Le(99), MultipleOf(multiple_of=3)]
    education: Education2


TestPersonList = Annotated[
    unique_conlist(Person, min_items=2, max_items=5), Predicate(example_list_validation)
]


@app.post("/form")
async def form(form_data: list[dict] = []):
    def form_generator(state: State):
        class TestForm0(FormPage):
            model_config = ConfigDict(title="Form Title Page 1")

            number: NumberExample
            list: TestExampleNumberList
            # list_list: unique_conlist(TestExampleNumberList, min_items=1, max_items=5)
            # list_list_list: unique_conlist(
            # unique_conlist(Person2, min_items=1, max_items=5),
            # min_items=1,
            # max_items=2,
            # ) = [1, 2]
            test: TestString
            textList: unique_conlist(TestString, min_items=1, max_items=5)
            # numberList: TestExampleNumberList = [1, 2]
            person: Person2
            personList: unique_conlist(Person2, min_items=2, max_items=5)
            # ingleNumber: NumberExample
            # number0: Annotated[int, Ge(18), Le(99)] = 17

        form_data_0 = yield TestForm0

        class TestForm1(FormPage):
            model_config = ConfigDict(title="Form Title Page 1")

            contact_name2: StringExample
            options: ListChoices

        form_data_1 = yield TestForm1

        class TestForm2(FormPage):
            model_config = ConfigDict(title="Form Title Page 2")

            contact_name3: StringExample
            age: NumberExample

        form_data_2 = yield TestForm2

        class TestForm3(FormPage):
            model_config = ConfigDict(title="Form Title Page 3")

            contact_person: Person

        form_data_3 = yield TestForm3

        class TestForm5(FormPage):
            model_config = ConfigDict(title="Form Title Page 4")

            contact_person_list: TestPersonList

        form_data_5 = yield TestForm5

        return (
            form_data_0.model_dump()
            | form_data_1.model_dump()
            | form_data_2.model_dump()
            | form_data_3.model_dump()
            | form_data_5.model_dump()
        )

    post_form(form_generator, state={}, user_inputs=form_data)
    return "OK!"
