// Angle mappings for each character
const angles = {
  '╔': [90, 0],    
  '╗': [90, 180],
  '╚': [-90, 0],   
  '╝': [-90, 180],
  '═': [0, 180],   
  '║': [-90, 90],
  ' ': [135, 135]
};

// Digit patterns (6x4 grid each)
const digits = {

  0: ['╔','═','═','╗',
      '║','╔','╗','║',
      '║','║','║','║',
      '║','║','║','║',
      '║','╚','╝','║',
      '╚','═','═','╝'],

  1: ['╔','═','╗',' ',
      '╚','╗','║',' ',
      ' ','║','║',' ',
      ' ','║','║',' ',
      '╔','╝','╚','╗',
      '╚','═','═','╝'],

  2: ['╔','═','═','╗',
      '╚','═','╗','║',
      '╔','═','╝','║',
      '║','╔','═','╝',
      '║','╚','═','╗',
      '╚','═','═','╝'],

  3: ['╔','═','═','╗',
      '╚','═','╗','║',
      '╔','═','╝','║',
      '╚','═','╗','║',
      '╔','═','╝','║',
      '╚','═','═','╝'],

  4: ['╔','╗','╔','╗',
      '║','║','║','║',
      '║','╚','╝','║',
      '╚','═','╗','║',
      ' ',' ','║','║',
      ' ',' ','╚','╝'],

  5: ['╔','═','═','╗',
      '║','╔','═','╝',
      '║','╚','═','╗',
      '╚','═','╗','║',
      '╔','═','╝','║',
      '╚','═','═','╝'],

  6: ['╔','═','═','╗',
      '║','╔','═','╝',
      '║','╚','═','╗',
      '║','╔','╗','║',
      '║','╚','╝','║',
      '╚','═','═','╝'],

  7: ['╔','═','═','╗',
      '╚','═','╗','║',
      ' ',' ','║','║',
      ' ',' ','║','║',
      ' ',' ','║','║',
      ' ',' ','╚','╝'],

  8: ['╔','═','═','╗',
      '║','╔','╗','║',
      '║','╚','╝','║',
      '║','╔','╗','║',
      '║','╚','╝','║',
      '╚','═','═','╝'],

  9: ['╔','═','═','╗',
      '║','╔','╗','║',
      '║','╚','╝','║',
      '╚','═','╝','║',
      '╔','═','╝','║',
      '╚','═','═','╝']
};

// Build DOM
const display = document.getElementById('display');
const hands = [], prev = [];

for (let i = 0; i < 3; i++) {
  const pair = document.createElement('div');
  pair.className = 'pair';
  for (let j = 0; j < 2; j++) {
    const digit = document.createElement('div');
    digit.className = 'digit';
    for (let k = 0; k < 24; k++) {
      const clock = document.createElement('div');
      clock.className = 'clock';
      const h1 = document.createElement('div');
      const h2 = document.createElement('div');
      h1.className = h2.className = 'hand';
      clock.append(h1, h2);
      digit.appendChild(clock);
      hands.push([h1, h2]);
      prev.push([0, 0]);
    }
    pair.appendChild(digit);
  }
  display.appendChild(pair);
}

// Normalize for shortest rotation
const norm = (n, p) => {
  let d = (n - p) % 360;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return p + d;
};

// Update clock
function tick() {
  const now = new Date();
  const t = [now.getHours() % 12 || 12, now.getMinutes(), now.getSeconds()]
    .map(n => String(n).padStart(2, '0')).join('');

  for (let i = 0; i < 6; i++) {
    const pat = digits[+t[i]];
    for (let j = 0; j < 24; j++) {
      const idx = i * 24 + j;
      const [a, b] = angles[pat[j]];
      const n1 = norm(a, prev[idx][0]);
      const n2 = norm(b, prev[idx][1]);
      hands[idx][0].style.transform = `rotate(${n1}deg)`;
      hands[idx][1].style.transform = `rotate(${n2}deg)`;
      prev[idx] = [n1, n2];
    }
  }
}

tick();
setInterval(tick, 1000);

// Theme toggle
const theme = { value: localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') };

const apply = () => {
  document.documentElement.setAttribute('data-theme', theme.value);
  document.getElementById('theme-toggle')?.setAttribute('aria-label', theme.value);
};

apply();

window.onload = () => {
  apply();
  document.getElementById('theme-toggle').onclick = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', theme.value);
    apply();
  };
};

matchMedia('(prefers-color-scheme: dark)').onchange = e => {
  theme.value = e.matches ? 'dark' : 'light';
  localStorage.setItem('theme', theme.value);
  apply();
};
