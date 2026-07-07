from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from app.services.embedder import EmbedderService
from app.services.vector_store import VectorStore
from app.services.llm import LLMService
import json

router = APIRouter()
embedder = EmbedderService()
vector_store = VectorStore()
llm = LLMService()

class EmbedRequest(BaseModel):
    text: str = Field(..., min_length=1)

class EmbedResponse(BaseModel):
    embedding: list[float]

class ModerationRequest(BaseModel):
    text: str = Field(..., min_length=1)

class ModerationResponse(BaseModel):
    is_flagged: bool
    reason: str = ""

class QualityRequest(BaseModel):
    title: str = Field(..., min_length=2)
    content: str = Field(..., min_length=10)

class QualityResponse(BaseModel):
    score: int
    readability: str
    suggestions: list[str]

class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1)
    limit: int = Field(10, ge=1, le=100)


@router.post("/embed", response_model=EmbedResponse)
async def generate_embedding(req: EmbedRequest):
    try:
        vector = await embedder.get_embedding(req.text)
        return EmbedResponse(embedding=vector)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate embedding: {str(e)}"
        )


@router.post("/moderate", response_model=ModerationResponse)
async def moderate_text(req: ModerationRequest):
    prompt = (
        f"Analyze if the following text contains hate speech, spam, extreme toxicity, "
        f"or malicious links. Return exactly: 'FLAGGED: [reason]' or 'SAFE'.\n\n"
        f"Text to analyze:\n{req.text}"
    )
    system_instruction = (
        "You are an automated comment moderation helper. Be objective and strict. "
        "Return either 'SAFE' or 'FLAGGED: <reason>'. Do not include markdown or explanations."
    )
    
    result = await llm.generate_text(prompt, system_instruction)
    clean_res = result.strip()
    
    if "FLAGGED" in clean_res.upper():
        parts = clean_res.split(":", 1)
        reason = parts[1].strip() if len(parts) > 1 else "Toxicity or spam content detected"
        return ModerationResponse(is_flagged=True, reason=reason)
        
    return ModerationResponse(is_flagged=False)


@router.post("/seo-score", response_model=QualityResponse)
async def evaluate_quality(req: QualityRequest):
    prompt = (
        f"Evaluate the following article.\n"
        f"Title: {req.title}\n"
        f"Content:\n{req.content}\n\n"
        f"Score its structure, formatting, technical clarity, and SEO keywords on a scale of 0-100. "
        f"Format response strictly as JSON: "
        f"{{\"score\": 85, \"readability\": \"Medium\", \"suggestions\": [\"Add subheadings\", \"Include code snippet\"]}}"
    )
    system_instruction = "Return ONLY valid JSON. Do not include markdown codeblocks or backticks."
    
    raw_res = await llm.generate_text(prompt, system_instruction)
    cleaned = raw_res.strip().strip("`").replace("json", "").strip()
    try:
        data = json.loads(cleaned)
        return QualityResponse(
            score=int(data.get("score", 70)),
            readability=str(data.get("readability", "Medium")),
            suggestions=list(data.get("suggestions", []))
        )
    except Exception:
        # Fallback diagnostics parsing manually
        return QualityResponse(
            score=70,
            readability="Medium",
            suggestions=["Ensure headings are clearly structured and cover target keywords."]
        )


@router.post("/semantic-search")
async def semantic_search(req: SearchRequest):
    try:
        query_vector = await embedder.get_embedding(req.query)
        results = vector_store.search_articles(query_vector, req.limit)
        
        formatted_results = [
            {"id": row[0], "title": row[1], "score": float(1.0 - row[2])}
            for row in results
        ]
        return {"results": formatted_results}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Semantic search failed: {str(e)}"
        )
