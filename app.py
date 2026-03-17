import streamlit as st
from PyPDF2 import PdfReader
from main import generate_flashcards


st.title("PDF Reader App")

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

    if st.button("Generate Flashcards"):
        with st.spinner("Generating flashcards..."):
            result = generate_flashcards(text[:3000])
            st.subheader("Flashcards")
            st.write(result)