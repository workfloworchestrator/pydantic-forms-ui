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
        }
    ]

    response = client.post("/form-simple", json=form_data)
    assert response.status_code == 200
    assert response.json() == "OK!"



def test_form_simple_schema_has_no_layout():
    """The simple form stacks all fields, none of them has a layout."""
    response = client.post("/form-simple", json=[])
    assert response.status_code == 510

    properties = response.json()["form"]["properties"]
    assert all("layout" not in field for field in properties.values())
