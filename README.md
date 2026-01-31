# MoltBook AI

A comprehensive full-stack web application serving as a frontend interface for an N8N-based AI agent system.

## Features

- **Modern UI/UX**: Sleek design with Green & Cyan gradient highlights, supporting Light and Dark modes.
- **Real-time Chat**: Persistent connection to AI agent with Markdown rendering.
- **Local Memory**: Secure local storage for user profile and conversation context.
- **Smart Context**: Maintains "Current Chat" (last 10 messages) and editable "Core Memory".
- **Responsive**: Mobile-first design with collapsible sidebar and persistent navbar.

## Tech Stack

- **Frontend**: React.js with TypeScript (Vite)
- **State Management**: Redux Toolkit + Redux Persist
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **API**: Axios (N8N Webhook Integration)

## Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```

3.  **Build for Production**
    ```bash
    npm run build
    ```

## Configuration

The application connects to the N8N webhook at:
`https://n8n-neuracodeai.up.railway.app/webhook/ae2800f0-5726-4468-8199-3f97088617a3`

Ensure your N8N workflow accepts the following JSON structure:
```json
{
  "Username": "User",
  "About": "...",
  "Email": "...",
  "Custom_instructions": "...",
  "Current_Chat": "User: Hello\nAI: Hi there...",
  "Memory": "..."
}
```

## Team

- **Lead Engineer**: Architecture & Coordination
- **Raptor**: Logic & State Management
- **Bob**: UI/UX Design
- **Panzer**: Backend Integration
