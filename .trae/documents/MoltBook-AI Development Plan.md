# MoltBook-AI Development Plan

## 1. Project Initialization & Architecture

* **Framework**: React with TypeScript (Vite) for a modern, type-safe codebase.

* **State Management**: Redux Toolkit to manage user profiles, chat history, and application state.

* **Routing**: React Router for navigation between Landing, Auth, and Chat pages.

* **Styling**: Tailwind CSS for responsive, mobile-first design.

## 2. Core Logic & Data Management (Raptor)

* **Local Memory System**:

  * Securely store user data (Username, Email, Password, About, Custom Instructions) in local storage via Redux Persist.

  * Implement "Memory" variable editing capabilities for both user and AI.

* **Chat Logic**:

  * Maintain "Current Chat" context (rolling window of last 10 messages).

  * Handle message threading and chronological ordering.

* **API Integration**:

  * Establish persistent connection to N8N Webhook: `https://n8n-neuracodeai.up.railway.app/webhook/ae2800f0-5726-4468-8199-3f97088617a3`.

  * Implement JSON protocol for outgoing requests (Username, About, Email, Custom\_instructions, Current\_Chat, Memory).

  * Parse incoming JSON responses and update local state dynamically.

## 3. UI/UX Implementation (Bob)

* **Design System**:

  * **Theme**: Green & Cyan gradient highlights.

  * **Modes**: White (Light Mode) and Gray-Black (Dark Mode).

* **Components**:

  * **Landing Page**: Hero section with feature overview.

  * **Auth Pages**: Sign-up and Login forms with validation.

  * **Main Chat Interface**: Real-time message display with Markdown rendering support.

  * **Navigation**: Persistent Navbar and collapsible Sidebar.

  * **Settings**: Modal/Popup for profile and instruction configuration.

## 4. Integration & Testing (Panzer & Lead)

* **Compliance**: Ensure WCAG 2.1 accessibility standards.

* **Testing**: Unit tests for components, integration tests for API, and cross-browser compatibility checks (Chrome, Firefox, Safari, Edge).

* **Deployment**: Prepare production-ready build configuration and Git repository structure.

