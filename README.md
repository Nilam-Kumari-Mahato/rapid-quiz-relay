# Quizora

Quizora is a web-based quiz application designed to provide fast-paced, engaging quizzes with real-time feedback.  
It aims to help users test their knowledge across different topics through interactive quizzes.

⚠️ **Note:** This project is currently under development; some pages or features may be incomplete.

## Features

- ✅ **Real-time Quiz Sessions** - Create and join live quiz rooms with unique join codes
- ✅ **Timed Quizzes** - Configurable time limits per question (5 seconds to 10 minutes)
- ✅ **Multiple-choice Questions** - Support for 2-4 answer options per question
- ✅ **Score Tracking** - Real-time leaderboard with live score updates
- ✅ **User Authentication** - Secure authentication via Clerk
- ✅ **Quiz Management** - Create, edit, and delete quizzes with ease
- ✅ **Host & Player Modes** - Separate interfaces for quiz hosts and participants
- ✅ **Question Images** - Add images to quiz questions for richer content
- ✅ **Responsive Design** - Works seamlessly on desktop and mobile devices
- ✅ **Dark Mode** - Beautiful dark and light theme support

## Tech Stack

- **Frontend:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Backend:** Convex (real-time database and backend)
- **Authentication:** Clerk
- **State Management:** Zustand
- **Routing:** React Router DOM
- **UI Components:** Radix UI + Lucide React icons
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts (for analytics/visualizations)

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Convex CLI](https://docs.convex.dev/installation) - `npm install -g convex`
- A [Clerk](https://clerk.com/) account (for authentication)
- A [Convex](https://www.convex.dev/) account (for backend)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Nilam-Kumari-Mahato/Quizora.git
cd Quizora
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_CONVEX_URL=your_convex_url_here
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```

**How to get these values:**
- **Convex URL**: Run `npx convex dev` in your terminal. It will create a deployment and provide the URL.
- **Clerk Publishable Key**: Get it from your [Clerk Dashboard](https://dashboard.clerk.com/) under API Keys.

### 4. Set up Convex Backend

```bash
npx convex dev
```

This will:
- Start the Convex development server
- Set up the database schema
- Sync your backend functions
- Provide the `VITE_CONVEX_URL` for your `.env` file

### 5. Configure Clerk Authentication

In your Convex dashboard, add the following environment variable:
- `CLERK_ISSUER_URL`: Found in your Clerk Dashboard under JWT Templates → Convex → Issuer URL

### 6. Run the Application Locally

```bash
npm run dev
```

This will start the development server (typically at `http://localhost:8080`). Open the URL displayed in your terminal in your browser.

## Project Structure

```
Quizora/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page components (Dashboard, CreateQuiz, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── store/              # Zustand state management
├── convex/                 # Convex backend
│   ├── schema.ts           # Database schema definitions
│   ├── quizzes.ts          # Quiz CRUD operations
│   ├── sessions.ts         # Quiz session management
│   ├── gameplay.ts         # Real-time gameplay logic
│   └── users.ts            # User management
└── public/                 # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npx convex dev` - Start Convex development server

## Contribution Guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidance on contributing to this project.

## License

This project is part of the Winter of Code 5.0 program.

## Links

- **Repository:** https://github.com/Nilam-Kumari-Mahato/Quizora
- **Issues:** https://github.com/Nilam-Kumari-Mahato/Quizora/issues
