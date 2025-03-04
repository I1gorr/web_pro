import sys
import os

def process_file(file_path):
    """Reads and extracts content from a file based on its type."""
    if not os.path.exists(file_path):
        print("❌ File not found.")
        return

    _, file_extension = os.path.splitext(file_path)
    file_extension = file_extension.lower()
    extracted_data = ""

    try:
        if file_extension in [".txt", ".md", ".json", ".js", ".html", ".css", ".py", ".java"]:
            with open(file_path, "r", encoding="utf-8") as file:
                extracted_data = file.read()

        elif file_extension == ".pdf":
            from PyPDF2 import PdfReader
            reader = PdfReader(file_path)
            extracted_data = "\n".join([page.extract_text() or "" for page in reader.pages])

        elif file_extension in [".jpg", ".jpeg", ".png"]:
            extracted_data = f"🖼️ Image file detected: {file_path}"

        else:
            extracted_data = f"⚠️ Unsupported file format: {file_extension}"

        # Print extracted data to the terminal
        print("\n========== Extracted Data ==========")
        print(extracted_data)
        print("\n====================================\n")

    except Exception as e:
        print(f"❌ Error processing file: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("❌ No file path provided.")
        sys.exit(1)

    # Handle spaces in file paths
    file_path = " ".join(sys.argv[1:])
    print(f"📂 Processing file: {file_path}\n")
    
    process_file(file_path)
