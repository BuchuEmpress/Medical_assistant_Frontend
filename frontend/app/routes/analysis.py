from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request
from app.models.schemas import (
    ChatRequest, ChatResponse,
    AnalysisRequest, AnalysisResponse,
    ImageAnalysisResponse
)
from app.chains.chat_chain import get_chat_response
from app.chains.analysis_chain import analyze_medical_record
from app.services.gemini_service import gemini_service
from app.middleware.usage_tracker import check_gemini_limit
from datetime import datetime

# Initialize the router with a prefix and tag for documentation
router = APIRouter(prefix="/api", tags=["Analysis"])


@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: Request, body: ChatRequest):
    """
    Endpoint: /api/chat
    Description: Handles chat interaction with Gemini model with memory support.
    Rate Limiting: Enforced via check_gemini_limit() to prevent token exhaustion.
    """
    check_gemini_limit(request)

    try:
        # Import memory service
        from app.services.memory_service import save_message
        
        # Save user message
        save_message(body.user_id, "user", body.message)
        
        response_text = await get_chat_response(
            message=body.message,
            language=body.language,
            user_id=body.user_id
        )
        # Save AI response to history
        save_message(body.user_id, "assistant", response_text)
        return ChatResponse(
            response=response_text,
            language=body.language,
            timestamp=datetime.now()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


@router.post("/analyze-text", response_model=AnalysisResponse)
async def analyze_medical_text(request: Request, body: AnalysisRequest):
    """
    Endpoint: /api/analyze-text
    Description: Analyzes medical text using Gemini.
    Rate Limiting: Enforced via check_gemini_limit() to prevent token exhaustion.
    """
    check_gemini_limit(request)

    try:
        analysis = analyze_medical_record(
            text=body.text,
            context=body.context,
            language=body.language,
        )

        disclaimer = (
            "This analysis is for informational purposes only. "
            "Always consult qualified healthcare professionals for medical advice."
        )

        return AnalysisResponse(
            summary=analysis.summary,
            key_findings=analysis.key_findings,
            recommendations=analysis.recommendations,
            next_steps=analysis.next_steps,
            disclaimer=disclaimer,
            language=body.language,
            timestamp=datetime.now()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")


@router.post("/analyze-image", response_model=ImageAnalysisResponse)
async def analyze_medical_image(
    request: Request,
    file: UploadFile = File(...),
    language: str = Form(default="en"),
    extract_text_only: bool = Form(default=False),
):
    """
    Endpoint: /api/analyze-image
    Description: Extracts and analyzes medical image using Gemini.
    Rate Limiting: Enforced via check_gemini_limit() to prevent token exhaustion.
    """
    check_gemini_limit(request)

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        image_bytes = await file.read()
        extracted_text = gemini_service.extract_text_from_image(image_bytes)

        if extract_text_only:
            return ImageAnalysisResponse(
                extracted_text=extracted_text,
                analysis=AnalysisResponse(
                    summary="Text extraction completed",
                    key_findings=[],
                    recommendations=[],
                    next_steps=["Review the extracted text", "Analyze if needed"],
                    disclaimer="Text extraction only - no analysis performed",
                    language=language,
                    timestamp=datetime.now()
                )
            )

        analysis = analyze_medical_record(text=extracted_text, language=language)
        disclaimer = (
            "This analysis is for informational purposes only. "
            "Always consult qualified healthcare professionals for medical advice."
        )

        return ImageAnalysisResponse(
            extracted_text=extracted_text,
            analysis=AnalysisResponse(
                summary=analysis.summary,
                key_findings=analysis.key_findings,
                recommendations=analysis.recommendations,
                next_steps=analysis.next_steps,
                disclaimer=disclaimer,
                language=language,
                timestamp=datetime.now()
            )
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image analysis error: {str(e)}")


@router.post("/extract-text")
async def extract_text_from_image(request: Request, file: UploadFile = File(...)):
    """
    Endpoint: /api/extract-text
    Description: Extracts text from medical image using Gemini.
    Rate Limiting: Enforced via check_gemini_limit() to prevent token exhaustion.
    """
    check_gemini_limit(request)

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        image_bytes = await file.read()
        extracted_text = gemini_service.extract_text_from_image(image_bytes)
        return {
            "extracted_text": extracted_text,
            "timestamp": datetime.now()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text extraction error: {str(e)}")
