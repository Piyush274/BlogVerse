import google.generativeai as genai
from openai import AsyncOpenAI
from app.config import settings

class LLMService:
    def __init__(self):
        self.gemini_configured = False
        self.openai_client = None

        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
            self.gemini_model = genai.GenerativeModel('gemini-1.5-flash')
            self.gemini_configured = True
        else:
            self.gemini_model = None

        if settings.openai_api_key:
            self.openai_client = AsyncOpenAI(api_key=settings.openai_api_key)

    async def generate_text(self, prompt: str, system_instruction: str = "") -> str:
        # Check OpenAI first if configured
        if self.openai_client:
            try:
                messages = []
                if system_instruction:
                    messages.append({"role": "system", "content": system_instruction})
                messages.append({"role": "user", "content": prompt})
                
                response = await self.openai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=messages
                )
                return response.choices[0].message.content or ""
            except Exception as e:
                return f"OpenAI Error: {str(e)}"

        # Fallback to Gemini
        if self.gemini_configured and self.gemini_model:
            try:
                full_prompt = prompt
                if system_instruction:
                    full_prompt = f"{system_instruction}\n\n{prompt}"
                
                # Use generate_content_async for async support
                response = await self.gemini_model.generate_content_async(full_prompt)
                return response.text
            except Exception as e:
                return f"Gemini Error: {str(e)}"

        return "AI model provider not configured. Please set GEMINI_API_KEY or OPENAI_API_KEY."
