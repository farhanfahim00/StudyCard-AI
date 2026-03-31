# StudyCard AI

> An AI-powered flashcard and quiz generator that transforms PDF documents into interactive study tools.

Built by **Farhan Fahim** and **Jyotika Vendani**

---

## Motive

Studying from PDFs is time-consuming and passive. StudyCard AI was built to solve that — upload any academic PDF and instantly get AI-generated flashcards and a multiple choice quiz, so you can study smarter and test yourself in minutes.

Whether you're preparing for exams, reviewing lecture notes, or learning something new, StudyCard AI turns dense documents into an active, engaging study experience.

---

## Features

- 📄 **PDF Upload** — Upload any PDF and extract content automatically
- 🃏 **Flashcard Generation** — AI generates 5 flashcards from your PDF
- 🔤 **Two Study Modes:**
  - **Detailed Answer** — Full explanation answers (2-4 sentences)
  - **One Word Answer** — Single word answers for quick recall
- 🧠 **Quiz Mode** — Multiple choice quiz with AI-generated wrong answers
- ✅ **Real-time Scoring** — Get your score at the end of every quiz
- 🔀 **Shuffle** — Randomize your flashcard order
- 🔁 **Retake** — Retake the quiz as many times as you want

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js |
| Backend | FastAPI (Python) |
| AI Model | Google Gemini 2.5 Flash |
| AI Framework | LangChain |
| PDF Parsing | PyPDF2 |
| Environment | python-dotenv |
| API Server | Uvicorn |

---

## Project Structure

```
StudyCard-AI/
├── frontend/
│   ├── public/
│   └── src/
│       ├── App.js
│       ├── App.css
│       └── index.js
├── backend.py
├── main.py
├── .env
├── .gitignore
├── requirements.txt
└── README.md
```

---

## Prerequisites

Make sure you have the following installed on your computer:

- [Python 3.9+](https://www.python.org/downloads/)
- [Node.js 16+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A **Google Gemini API key** — get one free at [Google AI Studio](https://aistudio.google.com)

---

## How to Run

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/StudyCard-AI.git
cd StudyCard-AI
```

### 2. Set Up Environment Variables

Create a `.env` file in the root `StudyCard-AI` folder:

```bash
touch .env
```

Add your Google API key inside it:

```
GOOGLE_API_KEY=your_actual_api_key_here
```

> ⚠️ Never share or push your `.env` file. It is already in `.gitignore`.

### 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 4. Start the Backend

```bash
uvicorn backend:app --reload
```

You should see:
```
Uvicorn running on http://127.0.0.1:8000
```

### 5. Install Frontend Dependencies & Start React

Open a **second terminal** and run:

```bash
cd frontend
npm install
npm start
```

The app will open at **http://localhost:3000**

---

## How to Use

1. Open **http://localhost:3000** in your browser
2. Upload a PDF file
3. Select a mode — **Detailed Answer** or **One Word Answer**
4. Click **Upload & Generate**
5. Browse through your flashcards using Previous / Next / Shuffle
6. Click a card to flip it and reveal the answer
7. Click **Start Quiz 🧠** to enter quiz mode
8. Select the correct answer from 4 options
9. See your final score and retake if needed

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GOOGLE_API_KEY` | Your Google Gemini API key from [AI Studio](https://aistudio.google.com) |

---

## Dependencies

See `requirements.txt` for all Python dependencies and `frontend/package.json` for all Node dependencies.

---

## 👥 Authors

- **Farhan Fahim**
- **Jyotika Vendani**

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
