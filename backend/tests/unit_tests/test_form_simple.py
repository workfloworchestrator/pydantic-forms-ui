from fastapi.testclient import TestClient

from main import app

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


def test_form_simple_schema_places_fields_next_to_textarea():
    response = client.post("/form-simple", json=[])

    properties = response.json()["form"]["properties"]
    assert properties["contact_method"]["layout"] == {"span": 3}
    assert properties["preference"]["layout"] == {"span": 3}
    assert properties["subscribe"]["layout"] == {"span": 6}
