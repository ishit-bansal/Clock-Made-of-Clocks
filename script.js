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

// All digit patterns 0-9
const digits = {
  0: ['╔','═','═','╗','║','╔','╗','║','║','║','║','║','║','║','║','║','║','╚','╝','║','╚','═','═','╝'],
  1: ['╔','═','╗',' ','╚','╗','║',' ',' ','║','║',' ',' ','║','║',' ','╔','╝','╚','╗','╚','═','═','╝'],
  2: ['╔','═','═','╗','╚','═','╗','║','╔','═','╝','║','║','╔','═','╝','║','╚','═','╗','╚','═','═','╝'],
  3: ['╔','═','═','╗','╚','═','╗','║','╔','═','╝','║','╚','═','╗','║','╔','═','╝','║','╚','═','═','╝'],
  4: ['╔','╗','╔','╗','║','║','║','║','║','╚','╝','║','╚','═','╗','║',' ',' ','║','║',' ',' ','╚','╝'],
  5: ['╔','═','═','╗','║','╔','═','╝','║','╚','═','╗','╚','═','╗','║','╔','═','╝','║','╚','═','═','╝'],
  6: ['╔','═','═','╗','║','╔','═','╝','║','╚','═','╗','║','╔','╗','║','║','╚','╝','║','╚','═','═','╝'],
  7: ['╔','═','═','╗','╚','═','╗','║',' ',' ','║','║',' ',' ','║','║',' ',' ','║','║',' ',' ','╚','╝'],
  8: ['╔','═','═','╗','║','╔','╗','║','║','╚','╝','║','║','╔','╗','║','║','╚','╝','║','╚','═','═','╝'],
  9: ['╔','═','═','╗','║','╔','╗','║','║','╚','╝','║','╚','═','╝','║','╔','═','╝','║','╚','═','═','╝']
};

// Create the grid
const grid = document.getElementById('grid');

for (let i = 0; i < 24; i++) {
  const clock = document.createElement('div');
  clock.className = 'clock';
  clock.innerHTML = '<div class="hand"></div><div class="hand"></div>';
  grid.appendChild(clock);
}

// Apply a digit pattern to the grid
function showDigit(digit) {
  const pattern = digits[digit];
  const clocks = document.querySelectorAll('.clock');
  clocks.forEach((clock, i) => {
    const [a1, a2] = charMap[pattern[i]];
    const hands = clock.querySelectorAll('.hand');
    hands[0].style.transform = `rotate(${a1}deg)`;
    hands[1].style.transform = `rotate(${a2}deg)`;
  });
}

showDigit(8);
