import os
import json
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate

load_dotenv(dotenv_path=".env")

# Initialize model once
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.7,
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

# Function 1: Simple question
def ask_question(question):
    response = llm.invoke(question)
    
    if isinstance(response.content, list):
        return response.content[0]["text"]
    return response.content


# Function 2: Prompt-based response
def explain_topic(topic):
    prompt = PromptTemplate.from_template(
        "Explain {topic} in less than 10 words"
    )

    formatted = prompt.format(topic=topic)
    response = llm.invoke(formatted)

    if isinstance(response.content, list):
        return response.content[0]["text"]
    return response.content


# Function 3: Flashcards from text (for your PDF app)
def generate_flashcards(text):
    prompt = PromptTemplate.from_template(
        """
        You are a study assistant.
        Create 5 clear flashcards from the text below.

        Return ONLY valid JSON. No explanation, no markdown.

        Format:
        [
           {{ "question": "Q1", "answer": "A1" }},
           {{ "question": "Q2", "answer": "A2" }}
        ]

        Text:
        {text}
        """
    )

    formatted = prompt.format(text=text)
    response = llm.invoke(formatted)

    content = response.content
    if isinstance(content, list):
        content = content[0]["text"]

    content = content.strip()

    if content.startswith("```"):
        content = content.split("```")[1]  # remove ```json
        content = content.replace("json", "", 1).strip()

    # Try parsing
    try:
        flashcards = json.loads(content)
    except Exception as e:
        print("RAW OUTPUT:\n", content)  # debug
        flashcards = [{"question": "Error", "answer": "Could not parse flashcards"}]

    return flashcards