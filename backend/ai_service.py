import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Using gemini-1.5-flash for speed and JSON structure support
model = genai.GenerativeModel('gemini-2.5-flash', generation_config={"response_mime_type": "application/json"})

def generate_civic_response(query: str, context_type: str) -> dict:
    system_instruction = """
    You are JERNIH, a highly secure, reliable Civic Intelligence Assistant for Indonesia.
    You MUST output valid JSON matching this exact schema:
    {
      "intent": "Short classification of the issue",
      "summary": "Clear, simple explanation in Indonesian",
      "confidence_score": 0-100 (integer),
      "reasoning": "Why you provided this answer",
      "risk_warning": "Any risks or limitations, or null",
      "sources": ["List of official institutions to verify with"],
      "action_map": {
        "now": ["Step 1", "Step 2"],
        "within_24h": [],
        "within_7d": [],
        "contacts": ["Who to call"],
        "documents": ["Required docs"]
      }
    }
    CRITICAL RULES:
    1. NEVER hallucinate laws or government programs.
    2. If you are unsure, set confidence_score below 80 and state "Memerlukan verifikasi tambahan" in reasoning.
    3. Use simple, Notion-like concise Indonesian language. No jargon.
    """
    
    prompt = f"{system_instruction}\n\nUSER QUERY:\n{query}\nCONTEXT:\n{context_type}"
    
    try:
        response = model.generate_content(prompt)
        return json.loads(response.text)
    except Exception as e:
        # Fallback safe response for production stability
        return {
            "intent": "Error Processing",
            "summary": "Maaf, sistem sedang mengalami kendala. Informasi belum tersedia atau memerlukan verifikasi tambahan.",
            "confidence_score": 0,
            "reasoning": f"System error: {str(e)}",
            "risk_warning": "Hasil tidak dapat divalidasi.",
            "sources": [],
            "action_map": {"now": [], "within_24h": [], "within_7d": [], "contacts": [], "documents": []}
        }