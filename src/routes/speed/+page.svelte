<script lang="ts">
  import { Clock, Check, X } from '@lucide/svelte';
  import { goto } from '$app/navigation';
  import { gameStore } from '$lib/stores/gameStore.svelte';
  import { GameUtils } from '$lib/utils/GameUtils';
  import speedQuestionsData from '$lib/data/speed-questions.json';
  import Fireworks from '$lib/components/Fireworks.svelte';
  import CompletionCard from '$lib/components/CompletionCard.svelte';
  
  // Shuffle questions and randomize options for each question
  let speedQuestions = GameUtils.shuffle(speedQuestionsData).map(question => {
    const { shuffled, newCorrectIndex } = GameUtils.randomize(question.options, question.correct);
    return {
      ...question,
      options: shuffled,
      correct: newCorrectIndex
    };
  });
  
  let currentQuestionIndex = $state(0);
  let selectedAnswer = $state<number | null>(null);
  let showResult = $state(false);
  let timeLeft = $state(30);
  let speedGameActive = $state(false);
  let speedTimer: number;
  let fireworksCounter = $state(0);
  let gameTimedOut = $state(false);
  let showCompletionCard = $state(false);
  
  function startSpeedRound() {
    currentQuestionIndex = 0;
    selectedAnswer = null;
    showResult = false;
    timeLeft = 30;
    speedGameActive = true;
    gameTimedOut = false;
    
    speedTimer = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        gameTimedOut = true;
        endSpeedRound();
      }
    }, 1000);
  }
  
  function selectAnswer(index: number) {
    if (showResult || !speedGameActive) return;
    
    selectedAnswer = index;
    showResult = true;
    
    // Pause the timer when an answer is selected
    if (speedTimer) {
      clearInterval(speedTimer);
    }
    
    if (index === speedQuestions[currentQuestionIndex].correct) {
      gameStore.addScore(10);
      gameStore.incrementStreak();
      fireworksCounter++; // Increment to trigger fireworks
    } else {
      gameStore.resetStreak();
    }
    
    setTimeout(() => {
      nextQuestion();
    }, 1500);
  }
  
  function nextQuestion() {
    if (currentQuestionIndex < speedQuestions.length - 1) {
      currentQuestionIndex++;
      selectedAnswer = null;
      showResult = false;
      
      // Restart the timer for the next question
      speedTimer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
          gameTimedOut = true;
          endSpeedRound();
        }
      }, 1000);
    } else {
      endSpeedRound();
    }
  }
  
  function endSpeedRound() {
    speedGameActive = false;
    if (speedTimer) clearInterval(speedTimer);
    
    if (!gameTimedOut) {
      // Normal completion - completed all questions
      showCompletionCard = true;
      fireworksCounter++; // Trigger celebration fireworks
    }
    // If timed out, stay on page to show failure message
  }
  
  function finishSpeedMode() {
    gameStore.completeGame('speed');
    goto('/');
  }
  
  function restartGame() {
    startSpeedRound();
  }
  
  function goToMainMenu() {
    gameStore.completeGame('speed');
    goto('/');
  }
  
  
  // Auto-start the game when component mounts
  startSpeedRound();
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
  
  <!-- Fireworks Effect -->
  <Fireworks trigger={fireworksCounter} duration={1500} intensity={35} particles={40} opacity={0.6} />
  
  <!-- Background decoration -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
    <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style="animation-delay: 2s;"></div>
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style="animation-delay: 4s;"></div>
  </div>
  
  <!-- Completion Card - positioned outside container for proper z-index -->
  {#if showCompletionCard}
    <CompletionCard 
      gameType="speed" 
      questionsAnswered={currentQuestionIndex + (showResult ? 1 : 0)}
      totalQuestions={speedQuestions.length}
      onFinish={finishSpeedMode} 
    />
  {/if}

  <div class="container mx-auto px-4 py-8 relative z-10">
    
    <!-- Speed Round -->
    <div class="max-w-4xl mx-auto" class:hidden={showCompletionCard}>
      
      {#if gameTimedOut}
        <!-- Timeout Failure Message -->
        <div class="text-center">
          <div class="bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-xl p-8 mb-8">
            <div class="text-6xl mb-4">⏰</div>
            <h2 class="text-3xl font-bold text-red-400 mb-4">Speed Round Failed!</h2>
            <p class="text-xl text-red-300 mb-2">Timer ran out...</p>
            <p class="text-gray-300 mb-8">You answered {currentQuestionIndex + (showResult ? 1 : 0)} out of {speedQuestions.length} questions</p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onclick={restartGame}
                class="btn bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold px-8">
                🔄 Try Again
              </button>
              <button 
                onclick={goToMainMenu}
                class="btn btn-outline px-8">
                🏠 Main Menu
              </button>
            </div>
          </div>
          
          <!-- Final Score Display -->
          <div class="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 inline-block">
            <div class="grid grid-cols-2 gap-8">
              <div>
                <div class="text-2xl font-bold text-cyan-400">{gameStore.totalScore}</div>
                <div class="text-sm text-gray-400">Final Score</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-yellow-400">{gameStore.currentStreak}</div>
                <div class="text-sm text-gray-400">Best Streak</div>
              </div>
            </div>
          </div>
        </div>
        
      {:else}
      
      <!-- Header with timer and back button -->
      <div class="flex justify-between items-center mb-8">
        <button onclick={() => endSpeedRound()} class="btn btn-outline">← Back to Menu</button>
        <div class="flex items-center space-x-4">
          <div class="flex items-center text-yellow-400">
            <Clock class="w-5 h-5 mr-2" />
            <span class="text-2xl font-bold">{timeLeft}s</span>
          </div>
          <div class="text-white">Question {currentQuestionIndex + 1}/{speedQuestions.length}</div>
        </div>
      </div>
      
      <!-- Progress Bar -->
      <div class="bg-white/10 rounded-full h-2 mb-8">
        <div 
          class="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-300"
          style="width: {((currentQuestionIndex + 1) / speedQuestions.length) * 100}%">
        </div>
      </div>
      
      <!-- Question Card -->
      <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 mb-8">
        <h3 class="text-2xl font-semibold text-white mb-6 text-center">
          {speedQuestions[currentQuestionIndex].question}
        </h3>
        
        <!-- Answer Options -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#each speedQuestions[currentQuestionIndex].options as option, index}
            <button
              onclick={() => selectAnswer(index)}
              class="p-4 rounded-lg text-left transition-all duration-200 border-2
              {showResult 
                ? (index === speedQuestions[currentQuestionIndex].correct 
                  ? 'bg-green-500/20 border-green-400 text-green-100' 
                  : (selectedAnswer === index 
                    ? 'bg-red-500/20 border-red-400 text-red-100'
                    : 'bg-white/5 border-white/20 text-gray-300'))
                : 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30'}">
              
              <div class="flex items-center justify-between">
                <span>{option}</span>
                {#if showResult && index === speedQuestions[currentQuestionIndex].correct}
                  <Check class="w-5 h-5 text-green-400" />
                {/if}
                {#if showResult && selectedAnswer === index && index !== speedQuestions[currentQuestionIndex].correct}
                  <X class="w-5 h-5 text-red-400" />
                {/if}
              </div>
            </button>
          {/each}
        </div>
      </div>
      
      <!-- Score Display -->
      <div class="text-center">
        <div class="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 inline-block">
          <div class="grid grid-cols-2 gap-8">
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
      
      {/if}
      
    </div>
  </div>
</div>