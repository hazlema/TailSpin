# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TailSpin is a Svelte 5 educational game application that teaches Tailwind CSS through interactive challenges. It's built with:
- **Svelte 5** (using new runes syntax: $props, reactive declarations)
- **SvelteKit** with adapter-auto
- **Tailwind CSS v4** with DaisyUI, forms, and typography plugins
- **TypeScript** with strict mode
- **Lucide Svelte** for icons
- **Vite** as the build tool

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

## Project Architecture

### Core Structure
- `/src/routes/+layout.svelte` - Root layout with dark theme via DaisyUI
- `/src/routes/+page.svelte` - Main game application with three modes:
  - Visual Challenge: Match designs to Tailwind classes
  - Speed Round: Timed multiple choice questions
  - Build Mode: Step-by-step component construction
- `/src/app.css` - Tailwind CSS imports with plugins
- `/src/lib/` - Shared utilities and assets

### Game Architecture
The main page component uses reactive state management with:
- `gameMode` state switching between menu/challenge/speed/build views
- Question/challenge data stored in arrays with correct answers
- Scoring system with streak tracking
- Timer functionality for speed rounds
- Live preview system for build mode

### Styling
- Uses Tailwind CSS v4 with modern @import syntax
- DaisyUI provides theme system (data-theme="dark")
- Custom gradient backgrounds and glass-morphism effects
- Responsive design with mobile-first approach

## Key Implementation Details

- **Svelte 5 Runes**: Uses `$props()` for prop destructuring, reactive statements with `$:`
- **Event Handlers**: Uses `onclick={() => func()}` syntax throughout
- **Conditional Rendering**: Extensive use of `{#if}` blocks for game state
- **Animations**: Uses Tailwind classes for transitions, custom particle effects
- **Icons**: Lucide Svelte components imported individually

## Development Notes

- No custom CSS beyond Tailwind - all styling uses utility classes
- TypeScript strict mode enabled with comprehensive type checking
- Component uses large inline arrays for game content (could be extracted to data files)
- Uses setTimeout/setInterval for game timers (not cleaned up in all cases)
- Particle effect system creates DOM elements dynamically