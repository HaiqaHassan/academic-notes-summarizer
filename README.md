# AI-Powered Academic Notes Summarizer

A Flask web application that turns student-provided lecture notes and text-based PDF documents into structured study material using the Groq API. It creates a main summary, key concepts, definitions, important points, exam questions, quick revision notes, and key takeaways.

The interface uses a warm **beige, sage green, and brown** academic theme.

## Features

- Paste lecture notes or upload a PDF (maximum 12 MB).
- Select Short Summary, Detailed Summary, or Exam Preparation Notes.
- Generate content in English or Urdu.
- Extract key concepts, definitions, important points, and revision notes.
- Generate 5 short-answer, 5 conceptual, and 5 long-answer questions.
- Copy or download the generated material as a `.txt` file.
- Validate empty input, unsupported files, oversized files, and unreadable PDFs.
- Keep the Groq API key on the backend; it is never sent to browser JavaScript.
- No database. Uploaded PDFs are processed in memory and are not saved to disk.

> Accuracy note: the prompt instructs the model to use only the supplied material and identify missing information. As with any LLM, review generated study material before relying on it.

## Technologies

- Python 3.10+
- Flask
- Groq Python SDK
- python-dotenv
- PyMuPDF
- HTML, CSS, JavaScript
- Bootstrap 5 (CDN)

## Project structure

```text
academic-notes-summarizer/
├── app.py
├── requirements.txt
├── .env.example
├── .gitignore
├── README.md
├── templates/
│   └── index.html
├── static/
│   ├── style.css
│   └── script.js
└── uploads/
    └── .gitkeep
```

## Requirements

- Python 3.10 or newer
- Internet connection for Groq API requests and the Bootstrap/font CDNs
- A Groq API key

Get an API key from the Groq Console: https://console.groq.com/keys

## Setup on Windows (PowerShell)

Open PowerShell in the extracted `academic-notes-summarizer` folder.

### 1. Create and activate a virtual environment

```powershell
py -m venv venv
venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, run this command once in the current PowerShell window, then activate again:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
venv\Scripts\Activate.ps1
```

### 2. Install dependencies

```powershell
py -m pip install --upgrade pip
py -m pip install -r requirements.txt
```

### 3. Create your `.env` file

Copy the example file:

```powershell
Copy-Item .env.example .env
```

Open `.env` in VS Code and replace the placeholder with your own key:

```text
GROQ_API_KEY=your_actual_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
```

Do not add quotation marks around the key. Never share `.env` or upload it to GitHub. The `.gitignore` file excludes it.

### 4. Run the application

```powershell
py app.py
```

### 5. Open it in your browser

Visit:

```text
http://127.0.0.1:5000
```

Keep the terminal window open while using the app. Press `Ctrl+C` in the terminal to stop the server.

## Setup on macOS

Open Terminal in the extracted project folder:

```bash
python3 -m venv venv
source venv/bin/activate
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt
cp .env.example .env
```

Add your Groq key to `.env`, then run:

```bash
python3 app.py
```

Open `http://127.0.0.1:5000`.

## How to use

1. Paste academic material into the text area, or choose a text-based PDF.
2. Select a summary style and output language.
3. Click **Generate Summary**.
4. Wait for the results to appear in separate study cards.
5. Use **Copy Summary** or **Download .txt** to keep your notes.
6. Use **Generate Again** to return to the input area, or **Clear All** to reset the page.

If both pasted text and a PDF are supplied, the app combines them before sending the material to Groq.

## Common errors and solutions

| Error | What to do |
|---|---|
| Groq API key is missing | Confirm `.env` exists in the same folder as `app.py` and contains `GROQ_API_KEY=...`. Restart `py app.py` after editing it. |
| Groq rejected the API key | Check that the key is copied correctly and is active. Do not include spaces around the value. |
| Rate limit reached | Wait briefly and try again. |
| Could not connect to Groq | Check your internet connection and try again. |
| PDF could not be read | Try a valid, non-password-protected PDF. |
| No selectable text found | This version supports text-based PDFs, not scanned/image-only PDFs. |
| File too large | Use a PDF smaller than 12 MB. |
| `py` is not recognized | Reinstall Python from https://www.python.org/downloads/ and enable the option to add Python to PATH. |
| Port 5000 is already in use | Close the other app using port 5000, then restart this app. |

## Privacy and security

- The API key is read from `.env` on the Flask server.
- The API key is not embedded in HTML or JavaScript.
- PDF content is read into memory and is not saved in the `uploads` folder.
- `.env` and the virtual environment are excluded by `.gitignore`.
- The academic material is sent to Groq for model processing when you request a summary. Do not submit material you are not permitted to share.

## Notes about PDF support

PyMuPDF extracts selectable text from PDFs. It does not perform OCR in this project, so scanned pages that contain only images may not produce text.

## Troubleshooting the model

The default model is `llama-3.3-70b-versatile`. If it is unavailable for your Groq account, update `GROQ_MODEL` in `.env` to a currently supported chat model in your Groq Console.

## License

This project is provided for educational use. Add a license file if your course or instructor requires a specific license.
