# 🎯 TailSpin

<div align="center">

**Master Tailwind CSS through fun interactive challenges! 🚀**

*A Svelte 5 educational game that makes learning Tailwind CSS addictively fun*

[![Svelte 5](https://img.shields.io/badge/Svelte-5-orange?style=for-the-badge&logo=svelte)](https://svelte.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

</div>

## ✨ What is TailSpin?

TailSpin transforms the sometimes overwhelming experience of learning Tailwind CSS into an engaging game! Whether you're a beginner trying to understand utility classes or a pro looking to sharpen your skills, TailSpin offers three exciting game modes to test and improve your Tailwind knowledge.

### [Play it now on Netlify](https://tailspin2.netlify.app/)

## 🎮 Game Modes

### 🎯 Visual Challenge Mode
Match stunning designs with the correct Tailwind classes! Look at beautiful UI components and select the right utility classes that create them.

- **Perfect for**: Visual learners who learn by seeing
- **Difficulty**: Beginner to Intermediate  
- **Skills**: Class recognition, design-to-code translation

### ⚡ Speed Round
Race against the clock! Answer rapid-fire Tailwind CSS questions before time runs out.

- **Perfect for**: Quick thinking and memorization
- **Difficulty**: All levels
- **Skills**: Fast recall, class memorization
- **Timer**: 30 seconds of pure adrenaline!

### 🏗️ Build Mode  
Step-by-step component construction! Build real UI components from scratch with guided instructions and smart hints.

- **Perfect for**: Hands-on learners who learn by doing
- **Difficulty**: Intermediate to Advanced
- **Skills**: Practical application, component building

## 🎊 Features That Make Learning Fun

- **🎆 Celebration Fireworks** - Gorgeous fireworks animations when you get answers right!
- **📊 Progress Tracking** - Level up as you play and track your learning journey
- **🔥 Streak System** - Build momentum with consecutive correct answers  
- **💡 Smart Hints** - Get contextual help with accurate Tailwind examples
- **🌙 Beautiful Dark Theme** - Easy on the eyes for those long learning sessions
- **📱 Responsive Design** - Play on any device, anywhere

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/tailspin.git
cd tailspin

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:5173` and start your Tailwind learning adventure! 🎉

## 🛠️ Tech Stack

- **⚡ Svelte 5** - Reactive UI framework with the new runes system
- **🎨 Tailwind CSS v4** - Latest utility-first CSS framework
- **🌼 DaisyUI** - Beautiful component library built on Tailwind
- **📝 TypeScript** - Type-safe development
- **🔥 Vite** - Lightning fast build tool
- **🎆 Fireworks.js** - Spectacular celebration animations
- **🎯 Lucide Icons** - Beautiful, consistent iconography

## 📁 Project Structure

```
src/
├── routes/                  # SvelteKit routes
│   ├── challenge/          # Visual Challenge mode
│   ├── speed/              # Speed Round mode  
│   ├── build/              # Build Mode
│   └── +layout.svelte      # Root layout
├── lib/
│   ├── components/         # Reusable components
│   │   ├── Fireworks.svelte    # Celebration animations
│   │   └── CompletionCard.svelte # Game completion overlay
│   ├── data/               # Game content
│   │   ├── visual-challenges.json
│   │   ├── speed-questions.json
│   │   └── build-challenges.json
│   ├── stores/             # Svelte stores
│   │   └── gameStore.svelte.ts # Game state management
│   └── utils/              # Helper utilities
│       ├── GameUtils.ts        # Game logic helpers
│       └── TailwindValidator.ts # Smart class validation
└── app.css                 # Global styles
```

## 🎯 Learning Path Recommendation

1. **Start with Visual Challenge** 🎯 - Get familiar with how classes look
2. **Try Speed Round** ⚡ - Build up your recall speed  
3. **Master Build Mode** 🏗️ - Apply knowledge practically

## 🤝 Contributing

We love contributions! Whether it's:
- 🐛 Bug reports
- 💡 Feature suggestions  
- 📚 New challenges and questions
- 🎨 UI improvements
- 📖 Documentation updates

## 📊 Game Stats

Track your progress with:
- **Total Score** - Points earned across all games
- **Current Level** - Automatically calculated from your score
- **Streak Counter** - Consecutive correct answers
- **Best Streak** - Your all-time streak record
- **Games Completed** - Per-mode completion tracking

## 🎨 Customization

TailSpin is built with customization in mind:
- Add your own challenges in the `/lib/data/` directory
- Customize fireworks settings in the `Fireworks.svelte` component
- Extend the game store with new features
- Create new game modes by following existing patterns

## 📱 Browser Support

TailSpin works great on:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+  
- ✅ Safari 14+
- ✅ Mobile browsers

## 🔄 Development Commands

```bash
# Start development server
npm run dev

# Build for production  
npm run build

# Preview production build
npm run preview

# Type checking
npm run check

# Linting
npm run lint
```

## 🌟 What's Next?

Exciting features coming soon:
- 🌐 **API Integration** - User-generated content and challenges
- 👥 **Community Features** - Share challenges with friends
- 📈 **Advanced Analytics** - Detailed learning insights  
- 🏆 **Leaderboards** - Compete with other learners
- 🎨 **Theme Customization** - Multiple color themes

## 💖 Credits

Built with love by developers who believe learning should be fun! Special thanks to:
- The Svelte team for the amazing framework
- Tailwind Labs for the incredible CSS framework  
- The open-source community for inspiration and tools

## 📄 License

MIT License - feel free to learn from, modify, and share! 

---

<div align="center">

**Ready to spin up your Tailwind skills?** 🌪️

[Start Playing](http://localhost:5173) • [Report Bug](https://github.com/your-username/tailspin/issues) • [Request Feature](https://github.com/your-username/tailspin/issues)

**Happy Learning!** 🎉

</div>
