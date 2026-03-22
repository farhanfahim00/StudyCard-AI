from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PyPDF2 import PdfReader
from main import generate_flashcards

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
async def upload_pdf(file: UploadFile = File(...)):
    pdf = PdfReader(file.file)

    text = ""
    for page in pdf.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted

    flashcards = generate_flashcards(text[:3000])

    return {"flashcards": flashcards}