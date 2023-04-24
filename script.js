const inputGrid = randomGrid();
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

var notesHidden = true;
const wrong = new Set();
var selectedCellId = -1;
const notes = getNotes(inputGrid);
function copyTwoDimensionalArray(arr) {
  const newArray = [];
  for (let i = 0; i < arr.length; i++) {
    newArray[i] = arr[i].slice();
  }
  return newArray;
}

(function keyboard() {
  const keyboard = document.getElementById("keyboard");
  for (let i = 1; i <= 10; i++) {
    const button = document.createElement("button");
    if (i == 10) {
      button.innerText = "Delete";
      button.onclick = () => deleteNum();
    } else {
      button.innerText = i;
      button.onclick = () => fillNumber(i);
    }
    keyboard.appendChild(button);
  }
})();

var inputFilled = 0;
(function initiateGrid() {
  const grid = document.getElementById("grid");
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement("div");
      cell.id = i * 9 + j;
      if (inputGrid[i][j]) {
        inputFilled++;
        cell.innerText = inputGrid[i][j];
        cell.className = "filled";
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

function selectCell(id) {
  selectedCellId = id;
  const selected = document.getElementsByClassName("selected");
  for (let i = 0; i < selected.length; i++) {
    if (selected[i].className == "filled incorrect selected")
      selected[i].className = "filled incorrect";
    else selected[i].className = "empty";
  }
  if (document.getElementById(id).className == "filled incorrect")
    document.getElementById(id).className = "filled incorrect selected";
  else document.getElementById(id).className = "empty selected";
}
const filledGrid = getFilledGrid(inputGrid, inputFilled);

document.addEventListener("keydown", function (event) {
  if (event.key >= "0" && event.key <= "9") {
    let n = parseInt(event.key);
    fillNumber(n);
  }
});

function fillNumber(n) {
  if (selectedCellId != -1) {
    const i = Math.floor(selectedCellId / 9);
    const j = selectedCellId % 9;
    if (n) {
      if (n == inputGrid[i][j]) {
        deleteNum();
        return;
      }
      document.getElementById(selectedCellId).innerText = n;
      inputGrid[i][j] = n;
      num = filledGrid[i][j];
      if (n == num) {
        wrong.delete(selectedCellId);
        inputFilled++;
        document.getElementById(selectedCellId).className = "filled correct";
        document.getElementById(selectedCellId).onclick = "";
        notes[i][j] = [];
        updateNotes(n, i, j, notes);
        if (!notesHidden) updateGrid(i, j);
        if (inputFilled == 81) help();
      } else {
        document.getElementById(selectedCellId).className = "filled incorrect";
        wrong.add(selectedCellId);
      }
    } else {
      deleteNum();
    }
    selectedCellId = -1;
  }
}

function deleteNum() {
  if (selectedCellId == -1) return;
  const i = Math.floor(selectedCellId / 9);
  const j = selectedCellId % 9;
  wrong.delete(selectedCellId);
  document.getElementById(selectedCellId).className = "empty";
  inputGrid[i][j] = 0;
  if (!notesHidden)
    document.getElementById(selectedCellId).innerHTML = notes[i][j].join(" ");
  else document.getElementById(selectedCellId).innerHTML = "";
}

function updateGrid(r, c) {
  for (let i = 0; i < 9; i++) {
    if (!inputGrid[i][c]) {
      document.getElementById(i * 9 + c).innerText = notes[i][c].join(" ");
    }
    if (!inputGrid[r][i]) {
      document.getElementById(r * 9 + i).innerText = notes[r][i].join(" ");
    }
    let br = r - (r % 3) + Math.floor(i / 3);
    let bc = c - (c % 3) + (i % 3);
    if (!inputGrid[br][bc]) {
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

function fill(num, r, c, notes, grid) {
  notes[r][c] = [];
  updateNotes(num, r, c, notes);
  grid[r][c] = num;
}

function obviousSingles(notes, grid) {
  const params = findObviousSingles(notes, grid);
  if (params) {
    fill(params.num, params.r, params.c, notes, grid);
    return true;
  } else return false;
}

function hiddenSingles(notes, grid) {
  const params = findHiddenSingles(notes, grid);
  if (params) {
    fill(params.num, params.r, params.c, notes, grid);
    return true;
  } else return false;
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

function getFilledGrid(inputGrid, inputfilled) {
  const grid = copyTwoDimensionalArray(inputGrid);
  const notes = getNotes(grid);
  var filled = inputfilled;
  while (filled != 81) {
    if (!obviousSingles(notes, grid)) hiddenSingles(notes, grid);
    filled++;
  }
  return grid;
}

function help() {
  if (wrong.size) {
    alert("Please clear all the wrong fills before proceeding.");
    return;
  }
  if (inputFilled == 81) {
    document.getElementById("hint").innerText =
      "Congratulations we have solved the puzzle!!";
    showCat();
    return;
  }
  var trick = "Obvious Single";
  var hinted = findObviousSingles(notes, inputGrid);
  if (!hinted) {
    hinted = findHiddenSingles(notes, inputGrid);
    trick = "Hidden Single";
  }
  document.getElementById(hinted.r * 9 + hinted.c).className = "hinted";
  document.getElementById(
    "hint"
  ).innerText = `${trick} at the highlighted cell and it can be filled with ${hinted.num}!`;
}

function showCat() {
  document.getElementById("cat").hidden = false;
  const audio = document.getElementById("sound");
  audio.play();
  audio.loop = true;
}
const notesbtn = document.getElementById("nid");
function toggleNotes() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (!inputGrid[i][j]) {
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

function newGame() {
  location.reload();
}
