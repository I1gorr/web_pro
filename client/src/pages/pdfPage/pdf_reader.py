import sys
import json
from pdfminer.high_level import extract_text

def extract_text_from_pdf(pdf_path):
    try:
        text = extract_text(pdf_path)
        return text.strip() if text.strip() else "❌ No text found in PDF."
    except Exception as e:
        return f"❌ Error reading PDF: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "❌ No PDF file provided"}))
        sys.exit(1)

    pdf_file = sys.argv[1]
    extracted_text = extract_text_from_pdf(pdf_file)
    
    # Return the extracted text as JSON output
    print(json.dumps({"text": extracted_text}))