import fs from "fs";
import path from "path";

let currentDirectory = process.cwd();

// Store session data
export const sessionMemory = {
  conversation: [],
  fileContents: {},
};

export function listFilesAndFolders() {
  try {
    const files = fs.readdirSync(currentDirectory);
    
    if (files.length === 0) {
      return "📂 The directory is empty.";
    }

    let fileList = "📂 **Files & Folders in Current Directory:**\n";
    fileList += files.map((file) => `- ${file}`).join("\n");

    fileList += `\n\n🛠 **Commands:**\n`;
    fileList += `- 📜 To read a file: **open [filename]**\n`;
    fileList += `- 📂 To enter a folder: **cd [foldername]**\n`;
    fileList += `- 🔙 To go back: **go back**\n`;

    return fileList;
  } catch (error) {
    return `❌ Error listing directory: ${error.message}`;
  }
}

export function changeDirectory(folderName) {
  try {
    const newDir = path.join(currentDirectory, folderName);
    if (!fs.existsSync(newDir) || !fs.lstatSync(newDir).isDirectory()) {
      return `❌ Folder not found: ${folderName}`;
    }

    currentDirectory = newDir;
    return `📂 Changed directory to: ${currentDirectory}`;
  } catch (error) {
    return `❌ Error changing directory: ${error.message}`;
  }
}

export function goBack() {
  try {
    const parentDir = path.dirname(currentDirectory);
    currentDirectory = parentDir;
    return `🔙 Moved back to: ${currentDirectory}`;
  } catch (error) {
    return `❌ Error going back: ${error.message}`;
  }
}
