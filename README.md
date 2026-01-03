# Clock Made of Clocks

I found this idea in hyperplexed's video and wanted to challenge myself to build it using his explanation. Check out the original concept  [here](https://www.youtube.com/watch?v=VUSCH7nQGIM)

## What This Project Is

This is a creative digital clock that displays the current time using digits made entirely out of mini analog clocks. Instead of traditional digital segments or pixels, each number (0-9) is formed by a 6×4 grid of 24 tiny analog clocks, where each clock's hands are positioned to create the visual shape of the digit. 

**[Live Site](https://clock.ishitbansal.com)**

## How It Works

### The Core Concept

Each digit in the time display (hours, minutes, seconds) is represented by a grid of 24 mini analog clocks. Each mini clock has two hands that can point in different directions to form visual patterns. These patterns are based on box-drawing characters (like ╔, ═, ║, ╚, etc.) that when combined, create the recognizable shapes of numbers.

### Character-to-Angle Mapping

The JavaScript defines a mapping between box-drawing characters and clock hand angles:

```javascript
const charMap = {
  '╔': [90, 0],      // down + right
  '╗': [90, 180],    // down + left
  '╚': [-90, 0],     // up + right
  '╝': [-90, 180],   // up + left
  '═': [0, 180],     // horizontal
  '║': [-90, 90],    // vertical
  ' ': [135, 135]    // neutral (hidden)
};
```

Each character represents two hand positions:
- First value: angle for the first hand (in degrees)
- Second value: angle for the second hand (in degrees)

### Digit Patterns

Each digit (0-9) is defined as a 24-element array representing a 6-row by 4-column grid. For example, the digit "2" looks like this:

```javascript
2: ['╔','═','═','╗',
    '╚','═','╗','║',
    '╔','═','╝','║',
    '║','╔','═','╝',
    '║','╚','═','╗',
    '╚','═','═','╝']
```

When rendered, these characters are converted to clock hand angles, creating the visual outline of the number.

### Time Display Structure

The clock displays time in 12-hour format as HH:MM:SS, but only shows the numeric digits (no colon separators visually). The display consists of:

- **3 pairs of digits**: Hours, minutes, and seconds
- **Each pair**: Two digit containers side by side
- **Each digit container**: 24 mini clocks in a 6×4 grid
- **Total mini clocks**: 144 clocks on screen (24 × 6 digits)

### JavaScript Implementation

The code works in several key parts:

1. **Digit Creation**: `createDigit()` generates a container with 24 clock elements, each containing two hand divs.

2. **Digit Updating**: `setDigit()` takes a digit container and a number (0-9), then applies the appropriate hand angles to each of the 24 clocks based on the digit pattern.

3. **Time Retrieval**: `getTimeDigits()` gets the current time, converts it to 12-hour format, pads with zeros, and returns an array of individual digits.

4. **Main Loop**: Every second, the display updates by calling `getTimeDigits()` and applying `setDigit()` to each digit container.

### Visual Design

The project uses a neumorphic design aesthetic:

- **Mini Clocks**: Circular elements with inset shadows creating a "pressed" 3D effect
- **Clock Hands**: Thin rectangular elements that rotate smoothly
- **Layout**: Responsive grid layout with viewport-based sizing (vw units)
- **Transitions**: Smooth animations when hands move and themes change

### Dark/Light Theme

A theme toggle button in the top-right corner switches between light and dark modes:

- **Light Theme**: Light gray background with subtle shadows
- **Dark Theme**: Dark background with inverted shadow colors
- **Animated Icon**: The toggle button shows a sun/moon icon that morphs between themes

### Technical Details

- **No Dependencies**: Pure HTML, CSS, and JavaScript
- **Responsive**: Uses viewport units (vw) for sizing
- **Performance**: Updates every second, smooth CSS transitions
- **Accessibility**: Proper ARIA labels and semantic HTML
- **PWA Ready**: Includes web manifest and icons for installation

### File Structure

```
cool-clock/
├── index.html      # Main HTML structure
├── script.js       # Clock logic and digit patterns
├── styles.css      # Neumorphic styling and themes
├── site.webmanifest # PWA manifest
└── Various icons   # Favicon and app icons
```

This project demonstrates a creative intersection of analog and digital timekeeping, where traditional clock hands are repurposed as pixels to form larger numeric displays.
