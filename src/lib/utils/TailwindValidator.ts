/**
 * Simplified Tailwind CSS validator using answer-based validation
 */
export class TailwindValidator {
  
  /**
   * Validates user input against a set of correct answers
   * @param userInput - User's class string
   * @param correctAnswers - Array of possible correct class combinations
   * @returns Whether the input matches any correct answer
   */
  static validateAgainstAnswers(userInput: string, correctAnswers: string[]): boolean {
    const normalizedInput = userInput.trim().toLowerCase().split(/\s+/).sort().join(' ');
    
    return correctAnswers.some(answer => {
      const normalizedAnswer = answer.trim().toLowerCase().split(/\s+/).sort().join(' ');
      return normalizedInput === normalizedAnswer;
    });
  }
  
  /**
   * Validates if user input contains all required patterns from answers
   * @param userInput - User's class string  
   * @param correctAnswers - Array of correct answers to extract patterns from
   * @returns Whether all required patterns are found
   */
  static containsRequiredPatterns(userInput: string, correctAnswers: string[]): boolean {
    const normalizedInput = userInput.trim().toLowerCase();
    const userClasses = normalizedInput.split(/\s+/).filter(Boolean);
    
    // Extract all unique class patterns from correct answers
    const requiredPatterns = new Set<string>();
    
    correctAnswers.forEach(answer => {
      answer.trim().toLowerCase().split(/\s+/).forEach(twClass => {
        if (twClass.includes('-')) {
          // Extract base pattern (e.g., 'px-4' -> 'px-')
          const [base] = twClass.split('-');
          requiredPatterns.add(base + '-');
        } else {
          // Exact class (e.g., 'flex')
          requiredPatterns.add(twClass);
        }
      });
    });
    
    // Check if user input contains all required patterns
    return Array.from(requiredPatterns).every(pattern => {
      if (pattern.endsWith('-')) {
        // Pattern matching (e.g., user has any 'px-*' class)
        return userClasses.some(cls => cls.startsWith(pattern));
      } else {
        // Exact matching (e.g., user has 'flex')
        return userClasses.includes(pattern);
      }
    });
  }
  
  /**
   * Simple validation that checks if user input contains basic required class patterns
   * @param userInput - User's class string  
   * @param requiredPatterns - Array of required class patterns (e.g., ['flex', 'bg-', 'p-'])
   * @returns Whether all patterns are found
   */
  static containsPatterns(userInput: string, requiredPatterns: string[]): boolean {
    const normalizedInput = userInput.trim().toLowerCase();
    
    return requiredPatterns.every(pattern => {
      if (pattern.endsWith('-')) {
        // Pattern like 'bg-' should match any class starting with 'bg-'
        return normalizedInput.split(/\s+/).some(cls => cls.startsWith(pattern));
      } else {
        // Check if pattern is a prefix that should match variations
        // e.g., 'rounded' should match 'rounded', 'rounded-lg', 'rounded-full', etc.
        // and 'shadow' should match 'shadow', 'shadow-lg', 'shadow-xl', etc.
        if (pattern === 'rounded' || pattern === 'shadow') {
          return normalizedInput.split(/\s+/).some(cls => cls.startsWith(pattern));
        }
        // Exact match for patterns like 'flex', 'items-center'
        return normalizedInput.split(/\s+/).includes(pattern);
      }
    });
  }
  
  /**
   * Gets a human-readable description of what's missing based on correct answers
   * @param userInput - User's class string
   * @param correctAnswers - Array of correct answers
   * @returns Description of missing elements
   */
  static getMissingFromAnswers(userInput: string, correctAnswers: string[]): string {
    const normalizedInput = userInput.trim().toLowerCase();
    const userClasses = normalizedInput.split(/\s+/).filter(Boolean);
    
    // Get the first correct answer as reference for feedback
    const referenceAnswer = correctAnswers[0];
    const requiredClasses = referenceAnswer.trim().toLowerCase().split(/\s+/);
    
    const missing: string[] = [];
    
    requiredClasses.forEach(requiredClass => {
      if (requiredClass.includes('-')) {
        // Pattern-based class (e.g., 'px-4')
        const [pattern] = requiredClass.split('-');
        const hasPattern = userClasses.some(cls => cls.startsWith(pattern + '-'));
        if (!hasPattern) {
          missing.push(`${pattern}-* class (e.g., ${requiredClass})`);
        }
      } else {
        // Exact class (e.g., 'flex')
        if (!userClasses.includes(requiredClass)) {
          missing.push(`'${requiredClass}' class`);
        }
      }
    });
    
    return missing.length > 0 ? `Missing: ${missing.join(', ')}` : 'Perfect!';
  }
  
  /**
   * Legacy method for backward compatibility
   * @param userInput - User's class string
   * @param requiredPatterns - Required patterns
   * @returns Description of missing elements
   */
  static getMissingDescription(userInput: string, requiredPatterns: string[]): string {
    const normalizedInput = userInput.trim().toLowerCase();
    const missing: string[] = [];
    
    for (const pattern of requiredPatterns) {
      let found = false;
      
      if (pattern.endsWith('-')) {
        found = normalizedInput.split(/\s+/).some(cls => cls.startsWith(pattern));
        if (!found) {
          // Generate appropriate examples based on the pattern
          let example = '';
          if (pattern.match(/^p[xylrtb]?-$/)) {
            const paddingValues = ['4', '6', '8'];
            example = `${pattern}${paddingValues[Math.floor(Math.random() * paddingValues.length)]}`;
          } else if (pattern.match(/^m[xylrtb]?-$/)) {
            if (pattern === 'mx-') {
              example = `${pattern}auto`;
            } else {
              example = `${pattern}4`;
            }
          } else if (pattern === 'bg-') {
            const bgColors = ['white', 'gray-800', 'blue-500', 'gray-100'];
            example = `${pattern}${bgColors[Math.floor(Math.random() * bgColors.length)]}`;
          } else if (pattern === 'text-') {
            const textColors = ['white', 'black', 'gray-700', 'blue-600'];
            example = `${pattern}${textColors[Math.floor(Math.random() * textColors.length)]}`;
          } else if (pattern === 'w-') {
            const widths = ['full', '1/2', '1/3', '64'];
            example = `${pattern}${widths[Math.floor(Math.random() * widths.length)]}`;
          } else if (pattern === 'h-') {
            const heights = ['full', '64', '32', 'screen'];
            example = `${pattern}${heights[Math.floor(Math.random() * heights.length)]}`;
          } else if (pattern === 'max-w-') {
            const maxWidths = ['md', 'lg', 'xl', 'sm'];
            example = `${pattern}${maxWidths[Math.floor(Math.random() * maxWidths.length)]}`;
          } else if (pattern === 'border-') {
            const borderColors = ['gray-300', 'gray-200', 'blue-500'];
            example = `${pattern}${borderColors[Math.floor(Math.random() * borderColors.length)]}`;
          } else {
            example = `${pattern}4`;
          }
          missing.push(`${pattern}* class (e.g., ${example})`);
        }
      } else {
        if (pattern === 'rounded' || pattern === 'shadow') {
          found = normalizedInput.split(/\s+/).some(cls => cls.startsWith(pattern));
          if (!found) {
            missing.push(`${pattern} class (e.g., ${pattern}-lg)`);
          }
        } else {
          found = normalizedInput.split(/\s+/).includes(pattern);
          if (!found) {
            missing.push(`'${pattern}' class`);
          }
        }
      }
    }
    
    return missing.length > 0 ? `Missing: ${missing.join(', ')}` : 'All required classes found!';
  }
}