# LMS Demo - AI Grading System

Simple demo focused on showcasing AI-powered MCQ grading with encouraging feedback.

## Tech Stack
- **Frontend**: Next.js 14+ (React, TypeScript, Tailwind)
- **Backend**: Express.js (Node.js)
- **AI**: OpenAI API (for feedback generation)

## Features
- ✅ Teacher Portal: Create MCQ assignments with rubric & answer keys
- ✅ Student Portal: Submit answers to assignments
- ✅ Auto-Grading: Automatic score calculation
- ✅ AI Feedback: Per-question encouraging feedback using OpenAI
- ✅ Simple & Fast: In-memory storage, no complex database

## Quick Start

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## AI Grading Flow

1. **Teacher** creates MCQ assignment with rubric & answer keys
2. **Student** submits answers
3. **System** auto-grades by comparing answers
4. **AI** generates encouraging feedback for each question
5. **Teacher** reviews and finalizes grades

## Focus

This demo is designed to showcase the **AI feedback generation** - the core value proposition.

