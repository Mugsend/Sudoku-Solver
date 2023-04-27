const solvedSudokuGrid = randomGrid();
const puzzleSudokuGrid = makePuzzle(solvedSudokuGrid);
const moves = [];
function randomGrid() {
  const grid = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => 0)
  );
  for (let i = 0; i < 9; i += 3) {
    let box = [];
    for (let j = 1; j <= 9; j++) {
      box.push(j);
    }
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        let index = Math.floor(Math.random() * box.length);
        let num = box[index];
        box.splice(index, 1);
        grid[i + j][i + k] = num;
      }
    }
  }

  const isValid = (row, col, num) => {
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num || grid[i][col] === num) {
        return false;
      }
    }
    let boxRow = Math.floor(row / 3) * 3;
    let boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if (grid[i][j] === num) {
          return false;
        }
      }
    }
    return true;
  };
  const fillSudoku = (row, col) => {
    if (row === 9) return true;
    if (col === 9) return fillSudoku(row + 1, 0);
    if (grid[row][col] !== 0) {
      return fillSudoku(row, col + 1);
    }

    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    while (nums.length > 0) {
      let index = Math.floor(Math.random() * nums.length);
      let num = nums[index];
      nums.splice(index, 1);
      if (isValid(row, col, num)) {
        grid[row][col] = num;
        if (fillSudoku(row, col + 1)) {
          return true;
        }
        grid[row][col] = 0;
      }
    }
    return false;
  };
  fillSudoku(0, 3);
  fillSudoku(3, 6);
  fillSudoku(6, 0);

  return grid;
}

function makePuzzle(solvedGrid) {
  const grid = [];

  for (let i = 0; i < 9; i++) {
    const row = [];
    for (let j = 0; j < 9; j++) {
      row.push(solvedGrid[i][j]);
    }
    grid.push(row);
  }
  const nums = [...Array(81)].map((_, i) => i);
  for (let i = 0; i < 40; i++) {
    const randInd = Math.floor(Math.random() * nums.length);

    grid[Math.floor(nums[randInd] / 9)][nums[randInd] % 9] = 0;
    nums.splice(randInd, 1);
  }

  return grid;
}

var notesHidden = true;
var wrong = -1;
var selectedCellId = 0;
const notes = getNotes(puzzleSudokuGrid);

var inputFilled = 0;
(function initiateGrid() {
  const grid = document.getElementById("grid");
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement("div");
      cell.id = i * 9 + j;
      if (puzzleSudokuGrid[i][j]) {
        inputFilled++;
        cell.innerText = puzzleSudokuGrid[i][j];
        cell.className = "prefilled";
      } else {
        cell.className = "empty";

        cell.onclick = function () {
          selectCell(this.id);
        };
      }
      grid.appendChild(cell);
    }
  }
})();
var id = selectedCellId;
while (document.getElementById(id).classList.contains("prefilled")) id++;
selectCell(id);

function selectCell(id) {
  document.getElementById(selectedCellId).classList.remove("selected");
  selectedCellId = id;
  if (!document.getElementById(selectedCellId).classList.contains("hinted"))
    document.getElementById(selectedCellId).classList.add("selected");
}

document.addEventListener("keydown", function (event) {
  if (event.key >= "0" && event.key <= "9") {
    let n = parseInt(event.key);
    fillNumber(n);
  } else if (event.key === "ArrowUp") {
    if (selectedCellId > 8) {
      var id = selectedCellId - 9;
      while (
        id >= 0 &&
        document.getElementById(id).classList.contains("prefilled")
      )
        id -= 9;

      if (id >= 0) selectCell(id);
    }
  } else if (event.key === "ArrowDown") {
    if (selectedCellId < 72) {
      var id = selectedCellId + 9;
      while (
        id <= 80 &&
        document.getElementById(id).classList.contains("prefilled")
      )
        id += 9;

      if (id <= 80) selectCell(id);
    }
  } else if (event.key === "ArrowLeft") {
    if (selectedCellId > 0) {
      var id = selectedCellId - 1;
      while (
        id >= 0 &&
        document.getElementById(id).classList.contains("prefilled")
      )
        id -= 1;

      if (id >= 0) selectCell(id);
    }
  } else if (event.key === "ArrowRight") {
    if (selectedCellId < 80) {
      var id = selectedCellId + 1;
      while (
        id <= 80 &&
        document.getElementById(id).classList.contains("prefilled")
      )
        id += 1;

      if (id <= 80) selectCell(id);
    }
  }
});

