// Svelte 5 state store using runes
class GameStore {
  score = $state(0);
  level = $state(1);
  streak = $state(0);
  
  // Game statistics
  totalGamesPlayed = $state(0);
  bestStreak = $state(0);
  speedRoundsCompleted = $state(0);
  challengesCompleted = $state(0);
  buildChallengesCompleted = $state(0);
  
  // Current game session
  currentGameType = $state<'speed' | 'challenge' | 'build' | null>(null);
  
  // Methods to update state
  addScore(points: number) {
    this.score += points;
  }
  
  incrementStreak() {
    this.streak++;
    if (this.streak > this.bestStreak) {
      this.bestStreak = this.streak;
    }
  }
  
  resetStreak() {
    this.streak = 0;
  }
  
  completeGame(gameType: 'speed' | 'challenge' | 'build') {
    this.totalGamesPlayed++;
    
    switch (gameType) {
      case 'speed':
        this.speedRoundsCompleted++;
        break;
      case 'challenge':
        this.challengesCompleted++;
        break;
      case 'build':
        this.buildChallengesCompleted++;
        break;
    }
    
    // Level up logic (every 100 points)
    this.level = Math.floor(this.score / 100) + 1;
    
    this.currentGameType = null;
  }
  
  startGame(gameType: 'speed' | 'challenge' | 'build') {
    this.currentGameType = gameType;
  }
  
  resetSession() {
    this.score = 0;
    this.level = 1;
    this.streak = 0;
    this.totalGamesPlayed = 0;
    this.bestStreak = 0;
    this.speedRoundsCompleted = 0;
    this.challengesCompleted = 0;
    this.buildChallengesCompleted = 0;
    this.currentGameType = null;
  }
  
  // Derived state
  get totalScore() {
    return this.score;
  }
  
  get currentLevel() {
    return this.level;
  }
  
  get currentStreak() {
    return this.streak;
  }
  
  get gameStats() {
    return {
      totalGames: this.totalGamesPlayed,
      bestStreak: this.bestStreak,
      speedRounds: this.speedRoundsCompleted,
      challenges: this.challengesCompleted,
      buildChallenges: this.buildChallengesCompleted
    };
  }
}

// Create and export the singleton store
export const gameStore = new GameStore();