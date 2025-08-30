# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TailSpin is a Svelte 5 educational game application that teaches Tailwind CSS through interactive challenges. Live deployment: https://tailspin2.netlify.app/

**Tech Stack:**
- **Svelte 5** (using new runes syntax: `$state`, `$props`, `$effect`)
- **SvelteKit** with adapter-auto
- **Tailwind CSS v4** with DaisyUI, forms, and typography plugins
- **TypeScript** with strict mode
- **Fireworks.js** for celebration animations
- **Lucide Svelte** for icons

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run TypeScript and Svelte checks
npm run check

# Watch mode for type checking
npm run check:watch

# Lint code
npm run lint
```

## Architecture Overview

### Game Modes Structure
TailSpin has three distinct game modes, each with its own route:
- **Visual Challenge** (`/challenge`) - Match UI designs to Tailwind classes
- **Speed Round** (`/speed`) - Timed multiple-choice questions with 30s timer
- **Build Mode** (`/build`) - Step-by-step component construction with validation

### State Management Architecture
**Global Game Store** (`/src/lib/stores/gameStore.svelte.ts`):
- Uses Svelte 5 runes (`$state`) for reactivity
- Tracks score, level, streaks across all game modes
- Provides completion tracking per game type
- Singleton pattern with class-based structure

**Per-Game State**:
Each game mode manages its own local state using `$state()` runes:
- Current question/challenge index
- User selections and results
- Timer state (speed round)
- Completion and celebration triggers

### Component Architecture
**Reusable Components:**
- `Fireworks.svelte` - Celebration animations with TTL timer and counter-based triggers
- `CompletionCard.svelte` - Game completion overlay with stats from game store

**Game-Specific Logic:**
- Question/challenge data stored in JSON files (`/src/lib/data/`)
- Validation logic in `TailwindValidator.ts` with pattern-based class checking
- Game utilities in `GameUtils.ts` for shuffling and randomization

### Styling System
- **Pure Tailwind CSS** - No custom CSS files beyond imports
- **DaisyUI theme system** - Uses `data-theme="dark"` on html element
- **Glass-morphism effects** - `backdrop-blur-sm` with transparency
- **Responsive design** - Mobile-first approach with breakpoint classes

### Svelte 5 Implementation Details
**State Management:**
```javascript
let currentIndex = $state(0);        // Reactive state
let showResult = $state(false);      // Boolean state
let fireworksCounter = $state(0);    // Counter for triggering effects
```

**Effect Handling:**
```javascript
$effect(() => {
  // Reactive effects for side effects
  if (trigger > lastTrigger) {
    startFireworks();
  }
});
```

**Props Destructuring:**
```javascript
let { gameType, onFinish }: Props = $props();
```

### Game Flow Patterns
1. **Question Flow**: Load data → Shuffle → Present → Validate → Score → Next
2. **Completion Flow**: Last question → Show completion card → Update stats → Navigate
3. **Celebration Flow**: Correct answer → Increment fireworks counter → Auto-stop after duration
4. **Timer Flow**: Start timer → Pause on selection → Restart for next question OR timeout handling

### Data Structure Patterns
**Game Content Files:**
- `visual-challenges.json` - UI previews with class options
- `speed-questions.json` - Multiple choice questions with explanations  
- `build-challenges.json` - Step-by-step instructions with required patterns

**Validation Patterns:**
- Flexible pattern matching (`px-`, `bg-`, exact matches)
- Smart hint generation with appropriate examples
- Context-aware error messages