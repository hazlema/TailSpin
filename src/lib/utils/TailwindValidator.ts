/**
 * Utility class for validating Tailwind CSS classes with flexible matching
 */
export class TailwindValidator {
  
  /**
   * Parses a class string and categorizes the classes
   * @param classString - Space-separated string of CSS classes
   * @returns Object with categorized classes
   */
  static parseClasses(classString: string): Record<string, string[]> {
    const classes = classString.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const categories: Record<string, string[]> = {};
    
    for (const cls of classes) {
      // Background classes
      if (cls.startsWith('bg-')) {
        if (!categories.background) categories.background = [];
        categories.background.push(cls);
      }
      
      // Padding classes
      else if (cls.match(/^p[xylrtb]?-/)) {
        if (!categories.padding) categories.padding = [];
        categories.padding.push(cls);
      }
      
      // Margin classes  
      else if (cls.match(/^m[xylrtb]?-/)) {
        if (!categories.margin) categories.margin = [];
        categories.margin.push(cls);
      }
      
      // Width classes
      else if (cls.startsWith('w-') || cls === 'w-full' || cls === 'w-auto') {
        if (!categories.width) categories.width = [];
        categories.width.push(cls);
      }
      
      // Height classes
      else if (cls.startsWith('h-') || cls === 'h-full' || cls === 'h-auto') {
        if (!categories.height) categories.height = [];
        categories.height.push(cls);
      }
      
      // Flexbox layout
      else if (cls === 'flex' || cls === 'inline-flex') {
        if (!categories.display) categories.display = [];
        categories.display.push(cls);
      }
      
      // Flex direction, alignment, justify
      else if (cls.match(/^(flex-|items-|justify-|content-|self-)/)) {
        if (!categories.flex) categories.flex = [];
        categories.flex.push(cls);
      }
      
      // Grid classes
      else if (cls.match(/^(grid|grid-)/)) {
        if (!categories.grid) categories.grid = [];
        categories.grid.push(cls);
      }
      
      // Text styling
      else if (cls.match(/^(text-|font-|leading-|tracking-|uppercase|lowercase|capitalize)/)) {
        if (!categories.text) categories.text = [];
        categories.text.push(cls);
      }
      
      // Border and rounded
      else if (cls.match(/^(border|rounded)/)) {
        if (!categories.border) categories.border = [];
        categories.border.push(cls);
      }
      
      // Shadow
      else if (cls.match(/^shadow/)) {
        if (!categories.shadow) categories.shadow = [];
        categories.shadow.push(cls);
      }
      
      // Position
      else if (cls.match(/^(relative|absolute|fixed|static|sticky)/)) {
        if (!categories.position) categories.position = [];
        categories.position.push(cls);
      }
      
      // Display (other than flex)
      else if (cls.match(/^(block|inline|hidden|invisible)/)) {
        if (!categories.display) categories.display = [];
        categories.display.push(cls);
      }
      
      // Overflow
      else if (cls.match(/^overflow/)) {
        if (!categories.overflow) categories.overflow = [];
        categories.overflow.push(cls);
      }
      
      // Transform and transitions
      else if (cls.match(/^(transform|transition|duration|ease|animate)/)) {
        if (!categories.animation) categories.animation = [];
        categories.animation.push(cls);
      }
      
      // Misc/other classes
      else {
        if (!categories.misc) categories.misc = [];
        categories.misc.push(cls);
      }
    }
    
    return categories;
  }
  
  /**
   * Validates if user input contains required class categories
   * @param userInput - User's class string
   * @param requirements - Required class categories and optionally specific values
   * @returns Object with validation result and feedback
   */
  static validateClasses(
    userInput: string, 
    requirements: {
      [category: string]: {
        required: boolean;
        specificValues?: string[];
        description?: string;
      }
    }
  ): {
    isValid: boolean;
    missing: string[];
    feedback: string;
  } {
    const userCategories = this.parseClasses(userInput);
    const missing: string[] = [];
    
    for (const [category, config] of Object.entries(requirements)) {
      if (!config.required) continue;
      
      const userHasCategory = userCategories[category] && userCategories[category].length > 0;
      
      if (!userHasCategory) {
        missing.push(config.description || category);
        continue;
      }
      
      // Check for specific values if required
      if (config.specificValues && config.specificValues.length > 0) {
        const hasRequiredValue = userCategories[category].some(userClass => 
          config.specificValues!.some(required => userClass.includes(required))
        );
        
        if (!hasRequiredValue) {
          missing.push(`${config.description || category} (specific value required)`);
        }
      }
    }
    
    const isValid = missing.length === 0;
    const feedback = isValid 
      ? "Perfect!" 
      : `Missing: ${missing.join(', ')}`;
    
    return { isValid, missing, feedback };
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
   * Gets a human-readable description of what's missing
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
            // Padding patterns: px-, py-, pl-, pr-, pt-, pb-, p-
            const paddingValues = ['4', '6', '8'];
            example = `${pattern}${paddingValues[Math.floor(Math.random() * paddingValues.length)]}`;
          } else if (pattern.match(/^m[xylrtb]?-$/)) {
            // Margin patterns: mx-, my-, ml-, mr-, mt-, mb-, m-
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
        // Check if pattern should match variations
        if (pattern === 'rounded' || pattern === 'shadow') {
          found = normalizedInput.split(/\s+/).some(cls => cls.startsWith(pattern));
          if (!found) {
            missing.push(`${pattern} class (e.g., ${pattern}-lg)`);
          }
        } else {
          // Exact match for patterns like 'flex', 'items-center'
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