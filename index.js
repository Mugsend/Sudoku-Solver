const inputGrid = [
  [1, 7, 8, 0, 0, 0, 4, 9, 3],
  [0, 4, 0, 0, 0, 0, 0, 0, 0],
  [0, 9, 0, 3, 4, 0, 0, 0, 0],
  [7, 8, 0, 0, 0, 0, 6, 0, 2],
  [0, 0, 0, 0, 1, 6, 8, 7, 0],
  [9, 0, 6, 0, 0, 7, 0, 0, 0],
  [0, 6, 7, 0, 0, 3, 0, 5, 4],
  [4, 0, 0, 0, 9, 0, 7, 0, 1],
  [0, 0, 0, 0, 0, 4, 2, 0, 0],
];
var wrong = false;
var select = -1;
const notes = getNotes(inputGrid);
function copyTwoDimensionalArray(arr) {
  const newArray = [];
  for (let i = 0; i < arr.length; i++) {
    newArray[i] = arr[i].slice();
  }
  return newArray;
}

var inputFilled = 0;
(function initiateGrid() {
  const grid = document.createElement("div");
  grid.id = "grid";
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
        cell.innerHTML = notes[i][j].join(" ");
        cell.onclick = function () {
          select = this.id;
        };
      }
      grid.appendChild(cell);
    }
  }
  document.body.appendChild(grid);
})();

const filledGrid = getFilledGrid(inputGrid, inputFilled);

document.addEventListener("keydown", function (event) {
  if (event.key >= "0" && event.key <= "9") {
    let n = parseInt(event.key);
    if (select != -1) {
      const i = Math.floor(select / 9);
      const j = select % 9;

      if (n) {
        document.getElementById(select).innerText = n;
        num = filledGrid[i][j];
        if (n == num) {
          inputGrid[i][j] = n;
          document.getElementById(select).className = "filled correct";
          document.getElementById(select).onclick = "";
          notes[i][j] = [];
          updateNotes(n, i, j, notes);
          updateGrid(i, j);
        } else {
          wrong = true;
          document.getElementById(select).className = "filled incorrect";
        }
      } else {
        document.getElementById(select).innerText = notes[i][j].join(" ");
        document.getElementById(select).className = "empty";
      }
      select = -1;
    }
  }
});

function updateGrid(r, c) {
  for (let i = 0; i < 9; i++) {
    if (!inputGrid[i][c])
      document.getElementById(i * 9 + c).innerText = notes[i][c].join(" ");
    if (!inputGrid[r][i])
      document.getElementById(r * 9 + i).innerText = notes[r][i].join(" ");
    let br = r - (r % 3) + Math.floor(i / 3);
    let bc = c - (c % 3) + (i % 3);
    if (!inputGrid[br][bc])
      document.getElementById(br * 9 + bc).innerText = notes[br][bc].join(" ");
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

function fill(num, r, c, notes, grid) {
  updateNotes(num, r, c, notes);
  grid[r][c] = num;
}

function obviousSingles(notes, grid) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (notes[r][c].length == 1) {
        let num = notes[r][c].pop();

        fill(num, r, c, notes, grid);
        return true;
      }
    }
  }
  return false;
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

function hiddenSingles(notes, grid) {
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
          notes[r][c] = [];
          fill(num, r, c, notes, grid);
          return true;
        }
      }
    }
  }
  return false;
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
