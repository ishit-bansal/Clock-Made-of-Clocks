// =============================================================================
// Clock Made of Clocks - Main Script
// =============================================================================

// -----------------------------------------------------------------------------
// Configuration Constants
// -----------------------------------------------------------------------------

const GRID_ROWS = 6;
const GRID_COLS = 4;
const CLOCKS_PER_DIGIT = GRID_ROWS * GRID_COLS; // 24 clocks per digit
const TOTAL_DIGITS = 6; // HH:MM:SS format
const DIGIT_PAIRS = 3; // Hours, Minutes, Seconds
const UPDATE_INTERVAL_MS = 1000;


// -----------------------------------------------------------------------------
// Clock Hand Angle Mappings
// -----------------------------------------------------------------------------
// Each box-drawing character maps to [firstHandAngle, secondHandAngle]
// Angles are in degrees, where 0° = pointing right, 90° = pointing down

const HAND_ANGLES = {
  '╔': [90, 0],     // Corner: down + right
  '╗': [90, 180],   // Corner: down + left
  '╚': [-90, 0],    // Corner: up + right
  '╝': [-90, 180],  // Corner: up + left
  '═': [0, 180],    // Horizontal line
  '║': [-90, 90],   // Vertical line
  ' ': [135, 135]   // Neutral/hidden (both hands at diagonal)
};


// -----------------------------------------------------------------------------
// Digit Patterns
// -----------------------------------------------------------------------------
// Each digit is a 6x4 grid (24 cells) using box-drawing characters.
// When rendered, clock hands form the visual shape of each number.

const DIGIT_PATTERNS = {
  0: [
    '╔', '═', '═', '╗',
    '║', '╔', '╗', '║',
    '║', '║', '║', '║',
    '║', '║', '║', '║',
    '║', '╚', '╝', '║',
    '╚', '═', '═', '╝'
  ],

  1: [
    '╔', '═', '╗', ' ',
    '╚', '╗', '║', ' ',
    ' ', '║', '║', ' ',
    ' ', '║', '║', ' ',
    '╔', '╝', '╚', '╗',
    '╚', '═', '═', '╝'
  ],

  2: [
    '╔', '═', '═', '╗',
    '╚', '═', '╗', '║',
    '╔', '═', '╝', '║',
    '║', '╔', '═', '╝',
    '║', '╚', '═', '╗',
    '╚', '═', '═', '╝'
  ],

  3: [
    '╔', '═', '═', '╗',
    '╚', '═', '╗', '║',
    ' ', '╔', '╝', '║',
    ' ', '╚', '╗', '║',
    '╔', '═', '╝', '║',
    '╚', '═', '═', '╝'
  ],

  4: [
    '╔', '╗', '╔', '╗',
    '║', '║', '║', '║',
    '║', '╚', '╝', '║',
    '╚', '═', '╗', '║',
    ' ', ' ', '║', '║',
    ' ', ' ', '╚', '╝'
  ],

  5: [
    '╔', '═', '═', '╗',
    '║', '╔', '═', '╝',
    '║', '╚', '═', '╗',
    '╚', '═', '╗', '║',
    '╔', '═', '╝', '║',
    '╚', '═', '═', '╝'
  ],

  6: [
    '╔', '═', '═', '╗',
    '║', '╔', '═', '╝',
    '║', '╚', '═', '╗',
    '║', '╔', '╗', '║',
    '║', '╚', '╝', '║',
    '╚', '═', '═', '╝'
  ],

  7: [
    '╔', '═', '═', '╗',
    '╚', '═', '╗', '║',
    ' ', ' ', '║', '║',
    ' ', ' ', '║', '║',
    ' ', ' ', '║', '║',
    ' ', ' ', '╚', '╝'
  ],

  8: [
    '╔', '═', '═', '╗',
    '║', '╔', '╗', '║',
    '║', '╚', '╝', '║',
    '║', '╔', '╗', '║',
    '║', '╚', '╝', '║',
    '╚', '═', '═', '╝'
  ],

  9: [
    '╔', '═', '═', '╗',
    '║', '╔', '╗', '║',
    '║', '╚', '╝', '║',
    '╚', '═', '╗', '║',
    '╔', '═', '╝', '║',
    '╚', '═', '═', '╝'
  ]
};


// -----------------------------------------------------------------------------
// DOM References
// -----------------------------------------------------------------------------

const displayContainer = document.getElementById('display');

// Store references to all clock hand elements for efficient updates
// Structure: Array of [firstHandElement, secondHandElement] for each clock
const clockHands = [];