function idToRowCol(id) {
  const row = Math.floor(id / 9);
  const col = id % 9;
  return { row, col };
}
function fillNumber(n) {
  const { row, col } = idToRowCol(selectedCellId);
  if (wrong != -1) {
    if (wrong != selectedCellId) {
      alert("Please clear all the wrong fills before proceeding.");
      return;
    }
    removePointed(row, col);
    wrong = -1;
  }
  resetCell(selectedCellId);
  if (n) {
    puzzleSudokuGrid[row][col] = n;

    const moveInd = moves.indexOf(selectedCellId);
    if (moveInd != -1) {
      moves.splice(moveInd, 0);
    }
    moves.push(selectedCellId);
    const selectedEle = document.getElementById(selectedCellId);
    selectedEle.classList.remove("empty");
    selectedEle.classList.remove("incorrect");
    selectedEle.classList.add("filled");
    selectedEle.innerText = n;
    if (selectedEle.classList.contains("hinted")) {
      document.getElementById("hint").remove();
      selectedEle.classList.remove("hinted");
      document.getElementById(selectedCellId).classList.add("selected");
    }
    if (!notes[row][col].includes(n)) {
      selectedEle.classList.add("incorrect");
      pointNums(row, col, n);
      wrong = selectedCellId;
    } else {
      notes[row][col] = [];
      updateNotes(n, row, col, notes);
      if (!notesHidden) updateGrid(row, col);
    }
  } else {
    deleteNum(selectedCellId);
  }
}

function pointNums(row, col, n) {
  const br = row - (row % 3);
  const bc = col - (col % 3);
  for (let i = 0; i < 9; i++) {
    if (puzzleSudokuGrid[row][i] == n && i != col)
      document.getElementById(row * 9 + i).classList.add("pointed");
    if (puzzleSudokuGrid[i][col] == n && i != row)
      document.getElementById(i * 9 + col).classList.add("pointed");
    if (
      puzzleSudokuGrid[br + Math.floor(i / 3)][bc + (i % 3)] == n &&
      (br + Math.floor(i / 3) != row || bc + (i % 3) != col)
    )
      document
        .getElementById((br + Math.floor(i / 3)) * 9 + bc + (i % 3))
        .classList.add("pointed");
  }
}

function removePointed(row, col) {
  const br = row - (row % 3);
  const bc = col - (col % 3);
  for (let i = 0; i < 9; i++) {
    if (puzzleSudokuGrid[row][i] && i != col)
      document.getElementById(row * 9 + i).classList.remove("pointed");
    if (puzzleSudokuGrid[i][col] && i != row)
      document.getElementById(i * 9 + col).classList.remove("pointed");
    if (
      puzzleSudokuGrid[br + Math.floor(i / 3)][bc + (i % 3)] &&
      (br + Math.floor(i / 3) != row || bc + (i % 3) != col)
    )
      document
        .getElementById((br + Math.floor(i / 3)) * 9 + bc + (i % 3))
        .classList.remove("pointed");
  }
}
function deleteNum(id) {
  document.getElementById(id).innerHTML = "";
  document.getElementById(id).classList.remove("filled");
  document.getElementById(id).classList.remove("incorrect");
  document.getElementById(id).classList.add("empty");
  const { row, col } = idToRowCol(id);
  if (!notesHidden) updateGrid(row, col);
}

function resetCell(id) {
  const { row, col } = idToRowCol(id);
  puzzleSudokuGrid[row][col] = 0;
  const br = row - (row % 3);
  const bc = col - (col % 3);

  for (let i = 0; i < 9; i++) {
    if (!puzzleSudokuGrid[row][i])
      notes[row][i] = getCellNotes(row, i, puzzleSudokuGrid);
    if (!puzzleSudokuGrid[i][col])
      notes[i][col] = getCellNotes(i, col, puzzleSudokuGrid);
    if (!puzzleSudokuGrid[br + Math.floor(i / 3)][bc + (i % 3)])
      notes[br + Math.floor(i / 3)][bc + (i % 3)] = getCellNotes(
        br + Math.floor(i / 3),
        bc + (i % 3),
        puzzleSudokuGrid
      );
  }
}
function undo() {
  if (moves.length) {
    id = moves.pop();
    selectCell(id);
    fillNumber(0);
  }
}

