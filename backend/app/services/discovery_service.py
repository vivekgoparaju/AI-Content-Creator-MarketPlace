from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func
from app.models.creator import CreatorProfile, Skill, AITool, CreatorSkill
from app.models.portfolio import PortfolioItem, PortfolioTool
from app.models.verification import VerificationRecord
from app.schemas.creator import CreatorCardResponse, PortfolioItemSummary, PortfolioToolResponse, VerificationResponse, AIToolResponse

class DiscoveryService:
    @staticmethod
    def search_creators(
        db: Session,
        query: Optional[str] = None,
        skill: Optional[str] = None,
        specialization: Optional[str] = None,
        tool: Optional[str] = None,
        content_type: Optional[str] = None,
        verified_only: Optional[bool] = False,
        page: int = 1,
        page_size: int = 12
    ) -> Dict[str, Any]:
        # Base query on CreatorProfile
        q = db.query(CreatorProfile)

        # Keyword filter
        if query:
            clean_q = f"%{query.strip()}%"
            q = q.filter(
                or_(
                    CreatorProfile.display_name.ilike(clean_q),
                    CreatorProfile.bio.ilike(clean_q),
                    CreatorProfile.specialization.ilike(clean_q)
                )
            )

        # Specialization filter
        if specialization:
            q = q.filter(CreatorProfile.specialization.ilike(f"%{specialization.strip()}%"))

        # Skill filter
        if skill:
            skill_clean = skill.strip()
            q = q.join(CreatorProfile.skills).filter(Skill.name.ilike(f"%{skill_clean}%"))

        # Tool filter
        if tool:
            tool_clean = tool.strip()
            # Must have a portfolio item using this tool
            q = q.join(CreatorProfile.portfolio_items).join(PortfolioItem.tools).join(PortfolioTool.tool).filter(
                AITool.name.ilike(f"%{tool_clean}%")
            )

        # Content type filter
        if content_type:
            ct_clean = content_type.strip().lower()
            q = q.join(CreatorProfile.portfolio_items).filter(
                PortfolioItem.content_type.ilike(f"%{ct_clean}%")
            )

        # Verified only filter
        if verified_only:
            q = q.join(CreatorProfile.verification_records).filter(
                VerificationRecord.status == "VERIFIED"
            )

        # Distinct creator profiles to prevent duplicate rows from joins
        q = q.distinct()

        total = q.count()
        offset = max(0, (page - 1) * page_size)
        profiles = q.offset(offset).limit(page_size).all()

        results = []
        for p in profiles:
            skill_names = [s.name for s in p.skills]
            
            # Collect unique tools from portfolio items
            tool_names_set = set()
            sample_portfolios = []
            for item in p.portfolio_items:
                tool_list = []
                for pt in item.tools:
                    tool_names_set.add(pt.tool.name)
                    tool_list.append(PortfolioToolResponse(
                        tool=AIToolResponse(
                            id=pt.tool.id,
                            name=pt.tool.name,
                            provider=pt.tool.provider,
                            category=pt.tool.category
                        ),
                        usage_description=pt.usage_description
                    ))
                
                verif_list = [
                    VerificationResponse(
                        id=v.id,
                        verification_type=v.verification_type,
                        status=v.status,
                        verification_method=v.verification_method,
                        verified_at=v.verified_at,
                        tool_id=v.tool_id,
                        portfolio_item_id=v.portfolio_item_id
                    ) for v in item.verification_records
                ]

                sample_portfolios.append(PortfolioItemSummary(
                    id=item.id,
                    title=item.title,
                    content_type=item.content_type,
                    media_url=item.media_url,
                    aspect_ratio=item.aspect_ratio,
                    output_format=item.output_format,
                    workflow_description=item.workflow_description,
                    commercial_use_status=item.commercial_use_status,
                    tools=tool_list,
                    verifications=verif_list
                ))

            # Check verification count
            verified_count = sum(1 for v in p.verification_records if v.status == "VERIFIED")
            is_verified = verified_count > 0

            results.append(CreatorCardResponse(
                id=p.id,
                user_id=p.user_id,
                display_name=p.display_name,
                bio=p.bio,
                specialization=p.specialization,
                experience_years=p.experience_years,
                avatar_url=p.avatar_url,
                skills=skill_names,
                tools=list(tool_names_set),
                portfolio_count=len(p.portfolio_items),
                sample_portfolio=sample_portfolios[:3],  # Up to 3 preview items
                is_verified=is_verified,
                verification_count=verified_count
            ))

        return {
            "creators": results,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size if page_size > 0 else 1
        }
