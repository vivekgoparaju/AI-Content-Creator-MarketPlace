import sys
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "healthy"}

def test_auth_login():
    # Login with seeded demo brand
    res = client.post("/api/v1/auth/login", json={
        "email": "brand@apexcreatives.com",
        "password": "password123"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "BRAND"

def test_auth_creator_login():
    # Login with seeded creator Elena
    res = client.post("/api/v1/auth/login", json={
        "email": "elena@creatorai.studio",
        "password": "password123"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["user"]["role"] == "CREATOR"

def test_creator_discovery_search():
    # Search for filmmakers
    res = client.get("/api/v1/creators?q=Elena")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] >= 1
    creators = data["creators"]
    assert any(c["display_name"] == "Elena Rostova" for c in creators)

def test_creator_discovery_filter_tool():
    # Filter by Runway
    res = client.get("/api/v1/creators?tool=Runway")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] >= 1
    assert any("Runway" in t for c in data["creators"] for t in c["tools"])

def test_creator_discovery_empty_state():
    # Filter with non-existent query
    res = client.get("/api/v1/creators?q=NonExistentCreator12345")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] == 0
    assert len(data["creators"]) == 0

def test_creator_profile_detail():
    # Get Elena's profile
    res = client.get("/api/v1/creators/1")
    assert res.status_code == 200
    data = res.json()
    assert data["display_name"] == "Elena Rostova"
    assert len(data["portfolio_items"]) >= 1
    assert len(data["verification_records"]) >= 1

def test_ai_brief_builder():
    # Call AI Brief Builder
    res = client.post("/api/v1/ai/brief-builder", json={
        "idea": "Create a premium 20-second cinematic product video for a new luxury electric hypercar launch with futuristic lighting for YouTube widescreen."
    })
    assert res.status_code == 200
    data = res.json()
    suggested = data["suggested_brief"]
    assert "Hypercar" in suggested["title"] or "Electric" in suggested["title"] or "Car" in suggested["title"] or "Launch" in suggested["title"]
    assert "video" in suggested["content_type"]
    assert suggested["aspect_ratio"] == "16:9"
    # Verify missing information is explicitly identified per specifications
    assert len(suggested["missing_information"]) > 0
    assert "Production Timeline & Final Delivery Deadline" in suggested["missing_information"] or any("Timeline" in m for m in suggested["missing_information"])

def test_brand_brief_management():
    # Login as brand
    login_res = client.post("/api/v1/auth/login", json={
        "email": "brand@apexcreatives.com",
        "password": "password123"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # List briefs
    list_res = client.get("/api/v1/briefs", headers=headers)
    assert list_res.status_code == 200
    briefs = list_res.json()
    assert len(briefs) >= 1

    # Create new brief
    create_res = client.post("/api/v1/briefs", json={
        "title": "Quantum AI Headset Campaign",
        "original_idea": "3D holographic animations showing brain-computer interface interactions.",
        "objective": "Pre-order launch teaser",
        "content_type": ["animation", "3d_gen"],
        "visual_style": "Cyberpunk Neon",
        "aspect_ratio": "9:16",
        "commercial_use_required": True,
        "status": "DRAFT"
    }, headers=headers)
    assert create_res.status_code == 201
    created_brief = create_res.json()
    assert created_brief["title"] == "Quantum AI Headset Campaign"
    assert created_brief["commercial_use_required"] is True

    # Update brief
    brief_id = created_brief["id"]
    update_res = client.put(f"/api/v1/briefs/{brief_id}", json={
        "title": "Quantum AI Headset Commercial — Final"
    }, headers=headers)
    assert update_res.status_code == 200
    assert update_res.json()["title"] == "Quantum AI Headset Commercial — Final"

    # Delete brief
    del_res = client.delete(f"/api/v1/briefs/{brief_id}", headers=headers)
    assert del_res.status_code == 204