function updateGrid(r, c) {
  for (let i = 0; i < 9; i++) {
    if (!puzzleSudokuGrid[i][c]) {
      document.getElementById(i * 9 + c).innerText = notes[i][c].join(" ");
    }
    if (!puzzleSudokuGrid[r][i]) {
      document.getElementById(r * 9 + i).innerText = notes[r][i].join(" ");
    }
    let br = r - (r % 3) + Math.floor(i / 3);
    let bc = c - (c % 3) + (i % 3);
    if (!puzzleSudokuGrid[br][bc]) {
      document.getElementById(br * 9 + bc).innerText = notes[br][bc].join(" ");
    }
  }
}

function getNotes(grid) {
  let notes = [];
  for (let r = 0; r < 9; r++) {
    let rowNotes = [];
    for (let c = 0; c < 9; c++) {
      if (!grid[r][c]) {
        const cellNotes = getCellNotes(r, c, grid);
        rowNotes.push(cellNotes);
      } else {
        rowNotes.push([]);
      }
    }
    notes.push(rowNotes);
  }
  return notes;
}

function getCellNotes(r, c, grid) {
  let nums = [];
  for (let num = 1; num <= 9; num++) {
    if (
      checkRow(num, r, grid) &&
      checkCol(num, c, grid) &&
      checkBlock(num, r, c, grid)
    ) {
      nums.push(num);
    }
  }
  return nums;
}

function checkRow(num, r, grid) {
  for (let i = 0; i < 9; i++) {
    if (num == grid[r][i]) return false;
  }
  return true;
}

function checkCol(num, c, grid) {
  for (let i = 0; i < 9; i++) {
    if (num == grid[i][c]) return false;
  }
  return true;
}

function checkBlock(num, r, c, grid) {
  for (let i = 0; i < 9; i++) {
    let br = r - (r % 3) + Math.floor(i / 3);
    let bc = c - (c % 3) + (i % 3);
    if (grid[br][bc] == num) return false;
  }
  return true;
}

function findObviousSingles(notes, grid) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (notes[r][c].length == 1) {
        const num = notes[r][c][0];
        return { num, r, c };
      }
    }
  }
  return;
}

function findHiddenSingles(notes, grid) {
  const notesFreq = getNotesFreq(notes);
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      for (let num of notes[r][c]) {
        if (
          notesFreq.row[r].get(num) == 1 ||
          notesFreq.col[c].get(num) == 1 ||
          notesFreq.block[Math.floor(r / 3) * 3 + Math.floor(c / 3)].get(num) ==
            1
        ) {
          return { num, r, c };
        }
      }
    }
  }
  return;
}

function updateNotes(num, r, c, notes) {
  updateRow(num, r, notes);
  updateCol(num, c, notes);
  updateBlock(num, r, c, notes);
}

function updateRow(num, r, notes) {
  for (let i = 0; i < 9; i++) {
    let ind = notes[r][i].indexOf(num);
    if (ind != -1) {
      notes[r][i].splice(ind, 1);
    }
  }
}

function updateCol(num, c, notes) {
  for (let i = 0; i < 9; i++) {
    let ind = notes[i][c].indexOf(num);
    if (ind != -1) {
      notes[i][c].splice(ind, 1);
    }
  }
}

function updateBlock(num, r, c, notes) {
  for (let i = 0; i < 9; i++) {
    let br = r - (r % 3) + Math.floor(i / 3);
    let bc = c - (c % 3) + (i % 3);
    let ind = notes[br][bc].indexOf(num);
    if (ind != -1) {
      notes[br][bc].splice(ind, 1);
    }
  }
}

function rowColtoBlock(r, c) {
  return Math.floor(r / 3) * 3 + Math.floor(c / 3);
}

