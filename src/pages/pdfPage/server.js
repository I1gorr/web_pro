import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5001;

app.use(cors()); // Allow CORS for React frontend
app.use(express.json());

// Use the current working directory
const PDF_FOLDER = process.cwd();

// Serve PDFs statically
app.use("/pdfs", express.static(PDF_FOLDER));

// API to list all PDFs in the current directory
app.get("/api/list-pdfs", (req, res) => {
    fs.readdir(PDF_FOLDER, (err, files) => {
        if (err) {
            console.error("Failed to list PDFs:", err);
            return res.status(500).json({ error: "Could not retrieve PDFs" });
        }
        const pdfFiles = files.filter((file) => file.endsWith(".pdf"));
        res.json(pdfFiles);
    });
});

app.listen(PORT, () => console.log(`📂 PDF Server running on http://localhost:${PORT}`));
