# Quick Start Guide

## Setup

### 1. Backend Setup

```bash
cd Demo/backend
npm install
```

Create `.env` file:
```env
PORT=5000
OPENAI_API_KEY=your-openai-api-key-here
```

Start backend:
```bash
npm run dev
```

Backend runs on: http://localhost:5000

### 2. Frontend Setup

```bash
cd Demo/frontend
npm install
```

Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

Frontend runs on: http://localhost:3000

## Demo Flow

1. **Open** http://localhost:3000
2. **Click "Teacher Portal"**
3. **Create Assignment:**
   - Click "Create Assignment"
   - Fill in title, description, due date
   - Add questions with:
     - Question text
     - Options (A, B, C, D)
     - **Select correct answer(s)** (mandatory)
     - **Add rubric** (mandatory - for AI feedback)
     - Marks per question
4. **Click "Student Portal"**
5. **Submit Assignment:**
   - Enter your name
   - Select answers
   - Submit
6. **Back to Teacher Portal:**
   - Click "Grade Now" on the assignment
   - Click "Auto-Grade All" (compares answers)
   - Click "Generate AI Feedback" (creates encouraging feedback)
   - Review feedback and "Finalize Grade"

## AI Feedback Showcase

The key feature is **Step 4** - AI Feedback Generation:
- Uses OpenAI GPT-4o-mini
- Generates encouraging, growth-oriented feedback
- Psychologically safe language
- Uses rubric from question to guide feedback

## Features

✅ Simple in-memory storage (no database needed)
✅ Teacher creates assignments with mandatory rubric
✅ Student submits answers
✅ Auto-grading by answer comparison
✅ **AI-powered encouraging feedback** (main focus)
✅ Teacher reviews and finalizes

## Notes

- Data is stored in memory (resets on server restart)
- Perfect for quick demos
- Focus on AI feedback generation
- No authentication needed for demo

