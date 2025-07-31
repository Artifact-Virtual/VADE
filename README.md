# Virtual Development Environment (VADE)

VADE (Vade's Advanced Virtual Engine) is a production-ready, neomorphic-themed development environment with a live web editor and AVA, a powerful AI assistant powered by Gemini. This app allows you to build, debug, and export web projects seamlessly.

## Features

- **Live Code Editor**: Edit HTML, CSS, and JavaScript with real-time preview.
- **AI Assistant (AVA)**: Get intelligent suggestions and code fixes powered by Gemini.
- **Export Projects**: Easily export your projects as a zip file.
- **Inline Editing**: Modify elements directly from the live preview.
- **Debugging Tools**: AI-powered debugging for your code.

## Installation

### Prerequisites

- Node.js (latest LTS version recommended)

### Steps

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd vade
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your environment:

   - Create a `.env.local` file in the root directory.
   - Add your Gemini API key:

     ```env
     GEMINI_API_KEY=your_api_key_here
     ```

4. Run the app:

   ```bash
   npm run dev
   ```

## Usage

1. Open the app in your browser (default: `http://localhost:3000`).
2. Use the code editor to write or modify HTML, CSS, and JavaScript.
3. Interact with AVA in the chat pane for assistance.
4. Preview your changes in real-time.
5. Export your project using the export button.

## Technologies Used

- **Frontend**: React, Tailwind CSS
- **Build Tool**: Vite
- **AI Integration**: Gemini API
- **Utilities**: JSZip

## Contributing

We welcome contributions! To contribute:

1. Fork the repository.

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Create a new branch for your feature or bug fix:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Commit your changes:

   ```bash
   git commit -m "Add your message here"
   ```

4. Push to your branch:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
