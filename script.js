class SudokuGenerator {
  constructor() {
    this.board = Array(9)
      .fill()
      .map(() => Array(9).fill(0));
    this.solution = Array(9)
      .fill()
      .map(() => Array(9).fill(0));
    this.puzzle = Array(9)
      .fill()
      .map(() => Array(9).fill(0));
    this.selectedCell = null;
    this.timer = null;
    this.startTime = null;
    this.isPlaying = false;

    this.initializeGame();
    this.setupEventListeners();
  }

  initializeGame() {
    this.createBoard();
    this.generateNewPuzzle();
    this.startTimer();
  }

  createBoard() {
    const board = document.getElementById("sudoku-board");
    board.innerHTML = "";

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.addEventListener("click", () => this.selectCell(cell, row, col));
        board.appendChild(cell);
      }
    }
  }

  selectCell(cell, row, col) {
    // Remove previous selection
    if (this.selectedCell) {
      this.selectedCell.classList.remove("selected");
    }

    // Don't allow selection of fixed cells
    if (this.puzzle[row][col] !== 0) {
      return;
    }

    // Select new cell
    this.selectedCell = cell;
    cell.classList.add("selected");
  }

  setupEventListeners() {
    // Button event listeners
    document.getElementById("generate-btn").addEventListener("click", () => {
      this.generateNewPuzzle();
    });

    document.getElementById("solve-btn").addEventListener("click", () => {
      this.solvePuzzle();
    });

    document.getElementById("clear-btn").addEventListener("click", () => {
      this.clearBoard();
    });

    document.getElementById("print-puzzle-btn").addEventListener("click", () => {
      this.printPuzzle();
    });

    document.getElementById("create-book-btn").addEventListener("click", () => {
      this.showBookModal();
    });

    // Difficulty change
    document.getElementById("difficulty").addEventListener("change", (e) => {
      this.updateDifficultyDisplay(e.target.value);
    });

    // Victory modal event listeners
    document.getElementById("new-game-btn").addEventListener("click", () => {
      this.hideVictoryModal();
      this.generateNewPuzzle();
    });

    document.getElementById("close-modal-btn").addEventListener("click", () => {
      this.hideVictoryModal();
    });

    // Book modal event listeners
    document.getElementById("generate-book-btn").addEventListener("click", () => {
      this.generateBook();
    });

    document.getElementById("close-book-modal-btn").addEventListener("click", () => {
      this.hideBookModal();
    });

    // Close book modal when clicking outside
    document.getElementById("book-modal").addEventListener("click", (e) => {
      if (e.target.id === "book-modal") {
        this.hideBookModal();
      }
    });

    // Close modal when clicking outside
    document.getElementById("victory-modal").addEventListener("click", (e) => {
      if (e.target.id === "victory-modal") {
        this.hideVictoryModal();
      }
    });

    // Keyboard input
    document.addEventListener("keydown", (e) => {
      this.handleKeyPress(e);
    });
  }

  handleKeyPress(e) {
    if (!this.selectedCell) return;

    const row = parseInt(this.selectedCell.dataset.row);
    const col = parseInt(this.selectedCell.dataset.col);

    // Don't allow input on fixed cells
    if (this.puzzle[row][col] !== 0) return;

    if (e.key >= "1" && e.key <= "9") {
      this.setCellValue(row, col, parseInt(e.key));
    } else if (e.key === "Backspace" || e.key === "Delete") {
      this.setCellValue(row, col, 0);
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight") {
      this.moveSelection(e.key);
    }
  }

  moveSelection(direction) {
    if (!this.selectedCell) return;

    const row = parseInt(this.selectedCell.dataset.row);
    const col = parseInt(this.selectedCell.dataset.col);
    let newRow = row;
    let newCol = col;

    switch (direction) {
      case "ArrowUp":
        newRow = Math.max(0, row - 1);
        break;
      case "ArrowDown":
        newRow = Math.min(8, row + 1);
        break;
      case "ArrowLeft":
        newCol = Math.max(0, col - 1);
        break;
      case "ArrowRight":
        newCol = Math.min(8, col + 1);
        break;
    }

    const newCell = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
    if (newCell) {
      this.selectCell(newCell, newRow, newCol);
    }
  }

  setCellValue(row, col, value) {
    this.board[row][col] = value;
    this.updateCellDisplay(row, col, value);
    this.checkWinCondition();
  }

  updateCellDisplay(row, col, value) {
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (!cell) return;

    cell.textContent = value || "";
    cell.classList.remove("error", "user-input");

    if (value === 0) {
      cell.classList.remove("user-input");
    } else if (this.puzzle[row][col] === 0) {
      cell.classList.add("user-input");
      // Check if the move is valid
      if (!this.isValidMove(row, col, value)) {
        cell.classList.add("error");
      }
    }
  }

  isValidMove(row, col, value) {
    // Check row
    for (let c = 0; c < 9; c++) {
      if (c !== col && this.board[row][c] === value) return false;
    }

    // Check column
    for (let r = 0; r < 9; r++) {
      if (r !== row && this.board[r][col] === value) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if ((r !== row || c !== col) && this.board[r][c] === value) return false;
      }
    }

    return true;
  }

  generateNewPuzzle() {
    this.resetGame();
    this.generateSolution();
    this.createPuzzle();
    this.displayPuzzle();
    this.startTimer();
  }

  resetGame() {
    this.board = Array(9)
      .fill()
      .map(() => Array(9).fill(0));
    this.solution = Array(9)
      .fill()
      .map(() => Array(9).fill(0));
    this.puzzle = Array(9)
      .fill()
      .map(() => Array(9).fill(0));
    this.isPlaying = true;

    // Clear selection
    if (this.selectedCell) {
      this.selectedCell.classList.remove("selected");
      this.selectedCell = null;
    }
  }

  generateSolution() {
    // Use mathematical Sudoku generation algorithm
    this.generateMathematicalSudoku();
  }

  generateMathematicalSudoku() {
    // Use proper constraint satisfaction with backtracking
    this.generateWithBacktracking();
  }

  generateWithBacktracking() {
    // Start with a valid Sudoku pattern and use constraint satisfaction
    this.initializeSudoku();
    this.solveWithBacktracking(this.solution);
  }

  initializeSudoku() {
    // Start with a known valid Sudoku pattern
    const basePattern = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ];

    // Apply random transformations to create variety
    this.applyRandomTransformations(basePattern);

    // Copy to solution
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        this.solution[row][col] = basePattern[row][col];
      }
    }
  }

  applyRandomTransformations(pattern) {
    // Apply multiple random transformations to create variety
    const transformations = [() => this.shuffleRows(pattern), () => this.shuffleColumns(pattern), () => this.shuffleNumbers(pattern), () => this.transposeGrid(pattern), () => this.rotateGrid(pattern)];

    // Apply 3-5 random transformations
    const numTransformations = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < numTransformations; i++) {
      const randomTransform = transformations[Math.floor(Math.random() * transformations.length)];
      randomTransform();
    }
  }

  shuffleRows(pattern) {
    // Shuffle rows within each 3x3 block
    for (let block = 0; block < 3; block++) {
      const startRow = block * 3;
      const rows = [startRow, startRow + 1, startRow + 2];
      this.shuffleArray(rows);

      const temp = [];
      for (let i = 0; i < 3; i++) {
        temp.push([...pattern[rows[i]]]);
      }
      for (let i = 0; i < 3; i++) {
        pattern[startRow + i] = temp[i];
      }
    }
  }

  shuffleColumns(pattern) {
    // Shuffle columns within each 3x3 block
    for (let block = 0; block < 3; block++) {
      const startCol = block * 3;
      const cols = [startCol, startCol + 1, startCol + 2];
      this.shuffleArray(cols);

      for (let row = 0; row < 9; row++) {
        const temp = [];
        for (let i = 0; i < 3; i++) {
          temp.push(pattern[row][cols[i]]);
        }
        for (let i = 0; i < 3; i++) {
          pattern[row][startCol + i] = temp[i];
        }
      }
    }
  }

  shuffleNumbers(pattern) {
    // Create a random number mapping
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const shuffled = this.shuffleArray([...numbers]);
    const mapping = {};
    numbers.forEach((num, index) => {
      mapping[num] = shuffled[index];
    });

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        pattern[row][col] = mapping[pattern[row][col]];
      }
    }
  }

  transposeGrid(pattern) {
    // Transpose the grid (swap rows and columns)
    const transposed = Array(9)
      .fill()
      .map(() => Array(9).fill(0));
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        transposed[col][row] = pattern[row][col];
      }
    }

    // Copy back to pattern
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        pattern[row][col] = transposed[row][col];
      }
    }
  }

  rotateGrid(pattern) {
    // Rotate the grid 90 degrees clockwise
    const rotated = Array(9)
      .fill()
      .map(() => Array(9).fill(0));
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        rotated[col][8 - row] = pattern[row][col];
      }
    }

    // Copy back to pattern
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        pattern[row][col] = rotated[row][col];
      }
    }
  }

  solveWithBacktracking(board) {
    // This is a backup method in case the transformations don't work
    // In practice, the transformations should always produce valid Sudoku
    const empty = this.findEmpty(board);
    if (!empty) return true;

    const [row, col] = empty;
    const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (let num of numbers) {
      if (this.isValidMoveForBoard(board, row, col, num)) {
        board[row][col] = num;
        if (this.solveWithBacktracking(board)) return true;
        board[row][col] = 0;
      }
    }
    return false;
  }

  findEmpty(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) return [row, col];
      }
    }
    return null;
  }

  isValidMoveForBoard(board, row, col, num) {
    // Check row
    for (let c = 0; c < 9; c++) {
      if (board[row][c] === num) return false;
    }

    // Check column
    for (let r = 0; r < 9; r++) {
      if (board[r][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (board[r][c] === num) return false;
      }
    }

    return true;
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  createPuzzle() {
    // Copy solution to puzzle
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        this.puzzle[row][col] = this.solution[row][col];
      }
    }

    // Remove numbers based on difficulty
    const difficulty = document.getElementById("difficulty").value;
    let cellsToRemove;

    switch (difficulty) {
      case "easy":
        cellsToRemove = 30; // ~37% filled
        break;
      case "medium":
        cellsToRemove = 45; // ~44% filled
        break;
      case "hard":
        cellsToRemove = 55; // ~32% filled
        break;
      default:
        cellsToRemove = 30;
    }

    // Use a more sophisticated removal strategy for better distribution
    this.removeCellsWithDistribution(cellsToRemove);
  }

  removeCellsWithDistribution(cellsToRemove) {
    // Use a direct random selection approach
    const totalCells = 81;
    const cellsToKeep = totalCells - cellsToRemove;

    // Create a set of all positions to remove
    const positionsToRemove = new Set();

    // First, ensure each 3x3 block has at least one empty space
    for (let blockRow = 0; blockRow < 3; blockRow++) {
      for (let blockCol = 0; blockCol < 3; blockCol++) {
        // Select a random position within this block
        const startRow = blockRow * 3;
        const startCol = blockCol * 3;
        const row = startRow + Math.floor(Math.random() * 3);
        const col = startCol + Math.floor(Math.random() * 3);
        const position = `${row},${col}`;
        positionsToRemove.add(position);
      }
    }

    // Now randomly select the remaining positions to remove
    const remainingCellsToRemove = cellsToRemove - positionsToRemove.size;

    while (positionsToRemove.size < cellsToRemove) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      const position = `${row},${col}`;

      if (!positionsToRemove.has(position)) {
        positionsToRemove.add(position);
      }
    }

    // Remove the selected cells
    for (const position of positionsToRemove) {
      const [row, col] = position.split(",").map(Number);
      this.puzzle[row][col] = 0;
    }
  }

  displayPuzzle() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = this.puzzle[row][col];
        this.board[row][col] = value;
        this.updateCellDisplay(row, col, value);

        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (value !== 0) {
          cell.classList.add("fixed");
        }
      }
    }
  }

  solvePuzzle() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        this.board[row][col] = this.solution[row][col];
        this.updateCellDisplay(row, col, this.solution[row][col]);
      }
    }
    this.isPlaying = false;
    this.stopTimer();
  }

  clearBoard() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.puzzle[row][col] === 0) {
          this.board[row][col] = 0;
          this.updateCellDisplay(row, col, 0);
        }
      }
    }
  }

  checkWinCondition() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.board[row][col] !== this.solution[row][col]) {
          return;
        }
      }
    }

    // All cells match solution - puzzle solved!
    this.isPlaying = false;
    this.stopTimer();
    setTimeout(() => {
      this.showVictoryModal();
    }, 100);
  }

  showVictoryModal() {
    // Update modal with final stats
    document.getElementById("final-time").textContent = document.getElementById("timer").textContent;
    document.getElementById("final-difficulty").textContent = document.getElementById("current-difficulty").textContent;

    // Show the modal
    document.getElementById("victory-modal").style.display = "block";
  }

  hideVictoryModal() {
    document.getElementById("victory-modal").style.display = "none";
  }

  showBookModal() {
    document.getElementById("book-modal").style.display = "block";
  }

  hideBookModal() {
    document.getElementById("book-modal").style.display = "none";
  }

  generateBook() {
    const pages = parseInt(document.getElementById("book-pages").value);
    const puzzlesPerPage = parseInt(document.getElementById("book-puzzles-per-page").value);
    const difficulty = document.getElementById("book-difficulty").value;

    if (pages < 1 || pages > 50) {
      alert("Please enter a valid number of pages (1-50)");
      return;
    }

    if (puzzlesPerPage < 1 || puzzlesPerPage > 6) {
      alert("Please enter a valid number of puzzles per page (1-6)");
      return;
    }

    this.hideBookModal();
    this.createBookPDF(pages, puzzlesPerPage, difficulty);
  }

  createBookPDF(pages, puzzlesPerPage, difficulty) {
    // Check if jsPDF is available
    if (typeof window.jspdf === "undefined") {
      this.loadJsPDF()
        .then(() => {
          this.createBookPDF(pages, puzzlesPerPage, difficulty);
        })
        .catch(() => {
          alert("PDF library could not be loaded. Please check your internet connection and try again.");
        });
      return;
    }

    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      const totalPuzzles = pages * puzzlesPerPage;
      let currentPuzzle = 0;

      for (let page = 0; page < pages; page++) {
        if (page > 0) {
          doc.addPage();
        }

        // Calculate grid layout based on puzzles per page
        let gridCols, gridRows;
        if (puzzlesPerPage === 6) {
          // Use 2x3 layout for 6 puzzles (better fit)
          gridCols = 2;
          gridRows = 3;
        } else {
          gridCols = Math.ceil(Math.sqrt(puzzlesPerPage));
          gridRows = Math.ceil(puzzlesPerPage / gridCols);
        }

        const pageWidth = 215.9; // 8.5" width in mm
        const pageHeight = 279.4; // 11" height in mm
        const margin = 15; // margin in mm
        const availableWidth = pageWidth - 2 * margin;
        const availableHeight = pageHeight - 2 * margin;

        const gridWidth = availableWidth / gridCols;
        const gridHeight = availableHeight / gridRows;

        // Calculate grid size (larger grids with less spacing)
        const gridSize = Math.min(gridWidth, gridHeight) * 0.9;
        const cellSize = gridSize / 9;

        for (let row = 0; row < gridRows; row++) {
          for (let col = 0; col < gridCols; col++) {
            const puzzleIndex = row * gridCols + col;
            if (puzzleIndex >= puzzlesPerPage) break;

            // Generate a new puzzle
            const puzzle = this.generatePuzzleForBook(difficulty);

            // Calculate position for this grid
            const startX = margin + col * gridWidth + (gridWidth - gridSize) / 2;
            const startY = margin + row * gridHeight + (gridHeight - gridSize) / 2;

            // Draw the Sudoku grid
            this.drawSudokuGrid(doc, puzzle, startX, startY, gridSize, cellSize, puzzlesPerPage);

            currentPuzzle++;
          }
        }
      }

      // Save the PDF
      const dateStr = new Date().toLocaleDateString().replace(/\//g, "-");
      doc.save(`sudoku-book-${difficulty}-${pages}pages-${dateStr}.pdf`);
    } catch (error) {
      console.error("Error generating book:", error);
      alert("There was an error generating the book. Please try again.");
    }
  }

  generatePuzzleForBook(difficulty) {
    // Create a temporary solution and puzzle
    const solution = Array(9)
      .fill()
      .map(() => Array(9).fill(0));
    const puzzle = Array(9)
      .fill()
      .map(() => Array(9).fill(0));

    // Generate solution using the same method as the main game
    this.generateSolutionForBook(solution);

    // Copy solution to puzzle
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        puzzle[row][col] = solution[row][col];
      }
    }

    // Remove cells based on difficulty
    let cellsToRemove;
    switch (difficulty) {
      case "easy":
        cellsToRemove = 30;
        break;
      case "medium":
        cellsToRemove = 45;
        break;
      case "hard":
        cellsToRemove = 55;
        break;
      default:
        cellsToRemove = 30;
    }

    this.removeCellsForBook(puzzle, cellsToRemove);
    return puzzle;
  }

  generateSolutionForBook(solution) {
    // Use the same solution generation as the main game
    const basePattern = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ];

    // Apply random transformations
    this.applyRandomTransformationsForBook(basePattern);

    // Copy to solution
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        solution[row][col] = basePattern[row][col];
      }
    }
  }

  applyRandomTransformationsForBook(pattern) {
    const transformations = [() => this.shuffleRows(pattern), () => this.shuffleColumns(pattern), () => this.shuffleNumbers(pattern), () => this.transposeGrid(pattern), () => this.rotateGrid(pattern)];

    const numTransformations = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < numTransformations; i++) {
      const randomTransform = transformations[Math.floor(Math.random() * transformations.length)];
      randomTransform();
    }
  }

  removeCellsForBook(puzzle, cellsToRemove) {
    const positionsToRemove = new Set();

    // First, ensure each 3x3 block has at least one empty space
    for (let blockRow = 0; blockRow < 3; blockRow++) {
      for (let blockCol = 0; blockCol < 3; blockCol++) {
        const startRow = blockRow * 3;
        const startCol = blockCol * 3;
        const row = startRow + Math.floor(Math.random() * 3);
        const col = startCol + Math.floor(Math.random() * 3);
        const position = `${row},${col}`;
        positionsToRemove.add(position);
      }
    }

    // Now randomly select the remaining positions to remove
    while (positionsToRemove.size < cellsToRemove) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      const position = `${row},${col}`;

      if (!positionsToRemove.has(position)) {
        positionsToRemove.add(position);
      }
    }

    // Remove the selected cells
    for (const position of positionsToRemove) {
      const [row, col] = position.split(",").map(Number);
      puzzle[row][col] = 0;
    }
  }

  drawSudokuGrid(doc, puzzle, startX, startY, gridSize, cellSize, puzzlesPerPage = 4) {
    // Draw grid lines
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);

    // Draw thin lines for all cells
    for (let i = 0; i <= 9; i++) {
      const pos = startX + i * cellSize;
      doc.line(pos, startY, pos, startY + gridSize);
      doc.line(startX, startY + i * cellSize, startX + gridSize, startY + i * cellSize);
    }

    // Draw thick lines for 3x3 blocks
    doc.setLineWidth(0.5);
    for (let i = 0; i <= 9; i += 3) {
      const pos = startX + i * cellSize;
      doc.line(pos, startY, pos, startY + gridSize);
      doc.line(startX, startY + i * cellSize, startX + gridSize, startY + i * cellSize);
    }

    // Adjust font size based on number of puzzles per page
    let fontSize;
    if (puzzlesPerPage === 6) {
      fontSize = 12; // Same readable font size for 6 puzzles (good space with 2x3 layout)
    } else if (puzzlesPerPage === 4) {
      fontSize = 12; // Standard font for 4 puzzles
    } else {
      fontSize = 14; // Larger font for fewer puzzles
    }

    // Fill in the numbers
    doc.setFontSize(fontSize);
    doc.setTextColor(0, 0, 0);

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = puzzle[row][col];
        if (value !== 0) {
          const x = startX + col * cellSize + cellSize / 2;
          const y = startY + row * cellSize + cellSize / 2 + 3; // +3 for vertical centering with larger font
          doc.text(value.toString(), x, y, { align: "center" });
        }
      }
    }
  }

  printPuzzle() {
    // Check if jsPDF is available
    if (typeof window.jspdf === "undefined") {
      // Try to load the library dynamically
      this.loadJsPDF()
        .then(() => {
          this.printPuzzle();
        })
        .catch(() => {
          alert("PDF library could not be loaded. Please check your internet connection and try again.");
        });
      return;
    }

    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Get current date and difficulty
      const today = new Date();
      const dateStr = today.toLocaleDateString();
      const difficulty = document.getElementById("current-difficulty").textContent;

      // Header
      doc.setFontSize(20);
      doc.setTextColor(102, 126, 234);
      doc.text("Sudoku Puzzle", 105, 20, { align: "center" });

      doc.setFontSize(12);
      doc.setTextColor(51, 51, 51);
      doc.text(`Difficulty: ${difficulty}`, 105, 30, { align: "center" });
      doc.text(`Date: ${dateStr}`, 105, 40, { align: "center" });

      // Draw the Sudoku grid
      const gridSize = 120; // Size of the grid
      const startX = (210 - gridSize) / 2; // Center the grid
      const startY = 60;
      const cellSize = gridSize / 9;

      // Draw grid lines
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);

      // Draw thin lines for all cells
      for (let i = 0; i <= 9; i++) {
        const pos = startX + i * cellSize;
        doc.line(pos, startY, pos, startY + gridSize);
        doc.line(startX, startY + i * cellSize, startX + gridSize, startY + i * cellSize);
      }

      // Draw thick lines for 3x3 blocks
      doc.setLineWidth(1.5);
      for (let i = 0; i <= 9; i += 3) {
        const pos = startX + i * cellSize;
        doc.line(pos, startY, pos, startY + gridSize);
        doc.line(startX, startY + i * cellSize, startX + gridSize, startY + i * cellSize);
      }

      // Fill in the numbers
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);

      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          const value = this.puzzle[row][col];
          if (value !== 0) {
            const x = startX + col * cellSize + cellSize / 2;
            const y = startY + row * cellSize + cellSize / 2 + 5; // +5 for vertical centering
            doc.text(value.toString(), x, y, { align: "center" });
          }
        }
      }

      // Add instructions
      doc.setFontSize(10);
      doc.setTextColor(102, 102, 102);
      doc.text("Fill in the empty cells with numbers 1-9 so that each row,", 105, startY + gridSize + 20, { align: "center" });
      doc.text("column, and 3x3 box contains all numbers 1-9 exactly once.", 105, startY + gridSize + 30, { align: "center" });

      // Save the PDF
      doc.save(`sudoku-puzzle-${difficulty.toLowerCase()}-${dateStr.replace(/\//g, "-")}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Fallback to browser print
      this.printPuzzleFallback();
    }
  }

  updateDifficultyDisplay(difficulty) {
    document.getElementById("current-difficulty").textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  }

  startTimer() {
    this.startTime = Date.now();
    this.timer = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  updateTimer() {
    if (!this.startTime) return;

    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;

    document.getElementById("timer").textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  loadJsPDF() {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (typeof window.jspdf !== "undefined") {
        resolve();
        return;
      }

      // Create script element
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      script.onload = () => {
        // Wait a bit for the library to initialize
        setTimeout(() => {
          if (typeof window.jspdf !== "undefined") {
            resolve();
          } else {
            reject(new Error("jsPDF failed to load"));
          }
        }, 100);
      };
      script.onerror = () => reject(new Error("Failed to load jsPDF"));

      document.head.appendChild(script);
    });
  }

  printPuzzleFallback() {
    const printWindow = window.open("", "_blank");
    const difficulty = document.getElementById("current-difficulty").textContent;
    const date = new Date().toLocaleDateString();

    // Create HTML table for the puzzle
    let puzzleHTML = '<table style="border-collapse: collapse; margin: 20px auto; border: 2px solid #000;">';
    for (let row = 0; row < 9; row++) {
      puzzleHTML += "<tr>";
      for (let col = 0; col < 9; col++) {
        const value = this.puzzle[row][col];
        const borderStyle = (col % 3 === 0 ? "border-left: 2px solid #000;" : "border-left: 1px solid #ccc;") + (row % 3 === 0 ? "border-top: 2px solid #000;" : "border-top: 1px solid #ccc;") + "border-right: 1px solid #ccc; border-bottom: 1px solid #ccc;";
        puzzleHTML += `<td style="width: 40px; height: 40px; text-align: center; vertical-align: middle; font-size: 18px; ${borderStyle}">${value || ""}</td>`;
      }
      puzzleHTML += "</tr>";
    }
    puzzleHTML += "</table>";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sudoku Puzzle</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
            h1 { color: #667eea; }
            .instructions { margin: 20px 0; font-size: 14px; }
          </style>
        </head>
        <body>
          <h1>Sudoku Puzzle</h1>
          <p><strong>Difficulty:</strong> ${difficulty}</p>
          <p><strong>Date:</strong> ${date}</p>
          ${puzzleHTML}
          <div class="instructions">
            <p>Fill in the empty cells with numbers 1-9 so that each row,</p>
            <p>column, and 3x3 box contains all numbers 1-9 exactly once.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
}

// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new SudokuGenerator();
});
