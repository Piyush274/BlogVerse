from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from app.services.llm import LLMService
import json

router = APIRouter()
llm = LLMService()

class OutlineRequest(BaseModel):
    topic: str = Field(..., min_length=5, max_length=200)
    audience: str = Field("developers", max_length=50)
    tone: str = Field("professional", max_length=50)

class OutlineResponse(BaseModel):
    topic: str
    outline: list[str]

class DraftRequest(BaseModel):
    topic: str = Field(..., min_length=5, max_length=200)
    outline: list[str] = Field(..., min_items=1)
    audience: str = Field("developers", max_length=50)
    tone: str = Field("professional", max_length=50)

class DraftResponse(BaseModel):
    draft: str

class RewriteRequest(BaseModel):
    text: str = Field(..., min_length=1)
    instruction: str = Field(..., min_length=2, max_length=500)

class RewriteResponse(BaseModel):
    rewritten_text: str

class SummarizeRequest(BaseModel):
    text: str = Field(..., min_length=10)

class SummarizeResponse(BaseModel):
    summary: str

class TagsRequest(BaseModel):
    text: str = Field(..., min_length=10)

class TagsResponse(BaseModel):
    tags: list[str]


@router.post("/generate-outline", response_model=OutlineResponse)
async def generate_outline(req: OutlineRequest):
    prompt = f"Create a structured article outline for the topic: '{req.topic}'. Target audience: {req.audience}. Tone: {req.tone}."
    system_instruction = "Return the outline as a JSON list of strings representing headings. Do not include markdown formatting or backticks around the JSON."
    
    result = await llm.generate_text(prompt, system_instruction)
    
    # Parse output list
    cleaned = result.strip().strip("`").replace("json", "").strip()
    try:
        outline_list = json.loads(cleaned)
        if not isinstance(outline_list, list):
            outline_list = [str(x) for x in outline_list]
    except Exception:
        outline_list = [line.strip().lstrip("-*•").strip() for line in result.split("\n") if line.strip()]
        
    return OutlineResponse(topic=req.topic, outline=outline_list)


@router.post("/generate-draft", response_model=DraftResponse)
async def generate_draft(req: DraftRequest):
    outline_str = "\n".join([f"- {item}" for item in req.outline])
    prompt = (
        f"Write a full-length, high-quality technical article based on:\n"
        f"Topic: {req.topic}\n"
        f"Target Audience: {req.audience}\n"
        f"Tone: {req.tone}\n"
        f"Outline:\n{outline_str}"
    )
    system_instruction = (
        "Write in clean HTML format. Use paragraph tags, list items, and standard headers. "
        "For code snippets, format them inside <pre><code>...</code></pre> tags. "
        "Do not wrap the response in markdown code blocks like ```html. Return only the raw HTML code."
    )
    
    draft = await llm.generate_text(prompt, system_instruction)
    # Strip common LLM code block wrappers
    draft_clean = draft.strip().strip("`").replace("html", "", 1).strip()
    return DraftResponse(draft=draft_clean)


@router.post("/rewrite", response_model=RewriteResponse)
async def rewrite_content(req: RewriteRequest):
    prompt = (
        f"Rewrite the following text based on this instruction: '{req.instruction}'.\n\n"
        f"Original text:\n{req.text}"
    )
    system_instruction = "Return only the rewritten text, matching the original format (HTML or plain text) without explaining the changes."
    
    rewritten = await llm.generate_text(prompt, system_instruction)
    return RewriteResponse(rewritten_text=rewritten.strip())


@router.post("/summarize", response_model=SummarizeResponse)
async def summarize_content(req: SummarizeRequest):
    prompt = f"Please provide a concise summary of the following text:\n\n{req.text}"
    system_instruction = "Return a 2-3 sentence clear summary."
    
    summary = await llm.generate_text(prompt, system_instruction)
    return SummarizeResponse(summary=summary.strip())


@router.post("/generate-tags", response_model=TagsResponse)
async def generate_tags(req: TagsRequest):
    prompt = f"Extract the top 3-5 tags or categories representing the main topics of this text:\n\n{req.text}"
    system_instruction = "Return a JSON list of strings, e.g. ['React', 'Web Dev', 'Hosting']. Do not return anything else."
    
    result = await llm.generate_text(prompt, system_instruction)
    cleaned = result.strip().strip("`").replace("json", "").strip()
    try:
        tags_list = json.loads(cleaned)
    except Exception:
        tags_list = [t.strip().lstrip("-*•").strip() for t in result.replace(",", "\n").split("\n") if t.strip()][:5]
        
    return TagsResponse(tags=tags_list)
