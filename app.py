import streamlit as st
from PyPDF2 import PdfReader
from main import generate_flashcards

st.title("PDF Flashcard Generator")

# Session state for flashcards and flips
if "flashcards" not in st.session_state:
    st.session_state.flashcards = []

if "flip_states" not in st.session_state:
    st.session_state.flip_states = {}

uploaded_file = st.file_uploader("Upload a PDF file", type="pdf")

if uploaded_file is not None:
    pdf = PdfReader(uploaded_file)
    
    text = ""
    for page in pdf.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted

    st.subheader("Extracted Text Preview")
    st.write(text[:1000])

    # Generate + persist flashcards
    if st.button("Generate Flashcards"):
        with st.spinner("Generating flashcards..."):
            st.session_state.flashcards = generate_flashcards(text[:3000])
            st.session_state.flip_states = {}  # reset flip states

# Read from session state
flashcards = st.session_state.flashcards

# Display flashcards with one click flip
if flashcards:
    st.subheader("Flashcards")

    for idx, card in enumerate(flashcards):
        q = card.get("question", f"Flashcard {idx+1}")
        a = card.get("answer", "No answer")

        # Initialize flip state
        if idx not in st.session_state.flip_states:
            st.session_state.flip_states[idx] = False

        st.markdown("---")

        if st.session_state.flip_states[idx]:
            st.markdown("### Answer")
            st.write(a)

            # Flip back callback
            st.button(
                "Flip back",
                key=f"flip_back_{idx}",
                on_click=lambda i=idx: st.session_state.flip_states.update({i: False})
            )
        else:
            st.markdown("### Question")
            st.write(q)

            # Show answer callback
            st.button(
                "Show answer",
                key=f"show_answer_{idx}",
                on_click=lambda i=idx: st.session_state.flip_states.update({i: True})
            )