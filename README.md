# Sudoku Generator

A complete Sudoku puzzle generator and solver built with HTML, CSS, and vanilla JavaScript that runs entirely in the browser.

View online at: https://marjona6.github.io/sudoku-generator/

## Features

### 🎮 Game Features

- **Three Difficulty Levels**: Easy, Medium, and Hard
- **Real-time Validation**: Instant feedback on valid/invalid moves
- **Timer**: Track your solving time
- **Interactive Controls**: Click to select cells, keyboard navigation
- **Visual Feedback**: Different styling for fixed numbers, user input, and errors

### 🎯 Difficulty Levels

- **Easy**: ~63% of cells filled (30 cells removed)
- **Medium**: ~44% of cells filled (45 cells removed)
- **Hard**: ~32% of cells filled (55 cells removed)

### 🎨 User Interface

- **Modern Design**: Clean, responsive interface with gradient backgrounds
- **Mobile Friendly**: Responsive design that works on all screen sizes
- **Visual Cues**:
  - Fixed numbers (gray background, cannot be changed)
  - User input (blue text)
  - Errors (red background)
  - Selected cell (blue border)

## How to Play

### Basic Rules

1. Fill in the empty cells with numbers 1-9
2. Each row must contain all numbers 1-9 (no duplicates)
3. Each column must contain all numbers 1-9 (no duplicates)
4. Each 3x3 box must contain all numbers 1-9 (no duplicates)

### Controls

- **Mouse**: Click on any empty cell to select it
- **Keyboard**:
  - Numbers 1-9: Enter a number
  - Backspace/Delete: Clear a cell
  - Arrow keys: Navigate between cells
- **Buttons**:
  - **Generate New Puzzle**: Create a new puzzle at the selected difficulty
  - **Solve Puzzle**: Show the complete solution
  - **Clear Board**: Remove all user input (keep fixed numbers)

## Technical Details

### Algorithm

The Sudoku generator uses a sophisticated algorithm:

1. **Solution Generation**:

   - Starts by filling the three diagonal 3x3 boxes
   - Uses backtracking to complete the rest of the grid
   - Ensures a unique, valid solution

2. **Puzzle Creation**:

   - Copies the complete solution
   - Randomly removes cells based on difficulty level
   - Maintains puzzle solvability

3. **Validation**:
   - Real-time checking of row, column, and box constraints
   - Visual feedback for invalid moves
   - Win condition detection

### Browser Compatibility

- Works in all modern browsers
- No external dependencies
- Pure vanilla JavaScript, HTML, and CSS

## Getting Started

1. **Download/Clone** the repository
2. **Open** `index.html` in your web browser
3. **Select** a difficulty level
4. **Click** "Generate New Puzzle" to start playing

## File Structure

```
sudoku-generator/
├── index.html      # Main HTML structure
├── styles.css      # CSS styling and responsive design
├── script.js       # JavaScript game logic
└── README.md       # This file
```

## Customization

### Difficulty Adjustment

You can modify the difficulty by changing the `cellsToRemove` values in the `createPuzzle()` method:

```javascript
switch (difficulty) {
  case "easy":
    cellsToRemove = 30; // Adjust this number
    break;
  case "medium":
    cellsToRemove = 45; // Adjust this number
    break;
  case "hard":
    cellsToRemove = 55; // Adjust this number
    break;
}
```

### Styling

The CSS is well-organized and commented. You can easily customize:

- Colors and gradients
- Cell sizes and spacing
- Button styles
- Responsive breakpoints

## Future Enhancements

Potential improvements could include:

- Save/load puzzle functionality
- Statistics tracking
- Multiple puzzle themes
- Hint system
- Undo/redo functionality
- Export puzzles to PDF

## License

This project is open source and available under the MIT License.

---

Enjoy playing Sudoku! 🧩
