// Using box-drawing characters as visual symbols
// Makes it easier to see patterns when defining digits
const charMap = {
  '╔': [90, 0],      // corner: down + right
  '╗': [90, 180],    // corner: down + left
  '╚': [-90, 0],     // corner: up + right
  '╝': [-90, 180],   // corner: up + left
  '═': [0, 180],     // horizontal line
  '║': [-90, 90],    // vertical line
  ' ': [135, 135]    // blank/neutral
};

// Create the grid
const grid = document.getElementById('grid');

for (let i = 0; i < 24; i++) {
  const clock = document.createElement('div');
  clock.className = 'clock';
  clock.innerHTML = '<div class="hand"></div><div class="hand"></div>';
  grid.appendChild(clock);
}

// Function to set a clock's hands based on symbol
function setClock(clock, symbol) {
  const [angle1, angle2] = charMap[symbol];
  const hands = clock.querySelectorAll('.hand');
  hands[0].style.transform = `rotate(${angle1}deg)`;
  hands[1].style.transform = `rotate(${angle2}deg)`;
}

// Test it out
const clocks = document.querySelectorAll('.clock');
setClock(clocks[0], '╔');
setClock(clocks[3], '╗');
