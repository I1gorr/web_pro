import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import { PDFDocument } from "pdf-lib";
import { Ollama } from "@langchain/ollama";

const app = express();
app.use(cors());
app.use(express.json());

const llm = new Ollama({
  model: "llama3",
  temperature: 0.4,
  max_tokens: 1024,
  top_p: 0.85,
  presence_penalty: 0.6,
  frequency_penalty: 0.5,
  system_prompt: `You are an AI tutor assisting students. Use document content as a reference for answering queries.`
});

const sessionMemory = {
  conversation: [],
  documentContent: "",
  currentDirectory: process.cwd(),
  availableFiles: [],
};

// 📝 Extract text from PDFs
async function extractTextFromPDF(filePath) {
  try {
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const text = (await Promise.all(pdfDoc.getPages().map(page => page.getTextContent())))
      .map(({ items }) => items.map(item => item.str).join(" "))
      .join("\n\n");
    return text || "❌ No text found in PDF.";
  } catch (error) {
    return `❌ Error reading PDF: ${error.message}`;
  }
}

// 📝 Extract text from .docx files
async function extractTextFromDocx(filePath) {
  try {
    const docxBuffer = fs.readFileSync(filePath);
    const { value: text } = await mammoth.extractRawText({ buffer: docxBuffer });
    return text.trim() || "❌ No text found in DOCX.";
  } catch (error) {
    return `❌ Error reading DOCX: ${error.message}`;
  }
}

// 📝 Read .txt, .pdf, .docx, and .md files
async function readFileContent(filePath) {
  try {
    const absolutePath = path.resolve(sessionMemory.currentDirectory, filePath);
    if (!fs.existsSync(absolutePath)) return `❌ File not found: ${filePath}`;

    let content = "";
    if (filePath.toLowerCase().endsWith(".pdf")) {
      content = await extractTextFromPDF(absolutePath);
    } else if (filePath.toLowerCase().endsWith(".docx")) {
      content = await extractTextFromDocx(absolutePath);
    } else if (filePath.toLowerCase().endsWith(".txt") || filePath.toLowerCase().endsWith(".md")) {
      content = fs.readFileSync(absolutePath, "utf8");
    } else {
      return "❌ Unsupported file format. Please select a .txt, .md, .pdf, or .docx file.";
    }

    sessionMemory.documentContent = content;
    return `✅ Loaded document: ${filePath}`;
  } catch (error) {
    return `❌ Error reading file: ${error.message}`;
  }
}

// 📂 List files in the current directory
app.get("/list-files", (req, res) => {
  try {
    const files = fs.readdirSync(sessionMemory.currentDirectory);
    sessionMemory.availableFiles = files;
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: `❌ Error listing files: ${error.message}` });
  }
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message.trim();
  console.log("User:", userMessage);

  sessionMemory.conversation.push(`User: ${userMessage}`);
  let botResponse = "";

  if (userMessage.toLowerCase() === "list files") {
    // Fetch and return available files
    const files = fs.readdirSync(sessionMemory.currentDirectory);
    sessionMemory.availableFiles = files;
    botResponse = files.length
      ? `📂 Available files:\n${files.map((f, i) => `${i + 1}. ${f}`).join("\n")}`
      : "📂 No files found in the current directory.";
  } 
  else if (userMessage.toLowerCase().startsWith("select ")) {
    const fileNameInput = userMessage.substring(7).trim();
    const matchedFile = sessionMemory.availableFiles.find(f => f.toLowerCase() === fileNameInput.toLowerCase());

    if (matchedFile) {
      botResponse = await readFileContent(matchedFile);
    } else {
      botResponse = `❌ File not found: ${fileNameInput}`;
    }
  } 
  else {
    // Provide AI model with relevant context
    const context = `Document Content:\n${sessionMemory.documentContent}\n\nConversation History:\n${sessionMemory.conversation.join("\n")}\nTutor:`;
    try {
      botResponse = await llm.invoke(context);
    } catch (error) {
      console.error("AI Error:", error);
      botResponse = "❌ AI Error! Failed to process request.";
    }
  }

  console.log("Tutor:", botResponse);
  sessionMemory.conversation.push(`Tutor: ${botResponse}`);
  res.json({ response: botResponse });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 AI Tutor running on http://localhost:${PORT}`));