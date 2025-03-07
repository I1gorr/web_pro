import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";
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
  system_prompt: `You are an AI tutor assisting students in an interactive chat. 
  - Your responses should be **clear, concise, and structured**. 
  - When explaining concepts, use **short paragraphs, bullet points, and examples**.
  - Use line breaks to improve readability in the chatbox.
  - If a user asks for step-by-step guidance, number the steps for clarity.
  - Keep explanations **friendly and engaging**.`,
});

// Memory for storing session data
const sessionMemory = {
  conversation: [],
  fileContents: {},
  currentDirectory: process.cwd(),
};

/**
 * Recursively lists files and folders
 */
function listFilesAndFolders(dir = sessionMemory.currentDirectory, depth = 1) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let output = `📂 Directory: ${dir}\n`;

    entries.forEach((entry, index) => {
      output += entry.isDirectory()
        ? `📁 [${index}] ${entry.name}/\n`
        : `📄 [${index}] ${entry.name}\n`;
    });

    return output || "📂 Directory is empty.";
  } catch (error) {
    return `❌ Error listing files: ${error.message}`;
  }
}

/**
 * Change directory
 */
function changeDirectory(folderName) {
  const newPath = path.join(sessionMemory.currentDirectory, folderName);

  if (!fs.existsSync(newPath) || !fs.lstatSync(newPath).isDirectory()) {
    return `❌ Directory not found: ${folderName}`;
  }

  sessionMemory.currentDirectory = newPath;
  return `📂 Changed directory to: ${newPath}`;
}

/**
 * Go back to the parent directory
 */
function goBack() {
  const parentDir = path.dirname(sessionMemory.currentDirectory);

  if (parentDir === sessionMemory.currentDirectory) {
    return "🔒 Already at the root directory.";
  }

  sessionMemory.currentDirectory = parentDir;
  return `📂 Moved up to: ${parentDir}`;
}

/**
 * Extracts text from PDFs using pdf-lib
 */
async function extractTextFromPDF(filePath) {
  try {
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    let text = "";

    for (const page of pages) {
      const { items } = await page.getTextContent();
      text += items.map((item) => item.str).join(" ") + "\n\n";
    }

    return text.trim() || "❌ No text found in PDF.";
  } catch (error) {
    return `❌ Error reading PDF: ${error.message}`;
  }
}

/**
 * Reads any file (TXT, MD, JSON, JS, etc.)
 */
async function readAnyFile(filePath) {
  try {
    const absolutePath = path.resolve(sessionMemory.currentDirectory, filePath);
    if (!fs.existsSync(absolutePath)) {
      return `❌ File not found: ${filePath}`;
    }

    let fileContent = "";
    if (filePath.endsWith(".pdf")) {
      fileContent = await extractTextFromPDF(absolutePath);
    } else {
      fileContent = fs.readFileSync(absolutePath, "utf8");
    }

    sessionMemory.fileContents[filePath] = fileContent;
    return `✅ Successfully read: ${filePath}`;
  } catch (error) {
    return `❌ Error reading file: ${error.message}`;
  }
}

/**
 * Selects multiple files for context
 */
async function selectMultipleFiles(fileNames) {
  let response = "";
  for (const fileName of fileNames) {
    response += await readAnyFile(fileName) + "\n";
  }
  return response;
}

/**
 * AI Chat Processing with Context
 */
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  console.log("User:", userMessage);

  sessionMemory.conversation.push(`User: ${userMessage}`);
  let botResponse = "";

  if (userMessage.toLowerCase() === "list files") {
    botResponse = listFilesAndFolders();
  } else if (userMessage.startsWith("cd ")) {
    botResponse = changeDirectory(userMessage.substring(3));
  } else if (userMessage.toLowerCase() === "go back") {
    botResponse = goBack();
  } else if (userMessage.startsWith("open ")) {
    const fileNames = userMessage.substring(5).split(",").map((f) => f.trim());
    botResponse = await selectMultipleFiles(fileNames);
  } else {
    const fileContext = Object.entries(sessionMemory.fileContents)
      .map(([name, content]) => `File: ${name}\n${content}`)
      .join("\n\n");

    const context = `Stored Files:\n${fileContext}\n\nConversation History:\n${sessionMemory.conversation.join("\n")}\nTutor:`;

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

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 AI Tutor running on http://localhost:${PORT}`));
