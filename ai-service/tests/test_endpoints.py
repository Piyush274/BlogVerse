from fastapi.testclient import TestClient
from app.main import app
from app.config import settings

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "healthy"}

def test_unauthorized_endpoints():
    # Set key to enforce authorization
    settings.internal_api_key = "secure-test-key"
    
    # Try outline endpoint without header
    res = client.post("/ai/generate-outline", json={"topic": "React Hooks"})
    assert res.status_code == 403
    
    # Try outline endpoint with incorrect header
    headers = {"X-Internal-API-Key": "wrong-key"}
    res = client.post("/ai/generate-outline", headers=headers, json={"topic": "React Hooks"})
    assert res.status_code == 403

def test_authorized_endpoints_mock_llm():
    settings.internal_api_key = "secure-test-key"
    headers = {"X-Internal-API-Key": "secure-test-key"}
    
    # Test generation schema validation failures
    res = client.post("/ai/generate-outline", headers=headers, json={"topic": "Short"})
    # Since min_length for topic is 5, "Short" is 5 chars, wait. Topic must be >= 5. "Short" is 5 characters, so it should succeed.
    # Let's test with a 2-char topic which should fail validation.
    res2 = client.post("/ai/generate-outline", headers=headers, json={"topic": "Hi"})
    assert res2.status_code == 422 # Unprocessable Entity
