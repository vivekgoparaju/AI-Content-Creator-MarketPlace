import re
import json
import logging
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from app.models.brief import AIBriefGeneration
from app.schemas.ai_brief import AIBriefRequest, AIBriefResponse, SuggestedBriefData
from app.core.config import settings
import httpx

logger = logging.getLogger(__name__)

class AIBriefService:
    @staticmethod
    async def generate_brief(db: Session, brand_user_id: int, request: AIBriefRequest) -> AIBriefResponse:
        idea = request.idea.strip()
        context = request.additional_context

        # Check if external AI provider is configured
        if settings.AI_API_KEY and settings.AI_PROVIDER in ["gemini", "openai", "claude"]:
            try:
                ai_result = await AIBriefService._call_external_ai(idea, context)
                if ai_result:
                    db_gen = AIBriefGeneration(
                        brand_user_id=brand_user_id,
                        original_idea=idea,
                        generated_brief=ai_result.model_dump(),
                        model_name=f"{settings.AI_PROVIDER}-{settings.AI_MODEL}",
                        status="SUCCESS"
                    )
                    db.add(db_gen)
                    db.commit()
                    return AIBriefResponse(suggested_brief=ai_result, provider_used=f"{settings.AI_PROVIDER} (Live API)")
            except Exception as e:
                logger.warning(f"External AI provider failed, falling back to local heuristic extractor: {e}")

        # Local intelligent heuristic NLP brief generator
        suggested = AIBriefService._heuristic_brief_generator(idea, context)

        try:
            db_gen = AIBriefGeneration(
                brand_user_id=brand_user_id,
                original_idea=idea,
                generated_brief=suggested.model_dump(),
                model_name="creatorai-native-heuristic-v1",
                status="SUCCESS"
            )
            db.add(db_gen)
            db.commit()
        except Exception as e:
            logger.warning(f"Could not persist generation log: {e}")

        return AIBriefResponse(
            suggested_brief=suggested,
            provider_used="CreatorAI Semantic Brief Engine"
        )

    @staticmethod
    def _heuristic_brief_generator(idea: str, context: Optional[Any]) -> SuggestedBriefData:
        lower = idea.lower()

        # 1. Content types
        content_types = []
        if any(w in lower for w in ["video", "clip", "film", "commercial", "teaser", "trailer", "short"]):
            content_types.append("video")
        if any(w in lower for w in ["animation", "animated", "morphing", "cell"]):
            content_types.append("animation")
        if any(w in lower for w in ["motion graphic", "kinetic", "typography", "vfx"]):
            content_types.append("motion_graphics")
        if any(w in lower for w in ["image", "photo", "still", "poster", "render", "visual"]):
            content_types.append("image")
        if any(w in lower for w in ["3d", "character", "cgi"]):
            content_types.append("3d_gen")
        if not content_types:
            content_types = ["video"]

        # 2. Aspect ratio detection
        aspect_ratio = None
        if context and context.aspect_ratio:
            aspect_ratio = context.aspect_ratio
        elif any(w in lower for w in ["reels", "tiktok", "shorts", "vertical", "9:16", "story", "stories"]):
            aspect_ratio = "9:16"
        elif any(w in lower for w in ["youtube", "horizontal", "widescreen", "cinema", "cinematic", "16:9", "tv"]):
            aspect_ratio = "16:9"
        elif any(w in lower for w in ["square", "1:1", "feed"]):
            aspect_ratio = "1:1"
        elif any(w in lower for w in ["portrait", "4:5"]):
            aspect_ratio = "4:5"

        # 3. Visual style extraction
        styles = []
        style_keywords = {
            "cinematic": ["cinematic", "movie", "film look", "dramatic lighting", "anamorphic"],
            "futuristic / sci-fi": ["futuristic", "sci-fi", "cyberpunk", "high-tech", "cybernetic", "neon"],
            "clean luxury / minimal": ["luxury", "clean", "minimal", "minimalist", "sleek", "premium", "elegant"],
            "photorealistic commercial": ["photorealistic", "macro", "commercial", "studio lighting", "product render"],
            "surreal / dreamlike": ["surreal", "dreamlike", "ethereal", "fantasy", "abstract"],
            "vibrant & dynamic": ["vibrant", "colorful", "energetic", "bold", "dynamic", "pop"]
        }
        for style_name, kw_list in style_keywords.items():
            if any(k in lower for k in kw_list):
                styles.append(style_name)
        visual_style = ", ".join(styles) if styles else "Modern Commercial Generative Aesthetic"

        # 4. Title generation
        cleaned = re.sub(r"^(create|build|make|generate|need|we want)\s+(a|an|the)?\s*", "", idea, flags=re.IGNORECASE)
        m = re.search(r"for\s+(?:a\s+|an\s+|the\s+|new\s+)?([A-Za-z0-9\s\-]+?)(?:\s+launch|\s+with|\s+for|\s+on|\.|$)", cleaned, re.IGNORECASE)
        if m and len(m.group(1).strip().split()) <= 4:
            subject = m.group(1).strip().title()
            title = f"{subject} Campaign"
        else:
            words = [w for w in cleaned.split() if w.lower() not in ["for", "a", "an", "the", "with", "in", "to", "of"]]
            title = " ".join(words[:5]).title()
            if not any(title.endswith(s) for s in ["Campaign", "Launch", "Video", "Commercial", "Visuals"]):
                title = f"{title} Campaign"

        # 5. Objective
        objective = f"Produce compelling AI-native creative assets based on: \"{idea.strip()}\""
        if "launch" in lower or "introduce" in lower:
            objective = "Establish high market impact and visual intrigue for the product launch through premium AI visuals."
        elif "brand" in lower or "awareness" in lower:
            objective = "Elevate brand perception and cultural resonance through distinctive generative storytelling."

        # 6. Target Audience
        target_audience = None
        if any(w in lower for w in ["gen z", "gen-z", "youth", "teen"]):
            target_audience = "Gen-Z digital natives and trend-conscious consumers"
        elif any(w in lower for w in ["luxury", "high-end", "affluent"]):
            target_audience = "Affluent consumers looking for discerning quality and innovation"
        elif any(w in lower for w in ["tech", "developer", "gamer"]):
            target_audience = "Tech enthusiasts, digital creators, and early adopters"

        # 7. Quantity
        quantity = 1
        qty_match = re.search(r"(\d+)\s*(videos?|assets?|deliverables?|stills?|spots?|clips?)", lower)
        if qty_match:
            try:
                quantity = int(qty_match.group(1))
            except ValueError:
                quantity = 1

        # 8. Commercial use & licensing (DO NOT INVENT)
        commercial_use_required = None
        licensing_requirements = None
        if "commercial" in lower or "ad" in lower or "client" in lower:
            commercial_use_required = True
            licensing_requirements = "Full commercial digital usage rights for paid distribution."

        # 9. Missing information detection
        missing_info = []
        if not aspect_ratio:
            missing_info.append("Aspect Ratio / Target Delivery Platform (e.g. 9:16 vertical or 16:9 widescreen)")
        if not target_audience:
            missing_info.append("Specific Target Audience Demographics & Psychographics")
        if commercial_use_required is None:
            missing_info.append("Commercial-use Rights & Licensing Confirmation (organic vs paid media)")
        missing_info.append("Master Delivery Output Format (e.g. ProRes 422 HQ, MP4 4K, or Uncompressed PNG)")
        missing_info.append("Production Timeline & Final Delivery Deadline")

        ai_suggestions = {
            "recommended_tools": "Runway Gen-3 Alpha, Midjourney v6, Flux.1 Pro, Luma Dream Machine",
            "production_note": "Consider requesting depth-mapped turnaround plates to ensure subject identity consistency."
        }

        return SuggestedBriefData(
            title=title,
            objective=objective,
            content_type=content_types,
            visual_style=visual_style,
            aspect_ratio=aspect_ratio,
            output_format=None,
            quantity=quantity,
            target_audience=target_audience,
            commercial_use_required=commercial_use_required,
            licensing_requirements=licensing_requirements,
            additional_requirements=None,
            missing_information=missing_info,
            ai_suggestions=ai_suggestions
        )

    @staticmethod
    async def _call_external_ai(idea: str, context: Optional[Any]) -> Optional[SuggestedBriefData]:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.AI_MODEL}:generateContent?key={settings.AI_API_KEY}"
        system_instruction = (
            "You are an expert creative director in generative AI video and creative advertising. "
            "Convert the user's rough creative concept into a structured creative brief. "
            "Return valid JSON matching this schema: "
            "{title, objective, content_type: string[], visual_style, aspect_ratio, output_format, "
            "quantity: int, target_audience, commercial_use_required: bool or null, "
            "licensing_requirements, additional_requirements, missing_information: string[]}. "
            "CRITICAL: Never invent missing licensing or commercial requirements. If unspecified, set to null and add to missing_information."
        )
        prompt = f"Concept: {idea}\nContext: {context.model_dump_json() if context else 'None'}"
        payload = {
            "contents": [{"parts": [{"text": f"{system_instruction}\n\n{prompt}"}]}],
            "generationConfig": {"response_mime_type": "application/json"}
        }
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                parsed = json.loads(text)
                return SuggestedBriefData(**parsed)
        return None
