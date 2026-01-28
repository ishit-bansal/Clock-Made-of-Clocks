# Clock Made of Clocks

A creative digital clock where each digit is displayed using a grid of mini analog clocks. Instead of traditional LED segments, each number (0-9) is formed by 24 tiny analog clocks whose hands are positioned to create the visual shape of the digit.

Inspired by [Hyperplexed's video](https://www.youtube.com/watch?v=VUSCH7nQGIM) - I wanted to challenge myself to build it from scratch using his explanation.

**[Live Demo](https://clock.ishitbansal.com)**

---

## How It Works

### The Core Idea

Each digit in the time display (HH:MM:SS) is represented by a **6×4 grid of 24 mini analog clocks**. Each mini clock has two hands that can rotate independently. By positioning these hands at specific angles, they form visual patterns that look like box-drawing characters (╔, ═, ║, etc.). When combined, these characters create recognizable number shapes.

### Box-Drawing Characters → Clock Hand Angles

The code maps each character to two angles (one per clock hand):

| Character | Hand 1 | Hand 2 | Visual |
|-----------|--------|--------|--------|
| `╔` | 90° (down) | 0° (right) | Corner: bottom-right |
| `╗` | 90° (down) | 180° (left) | Corner: bottom-left |
| `╚` | -90° (up) | 0° (right) | Corner: top-right |
| `╝` | -90° (up) | 180° (left) | Corner: top-left |
| `═` | 0° (right) | 180° (left) | Horizontal line |
| `║` | -90° (up) | 90° (down) | Vertical line |
| ` ` | 135° | 135° | Hidden (diagonal) |

### Digit Patterns

Each digit is defined as a 24-character array representing the 6×4 grid. For example, the digit "2":

```
╔ ═ ═ ╗
╚ ═ ╗ ║
╔ ═ ╝ ║
║ ╔ ═ ╝
║ ╚ ═ ╗
╚ ═ ═ ╝
```

When rendered, the clock hands at each position form the outline of the number.

### Smooth Animation

When the time changes, hands don't just snap to new positions—they smoothly rotate. The `normalizeAngle()` function ensures hands always take the **shortest path** (max 180° in either direction), preventing awkward full rotations.

---

## Code Structure

```
cool-clock/
├── index.html          # Page structure and theme toggle SVG
├── styles.css          # Neumorphic styling and animations
├── script.js           # Clock logic, patterns, and theme management
├── site.webmanifest    # PWA configuration
└── *.png, *.ico        # App icons and favicons
```

### Key JavaScript Components

| Component | Purpose |
|-----------|---------|
| `HAND_ANGLES` | Maps characters to clock hand angles |
| `DIGIT_PATTERNS` | Defines the 6×4 grid pattern for each digit 0-9 |
| `buildClockDisplay()` | Creates the DOM structure for all 144 clocks |
| `updateClock()` | Reads current time and updates all clock hands |
| `normalizeAngle()` | Calculates shortest rotation path |
| `ThemeManager` | Handles light/dark theme with localStorage persistence |

### Constants

```javascript
GRID_ROWS = 6           // Rows per digit
GRID_COLS = 4           // Columns per digit
CLOCKS_PER_DIGIT = 24   // Mini clocks per digit
TOTAL_DIGITS = 6        // HH:MM:SS = 6 digits
UPDATE_INTERVAL_MS = 1000
```

---

## Design

The project uses a **neumorphic** (soft UI) design:

- **Mini Clocks**: Circular elements with subtle shadows creating a soft, pressed 3D effect
- **Clock Hands**: Thin lines that rotate smoothly with CSS transitions
- **Theme Toggle**: Animated sun/moon icon that morphs between light and dark modes
- **Responsive**: Uses viewport units (vw) so it scales with screen size

---

## Technical Details

- **Zero dependencies**: Pure HTML, CSS, and JavaScript
- **Responsive**: Scales with viewport using `vw` units
- **Accessible**: Semantic HTML, ARIA labels, respects `prefers-reduced-motion`
- **PWA Ready**: Includes manifest and icons for "Add to Home Screen"
- **Performance**: Efficient DOM updates, CSS-based animations

---

## Local Development

Just open `index.html` in a browser, or serve it locally:

```bash
# Using Python
python -m http.server 8000

# Using Node
npx serve
```

Then visit `http://localhost:8000`
