import httpx

BASE_URL = "http://127.0.0.1:8000/api/v1"

def run_e2e():
    print("--- 1. Testing Creator Registration & Login ---")
    reg_data = {
        "email": "alex.vfx@creatorai.studio",
        "password": "securepassword123",
        "role": "CREATOR",
        "display_name": "Alex Mercer",
        "specialization": "Generative VFX & Motion"
    }
    r = httpx.post(f"{BASE_URL}/auth/register", json=reg_data)
    assert r.status_code in [201, 409], f"Reg failed: {r.status_code} {r.text}"
    
    # Login
    r_login = httpx.post(f"{BASE_URL}/auth/login", json={
        "email": reg_data["email"],
        "password": reg_data["password"]
    })
    assert r_login.status_code == 200, f"Login failed: {r_login.text}"
    creator_token = r_login.json()["access_token"]
    creator_headers = {"Authorization": f"Bearer {creator_token}"}
    print("[OK] Creator logged in successfully. Token acquired.")

    print("--- 2. Testing Creator Profile & Portfolio Management ---")
    r_prof = httpx.get(f"{BASE_URL}/creators/me", headers=creator_headers)
    assert r_prof.status_code == 200
    print(f"[OK] Profile retrieved: {r_prof.json()['display_name']}")

    # Update profile
    r_update = httpx.put(f"{BASE_URL}/creators/me", json={
        "bio": "Specialist in neural particle fields and volumetric lighting.",
        "skill_names": ["AI Filmmaking", "Visual Effects (VFX)", "Prompt Engineering"]
    }, headers=creator_headers)
    assert r_update.status_code == 200
    print("[OK] Profile updated with skills.")

    # Create portfolio item
    r_port = httpx.post(f"{BASE_URL}/portfolio", json={
        "title": "Quantum Nebula: Particle Simulation",
        "description": "Volumetric particle fields synthesized with custom ComfyUI diffusion graph.",
        "content_type": "motion_graphics",
        "media_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
        "aspect_ratio": "16:9",
        "output_format": "ProRes 422",
        "workflow_description": "Depth conditioning -> AnimateDiff interpolation -> 4K upscaling.",
        "commercial_use_status": "Commercial Ready",
        "tools": [{"tool_name": "ComfyUI Node Graph", "usage_description": "Custom particle graph"}]
    }, headers=creator_headers)
    assert r_port.status_code == 201
    port_id = r_port.json()["id"]
    print(f"[OK] Portfolio item created (ID: {port_id}).")

    print("--- 3. Testing Discovery & Multi-Category Filtering ---")
    # Search all
    r_all = httpx.get(f"{BASE_URL}/creators")
    assert r_all.status_code == 200
    assert r_all.json()["total"] >= 1
    print(f"[OK] Total creators indexed: {r_all.json()['total']}")

    # Filter by tool Runway
    r_tool = httpx.get(f"{BASE_URL}/creators?tool=Runway")
    assert r_tool.status_code == 200
    assert r_tool.json()["total"] >= 1
    print(f"[OK] Filter by Runway Gen-3: {r_tool.json()['total']} matches.")

    # Filter by verified only
    r_verif = httpx.get(f"{BASE_URL}/creators?verified_only=true")
    assert r_verif.status_code == 200
    assert r_verif.json()["total"] >= 1
    print(f"[OK] Filter by Verified Creators: {r_verif.json()['total']} matches.")

    print("--- 4. Testing AI Brief Studio ---")
    r_ai = httpx.post(f"{BASE_URL}/ai/brief-builder", json={
        "idea": "Create a 15-second ethereal hydration serum video for a beauty brand on Instagram Reels.",
        "additional_context": {"aspect_ratio": "9:16"}
    })
    assert r_ai.status_code == 200
    ai_data = r_ai.json()["suggested_brief"]
    assert "video" in ai_data["content_type"]
    assert ai_data["aspect_ratio"] == "9:16"
    assert len(ai_data["missing_information"]) > 0
    print(f"[OK] AI Brief Generated: \"{ai_data['title']}\"")
    print(f"[OK] Missing requirements flagged: {ai_data['missing_information']}")

    print("--- 5. Testing Brand Creative Brief CRUD & Ownership ---")
    # Brand login
    r_brand_login = httpx.post(f"{BASE_URL}/auth/login", json={
        "email": "brand@apexcreatives.com",
        "password": "password123"
    })
    brand_token = r_brand_login.json()["access_token"]
    brand_headers = {"Authorization": f"Bearer {brand_token}"}

    # Brand creates brief from AI suggestion
    r_brief_create = httpx.post(f"{BASE_URL}/briefs", json={
        "title": ai_data["title"],
        "original_idea": "Ethereal hydration serum beauty commercial",
        "objective": ai_data["objective"],
        "content_type": ai_data["content_type"],
        "visual_style": ai_data["visual_style"],
        "aspect_ratio": ai_data["aspect_ratio"],
        "output_format": "ProRes 422 HQ",
        "quantity": 1,
        "commercial_use_required": True,
        "status": "PUBLISHED"
    }, headers=brand_headers)
    assert r_brief_create.status_code == 201
    brief_id = r_brief_create.json()["id"]
    print(f"[OK] Brand saved brief to persistent database (ID: {brief_id}).")

    # Verify authorization: Creator cannot edit brand's brief
    r_unauth = httpx.put(f"{BASE_URL}/briefs/{brief_id}", json={"title": "Hacked Title"}, headers=creator_headers)
    assert r_unauth.status_code == 403
    print("[OK] Backend authorization verified: Creator blocked from editing Brand's brief (403 Forbidden).")

    print("\n==========================================")
    print("ALL END-TO-END SYSTEM JOURNEYS VERIFIED!")
    print("==========================================")

if __name__ == "__main__":
    run_e2e()
