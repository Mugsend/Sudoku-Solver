var g = [
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
const blockFillables = Array.from(Array(9).keys(), (i) =>
  Array.from(Array(9).keys(), (j) => j + 1)
);

const notes = [];

var filled = 0;
var select = -1;
function initiateGrid() {
  let grid = document.createElement("div");
  grid.id = "grid";
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let cell = document.createElement("div");
      cell.id = i * 9 + j;
      cell.onclick = function () {
        select = this.id;
      };
      if (g[i][j]) {
        filled++;
        cell.innerText = g[i][j];
      }
      grid.appendChild(cell);
    }
  }
  document.body.appendChild(grid);
}

function getNotes() {
  getBlockFillables();
  for (let i = 0; i < g.length; i++) {
    let rowNotes = [];
    for (let j = 0; j < g[0].length; j++) {
      let fillables = [];
      if (!g[i][j]) {
        for (let n of blockFillables[
          Math.floor(i / 3) * 3 + Math.floor(j / 3)
        ]) {
          if (checkRow(i, n) && checkCol(j, n)) {
            fillables.push(n);
          }
        }
      }
      rowNotes.push(fillables);
    }
    notes.push(rowNotes);
  }
}

function checkRow(i, n) {
  for (let c = 0; c < g[0].length; c++) {
    if (n == g[i][c]) {
      return false;
    }
  }
  return true;
}

function checkCol(j, n) {
  for (let r = 0; r < g.length; r++) {
    if (n == g[r][j]) {
      return false;
    }
  }
  return true;
}

function getBlockFillables() {
  for (let i = 0; i < g.length; i++) {
    for (let j = 0; j < g[0].length; j++) {
      let n = g[i][j];
      if (n) {
        let block = Math.floor(i / 3) * 3 + Math.floor(j / 3);
        let ind = blockFillables[block].indexOf(n);
        blockFillables[block].splice(ind, 1);
      }
    }
  }
}

function solve() {
  getNotes();
  while (filled < 9 * 9) {
    if (!Obv(1)) eliminateHiddenSingle();
  }
}
initiateGrid();

document.addEventListener("keydown", function (event) {
  if (event.key >= "0" && event.key <= "9") {
    let n = parseInt(event.key);
    if (select != -1) {
      num = g[Math.floor(select / 9)][select % 9];
      g[Math.floor(select / 9)][select % 9] = n;
      if (n) {
        document.getElementById(select).innerText = n;
        if (!num && n) filled++;
      } else {
        document.getElementById(select).innerText = "";
        if (num && !n) filled--;
      }
      select = -1;
    }
  }
});

function ObvRow(n, i, j) {
  let arr = [j];
  for (let c = 0; c < 9; c++) {
    if (c != j && notes[i][c].length == n) {
      if (
        notes[i][c].every((num, k) => {
          return num == notes[i][j][k];
        })
      ) {
        arr.push(c);
      }
    }
  }
  return arr;
}

function ObvCol(n, i, j) {
  let arr = [i];
  for (let r = 0; r < 9; r++) {
    if (r != i && notes[r][j].length == n) {
      if (
        notes[r][j].every((num, k) => {
          return num == notes[i][j][k];
        })
      ) {
        arr.push(r);
      }
    }
  }
  return arr;
}

function ObvBlock(n, i, j) {
  let arr = [[i, j]];
  for (let br = i - (i % 3); br < i - (i % 3) + 3; br++) {
    for (let bc = j - (j % 3); bc < j - (j % 3) + 3; bc++) {
      if (br != i && bc != j && notes[br][bc].length == n) {
        if (
          notes[br][bc].every((num, k) => {
            return num == notes[i][j][k];
          })
        ) {
          arr.push([br, bc]);
        }
      }
    }
  }
  return arr;
}

function rowColtoBlock(i, j) {
  return Math.floor(i / 3) * 3 + Math.floor(j / 3);
}

function Obv(n) {
  let found = false;
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (notes[i][j].length == n) {
        if (n == 1) {
          found = true;
          rowUpdate(i, j, [j]);
          colUpdate(i, j, [i]);
          blockUpdate(i, j, [[i, j]]);
          let num = notes[i][j].pop();
          g[i][j] = num;
          filled++;
          updateGrid(num, i, j);
        } else {
          let arr = ObvBlock(n, i, j);
          if (arr.length == n) {
            blockUpdate(i, j, arr);
            found = true;
          }
          arr = ObvRow(n, i, j);
          if (arr.length == n) {
            rowUpdate(i, j, arr);
            found = true;
          }
          arr = ObvCol(n, i, j);
          if (arr.length == n) {
            colUpdate(i, j, arr);
            found = true;
          }
        }
      }
    }
  }
  return found;
}

function rowUpdate(i, j, arr) {
  console.log("row", i, arr);
  let nums = notes[i][j];
  for (let col = 0; col < 9; col++) {
    if (!arr.includes(col)) {
      for (let num of nums) {
        let ind = notes[i][col].indexOf(num);
        if (ind != -1) {
          notes[i][col].splice(ind, 1);
        }
      }
    }
  }
}

function colUpdate(i, j, arr) {
  console.log("col", j, arr);
  let nums = notes[i][j];
  for (let row = 0; row < 9; row++) {
    if (!arr.includes(row)) {
      for (let num of nums) {
        let ind = notes[row][j].indexOf(num);
        if (ind != -1) {
          notes[row][j].splice(ind, 1);
        }
      }
    }
  }
}

