import fs from "fs";
import path from "path";

let currentDirectory = process.cwd();

export const sessionMemory = {
  fileContents: {},
};

// List Files & Folders
export function listFilesAndFolders() {
  try {
    const files = fs.readdirSync(currentDirectory);
    return `📂 Files & Folders:\n${files.join("\n")}`;
  } catch (error) {
    return `❌ Error listing files: ${error.message}`;
  }
}

// Change Directory
export function changeDirectory(folderName) {
  try {
    const newPath = path.join(currentDirectory, folderName);
    if (fs.existsSync(newPath) && fs.lstatSync(newPath).isDirectory()) {
      currentDirectory = newPath;
      return `📂 Changed directory to: ${currentDirectory}`;
    } else {
      return `❌ Folder '${folderName}' does not exist.`;
    }
  } catch (error) {
    return `❌ Error changing directory: ${error.message}`;
  }
}

// Go Back One Directory
export function goBack() {
  try {
    currentDirectory = path.dirname(currentDirectory);
    return `📂 Moved back to: ${currentDirectory}`;
  } catch (error) {
    return `❌ Error moving back: ${error.message}`;
  }
}

// Read Multiple Files & Store Their Content
export function selectMultipleFiles(fileNames) {
  try {
    let response = "";

    fileNames.forEach((fileName) => {
      const filePath = path.join(currentDirectory, fileName);
      if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
        const content = fs.readFileSync(filePath, "utf8");
        sessionMemory.fileContents[fileName] = content;
        response += `✅ Loaded file: ${fileName}\n`;
      } else {
        response += `❌ File not found: ${fileName}\n`;
      }
    });

    return response;
  } catch (error) {
    return `❌ Error reading files: ${error.message}`;
  }
}
