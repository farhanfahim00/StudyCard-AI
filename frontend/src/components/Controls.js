export default function Controls({ prevCard, nextCard, shuffleCards }) {
    return (
        <div className="controls">
            <button onClick={prevCard}>Previous</button>
            <button onClick={nextCard}>Next</button>
            <button onClick={shuffleCards}>Shuffle</button>
        </div>
    );
}
