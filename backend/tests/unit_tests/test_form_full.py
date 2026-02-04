import base64
import json

from fastapi.testclient import TestClient

from demo import app

client = TestClient(app)


def test_form_full_complete_happy_path():
    """Test the complete form_full endpoint with valid data for all 9 pages."""
    form_data = [
        # Page 1: Basic Types - Strings and Numbers
        {
            "full_name": "John Doe Smith",
            "bio": "This is a short biography about myself and my interests in technology.",
            "age": 30,
            "height": 1.75,
            "balance": "1234.56",
        },
        # Page 2: Choices - Boolean, Enum, and Literal
        {
            "accept_terms": True,
            "newsletter": False,
            "favorite_color": "#2563EB",  # BLUE from Colors enum
            "experience_level": "intermediate",
        },
        # Page 3: Date and Time Types
        {
            "birth_date": "1994-01-15",
            "appointment_time": "2024-06-15T14:30:00",
            "preferred_time": "09:00:00",
            "session_duration": "PT2H30M",  # 2 hours 30 minutes
        },
        # Page 4: Special Validation Types
        {
            "email": "john.doe@example.com",
            "website": "https://www.example.com",
            "ip_address": "192.168.1.1",
            "user_id": "550e8400-e29b-41d4-a716-446655440000",
            "file_path": "/home/user/config.json",
        },
        # Page 5: Collection Types - Lists, Dicts, Sets
        {
            "tags": ["python", "javascript", "react"],
            "scores": [85, 90, 78, 92],
            "metadata": {"department": "engineering", "role": "developer"},
            "unique_skills": ["Python", "FastAPI", "React", "TypeScript"],
            "coordinates": [40.7128, -74.0060],  # NYC coordinates
        },
        # Page 6: Optional and Union Types
        {
            "middle_name": "Alexander",
            "phone": "+1-555-123-4567",
            "reference_id": "REF123456",
        },
        # Page 7: Nested Objects and Complex Types
        {
            "address": {
                "street": "123 Main Street",
                "city": "New York",
                "postal_code": "10001",
                "country": "USA",
            },
            "education_history": [
                {
                    "degree": "Bachelor of Science",
                    "institution": "MIT",
                    "year": 2016,
                },
                {
                    "degree": "Master of Science",
                    "institution": "Stanford University",
                    "year": 2018,
                },
            ],
        },
        # Page 8: Constrained Types with Validation
        {
            "username": "john_doe_2024",
            "rating": 4,
            "percentage": 87.5,
            "priority_list": [1, 2, 3],
        },
        # Page 9: Advanced Types - JSON and Bytes
        {
            "json_config": json.dumps({"key1": "value1", "key2": "value2", "nested": {"key3": "value3"}}),
            "file_content": base64.b64encode(b"This is binary content").decode("utf-8"),
        },
    ]

    response = client.post("/form-full", json=form_data)
    assert response.status_code == 200
    assert response.json() == "OK!"
