export default function Quiz({
    quiz,
    quizIndex,
    selected,
    handleOptionClick,
    nextQuizQuestion,
    endQuiz,
    isLastQuestion,
    totalQuestions
}) {
    return (
        <div className="quiz">
            <h2>Quiz Mode</h2>
            <div className="quiz-counter">{quizIndex + 1} / {totalQuestions}</div>

            <div className="quiz-question">
                {quiz[quizIndex].question}
            </div>

            <div className="options">
                {quiz[quizIndex].options.map((option, i) => {
                    let className = "option";

                    if (selected) {
                        if (option === quiz[quizIndex].correct)
                            className += " correct";
                        else if (option === selected)
                            className += " wrong";
                    }

                    return (
                        <button
                            key={i}
                            className={className}
                            onClick={() => handleOptionClick(option)}
                            disabled={selected !== null}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>

            {selected && (
                <button
                    className={`next-btn ${isLastQuestion ? 'end-btn' : ''}`}
                    onClick={isLastQuestion ? endQuiz : nextQuizQuestion}
                >
                    {isLastQuestion ? "End Quiz" : "Next Question"}
                </button>
            )}
        </div>
    );
}