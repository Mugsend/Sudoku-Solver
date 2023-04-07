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

const notes = getNotes();

var filled = 0;
(function initiateGrid() {
  let grid = document.createElement("div");
  grid.id = "grid";
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let cell = document.createElement("div");
      cell.id = i * 9 + j;
      cell.onclick = function () {
        select = this.id;
      };
      if (inputGrid[i][j]) {
        filled++;
        cell.innerText = inputGrid[i][j];
      }
      grid.appendChild(cell);
    }
  }
  document.body.appendChild(grid);
})();

function getNotes() {
  let notes = [];
  for (let r = 0; r < 9; r++) {
    let rowNotes = [];
    for (let c = 0; c < 9; c++) {
      if (!inputGrid[r][c]) rowNotes.push(getCellNotes(r, c));
      else rowNotes.push([]);
    }
    notes.push(rowNotes);
  }
  return notes;
}

function getCellNotes(r, c) {
  let nums = [];
  for (let num = 1; num <= 9; num++) {
    if (checkRow(num, r) && checkCol(num, c) && checkBlock(num, r, c)) {
      nums.push(num);
    }
  }
  return nums;
}

function checkRow(num, r) {
  for (let i = 0; i < 9; i++) {
    if (num == inputGrid[r][i]) return false;
  }
  return true;
}

function checkCol(num, c) {
  for (let i = 0; i < 9; i++) {
    if (num == inputGrid[i][c]) return false;
  }
  return true;
}

function checkBlock(num, r, c) {
  for (let i = 0; i < 9; i++) {
    let br = r - (r % 3) + Math.floor(i / 3);
    let bc = c - (c % 3) + (i % 3);
    if (inputGrid[br][bc] == num) return false;
  }
  return true;
}

function fill(num, r, c) {
  updateNotes(num, r, c);
  document.getElementById(r * 9 + c).innerHTML = num;
  inputGrid[r][c] = num;
  filled++;
}

function obviousSingles() {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (notes[r][c].length == 1) {
        let num = notes[r][c].pop();
        fill(num, r, c);
        return true;
      }
    }
  }
  return false;
}

function updateNotes(num, r, c) {
  console.log(num, r, c);
  updateRow(num, r);
  updateCol(num, c);
  updateBlock(num, r, c);
}

function updateRow(num, r) {
  for (let i = 0; i < 9; i++) {
    let ind = notes[r][i].indexOf(num);
    if (ind != -1) notes[r][i].splice(ind, 1);
  }
}

function updateCol(num, c) {
  for (let i = 0; i < 9; i++) {
    let ind = notes[i][c].indexOf(num);
    if (ind != -1) notes[i][c].splice(ind, 1);
  }
}

function updateBlock(num, r, c) {
  for (let i = 0; i < 9; i++) {
    let br = r - (r % 3) + Math.floor(i / 3);
    let bc = c - (c % 3) + (i % 3);
    let ind = notes[br][bc].indexOf(num);
    if (ind != -1) notes[br][bc].splice(ind, 1);
  }
}

function rowColtoBlock(r, c) {
  return Math.floor(r / 3) * 3 + Math.floor(c / 3);
}

function getNotesFreq() {
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

function hiddenSingles() {
  let notesFreq = getNotesFreq();
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
          fill(num, r, c);
          return true;
        }
      }
    }
  }
  return false;
}

function printNotes() {
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

function solve() {
  while (filled != 81) {
    if (!obviousSingles()) hiddenSingles();
  }
}
