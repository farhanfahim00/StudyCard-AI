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
def generate_flashcards(text, mode="detailed"):
    if mode == "flashwords":
        instruction = """
        You are a study assistant.
        Create 5 flashcards from the text below.
        Each answer must be ONE WORD ONLY. No sentences.
        Return ONLY valid JSON. No explanation, no markdown.
        Format:
        [
           {{ "question": "Q1", "answer": "OneWord" }},
           {{ "question": "Q2", "answer": "OneWord" }}
        ]
        Text:
        {text}
        """
    else:
        instruction = """
        You are a study assistant.
        Create 5 detailed flashcards from the text below.
        Each answer should be a clear, thorough explanation (2-4 sentences).
        Return ONLY valid JSON. No explanation, no markdown.
        Format:
        [
           {{ "question": "Q1", "answer": "Detailed answer here." }},
           {{ "question": "Q2", "answer": "Detailed answer here." }}
        ]
        Text:
        {text}
        """

    prompt = PromptTemplate.from_template(instruction)
    formatted = prompt.format(text=text)
    response = llm.invoke(formatted)
    content = response.content

    if isinstance(content, list):
        content = content[0]["text"]

    content = content.strip()
    if content.startswith("```"):
        content = content.split("```")[1]
        content = content.replace("json", "", 1).strip()

    #Try Parsing
    try:
        flashcards = json.loads(content)
    except Exception as e:
        print("RAW OUTPUT:\n", content)
        flashcards = [{"question": "Error", "answer": "Could not parse flashcards"}]

    return flashcards

# Function 4: Quiz mode - multiple choice questions
def generate_quiz_options(question, correct_answer):
    instruction = """
    You are a quiz generator.
    Given a question and its correct answer, generate exactly 3 wrong but plausible answers.
    The wrong answers should be related to the topic but clearly incorrect.
    Return ONLY valid JSON. No explanation, no markdown, no extra text.
    Format:
    [
        "Wrong answer 1",
        "Wrong answer 2",
        "Wrong answer 3"
    ]

    Question: {question}
    Correct Answer: {correct_answer}
    """

    prompt = PromptTemplate.from_template(instruction)
    formatted = prompt.format(question=question, correct_answer=correct_answer)
    response = llm.invoke(formatted)
    content = response.content

    if isinstance(content, list):
        content = content[0]["text"]

    content = content.strip()
    if content.startswith("```"):
        content = content.split("```")[1]
        content = content.replace("json", "", 1).strip()

    try:
        wrong_answers = json.loads(content)
        if not isinstance(wrong_answers, list) or len(wrong_answers) < 3:
            raise ValueError("Invalid format")
    except Exception as e:
        print("RAW OUTPUT:\n", content)
        wrong_answers = [
            "Not enough information",
            "None of the above",
            "Cannot be determined"
        ]

    return wrong_answers