# CLI based Code Reviewer

An automated code review companion that reads your code, catches security flaws, and highlights fixes right inside your terminal using intelligent caching to keep it lightning-fast.

### Tech Stack
* **Backend:** Node.js, Express.js
* **AI Engine:** Google Gemini API (GenAI SDK)
* **Visuals:** PrismJS, Chalk (Terminal Highlighting)
* **Analyzer Engine:** Python 3, ThreadPoolExecutor, SQLite3
* **Deployment:** Docker (Lightweight Alpine Engine)

---

## Overview

This tool is built to act as a real-time assistant for your code reviews. It works in two smart ways:

1. **A lightweight JavaScript Git hook** that automatically scans your staged files before you commit, saving you from pushing messy code.
2. **A high-speed Python directory scanner** that climbs through your entire project folder structure at once to run deep logic and layout checks.

---

## Features

### Smart Git Hooks

It plugs right into your Git workflow. When you save your changes and go to commit, the tool steps in, asks Gemini for instant feedback, and cleanly color-codes any issues. It only lets the commit pass through if everything checks out safely.

### Vibrant Terminal Highlighting

No ugly, broken text blocks here. It formats and styles the code feedback beautifully directly inside your terminal, matching clean VS Code themes so it's incredibly easy on the eyes.

### Fast Folder Scanner

A smart Python engine walks through your directories, inspects your code structure for hidden issues (like endless loops or empty error blocks), and handles multiple files at the same time using rapid parallel processing.

### Cost-Saving Cache System

Every time a file is scanned, its digital fingerprint is saved in a local database. On your next run, any file you haven't touched skips the AI check entirely. This cuts down response times to zero and keeps API usage completely free.

---

## Installation & Setup

### JavaScript Setup

1. Head into the `BackEnd/` directory.

2. Install the setup tools:

```powershell
npm install
```

Create a `.env` file in the project root and add your API key:

```env
GEMINI_KEY=your_gemini_api_key
```

---

### Python Setup

Install the Google GenAI library:

```powershell
pip install google-genai
```

Save your API key to your PowerShell session:

```powershell
$env:GOOGLE_API_KEY="your_gemini_api_key"
```

To permanently save it in Windows:

```powershell
[System.Environment]::SetEnvironmentVariable("GOOGLE_API_KEY","your_gemini_api_key","User")
```

Restart PowerShell after setting the permanent environment variable.

---

### Container Setup (Docker)

Alternatively, you can run the backend API server inside a lightweight container.

Build the production Docker image:

```powershell
docker build -t code-reviewer-api .
```

Run the container on port **3000**:

```powershell
docker run -d -p 3000:3000 --env-file .env code-reviewer-api
```

---

## Usage

### Spin up the API Server

Get the main Express server running locally:

```powershell
npm run dev
```

---

### Review a Single File

To manually check a file and save the output report:

```powershell
npm run review path\to\file.js --save
```

Or without saving:

```powershell
npm run review path\to\file.js
```

---

### Scan an Entire Project Folder

To run a massive, multi-file audit across a whole folder structure:

```powershell
python -m reviewer.main --dir path\to\project
```
