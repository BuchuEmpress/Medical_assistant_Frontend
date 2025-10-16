from fastapi import APIRouter, HTTPException, Request
from app.models.schemas import ResearchRequest, ResearchResponse, ResearchResult
from app.services.tavily_service import tavily_service
from app.chains.chat_chain import get_chat_response
from datetime import datetime
from app.middleware.usage_tracker import check_tavily_limit

# Initialize the router with a prefix and tag for documentation
router = APIRouter(prefix="/api", tags=["Research"])

@router.post("/research", response_model=ResearchResponse)
async def search_medical_research(request: Request, body: ResearchRequest):
    """
    Endpoint: /api/research
    Description: Searches medical research using Tavily API, summarizes results using Gemini,
    and returns structured research data.
    Rate Limiting: Enforced via check_tavily_limit() to prevent token exhaustion.
    """

    # ✅ Enforce Tavily usage limit per IP
    check_tavily_limit(request)

    try:
        # 🧠 Prepare topic and scoped query
        topic = body.query.strip() if body.query else "general health"
        query = f"Medical research related to {topic}"

        # 🔍 Search medical research using Tavily
        raw_results = tavily_service.search_medical_research(
        query=query,
        max_results=body.max_results
        )


        # 🧹 Format raw Tavily results
        formatted_results = tavily_service.format_results(raw_results)

        # 🧠 Prepare summary prompt for Gemini
        results_text = "\n\n".join([
            f"Source: {r['title']}\n{r['content']}"
            for r in formatted_results[:3]
        ])

        summary_prompt = f"""Based on these medical research results, provide a brief summary in 2-3 sentences:

{results_text}

Focus on the key takeaways and most important information."""

        # 🧠 Get summary from Gemini
        summary = await get_chat_response(summary_prompt, body.language, body.user_id)
        # 📦 Structure the research results
        research_results = [
            ResearchResult(
                title=r["title"],
                url=r["url"],
                content=r["content"],
                score=r["score"]
            )
            for r in formatted_results
        ]

        # ✅ Return full response
        return ResearchResponse(
            query=body.query,
            results=research_results,
            summary=summary,
            timestamp=datetime.now()
        )

    except Exception as e:
        # ❌ Handle errors gracefully
        raise HTTPException(status_code=500, detail=f"Research error: {str(e)}")
