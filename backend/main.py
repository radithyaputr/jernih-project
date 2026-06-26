from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db, QueryLog
from schemas import UserQuery, AIResponse
from ai_service import generate_civic_response

app = FastAPI(title="JERNIH API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/analyze", response_model=AIResponse)
def analyze_query(query: UserQuery, db: Session = Depends(get_db)):
    if not query.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
        
    ai_result = generate_civic_response(query.query, query.context)
    
    # Log for Community Insights Dashboard
    log_entry = QueryLog(
        user_query=query.query,
        intent=ai_result.get("intent", "Unknown"),
        confidence_score=ai_result.get("confidence_score", 0)
    )
    db.add(log_entry)
    db.commit()
    
    return ai_result