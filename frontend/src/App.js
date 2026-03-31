import { useState } from "react";
import "./App.css";

import UploadPanel from "./components/UploadPanel";
import Flashcard from "./components/Flashcard";
import Controls from "./components/Controls";
import Quiz from "./components/Quiz";
import ScoreScreen from "./components/ScoreScreen";

function App() {

  const [file, setFile] = useState(null);
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mode, setMode] = useState("detailed");
  const [loading, setLoading] = useState(false);

  const [quizMode, setQuizMode] = useState(false);
  const [quizPreparing, setQuizPreparing] = useState(false);
  const [quiz, setQuiz] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  // Upload PDF
  const uploadFile = async () => {
    if (!file) return alert("Select PDF");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);

    setLoading(true);

    const res = await fetch("http://127.0.0.1:8000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setCards(data.flashcards);
    setIndex(0);
    setFlipped(false);
    setLoading(false);
  };

  const nextCard = () => {
    setIndex((i) => (i + 1) % cards.length);
    setFlipped(false);
  };

  const prevCard = () => {
    setIndex((i) => (i - 1 + cards.length) % cards.length);
    setFlipped(false);
  };

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setIndex(0);
  };

  // Quiz
  const startQuiz = async () => {
    setQuizPreparing(true);

    const res = await fetch("http://127.0.0.1:8000/generate-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flashcards: cards }),
    });

    const data = await res.json();

    setQuiz(data.quiz);
    setQuizMode(true);
    setQuizPreparing(false);
    setQuizIndex(0);
    setScore(0);
    setSelected(null);
    setQuizDone(false);
  };

  const handleOptionClick = (option) => {
    if (selected) return;

    setSelected(option);
    if (option === quiz[quizIndex].correct)
      setScore((s) => s + 1);
  };

  const nextQuizQuestion = () => {
    if (quizIndex + 1 >= quiz.length)
      setQuizDone(true);
    else {
      setQuizIndex((i) => i + 1);
      setSelected(null);
    }
  };

  const endQuiz = () => {
    setQuizDone(true);
  };

  const retakeQuiz = () => {
    setQuizIndex(0);
    setScore(0);
    setSelected(null);
    setQuizDone(false);
  };

  const exitQuiz = () => {
    setQuizMode(false);
    setQuizPreparing(false);
  };

  return (
    <div className="app">
      <h1>StudyCard AI</h1>

      {!quizMode && (
        <>
          <div className="upload-panel">
            <UploadPanel
              setFile={setFile}
              uploadFile={uploadFile}
              mode={mode}
              setMode={setMode}
              loading={loading}
            />
          </div>

          {cards.length > 0 && (
            <>
              <Flashcard
                card={cards[index]}
                flipped={flipped}
                onFlip={() => setFlipped(!flipped)}
                index={index}
                total={cards.length}
              />

              <Controls
                prevCard={prevCard}
                nextCard={nextCard}
                shuffleCards={shuffleCards}
              />

              <button className="quiz-btn" onClick={startQuiz} disabled={quizPreparing}>
                {quizPreparing ? "Preparing Quiz..." : "Start Quiz"}
              </button>
            </>
          )}
        </>
      )}

      {quizMode && !quizDone && (
        <Quiz
          quiz={quiz}
          quizIndex={quizIndex}
          selected={selected}
          handleOptionClick={handleOptionClick}
          nextQuizQuestion={nextQuizQuestion}
          endQuiz={endQuiz}
          isLastQuestion={quizIndex === quiz.length - 1}
          totalQuestions={quiz.length}
        />
      )}

      {quizMode && quizDone && (
        <ScoreScreen
          score={score}
          total={quiz.length}
          retakeQuiz={retakeQuiz}
          exitQuiz={exitQuiz}
        />
      )}
    </div>
  );
}

export default App;


