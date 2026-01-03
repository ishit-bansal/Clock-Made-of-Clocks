// Symbol to angle mapping
const charMap = {
  '╔': [90, 0], '╗': [90, 180], '╚': [-90, 0], '╝': [-90, 180],
  '═': [0, 180], '║': [-90, 90], ' ': [135, 135]
};

// All digit patterns
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

// Create a digit element with 24 clocks
function createDigit() {
  const digitEl = document.createElement('div');
  digitEl.className = 'digit';
  
  for (let i = 0; i < 24; i++) {
    const clock = document.createElement('div');
    clock.className = 'clock';
    clock.innerHTML = '<div class="hand"></div><div class="hand"></div>';
    digitEl.appendChild(clock);
  }
  
  return digitEl;
}

// Set a digit to display a number
function setDigit(digitEl, number) {
  const pattern = digits[number];
  const clocks = digitEl.querySelectorAll('.clock');
  
  clocks.forEach((clock, i) => {
    const [a1, a2] = charMap[pattern[i]];
    const hands = clock.querySelectorAll('.hand');
    hands[0].style.transform = `rotate(${a1}deg)`;
    hands[1].style.transform = `rotate(${a2}deg)`;
  });
}

// Get current time as 6 digits
function getTimeDigits() {
  const now = new Date();
  let h = now.getHours() % 12 || 12;
  const m = now.getMinutes();
  const s = now.getSeconds();
  
  return [h, m, s]
    .map(n => String(n).padStart(2, '0'))
    .join('')
    .split('')
    .map(Number);
}

// Build the display: 3 pairs of 2 digits each
const display = document.getElementById('display');
const digitElements = [];

for (let i = 0; i < 3; i++) {
  const pair = document.createElement('div');
  pair.className = 'digit-pair';
  
  const d1 = createDigit();
  const d2 = createDigit();
  pair.appendChild(d1);
  pair.appendChild(d2);
  display.appendChild(pair);
  
  digitElements.push(d1, d2);
}

// Update display
function updateTime() {
  const timeDigits = getTimeDigits();
  timeDigits.forEach((digit, i) => {
    setDigit(digitElements[i], digit);
  });
}

updateTime();
setInterval(updateTime, 1000);
