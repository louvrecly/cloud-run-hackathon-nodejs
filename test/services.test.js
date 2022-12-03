import { describe, test, expect, assertType } from 'vitest';
import {
  compareDirections,
  createEmptyArena,
  scanArena,
  checkIndexInRange,
  getDimAndIndex,
  getMultiplier,
  getForwardState,
  getThreatLevel,
  evaluateOverallThreat,
  scanSurroundings,
  checkEnemyInRange,
  hasEnemy,
  hasWall,
  escape,
  hunt,
  decideAction
} from '../server/services';

describe('compareDirections should correctly compare 2 directions', () => {
  test('compareDirections should return 0 for E against E', () => {
    const directionA = 'E';
    const directionB = 'E';
    const compareValue = compareDirections(directionA, directionB);
    assertType<Number>(compareValue);
    expect(compareValue).toEqual(0);
  });

  test('compareDirections should return 0 for S against S', () => {
    const directionA = 'S';
    const directionB = 'S';
    const compareValue = compareDirections(directionA, directionB);
    assertType<Number>(compareValue);
    expect(compareValue).toEqual(0);
  });

  test('compareDirections should return 0 for W against W', () => {
    const directionA = 'W';
    const directionB = 'W';
    const compareValue = compareDirections(directionA, directionB);
    assertType<Number>(compareValue);
    expect(compareValue).toEqual(0);
  });

  test('compareDirections should return 0 for N against N', () => {
    const directionA = 'N';
    const directionB = 'N';
    const compareValue = compareDirections(directionA, directionB);
    assertType<Number>(compareValue);
    expect(compareValue).toEqual(0);
  });

  test('compareDirections should return 90 for S against E', () => {
    const directionA = 'S';
    const directionB = 'E';
    const compareValue = compareDirections(directionA, directionB);
    assertType<Number>(compareValue);
    expect(compareValue).toEqual(90);
  });

  test('compareDirections should return 90 for W against S', () => {
    const directionA = 'W';
    const directionB = 'S';
    const compareValue = compareDirections(directionA, directionB);
    assertType<Number>(compareValue);
    expect(compareValue).toEqual(90);
  });

  test('compareDirections should return 180 for W against E', () => {
    const directionA = 'W';
    const directionB = 'E';
    const compareValue = compareDirections(directionA, directionB);
    assertType<Number>(compareValue);
    expect(compareValue).toEqual(180);
  });

  test('compareDirections should return 270 for W against N', () => {
    const directionA = 'W';
    const directionB = 'N';
    const compareValue = compareDirections(directionA, directionB);
    assertType<Number>(compareValue);
    expect(compareValue).toEqual(270);
  });

  test('compareDirections should return -270 for N against W', () => {
    const directionA = 'N';
    const directionB = 'W';
    const compareValue = compareDirections(directionA, directionB);
    assertType<Number>(compareValue);
    expect(compareValue).toEqual(-270);
  });

  test('compareDirections should return -180 for N against S', () => {
    const directionA = 'N';
    const directionB = 'S';
    const compareValue = compareDirections(directionA, directionB);
    assertType<Number>(compareValue);
    expect(compareValue).toEqual(-180);
  });

  test('compareDirections should return -180 for E against W', () => {
    const directionA = 'E';
    const directionB = 'W';
    const compareValue = compareDirections(directionA, directionB);
    assertType<Number>(compareValue);
    expect(compareValue).toEqual(-180);
  });

  test('compareDirections should return -90 for E against S', () => {
    const directionA = 'E';
    const directionB = 'S';
    const compareValue = compareDirections(directionA, directionB);
    assertType<Number>(compareValue);
    expect(compareValue).toEqual(-90);
  });

  test('compareDirections should return -90 for N against E', () => {
    const directionA = 'N';
    const directionB = 'E';
    const compareValue = compareDirections(directionA, directionB);
    assertType<Number>(compareValue);
    expect(compareValue).toEqual(-90);
  });
});

describe('createEmptyArena should create an empty arena', () => {
  test('createEmptyArena should create an empty arena with correct number of rows and number of columns', () => {
    const dims = new Array(2).fill(10).map(x => Math.ceil(Math.random() * x));
    const arena = createEmptyArena(dims[1], dims[0]);
    assertType<Array>(arena);
    assertType<Array>(arena[0]);
    expect(arena.length).toEqual(dims[1]);
    expect(arena[0].length).toEqual(dims[0]);
    arena.forEach(row => {
      row.forEach(col => {
        expect(col).toBeNull();
      });
    });
  });
});

