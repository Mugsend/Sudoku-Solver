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

console.log(randomGrid());
