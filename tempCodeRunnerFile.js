function lastFreeCell(grid) {
  for (let r = 0; r < 9; r++) {
    const rowNums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const colNums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const blockNums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let c = 0; c < 9; c++) {
      if (grid[r][c]) nums.splice(rowNums.indexOf(grid[r][c]), 1);
      if (grid[c][r]) nums.splice(colNums.indexOf(grid[r][c]), 1);

      let br = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      let bc = (r % 3) * 3 + (c % 3);
      if (grid[br][bc]) nums.splice(gridNums.indexOf(grid[r][c]), 1);

      if (c == 9) {
        if (rowNums.length == 1) return { num: rowNums.pop(), row: r, col: c };
        if (colNums.length == 1) return { num: colNums.pop(), row: c, col: r };
        if (blockNums.length == 1)
          return { num: blockNums.pop(), row: br, col: bc };
      }
    }
    if (rowNums.length == 1) return { r, c };
  }
}
lastFreeCell();
