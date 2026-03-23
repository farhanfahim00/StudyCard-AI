from fastapi import FastAPI, Form, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from PyPDF2 import PdfReader
from main import generate_flashcards, generate_quiz_options
import random

app = FastAPI()

# Allow React to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...), mode: str = Form("detailed")):
    pdf = PdfReader(file.file)

    text = ""
    for page in pdf.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted

    flashcards = generate_flashcards(text[:3000], mode=mode) 

    return {"flashcards": flashcards}

@app.post("/generate-quiz")
async def generate_quiz(request: Request):
    data = await request.json()
    flashcards = data.get("flashcards", [])
    
    quiz = []
    for card in flashcards:
        wrong_answers = generate_quiz_options(card["question"], card["answer"])
        options = wrong_answers + [card["answer"]]
        random.shuffle(options)
        quiz.append({
            "question": card["question"],
            "correct": card["answer"],
            "options": options
        })
    
    return {"quiz": quiz}