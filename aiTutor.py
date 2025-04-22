from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import fitz  # PyMuPDF
import docx
from langchain_ollama import OllamaLLM

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow only your React frontend
    allow_credentials=True,  # Allow cookies (if needed in the future)
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

class Message(BaseModel):
    message: str

# 📌 In-memory session state
session_memory = {
    "conversation": [],
    "document_content": "",
    "current_directory": os.getcwd(),
    "available_files": [],
}

# 🔍 Initialize LLM (adjust parameters as needed)
llm = OllamaLLM(
    model="llama3",
    temperature=0.7,
    system="You are an AI tutor assisting students. Use document content as a reference."
)

# 📄 Extract text from PDF
def extract_text_from_pdf(file_path):
    try:
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text.strip() or "❌ No text found in PDF."
    except Exception as e:
        return f"❌ PDF read error: {e}"

# 📄 Extract text from DOCX
def extract_text_from_docx(file_path):
    try:
        doc = docx.Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs]).strip()
    except Exception as e:
        return f"❌ DOCX read error: {e}"

# 📄 Read supported files
def read_file_content(file_path):
    try:
        if not os.path.exists(file_path):
            return f"❌ File not found: {file_path}"

        if file_path.lower().endswith(".pdf"):
            content = extract_text_from_pdf(file_path)
        elif file_path.lower().endswith((".docx", ".doc")):
            content = extract_text_from_docx(file_path)
        elif file_path.lower().endswith((".txt", ".md", ".js", ".ts", ".py", ".cpp", ".c", ".java", ".html", ".css", ".json")):
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
                if len(content) > 5000:
                    content = content[:5000] + "\n\n[⚠️ Truncated due to length]"
        else:
            return "❌ Unsupported file format."

        session_memory["document_content"] = content
        return f"✅ Loaded document: {os.path.basename(file_path)}"

    except Exception as e:
        return f"❌ Error reading file: {e}"

# 📂 List files
@app.get("/list-files")
def list_files():
    try:
        files = os.listdir(session_memory["current_directory"])
        session_memory["available_files"] = files
        return {"files": files}
    except Exception as e:
        return {"error": f"❌ Error listing files: {str(e)}"}

# 💬 Chat endpoint (Updated to return HTML-formatted responses)
@app.post("/chat")
async def chat(msg: Message):
    user_message = msg.message.strip()
    session_memory["conversation"].append(f"User: {user_message}")
    bot_response = ""

    # Check if the message is about files or documents
    if user_message.lower() == "list files":
        files = os.listdir(session_memory["current_directory"])
        session_memory["available_files"] = files
        bot_response = "### 📂 Available files:\n" + "\n".join([f"{i+1}. {f}" for i, f in enumerate(files)]) if files else "No files found."

    elif user_message.lower().startswith("select "):
        file_name = user_message[7:].strip()
        matched = next((f for f in session_memory["available_files"] if f.lower() == file_name.lower()), None)
        if matched:
            file_path = os.path.join(session_memory["current_directory"], matched)
            bot_response = f"### Document content:\n{read_file_content(file_path)}"
        else:
            bot_response = f"❌ File not found: {file_name}"

    elif "what is the file about" in user_message.lower() or "topics covered" in user_message.lower():
        if not session_memory["document_content"]:
            bot_response = "❌ No document loaded. Please select a file first."
        else:
            prompt = f"Analyze and summarize the following document:\n\n{session_memory['document_content']}\n\n### Summary:"
            bot_response = llm(prompt)

    elif "line by line explanation" in user_message.lower():
        if not session_memory["document_content"]:
            bot_response = "❌ No document loaded. Please select a file first."
        else:
            prompt = f"Provide a detailed, line-by-line explanation of the following code:\n\n{session_memory['document_content']}\n\n### Explanation:"
            bot_response = llm(prompt)

    else:
        context = f"### Document Content:\n{session_memory['document_content']}\n\n### Conversation History:\n{chr(10).join(session_memory['conversation'])}\nTutor:"
        bot_response = llm(context)

    session_memory["conversation"].append(f"Tutor: {bot_response}")
    return {"response": bot_response}

