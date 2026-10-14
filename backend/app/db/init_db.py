from datetime import datetime, timezone
import logging
from app.db.session import engine, SessionLocal, Base
from app.core.security import hash_password
from app.models.user import User
from app.models.creator import CreatorProfile, Skill, AITool, CreatorSkill
from app.models.portfolio import PortfolioItem, PortfolioTool
from app.models.verification import VerificationRecord
from app.models.brief import CreativeBrief

logger = logging.getLogger(__name__)

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Check if users already seeded
        existing_user = db.query(User).first()
        if existing_user:
            logger.info("Database already initialized with data.")
            return

        logger.info("Seeding initial demo data for AI Creator Marketplace...")

        # 1. Seed Skills
        skill_names = [
            "AI Filmmaking",
            "Prompt Engineering",
            "Motion Graphics",
            "Visual Effects (VFX)",
            "3D Character Gen",
            "Commercial Product Rendering",
            "Storyboarding & Animatics",
            "Neural Audio & Voiceover",
            "Cinematography & Lighting",
            "Color Grading"
        ]
        skills_map = {}
        for name in skill_names:
            sk = Skill(name=name)
            db.add(sk)
            skills_map[name] = sk
        db.flush()

        # 2. Seed AI Tools
        tools_data = [
            {"name": "Runway Gen-3 Alpha", "provider": "Runway", "category": "Video Generation"},
            {"name": "Midjourney v6", "provider": "Midjourney", "category": "Image Generation"},
            {"name": "Flux.1 Pro", "provider": "Black Forest Labs", "category": "Image Generation"},
            {"name": "Luma Dream Machine", "provider": "Luma AI", "category": "Video Generation"},
            {"name": "ComfyUI Node Graph", "provider": "Open Source", "category": "Workflow Automation"},
            {"name": "Kling AI", "provider": "Kuaishou", "category": "Video Generation"},
            {"name": "ElevenLabs Voice Sync", "provider": "ElevenLabs", "category": "Neural Audio"},
            {"name": "Topaz Video AI", "provider": "Topaz Labs", "category": "Upscaling & Enhancement"}
        ]
        tools_map = {}
        for t in tools_data:
            tool = AITool(name=t["name"], provider=t["provider"], category=t["category"])
            db.add(tool)
            tools_map[t["name"]] = tool
        db.flush()

        # 3. Seed Users & Creators
        # Creator 1: Elena Rostova
        c1_user = User(
            email="elena@creatorai.studio",
            password_hash=hash_password("password123"),
            role="CREATOR",
            is_active=True
        )
        db.add(c1_user)
        db.flush()

        c1_profile = CreatorProfile(
            user_id=c1_user.id,
            display_name="Elena Rostova",
            bio="Award-winning AI director & visual artist specializing in cinematic sci-fi storytelling and luxury automotive commercials. 4+ years exploring generative video workflows.",
            specialization="AI Filmmaking & Cinematic Commercials",
            experience_years=4,
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
        )
        c1_profile.skills.extend([
            skills_map["AI Filmmaking"],
            skills_map["Cinematography & Lighting"],
            skills_map["Color Grading"],
            skills_map["Prompt Engineering"]
        ])
        db.add(c1_profile)
        db.flush()

        # Portfolio Items for Elena
        p1 = PortfolioItem(
            creator_profile_id=c1_profile.id,
            title="Aura Horizon: Electric Hypercar Launch",
            description="High-concept commercial campaign featuring dynamic reflections, photorealistic aerodynamic particle simulations, and atmospheric twilight lighting.",
            content_type="video",
            media_url="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
            aspect_ratio="16:9",
            output_format="ProRes 422 HQ",
            workflow_description="Prompt engineering in Midjourney v6 for initial vehicle turnaround keys -> Depth maps extracted via ComfyUI -> Motion synthesis in Runway Gen-3 Alpha -> 4K upscaling via Topaz Video AI.",
            commercial_use_status="Commercial Ready"
        )
        db.add(p1)
        db.flush()

        db.add(PortfolioTool(portfolio_item_id=p1.id, tool_id=tools_map["Runway Gen-3 Alpha"].id, usage_description="Cinematic camera pans and vehicle motion"))
        db.add(PortfolioTool(portfolio_item_id=p1.id, tool_id=tools_map["Midjourney v6"].id, usage_description="Concept frame and lighting design"))
        db.add(PortfolioTool(portfolio_item_id=p1.id, tool_id=tools_map["Topaz Video AI"].id, usage_description="High-fidelity 4K grain and temporal stabilization"))

        p2 = PortfolioItem(
            creator_profile_id=c1_profile.id,
            title="Neon Biosphere: Synthetic Ecology",
            description="Short film exploring bioluminescent alien flora and microscopic organisms in an artificial planetary sanctuary.",
            content_type="animation",
            media_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
            aspect_ratio="9:16",
            output_format="MP4",
            workflow_description="Latent interpolation in ComfyUI driven by audio reactivity curves, paired with Kling AI for cellular morphing transitions.",
            commercial_use_status="Commercial Ready"
        )
        db.add(p2)
        db.flush()

        # Elena Verifications
        db.add(VerificationRecord(
            creator_profile_id=c1_profile.id,
            portfolio_item_id=p1.id,
            tool_id=tools_map["Runway Gen-3 Alpha"].id,
            verification_type="PORTFOLIO",
            status="VERIFIED",
            verification_method="Generation seed logs & raw timeline files inspected",
            verified_at=datetime.now(timezone.utc)
        ))
        db.add(VerificationRecord(
            creator_profile_id=c1_profile.id,
            tool_id=tools_map["Runway Gen-3 Alpha"].id,
            verification_type="TOOL",
            status="VERIFIED",
            verification_method="Official Runway Certified Creator Tier 1",
            verified_at=datetime.now(timezone.utc)
        ))

        # Creator 2: Marcus Vance
        c2_user = User(
            email="marcus@synthmotion.io",
            password_hash=hash_password("password123"),
            role="CREATOR",
            is_active=True
        )
        db.add(c2_user)
        db.flush()

        c2_profile = CreatorProfile(
            user_id=c2_user.id,
            display_name="Marcus Vance",
            bio="Motion graphics specialist crafting hyper-stylized 3D animations, music videos, and viral social assets with custom ComfyUI diffusion pipelines.",
            specialization="3D Generative Motion & VFX",
            experience_years=3,
            avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
        )
        c2_profile.skills.extend([
            skills_map["Motion Graphics"],
            skills_map["Visual Effects (VFX)"],
            skills_map["3D Character Gen"],
            skills_map["Prompt Engineering"]
        ])
        db.add(c2_profile)
        db.flush()

        p3 = PortfolioItem(
            creator_profile_id=c2_profile.id,
            title="Cybernetic Chrono Watch: Product Teaser",
            description="Mechanical watch disintegration and holographic assembly sequence for high-end luxury watchmaker.",
            content_type="video",
            media_url="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
            aspect_ratio="1:1",
            output_format="MP4",
            workflow_description="ControlNet depth conditioning combined with Flux.1 Pro to maintain product geometry precision across rotation frames.",
            commercial_use_status="Commercial Ready"
        )
        db.add(p3)
        db.flush()

        db.add(PortfolioTool(portfolio_item_id=p3.id, tool_id=tools_map["Flux.1 Pro"].id, usage_description="Geometric watch face reconstruction"))
        db.add(PortfolioTool(portfolio_item_id=p3.id, tool_id=tools_map["ComfyUI Node Graph"].id, usage_description="Custom ControlNet depth animation pipeline"))

        db.add(VerificationRecord(
            creator_profile_id=c2_profile.id,
            tool_id=tools_map["ComfyUI Node Graph"].id,
            verification_type="WORKFLOW",
            status="VERIFIED",
            verification_method="Verified GitHub repository and node configuration audit",
            verified_at=datetime.now(timezone.utc)
        ))

        # Creator 3: Sarah Lin
        c3_user = User(
            email="sarah@luxegenerative.com",
            password_hash=hash_password("password123"),
            role="CREATOR",
            is_active=True
        )
        db.add(c3_user)
        db.flush()

        c3_profile = CreatorProfile(
            user_id=c3_user.id,
            display_name="Sarah Lin",
            bio="Fashion and cosmetics visual director. Crafting ethereal, photorealistic product imagery and runway animations for global beauty brands.",
            specialization="AI Fashion & Commercial Product Visuals",
            experience_years=5,
            avatar_url="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
        )
        c3_profile.skills.extend([
            skills_map["Commercial Product Rendering"],
            skills_map["Cinematography & Lighting"],
            skills_map["Storyboarding & Animatics"]
        ])
        db.add(c3_profile)
        db.flush()

        p4 = PortfolioItem(
            creator_profile_id=c3_profile.id,
            title="Silk & Radiance: Skincare Serum Campaign",
            description="Ultra-clean macro droplets, flowing silk fabric physics, and minimalist studio lighting for premium organic skincare.",
            content_type="image",
            media_url="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80",
            aspect_ratio="4:5",
            output_format="PNG",
            workflow_description="Flux.1 Pro coupled with Luma Dream Machine for seamless macro fluid transitions and tactile skin textures.",
            commercial_use_status="Commercial Ready"
        )
        db.add(p4)
        db.flush()

        db.add(PortfolioTool(portfolio_item_id=p4.id, tool_id=tools_map["Flux.1 Pro"].id, usage_description="Hyper-detailed cosmetic texture synthesis"))
        db.add(PortfolioTool(portfolio_item_id=p4.id, tool_id=tools_map["Luma Dream Machine"].id, usage_description="Liquid droplet fluid dynamics motion"))

        # Brand User
        brand_user = User(
            email="brand@apexcreatives.com",
            password_hash=hash_password("password123"),
            role="BRAND",
            is_active=True
        )
        db.add(brand_user)
        db.flush()

        # Seed Sample Brief for Brand User
        b1 = CreativeBrief(
            brand_user_id=brand_user.id,
            title="Lumina Glow: Summer 2026 Beauty Campaign",
            original_idea="Create a series of 15-second ethereal AI video ads showcasing hydration and sunshine aesthetics for social media.",
            objective="Drive awareness for the new sunscreen serum with vibrant, solar-inspired AI visuals.",
            content_type=["video", "animation"],
            visual_style="Warm, sun-drenched, high-fashion minimalism",
            aspect_ratio="9:16",
            output_format="MP4 4K",
            quantity=3,
            target_audience="Gen-Z and Millennials interested in conscious luxury skincare",
            commercial_use_required=True,
            licensing_requirements="Full global commercial digital rights for 12 months across Instagram, TikTok, and YouTube.",
            additional_requirements="Must adhere strictly to brand color hex codes #FFD166 and #EF476F.",
            status="PUBLISHED"
        )
        db.add(b1)

        db.commit()
        logger.info("Successfully seeded database with demo creators, portfolios, and briefs!")
    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding database: {e}")
        raise
    finally:
        db.close()
