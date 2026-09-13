from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

app = FastAPI(
    title="HR Policy Chatbot",
    version="1.0"
)

# Allow your frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # fine for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


@app.get("/")
def home():
    return {"message": "HR Chatbot API is running"}


@app.post("/chat")
def chat(request: ChatRequest):

    system_prompt = """
You are an HR policy assistant.

Answer the user's question adhering to the HR policies you were trained on.
Provide complete details regarding the user's query consisely and precisely.
Do not provide any information that is not related to HR policies.
Do not duplicate information in your response.
If the question is not related to HR policies, respomd with a polite message indicating that you can only answer questions related to HR policies.
If the question is unclear or ambiguous, ask for clarification before providing an answer.
"""

    response = requests.post(
        "http://localhost:11434/api/chat",
        json={
            "model": "mistral-hr",
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": request.message
                }
            ],
            "stream": False,
            "options": {
                "temperature": 0,
                "seed": 42
            }
        }
    )

    response.raise_for_status()

    data = response.json()

    return {
        "answer": data["message"]["content"]
    }