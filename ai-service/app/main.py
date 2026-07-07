from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security.api_key import APIKeyHeader
from app.config import settings
from app.routes import generate, analyze

app = FastAPI(title="BlogVerse AI Service", version="1.0.0")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, lock this down to the Next.js origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Internal API Key Validation
API_KEY_HEADER = APIKeyHeader(name="X-Internal-API-Key", auto_error=True)

async def validate_api_key(api_key: str = Depends(API_KEY_HEADER)):
    # Check if internal_api_key is configured. If not, allow requests (useful for local development initialization)
    if not settings.internal_api_key:
        return
    if api_key != settings.internal_api_key:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate internal API credentials"
        )

# Register routers with API Key security
app.include_router(generate.router, prefix="/ai", dependencies=[Depends(validate_api_key)])
app.include_router(analyze.router, prefix="/ai", dependencies=[Depends(validate_api_key)])

@app.get("/health")
def health_check():
    return {"status": "healthy"}
