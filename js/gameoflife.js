function seed() {
  return Array.prototype.slice.call(arguments);
}

function same([x, y], [j, k]) {
  if (x === j && y === k) {
    return true;
  }
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  //let isPresent = false;
  //this.forEach((el) => {
    //if (same([...cell], [...el])) {
      //isPresent = true;
    //}
  //});
  //return isPresent;
  return this.some((c) => same(c, cell));
}

const printCell = (cell, state) => {
  if (contains.call(state, cell)) {
    return "\u25A3";
  }
  return "\u25A2";
};

const corners = (state = []) => {
  const arr = [...state];
  let topRightCoords = [0, 0];
  let bottomLeftCoords = [0, 0];
  if (arr.length === 0) {
    return { topRight: topRightCoords, bottomLeft: bottomLeftCoords };
  }
  let x = arr.map(([x, _]) => x);
  let y = arr.map(([_, y]) => y);
  topRightCoords = [Math.max(...x), Math.max(...y)];
  bottomLeftCoords = [Math.min(...x), Math.min(...y)];
  return { topRight: topRightCoords, bottomLeft: bottomLeftCoords };
};

const printCells = (state) => {
  const { bottomLeft, topRight } = corners(state);
  let accumulator = "";
  for (let y = topRight[1]; y >= bottomLeft[1]; y--) {
    let row = [];
    for (let x = bottomLeft[0]; x <= topRight[0]; x++) {
      row.push(printCell([x, y], state));
    }
    accumulator += row.join(" ") + "\n";
  }
  return accumulator;
};

const getNeighborsOf = ([x, y]) => 
  [[x - 1, y - 1],
  [x, y - 1],
  [x + 1, y - 1],
  [x - 1, y],
  [x + 1, y],
  [x - 1, y + 1],
  [x, y + 1],
  [x + 1, y + 1]];

const getLivingNeighbors = (cell, state) => {
  let neighbors = getNeighborsOf(cell);
  let livingNeighbors = [];
  neighbors.forEach((el) => {
    if (contains.bind(state)(el)) {
      livingNeighbors.push(el)
    }
  });
  return livingNeighbors;
 };

const willBeAlive = (cell, state) => { 
  const livingNeighbors = getLivingNeighbors(cell, state);
  if (livingNeighbors.length == 3 || (livingNeighbors.length == 2 && contains.call(state, cell))) {
    return true;
  }
  return false;
};

const calculateNext = (state) => {
  const { topRight, bottomLeft } = corners(state);
  let arr = [];
  // Rows
  for (let i = bottomLeft[1] - 1; i <= topRight[1] + 1; i++) {
    // Columns
    for (let j = bottomLeft[0] - 1; j <= topRight[0] + 1; j++) {
      if (willBeAlive([j, i], state)) {
        arr.push([j, i]);
      }
    }
  }
  return arr;
 };

const iterate = (state, iterations) => {
  let states = [state];
  for (let i = 0; i < iterations; i++) {
    states.push(calculateNext(states[i]));
  }
  return states;
 };

const main = (pattern, iterations) => {
  iterate(startPatterns[pattern], iterations).forEach((el) => console.log(printCells(el)));
};

const startPatterns = {
  rpentomino: [
    [3, 2],
    [2, 3],
    [3, 3],
    [3, 4],
    [4, 4]
  ],
  glider: [
    [-2, -2],
    [-1, -2],
    [-2, -1],
    [-1, -1],
    [1, 1],
    [2, 1],
    [3, 1],
    [3, 2],
    [2, 3]
  ],
  square: [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2]
  ]
};

const [pattern, iterations] = process.argv.slice(2);
const runAsScript = require.main === module;

if (runAsScript) {
  if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
    main(pattern, parseInt(iterations));
  } else {
    console.log("Usage: node js/gameoflife.js rpentomino 50");
  }
}

exports.seed = seed;
exports.same = same;
exports.contains = contains;
exports.getNeighborsOf = getNeighborsOf;
exports.getLivingNeighbors = getLivingNeighbors;
exports.willBeAlive = willBeAlive;
exports.corners = corners;
exports.calculateNext = calculateNext;
exports.printCell = printCell;
exports.printCells = printCells;
exports.startPatterns = startPatterns;
exports.iterate = iterate;
exports.main = main;