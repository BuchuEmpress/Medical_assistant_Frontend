from collections import defaultdict
from datetime import datetime, timedelta
from fastapi import Request, HTTPException
from app.config import settings

# Track usage per IP
gemini_usage = defaultdict(lambda: {"count": 0, "reset": datetime.now()})
tavily_usage = defaultdict(lambda: {"count": 0, "reset": datetime.now()})

def check_gemini_limit(request: Request):
    ip = request.client.host
    usage = gemini_usage[ip]

    if datetime.now() > usage["reset"]:
        usage["count"] = 0
        usage["reset"] = datetime.now() + timedelta(days=1)

    if usage["count"] >= settings.gemini_daily_limit:
        raise HTTPException(status_code=429, detail="Gemini usage limit reached for today.")
    
    usage["count"] += 1 

def check_tavily_limit(request: Request):
    ip = request.client.host
    usage = tavily_usage[ip]

    if datetime.now() > usage["reset"]:
        usage["count"] = 0
        usage["reset"] = datetime.now() + timedelta(days=30)

    if usage["count"] >= settings.tavily_monthly_limit:
        raise HTTPException(status_code=429, detail="Tavily usage limit reached for this month.")
    
    usage["count"] += 1
