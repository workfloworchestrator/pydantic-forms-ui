from typing import Annotated

import pytest
from fastapi.testclient import TestClient
from pydantic import BaseModel

from main import Layout, app

client = TestClient(app)


def test_form_simple_complete_happy_path():
    """Test the simple form endpoint with valid scalar field data."""
    form_data = [
        {
            "full_name": "Jane Smith",
            "comments": "This is a long text comment with multiple sentences. "
            "I wanted to provide detailed feedback about the service. "
            "Overall, I am very satisfied with the experience.",
            "age": 28,
            "birth_date": "1996-03-15",
            "subscribe": True,
            "preference": "b",  # Option B
            "contact_method": "email",
        }
    ]

    response = client.post("/form-simple", json=form_data)
    assert response.status_code == 200
    assert response.json() == "OK!"


def test_form_simple_schema_contains_layout():
    """Fields annotated with Layout expose it in the JSON schema."""
    response = client.post("/form-simple", json=[])
    assert response.status_code == 510

    properties = response.json()["form"]["properties"]
    assert properties["full_name"]["layout"] == {"span": 6}
    assert properties["age"]["layout"] == {"span": 3}
    assert properties["comments"]["layout"] == {"span": 6, "rowSpan": 2}


def test_layout_json_schema_leaves_out_unset_options():
    class LayoutForm(BaseModel):
        name: Annotated[str, Layout(span=6, new_row=True, align="end")]
        city: Annotated[str, Layout(start=4)]
        full: Annotated[str, Layout()]
        tall: Annotated[str, Layout(span=6, row_span=2)]

    properties = LayoutForm.model_json_schema()["properties"]
    assert properties["name"]["layout"] == {
        "span": 6,
        "newRow": True,
        "align": "end",
    }
    assert properties["city"]["layout"] == {"start": 4}
    assert "layout" not in properties["full"]
    assert properties["tall"]["layout"] == {"span": 6, "rowSpan": 2}


def test_form_simple_schema_places_fields_next_to_textarea():
    response = client.post("/form-simple", json=[])

    properties = response.json()["form"]["properties"]
    assert properties["contact_method"]["layout"] == {"span": 3}
    assert properties["preference"]["layout"] == {"span": 3}
    assert properties["subscribe"]["layout"] == {"span": 6}


@pytest.mark.parametrize(
    "kwargs",
    [
        {"span": 0},
        {"span": 13},
        {"start": 0},
        {"start": 13},
        {"start": 10, "span": 6},
        {"row_span": 0},
    ],
)
def test_layout_rejects_positions_outside_the_grid(kwargs):
    with pytest.raises(ValueError):
        Layout(**kwargs)
