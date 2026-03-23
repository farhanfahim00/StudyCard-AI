import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mode, setMode] = useState("detailed");
  const [loading, setLoading] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quiz, setQuiz] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);

  const uploadFile = async () => {
    if (!file) return alert("Please select a PDF first!");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setCards(data.flashcards);
      setIndex(0);
      setFlipped(false);
    } catch (err) {
      alert("Error: Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    setIndex((prev) => (prev + 1) % cards.length);
    setFlipped(false);
  };

  const prevCard = () => {
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
    setFlipped(false);
  };

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setIndex(0);
    setFlipped(false);
  };

  const startQuiz = async () => {
    setQuizLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flashcards: cards }),
      });
      const data = await res.json();
      setQuiz(data.quiz);
      setQuizMode(true);
      setQuizIndex(0);
      setScore(0);
      setSelected(null);
      setQuizDone(false);
    } catch (err) {
      alert("Error generating quiz. Make sure backend is running.");
    } finally {
      setQuizLoading(false);
    }
  };

const handleOptionClick = (option) => {
    if (selected) return; // prevent changing answer
    setSelected(option);
    if (option === quiz[quizIndex].correct) {
      setScore((prev) => prev + 1);
    }
  };

const nextQuizQuestion = () => {
    if (quizIndex + 1 >= quiz.length) {
      setQuizDone(true);
    } else {
      setQuizIndex((prev) => prev + 1);
      setSelected(null);
    }
  };

const retakeQuiz = () => {
    setQuizIndex(0);
    setScore(0);
    setSelected(null);
    setQuizDone(false);
  };

const exitQuiz = () => {
    setQuizMode(false);
    setQuizDone(false);
    setSelected(null);
    setScore(0);
  };
  

  return (
    <div className="app">
  <h1>StudyCard AI</h1>

  {!quizMode && (
    <>
      <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />

      <div className="mode-selector">
        <button
          className={mode === "detailed" ? "mode-btn active" : "mode-btn"}
          onClick={() => setMode("detailed")}
        >
          Detailed Answer
        </button>
        <button
          className={mode === "flashwords" ? "mode-btn active" : "mode-btn"}
          onClick={() => setMode("flashwords")}
        >
          One Word Answer
        </button>
      </div>

      <button onClick={uploadFile} disabled={loading}>
        {loading ? "Generating..." : "Upload & Generate"}
      </button>

      {cards.length > 0 && (
        <>
          <p>{index + 1} / {cards.length}</p>

          <div
            className={`card-container ${flipped ? "flipped" : ""}`}
            onClick={() => setFlipped(!flipped)}
          >
            <div className="card-inner">
              <div className="card-front">{cards[index].question}</div>
              <div className="card-back">{cards[index].answer}</div>
            </div>
          </div>

          <div className="controls">
            <button onClick={prevCard}>Previous</button>
            <button onClick={nextCard}>Next</button>
            <button onClick={shuffleCards}>Shuffle</button>
          </div>

          <button className="quiz-btn" onClick={startQuiz} disabled={quizLoading}>
            {quizLoading ? "Preparing Quiz..." : "Start Quiz "}
          </button>
        </>
      )}
    </>
  )}

  {quizMode && !quizDone && quiz.length > 0 && (
    <div className="quiz">
      <h2>Quiz Mode </h2>
      <p>{quizIndex + 1} / {quiz.length}</p>
      <div className="quiz-question">{quiz[quizIndex].question}</div>

      <div className="options">
        {quiz[quizIndex].options.map((option, i) => {
          let className = "option";
          if (selected) {
            if (option === quiz[quizIndex].correct) className += " correct";
            else if (option === selected) className += " wrong";
          }
          return (
            <button key={i} className={className} onClick={() => handleOptionClick(option)}>
              {option}
            </button>
          );
        })}
      </div>

      {selected && (
        <button className="next-btn" onClick={nextQuizQuestion}>
          {quizIndex + 1 >= quiz.length ? "See Score" : "Next Question"}
        </button>
      )}
    </div>
  )}

  {quizMode && quizDone && (
    <div className="score-screen">
      <h2>Quiz Complete! </h2>
      <p className="score">{score} / {quiz.length} correct</p>
      <p>{score === quiz.length ? "Perfect score!" : score >= quiz.length / 2 ? "Good job! 💪" : "Keep studying! 📚"}</p>
      <div className="controls">
        <button onClick={retakeQuiz}>Retake Quiz</button>
        <button onClick={exitQuiz}>Back to Flashcards</button>
      </div>
    </div>
  )}
</div>
  );
}
export default App;