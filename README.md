# Frontend Chat Challenge

A real-time chat application built with **React, TypeScript, and Vite**, featuring pagination, polling, and optimistic UI updates.

## 🚀 Features

- 💬 Send and display chat messages
- 👤 Distinguish between current user and others
- ⏱ Formatted timestamps
- 📜 Pagination for loading older messages
- 🔄 Polling for new messages
- ⚡ Optimistic UI updates
- 🔁 Automatic scroll handling
- 🚦 Loading and error state handling
- 🧠 Type-safe API integration with TypeScript
- 🧵 Multi-line message support
- 🎨 Clean and responsive UI with Tailwind CSS

## 🛠 Tech Stack

- React (with hooks)
- TypeScript
- Vite
- Tailwind CSS
- Fetch API

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Milan-Thummar/Frontend-Chat-Challenge.git
cd Frontend-Chat-Challenge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_API_TOKEN=your-token-here
```

You can use `.env.example` as a reference.

### 4. Run the app

```bash
npm run dev
```

App will be available at:

```
http://localhost:5173
```

## 🔌 API Configuration

The app connects to a backend API:

```
http://localhost:3000/api/v1
```

Authorization is handled via a token provided through environment variables.

## 📁 Project Structure

```
src/
  components/        # Reusable UI components
  features/chat/     # Chat logic and page
  services/          # API layer
  types/             # TypeScript types
  utils/             # Helper functions
```

## ♿ Accessibility

- Uses semantic HTML elements (`article`, `time`, etc.) for better structure
- Applies ARIA roles for dynamic updates (e.g., `role="status"`)
- Includes accessible labels for inputs and buttons
- Supports keyboard interactions (Enter to send, Shift + Enter for new lines)

## 🧠 Key Highlights

- Designed with **optimistic UI updates** for better user experience
- Implemented **pagination + polling** for efficient data handling
- Ensured **type safety** across API and UI layers using TypeScript
- Focused on **UX details** like scroll behavior and keyboard interactions
- Built with **modular architecture** for scalability and maintainability
