import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { PDFDocument } from "pdf-lib";
import { Ollama } from "@langchain/ollama";
import { listFilesAndFolders, changeDirectory, goBack, sessionMemory } from "./directoryUtils.mjs";

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


sessionMemory.conversation = [];
sessionMemory.fileContents = {};

const BASE_DIRECTORY = process.cwd();

/**
 * Calls Python script to process file
 */
function processFileWithPython(filePath) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python3", ["process_file.py", filePath]);
    let data = "";

    pythonProcess.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    pythonProcess.stderr.on("data", (err) => {
      console.error("Python Error:", err.toString());
    });

    pythonProcess.on("close", () => {
      resolve(data.trim());
    });
  });
}

/**
 * Reads and extracts text from a PDF using pdf-lib
 */
async function extractTextFromPDF(filePath) {
  try {
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    let text = "";

    for (const page of pages) {
      const { items } = await page.getTextContent();
      text += items.map(item => item.str).join(" ") + "\n\n"; // Extracts text properly
    }

    return text.trim() || "❌ No text found in PDF.";
  } catch (error) {
    console.error(`Error reading PDF: ${filePath}`, error);
    return "❌ Error reading PDF.";
  }
}
/**
 * Reads any file and sends it for Python processing
 */
async function readAnyFile(filePath) {
  try {
    const absolutePath = path.resolve(BASE_DIRECTORY, filePath);
    if (!fs.existsSync(absolutePath)) {
      return `❌ File not found: ${filePath}`;
    }

    let fileContent = "";

    if (filePath.endsWith(".pdf")) {
      fileContent = await extractTextFromPDF(absolutePath);
    } else {
      fileContent = fs.readFileSync(absolutePath, "utf8");
    }

    sessionMemory.fileContents[filePath] = fileContent; // Store content for AI context
    return `✅ Successfully read: ${filePath}`;
  } catch (error) {
    console.error(`❌ Read Error: ${filePath}`, error);
    return `❌ Error reading file: ${filePath}`;
  }
}

/**
 * Handles multiple file selection
 */
async function selectMultipleFiles(fileNames) {
  let response = "";

  for (const fileName of fileNames) {
    const fileContent = await readAnyFile(fileName);
    sessionMemory.fileContents[fileName] = fileContent;
    response += `✅ Processed file: ${fileName}\n`;
  }

  return response;
}

/**
 * API Endpoint for chat processing
 */
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  console.log("User:", userMessage);

  sessionMemory.conversation.push(`User: ${userMessage}`);
  let botResponse = "";

  if (userMessage.toLowerCase() === "list files") {
    botResponse = listFilesAndFolders();
  } else if (userMessage.startsWith("cd ")) {
    const folderName = userMessage.substring(3);
    botResponse = changeDirectory(folderName);
  } else if (userMessage.toLowerCase() === "go back") {
    botResponse = goBack();
  } else if (userMessage.startsWith("open ")) {
    const fileNames = userMessage.substring(5).split(",").map(f => f.trim());
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
