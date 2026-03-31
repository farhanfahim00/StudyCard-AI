export default function ScoreScreen({
    score,
    total,
    retakeQuiz,
    exitQuiz
}) {
    const percentage = (score / total) * 100;

    let message = "";
    if (percentage === 100) {
        message = "Perfect! You're a master!";
    } else if (percentage >= 80) {
        message = "Excellent work! You know this well!";
    } else if (percentage >= 60) {
        message = "Good job! Keep practicing!";
    } else if (percentage >= 40) {
        message = "Nice try! Review and try again!";
    } else {
        message = "Keep learning! You'll get better!";
    }

    return (
        <div className="score-screen">
            <h2>Quiz Complete!</h2>

            <p className="score">{score} / {total}</p>

            <p className="score-message">{message}</p>

            <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                {percentage.toFixed(1)}% Correct
            </div>

            <div className="controls">
                <button onClick={retakeQuiz}> Retake Quiz</button>
                <button onClick={exitQuiz}> Back to Flashcards</button>
            </div>
        </div>
    );
}
