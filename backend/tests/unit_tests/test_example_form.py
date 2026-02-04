import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_read_root():
    """Test the root endpoint returns expected response."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"Hello": "World"}

def test_form_empty_data():
    """Test form endpoint with empty form data."""
    response = client.post("/form")
    assert response.status_code == 510  # Validation error expected
    # The form generator expects to yield the first form, so empty data should fail

def test_form_first_page_valid_data():
    """Test form endpoint with valid data for first page."""
    form_data = [
        {
            "number": 18,  # Valid: multiple of 3, between 18-99
            "test": "hello",  # Valid: 2-10 chars
        }
    ]
    response = client.post("/form", json=form_data)
    assert response.status_code == 510  # Should fail as we need more pages

def test_form_first_page_invalid_number():
    """Test form with invalid number (not multiple of 3)."""
    form_data = [
        {
            "number": 19,  # Invalid: not multiple of 3
            "test": "hello",
        }
    ]
    response = client.post("/form", json=form_data)
    assert response.status_code == 400

def test_form_first_page_invalid_number_validation():
    """Test form with number that fails custom validation (value == 9)."""
    form_data = [
        {
            "number": 9,  # Invalid: custom validator rejects 9
            "test": "hello",
        }
    ]
    response = client.post("/form", json=form_data)
    assert response.status_code == 400

def test_form_first_page_invalid_test_string_too_short():
    """Test form with test string that's too short."""
    form_data = [
        {
            "number": 18,
            "test": "a",  # Invalid: min_length is 2
        }
    ]
    response = client.post("/form", json=form_data)
    assert response.status_code == 400

def test_form_first_page_invalid_test_string_too_long():
    """Test form with test string that's too long."""
    form_data = [
        {
            "number": 18,
            "test": "this is way too long for validation",  # Invalid: max_length is 10
        }
    ]
    response = client.post("/form", json=form_data)
    assert response.status_code == 400

def test_form_two_pages_valid_data():
    """Test form endpoint with valid data for first two pages."""
    form_data = [
        {
            "number": 21,  # Valid: multiple of 3, between 18-99
            "test": "valid",
        },
        {
            "contact_name2": {
                "name": "John Doe",
                "age": 30,  # Valid: multiple of 3, between 18-99
                "education": {"degree": "BSc", "years": 4},
            },
            "options": "1",  # Valid choice from ListChoices
        },
    ]
    response = client.post("/form", json=form_data)
    assert response.status_code == 510  # Should fail as we need more pages

def test_form_complete_valid_data():
    """Test form endpoint with valid data for all pages."""
    form_data = [
        # Page 1
        {
            "number": 21,
            "test": "valid",
        },
        # Page 2
        {
            "contact_name2": {
                "name": "John Doe",
                "age": 30,
                "education": {"degree": "BSc", "years": 4},
            },
            "options": "1",
        },
        # Page 3
        {
            "contact_name3": {
                "name": "Jane Smith",
                "age": 27,
                "education": {
                    "degree": "MSc",
                    "years": 2,
                    "options": "2",
                    "languages": [18, 21],  # Valid list of multiples of 3
                },
            },
            "age": 24,
        },
        # Page 4
        {
            "contact_person": {
                "name": "Bob Wilson",
                "age": 33,
                "education": {"degree": "PhD", "years": 5},
            },
        },
        # Page 5
        {
            "contact_person_list": [
                {
                    "name": "Alice Brown",
                    "age": 36,
                    "education": {"degree": "BSc", "years": 4},
                },
                {
                    "name": "Charlie Davis",
                    "age": 42,
                    "education": {"degree": "MSc", "years": 2},
                },
            ],
        },
    ]
    response = client.post("/form", json=form_data)
    assert response.status_code == 200
    assert response.json() == "OK!"

def test_form_invalid_age_in_nested_object():
    """Test form with invalid age in nested Person object."""
    form_data = [
        {
            "number": 21,
            "test": "valid",
        },
        {
            "contact_name2": {
                "name": "John Doe",
                "age": 31,  # Invalid: not multiple of 3
                "education": {"degree": "BSc", "years": 4},
            },
            "options": "1",
        },
    ]
    response = client.post("/form", json=form_data)
    assert response.status_code == 400

def test_form_invalid_list_too_few_items():
    """Test form with list that has too few items."""
    form_data = [
        {
            "number": 21,
            "test": "valid",
        },
        {
            "contact_name2": {
                "name": "John Doe",
                "age": 30,
                "education": {"degree": "BSc", "years": 4},
            },
            "options": "1",
        },
        {
            "contact_name3": {
                "name": "Jane Smith",
                "age": 27,
                "education": {
                    "degree": "MSc",
                    "years": 2,
                    "options": "2",
                    "languages": [18],  # Invalid: min_items is 2
                },
            },
            "age": 24,
        },
    ]
    response = client.post("/form", json=form_data)
    assert response.status_code == 400

def test_form_invalid_choice_value():
    """Test form with invalid choice value."""
    form_data = [
        {
            "number": 21,
            "test": "valid",
        },
        {
            "contact_name2": {
                "name": "John Doe",
                "age": 30,
                "education": {"degree": "BSc", "years": 4},
            },
            "options": "99",  # Invalid: not in ListChoices
        },
    ]
    response = client.post("/form", json=form_data)
    assert response.status_code == 400
