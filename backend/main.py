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
from pydantic_forms.validators import LongText, Label, Divider

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


def valid_asn_rfc7300(val: int) -> bool:
    if val == 65535:
        raise ValueError("RFC 7300 doesn't allow 65535 as ASN value")
    return True


Asn = Annotated[
    int,
    Ge(1),
    Le(10),
    MultipleOf(multiple_of=3),
    Predicate(valid_asn_rfc7300),
    doc("Autonomous System Number."),
]


@app.post("/form")
async def form(form_data: list[dict] = []):
    def form_generator(state: State):
        class TestForm(FormPage):
            model_config = ConfigDict(title="Form Title")

            asn: Asn
            text: Annotated[str, Field(min_length=3, max_length=10)] = "Default text"
            textArea: LongText
            divider: Divider
            label: Label = "Label"

        form_data_1 = yield TestForm

        class TestForm2(SubmitFormPage):
            model_config = ConfigDict(title="Form 2 Title")

            name_2: str | None = None

        form_data_2 = yield TestForm2

        return form_data_1.model_dump() | form_data_2.model_dump()

    post_form(form_generator, state={}, user_inputs=form_data)
    return "OK!"