describe('scanArena should scan the arena', () => {
  test('scanArena should correctly scan the arena and identify the location of the only enemy bot', () => {
    const dims = [4, 3];
    const state = {
      BASE_URL: {
        x: 0,
        y: 0,
        direction: 'E',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 3,
        y: 0,
        direction: 'N',
        wasHit: false,
        score: 0
      }
    };
    const arena = scanArena(dims, state);
    assertType<Array>(arena);
    assertType<Array>(arena[0]);
    expect(arena.length).toEqual(dims[1]);
    expect(arena[0].length).toEqual(dims[0]);
    assertType<Object>(arena[0][0]);
    expect(arena[0][0]).not.toBeNull();
    assertType<Object>(arena[0][3]);
    expect(arena[0][3]).not.toBeNull();
    expect(arena[0][1]).toBeNull();
  });

  test('scanArena should correctly scan the arena and identify the locations of all bots', () => {
    const dims = [6, 5];
    const state = {
      BASE_URL: {
        x: 4,
        y: 1,
        direction: 'E',
        wasHit: true,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 0,
        y: 1,
        direction: 'E',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL_1: {
        x: 5,
        y: 1,
        direction: 'W',
        wasHit: false,
        score: 0
      }
    };
    const arena = scanArena(dims, state);
    console.log({ arena });
    assertType<Array>(arena);
    assertType<Array>(arena[0]);
    expect(arena.length).toEqual(dims[1]);
    expect(arena[0].length).toEqual(dims[0]);
    assertType<Object>(arena[1][4]);
    expect(arena[1][4]).not.toBeNull();
    assertType<Object>(arena[1][0]);
    expect(arena[1][0]).not.toBeNull();
    assertType<Object>(arena[1][5]);
    expect(arena[1][5]).not.toBeNull();
    expect(arena[0][0]).toBeNull();
  });
});

describe('checkIndexInRange should correctly check if the index provided is within range', () => {
  test('checkIndexInRange should correctly return a boolean to indicate the provided index is in range', () => {
    const dims = [4, 3];
    assertType<Boolean>(checkIndexInRange(0, dims[0]));
    expect(checkIndexInRange(0, dims[0])).toBeTruthy();
    assertType<Boolean>(checkIndexInRange(0, dims[1]));
    expect(checkIndexInRange(0, dims[1])).toBeTruthy();
    assertType<Boolean>(checkIndexInRange(4, dims[0]));
    expect(checkIndexInRange(4, dims[0])).toBeFalsy();
    assertType<Boolean>(checkIndexInRange(4, dims[1]));
    expect(checkIndexInRange(4, dims[1])).toBeFalsy();
    assertType<Boolean>(checkIndexInRange(3, dims[0]));
    expect(checkIndexInRange(3, dims[0])).toBeTruthy();
    assertType<Boolean>(checkIndexInRange(3, dims[1]));
    expect(checkIndexInRange(3, dims[1])).toBeFalsy();
    assertType<Boolean>(checkIndexInRange(-1, dims[0]));
    expect(checkIndexInRange(-1, dims[0])).toBeFalsy();
    assertType<Boolean>(checkIndexInRange(-1, dims[1]));
    expect(checkIndexInRange(-1, dims[1])).toBeFalsy();
  });
});

describe('getDimAndIndex should return the correct dimension axis and the index from the absolute and relative directions provided', () => {
  test('getDimAndIndex should return x dimension and 0 index for E and front', () => {
    const direction = 'E';
    const relativeDirection = 'front';
    const dimAndIndex = getDimAndIndex(direction, relativeDirection);
    assertType<Object>(dimAndIndex);
    expect(dimAndIndex).toHaveProperty('dim');
    assertType<String>(dimAndIndex.dim);
    expect(dimAndIndex).toHaveProperty('index');
    assertType<Number>(dimAndIndex.index);
    expect(dimAndIndex.dim).toEqual('x');
    expect(dimAndIndex.index).toEqual(0);
  });

  test('getDimAndIndex should return y dimension and 1 index for S and front', () => {
    const direction = 'S';
    const relativeDirection = 'front';
    const dimAndIndex = getDimAndIndex(direction, relativeDirection);
    assertType<Object>(dimAndIndex);
    expect(dimAndIndex).toHaveProperty('dim');
    assertType<String>(dimAndIndex.dim);
    expect(dimAndIndex).toHaveProperty('index');
    assertType<Number>(dimAndIndex.index);
    expect(dimAndIndex.dim).toEqual('y');
    expect(dimAndIndex.index).toEqual(1);
  });

  test('getDimAndIndex should return x dimension and 0 index for W and back', () => {
    const direction = 'W';
    const relativeDirection = 'back';
    const dimAndIndex = getDimAndIndex(direction, relativeDirection);
    assertType<Object>(dimAndIndex);
    expect(dimAndIndex).toHaveProperty('dim');
    assertType<String>(dimAndIndex.dim);
    expect(dimAndIndex).toHaveProperty('index');
    assertType<Number>(dimAndIndex.index);
    expect(dimAndIndex.dim).toEqual('x');
    expect(dimAndIndex.index).toEqual(0);
  });

  test('getDimAndIndex should return y dimension and 1 index for N and back', () => {
    const direction = 'N';
    const relativeDirection = 'back';
    const dimAndIndex = getDimAndIndex(direction, relativeDirection);
    assertType<Object>(dimAndIndex);
    expect(dimAndIndex).toHaveProperty('dim');
    assertType<String>(dimAndIndex.dim);
    expect(dimAndIndex).toHaveProperty('index');
    assertType<Number>(dimAndIndex.index);
    expect(dimAndIndex.dim).toEqual('y');
    expect(dimAndIndex.index).toEqual(1);
  });

  test('getDimAndIndex should return y dimension and 1 index for E and left', () => {
    const direction = 'E';
    const relativeDirection = 'left';
    const dimAndIndex = getDimAndIndex(direction, relativeDirection);
    assertType<Object>(dimAndIndex);
    expect(dimAndIndex).toHaveProperty('dim');
    assertType<String>(dimAndIndex.dim);
    expect(dimAndIndex).toHaveProperty('index');
    assertType<Number>(dimAndIndex.index);
    expect(dimAndIndex.dim).toEqual('y');
    expect(dimAndIndex.index).toEqual(1);
  });

  test('getDimAndIndex should return x dimension and 0 index for S and right', () => {
    const direction = 'S';
    const relativeDirection = 'right';
    const dimAndIndex = getDimAndIndex(direction, relativeDirection);
    assertType<Object>(dimAndIndex);
    expect(dimAndIndex).toHaveProperty('dim');
    assertType<String>(dimAndIndex.dim);
    expect(dimAndIndex).toHaveProperty('index');
    assertType<Number>(dimAndIndex.index);
    expect(dimAndIndex.dim).toEqual('x');
    expect(dimAndIndex.index).toEqual(0);
  });

  test('getDimAndIndex should return y dimension and 1 index for W and right', () => {
    const direction = 'W';
    const relativeDirection = 'right';
    const dimAndIndex = getDimAndIndex(direction, relativeDirection);
    assertType<Object>(dimAndIndex);
    expect(dimAndIndex).toHaveProperty('dim');
    assertType<String>(dimAndIndex.dim);
    expect(dimAndIndex).toHaveProperty('index');
    assertType<Number>(dimAndIndex.index);
    expect(dimAndIndex.dim).toEqual('y');
    expect(dimAndIndex.index).toEqual(1);
  });

  test('getDimAndIndex should return x dimension and 0 index for N and left', () => {
    const direction = 'N';
    const relativeDirection = 'left';
    const dimAndIndex = getDimAndIndex(direction, relativeDirection);
    assertType<Object>(dimAndIndex);
    expect(dimAndIndex).toHaveProperty('dim');
    assertType<String>(dimAndIndex.dim);
    expect(dimAndIndex).toHaveProperty('index');
    assertType<Number>(dimAndIndex.index);
    expect(dimAndIndex.dim).toEqual('x');
    expect(dimAndIndex.index).toEqual(0);
  });
});

describe('getMultiplier should return the correct multiplier of either 1 or -1 from the absolute and relative directions provided', () => {
  test('getMultiplier should return 1 as multiplier value for E and front', () => {
    const direction = 'E';
    const relativeDirection = 'front';
    const multiplier = getMultiplier(direction, relativeDirection);
    assertType<Number>(multiplier);
    expect(multiplier).toEqual(1);
  });

  test('getMultiplier should return -1 as multiplier value for S and back', () => {
    const direction = 'S';
    const relativeDirection = 'back';
    const multiplier = getMultiplier(direction, relativeDirection);
    assertType<Number>(multiplier);
    expect(multiplier).toEqual(-1);
  });

  test('getMultiplier should return -1 as multiplier value for W and front', () => {
    const direction = 'W';
    const relativeDirection = 'front';
    const multiplier = getMultiplier(direction, relativeDirection);
    assertType<Number>(multiplier);
    expect(multiplier).toEqual(-1);
  });

  test('getMultiplier should return 1 as multiplier value for N and back', () => {
    const direction = 'N';
    const relativeDirection = 'back';
    const multiplier = getMultiplier(direction, relativeDirection);
    assertType<Number>(multiplier);
    expect(multiplier).toEqual(1);
  });

  test('getMultiplier should return -1 as multiplier value for E and left', () => {
    const direction = 'E';
    const relativeDirection = 'left';
    const multiplier = getMultiplier(direction, relativeDirection);
    assertType<Number>(multiplier);
    expect(multiplier).toEqual(-1);
  });

  test('getMultiplier should return 1 as multiplier value for S and left', () => {
    const direction = 'S';
    const relativeDirection = 'left';
    const multiplier = getMultiplier(direction, relativeDirection);
    assertType<Number>(multiplier);
    expect(multiplier).toEqual(1);
  });

  test('getMultiplier should return -1 as multiplier value for W and right', () => {
    const direction = 'W';
    const relativeDirection = 'right';
    const multiplier = getMultiplier(direction, relativeDirection);
    assertType<Number>(multiplier);
    expect(multiplier).toEqual(-1);
  });

  test('getMultiplier should return 1 as multiplier value for N and right', () => {
    const direction = 'N';
    const relativeDirection = 'right';
    const multiplier = getMultiplier(direction, relativeDirection);
    assertType<Number>(multiplier);
    expect(multiplier).toEqual(1);
  });
});

describe('getForwardState should return a state with the correct coordinates and direction', () => {
  test('getForwardState should return a state at (1, 0) towards E', () => {
    const dims = [4, 3];
    const state = {
      BASE_URL: {
        x: 0,
        y: 0,
        direction: 'E',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 3,
        y: 0,
        direction: 'N',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const forwardState = getForwardState(ownState, dims);
    assertType<Object>(forwardState);
    expect(forwardState).toHaveProperty('x');
    assertType<Number>(forwardState.x);
    expect(forwardState).toHaveProperty('y');
    assertType<Number>(forwardState.y);
    expect(forwardState).toHaveProperty('direction');
    assertType<String>(forwardState.direction);
    expect(forwardState.x).toEqual(1);
    expect(forwardState.y).toEqual(0);
    expect(forwardState.direction).toEqual('E');
  });

  test('getForwardState should return a state at (0, 1) towards S', () => {
    const dims = [4, 3];
    const state = {
      BASE_URL: {
        x: 0,
        y: 0,
        direction: 'S',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 3,
        y: 0,
        direction: 'N',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const forwardState = getForwardState(ownState, dims);
    assertType<Object>(forwardState);
    expect(forwardState).toHaveProperty('x');
    assertType<Number>(forwardState.x);
    expect(forwardState).toHaveProperty('y');
    assertType<Number>(forwardState.y);
    expect(forwardState).toHaveProperty('direction');
    assertType<String>(forwardState.direction);
    expect(forwardState.x).toEqual(0);
    expect(forwardState.y).toEqual(1);
    expect(forwardState.direction).toEqual('S');
  });

  test('getForwardState should return a state at (2, 2) towards W', () => {
    const dims = [4, 3];
    const state = {
      BASE_URL: {
        x: 3,
        y: 2,
        direction: 'W',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 3,
        y: 0,
        direction: 'N',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const forwardState = getForwardState(ownState, dims);
    assertType<Object>(forwardState);
    expect(forwardState).toHaveProperty('x');
    assertType<Number>(forwardState.x);
    expect(forwardState).toHaveProperty('y');
    assertType<Number>(forwardState.y);
    expect(forwardState).toHaveProperty('direction');
    assertType<String>(forwardState.direction);
    expect(forwardState.x).toEqual(2);
    expect(forwardState.y).toEqual(2);
    expect(forwardState.direction).toEqual('W');
  });

  test('getForwardState should return a state at (3, 1) towards N', () => {
    const dims = [4, 3];
    const state = {
      BASE_URL: {
        x: 3,
        y: 2,
        direction: 'N',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 3,
        y: 0,
        direction: 'N',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const forwardState = getForwardState(ownState, dims);
    assertType<Object>(forwardState);
    expect(forwardState).toHaveProperty('x');
    assertType<Number>(forwardState.x);
    expect(forwardState).toHaveProperty('y');
    assertType<Number>(forwardState.y);
    expect(forwardState).toHaveProperty('direction');
    assertType<String>(forwardState.direction);
    expect(forwardState.x).toEqual(3);
    expect(forwardState.y).toEqual(1);
    expect(forwardState.direction).toEqual('N');
  });

  test('getForwardState should return false when wall is in the front', () => {
    let dims = [4, 3];
    let state = {
      BASE_URL: {
        x: 0,
        y: 0,
        direction: 'W',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 3,
        y: 0,
        direction: 'N',
        wasHit: false,
        score: 0
      }
    };
    let ownState = state.BASE_URL;
    let forwardState = getForwardState(ownState, dims);
    assertType<Boolean>(forwardState);
    expect(forwardState).toEqual(false);
  });
});

describe('getThreatLevel should return an integer value of 1, 0 or -1 from the absolute directions and relative direction provided', () => {
  test('getThreatLevel should return -1 for E vs E in the front', () => {
    const ownDirection = 'E';
    const enemyDirection = 'E';
    const relativeDirection = 'front';
    const threatLevel = getThreatLevel(ownDirection, enemyDirection, relativeDirection);
    assertType<Number>(threatLevel);
    expect(threatLevel).toEqual(-1);
  });

  test('getThreatLevel should return -1 for S vs S in the front', () => {
    const ownDirection = 'S';
    const enemyDirection = 'S';
    const relativeDirection = 'front';
    const threatLevel = getThreatLevel(ownDirection, enemyDirection, relativeDirection);
    assertType<Number>(threatLevel);
    expect(threatLevel).toEqual(-1);
  });

  test('getThreatLevel should return 1 for W vs W in the back', () => {
    const ownDirection = 'W';
    const enemyDirection = 'W';
    const relativeDirection = 'back';
    const threatLevel = getThreatLevel(ownDirection, enemyDirection, relativeDirection);
    assertType<Number>(threatLevel);
    expect(threatLevel).toEqual(1);
  });

  test('getThreatLevel should return 1 for N vs N in the back', () => {
    const ownDirection = 'N';
    const enemyDirection = 'N';
    const relativeDirection = 'back';
    const threatLevel = getThreatLevel(ownDirection, enemyDirection, relativeDirection);
    assertType<Number>(threatLevel);
    expect(threatLevel).toEqual(1);
  });

  test('getThreatLevel should return 0 for S vs E in the front', () => {
    const ownDirection = 'E';
    const enemyDirection = 'S';
    const relativeDirection = 'front';
    const threatLevel = getThreatLevel(ownDirection, enemyDirection, relativeDirection);
    assertType<Number>(threatLevel);
    expect(threatLevel).toEqual(0);
  });

  test('getThreatLevel should return 1 for N vs S in the front', () => {
    const ownDirection = 'S';
    const enemyDirection = 'N';
    const relativeDirection = 'front';
    const threatLevel = getThreatLevel(ownDirection, enemyDirection, relativeDirection);
    assertType<Number>(threatLevel);
    expect(threatLevel).toEqual(1);
  });

  test('getThreatLevel should return -1 for E vs W in the back', () => {
    const ownDirection = 'W';
    const enemyDirection = 'E';
    const relativeDirection = 'back';
    const threatLevel = getThreatLevel(ownDirection, enemyDirection, relativeDirection);
    assertType<Number>(threatLevel);
    expect(threatLevel).toEqual(-1);
  });

  test('getThreatLevel should return 0 for W vs N in the back', () => {
    const ownDirection = 'N';
    const enemyDirection = 'W';
    const relativeDirection = 'back';
    const threatLevel = getThreatLevel(ownDirection, enemyDirection, relativeDirection);
    assertType<Number>(threatLevel);
    expect(threatLevel).toEqual(0);
  });

  test('getThreatLevel should return 1 for S vs E on the left', () => {
    const ownDirection = 'E';
    const enemyDirection = 'S';
    const relativeDirection = 'left';
    const threatLevel = getThreatLevel(ownDirection, enemyDirection, relativeDirection);
    assertType<Number>(threatLevel);
    expect(threatLevel).toEqual(1);
  });

  test('getThreatLevel should return 0 for N vs S on the right', () => {
    const ownDirection = 'S';
    const enemyDirection = 'N';
    const relativeDirection = 'right';
    const threatLevel = getThreatLevel(ownDirection, enemyDirection, relativeDirection);
    assertType<Number>(threatLevel);
    expect(threatLevel).toEqual(0);
  });

  test('getThreatLevel should return 0 for E vs W on the left', () => {
    const ownDirection = 'W';
    const enemyDirection = 'E';
    const relativeDirection = 'left';
    const threatLevel = getThreatLevel(ownDirection, enemyDirection, relativeDirection);
    assertType<Number>(threatLevel);
    expect(threatLevel).toEqual(0);
  });

  test('getThreatLevel should return 1 for W vs N on the right', () => {
    const ownDirection = 'N';
    const enemyDirection = 'W';
    const relativeDirection = 'right';
    const threatLevel = getThreatLevel(ownDirection, enemyDirection, relativeDirection);
    assertType<Number>(threatLevel);
    expect(threatLevel).toEqual(1);
  });
});

describe('evaluateOverallThreat should return an integer value to indicate the overall threat', () => {
  test('evaluateOverallThreat should return 0 for threat levels 0, 0, 0', () => {
    const threatLevels = [0, 0, 0];
    const overallThreat = evaluateOverallThreat(...threatLevels);
    assertType<Number>(overallThreat);
    expect(overallThreat).toEqual(0);
  });

  test('evaluateOverallThreat should return 0 for threat levels -1, 0, 0', () => {
    const threatLevels = [-1, 0, 0];
    const overallThreat = evaluateOverallThreat(...threatLevels);
    assertType<Number>(overallThreat);
    expect(overallThreat).toEqual(0);
  });

  test('evaluateOverallThreat should return 0 for threat levels -1, 0, -1', () => {
    const threatLevels = [-1, 0, -1];
    const overallThreat = evaluateOverallThreat(...threatLevels);
    assertType<Number>(overallThreat);
    expect(overallThreat).toEqual(0);
  });

  test('evaluateOverallThreat should return 0 for threat levels -1, -1, -1', () => {
    const threatLevels = [-1, -1, -1];
    const overallThreat = evaluateOverallThreat(...threatLevels);
    assertType<Number>(overallThreat);
    expect(overallThreat).toEqual(0);
  });

  test('evaluateOverallThreat should return 1 for threat levels 0, 0, 1', () => {
    const threatLevels = [0, 0, 1];
    const overallThreat = evaluateOverallThreat(...threatLevels);
    assertType<Number>(overallThreat);
    expect(overallThreat).toEqual(1);
  });

  test('evaluateOverallThreat should return 1 for threat levels -1, 0, 1', () => {
    const threatLevels = [-1, 0, 1];
    const overallThreat = evaluateOverallThreat(...threatLevels);
    assertType<Number>(overallThreat);
    expect(overallThreat).toEqual(1);
  });

  test('evaluateOverallThreat should return 1 for threat levels 1, -1, -1', () => {
    const threatLevels = [1, -1, -1];
    const overallThreat = evaluateOverallThreat(...threatLevels);
    assertType<Number>(overallThreat);
    expect(overallThreat).toEqual(1);
  });

  test('evaluateOverallThreat should return 2 for threat levels 1, 1, 0', () => {
    const threatLevels = [1, 1, 0];
    const overallThreat = evaluateOverallThreat(...threatLevels);
    assertType<Number>(overallThreat);
    expect(overallThreat).toEqual(2);
  });

  test('evaluateOverallThreat should return 2 for threat levels 1, 1, -1', () => {
    const threatLevels = [1, 1, -1];
    const overallThreat = evaluateOverallThreat(...threatLevels);
    assertType<Number>(overallThreat);
    expect(overallThreat).toEqual(2);
  });

  test('evaluateOverallThreat should return 3 for threat levels 1, 1, 1', () => {
    const threatLevels = [1, 1, 1];
    const overallThreat = evaluateOverallThreat(...threatLevels);
    assertType<Number>(overallThreat);
    expect(overallThreat).toEqual(3);
  });
});

describe('scanSurroundings should return an object with the keys of 4 relative directions and the values of either an enemy, a wall or null', () => {
  const relativeDirections = ['front', 'back', 'left', 'right'];

  test('scanSurroundings should locate enemy in the front', () => {
    const dims = [4, 3];
    const state = {
      BASE_URL: {
        x: 0,
        y: 0,
        direction: 'E',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 3,
        y: 0,
        direction: 'N',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    assertType<Object>(surroundings);
    expect(Object.keys(surroundings).every(key => relativeDirections.includes(key))).toBeTruthy();
    assertType<Object>(surroundings.front.obstacle);
    expect(surroundings.front.obstacle).toHaveProperty('key');
    assertType<String>(surroundings.front.obstacle.key);
    expect(surroundings.front.obstacle).toHaveProperty('x');
    assertType<Number>(surroundings.front.obstacle.x);
    expect(surroundings.front.obstacle).toHaveProperty('y');
    assertType<Number>(surroundings.front.obstacle.y);
    expect(surroundings.front.obstacle).toHaveProperty('direction');
    assertType<String>(surroundings.front.obstacle.direction);
    expect(surroundings.front.obstacle).toHaveProperty('wasHit');
    assertType<Boolean>(surroundings.front.obstacle.wasHit);
    expect(surroundings.front.obstacle).toHaveProperty('score');
    assertType<Number>(surroundings.front.obstacle.score);
    expect(surroundings.front.obstacle).toHaveProperty('threatLevel');
    assertType<Number>(surroundings.front.obstacle.threatLevel);
    expect(surroundings.front.distance).toEqual(3);
    expect(surroundings.back.obstacle).toEqual('wall');
    expect(surroundings.back.distance).toEqual(1);
    expect(surroundings.left.obstacle).toEqual('wall');
    expect(surroundings.left.distance).toEqual(1);
    expect(surroundings.right.obstacle).toEqual('wall');
    expect(surroundings.right.distance).toEqual(3);
  });

  test('scanSurroundings should locate enemy on the left', () => {
    const dims = [4, 3];
    const state = {
      BASE_URL: {
        x: 0,
        y: 0,
        direction: 'S',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 3,
        y: 0,
        direction: 'N',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    assertType<Object>(surroundings);
    expect(Object.keys(surroundings).every(key => relativeDirections.includes(key))).toBeTruthy();
    expect(surroundings.front.obstacle).toEqual('wall');
    expect(surroundings.front.distance).toEqual(3);
    expect(surroundings.back.obstacle).toEqual('wall');
    expect(surroundings.back.distance).toEqual(1);
    assertType<Object>(surroundings.left.obstacle);
    expect(surroundings.left.obstacle).toHaveProperty('key');
    assertType<String>(surroundings.left.obstacle.key);
    expect(surroundings.left.obstacle).toHaveProperty('x');
    assertType<Number>(surroundings.left.obstacle.x);
    expect(surroundings.left.obstacle).toHaveProperty('y');
    assertType<Number>(surroundings.left.obstacle.y);
    expect(surroundings.left.obstacle).toHaveProperty('direction');
    assertType<String>(surroundings.left.obstacle.direction);
    expect(surroundings.left.obstacle).toHaveProperty('wasHit');
    assertType<Boolean>(surroundings.left.obstacle.wasHit);
    expect(surroundings.left.obstacle).toHaveProperty('score');
    assertType<Number>(surroundings.left.obstacle.score);
    expect(surroundings.left.obstacle).toHaveProperty('threatLevel');
    assertType<Number>(surroundings.left.obstacle.threatLevel);
    expect(surroundings.left.distance).toEqual(3);
    expect(surroundings.right.obstacle).toEqual('wall');
    expect(surroundings.right.distance).toEqual(1);
  });

  test('scanSurroundings should locate enemy on the right', () => {
    const dims = [4, 3];
    const state = {
      BASE_URL: {
        x: 3,
        y: 2,
        direction: 'W',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 3,
        y: 0,
        direction: 'N',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    assertType<Object>(surroundings);
    expect(Object.keys(surroundings).every(key => relativeDirections.includes(key))).toBeTruthy();
    expect(surroundings.front.obstacle).toEqual('wall');
    expect(surroundings.front.distance).toEqual(4);
    expect(surroundings.back.obstacle).toEqual('wall');
    expect(surroundings.back.distance).toEqual(1);
    expect(surroundings.left.obstacle).toEqual('wall');
    expect(surroundings.left.distance).toEqual(1);
    assertType<Object>(surroundings.right.obstacle);
    expect(surroundings.right.obstacle).toHaveProperty('key');
    assertType<String>(surroundings.right.obstacle.key);
    expect(surroundings.right.obstacle).toHaveProperty('x');
    assertType<Number>(surroundings.right.obstacle.x);
    expect(surroundings.right.obstacle).toHaveProperty('y');
    assertType<Number>(surroundings.right.obstacle.y);
    expect(surroundings.right.obstacle).toHaveProperty('direction');
    assertType<String>(surroundings.right.obstacle.direction);
    expect(surroundings.right.obstacle).toHaveProperty('wasHit');
    assertType<Boolean>(surroundings.right.obstacle.wasHit);
    expect(surroundings.right.obstacle).toHaveProperty('score');
    assertType<Number>(surroundings.right.obstacle.score);
    expect(surroundings.right.obstacle).toHaveProperty('threatLevel');
    assertType<Number>(surroundings.right.obstacle.threatLevel);
    expect(surroundings.right.distance).toEqual(2);
  });

  test('scanSurroundings should locate enemy in the back', () => {
    const dims = [4, 3];
    const state = {
      BASE_URL: {
        x: 3,
        y: 2,
        direction: 'S',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 3,
        y: 0,
        direction: 'N',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    assertType<Object>(surroundings);
    expect(Object.keys(surroundings).every(key => relativeDirections.includes(key))).toBeTruthy();
    expect(surroundings.front.obstacle).toEqual('wall');
    expect(surroundings.front.distance).toEqual(1);
    assertType<Object>(surroundings.back.obstacle);
    expect(surroundings.back.obstacle).toHaveProperty('key');
    assertType<String>(surroundings.back.obstacle.key);
    expect(surroundings.back.obstacle).toHaveProperty('x');
    assertType<Number>(surroundings.back.obstacle.x);
    expect(surroundings.back.obstacle).toHaveProperty('y');
    assertType<Number>(surroundings.back.obstacle.y);
    expect(surroundings.back.obstacle).toHaveProperty('direction');
    assertType<String>(surroundings.back.obstacle.direction);
    expect(surroundings.back.obstacle).toHaveProperty('wasHit');
    assertType<Boolean>(surroundings.back.obstacle.wasHit);
    expect(surroundings.back.obstacle).toHaveProperty('score');
    assertType<Number>(surroundings.back.obstacle.score);
    expect(surroundings.back.obstacle).toHaveProperty('threatLevel');
    assertType<Number>(surroundings.back.obstacle.threatLevel);
    expect(surroundings.back.distance).toEqual(2);
    expect(surroundings.left.obstacle).toEqual('wall');
    expect(surroundings.left.distance).toEqual(1);
    expect(surroundings.right.obstacle).toEqual('wall');
    expect(surroundings.right.distance).toEqual(4);
  });
});

describe('checkEnemyInRange should return a boolean to indicate an enemy is in range with a provided relative direction', () => {
  test('checkEnemyInRange should identify enemy in range', () => {
    const dims = [4, 3];
    let state = {
      BASE_URL: {
        x: 0,
        y: 0,
        direction: 'E',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 3,
        y: 0,
        direction: 'N',
        wasHit: false,
        score: 0
      }
    };
    let ownState = state.BASE_URL;
    let arena = scanArena(dims, state);
    let surroundings = scanSurroundings(ownState, arena, dims);
    expect(checkEnemyInRange(surroundings.front)).toBeTruthy();

    state = {
      BASE_URL: {
        x: 3,
        y: 2,
        direction: 'N',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 3,
        y: 0,
        direction: 'N',
        wasHit: false,
        score: 0
      }
    };
    ownState = state.BASE_URL;
    arena = scanArena(dims, state);
    surroundings = scanSurroundings(ownState, arena, dims);
    expect(checkEnemyInRange(surroundings.front)).toBeTruthy();
  });

  test('checkEnemyInRange should identify enemy is not in range', () => {
    const dims = [4, 3];
    let state = {
      BASE_URL: {
        x: 0,
        y: 0,
        direction: 'S',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 3,
        y: 0,
        direction: 'N',
        wasHit: false,
        score: 0
      }
    };
    let ownState = state.BASE_URL;
    let arena = scanArena(dims, state);
    let surroundings = scanSurroundings(ownState, arena, dims);
    expect(checkEnemyInRange(surroundings.front)).toBeFalsy();

    state = {
      BASE_URL: {
        x: 3,
        y: 2,
        direction: 'W',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 3,
        y: 0,
        direction: 'N',
        wasHit: false,
        score: 0
      }
    };
    ownState = state.BASE_URL;
    arena = scanArena(dims, state);
    surroundings = scanSurroundings(ownState, arena, dims);
    expect(checkEnemyInRange(surroundings.front)).toBeFalsy();
  });
});

describe('hasEnemy and hasWall should return a boolean to indicate if a provided relative direction has an enemy or a wall', () => {
  test('hasEnemy should detect enemy in no relative direction while hasWall should detect wall in none', () => {
    const dims = [20, 20];
    const state = {
      BASE_URL: {
        x: 10,
        y: 10,
        direction: 'E',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const { front, back, left, right } = scanSurroundings(ownState, arena, dims);
    const frontHasEnemy = hasEnemy(front);
    const backHasEnemy = hasEnemy(back);
    const leftHasEnemy = hasEnemy(left);
    const rightHasEnemy = hasEnemy(right);
    assertType<Boolean>(frontHasEnemy);
    assertType<Boolean>(backHasEnemy);
    assertType<Boolean>(leftHasEnemy);
    assertType<Boolean>(rightHasEnemy);
    expect(frontHasEnemy).toEqual(false);
    expect(backHasEnemy).toEqual(false);
    expect(leftHasEnemy).toEqual(false);
    expect(rightHasEnemy).toEqual(false);
    const frontHasWall = hasWall(front);
    const backHasWall = hasWall(back);
    const leftHasWall = hasWall(left);
    const rightHasWall = hasWall(right);
    assertType<Boolean>(frontHasWall);
    assertType<Boolean>(backHasWall);
    assertType<Boolean>(leftHasWall);
    assertType<Boolean>(rightHasWall);
    expect(frontHasWall).toEqual(false);
    expect(backHasWall).toEqual(false);
    expect(leftHasWall).toEqual(false);
    expect(rightHasWall).toEqual(false);
  });

  test('hasEnemy should detect enemy in no relative direction while hasWall should detect wall in four', () => {
    const dims = [4, 3];
    const state = {
      BASE_URL: {
        x: 0,
        y: 0,
        direction: 'E',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const { front, back, left, right } = scanSurroundings(ownState, arena, dims);
    const frontHasEnemy = hasEnemy(front);
    const backHasEnemy = hasEnemy(back);
    const leftHasEnemy = hasEnemy(left);
    const rightHasEnemy = hasEnemy(right);
    assertType<Boolean>(frontHasEnemy);
    assertType<Boolean>(backHasEnemy);
    assertType<Boolean>(leftHasEnemy);
    assertType<Boolean>(rightHasEnemy);
    expect(frontHasEnemy).toEqual(false);
    expect(backHasEnemy).toEqual(false);
    expect(leftHasEnemy).toEqual(false);
    expect(rightHasEnemy).toEqual(false);
    const frontHasWall = hasWall(front);
    const backHasWall = hasWall(back);
    const leftHasWall = hasWall(left);
    const rightHasWall = hasWall(right);
    assertType<Boolean>(frontHasWall);
    assertType<Boolean>(backHasWall);
    assertType<Boolean>(leftHasWall);
    assertType<Boolean>(rightHasWall);
    expect(frontHasWall).toEqual(true);
    expect(backHasWall).toEqual(true);
    expect(leftHasWall).toEqual(true);
    expect(rightHasWall).toEqual(true);
  });

  test('hasEnemy should detect enemy in one relative direction while hasWall should detect wall in three', () => {
    const dims = [4, 3];
    const state = {
      BASE_URL: {
        x: 0,
        y: 0,
        direction: 'E',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 3,
        y: 0,
        direction: 'N',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const { front, back, left, right } = scanSurroundings(ownState, arena, dims);
    const frontHasEnemy = hasEnemy(front);
    const backHasEnemy = hasEnemy(back);
    const leftHasEnemy = hasEnemy(left);
    const rightHasEnemy = hasEnemy(right);
    assertType<Boolean>(frontHasEnemy);
    assertType<Boolean>(backHasEnemy);
    assertType<Boolean>(leftHasEnemy);
    assertType<Boolean>(rightHasEnemy);
    expect(frontHasEnemy).toEqual(true);
    expect(backHasEnemy).toEqual(false);
    expect(leftHasEnemy).toEqual(false);
    expect(rightHasEnemy).toEqual(false);
    const frontHasWall = hasWall(front);
    const backHasWall = hasWall(back);
    const leftHasWall = hasWall(left);
    const rightHasWall = hasWall(right);
    assertType<Boolean>(frontHasWall);
    assertType<Boolean>(backHasWall);
    assertType<Boolean>(leftHasWall);
    assertType<Boolean>(rightHasWall);
    expect(frontHasWall).toEqual(false);
    expect(backHasWall).toEqual(true);
    expect(leftHasWall).toEqual(true);
    expect(rightHasWall).toEqual(true);
  });

  test('hasEnemy should detect enemy in two relative directions while hasWall should detect wall in two', () => {
    const dims = [6, 5];
    const state = {
      BASE_URL: {
        x: 2,
        y: 0,
        direction: 'E',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 0,
        y: 0,
        direction: 'N',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL_1: {
        x: 2,
        y: 4,
        direction: 'N',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const { front, back, left, right } = scanSurroundings(ownState, arena, dims);
    const frontHasEnemy = hasEnemy(front);
    const backHasEnemy = hasEnemy(back);
    const leftHasEnemy = hasEnemy(left);
    const rightHasEnemy = hasEnemy(right);
    assertType<Boolean>(frontHasEnemy);
    assertType<Boolean>(backHasEnemy);
    assertType<Boolean>(leftHasEnemy);
    assertType<Boolean>(rightHasEnemy);
    expect(frontHasEnemy).toEqual(false);
    expect(backHasEnemy).toEqual(true);
    expect(leftHasEnemy).toEqual(false);
    expect(rightHasEnemy).toEqual(true);
    const frontHasWall = hasWall(front);
    const backHasWall = hasWall(back);
    const leftHasWall = hasWall(left);
    const rightHasWall = hasWall(right);
    assertType<Boolean>(frontHasWall);
    assertType<Boolean>(backHasWall);
    assertType<Boolean>(leftHasWall);
    assertType<Boolean>(rightHasWall);
    expect(frontHasWall).toEqual(true);
    expect(backHasWall).toEqual(false);
    expect(leftHasWall).toEqual(true);
    expect(rightHasWall).toEqual(false);
  });

  test('hasEnemy should detect enemy in three relative directions while hasWall should detect wall in one', () => {
    const dims = [6, 5];
    const state = {
      BASE_URL: {
        x: 2,
        y: 1,
        direction: 'N',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 0,
        y: 1,
        direction: 'N',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL_1: {
        x: 2,
        y: 4,
        direction: 'W',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL_3: {
        x: 2,
        y: 0,
        direction: 'N',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const { front, back, left, right } = scanSurroundings(ownState, arena, dims);
    const frontHasEnemy = hasEnemy(front);
    const backHasEnemy = hasEnemy(back);
    const leftHasEnemy = hasEnemy(left);
    const rightHasEnemy = hasEnemy(right);
    assertType<Boolean>(frontHasEnemy);
    assertType<Boolean>(backHasEnemy);
    assertType<Boolean>(leftHasEnemy);
    assertType<Boolean>(rightHasEnemy);
    expect(frontHasEnemy).toEqual(true);
    expect(backHasEnemy).toEqual(true);
    expect(leftHasEnemy).toEqual(true);
    expect(rightHasEnemy).toEqual(false);
    const frontHasWall = hasWall(front);
    const backHasWall = hasWall(back);
    const leftHasWall = hasWall(left);
    const rightHasWall = hasWall(right);
    assertType<Boolean>(frontHasWall);
    assertType<Boolean>(backHasWall);
    assertType<Boolean>(leftHasWall);
    assertType<Boolean>(rightHasWall);
    expect(frontHasWall).toEqual(false);
    expect(backHasWall).toEqual(false);
    expect(leftHasWall).toEqual(false);
    expect(rightHasWall).toEqual(true);
  });

  test('hasEnemy should detect enemy in four relative directions while hasWall should detect wall in none', () => {
    const dims = [6, 5];
    const state = {
      BASE_URL: {
        x: 2,
        y: 1,
        direction: 'W',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 0,
        y: 1,
        direction: 'N',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL_1: {
        x: 2,
        y: 4,
        direction: 'W',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL_3: {
        x: 2,
        y: 0,
        direction: 'N',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL_4: {
        x: 5,
        y: 1,
        direction: 'E',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const { front, back, left, right } = scanSurroundings(ownState, arena, dims);
    const frontHasEnemy = hasEnemy(front);
    const backHasEnemy = hasEnemy(back);
    const leftHasEnemy = hasEnemy(left);
    const rightHasEnemy = hasEnemy(right);
    assertType<Boolean>(frontHasEnemy);
    assertType<Boolean>(backHasEnemy);
    assertType<Boolean>(leftHasEnemy);
    assertType<Boolean>(rightHasEnemy);
    expect(frontHasEnemy).toEqual(true);
    expect(backHasEnemy).toEqual(true);
    expect(leftHasEnemy).toEqual(true);
    expect(rightHasEnemy).toEqual(true);
    const frontHasWall = hasWall(front);
    const backHasWall = hasWall(back);
    const leftHasWall = hasWall(left);
    const rightHasWall = hasWall(right);
    assertType<Boolean>(frontHasWall);
    assertType<Boolean>(backHasWall);
    assertType<Boolean>(leftHasWall);
    assertType<Boolean>(rightHasWall);
    expect(frontHasWall).toEqual(false);
    expect(backHasWall).toEqual(false);
    expect(leftHasWall).toEqual(false);
    expect(rightHasWall).toEqual(false);
  });
});

describe('escape should return a relative direction in a given surroundings', () => {
  test('escape should return F when being hit from the left while forward is available', () => {
    const dims = [4, 3];
    const state = {
      BASE_URL: {
        x: 0,
        y: 0,
        direction: 'S',
        wasHit: true,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 3,
        y: 0,
        direction: 'W',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    const action = escape(surroundings);
    assertType<String>(action);
    expect(action.length).toEqual(1);
    expect(action).equal('F');
  });

  test('escape should return R when being hit from the front and left has a wall', () => {
    const dims = [4, 3];
    const state = {
      BASE_URL: {
        x: 0,
        y: 0,
        direction: 'E',
        wasHit: true,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 3,
        y: 0,
        direction: 'W',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    const action = escape(surroundings);
    assertType<String>(action);
    expect(action.length).toEqual(1);
    expect(action).equal('R');
  });

  test('escape should return R when being hit from the right and left has a wall', () => {
    const dims = [4, 3];
    const state = {
      BASE_URL: {
        x: 0,
        y: 0,
        direction: 'N',
        wasHit: true,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 3,
        y: 0,
        direction: 'W',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    const action = escape(surroundings);
    assertType<String>(action);
    expect(action.length).toEqual(1);
    expect(action).equal('R');
  });

  test('escape should return L when being hit from the back and right has a wall', () => {
    const dims = [4, 3];
    const state = {
      BASE_URL: {
        x: 0,
        y: 0,
        direction: 'W',
        wasHit: true,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 3,
        y: 0,
        direction: 'W',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    const action = escape(surroundings);
    assertType<String>(action);
    expect(action.length).toEqual(1);
    expect(action).equal('L');
  });

  test('escape should return R when being hit from the front and the back while left has a wall within distance 2', () => {
    const dims = [6, 5];
    const state = {
      BASE_URL: {
        x: 4,
        y: 1,
        direction: 'E',
        wasHit: true,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 0,
        y: 1,
        direction: 'E',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL_1: {
        x: 5,
        y: 1,
        direction: 'W',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    const action = escape(surroundings);
    assertType<String>(action);
    expect(action.length).toEqual(1);
    expect(action).equal('R');
  });

  test('escape should return L when being hit from the front and the back while right has a wall within distance 2', () => {
    const dims = [6, 5];
    const state = {
      BASE_URL: {
        x: 1,
        y: 2,
        direction: 'W',
        wasHit: true,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 0,
        y: 2,
        direction: 'E',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL_1: {
        x: 5,
        y: 2,
        direction: 'W',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    const action = escape(surroundings);
    assertType<String>(action);
    expect(action.length).toEqual(1);
    expect(action).equal('L');
  });

  test('escape should return L or R when being hit from the front and the back while left and right have no wall', () => {
    const dims = [6, 5];
    const state = {
      BASE_URL: {
        x: 1,
        y: 3,
        direction: 'W',
        wasHit: true,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 0,
        y: 3,
        direction: 'E',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL_1: {
        x: 5,
        y: 3,
        direction: 'W',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    const action = escape(surroundings);
    assertType<String>(action);
    expect(action.length).toEqual(1);
    expect(['L', 'R'].includes(action)).toBeTruthy();
  });

  test('escape should return R when being hit from the left and the right while front has a wall and right enemy has a higher score', () => {
    const dims = [6, 5];
    const state = {
      BASE_URL: {
        x: 3,
        y: 0,
        direction: 'N',
        wasHit: true,
        score: 5
      },
      ENEMY_BOT_URL: {
        x: 0,
        y: 0,
        direction: 'E',
        wasHit: false,
        score: 10
      },
      ENEMY_BOT_URL_1: {
        x: 5,
        y: 0,
        direction: 'W',
        wasHit: false,
        score: 12
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    const action = escape(surroundings);
    assertType<String>(action);
    expect(action.length).toEqual(1);
    expect(action).equal('R');
  });

  test('escape should return R when being hit from the right while front has a wall at distance 1 and left has a wall within distance 2', () => {
    const dims = [6, 5];
    const state = {
      BASE_URL: {
        x: 2,
        y: 0,
        direction: 'N',
        wasHit: true,
        score: 5
      },
      ENEMY_BOT_URL: {
        x: 5,
        y: 0,
        direction: 'W',
        wasHit: false,
        score: 10
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    const action = escape(surroundings);
    assertType<String>(action);
    expect(action.length).toEqual(1);
    expect(action).equal('R');
  });

  test('escape should return L or R when being hit from both left and right while forward is unavailable', () => {
    const dims = [4, 3];
    const state = {
      BASE_URL: {
        x: 1,
        y: 0,
        direction: 'N',
        wasHit: true,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 3,
        y: 0,
        direction: 'W',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL_1: {
        x: 0,
        y: 0,
        direction: 'E',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    const action = escape(surroundings);
    assertType<String>(action);
    expect(action.length).toEqual(1);
    expect(['L', 'R'].includes(action)).toBeTruthy();
  });
});

describe('hunt should return a relative direction in a given surroundings', () => {
  test('hunt should return L when enemy is on the left', () => {
    const dims = [4, 3];
    const state = {
      BASE_URL: {
        x: 0,
        y: 0,
        direction: 'S',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 3,
        y: 0,
        direction: 'W',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    const action = hunt(surroundings);
    assertType<String>(action);
    expect(action.length).toEqual(1);
    expect(action).equal('L');
  });

  test('hunt should return R when enemy is on the right', () => {
    const dims = [4, 3];
    const state = {
      BASE_URL: {
        x: 0,
        y: 0,
        direction: 'N',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 3,
        y: 0,
        direction: 'W',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    const action = hunt(surroundings);
    assertType<String>(action);
    expect(action.length).toEqual(1);
    expect(action).equal('R');
  });

  test('hunt should return F when enemy is in the front at a distance 4', () => {
    const dims = [5, 3];
    const state = {
      BASE_URL: {
        x: 0,
        y: 0,
        direction: 'E',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 4,
        y: 0,
        direction: 'N',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    const action = hunt(surroundings);
    assertType<String>(action);
    expect(action.length).toEqual(1);
    expect(action).equal('F');
  });

  test('hunt should return L when enemy is in the back and right has a wall', () => {
    const dims = [4, 3];
    const state = {
      BASE_URL: {
        x: 0,
        y: 0,
        direction: 'W',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 3,
        y: 0,
        direction: 'W',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    const action = hunt(surroundings);
    assertType<String>(action);
    expect(action.length).toEqual(1);
    expect(action).equal('L');
  });

  test('hunt should return R when enemy is in the back and left has a wall', () => {
    const dims = [4, 3];
    const state = {
      BASE_URL: {
        x: 0,
        y: 0,
        direction: 'N',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 0,
        y: 2,
        direction: 'N',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    const action = hunt(surroundings);
    assertType<String>(action);
    expect(action.length).toEqual(1);
    expect(action).equal('R');
  });

  test('hunt should return L when enemy is on the left at a distance 4', () => {
    const dims = [5, 3];
    const state = {
      BASE_URL: {
        x: 0,
        y: 0,
        direction: 'S',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 4,
        y: 0,
        direction: 'N',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    const action = hunt(surroundings);
    assertType<String>(action);
    expect(action.length).toEqual(1);
    expect(action).equal('L');
  });

  test('hunt should return R when enemy is on the right at a distance 4', () => {
    const dims = [5, 3];
    const state = {
      BASE_URL: {
        x: 0,
        y: 0,
        direction: 'N',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 4,
        y: 0,
        direction: 'N',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    const action = hunt(surroundings);
    assertType<String>(action);
    expect(action.length).toEqual(1);
    expect(action).equal('R');
  });

  test('hunt should return F when enemy is in the front at a distance 5', () => {
    const dims = [6, 5];
    const state = {
      BASE_URL: {
        x: 0,
        y: 2,
        direction: 'N',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 5,
        y: 2,
        direction: 'N',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    const action = hunt(surroundings);
    assertType<String>(action);
    expect(action.length).toEqual(1);
    expect(action).equal('F');
  });

  test('hunt should return F when enemy is on the left within range of throw when stepped forward', () => {
    const dims = [6, 5];
    const state = {
      BASE_URL: {
        x: 4,
        y: 3,
        direction: 'N',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 1,
        y: 2,
        direction: 'N',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    const forwardState = surroundings.front.distance > 1 ? getForwardState(ownState, dims) : false;
    const forwardSurroundings = forwardState && scanSurroundings(forwardState, arena, dims);
    const action = hunt(surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action.length).toEqual(1);
    expect(action).equal('F');
  });

  test('hunt should return F when enemy is on the right within range of throw when stepped forward', () => {
    const dims = [6, 5];
    const state = {
      BASE_URL: {
        x: 3,
        y: 0,
        direction: 'S',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 0,
        y: 1,
        direction: 'N',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    const forwardState = surroundings.front.distance > 1 ? getForwardState(ownState, dims) : false;
    const forwardSurroundings = forwardState && scanSurroundings(forwardState, arena, dims);
    const action = hunt(surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action.length).toEqual(1);
    expect(action).equal('F');
  });
});

describe('decideAction should return a relative direction given the state of being hit, the surroundings and the forward surroundings', () => {
  test('decideAction should return L when being hit from the left and forward has a wall', () => {
    const dims = [6, 5];
    const state = {
      BASE_URL: {
        x: 3,
        y: 0,
        direction: 'N',
        wasHit: true,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 0,
        y: 0,
        direction: 'E',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    const forwardState = surroundings.front.distance > 1 ? getForwardState(ownState, dims) : false;
    const forwardSurroundings = forwardState && scanSurroundings(forwardState, arena, dims);
    const action = decideAction(ownState.wasHit, surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action.length).toEqual(1);
    expect(action).equal('L');
  });

  test('decideAction should return R when being hit from the right and forward has a wall', () => {
    const dims = [6, 5];
    const state = {
      BASE_URL: {
        x: 3,
        y: 0,
        direction: 'N',
        wasHit: true,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 5,
        y: 0,
        direction: 'W',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    const forwardState = surroundings.front.distance > 1 ? getForwardState(ownState, dims) : false;
    const forwardSurroundings = forwardState && scanSurroundings(forwardState, arena, dims);
    const action = decideAction(ownState.wasHit, surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action.length).toEqual(1);
    expect(action).equal('R');
  });

  test('decideAction should return L when being hit from the left and the back while forward has a wall', () => {
    const dims = [6, 5];
    const state = {
      BASE_URL: {
        x: 3,
        y: 0,
        direction: 'N',
        wasHit: true,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 3,
        y: 3,
        direction: 'N',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL_1: {
        x: 0,
        y: 0,
        direction: 'E',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    const forwardState = surroundings.front.distance > 1 ? getForwardState(ownState, dims) : false;
    const forwardSurroundings = forwardState && scanSurroundings(forwardState, arena, dims);
    const action = decideAction(ownState.wasHit, surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action.length).toEqual(1);
    expect(action).equal('L');
  });

  test('decideAction should return R when being hit from the left and the back while forward has a wall', () => {
    const dims = [6, 5];
    const state = {
      BASE_URL: {
        x: 3,
        y: 0,
        direction: 'N',
        wasHit: true,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 3,
        y: 3,
        direction: 'N',
        wasHit: false,
        score: 0
      },
      ENEMY_BOT_URL_1: {
        x: 5,
        y: 0,
        direction: 'W',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    const forwardState = surroundings.front.distance > 1 ? getForwardState(ownState, dims) : false;
    const forwardSurroundings = forwardState && scanSurroundings(forwardState, arena, dims);
    const action = decideAction(ownState.wasHit, surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action.length).toEqual(1);
    expect(action).equal('R');
  });

  test('decideAction should return F when being hit from the left and forward is available', () => {
    const dims = [6, 5];
    const state = {
      BASE_URL: {
        x: 3,
        y: 0,
        direction: 'S',
        wasHit: true,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 5,
        y: 0,
        direction: 'W',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    const forwardState = surroundings.front.distance > 1 ? getForwardState(ownState, dims) : false;
    const forwardSurroundings = forwardState && scanSurroundings(forwardState, arena, dims);
    const action = decideAction(ownState.wasHit, surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action.length).toEqual(1);
    expect(action).equal('F');
  });

  test('decideAction should return F when being hit from the right and forward is available', () => {
    const dims = [6, 5];
    const state = {
      BASE_URL: {
        x: 3,
        y: 0,
        direction: 'S',
        wasHit: true,
        score: 0
      },
      ENEMY_BOT_URL: {
        x: 0,
        y: 0,
        direction: 'E',
        wasHit: false,
        score: 0
      }
    };
    const ownState = state.BASE_URL;
    const arena = scanArena(dims, state);
    const surroundings = scanSurroundings(ownState, arena, dims);
    const forwardState = surroundings.front.distance > 1 ? getForwardState(ownState, dims) : false;
    const forwardSurroundings = forwardState && scanSurroundings(forwardState, arena, dims);
    const action = decideAction(ownState.wasHit, surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action.length).toEqual(1);
    expect(action).equal('F');
  });
});
