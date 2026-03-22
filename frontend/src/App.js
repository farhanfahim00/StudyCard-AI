import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://127.0.0.1:8000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setCards(data.flashcards);
    setIndex(0);
    setFlipped(false);
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

  return (
    <div className="app">
      <h1>StudyCard AI</h1>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload</button>

      {cards.length > 0 && (
        <>
          <p>{index + 1} / {cards.length}</p>

          <div
            className={`card-container ${flipped ? "flipped" : ""}`}
            onClick={() => setFlipped(!flipped)}
          >
            <div className="card-inner">
              <div className="card-front">
                {cards[index].question}
              </div>
              <div className="card-back">
                {cards[index].answer}
              </div>
            </div>
          </div>

          <div className="controls">
            <button onClick={prevCard}>Previous</button>
            <button onClick={nextCard}>Next</button>
            <button onClick={shuffleCards}>Shuffle</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;