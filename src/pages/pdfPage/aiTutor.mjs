import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import { Ollama } from "@langchain/ollama";
import { spawn } from "child_process";

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

// 📝 Extract text from PDFs using Python
async function extractTextFromPDF(filePath) {
  return new Promise((resolve, reject) => {
      const absolutePath = path.resolve(filePath); // Ensure absolute path
      if (!fs.existsSync(absolutePath)) {
          return reject(`❌ File not found: ${filePath}`);
      }

      console.log(`📄 Processing PDF: ${absolutePath}`); // Debugging

      const pythonProcess = spawn("python3", ["pdf_reader.py", absolutePath]); // No quotes needed

      let result = "";
      pythonProcess.stdout.on("data", (data) => {
          result += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
          console.error("❌ Python Error:", data.toString());
      });

      pythonProcess.on("close", (code) => {
          if (code === 0) {
              try {
                  const output = JSON.parse(result);
                  resolve(output.text);
              } catch (err) {
                  reject("❌ Error parsing Python output.");
              }
          } else {
              reject(`❌ Python script exited with code ${code}`);
          }
      });
  });
}

// 📝 Extract text from .docx files
async function extractTextFromDocx(filePath) {
  try {
    const docxBuffer = fs.readFileSync(filePath);
    const { value: text } = await mammoth.extractRawText({ buffer: docxBuffer });

    console.log(`📖 Extracted Text from ${filePath}:\n${text.slice(0, 500)}...`); // Log first 500 chars
    return text.trim() || "❌ No text found in DOCX.";
  } catch (error) {
    console.error("DOCX Parsing Error:", error);
    return `❌ Error reading DOCX: ${error.message}`;
  }
}

// 📝 Read .txt, .pdf, .docx, .md, and code files
async function readFileContent(filePath) {
  try {
    const absolutePath = path.resolve(sessionMemory.currentDirectory, filePath);
    if (!fs.existsSync(absolutePath)) return `❌ File not found: ${filePath}`;

    let content = "";
    if (filePath.toLowerCase().endsWith(".pdf")) {
      content = await extractTextFromPDF(absolutePath);
    } else if (filePath.toLowerCase().endsWith(".docx") || filePath.toLowerCase().endsWith(".doc")) {
      content = await extractTextFromDocx(absolutePath);
    } 
    // 📜 Read plain text-based files (Markdown, text, and code files)
    else if (
      filePath.toLowerCase().endsWith(".txt") ||
      filePath.toLowerCase().endsWith(".md") ||
      filePath.toLowerCase().endsWith(".js") ||
      filePath.toLowerCase().endsWith(".ts") ||
      filePath.toLowerCase().endsWith(".py") ||
      filePath.toLowerCase().endsWith(".cpp") ||
      filePath.toLowerCase().endsWith(".c") ||
      filePath.toLowerCase().endsWith(".java") ||
      filePath.toLowerCase().endsWith(".html") ||
      filePath.toLowerCase().endsWith(".css") ||
      filePath.toLowerCase().endsWith(".json")
    ) {
      content = fs.readFileSync(absolutePath, "utf8");

      // ⚠️ If the file is too long, truncate it
      if (content.length > 5000) {
        content = content.slice(0, 5000) + "\n\n[⚠️ Truncated due to length]";
      }

      console.log(`📖 Extracted Text from ${filePath}:\n${content.slice(0, 500)}...`); // Log first 500 chars
    } else {
      return "❌ Unsupported file format. Please select a .txt, .md, .pdf, .docx, or code file.";
    }

    sessionMemory.documentContent = content;
    return `✅ Loaded document: ${filePath}`;
  } catch (error) {
    console.error("File Reading Error:", error);
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
  console.log("👤 User:", userMessage);

  sessionMemory.conversation.push(`User: ${userMessage}`);
  let botResponse = "";

  if (userMessage.toLowerCase() === "list files") {
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
  else if (userMessage.toLowerCase().includes("what is the file about") || userMessage.toLowerCase().includes("topics covered")) {
    if (!sessionMemory.documentContent) {
      botResponse = "❌ No document loaded. Please select a file first.";
    } else {
      const prompt = `Analyze the following document and summarize its contents:\n\n${sessionMemory.documentContent}\n\nSummary:`;
      try {
        botResponse = await llm.invoke(prompt);
      } catch (error) {
        console.error("❌ AI Error:", error);
        botResponse = "❌ AI Error! Failed to generate summary.";
      }
    }
  } 
  else if (userMessage.toLowerCase().includes("line by line explanation")) {
    if (!sessionMemory.documentContent) {
      botResponse = "❌ No document loaded. Please select a file first.";
    } else {
      const prompt = `Provide a detailed, line-by-line explanation of the following code:\n\n${sessionMemory.documentContent}\n\nExplanation:`;
      try {
        botResponse = await llm.invoke(prompt);
      } catch (error) {
        console.error("❌ AI Error:", error);
        botResponse = "❌ AI Error! Failed to explain the code.";
      }
    }
  }
  else {
    const context = `Document Content:\n${sessionMemory.documentContent}\n\nConversation History:\n${sessionMemory.conversation.join("\n")}\nTutor:`;
    try {
      botResponse = await llm.invoke(context);
    } catch (error) {
      console.error("❌ AI Error:", error);
      botResponse = "❌ AI Error! Failed to process request.";
    }
  }

  console.log("🤖 Tutor:", botResponse);
  sessionMemory.conversation.push(`Tutor: ${botResponse}`);
  res.json({ response: botResponse });
});


const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 AI Tutor running on http://localhost:${PORT}`));
