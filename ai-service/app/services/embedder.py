import google.generativeai as genai
from openai import AsyncOpenAI
from app.config import settings

class EmbedderService:
    def __init__(self):
        self.gemini_configured = False
        self.openai_client = None

        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
            self.gemini_configured = True

        if settings.openai_api_key:
            self.openai_client = AsyncOpenAI(api_key=settings.openai_api_key)

    async def get_embedding(self, text: str) -> list[float]:
        # Strip text of newlines
        cleaned_text = text.replace("\n", " ")

        # Check OpenAI first if configured
        if self.openai_client:
            try:
                response = await self.openai_client.embeddings.create(
                    model="text-embedding-3-small",
                    input=[cleaned_text]
                )
                return response.data[0].embedding
            except Exception as e:
                raise RuntimeError(f"OpenAI embedding failed: {str(e)}")

        # Fallback to Gemini
        if self.gemini_configured:
            try:
                # Call gemini embed content
                result = genai.embed_content(
                    model="models/text-embedding-004",
                    content=cleaned_text,
                    task_type="retrieval_document"
                )
                return result["embedding"]
            except Exception as e:
                raise RuntimeError(f"Gemini embedding failed: {str(e)}")

        # Mock embedding (768 dimensions of 0.0) for local testing without key
        return [0.0] * 768
