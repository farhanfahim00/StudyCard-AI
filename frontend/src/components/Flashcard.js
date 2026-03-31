export default function Flashcard({ card, flipped, onFlip, index, total }) {
    return (
        <>
            <div className="card-counter">{index + 1} / {total}</div>

            <div
                className={`card-container ${flipped ? "flipped" : ""}`}
                onClick={onFlip}
            >
                <div className="card-inner">
                    <div className="card-front">{card.question}</div>
                    <div className="card-back">{card.answer}</div>
                </div>
            </div>
        </>
    );
}