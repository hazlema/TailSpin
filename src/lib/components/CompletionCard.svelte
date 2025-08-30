<script lang="ts">
  import { Trophy, Star, Target, Zap } from '@lucide/svelte';
  import { gameStore } from '$lib/stores/gameStore.svelte';
  
  interface Props {
    gameType: 'challenge' | 'speed' | 'build';
    questionsAnswered?: number;
    totalQuestions?: number;
    onFinish: () => void;
  }
  
  let { gameType, questionsAnswered = 0, totalQuestions = 0, onFinish }: Props = $props();
  
  // Get appropriate title and emoji for each game type
  const gameInfo = {
    challenge: {
      title: 'Visual Challenge Complete!',
      emoji: '🎯',
      icon: Target,
      color: 'cyan'
    },
    speed: {
      title: 'Speed Round Complete!', 
      emoji: '⚡',
      icon: Zap,
      color: 'yellow'
    },
    build: {
      title: 'Build Mode Complete!',
      emoji: '🏗️', 
      icon: Trophy,
      color: 'purple'
    }
  };
  
  const info = gameInfo[gameType];
  const IconComponent = info.icon;
</script>

<div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
  <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-md w-full text-center animate-pulse">
    
    <!-- Celebration Header -->
    <div class="text-8xl mb-4">{info.emoji}</div>
    <h2 class="text-3xl font-bold text-white mb-2">{info.title}</h2>
    <p class="text-gray-300 mb-8">Congratulations on completing this challenge!</p>
    
    <!-- Game-specific Stats -->
    {#if totalQuestions > 0}
      <div class="bg-white/5 rounded-xl p-4 mb-6">
        <p class="text-lg text-white">
          Questions Answered: 
          {#if gameType === 'challenge'}
            <span class="text-cyan-400 font-bold">{questionsAnswered}/{totalQuestions}</span>
          {:else if gameType === 'speed'}
            <span class="text-yellow-400 font-bold">{questionsAnswered}/{totalQuestions}</span>
          {:else}
            <span class="text-purple-400 font-bold">{questionsAnswered}/{totalQuestions}</span>
          {/if}
        </p>
      </div>
    {/if}
    
    <!-- Overall Stats Grid -->
    <div class="grid grid-cols-2 gap-4 mb-8">
      <div class="bg-white/5 rounded-xl p-4">
        <div class="flex items-center justify-center mb-2">
          <Star class="w-6 h-6 mr-2 {gameType === 'challenge' ? 'text-cyan-400' : gameType === 'speed' ? 'text-yellow-400' : 'text-purple-400'}" />
          <span class="text-2xl font-bold {gameType === 'challenge' ? 'text-cyan-400' : gameType === 'speed' ? 'text-yellow-400' : 'text-purple-400'}">{gameStore.totalScore}</span>
        </div>
        <p class="text-sm text-gray-400">Total Score</p>
      </div>
      
      <div class="bg-white/5 rounded-xl p-4">
        <div class="flex items-center justify-center mb-2">
          <Trophy class="w-6 h-6 text-green-400 mr-2" />
          <span class="text-2xl font-bold text-green-400">{gameStore.currentLevel}</span>
        </div>
        <p class="text-sm text-gray-400">Level</p>
      </div>
      
      <div class="bg-white/5 rounded-xl p-4">
        <div class="flex items-center justify-center mb-2">
          <IconComponent class="w-6 h-6 text-orange-400 mr-2" />
          <span class="text-2xl font-bold text-orange-400">{gameStore.currentStreak}</span>
        </div>
        <p class="text-sm text-gray-400">Current Streak</p>
      </div>
      
      <div class="bg-white/5 rounded-xl p-4">
        <div class="flex items-center justify-center mb-2">
          <Star class="w-6 h-6 text-pink-400 mr-2" />
          <span class="text-2xl font-bold text-pink-400">{gameStore.gameStats.bestStreak}</span>
        </div>
        <p class="text-sm text-gray-400">Best Streak</p>
      </div>
    </div>
    
    <!-- Continue Button -->
    <button 
      onclick={onFinish}
      class="btn font-semibold px-8 py-3 text-lg w-full {gameType === 'challenge' ? 'bg-gradient-to-r from-cyan-400 to-cyan-600' : gameType === 'speed' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-purple-400 to-purple-600'} text-black">
      🏠 Return to Main Menu
    </button>
  </div>
</div>