function blockUpdate(i, j, arr) {
  console.log("block", rowColtoBlock(i, j), arr);
  for (let br = i - (i % 3); br < i - (i % 3) + 3; br++) {
    for (let bc = j - (j % 3); bc < j - (j % 3) + 3; bc++) {
      if (!arr.some((nums) => nums[0] == br && nums[1] == bc)) {
        for (let num of notes[i][j]) {
          let ind = notes[br][bc].indexOf(num);
          if (ind != -1) {
            notes[br][bc].splice(ind, 1);
          }
        }
      }
    }
  }
}
function eliminateHiddenSingle() {
  for (let i = 0; i < notes.length; i++) {
    for (let j = 0; j < notes[0].length; j++) {
      for (let num of notes[i][j]) {
        let unique = true;
        for (let r = 0; r < notes.length; r++) {
          if (r != i) {
            if (notes[r][j].indexOf(num) != -1) {
              unique = false;
              break;
            }
          }
        }
        if (unique) {
          notes[i][j] = [num];
          return;
        }
        unique = true;
        for (let c = 0; c < notes[0].length; c++) {
          if (c != j) {
            if (notes[i][c].indexOf(num) != -1) {
              unique = false;
              break;
            }
          }
        }
        if (unique) {
          notes[i][j] = [num];
          return;
        }
        unique = true;
        outerloop: for (let br = i - (i % 3); br < i - (i % 3) + 3; br++) {
          for (let bc = j - (j % 3); bc < j - (j % 3) + 3; bc++) {
            if (br != i || bc != j) {
              if (notes[br][bc].indexOf(num) != -1) {
                unique = false;
                break outerloop;
              }
            }
          }
        }
        if (unique) {
          notes[i][j] = [num];
          return;
        }
      }
    }
  }
}

function eliminateHiddenPairs() {
  for (let i = 0; i < 9; i++) {
    const rowValues = new Set();
    const colValues = new Set();
    const boxValues = new Set();

    for (let j = 0; j < 9; j++) {
      const cellNotes = notes[i][j];
      if (cellNotes.size === n) {
        const otherCells = notes[i].filter((notes, index) => index !== j);
        const matchingCells = otherCells.filter((notes) =>
          areEqual(notes, cellNotes)
        );
        if (matchingCells.length === 1) {
          const [a, b] = Array.from(cellNotes);
          eliminateValueFromRow(puzzle, notes, i, a, j);
          eliminateValueFromRow(puzzle, notes, i, b, j);
        }
      }
    }

    for (let j = 0; j < 9; j++) {
      const cellNotes = notes[j][i];
      if (cellNotes.size === 2) {
        const otherCells = notes
          .map((row) => row[i])
          .filter((notes, index) => index !== j);
        const matchingCells = otherCells.filter((notes) =>
          areEqual(notes, cellNotes)
        );
        if (matchingCells.length === 1) {
          const [a, b] = Array.from(cellNotes);
          eliminateValueFromColumn(puzzle, notes, i, a, j);
          eliminateValueFromColumn(puzzle, notes, i, b, j);
        }
      }
    }

    const boxRow = Math.floor(i / 3) * 3;
    const boxCol = (i % 3) * 3;
    for (let j = 0; j < 9; j++) {
      const row = boxRow + Math.floor(j / 3);
      const col = boxCol + (j % 3);
      const cellNotes = notes[row][col];
      if (cellNotes.size === 2) {
        const otherCells = [];
        for (let k = 0; k < 9; k++) {
          const r = boxRow + Math.floor(k / 3);
          const c = boxCol + (k % 3);
          if (r !== row || c !== col) {
            otherCells.push(notes[r][c]);
          }
        }
        const matchingCells = otherCells.filter((notes) =>
          areEqual(notes, cellNotes)
        );
        if (matchingCells.length === 1) {
          const [a, b] = Array.from(cellNotes);
          eliminateValueFromBox(puzzle, notes, boxRow, boxCol, a, row, col);
          eliminateValueFromBox(puzzle, notes, boxRow, boxCol, b, row, col);
        }
      }
    }
  }
}

function areEqual(set1, set2) {
  return (
    set1.size === 2 &&
    set2.size === 2 &&
    Array.from(set1).every((value) => set2.has(value))
  );
}

function eliminateValueFromRow(row, value, excludeCol) {
  for (let j = 0; j < 9; j++) {
    if (j !== excludeCol && notes[row][j].has(value)) {
      notes[row][j].delete(value);
      if (notes[row][j].size === 1) {
        const [newValue] = Array.from(notes[row][j]);
        g[row][j] = newValue;
      }
    }
  }
}

function eliminateValueFromColumn(col, value, excludeRow) {
  for (let j = 0; j < 9; j++) {
    if (j !== excludeRow && notes[j][col].has(value)) {
      notes[j][col].delete(value);
      if (notes[j][col].size === 1) {
        const [newValue] = Array.from(notes[j][col]);
        g[j][col] = newValue;
      }
    }
  }
}

function eliminateValueFromBox(boxRow, boxCol, value, excludeRow, excludeCol) {
  for (let j = 0; j < 9; j++) {
    const row = boxRow + Math.floor(j / 3);
    const col = boxCol + (j % 3);
    if (
      row !== excludeRow &&
      col !== excludeCol &&
      notes[row][col].has(value)
    ) {
      notes[row][col].delete(value);
      if (notes[row][col].size === 1) {
        const [newValue] = Array.from(notes[row][col]);
        g[row][col] = newValue;
        updateGrid(newValue, row, col);
      }
    }
  }
}

function hiddenTriples() {}

function pointingPairs() {}

function pointingTriples() {}

function xWing() {}

function yWing() {}

function swordFish() {}

function updateGrid(num, i, j) {
  document.getElementById(i * 9 + j).innerHTML = num;
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
