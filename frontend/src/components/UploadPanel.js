export default function UploadPanel({
    setFile,
    uploadFile,
    mode,
    setMode,
    loading
}) {
    return (
        <>
            <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
            />

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
        </>
    );
}
