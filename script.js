// Symbol to angle mapping
const charMap = {
  '╔': [90, 0],      // corner: down + right
  '╗': [90, 180],    // corner: down + left
  '╚': [-90, 0],     // corner: up + right
  '╝': [-90, 180],   // corner: up + left
  '═': [0, 180],     // horizontal line
  '║': [-90, 90],    // vertical line
  ' ': [135, 135]    // blank/neutral
};

// Define digit 0 as a pattern (6 rows x 4 columns = 24 symbols)
const digit0 = [
  '╔', '═', '═', '╗',
  '║', '╔', '╗', '║',
  '║', '║', '║', '║',
  '║', '║', '║', '║',
  '║', '╚', '╝', '║',
  '╚', '═', '═', '╝'
];

// Create the grid
const grid = document.getElementById('grid');

for (let i = 0; i < 24; i++) {
  const clock = document.createElement('div');
  clock.className = 'clock';
  clock.innerHTML = '<div class="hand"></div><div class="hand"></div>';
  grid.appendChild(clock);
}

// Apply digit 0 pattern to the grid
function applyPattern(pattern) {
  const clocks = document.querySelectorAll('.clock');
  clocks.forEach((clock, i) => {
    const [a1, a2] = charMap[pattern[i]];
    const hands = clock.querySelectorAll('.hand');
    hands[0].style.transform = `rotate(${a1}deg)`;
    hands[1].style.transform = `rotate(${a2}deg)`;
  });
}

applyPattern(digit0);
