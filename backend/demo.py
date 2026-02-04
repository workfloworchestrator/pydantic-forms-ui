from dataclasses import dataclass
from datetime import date, datetime, time, timedelta
from decimal import Decimal
from enum import Enum
from pathlib import Path
from typing import Annotated, ClassVar, Iterator, Literal
from uuid import UUID
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

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    HttpUrl,
    IPvAnyAddress,
    Json,
)
from pydantic_forms.core import FormPage, post_form
from pydantic_forms.types import State
from pydantic_forms.exception_handlers.fastapi import form_error_handler
from pydantic_forms.exceptions import FormException
from pydantic_forms.core import FormPage as PydanticFormsFormPage
from pydantic_forms.types import JSON

from pydantic_forms.validators import (
    Choice,
    LongText,
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

class Colors(str, Enum):
    GRAY = "#9CA3AF"
    BLUE = "#2563EB"
    DARK_BLUE = "#1E40AF"
    GREEN = "#16A34A"
    LIGHT_GREEN = "#22C55E"
    EMERALD = "#10B981"
    DARK_EMERALD = "#059669"
    AMBER = "#F59E0B"
    RED = "#EF4444"
    DARK_RED = "#B91C1C"
    PINK = "#EC4899"
    SKY = "#0EA5E9"
    PURPLE = "#9333EA"
    VIOLET = "#7C3AED"
    YELLOW_DARK = "#A16207"

@app.post("/form-full")
async def form_full(form_data: list[dict] = []):
    def form_generator(state: State):

        # Page 1: Basic string and numeric types
        class FullFormBasicTypes(FormPage):
            model_config = ConfigDict(title="Basic Types - Strings and Numbers")

            # String types
            full_name: str = Field(
                title="Full name",
                description="Provide your full name.",
            )
            bio: str = Field(
                title="Bio",
                description="Short biography",
                min_length=10,
                max_length=500,
            )

            # Numeric types
            age: int = Field(
                title="Age",
                description="Provide your age.",
                ge=0,
                le=150,
            )
            height: float = Field(
                title="Height (meters)",
                description="Your height in meters",
                ge=0.0,
                le=3.0,
            )
            balance: Decimal = Field(
                title="Account Balance",
                description="Your current balance",
                decimal_places=2,
            )

        basic_types_data = yield FullFormBasicTypes

        # Page 2: Boolean, Enum, and Literal types
        class FullFormChoices(FormPage):
            model_config = ConfigDict(title="Choices - Boolean, Enum, and Literal")

            # Boolean
            accept_terms: bool = Field(
                title="Accept terms and conditions",
                description="I agree to the terms and conditions",
            )
            newsletter: bool = Field(
                title="Subscribe to newsletter",
                description="Receive updates via email",
                default=False,
            )

            # Enum
            favorite_color: Colors = Field(
                title="Favorite color",
                description="Choose your favorite color from the palette",
            )

            # Literal
            experience_level: Literal["beginner", "intermediate", "advanced", "expert"] = Field(
                title="Experience level",
                description="Select your skill level",
                default="beginner",
            )

        choices_data = yield FullFormChoices

        # Page 3: Date and time types
        class FullFormDateTime(FormPage):
            model_config = ConfigDict(title="Date and Time Types")

            birth_date: date = Field(
                title="Birth date",
                description="Your date of birth",
            )
            appointment_time: datetime = Field(
                title="Appointment",
                description="Preferred appointment date and time",
            )
            preferred_time: time = Field(
                title="Preferred meeting time",
                description="What time do you prefer for meetings?",
            )
            session_duration: timedelta = Field(
                title="Session duration",
                description="How long should the session last?",
            )

        datetime_data = yield FullFormDateTime

        # Page 4: Special validation types
        class FullFormSpecialTypes(FormPage):
            model_config = ConfigDict(title="Special Validation Types")

            email: EmailStr = Field(
                title="Email address",
                description="Your valid email address",
            )
            website: HttpUrl = Field(
                title="Website",
                description="Your website URL",
            )
            ip_address: IPvAnyAddress = Field(
                title="IP Address",
                description="Your IP address (IPv4 or IPv6)",
            )
            user_id: UUID = Field(
                title="User ID",
                description="Your unique user identifier",
            )
            file_path: Path = Field(
                title="File path",
                description="Path to your configuration file",
            )

        special_types_data = yield FullFormSpecialTypes

        # Page 5: Collection types
        class FullFormCollections(FormPage):
            model_config = ConfigDict(title="Collection Types - Lists, Dicts, Sets")

            # List
            tags: list[str] = Field(
                title="Tags",
                description="Add relevant tags",
                min_length=1,
                max_length=10,
            )
            scores: list[int] = Field(
                title="Test scores",
                description="Enter your test scores",
                min_length=1,
            )

            # Dict
            metadata: dict[str, str] = Field(
                title="Metadata",
                description="Key-value pairs for additional information",
            )

            # Set (unique values)
            unique_skills: set[str] = Field(
                title="Unique skills",
                description="List your skills (duplicates will be removed)",
            )

            # Tuple
            coordinates: tuple[float, float] = Field(
                title="Coordinates",
                description="Latitude and longitude",
            )

        collections_data = yield FullFormCollections

        # Page 6: Optional and Union types
        class FullFormOptional(FormPage):
            model_config = ConfigDict(title="Optional and Union Types")

            # Optional types
            middle_name: str | None = Field(
                title="Middle name",
                description="Optional middle name",
                default=None,
            )
            phone: str | None = Field(
                title="Phone number",
                description="Optional phone number",
                default=None,
            )

            # Union types
            reference_id: int | str = Field(
                title="Reference ID",
                description="Can be either a number or a string",
            )

        optional_data = yield FullFormOptional

        # Page 7: Nested objects and complex types
        class FullFormNested(FormPage):
            model_config = ConfigDict(title="Nested Objects and Complex Types")

            class Address(BaseModel):
                street: str = Field(title="Street", description="Street name and number")
                city: str = Field(title="City")
                postal_code: str = Field(title="Postal code")
                country: str = Field(title="Country")

            class Education(BaseModel):
                degree: str = Field(title="Degree", description="Type of degree")
                institution: str = Field(title="Institution")
                year: int = Field(title="Graduation year", ge=1900, le=2100)

            # Nested object
            address: Address = Field(
                title="Address",
                description="Your residential address",
            )

            # List of nested objects
            education_history: unique_conlist(Education, min_items=1, max_items=5) = Field(
                title="Education history",
                description="Your educational background",
            )

        nested_data = yield FullFormNested

        # Page 8: Constrained types with validation
        class FullFormValidation(FormPage):
            model_config = ConfigDict(title="Constrained Types with Validation")

            # Constrained string
            username: Annotated[str, Field(min_length=3, max_length=20, pattern=r"^[a-zA-Z0-9_]+$")] = Field(
                title="Username",
                description="Alphanumeric username (3-20 characters)",
            )

            # Constrained integer
            rating: Annotated[int, Ge(1), Le(5)] = Field(
                title="Rating",
                description="Rate from 1 to 5",
            )

            # Constrained float
            percentage: Annotated[float, Ge(0.0), Le(100.0)] = Field(
                title="Completion percentage",
                description="Enter percentage (0-100)",
            )

            # Constrained list
            priority_list: Annotated[list[int], Field(min_length=3, max_length=5)] = Field(
                title="Priority list",
                description="Rank your top 3-5 priorities",
            )

        validation_data = yield FullFormValidation

        # Page 9: JSON and bytes
        class FullFormAdvanced(FormPage):
            model_config = ConfigDict(title="Advanced Types - JSON and Bytes")

            # JSON type
            json_config: Json = Field(
                title="JSON Configuration",
                description="Provide configuration in JSON format",
            )

            # Bytes type
            file_content: bytes = Field(
                title="File content",
                description="Binary file content",
            )

        advanced_data = yield FullFormAdvanced

        return (
            basic_types_data.model_dump()
            | choices_data.model_dump()
            | datetime_data.model_dump()
            | special_types_data.model_dump()
            | collections_data.model_dump()
            | optional_data.model_dump()
            | nested_data.model_dump()
            | validation_data.model_dump()
            | advanced_data.model_dump()
        )

    post_form(form_generator, state={}, user_inputs=form_data)
    return "OK!"


class SimpleChoices(Choice):
    """Simple choice options for demonstration."""
    OPTION_A = ("a", "Option A")
    OPTION_B = ("b", "Option B")
    OPTION_C = ("c", "Option C")


@app.post("/form-simple")
async def form_simple(form_data: list[dict] = []):
    """Simple form with only scalar field types - no arrays or objects."""
    def form_generator(state: State):

        class SimpleForm(SubmitFormPage):
            model_config = ConfigDict(title="Simple Form - Scalar Fields Only")

            # String field
            full_name: str = Field(
                title="Full Name",
                description="Enter your full name",
                min_length=2,
                max_length=100,
            )

            # LongText field
            comments: LongText = Field(
                title="Comments",
                description="Please provide any additional comments or feedback",
            )

            # Integer field
            age: int = Field(
                title="Age",
                description="Your age in years",
                ge=0,
                le=150,
            )

            # Date field
            birth_date: date = Field(
                title="Birth Date",
                description="Select your date of birth",
            )

            # Boolean field
            subscribe: bool = Field(
                title="Subscribe to Newsletter",
                description="Check this box to receive our newsletter",
                default=False,
            )

            # Choice field
            preference: SimpleChoices = Field(
                title="Preference",
                description="Select your preference",
            )

        simple_form_data = yield SimpleForm

        return simple_form_data.model_dump()

    post_form(form_generator, state={}, user_inputs=form_data)
    return "OK!"
