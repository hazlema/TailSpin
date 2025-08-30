<script lang="ts">
  import { Target, Check, X } from '@lucide/svelte';
  import { goto } from '$app/navigation';
  import { gameStore } from '$lib/stores/gameStore.svelte';
  import { GameUtils } from '$lib/utils/GameUtils';
  import visualChallengesData from '$lib/data/visual-challenges.json';
  import Fireworks from '$lib/components/Fireworks.svelte';
  import CompletionCard from '$lib/components/CompletionCard.svelte';
  
  // Shuffle challenges and randomize options for each challenge
  let visualChallenges = GameUtils.shuffle(visualChallengesData).map(challenge => {
    const { shuffled, newCorrectIndex } = GameUtils.randomize(challenge.options, challenge.correct);
    return {
      ...challenge,
      options: shuffled,
      correct: newCorrectIndex
    };
  });
  
  let currentChallengeIndex = $state(0);
  let challengeSelectedAnswer = $state<number | null>(null);
  let challengeShowResult = $state(false);
  let fireworksCounter = $state(0);
  let showCompletionCard = $state(false);
  
  function selectChallengeAnswer(index: number) {
    if (challengeShowResult) return;
    
    challengeSelectedAnswer = index;
    challengeShowResult = true;
    
    if (index === visualChallenges[currentChallengeIndex].correct) {
      gameStore.addScore(15);
      gameStore.incrementStreak();
      fireworksCounter++; // Increment to trigger fireworks
    } else {
      gameStore.resetStreak();
    }
    
    setTimeout(() => {
      nextChallenge();
    }, 2000);
  }
  
  function nextChallenge() {
    if (currentChallengeIndex < visualChallenges.length - 1) {
      currentChallengeIndex++;
      challengeSelectedAnswer = null;
      challengeShowResult = false;
    } else {
      // All challenges completed - show completion card
      showCompletionCard = true;
      fireworksCounter++; // Trigger celebration fireworks
    }
  }
  
  function finishChallengeMode() {
    gameStore.completeGame('challenge');
    goto('/');
  }
  
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
  
  <!-- Fireworks Effect -->
  <Fireworks trigger={fireworksCounter} duration={2000} intensity={40} particles={60} opacity={0.7} />
  
  <!-- Background decoration -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
    <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style="animation-delay: 2s;"></div>
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style="animation-delay: 4s;"></div>
  </div>
  
  <!-- Completion Card - positioned outside container for proper z-index -->
  {#if showCompletionCard}
    <CompletionCard 
      gameType="challenge" 
      questionsAnswered={visualChallenges.length}
      totalQuestions={visualChallenges.length}
      onFinish={finishChallengeMode} 
    />
  {/if}

  <div class="container mx-auto px-4 py-8 relative z-10">
    
    <!-- Visual Challenge Mode -->
    <div class="max-w-6xl mx-auto" class:hidden={showCompletionCard}>
      
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <button onclick={() => goto('/')} class="btn btn-outline">← Back to Menu</button>
        <div class="text-white">Challenge {currentChallengeIndex + 1}/{visualChallenges.length}</div>
      </div>
      
      <!-- Progress Bar -->
      <div class="bg-white/10 rounded-full h-2 mb-8">
        <div 
          class="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-300"
          style="width: {((currentChallengeIndex + 1) / visualChallenges.length) * 100}%">
        </div>
      </div>
      
      <div class="grid lg:grid-cols-2 gap-8">
        
        <!-- Left Side: Visual Preview -->
        <div class="order-2 lg:order-1">
          <h3 class="text-xl font-semibold text-white mb-4">Target Design:</h3>
          <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8">
            <p class="text-gray-300 mb-6">{visualChallenges[currentChallengeIndex].description}</p>
            
            <!-- Live Preview -->
            <div class="bg-gray-50 p-6 rounded-lg min-h-32 flex items-center justify-center">
              {#if visualChallenges[currentChallengeIndex].preview.element === 'button'}
                <button class={visualChallenges[currentChallengeIndex].preview.classes}>
                  {visualChallenges[currentChallengeIndex].preview.content}
                </button>
              {:else if visualChallenges[currentChallengeIndex].preview.element === 'h2'}
                <h2 class={visualChallenges[currentChallengeIndex].preview.classes}>
                  {visualChallenges[currentChallengeIndex].preview.content}
                </h2>
              {:else}
                <div class={visualChallenges[currentChallengeIndex].preview.classes}>
                  {visualChallenges[currentChallengeIndex].preview.content}
                </div>
              {/if}
            </div>
          </div>
        </div>
        
        <!-- Right Side: Answer Options -->
        <div class="order-1 lg:order-2">
          <h3 class="text-xl font-semibold text-white mb-4">Which Tailwind classes create this design?</h3>
          
          <div class="space-y-3">
            {#each visualChallenges[currentChallengeIndex].options as option, index}
              <button
                onclick={() => selectChallengeAnswer(index)}
                class="w-full p-4 rounded-lg text-left transition-all duration-200 border-2
                {challengeShowResult 
                  ? (index === visualChallenges[currentChallengeIndex].correct 
                    ? 'bg-green-500/20 border-green-400 text-green-100' 
                    : (challengeSelectedAnswer === index 
                      ? 'bg-red-500/20 border-red-400 text-red-100'
                      : 'bg-white/5 border-white/20 text-gray-300'))
                  : 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30'}">
                
                <div class="flex items-center justify-between">
                  <code class="text-sm font-mono">{option}</code>
                  {#if challengeShowResult && index === visualChallenges[currentChallengeIndex].correct}
                    <Check class="w-5 h-5 text-green-400" />
                  {/if}
                  {#if challengeShowResult && challengeSelectedAnswer === index && index !== visualChallenges[currentChallengeIndex].correct}
                    <X class="w-5 h-5 text-red-400" />
                  {/if}
                </div>
              </button>
            {/each}
          </div>
          
          <!-- Score Display -->
          <div class="mt-8">
            <div class="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div class="grid grid-cols-2 gap-8 text-center">
                <div>
                  <div class="text-2xl font-bold text-cyan-400">{gameStore.totalScore}</div>
                  <div class="text-sm text-gray-400">Score</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-yellow-400">{gameStore.currentStreak}</div>
                  <div class="text-sm text-gray-400">Streak</div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
    </div>
  </div>
</div>