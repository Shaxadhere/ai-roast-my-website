# 🔥 AI Roast My Website

A fun, interactive React application that uses Google's Gemini AI to analyze and "roast" websites. Whether you want a savage critique, a Gen-Z reality check, or a professional design review, this app delivers instant feedback on your web design choices.

![Project Preview](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## ✨ Features

- **AI-Powered Analysis**: Scrapes website metadata and content to generate context-aware roasts using Google Gemini.
- **Multiple Roast Personas**:
  - **Savage but Smart**: The default mode. Ruthless but constructive.
  - **Light & Friendly**: A gentle nudge in the right direction.
  - **Gen-Z Internet Roast**: Full of slang and brutal honesty.
  - **Corporate Buzzword Roast**: Critiques your "synergy" and "paradigm shifts".
  - **Professional Critique**: Serious feedback for serious developers.
- **Vibe Score**: A calculated rating (0-10) of your website's overall appeal.
- **Detailed Breakdown**: Specific feedback on First Impressions, Design & UI, Content & Copy, and Performance/UX.
- **Roast History**: Keeps track of your recent victims (saved locally).
- **Social Sharing**: Easily share your results on Twitter/X or copy to clipboard.

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 + Vite
- **Styling**: Tailwind CSS (Dark mode, Custom Animations)
- **Icons**: Lucide React
- **AI Integration**: Google Generative AI SDK (`@google/genai`)
- **Data Fetching**: Native Fetch API with `allorigins.win` proxy for CORS handling

## 🚀 Getting Started

Follow these steps to get the project running locally.

### Prerequisites

- Node.js (v18 or higher recommended)
- A Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/ai-roast-my-website.git
    cd ai-roast-my-website
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory:

    ```bash
    touch .env.local
    ```

    Add your Gemini API key to the file:

    ```env
    GEMINI_API_KEY=your_actual_api_key_here
    ```

4.  **Run the Development Server**

    ```bash
    npm run dev
    ```

    The app should now be running at `http://localhost:3000`.

## 📦 Build for Production

To create a production-ready build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## ⚠️ Disclaimer

This application is for **entertainment purposes only**. The AI-generated content is intended to be humorous and satirical. We do not store any website data permanently. Please roast responsibly!

## 📄 License

MIT