function getNotesFreq(notes) {
  let notesFreq = {
    row: [],
    col: [],
    block: [],
  };
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      let b = rowColtoBlock(r, c);
      if (!notesFreq.row[r]) notesFreq.row.push(new Map());
      if (!notesFreq.col[c]) notesFreq.col.push(new Map());
      if (!notesFreq.block[b]) notesFreq.block.push(new Map());
      for (num of notes[r][c]) {
        if (!notesFreq.row[r].has(num)) notesFreq.row[r].set(num, 0);
        notesFreq.row[r].set(num, notesFreq.row[r].get(num) + 1);
        if (!notesFreq.col[c].has(num)) notesFreq.col[c].set(num, 0);
        notesFreq.col[c].set(num, notesFreq.col[c].get(num) + 1);
        if (!notesFreq.block[b].has(num)) notesFreq.block[b].set(num, 0);
        notesFreq.block[b].set(num, notesFreq.block[b].get(num) + 1);
      }
    }
  }
  return notesFreq;
}

function printNotes(notes) {
  let r = 0;
  for (let i of notes) {
    let s = "";
    let t = 0;
    for (let j of i) {
      s += "[" + j.join(" ") + "] ";
      if (t == 2 || t == 5) s += "| ";
      t++;
    }
    console.log(s);
    if (r == 2 || r == 5) console.log("------------------------");
    r++;
  }
}

function help() {
  if (wrong != -1) {
    alert("Please clear all the wrong fills before proceeding.");
    return;
  }
  var trick = "Obvious Single";
  var hinted = findObviousSingles(notes, puzzleSudokuGrid);
  if (!hinted) {
    hinted = findHiddenSingles(notes, puzzleSudokuGrid);
    trick = "Hidden Single";
  }
  if (hinted) {
    const id = hinted.r * 9 + hinted.c;
    const num = hinted.num;
    document.getElementById(id).className = "empty hinted";
    selectCell(id);
    const hintEle = document.createElement("div");
    hintEle.id = "hint";
    const okButton = document.createElement("button");
    okButton.id = "hintBtn";
    okButton.innerText = "Fill";
    okButton.onclick = () => {
      fillNumber(num);
    };
    hintEle.innerHTML = `${trick}<br><br>The highlighted cell can be filled with ${num}!<br>`;
    hintEle.appendChild(okButton);
    document.body.appendChild(hintEle);
  } else {
    hintEle.innerText = "LMAO no hint";
  }
}

const notesbtn = document.getElementById("nid");
function toggleNotes() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (!puzzleSudokuGrid[i][j]) {
        if (notesHidden)
          document.getElementById(i * 9 + j).innerText = notes[i][j].join(" ");
        else document.getElementById(i * 9 + j).innerText = "";
      }
    }
  }
  notesHidden = !notesHidden;
}

notesbtn.addEventListener("click", function () {
  this.classList.toggle("active");
});

const myButtons = document.querySelectorAll("#keyboard button");

myButtons.forEach(function (button) {
  button.addEventListener("mousedown", function () {
    this.classList.add("active");
  });

  button.addEventListener("mouseup", function () {
    this.classList.remove("active");
  });

  button.addEventListener("mouseleave", function () {
    this.classList.remove("active");
  });
});

const textArray = [
  "Our Sudoku solver is designed to be user-friendly and intuitive.<br><br>No complicated commands or confusing menus - just click on the cell you want to fill and press the number from the keypad.<br><br> Press the NEW GAME button to generate a random puzzle set to solve each time.",
  "The NOTES Button is like a super hint button.<br><br>Toggling it will show or hide the optimal algorithmic way a computer program solves sudoku,that is each blank cell will show the number(s) in superscripted text that has/have the possibility of occurence with respect to the values in the pre-filled/non-blank cells.<br><br> The values of the NOTES also change dynamically as you input custom values.",
  "HAVE FUN SOLVING SUDOKU",
  "",
];
const textElement = document.getElementById("cardcontent");
const button = document.getElementById("nxtbtn");

let i = 0;

function changeText() {
  textElement.innerHTML = textArray[i];
  i++;
  if (i === textArray.length) {
    document.getElementById("card1").remove();
  }
}

button.addEventListener("click", changeText);

function newGame() {
  location.reload();
}
