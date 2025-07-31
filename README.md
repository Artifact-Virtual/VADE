# Virtual Development Environment (VADE)

[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Gemini API](https://img.shields.io/badge/Gemini%20API-4285F4?style=flat&logo=google&logoColor=white)](https://ai.google.dev/)
[![JSZip](https://img.shields.io/badge/JSZip-FFC107?style=flat&logo=javascript&logoColor=white)](https://stuk.github.io/jszip/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

VADE (Vade's Advanced Virtual Engine) is a robust, neomorphic-themed development environment featuring a live web editor and AVA, an AI assistant powered by Gemini. Build, debug, and export web projects efficiently with modern tooling and intelligent assistance.

## Key Features

- **Live Code Editor**: Instantly edit and preview HTML, CSS, and JavaScript.
- **AI Assistant (AVA)**: Context-aware code suggestions and fixes via Gemini.
- **Project Export**: Download your project as a zip file with one click.
- **Inline Editing**: Directly modify elements from the live preview.
- **AI Debugging Tools**: Automated code analysis and troubleshooting.

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd vade
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env.local` file in the root directory.
   - Add your Gemini API key:
     ```env
     GEMINI_API_KEY=your_api_key_here
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

- Access the app at `http://localhost:3000`.
- Write or modify HTML, CSS, and JavaScript in the editor.
- Interact with AVA for code help and suggestions.
- Preview changes instantly.
- Export your project using the export feature.

## Technology Stack

- **Frontend**: React, Tailwind CSS
- **Build Tool**: Vite
- **AI Integration**: Gemini API
- **Utilities**: JSZip

## Contributing

Contributions are welcome! To get started:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Describe your changes"
   ```
4. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