// Track previous angles for each clock to calculate shortest rotation path
// Structure: Array of [previousAngle1, previousAngle2] for each clock
const previousAngles = [];


// -----------------------------------------------------------------------------
// Build the Clock Display
// -----------------------------------------------------------------------------

function buildClockDisplay() {
  for (let pairIndex = 0; pairIndex < DIGIT_PAIRS; pairIndex++) {
    const pairContainer = document.createElement('div');
    pairContainer.className = 'pair';

    for (let digitInPair = 0; digitInPair < 2; digitInPair++) {
      const digitContainer = document.createElement('div');
      digitContainer.className = 'digit';

      for (let clockIndex = 0; clockIndex < CLOCKS_PER_DIGIT; clockIndex++) {
        const clock = document.createElement('div');
        clock.className = 'clock';

        const firstHand = document.createElement('div');
        const secondHand = document.createElement('div');
        firstHand.className = 'hand';
        secondHand.className = 'hand';

        clock.append(firstHand, secondHand);
        digitContainer.appendChild(clock);

        // Store references for later updates
        clockHands.push([firstHand, secondHand]);
        previousAngles.push([0, 0]);
      }

      pairContainer.appendChild(digitContainer);
    }

    displayContainer.appendChild(pairContainer);
  }
}


// -----------------------------------------------------------------------------
// Angle Normalization
// -----------------------------------------------------------------------------
// Ensures hands always take the shortest rotation path (max 180° either way)
// This prevents hands from spinning the "long way around"

function normalizeAngle(targetAngle, previousAngle) {
  let delta = (targetAngle - previousAngle) % 360;
  
  // If rotation would be more than 180°, go the other direction
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  
  return previousAngle + delta;
}


// -----------------------------------------------------------------------------
// Update Clock Display
// -----------------------------------------------------------------------------

function updateClock() {
  const now = new Date();
  
  // Format time as "HHMMSS" string (e.g., "093045" for 09:30:45)
  const timeString = [
    now.getHours(),
    now.getMinutes(),
    now.getSeconds()
  ]
    .map(value => String(value).padStart(2, '0'))
    .join('');

  // Update each of the 6 digits
  for (let digitIndex = 0; digitIndex < TOTAL_DIGITS; digitIndex++) {
    const digitValue = parseInt(timeString[digitIndex], 10);
    const pattern = DIGIT_PATTERNS[digitValue];

    // Update each of the 24 clocks in this digit
    for (let clockIndex = 0; clockIndex < CLOCKS_PER_DIGIT; clockIndex++) {
      const globalClockIndex = digitIndex * CLOCKS_PER_DIGIT + clockIndex;
      const character = pattern[clockIndex];
      const [targetAngle1, targetAngle2] = HAND_ANGLES[character];

      // Calculate normalized angles for smooth animation
      const angle1 = normalizeAngle(targetAngle1, previousAngles[globalClockIndex][0]);
      const angle2 = normalizeAngle(targetAngle2, previousAngles[globalClockIndex][1]);

      // Apply rotation to clock hands
      clockHands[globalClockIndex][0].style.transform = `rotate(${angle1}deg)`;
      clockHands[globalClockIndex][1].style.transform = `rotate(${angle2}deg)`;

      // Store angles for next update
      previousAngles[globalClockIndex] = [angle1, angle2];
    }
  }
}


// -----------------------------------------------------------------------------
// Theme Management
// -----------------------------------------------------------------------------

const ThemeManager = {
  storageKey: 'theme',
  
  // Get initial theme from localStorage or system preference
  getInitialTheme() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) return saved;
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  },

  // Apply theme to document
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    const toggleButton = document.getElementById('theme-toggle');
    if (toggleButton) {
      toggleButton.setAttribute('aria-label', `Current theme: ${theme}. Click to toggle.`);
    }
  },

  // Toggle between light and dark
  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    
    localStorage.setItem(this.storageKey, next);
    this.apply(next);
  },

  // Initialize theme system
  init() {
    const initialTheme = this.getInitialTheme();
    this.apply(initialTheme);

    // Set up toggle button
    const toggleButton = document.getElementById('theme-toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', () => this.toggle());
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
      const theme = event.matches ? 'dark' : 'light';
      localStorage.setItem(this.storageKey, theme);
      this.apply(theme);
    });
  }
};


// -----------------------------------------------------------------------------
// Initialize Application
// -----------------------------------------------------------------------------

function init() {
  buildClockDisplay();
  ThemeManager.init();
  
  // Start the clock
  updateClock();
  setInterval(updateClock, UPDATE_INTERVAL_MS);
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
