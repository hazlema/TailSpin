<script lang="ts">
  import { Trophy } from '@lucide/svelte';
  import { goto } from '$app/navigation';
  import { gameStore } from '$lib/stores/gameStore.svelte';
  import { GameUtils } from '$lib/utils/GameUtils';
  import { TailwindValidator } from '$lib/utils/TailwindValidator';
  import buildChallengesData from '$lib/data/build-challenges.json';
  import Fireworks from '$lib/components/Fireworks.svelte';
  import CompletionCard from '$lib/components/CompletionCard.svelte';
  
  // Shuffle the order of build challenges (but keep steps within each challenge in order)
  let buildChallenges = GameUtils.shuffle(buildChallengesData);
  
  let currentBuildIndex = $state(0);
  let currentStepIndex = $state(0);
  let buildInput = $state("");
  let buildFeedback = $state("");
  let showBuildHint = $state(false);
  let fireworksCounter = $state(0);
  let showCompletionCard = $state(false);
  
  function checkBuildAnswer() {
    const currentStep = buildChallenges[currentBuildIndex].steps[currentStepIndex];
    const userInput = buildInput.trim();
    
    // Build mode should use flexible pattern validation, not exact matching
    let isCorrect = false;
    let feedback = "";
    
    if (currentStep.requiredPatterns) {
      // Use pattern-based validation for flexibility
      isCorrect = TailwindValidator.containsPatterns(userInput, currentStep.requiredPatterns);
      
      if (isCorrect) {
        feedback = "Perfect! 🎉";
      } else {
        feedback = TailwindValidator.getMissingDescription(userInput, currentStep.requiredPatterns);
      }
    } else {
      // Fallback to exact match if no patterns defined
      const correctAnswers = [currentStep.expectedClass];
      isCorrect = TailwindValidator.validateAgainstAnswers(userInput, correctAnswers);
      
      if (isCorrect) {
        feedback = "Perfect! 🎉";
      } else {
        feedback = TailwindValidator.getMissingFromAnswers(userInput, correctAnswers);
      }
    }
    
    buildFeedback = feedback;
    
    if (isCorrect) {
      gameStore.addScore(20);
      gameStore.incrementStreak();
      fireworksCounter++; // Increment to trigger fireworks
      
      setTimeout(() => {
        nextBuildStep();
      }, 1500);
    } else {
      gameStore.resetStreak();
    }
  }
  
  function nextBuildStep() {
    if (currentStepIndex < buildChallenges[currentBuildIndex].steps.length - 1) {
      currentStepIndex++;
      buildInput = "";
      buildFeedback = "";
      showBuildHint = false;
    } else if (currentBuildIndex < buildChallenges.length - 1) {
      currentBuildIndex++;
      currentStepIndex = 0;
      buildInput = "";
      buildFeedback = "";
      showBuildHint = false;
    } else {
      // All challenges completed - show completion card
      showCompletionCard = true;
      fireworksCounter++; // Trigger celebration fireworks
    }
  }
  
  function finishBuildMode() {
    gameStore.completeGame('build');
    goto('/');
  }
  
  function toggleBuildHint() {
    showBuildHint = !showBuildHint;
  }
  
  function skipQuestion() {
    const currentStep = buildChallenges[currentBuildIndex].steps[currentStepIndex];
    buildInput = currentStep.expectedClass;
    buildFeedback = "Auto-filled for debugging! 🐛";
    
    setTimeout(() => {
      checkBuildAnswer();
    }, 500);
  }
  
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
  
  <!-- Fireworks Effect -->
  <Fireworks trigger={fireworksCounter} duration={2500} intensity={50} particles={70} opacity={0.8} />
  
  <!-- Background decoration -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
    <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style="animation-delay: 2s;"></div>
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style="animation-delay: 4s;"></div>
  </div>
  
  <!-- Completion Card - positioned outside container for proper z-index -->
  {#if showCompletionCard}
    <CompletionCard 
      gameType="build" 
      onFinish={finishBuildMode} 
    />
  {/if}

  <div class="container mx-auto px-4 py-8 relative z-10">
    
    <!-- Build Mode -->
    <div class="max-w-6xl mx-auto" class:hidden={showCompletionCard}>
      
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <button onclick={() => goto('/')} class="btn btn-outline">← Back to Menu</button>
        <div class="text-white">
          {buildChallenges[currentBuildIndex].title} - Step {currentStepIndex + 1}/{buildChallenges[currentBuildIndex].steps.length}
        </div>
      </div>
      
      <!-- Progress Bar -->
      <div class="bg-white/10 rounded-full h-2 mb-8">
        <div 
          class="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-300"
          style="width: {((currentStepIndex + 1) / buildChallenges[currentBuildIndex].steps.length) * 100}%">
        </div>
      </div>
      
      <div class="grid lg:grid-cols-2 gap-8">
        
        <!-- Left Side: Instructions -->
        <div>
          <h3 class="text-2xl font-semibold text-white mb-4">{buildChallenges[currentBuildIndex].title}</h3>
          <p class="text-gray-300 mb-6">{buildChallenges[currentBuildIndex].description}</p>
          
          <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-6">
            <h4 class="text-lg font-semibold text-white mb-3">Step {currentStepIndex + 1}:</h4>
            <p class="text-gray-200 mb-4">{buildChallenges[currentBuildIndex].steps[currentStepIndex].instruction}</p>
            
            <!-- Input Field -->
            <div class="space-y-4">
              <label for="build-input" class="block text-sm text-gray-300">Enter your Tailwind classes:</label>
              <input
                id="build-input" 
                bind:value={buildInput}
                onkeydown={(e) => e.key === 'Enter' && checkBuildAnswer()}
                placeholder="e.g. flex items-center px-4"
                class="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-white/40 focus:outline-none font-mono text-sm">
              
              <div class="flex space-x-3 flex-wrap">
                <button 
                  onclick={checkBuildAnswer}
                  class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                  Check Answer
                </button>
                <button 
                  onclick={toggleBuildHint}
                  class="px-6 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg transition-colors border border-white/20">
                  {showBuildHint ? 'Hide Hint' : 'Show Hint'}
                </button>
                <button 
                  onclick={skipQuestion}
                  class="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
                  🐛 Skip (Debug)
                </button>
              </div>
              
              <!-- Feedback -->
              {#if buildFeedback}
                <div class="p-3 rounded-lg {buildFeedback.includes('Correct') ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}">
                  {buildFeedback}
                </div>
              {/if}
              
              <!-- Hint -->
              {#if showBuildHint}
                <div class="p-3 bg-blue-500/20 text-blue-200 rounded-lg">
                  💡 Hint: {buildChallenges[currentBuildIndex].steps[currentStepIndex].hint}
                </div>
              {/if}
            </div>
          </div>
          
          <!-- Score Display -->
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
        
        <!-- Right Side: Previews -->
        <div class="space-y-6">
          
          <!-- Target Design -->
          <div>
            <h4 class="text-xl font-semibold text-white mb-4">Target Design:</h4>
            <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div class="bg-gray-50 p-6 rounded-lg min-h-48">
                
                {#if buildChallenges[currentBuildIndex].title.includes('Navigation')}
                  <div class={buildChallenges[currentBuildIndex].steps[currentStepIndex].targetDesign || "w-full bg-gray-100 h-16"}>
                    <div class="text-lg font-bold">Logo</div>
                    <div>Menu Item 1</div>
                    <div>Menu Item 2</div>
                  </div>
                {:else if buildChallenges[currentBuildIndex].title.includes('Card')}
                  <div class={buildChallenges[currentBuildIndex].steps[currentStepIndex].targetDesign || "bg-gray-100 p-4"}>
                    <h3 class="text-lg font-bold mb-2">Card Title</h3>
                    <p class="text-gray-600">This is some card content to demonstrate the styling.</p>
                  </div>
                {:else}
                  <div class={buildChallenges[currentBuildIndex].steps[currentStepIndex].targetDesign || "bg-gray-100 p-4"}>
                    Preview Element
                  </div>
                {/if}
                
              </div>
              <div class="mt-3 text-xs text-gray-400">
                This is what your result should look like
              </div>
            </div>
          </div>

          <!-- Your Live Preview -->
          <div>
            <h4 class="text-xl font-semibold text-white mb-4">Your Live Preview:</h4>
            <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div class="bg-gray-50 p-6 rounded-lg min-h-48">
                
                {#if buildChallenges[currentBuildIndex].title.includes('Navigation')}
                  <div class={buildInput ? `${buildInput} text-black` : "w-full bg-gray-100 h-16 text-black"}>
                    <div class="text-lg font-bold">Logo</div>
                    <div>Menu Item 1</div>
                    <div>Menu Item 2</div>
                  </div>
                {:else if buildChallenges[currentBuildIndex].title.includes('Card')}
                  <div class={buildInput ? `${buildInput} text-black` : "bg-gray-100 p-4 text-black"}>
                    <h3 class="text-lg font-bold mb-2">Card Title</h3>
                    <p class="text-gray-600">This is some card content to demonstrate the styling.</p>
                  </div>
                {:else}
                  <div class={buildInput ? `${buildInput} text-black` : "bg-gray-100 p-4 text-black"}>
                    Preview Element
                  </div>
                {/if}
                
              </div>
              
              {#if buildInput}
                <div class="mt-4 p-3 bg-gray-800 rounded text-xs text-gray-300 font-mono">
                  Current classes: <span class="text-yellow-300">{buildInput}</span>
                </div>
              {/if}
            </div>
          </div>
          
        </div>
        
      </div>
    </div>
  </div>
</div>