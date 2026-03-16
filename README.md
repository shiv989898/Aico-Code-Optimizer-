# AICO Studio

AICO Studio is an AI-powered code assistant that helps developers optimize, explain, and generate tests for their code in real-time. Built with React, Vite, Tailwind CSS, and powered by the Gemini API.

## Features

- **Code Optimization**: Get suggestions to improve performance and readability.
- **Code Explanation**: Understand complex logic with clear, step-by-step breakdowns.
- **Test Generation**: Automatically generate unit tests for your functions.
- **Multi-Language Support**: Supports C++, Python, Java, and more.
- **Beautiful UI**: A sleek, responsive, glassmorphism-inspired dark mode interface.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

You will also need a **Gemini API Key**. You can get one for free from [Google AI Studio](https://aistudio.google.com/app/apikey).

## Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-github-repo-url>
   cd <your-repo-directory>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory of the project and add your Gemini API key:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and replace the placeholder with your actual API key:
   ```env
   GEMINI_API_KEY="your_actual_api_key_here"
   ```

## Running the App Locally

Start the development server:

```bash
npm run dev
```

The application will start running at `http://localhost:3000`. Open this URL in your browser to use AICO Studio.

## Building for Production

To create a production build and run it:

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   npm run start
   ```

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express
- **AI**: Google Gen AI SDK (`@google/genai`)
