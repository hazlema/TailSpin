/**
 * Utility class for game-related operations
 */
export class GameUtils {
  /**
   * Randomizes an array of objects and returns the shuffled array with the new correct index
   * Uses Fisher-Yates shuffle algorithm for unbiased randomization
   * 
   * @param array - Array of objects to randomize (e.g., question options)
   * @param correctIndex - Index of the correct answer in the original array
   * @returns Object containing shuffled array and new correct index
   */
  static randomize<T>(array: T[], correctIndex: number): { shuffled: T[], newCorrectIndex: number } {
    // Validate inputs
    if (!Array.isArray(array) || array.length === 0) {
      throw new Error('Array must be non-empty');
    }
    
    if (correctIndex < 0 || correctIndex >= array.length) {
      throw new Error('Correct index must be within array bounds');
    }
    
    // Create a copy to avoid mutating the original array
    const shuffled = [...array];
    
    // Track the correct answer element to find its new position
    const correctAnswer = array[correctIndex];
    
    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      
      // Swap elements
      [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    }
    
    // Find the new index of the correct answer
    const newCorrectIndex = shuffled.findIndex(item => 
      // For primitive values, use direct comparison
      // For objects, use JSON.stringify for deep comparison (works for our simple objects)
      typeof item === 'object' && item !== null 
        ? JSON.stringify(item) === JSON.stringify(correctAnswer)
        : item === correctAnswer
    );
    
    return {
      shuffled,
      newCorrectIndex
    };
  }
  
  /**
   * Shuffles an array without tracking a correct index
   * Useful for shuffling questions themselves, not just options
   * 
   * @param array - Array to shuffle
   * @returns Shuffled copy of the array
   */
  static shuffle<T>(array: T[]): T[] {
    if (!Array.isArray(array) || array.length === 0) {
      return [...array];
    }
    
    const shuffled = [...array];
    
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    }
    
    return shuffled;
  }
  
  /**
   * Gets a random integer between min and max (inclusive)
   * 
   * @param min - Minimum value
   * @param max - Maximum value  
   * @returns Random integer between min and max
   */
  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  /**
   * Gets a random element from an array
   * 
   * @param array - Array to pick from
   * @returns Random element from the array
   */
  static randomElement<T>(array: T[]): T {
    if (!Array.isArray(array) || array.length === 0) {
      throw new Error('Array must be non-empty');
    }
    
    return array[Math.floor(Math.random() * array.length)];
  }
}