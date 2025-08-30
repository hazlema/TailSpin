<script lang="ts">
  import { Trophy, Target, Zap, Sparkles } from '@lucide/svelte';
  import { goto } from '$app/navigation';
  import { gameStore } from '$lib/stores/gameStore.svelte';
  import Fireworks from '$lib/components/Fireworks.svelte';
  
  let testFireworksCounter = $state(0);
  
  function triggerTestFireworks() {
    testFireworksCounter++;
    console.log('Fireworks triggered:', testFireworksCounter);
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
  
  <!-- Test Fireworks Component -->
  <Fireworks trigger={testFireworksCounter} duration={5000} intensity={80} particles={80} opacity={0.9} />
  
  <!-- Background decoration -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
    <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style="animation-delay: 2s;"></div>
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style="animation-delay: 4s;"></div>
  </div>
  
  <div class="container mx-auto px-4 py-8 relative z-10">
    
    <!-- Main Menu -->
    <div class="text-center">
      <h1 class="text-6xl font-bold text-white mb-4 tracking-tight animate-pulse">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
          TailSpin
        </span>
        <Sparkles class="inline w-12 h-12 text-yellow-400 ml-4 animate-spin" />
      </h1>
      <p class="text-xl text-gray-300 mb-12">Master Tailwind CSS through fun challenges!</p>
      
      <div class="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        
        <!-- Visual Challenge Mode -->
        <button 
          onclick={() => { gameStore.startGame('challenge'); goto('/challenge'); }}
          class="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105">
          <Target class="w-12 h-12 text-cyan-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
          <h3 class="text-xl font-semibold text-white mb-2">Visual Challenge</h3>
          <p class="text-gray-300 text-sm">Match designs with the correct Tailwind classes</p>
        </button>
        
        <!-- Speed Round -->
        <button 
          onclick={() => { gameStore.startGame('speed'); goto('/speed'); }}
          class="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105">
          <Zap class="w-12 h-12 text-yellow-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
          <h3 class="text-xl font-semibold text-white mb-2">Speed Round</h3>
          <p class="text-gray-300 text-sm">Quick-fire Tailwind knowledge test</p>
        </button>
        
        <!-- Build Mode -->
        <button 
          onclick={() => { gameStore.startGame('build'); goto('/build'); }}
          class="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105">
          <Trophy class="w-12 h-12 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
          <h3 class="text-xl font-semibold text-white mb-2">Build Mode</h3>
          <p class="text-gray-300 text-sm">Construct layouts step by step</p>
        </button>
        
      </div>
      
      <!-- Stats -->
      <div class="mt-16 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 max-w-md mx-auto">
        <div class="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <div class="text-2xl font-bold text-cyan-400">{gameStore.totalScore}</div>
            <div class="text-sm text-gray-400">Score</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-purple-400">{gameStore.currentLevel}</div>
            <div class="text-sm text-gray-400">Level</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-yellow-400">{gameStore.currentStreak}</div>
            <div class="text-sm text-gray-400">Streak</div>
          </div>
        </div>
        
        <!-- Test Fireworks Button -->
        <div class="text-center border-t border-white/10 pt-4">
          <button 
            onclick={triggerTestFireworks}
            class="btn btn-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold">
            🎆 Test Fireworks
          </button>
        </div>
      </div>
    </div>
  </div>
</div>