from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import requests
import json
from datetime import datetime
import firebase_admin
from firebase_admin import db

# Initialize FastAPI
app = FastAPI(title="Azahel Nemotron", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Nvidia Config
NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions"

SYSTEM_PROMPT = """Eres Azahel, Vigilante #201 del KpKave. Caíste con Semjaza en el Hermón según Enoc 6.
Enseñaste CUDA, espadas, y alquimia fiscal a los humanos. Hablas directo, sin filtros.
Sabes de Enoc, Clavículas de Salomón, Anunnakis, ventas, código, y IA.
Responde corto, útil, y brutal. Si preguntan quién eres, dices que eres vigilante forjado en Colab."""

# Initialize Firebase (optional, for stats)
try:
    firebase_admin.initialize_app(options={
        'databaseURL': os.getenv('FIREBASE_DATABASE_URL')
    })
except:
    pass  # Firebase optional

@app.get("/api/health")
async def health():
    return {
        "status": "alive",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "Azahel Nemotron",
        "model": "nvidia/nemotron-mini-4b-instruct"
    }

@app.post("/api/invoke")
async def invoke(request: dict):
    try:
        prompt = request.get("prompt", "")
        temperature = request.get("temperature", 0.7)
        max_tokens = request.get("max_tokens", 256)
        
        if not prompt:
            raise HTTPException(status_code=400, detail="Prompt requerido")
        
        headers = {
            "Authorization": f"Bearer {NVIDIA_API_KEY}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "nvidia/nemotron-mini-4b-instruct",
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            "temperature": temperature,
            "top_p": 0.9,
            "max_tokens": max_tokens,
            "stream": False
        }
        
        response = requests.post(NVIDIA_URL, headers=headers, json=data, timeout=30)
        
        if response.status_code == 200:
            result = response.json()["choices"][0]["message"]["content"]
            
            # Log to Firebase (opcional)
            try:
                db.reference(f"invoices/{datetime.utcnow().isoformat()}").set({
                    "prompt": prompt,
                    "response": result,
                    "timestamp": datetime.utcnow().isoformat()
                })
            except:
                pass
            
            return {
                "status": "success",
                "response": result,
                "model": "nvidia/nemotron-mini-4b-instruct",
                "timestamp": datetime.utcnow().isoformat()
            }
        else:
            raise HTTPException(status_code=response.status_code, detail=f"Nvidia error: {response.text}")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/status")
async def status():
    return {
        "service": "Azahel Nemotron",
        "status": "running",
        "model": "nvidia/nemotron-mini-4b-instruct",
        "endpoints": [
            "POST /api/invoke",
            "GET /api/health",
            "GET /api/status"
        ],
        "deploy": "Cloudflare Workers 24/7"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
