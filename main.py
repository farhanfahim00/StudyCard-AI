from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate

load_dotenv()

# Initialize model once
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.7
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

        Create 5 flashcards from the text below.

        Format:
        Flashcard 1:
        Q:
        A:

        Flashcard 2:
        Q:
        A:

        Text:
        {text}
        """
    )

    formatted = prompt.format(text=text)
    response = llm.invoke(formatted)

    if isinstance(response.content, list):
        return response.content[0]["text"]
    return response.content