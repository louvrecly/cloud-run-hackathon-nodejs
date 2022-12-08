import { describe, test, expect, assertType } from 'vitest';
import {
  compareDirections,
  createEmptyArena,
  scanArena,
  checkIndexInRange,
  getDimAndIndex,
  getMultiplier,
  locateTarget,
  getForwardState,
  getTurnState,
  getThreatLevel,
  analyzeThreats,
  scanSurroundings,
  hasEnemy,
  hasWall,
  checkEnemyInRange,
  getMoves,
  evaluateDelta,
  getNextState,
  escape,
  escapeNew,
  hunt,
  huntNew,
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

describe('locateTarget should return an object indicating the relative location of the target', () => {
  test('locateTarget should return null when there is no enemy', () => {
    const ownState = {
      x: 4,
      y: 4,
      direction: 'E',
      wasHit: false,
      score: 0,
    };
    const enemyState = {};
    const targetLocator = locateTarget({ ownState, enemyState });
    assertType<Object>(targetLocator);
    expect(targetLocator).toBeNull();
  });

  test.todo('locateTarget should return 3 for longitudinal and 0 for transverse when the target is in the front', () => {
    const ownState = {
      x: 4,
      y: 4,
      direction: 'E',
      wasHit: false,
      score: 0,
    };
    const enemyState = {
      ENEMY_BOT_URL_N: {
        x: 4,
        y: 2,
        direction: 'N',
        wasHit: false,
        score: 2,
      },
      ENEMY_BOT_URL_S: {
        x: 4,
        y: 6,
        direction: 'S',
        wasHit: false,
        score: 1,
      },
      ENEMY_BOT_URL_E: {
        x: 7,
        y: 4,
        direction: 'E',
        wasHit: false,
        score: 5,
      },
      ENEMY_BOT_URL_W: {
        x: 2,
        y: 4,
        direction: 'W',
        wasHit: false,
        score: 3,
      },
    };
    const targetLocator = locateTarget({ ownState, enemyState });
    assertType<Object>(targetLocator);
    expect(targetLocator).toHaveProperty('longitudinal');
    expect(targetLocator.longitudinal).toBe(3);
    expect(targetLocator).toHaveProperty('transverse');
    expect(targetLocator.transverse).toBe(0);
  });

  test.todo('locateTarget should return -2 for longitudinal and 0 for transverse when the target is in the back', () => {
    const ownState = {
      x: 4,
      y: 4,
      direction: 'E',
      wasHit: false,
      score: 0,
    };
    const enemyState = {
      ENEMY_BOT_URL_N: {
        x: 4,
        y: 2,
        direction: 'N',
        wasHit: false,
        score: 2,
      },
      ENEMY_BOT_URL_S: {
        x: 4,
        y: 6,
        direction: 'S',
        wasHit: false,
        score: 1,
      },
      ENEMY_BOT_URL_E: {
        x: 7,
        y: 4,
        direction: 'E',
        wasHit: false,
        score: 0,
      },
      ENEMY_BOT_URL_W: {
        x: 2,
        y: 4,
        direction: 'W',
        wasHit: false,
        score: 5,
      },
    };
    const targetLocator = locateTarget({ ownState, enemyState });
    assertType<Object>(targetLocator);
    expect(targetLocator).toHaveProperty('longitudinal');
    expect(targetLocator.longitudinal).toBe(-2);
    expect(targetLocator).toHaveProperty('transverse');
    expect(targetLocator.transverse).toBe(0);
  });

  test.todo('locateTarget should return 0 for longitudinal and -2 for transverse when the target is on the left', () => {
    const ownState = {
      x: 4,
      y: 4,
      direction: 'E',
      wasHit: false,
      score: 0,
    };
    const enemyState = {
      ENEMY_BOT_URL_N: {
        x: 4,
        y: 2,
        direction: 'N',
        wasHit: false,
        score: 5,
      },
      ENEMY_BOT_URL_S: {
        x: 4,
        y: 6,
        direction: 'S',
        wasHit: false,
        score: 1,
      },
      ENEMY_BOT_URL_E: {
        x: 7,
        y: 4,
        direction: 'E',
        wasHit: false,
        score: 0,
      },
      ENEMY_BOT_URL_W: {
        x: 2,
        y: 4,
        direction: 'W',
        wasHit: false,
        score: 3,
      },
    };
    const targetLocator = locateTarget({ ownState, enemyState });
    assertType<Object>(targetLocator);
    expect(targetLocator).toHaveProperty('longitudinal');
    expect(targetLocator.longitudinal).toBe(0);
    expect(targetLocator).toHaveProperty('transverse');
    expect(targetLocator.transverse).toBe(-2);
  });

  test.todo('locateTarget should return 0 for longitudinal and 2 for transverse when the target is on the right', () => {
    const ownState = {
      x: 4,
      y: 4,
      direction: 'E',
      wasHit: false,
      score: 0,
    };
    const enemyState = {
      ENEMY_BOT_URL_N: {
        x: 4,
        y: 2,
        direction: 'N',
        wasHit: false,
        score: 2,
      },
      ENEMY_BOT_URL_S: {
        x: 4,
        y: 6,
        direction: 'S',
        wasHit: false,
        score: 5,
      },
      ENEMY_BOT_URL_E: {
        x: 7,
        y: 4,
        direction: 'E',
        wasHit: false,
        score: 0,
      },
      ENEMY_BOT_URL_W: {
        x: 2,
        y: 4,
        direction: 'W',
        wasHit: false,
        score: 3,
      },
    };
    const targetLocator = locateTarget({ ownState, enemyState });
    assertType<Object>(targetLocator);
    expect(targetLocator).toHaveProperty('longitudinal');
    expect(targetLocator.longitudinal).toBe(0);
    expect(targetLocator).toHaveProperty('transverse');
    expect(targetLocator.transverse).toBe(2);
  });

  test.todo('locateTarget should return 1 for longitudinal and -2 for transverse when the target is in the front-left', () => {
    const ownState = {
      x: 4,
      y: 4,
      direction: 'E',
      wasHit: false,
      score: 0,
    };
    const enemyState = {
      ENEMY_BOT_URL_N: {
        x: 4,
        y: 2,
        direction: 'N',
        wasHit: false,
        score: 2,
      },
      ENEMY_BOT_URL_S: {
        x: 4,
        y: 6,
        direction: 'S',
        wasHit: false,
        score: 1,
      },
      ENEMY_BOT_URL_E: {
        x: 7,
        y: 4,
        direction: 'E',
        wasHit: false,
        score: 0,
      },
      ENEMY_BOT_URL_W: {
        x: 2,
        y: 4,
        direction: 'W',
        wasHit: false,
        score: 3,
      },
      ENEMY_BOT_URL_NE: {
        x: 5,
        y: 2,
        direction: 'N',
        wasHit: false,
        score: 5,
      },
      ENEMY_BOT_URL_NW: {
        x: 2,
        y: 0,
        direction: 'W',
        wasHit: false,
        score: 3,
      },
      ENEMY_BOT_URL_SE: {
        x: 7,
        y: 6,
        direction: 'E',
        wasHit: false,
        score: 0,
      },
      ENEMY_BOT_URL_SW: {
        x: 0,
        y: 6,
        direction: 'S',
        wasHit: false,
        score: 1,
      },
    };
    const targetLocator = locateTarget({ ownState, enemyState });
    assertType<Object>(targetLocator);
    expect(targetLocator).toHaveProperty('longitudinal');
    expect(targetLocator.longitudinal).toBe(1);
    expect(targetLocator).toHaveProperty('transverse');
    expect(targetLocator.transverse).toBe(-2);
  });

  test.todo('locateTarget should return 3 for longitudinal and 2 for transverse when the target is in the front-right', () => {
    const ownState = {
      x: 4,
      y: 4,
      direction: 'E',
      wasHit: false,
      score: 0,
    };
    const enemyState = {
      ENEMY_BOT_URL_N: {
        x: 4,
        y: 2,
        direction: 'N',
        wasHit: false,
        score: 2,
      },
      ENEMY_BOT_URL_S: {
        x: 4,
        y: 6,
        direction: 'S',
        wasHit: false,
        score: 1,
      },
      ENEMY_BOT_URL_E: {
        x: 7,
        y: 4,
        direction: 'E',
        wasHit: false,
        score: 0,
      },
      ENEMY_BOT_URL_W: {
        x: 2,
        y: 4,
        direction: 'W',
        wasHit: false,
        score: 3,
      },
      ENEMY_BOT_URL_NE: {
        x: 5,
        y: 2,
        direction: 'N',
        wasHit: false,
        score: 2,
      },
      ENEMY_BOT_URL_NW: {
        x: 2,
        y: 0,
        direction: 'W',
        wasHit: false,
        score: 3,
      },
      ENEMY_BOT_URL_SE: {
        x: 7,
        y: 6,
        direction: 'E',
        wasHit: false,
        score: 5,
      },
      ENEMY_BOT_URL_SW: {
        x: 0,
        y: 6,
        direction: 'S',
        wasHit: false,
        score: 1,
      },
    };
    const targetLocator = locateTarget({ ownState, enemyState });
    assertType<Object>(targetLocator);
    expect(targetLocator).toHaveProperty('longitudinal');
    expect(targetLocator.longitudinal).toBe(3);
    expect(targetLocator).toHaveProperty('transverse');
    expect(targetLocator.transverse).toBe(2);
  });

  test.todo('locateTarget should return -2 for longitudinal and -4 for transverse when the target is in the back-left', () => {
    const ownState = {
      x: 4,
      y: 4,
      direction: 'E',
      wasHit: false,
      score: 0,
    };
    const enemyState = {
      ENEMY_BOT_URL_N: {
        x: 4,
        y: 2,
        direction: 'N',
        wasHit: false,
        score: 2,
      },
      ENEMY_BOT_URL_S: {
        x: 4,
        y: 6,
        direction: 'S',
        wasHit: false,
        score: 1,
      },
      ENEMY_BOT_URL_E: {
        x: 7,
        y: 4,
        direction: 'E',
        wasHit: false,
        score: 0,
      },
      ENEMY_BOT_URL_W: {
        x: 2,
        y: 4,
        direction: 'W',
        wasHit: false,
        score: 3,
      },
      ENEMY_BOT_URL_NE: {
        x: 5,
        y: 2,
        direction: 'N',
        wasHit: false,
        score: 2,
      },
      ENEMY_BOT_URL_NW: {
        x: 2,
        y: 0,
        direction: 'W',
        wasHit: false,
        score: 5,
      },
      ENEMY_BOT_URL_SE: {
        x: 7,
        y: 6,
        direction: 'E',
        wasHit: false,
        score: 0,
      },
      ENEMY_BOT_URL_SW: {
        x: 0,
        y: 6,
        direction: 'S',
        wasHit: false,
        score: 1,
      },
    };
    const targetLocator = locateTarget({ ownState, enemyState });
    assertType<Object>(targetLocator);
    expect(targetLocator).toHaveProperty('longitudinal');
    expect(targetLocator.longitudinal).toBe(-2);
    expect(targetLocator).toHaveProperty('transverse');
    expect(targetLocator.transverse).toBe(-4);
  });

  test.todo('locateTarget should return -4 for longitudinal and 2 for transverse when the target is in the back-right', () => {
    const ownState = {
      x: 4,
      y: 4,
      direction: 'E',
      wasHit: false,
      score: 0,
    };
    const enemyState = {
      ENEMY_BOT_URL_N: {
        x: 4,
        y: 2,
        direction: 'N',
        wasHit: false,
        score: 2,
      },
      ENEMY_BOT_URL_S: {
        x: 4,
        y: 6,
        direction: 'S',
        wasHit: false,
        score: 1,
      },
      ENEMY_BOT_URL_E: {
        x: 7,
        y: 4,
        direction: 'E',
        wasHit: false,
        score: 0,
      },
      ENEMY_BOT_URL_W: {
        x: 2,
        y: 4,
        direction: 'W',
        wasHit: false,
        score: 3,
      },
      ENEMY_BOT_URL_NE: {
        x: 5,
        y: 2,
        direction: 'N',
        wasHit: false,
        score: 2,
      },
      ENEMY_BOT_URL_NW: {
        x: 2,
        y: 0,
        direction: 'W',
        wasHit: false,
        score: 3,
      },
      ENEMY_BOT_URL_SE: {
        x: 7,
        y: 6,
        direction: 'E',
        wasHit: false,
        score: 0,
      },
      ENEMY_BOT_URL_SW: {
        x: 0,
        y: 6,
        direction: 'S',
        wasHit: false,
        score: 5,
      },
    };
    const targetLocator = locateTarget({ ownState, enemyState });
    assertType<Object>(targetLocator);
    expect(targetLocator).toHaveProperty('longitudinal');
    expect(targetLocator.longitudinal).toBe(-4);
    expect(targetLocator).toHaveProperty('transverse');
    expect(targetLocator.transverse).toBe(2);
  });
});

describe('getForwardState should return the state after the forward action with the correct coordinates and direction', () => {
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

describe('getTurnState should return the state after the turn action with the correct coordinates and direction', () => {
  test('getTurnState should return a left state towards N and a right state towards S from a current direction of E', () => {
    const ownState = {
      x: 0,
      y: 0,
      direction: 'E',
      wasHit: false,
      score: 0,
    };
    const leftState = getTurnState(ownState, 'L');
    const rightState = getTurnState(ownState, 'R');
    assertType<Object>(leftState);
    expect(leftState).toHaveProperty('x');
    expect(leftState).toHaveProperty('y');
    expect(leftState).toHaveProperty('direction');
    expect(leftState).toHaveProperty('wasHit');
    expect(leftState).toHaveProperty('score');
    expect(leftState.x).toBe(0);
    expect(leftState.y).toBe(0);
    expect(leftState.direction).toBe('N');
    assertType<Object>(rightState);
    expect(rightState).toHaveProperty('x');
    expect(rightState).toHaveProperty('y');
    expect(rightState).toHaveProperty('direction');
    expect(rightState).toHaveProperty('wasHit');
    expect(rightState).toHaveProperty('score');
    expect(rightState.x).toBe(0);
    expect(rightState.y).toBe(0);
    expect(rightState.direction).toBe('S');
  });

  test('getTurnState should return a left state towards E and a right state towards W from a current direction of S', () => {
    const ownState = {
      x: 0,
      y: 0,
      direction: 'S',
      wasHit: false,
      score: 0,
    };
    const leftState = getTurnState(ownState, 'L');
    const rightState = getTurnState(ownState, 'R');
    assertType<Object>(leftState);
    expect(leftState).toHaveProperty('x');
    expect(leftState).toHaveProperty('y');
    expect(leftState).toHaveProperty('direction');
    expect(leftState).toHaveProperty('wasHit');
    expect(leftState).toHaveProperty('score');
    expect(leftState.x).toBe(0);
    expect(leftState.y).toBe(0);
    expect(leftState.direction).toBe('E');
    assertType<Object>(rightState);
    expect(rightState).toHaveProperty('x');
    expect(rightState).toHaveProperty('y');
    expect(rightState).toHaveProperty('direction');
    expect(rightState).toHaveProperty('wasHit');
    expect(rightState).toHaveProperty('score');
    expect(rightState.x).toBe(0);
    expect(rightState.y).toBe(0);
    expect(rightState.direction).toBe('W');
  });

  test('getTurnState should return a left state towards S and a right state towards N from a current direction of W', () => {
    const ownState = {
      x: 0,
      y: 0,
      direction: 'W',
      wasHit: false,
      score: 0,
    };
    const leftState = getTurnState(ownState, 'L');
    const rightState = getTurnState(ownState, 'R');
    assertType<Object>(leftState);
    expect(leftState).toHaveProperty('x');
    expect(leftState).toHaveProperty('y');
    expect(leftState).toHaveProperty('direction');
    expect(leftState).toHaveProperty('wasHit');
    expect(leftState).toHaveProperty('score');
    expect(leftState.x).toBe(0);
    expect(leftState.y).toBe(0);
    expect(leftState.direction).toBe('S');
    assertType<Object>(rightState);
    expect(rightState).toHaveProperty('x');
    expect(rightState).toHaveProperty('y');
    expect(rightState).toHaveProperty('direction');
    expect(rightState).toHaveProperty('wasHit');
    expect(rightState).toHaveProperty('score');
    expect(rightState.x).toBe(0);
    expect(rightState.y).toBe(0);
    expect(rightState.direction).toBe('N');
  });

  test('getTurnState should return a left state towards W and a right state towards E from a current direction of N', () => {
    const ownState = {
      x: 0,
      y: 0,
      direction: 'N',
      wasHit: false,
      score: 0,
    };
    const leftState = getTurnState(ownState, 'L');
    const rightState = getTurnState(ownState, 'R');
    assertType<Object>(leftState);
    expect(leftState).toHaveProperty('x');
    expect(leftState).toHaveProperty('y');
    expect(leftState).toHaveProperty('direction');
    expect(leftState).toHaveProperty('wasHit');
    expect(leftState).toHaveProperty('score');
    expect(leftState.x).toBe(0);
    expect(leftState.y).toBe(0);
    expect(leftState.direction).toBe('W');
    assertType<Object>(rightState);
    expect(rightState).toHaveProperty('x');
    expect(rightState).toHaveProperty('y');
    expect(rightState).toHaveProperty('direction');
    expect(rightState).toHaveProperty('wasHit');
    expect(rightState).toHaveProperty('score');
    expect(rightState.x).toBe(0);
    expect(rightState.y).toBe(0);
    expect(rightState.direction).toBe('E');
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

describe('analyzeThreats should return an object to indicate the threat in longitudinal and transverse directions and the overall threat', () => {
  test('analyzeThreats should return 0 for longitudinal, transverse and overall threat when no enemy in the surroundings', () => {
    const surroundings = {
      front: {
        distance: 3,
        obstacle: 'wall',
      },
      back: {
        distance: 5,
        obstacle: null,
      },
      left: {
        distance: 5,
        obstacle: null,
      },
      right: {
        distance: 3,
        obstacle: 'wall',
      },
    };
    const threatAnalysis = analyzeThreats(surroundings);
    assertType<Object>(threatAnalysis);
    expect(threatAnalysis).toHaveProperty('longitudinal');
    assertType<Number>(threatAnalysis.longitudinal);
    expect(threatAnalysis.longitudinal).toBe(0);
    expect(threatAnalysis).toHaveProperty('transverse');
    assertType<Number>(threatAnalysis.transverse);
    expect(threatAnalysis.transverse).toBe(0);
    expect(threatAnalysis).toHaveProperty('overall');
    assertType<Number>(threatAnalysis.overall);
    expect(threatAnalysis.overall).toBe(0);
  });

  test('analyzeThreats should return 0 for longitudinal, transverse and overall threat when no enemy is facing this way in the surroundings', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: {
          x: 1,
          y: 0,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      back: {
        distance: 1,
        obstacle: {
          x: 1,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      left: {
        distance: 1,
        obstacle: {
          x: 0,
          y: 1,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      right: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 1,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
    };
    const threatAnalysis = analyzeThreats(surroundings);
    assertType<Object>(threatAnalysis);
    expect(threatAnalysis).toHaveProperty('longitudinal');
    assertType<Number>(threatAnalysis.longitudinal);
    expect(threatAnalysis.longitudinal).toBe(0);
    expect(threatAnalysis).toHaveProperty('transverse');
    assertType<Number>(threatAnalysis.transverse);
    expect(threatAnalysis.transverse).toBe(0);
    expect(threatAnalysis).toHaveProperty('overall');
    assertType<Number>(threatAnalysis.overall);
    expect(threatAnalysis.overall).toBe(0);
  });

  test('analyzeThreats should return 1 for longitudinal, 0 for transverse and 1 for overall threat when 1 enemy is facing this way from the front', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: {
          x: 1,
          y: 0,
          direction: 'S',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 1,
        obstacle: {
          x: 1,
          y: 2,
          direction: 'S',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 1,
        obstacle: {
          x: 0,
          y: 1,
          direction: 'S',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      right: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 1,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
    };
    const threatAnalysis = analyzeThreats(surroundings);
    assertType<Object>(threatAnalysis);
    expect(threatAnalysis).toHaveProperty('longitudinal');
    assertType<Number>(threatAnalysis.longitudinal);
    expect(threatAnalysis.longitudinal).toBe(1);
    expect(threatAnalysis).toHaveProperty('transverse');
    assertType<Number>(threatAnalysis.transverse);
    expect(threatAnalysis.transverse).toBe(0);
    expect(threatAnalysis).toHaveProperty('overall');
    assertType<Number>(threatAnalysis.overall);
    expect(threatAnalysis.overall).toBe(1);
  });

  test('analyzeThreats should return 0 for longitudinal, 2 for transverse and 2 for overall threat when 2 enemies are facing this way from the left and the right', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: {
          x: 1,
          y: 0,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      back: {
        distance: 1,
        obstacle: {
          x: 1,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      left: {
        distance: 1,
        obstacle: {
          x: 0,
          y: 1,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      right: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 1,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
    };
    const threatAnalysis = analyzeThreats(surroundings);
    assertType<Object>(threatAnalysis);
    expect(threatAnalysis).toHaveProperty('longitudinal');
    assertType<Number>(threatAnalysis.longitudinal);
    expect(threatAnalysis.longitudinal).toBe(0);
    expect(threatAnalysis).toHaveProperty('transverse');
    assertType<Number>(threatAnalysis.transverse);
    expect(threatAnalysis.transverse).toBe(2);
    expect(threatAnalysis).toHaveProperty('overall');
    assertType<Number>(threatAnalysis.overall);
    expect(threatAnalysis.overall).toBe(2);
  });

  test('analyzeThreats should return 2 for longitudinal, 1 for transverse and 3 for overall threat when 3 enemies are facing this way from the front, the back and the right', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: {
          x: 1,
          y: 0,
          direction: 'S',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 1,
        obstacle: {
          x: 1,
          y: 2,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 1,
        obstacle: {
          x: 0,
          y: 1,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      right: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 1,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
    };
    const threatAnalysis = analyzeThreats(surroundings);
    assertType<Object>(threatAnalysis);
    expect(threatAnalysis).toHaveProperty('longitudinal');
    assertType<Number>(threatAnalysis.longitudinal);
    expect(threatAnalysis.longitudinal).toBe(2);
    expect(threatAnalysis).toHaveProperty('transverse');
    assertType<Number>(threatAnalysis.transverse);
    expect(threatAnalysis.transverse).toBe(1);
    expect(threatAnalysis).toHaveProperty('overall');
    assertType<Number>(threatAnalysis.overall);
    expect(threatAnalysis.overall).toBe(3);
  });

  test('analyzeThreats should return 2 for longitudinal, 2 for transverse and 4 for overall threat when 4 enemies are facing this way from all relative directions', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: {
          x: 1,
          y: 0,
          direction: 'S',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 1,
        obstacle: {
          x: 1,
          y: 2,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 1,
        obstacle: {
          x: 0,
          y: 1,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      right: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 1,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
    };
    const threatAnalysis = analyzeThreats(surroundings);
    assertType<Object>(threatAnalysis);
    expect(threatAnalysis).toHaveProperty('longitudinal');
    assertType<Number>(threatAnalysis.longitudinal);
    expect(threatAnalysis.longitudinal).toBe(2);
    expect(threatAnalysis).toHaveProperty('transverse');
    assertType<Number>(threatAnalysis.transverse);
    expect(threatAnalysis.transverse).toBe(2);
    expect(threatAnalysis).toHaveProperty('overall');
    assertType<Number>(threatAnalysis.overall);
    expect(threatAnalysis.overall).toBe(4);
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

describe('checkEnemyInRange should return a boolean to indicate an enemy is in range with a provided relative direction', () => {
  test('checkEnemyInRange should correctly identify enemies in range from the front and back but not left and right', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: {
          x: 5,
          y: 4,
          direction: 'N',
          wasHit: false,
          threatLevel: 0,
        },
      },
      back: {
        distance: 3,
        obstacle: {
          x: 1,
          y: 4,
          direction: 'N',
          wasHit: false,
          threatLevel: 0,
        },
      },
      left: {
        distance: 4,
        obstacle: {
          x: 0,
          y: 4,
          direction: 'N',
          wasHit: false,
          threatLevel: -1,
        },
      },
      right: {
        distance: 5,
        obstacle: null,
      },
    };
    expect(checkEnemyInRange(surroundings.front)).toBe(true);
    expect(checkEnemyInRange(surroundings.back)).toBe(true);
    expect(checkEnemyInRange(surroundings.left)).toBe(false);
    expect(checkEnemyInRange(surroundings.right)).toBe(false);
  });

  test('checkEnemyInRange should correctly identify no enemy in range', () => {
    const surroundings = {
      front: {
        distance: 4,
        obstacle: 'wall',
      },
      back: {
        distance: 3,
        obstacle: 'wall',
      },
      left: {
        distance: 1,
        obstacle: 'wall',
      },
      right: {
        distance: 5,
        obstacle: null,
      },
    };
    expect(checkEnemyInRange(surroundings.front)).toBe(false);
    expect(checkEnemyInRange(surroundings.back)).toBe(false);
    expect(checkEnemyInRange(surroundings.left)).toBe(false);
    expect(checkEnemyInRange(surroundings.right)).toBe(false);
  });

  test('checkEnemyInRange should correctly identify enemies in range from the front, left and back but not right with offset -1', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: {
          x: 5,
          y: 4,
          direction: 'N',
          wasHit: false,
          threatLevel: 0,
        },
      },
      back: {
        distance: 3,
        obstacle: {
          x: 1,
          y: 4,
          direction: 'N',
          wasHit: false,
          threatLevel: 0,
        },
      },
      left: {
        distance: 4,
        obstacle: {
          x: 0,
          y: 4,
          direction: 'N',
          wasHit: false,
          threatLevel: -1,
        },
      },
      right: {
        distance: 5,
        obstacle: null,
      },
    };
    expect(checkEnemyInRange(surroundings.front, -1)).toBe(true);
    expect(checkEnemyInRange(surroundings.back, -1)).toBe(true);
    expect(checkEnemyInRange(surroundings.left, -1)).toBe(true);
    expect(checkEnemyInRange(surroundings.right, -1)).toBe(false);
  });

  test('checkEnemyInRange should correctly identify no enemy in range with offset -1', () => {
    const surroundings = {
      front: {
        distance: 4,
        obstacle: 'wall',
      },
      back: {
        distance: 3,
        obstacle: 'wall',
      },
      left: {
        distance: 1,
        obstacle: 'wall',
      },
      right: {
        distance: 5,
        obstacle: null,
      },
    };
    expect(checkEnemyInRange(surroundings.front, -1)).toBe(false);
    expect(checkEnemyInRange(surroundings.back, -1)).toBe(false);
    expect(checkEnemyInRange(surroundings.left, -1)).toBe(false);
    expect(checkEnemyInRange(surroundings.right, -1)).toBe(false);
  });
});

describe('getMoves should return an array of available moves depending on the surroundings', () => {
  test(`getMoves should return ['L', 'R', 'T', 'F'] when front is not blocked`, () => {
    const moves = getMoves(2);
    assertType<Array>(moves);
    expect(moves).toHaveLength(4);
    expect(moves).toContain('L');
    expect(moves).toContain('R');
    expect(moves).toContain('T');
    expect(moves).toContain('F');
  });

  test(`getMoves should return ['L', 'R', 'T'] when front is blocked`, () => {
    const moves = getMoves(1);
    assertType<Array>(moves);
    expect(moves).toHaveLength(3);
    expect(moves).toContain('L');
    expect(moves).toContain('R');
    expect(moves).toContain('T');
    expect(moves).not.toContain('F');
  });
});

describe('evaluateDelta should return an expected value of delta with a given surroundings', () => {
  test('evaluateDelta should return 0 when there is no enemy is the surroundings', () => {
    const surroundings = {
      front: {
        distance: 5,
        obstacle: null,
      },
      back: {
        distance: 5,
        obstacle: null,
      },
      left: {
        distance: 5,
        obstacle: null,
      },
      right: {
        distance: 5,
        obstacle: null,
      },
    };
    const delta = evaluateDelta(surroundings);
    expect(delta).toBe(0);
  });

  test('evaluateDelta should return 0 when left, right and back have enemies facing away', () => {
    const surroundings = {
      front: {
        distance: 5,
        obstacle: null,
      },
      back: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 4,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      right: {
        distance: 2,
        obstacle: {
          x: 4,
          y: 6,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const delta = evaluateDelta(surroundings);
    expect(delta).toBe(0);
  });

  test('evaluateDelta should return a negative value when back has an enemy facing this way', () => {
    const surroundings = {
      front: {
        distance: 5,
        obstacle: null,
      },
      back: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 4,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      right: {
        distance: 2,
        obstacle: {
          x: 4,
          y: 6,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const delta = evaluateDelta(surroundings);
    assertType<Number>(delta);
    expect(delta).toBeLessThan(0);
  });

  test('evaluateDelta should return a negative value when left, right and back have enemies facing this way', () => {
    const surroundings = {
      front: {
        distance: 5,
        obstacle: null,
      },
      back: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 4,
          y: 2,
          direction: 'S',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      right: {
        distance: 2,
        obstacle: {
          x: 4,
          y: 6,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
    };
    const delta = evaluateDelta(surroundings);
    assertType<Number>(delta);
    expect(delta).toBeLessThan(0);
  });

  test('evaluateDelta should return a positive value when front has an enemy facing away', () => {
    const surroundings = {
      front: {
        distance: 3,
        obstacle: {
          x: 7,
          y: 4,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      back: {
        distance: 5,
        obstacle: null,
      },
      left: {
        distance: 5,
        obstacle: null,
      },
      right: {
        distance: 5,
        obstacle: null,
      },
    };
    const delta = evaluateDelta(surroundings);
    assertType<Number>(delta);
    expect(delta).toBeGreaterThan(0);
  });

  test('evaluateDelta should return 0 when front has an enemy facing this way', () => {
    const surroundings = {
      front: {
        distance: 3,
        obstacle: {
          x: 7,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 5,
        obstacle: null,
      },
      left: {
        distance: 5,
        obstacle: null,
      },
      right: {
        distance: 5,
        obstacle: null,
      },
    };
    const delta = evaluateDelta(surroundings);
    assertType<Number>(delta);
    expect(delta).toBe(0);
  });

  test('evaluateDelta should return a negative value when front and other directions have enemies facing this way', () => {
    const surroundings = {
      front: {
        distance: 3,
        obstacle: {
          x: 7,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 5,
        obstacle: null,
      },
      left: {
        distance: 2,
        obstacle: {
          x: 4,
          y: 2,
          direction: 'S',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      right: {
        distance: 5,
        obstacle: null,
      },
    };
    const delta = evaluateDelta(surroundings);
    assertType<Number>(delta);
    expect(delta).toBeLessThan(0);
  });

  test('evaluateDelta should return a negative value when front has an enemy facing away and back has an enemy facing this way', () => {
    const surroundings = {
      front: {
        distance: 3,
        obstacle: {
          x: 7,
          y: 4,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      back: {
        distance: 5,
        obstacle: null,
      },
      left: {
        distance: 2,
        obstacle: {
          x: 4,
          y: 2,
          direction: 'S',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      right: {
        distance: 5,
        obstacle: null,
      },
    };
    const delta = evaluateDelta(surroundings);
    assertType<Number>(delta);
    expect(delta).toBe(0);
  });
});

describe('getNextState should return the next state with the move and dimensions provided', () => {
  test('getNextState should return the current state when the move is T', () => {
    const ownState = {
      x: 4,
      y: 4,
      direction: 'E',
      wasHit: false,
      score: 0,
    };
    const move = 'T';
    const dims = [9, 9];
    const nextState = getNextState(ownState, move, dims);
    assertType<Object>(nextState);
    expect(nextState).toEqual(ownState);
  });

  test('getNextState should return a state facing N when the current direction is N and the move is L', () => {
    const ownState = {
      x: 4,
      y: 4,
      direction: 'E',
      wasHit: false,
      score: 0,
    };
    const move = 'L';
    const dims = [9, 9];
    const nextState = getNextState(ownState, move, dims);
    assertType<Object>(nextState);
    expect(nextState.x).toBe(ownState.x);
    expect(nextState.y).toBe(ownState.y);
    expect(nextState.direction).toBe('N');
  });

  test('getNextState should return a state facing S when the current direction is N and the move is R', () => {
    const ownState = {
      x: 4,
      y: 4,
      direction: 'E',
      wasHit: false,
      score: 0,
    };
    const move = 'R';
    const dims = [9, 9];
    const nextState = getNextState(ownState, move, dims);
    assertType<Object>(nextState);
    expect(nextState.x).toBe(ownState.x);
    expect(nextState.y).toBe(ownState.y);
    expect(nextState.direction).toBe('S');
  });

  test('getNextState should return a state at (5, 4) when the current location is (4, 4) while facing E and the move is F', () => {
    const ownState = {
      x: 4,
      y: 4,
      direction: 'E',
      wasHit: false,
      score: 0,
    };
    const move = 'F';
    const dims = [9, 9];
    const nextState = getNextState(ownState, move, dims);
    assertType<Object>(nextState);
    expect(nextState.x).toBe(ownState.x + 1);
    expect(nextState.y).toBe(ownState.y);
    expect(nextState.direction).toBe('E');
  });

  test('getNextState should return a state at (4, 5) when the current location is (4, 4) while facing S and the move is F', () => {
    const ownState = {
      x: 4,
      y: 4,
      direction: 'S',
      wasHit: false,
      score: 0,
    };
    const move = 'F';
    const dims = [9, 9];
    const nextState = getNextState(ownState, move, dims);
    assertType<Object>(nextState);
    expect(nextState.x).toBe(ownState.x);
    expect(nextState.y).toBe(ownState.y + 1);
    expect(nextState.direction).toBe('S');
  });

  test('getNextState should return a state at (3, 4) when the current location is (4, 4) while facing W and the move is F', () => {
    const ownState = {
      x: 4,
      y: 4,
      direction: 'W',
      wasHit: false,
      score: 0,
    };
    const move = 'F';
    const dims = [9, 9];
    const nextState = getNextState(ownState, move, dims);
    assertType<Object>(nextState);
    expect(nextState.x).toBe(ownState.x - 1);
    expect(nextState.y).toBe(ownState.y);
    expect(nextState.direction).toBe('W');
  });

  test('getNextState should return a state at (4, 3) when the current location is (4, 4) while facing N and the move is F', () => {
    const ownState = {
      x: 4,
      y: 4,
      direction: 'N',
      wasHit: false,
      score: 0,
    };
    const move = 'F';
    const dims = [9, 9];
    const nextState = getNextState(ownState, move, dims);
    assertType<Object>(nextState);
    expect(nextState.x).toBe(ownState.x);
    expect(nextState.y).toBe(ownState.y - 1);
    expect(nextState.direction).toBe('N');
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

describe('escapeNew should return a rational decision of a relative direction when blocked in all relative directions', () => {
  test('escapeNew should return T when blocked in all relative directions and facing an enemy', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: {
          x: 0,
          y: 1,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      back: {
        distance: 1,
        obstacle: 'wall',
      },
      left: {
        distance: 1,
        obstacle: 'wall',
      },
      right: {
        distance: 1,
        obstacle: 'wall',
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('T');
  });

  test('escapeNew should return L when blocked in all relative directions and only left has an enemy', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: 'wall',
      },
      back: {
        distance: 1,
        obstacle: 'wall',
      },
      left: {
        distance: 1,
        obstacle: {
          x: 0,
          y: 1,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      right: {
        distance: 1,
        obstacle: 'wall',
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('L');
  });

  test('escapeNew should return R when blocked in all relative directions and only right has an enemy', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: 'wall',
      },
      back: {
        distance: 1,
        obstacle: 'wall',
      },
      left: {
        distance: 1,
        obstacle: 'wall',
      },
      right: {
        distance: 1,
        obstacle: {
          x: 1,
          y: 0,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('R');
  });

  test('escapeNew should return L when blocked in all relative directions and both left and right have enemies while the one on the left has a higher score', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: 'wall',
      },
      back: {
        distance: 1,
        obstacle: 'wall',
      },
      left: {
        distance: 1,
        obstacle: {
          x: 0,
          y: 0,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: -1,
        },
      },
      right: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('L');
  });

  test('escapeNew should return R when blocked in all relative directions and both left and right have enemies while the one on the right has a higher score', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: 'wall',
      },
      back: {
        distance: 1,
        obstacle: 'wall',
      },
      left: {
        distance: 1,
        obstacle: {
          x: 0,
          y: 0,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: -1,
        },
      },
      right: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'W',
          wasHit: false,
          score: 3,
          threatLevel: 1,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('R');
  });

  test('escapeNew should return L or R when blocked in all relative directions and only back has an enemy', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: 'wall',
      },
      back: {
        distance: 1,
        obstacle: {
          x: 0,
          y: 1,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        }
      },
      left: {
        distance: 1,
        obstacle: 'wall',
      },
      right: {
        distance: 1,
        obstacle: 'wall',
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(['L', 'R']).toContain(action);
  });
});

describe('escapeNew should return a rational decision of a relative direction when blocked in 3 relative directions', () => {
  test('escapeNew should return F when blocked from the left, right and back with no enemy on the front', () => {
    const surroundings = {
      front: {
        distance: 2,
        obstacle: 'wall',
      },
      back: {
        distance: 1,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      left: {
        distance: 1,
        obstacle: 'wall',
      },
      right: {
        distance: 1,
        obstacle: {
          x: 1,
          y: 1,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('F');
  });

  test('escapeNew should return F when blocked from the left, right and back with an enemy on the front', () => {
    const surroundings = {
      front: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 0,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      back: {
        distance: 1,
        obstacle: {
          x: 0,
          y: 3,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 1,
        obstacle: 'wall',
      },
      right: {
        distance: 1,
        obstacle: {
          x: 1,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('F');
  });

  test('escapeNew should return L when blocked from the front, right and back with no enemy on the left', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: 'wall',
      },
      back: {
        distance: 1,
        obstacle: {
          x: 1,
          y: 2,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      left: {
        distance: 2,
        obstacle: 'wall',
      },
      right: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 3,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('L');
  });

  test('escapeNew should return L when blocked from the front, right and back with an enemy on the left', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: 'wall',
      },
      back: {
        distance: 1,
        obstacle: {
          x: 1,
          y: 2,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      right: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 3,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('L');
  });

  test('escapeNew should return R when blocked from the front, left and back with no enemy on the right', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: 'wall',
      },
      back: {
        distance: 1,
        obstacle: {
          x: 1,
          y: 2,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      left: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 1,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      right: {
        distance: 2,
        obstacle: 'wall'
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('R');
  });

  test('escapeNew should return R when blocked from the front, left and back with an enemy on the right', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: 'wall',
      },
      back: {
        distance: 1,
        obstacle: {
          x: 1,
          y: 2,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      left: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 1,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('R');
  });

  test('escapeNew should return L when blocked from the front, left and right with the left enemy has a higher score', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: {
          x: 3,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 1,
          direction: 'E',
          wasHit: false,
          score: 1,
          threatLevel: 0,
        },
      },
      right: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 3,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('L');
  });

  test('escapeNew should return R when blocked from the front, left and right with the right enemy has a higher score', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: {
          x: 3,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 1,
          direction: 'E',
          wasHit: false,
          score: 1,
          threatLevel: 0,
        },
      },
      right: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 3,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('R');
  });

  test('escapeNew should return L when blocked from the front, left and right while only left has an enemy', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: {
          x: 3,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 1,
          direction: 'E',
          wasHit: false,
          score: 1,
          threatLevel: 0,
        },
      },
      right: {
        distance: 1,
        obstacle: 'wall',
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('L');
  });

  test('escapeNew should return R when blocked from the front, left and right while only right has an enemy', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: {
          x: 3,
          y: 1,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 1,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 1,
        obstacle: 'wall',
      },
      right: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('R');
  });
});

describe('escapeNew should return a rational decision of a relative direction when blocked in 2 relative directions', () => {
  test('escapeNew should return F when blocked from the left and right', () => {
    const surroundings = {
      front: {
        distance: 2,
        obstacle: {
          x: 4,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: 'wall',
      },
      left: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 1,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      right: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 3,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('F');
  });

  test('escapeNew should return R when blocked from the front and left', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: {
          x: 3,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: 'wall',
      },
      left: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 1,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('R');
  });

  test('escapeNew should return L when blocked from the front and right', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: {
          x: 3,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: 'wall',
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      right: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 3,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('L');
  });

  test('escapeNew should return F when blocked from the left and back with at least 1 enemy facing this way from the left or right', () => {
    const surroundings = {
      front: {
        distance: 2,
        obstacle: {
          x: 4,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 1,
        obstacle: {
          x: 1,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 1,
          direction: 'S',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('F');
  });

  test('escapeNew should return F when blocked from the left and back with no enemy facing this way from the front or back', () => {
    const surroundings = {
      front: {
        distance: 2,
        obstacle: {
          x: 4,
          y: 2,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      back: {
        distance: 1,
        obstacle: {
          x: 1,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 1,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('F');
  });

  test('escapeNew should return R when blocked from the left and back with some enemies facing this way only from the front or back', () => {
    const surroundings = {
      front: {
        distance: 2,
        obstacle: {
          x: 4,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 1,
        obstacle: {
          x: 1,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 1,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('R');
  });

  test('escapeNew should return F when blocked from the right and back with at least 1 enemy facing this way from the left or right', () => {
    const surroundings = {
      front: {
        distance: 2,
        obstacle: {
          x: 4,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 1,
        obstacle: {
          x: 1,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'S',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      right: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 3,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('F');
  });

  test('escapeNew should return F when blocked from the right and back with no enemy facing this way from the front or back', () => {
    const surroundings = {
      front: {
        distance: 2,
        obstacle: {
          x: 4,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      back: {
        distance: 1,
        obstacle: {
          x: 1,
          y: 2,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'S',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      right: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 3,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('F');
  });

  test('escapeNew should return L when blocked from the right and back with some enemies facing this way only from the front or back', () => {
    const surroundings = {
      front: {
        distance: 2,
        obstacle: {
          x: 4,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 1,
        obstacle: {
          x: 1,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      right: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 3,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('L');
  });

  test('escapeNew should return L when blocked from the front and back with the left enemy has a higher score', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: {
          x: 3,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 1,
        obstacle: {
          x: 1,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'E',
          wasHit: false,
          score: 1,
          threatLevel: 0,
        },
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('L');
  });

  test('escapeNew should return R when blocked from the front and back with the right enemy has a higher score', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: {
          x: 3,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 1,
        obstacle: {
          x: 1,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'E',
          wasHit: false,
          score: 1,
          threatLevel: 0,
        },
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('R');
  });

  test('escapeNew should return L when blocked from the front and back while only left has an enemy', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: {
          x: 3,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 1,
        obstacle: {
          x: 1,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'E',
          wasHit: false,
          score: 1,
          threatLevel: 0,
        },
      },
      right: {
        distance: 2,
        obstacle: 'wall',
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('L');
  });

  test('escapeNew should return R when blocked from the front and back while only right has an enemy', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: {
          x: 3,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 1,
        obstacle: {
          x: 1,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 2,
        obstacle: 'wall',
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('R');
  });
});

describe('escapeNew should return a rational decision of a relative direction when blocked in 1 relative direction', () => {
  test('escapeNew should return F when blocked from the left with at least 1 enemy facing this way from the left or right', () => {
    const surroundings = {
      front: {
        distance: 2,
        obstacle: {
          x: 4,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 1,
          direction: 'S',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('F');
  });

  test('escapeNew should return F when blocked from the left with no enemy facing this way from the front or back', () => {
    const surroundings = {
      front: {
        distance: 2,
        obstacle: {
          x: 4,
          y: 2,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 1,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('F');
  });

  test('escapeNew should return R when blocked from the left with some enemies facing this way only from the front or back', () => {
    const surroundings = {
      front: {
        distance: 2,
        obstacle: {
          x: 4,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 1,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('R');
  });

  test('escapeNew should return F when blocked from the right with at least 1 enemy facing this way from the left or right', () => {
    const surroundings = {
      front: {
        distance: 2,
        obstacle: {
          x: 4,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'S',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      right: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 3,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('F');
  });

  test('escapeNew should return F when blocked from the right with no enemy facing this way from the front or back', () => {
    const surroundings = {
      front: {
        distance: 2,
        obstacle: {
          x: 4,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'S',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      right: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 3,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('F');
  });

  test('escapeNew should return L when blocked from the right with some enemies facing this way only from the front or back', () => {
    const surroundings = {
      front: {
        distance: 2,
        obstacle: {
          x: 4,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      right: {
        distance: 1,
        obstacle: {
          x: 2,
          y: 3,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('L');
  });

  test('escapeNew should return L when blocked from the front with the left enemy has a higher score', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: {
          x: 3,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'E',
          wasHit: false,
          score: 1,
          threatLevel: 0,
        },
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('L');
  });

  test('escapeNew should return R when blocked from the front with the right enemy has a higher score', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: {
          x: 3,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'E',
          wasHit: false,
          score: 1,
          threatLevel: 0,
        },
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('R');
  });

  test('escapeNew should return L when blocked from the front while only left has an enemy', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: {
          x: 3,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'E',
          wasHit: false,
          score: 1,
          threatLevel: 0,
        },
      },
      right: {
        distance: 2,
        obstacle: 'wall',
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('L');
  });

  test('escapeNew should return R when blocked from the front while only right has an enemy', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: {
          x: 3,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 2,
        obstacle: 'wall',
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('R');
  });
});

describe('escapeNew should return a rational decision of a relative direction when unblocked in all relative direction', () => {
  test('escapeNew should return F when unblocked with at least 1 enemy facing this way from the left or right', () => {
    const surroundings = {
      front: {
        distance: 2,
        obstacle: {
          x: 4,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'S',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('F');
  });

  test('escapeNew should return F when unblocked with no enemy facing this way from the front or back', () => {
    const surroundings = {
      front: {
        distance: 2,
        obstacle: {
          x: 4,
          y: 2,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('F');
  });

  test('escapeNew should return L when unblocked with some enemies facing this way only from the front or back while the left enemy has a higher score', () => {
    const surroundings = {
      front: {
        distance: 2,
        obstacle: {
          x: 4,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'E',
          wasHit: false,
          score: 1,
          threatLevel: 0,
        },
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('L');
  });

  test('escapeNew should return R when unblocked with some enemies facing this way only from the front or back while the right enemy has a higher score', () => {
    const surroundings = {
      front: {
        distance: 2,
        obstacle: {
          x: 4,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'E',
          wasHit: false,
          score: 1,
          threatLevel: 0,
        },
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('R');
  });

  test('escapeNew should return L when unblocked with some enemies facing this way only from the front or back while only left has an enemy', () => {
    const surroundings = {
      front: {
        distance: 2,
        obstacle: {
          x: 4,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'E',
          wasHit: false,
          score: 1,
          threatLevel: 0,
        },
      },
      right: {
        distance: 2,
        obstacle: 'wall',
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('L');
  });

  test('escapeNew should return R when unblocked with some enemies facing this way only from the front or back while only right has an enemy', () => {
    const surroundings = {
      front: {
        distance: 2,
        obstacle: {
          x: 4,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 2,
        obstacle: 'wall',
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: 0,
        },
      },
    };
    const action = escapeNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('R');
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

describe('huntNew should return a rational decision of a relative direction when front has an immediate target', () => {
  test('huntNew should return T when front has an immediate target', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: {
          x: 3,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'E',
          wasHit: false,
          score: 1,
          threatLevel: 0,
        },
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const action = huntNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('T');
  });
});

describe('huntNew should return a rational decision of a relative direction when front has no room to move', () => {
  test('huntNew should return L when blocked from the front with the left enemy has a higher score', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: 'wall',
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'E',
          wasHit: false,
          score: 1,
          threatLevel: 0,
        },
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const action = huntNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('L');
  });

  test('huntNew should return R when blocked from the front with the right enemy has a higher score', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: 'wall',
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'E',
          wasHit: false,
          score: 1,
          threatLevel: 0,
        },
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: 0,
        },
      },
    };
    const action = huntNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('R');
  });

  test('huntNew should return L when blocked from the front while only left has an enemy', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: 'wall',
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'E',
          wasHit: false,
          score: 1,
          threatLevel: 0,
        },
      },
      right: {
        distance: 2,
        obstacle: 'wall',
      },
    };
    const action = huntNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('L');
  });

  test('huntNew should return R when blocked from the front while only right has an enemy', () => {
    const surroundings = {
      front: {
        distance: 1,
        obstacle: 'wall',
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 2,
        obstacle: 'wall',
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: 0,
        },
      },
    };
    const action = huntNew(surroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('R');
  });
});

describe('huntNew should return a rational decision of a relative direction when front has an enemy just out of reach', () => {
  test('huntNew should return F when front has an enemy just out of reach while left and right have no enemy', () => {
    const surroundings = {
      front: {
        distance: 4,
        obstacle: {
          x: 6,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 2,
        obstacle: 'wall',
      },
      right: {
        distance: 2,
        obstacle: 'wall',
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 3,
        obstacle: {
          x: 6,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 3,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 2,
        obstacle: 'wall',
      },
      right: {
        distance: 2,
        obstacle: 'wall',
      },
    };
    const action = huntNew(surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('F');
  });

  test('huntNew should return F when front has an enemy just out of reach while right has an enemy within range of throw with at least 1 enemy facing this way from the left or right', () => {
    const surroundings = {
      front: {
        distance: 4,
        obstacle: {
          x: 6,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 3,
        obstacle: 'wall',
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 3,
        obstacle: {
          x: 6,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 3,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 3,
        obstacle: 'wall',
      },
      right: {
        distance: 3,
        obstacle: 'wall',
      },
    };
    const action = huntNew(surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('F');
  });

  test('huntNew should return F when front has an enemy just out of reach while right has an enemy within range of throw with no enemy facing this way from the front or back', () => {
    const surroundings = {
      front: {
        distance: 4,
        obstacle: {
          x: 6,
          y: 2,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 3,
        obstacle: 'wall',
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 3,
        obstacle: {
          x: 6,
          y: 2,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      back: {
        distance: 3,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 3,
        obstacle: 'wall',
      },
      right: {
        distance: 3,
        obstacle: 'wall',
      },
    };
    const action = huntNew(surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('F');
  });

  test('huntNew should return R when front has an enemy just out of reach while right has an enemy within range of throw with some enemies facing this way only from the front or back', () => {
    const surroundings = {
      front: {
        distance: 4,
        obstacle: {
          x: 6,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 3,
        obstacle: 'wall',
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 3,
        obstacle: {
          x: 6,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 3,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 3,
        obstacle: 'wall',
      },
      right: {
        distance: 3,
        obstacle: 'wall',
      },
    };
    const action = huntNew(surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('R');
  });

  test('huntNew should return F when front has an enemy just out of reach while left has an enemy within range of throw with at least 1 enemy facing this way from the left or right', () => {
    const surroundings = {
      front: {
        distance: 4,
        obstacle: {
          x: 6,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'S',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      right: {
        distance: 3,
        obstacle: 'wall',
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 3,
        obstacle: {
          x: 6,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 3,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 3,
        obstacle: 'wall',
      },
      right: {
        distance: 3,
        obstacle: 'wall',
      },
    };
    const action = huntNew(surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('F');
  });

  test('huntNew should return F when front has an enemy just out of reach while left has an enemy within range of throw with no enemy facing this way from the front or back', () => {
    const surroundings = {
      front: {
        distance: 4,
        obstacle: {
          x: 6,
          y: 2,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      right: {
        distance: 3,
        obstacle: 'wall',
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 3,
        obstacle: {
          x: 6,
          y: 2,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      back: {
        distance: 3,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 3,
        obstacle: 'wall',
      },
      right: {
        distance: 3,
        obstacle: 'wall',
      },
    };
    const action = huntNew(surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('F');
  });

  test('huntNew should return L when front has an enemy just out of reach while left has an enemy within range of throw with some enemies facing this way only from the front or back', () => {
    const surroundings = {
      front: {
        distance: 4,
        obstacle: {
          x: 6,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      right: {
        distance: 3,
        obstacle: 'wall',
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 3,
        obstacle: {
          x: 6,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 3,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 3,
        obstacle: 'wall',
      },
      right: {
        distance: 3,
        obstacle: 'wall',
      },
    };
    const action = huntNew(surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('L');
  });

  test('huntNew should return F when front has an enemy just out of reach and left and right have enemies within range of throw with at least 1 enemy facing this way from the left or right', () => {
    const surroundings = {
      front: {
        distance: 4,
        obstacle: {
          x: 6,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'S',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 3,
        obstacle: {
          x: 6,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 3,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 3,
        obstacle: 'wall',
      },
      right: {
        distance: 3,
        obstacle: 'wall',
      },
    };
    const action = huntNew(surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('F');
  });

  test('huntNew should return F when front has an enemy just out of reach and left and right have enemies within range of throw with no enemy facing this way from the front or back', () => {
    const surroundings = {
      front: {
        distance: 4,
        obstacle: {
          x: 6,
          y: 2,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 3,
        obstacle: {
          x: 6,
          y: 2,
          direction: 'N',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
      back: {
        distance: 3,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: -1,
        },
      },
      left: {
        distance: 3,
        obstacle: 'wall',
      },
      right: {
        distance: 3,
        obstacle: 'wall',
      },
    };
    const action = huntNew(surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('F');
  });

  test('huntNew should return L when front has an enemy just out of reach and left and right have enemies within range of throw with some enemies facing this way only from the front or back while the left enemy has a higher score', () => {
    const surroundings = {
      front: {
        distance: 4,
        obstacle: {
          x: 6,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'E',
          wasHit: false,
          score: 1,
          threatLevel: 0,
        },
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 0,
        },
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 3,
        obstacle: {
          x: 6,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 3,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 3,
        obstacle: 'wall',
      },
      right: {
        distance: 3,
        obstacle: 'wall',
      },
    };
    const action = huntNew(surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('L');
  });

  test('huntNew should return R when front has an enemy just out of reach and left and right have enemies within range of throw with some enemies facing this way only from the front or back while the right enemy has a higher score', () => {
    const surroundings = {
      front: {
        distance: 4,
        obstacle: {
          x: 6,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 0,
          direction: 'E',
          wasHit: false,
          score: 1,
          threatLevel: 0,
        },
      },
      right: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: 0,
        },
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 3,
        obstacle: {
          x: 6,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 3,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 3,
        obstacle: 'wall',
      },
      right: {
        distance: 3,
        obstacle: 'wall',
      },
    };
    const action = huntNew(surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('R');
  });
});

describe('huntNew should return a rational decision of a relative direction when no enemy reachable at cost 1', () => {
  test('huntNew should return F when front has fewer enemies facing this way from left and right than those at the current location', () => {
    const surroundings = {
      front: {
        distance: 5,
        obstacle: {
          x: 9,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 5,
        obstacle: 'wall',
      },
      right: {
        distance: 4,
        obstacle: {
          x: 4,
          y: 8,
          direction: 'N',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 4,
        obstacle: {
          x: 9,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 3,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 5,
        obstacle: 'wall',
      },
      right: {
        distance: 5,
        obstacle: 'wall',
      },
    };
    const action = huntNew(surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('F');
  });

  test('huntNew should return L when front has more enemies facing this way from left and right than those at the current location with the left enemy has a higher score', () => {
    const surroundings = {
      front: {
        distance: 5,
        obstacle: {
          x: 9,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 4,
        obstacle: {
          x: 4,
          y: 0,
          direction: 'E',
          wasHit: false,
          score: 2,
          threatLevel: 0,
        },
      },
      right: {
        distance: 4,
        obstacle: {
          x: 4,
          y: 8,
          direction: 'N',
          wasHit: false,
          score: 1,
          threatLevel: 1,
        },
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 4,
        obstacle: {
          x: 7,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 3,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 3,
        obstacle: {
          x: 3,
          y: 1,
          direction: 'S',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      right: {
        distance: 3,
        obstacle: {
          x: 3,
          y: 7,
          direction: 'N',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
    };
    const action = huntNew(surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('L');
  });

  test('huntNew should return R when front has more enemies facing this way from left and right than those at the current location with the right enemy has a higher score', () => {
    const surroundings = {
      front: {
        distance: 5,
        obstacle: {
          x: 9,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 4,
        obstacle: {
          x: 4,
          y: 0,
          direction: 'E',
          wasHit: false,
          score: 2,
          threatLevel: 0,
        },
      },
      right: {
        distance: 4,
        obstacle: {
          x: 4,
          y: 8,
          direction: 'N',
          wasHit: false,
          score: 4,
          threatLevel: 1,
        },
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 4,
        obstacle: {
          x: 7,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 3,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 3,
        obstacle: {
          x: 3,
          y: 1,
          direction: 'S',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      right: {
        distance: 3,
        obstacle: {
          x: 3,
          y: 7,
          direction: 'N',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
    };
    const action = huntNew(surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('R');
  });

  test('huntNew should return L when front has more enemies facing this way from left and right than those at the current location while left but right has an enemy', () => {
    const surroundings = {
      front: {
        distance: 5,
        obstacle: {
          x: 9,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 4,
        obstacle: {
          x: 4,
          y: 0,
          direction: 'S',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      right: {
        distance: 4,
        obstacle: 'wall',
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 4,
        obstacle: {
          x: 7,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 3,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 3,
        obstacle: {
          x: 3,
          y: 1,
          direction: 'S',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      right: {
        distance: 3,
        obstacle: {
          x: 3,
          y: 7,
          direction: 'N',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
    };
    const action = huntNew(surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('L');
  });

  test('huntNew should return R when front has more enemies facing this way from left and right than those at the current location while right but left has an enemy', () => {
    const surroundings = {
      front: {
        distance: 5,
        obstacle: {
          x: 9,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 4,
        obstacle: 'wall',
      },
      right: {
        distance: 4,
        obstacle: {
          x: 4,
          y: 8,
          direction: 'N',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 4,
        obstacle: {
          x: 7,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      back: {
        distance: 3,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 3,
        obstacle: {
          x: 3,
          y: 1,
          direction: 'S',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      right: {
        distance: 3,
        obstacle: {
          x: 3,
          y: 7,
          direction: 'N',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
    };
    const action = huntNew(surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('R');
  });

  test.todo('huntNew should return F when front and current location have equal number of enemies facing this way from left and right with the front enemy has a highest score among all proximal targets at cost 2', () => {
    const surroundings = {
      front: {
        distance: 5,
        obstacle: {
          x: 9,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 3,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 4,
        obstacle: {
          x: 4,
          y: 0,
          direction: 'E',
          wasHit: false,
          score: 2,
          threatLevel: 0,
        },
      },
      right: {
        distance: 4,
        obstacle: {
          x: 4,
          y: 8,
          direction: 'N',
          wasHit: false,
          score: 1,
          threatLevel: 1,
        },
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 4,
        obstacle: {
          x: 7,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 3,
          threatLevel: 1,
        },
      },
      back: {
        distance: 3,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 3,
        obstacle: {
          x: 3,
          y: 1,
          direction: 'S',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      right: {
        distance: 3,
        obstacle: {
          x: 3,
          y: 7,
          direction: 'S',
          wasHit: false,
          score: 2,
          threatLevel: -1,
        },
      },
    };
    const action = huntNew(surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('F');
  });

  test.todo('huntNew should return F when front and current location have equal number of enemies facing this way from left and right with the front, left enemy has a highest score among all proximal targets at cost 2', () => {
    const surroundings = {
      front: {
        distance: 5,
        obstacle: {
          x: 9,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 4,
        obstacle: {
          x: 4,
          y: 0,
          direction: 'E',
          wasHit: false,
          score: 2,
          threatLevel: 0,
        },
      },
      right: {
        distance: 4,
        obstacle: {
          x: 4,
          y: 8,
          direction: 'N',
          wasHit: false,
          score: 1,
          threatLevel: 1,
        },
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 4,
        obstacle: {
          x: 7,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      back: {
        distance: 3,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 3,
        obstacle: {
          x: 3,
          y: 1,
          direction: 'S',
          wasHit: false,
          score: 3,
          threatLevel: 1,
        },
      },
      right: {
        distance: 3,
        obstacle: {
          x: 3,
          y: 7,
          direction: 'S',
          wasHit: false,
          score: 2,
          threatLevel: -1,
        },
      },
    };
    const action = huntNew(surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('F');
  });

  test.todo('huntNew should return F when front and current location have equal number of enemies facing this way from left and right with the front, right enemy has a highest score among all proximal targets at cost 2', () => {
    const surroundings = {
      front: {
        distance: 5,
        obstacle: {
          x: 9,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 4,
        obstacle: {
          x: 4,
          y: 0,
          direction: 'E',
          wasHit: false,
          score: 2,
          threatLevel: 0,
        },
      },
      right: {
        distance: 4,
        obstacle: {
          x: 4,
          y: 8,
          direction: 'N',
          wasHit: false,
          score: 1,
          threatLevel: 1,
        },
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 4,
        obstacle: {
          x: 7,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      back: {
        distance: 3,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 3,
        obstacle: {
          x: 3,
          y: 1,
          direction: 'S',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      right: {
        distance: 3,
        obstacle: {
          x: 3,
          y: 7,
          direction: 'S',
          wasHit: false,
          score: 3,
          threatLevel: -1,
        },
      },
    };
    const action = huntNew(surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('F');
  });

  test.todo('huntNew should return L when front and current location have equal number of enemies facing this way from left and right with the left enemy has a highest score among all proximal targets at cost 2', () => {
    const surroundings = {
      front: {
        distance: 5,
        obstacle: {
          x: 9,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 4,
        obstacle: {
          x: 4,
          y: 0,
          direction: 'E',
          wasHit: false,
          score: 3,
          threatLevel: 0,
        },
      },
      right: {
        distance: 4,
        obstacle: {
          x: 4,
          y: 8,
          direction: 'N',
          wasHit: false,
          score: 1,
          threatLevel: 1,
        },
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 4,
        obstacle: {
          x: 7,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      back: {
        distance: 3,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 3,
        obstacle: {
          x: 3,
          y: 1,
          direction: 'S',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      right: {
        distance: 3,
        obstacle: {
          x: 3,
          y: 7,
          direction: 'S',
          wasHit: false,
          score: 2,
          threatLevel: -1,
        },
      },
    };
    const action = huntNew(surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('L');
  });

  test.todo('huntNew should return R when front and current location have equal number of enemies facing this way from left and right with the right enemy has a highest score among all proximal targets at cost 2', () => {
    const surroundings = {
      front: {
        distance: 5,
        obstacle: {
          x: 9,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 4,
        obstacle: {
          x: 4,
          y: 0,
          direction: 'E',
          wasHit: false,
          score: 1,
          threatLevel: 0,
        },
      },
      right: {
        distance: 4,
        obstacle: {
          x: 4,
          y: 8,
          direction: 'N',
          wasHit: false,
          score: 3,
          threatLevel: 1,
        },
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 4,
        obstacle: {
          x: 7,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      back: {
        distance: 3,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 0,
          threatLevel: 1,
        },
      },
      left: {
        distance: 3,
        obstacle: {
          x: 3,
          y: 1,
          direction: 'S',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      right: {
        distance: 3,
        obstacle: {
          x: 3,
          y: 7,
          direction: 'S',
          wasHit: false,
          score: 2,
          threatLevel: -1,
        },
      },
    };
    const action = huntNew(surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('R');
  });

  test.todo('huntNew should return L when front and current location have equal number of enemies facing this way from left and right with the back enemy has a highest score among all proximal targets at cost 2 while the left one has a higher score than the right one', () => {
    const surroundings = {
      front: {
        distance: 5,
        obstacle: {
          x: 9,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'E',
          wasHit: false,
          score: 5,
          threatLevel: 1,
        },
      },
      left: {
        distance: 4,
        obstacle: {
          x: 4,
          y: 0,
          direction: 'E',
          wasHit: false,
          score: 3,
          threatLevel: 0,
        },
      },
      right: {
        distance: 4,
        obstacle: {
          x: 4,
          y: 8,
          direction: 'N',
          wasHit: false,
          score: 1,
          threatLevel: 1,
        },
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 4,
        obstacle: {
          x: 7,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      back: {
        distance: 3,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 5,
          threatLevel: 1,
        },
      },
      left: {
        distance: 3,
        obstacle: {
          x: 3,
          y: 1,
          direction: 'S',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      right: {
        distance: 3,
        obstacle: {
          x: 3,
          y: 7,
          direction: 'S',
          wasHit: false,
          score: 2,
          threatLevel: -1,
        },
      },
    };
    const action = huntNew(surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('L');
  });

  test.todo('huntNew should return R when front and current location have equal number of enemies facing this way from left and right with the back enemy has a highest score among all proximal targets at cost 2 while the right one has a higher score than the left one', () => {
    const surroundings = {
      front: {
        distance: 5,
        obstacle: {
          x: 9,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'E',
          wasHit: false,
          score: 5,
          threatLevel: 1,
        },
      },
      left: {
        distance: 4,
        obstacle: {
          x: 4,
          y: 0,
          direction: 'E',
          wasHit: false,
          score: 1,
          threatLevel: 0,
        },
      },
      right: {
        distance: 4,
        obstacle: {
          x: 4,
          y: 8,
          direction: 'N',
          wasHit: false,
          score: 3,
          threatLevel: 1,
        },
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 4,
        obstacle: {
          x: 7,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      back: {
        distance: 3,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 5,
          threatLevel: 1,
        },
      },
      left: {
        distance: 3,
        obstacle: {
          x: 3,
          y: 1,
          direction: 'S',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      right: {
        distance: 3,
        obstacle: {
          x: 3,
          y: 7,
          direction: 'S',
          wasHit: false,
          score: 2,
          threatLevel: -1,
        },
      },
    };
    const action = huntNew(surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('R');
  });

  test('huntNew should return L when front and current location have equal number of enemies facing this way from left and right with the back enemy has a highest score among all proximal targets at cost 2 while left but right has an enemy', () => {
    const surroundings = {
      front: {
        distance: 5,
        obstacle: {
          x: 9,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'E',
          wasHit: false,
          score: 5,
          threatLevel: 1,
        },
      },
      left: {
        distance: 4,
        obstacle: {
          x: 4,
          y: 0,
          direction: 'E',
          wasHit: false,
          score: 3,
          threatLevel: 0,
        },
      },
      right: {
        distance: 5,
        obstacle: null,
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 4,
        obstacle: {
          x: 7,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      back: {
        distance: 3,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 5,
          threatLevel: 1,
        },
      },
      left: {
        distance: 3,
        obstacle: {
          x: 3,
          y: 1,
          direction: 'S',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      right: {
        distance: 3,
        obstacle: {
          x: 3,
          y: 7,
          direction: 'S',
          wasHit: false,
          score: 2,
          threatLevel: -1,
        },
      },
    };
    const action = huntNew(surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('L');
  });

  test.todo('huntNew should return R when front and current location have equal number of enemies facing this way from left and right with the back enemy has a highest score among all proximal targets at cost 2 while right but left has an enemy', () => {
    const surroundings = {
      front: {
        distance: 5,
        obstacle: {
          x: 9,
          y: 4,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      back: {
        distance: 2,
        obstacle: {
          x: 2,
          y: 4,
          direction: 'E',
          wasHit: false,
          score: 5,
          threatLevel: 1,
        },
      },
      left: {
        distance: 5,
        obstacle: null,
      },
      right: {
        distance: 4,
        obstacle: {
          x: 4,
          y: 8,
          direction: 'N',
          wasHit: false,
          score: 3,
          threatLevel: 1,
        },
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 4,
        obstacle: {
          x: 7,
          y: 2,
          direction: 'W',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      back: {
        distance: 3,
        obstacle: {
          x: 0,
          y: 2,
          direction: 'E',
          wasHit: false,
          score: 5,
          threatLevel: 1,
        },
      },
      left: {
        distance: 3,
        obstacle: {
          x: 3,
          y: 1,
          direction: 'S',
          wasHit: false,
          score: 2,
          threatLevel: 1,
        },
      },
      right: {
        distance: 3,
        obstacle: {
          x: 3,
          y: 7,
          direction: 'S',
          wasHit: false,
          score: 2,
          threatLevel: -1,
        },
      },
    };
    const action = huntNew(surroundings, forwardSurroundings);
    assertType<String>(action);
    expect(action).toHaveLength(1);
    expect(action).toBe('R');
  });
});

describe('huntNew should return a rational decision of a relative direction when no enemy reachable at cost 2', () => {
  test('huntNew should return L when no enemy reachable at cost 2 and the target is on the left', () => {
    const surroundings = {
      front: {
        distance: 5,
        obstacle: null,
      },
      back: {
        distance: 5,
        obstacle: null,
      },
      left: {
        distance: 5,
        obstacle: null,
      },
      right: {
        distance: 5,
        obstacle: null,
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 5,
        obstacle: null,
      },
      back: {
        distance: 5,
        obstacle: null,
      },
      left: {
        distance: 5,
        obstacle: null,
      },
      right: {
        distance: 5,
        obstacle: null,
      },
    };
    const targetLocator = {
      longitudinal: 0,
      transverse: -6,
    };
    const action = huntNew(surroundings, forwardSurroundings, targetLocator);
    expect(action).toBe('L');
  });

  test('huntNew should return F or L when no enemy reachable at cost 2 and the target is on the front-left', () => {
    const surroundings = {
      front: {
        distance: 5,
        obstacle: null,
      },
      back: {
        distance: 5,
        obstacle: null,
      },
      left: {
        distance: 5,
        obstacle: null,
      },
      right: {
        distance: 5,
        obstacle: null,
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 5,
        obstacle: null,
      },
      back: {
        distance: 5,
        obstacle: null,
      },
      left: {
        distance: 5,
        obstacle: null,
      },
      right: {
        distance: 5,
        obstacle: null,
      },
    };
    const targetLocator = {
      longitudinal: 2,
      transverse: -6,
    };
    const action = huntNew(surroundings, forwardSurroundings, targetLocator);
    expect(['F', 'L']).toContain(action);
  });

  test('huntNew should return L when no enemy reachable at cost 2 and the target is on the back-left', () => {
    const surroundings = {
      front: {
        distance: 5,
        obstacle: null,
      },
      back: {
        distance: 5,
        obstacle: null,
      },
      left: {
        distance: 5,
        obstacle: null,
      },
      right: {
        distance: 5,
        obstacle: null,
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 5,
        obstacle: null,
      },
      back: {
        distance: 5,
        obstacle: null,
      },
      left: {
        distance: 5,
        obstacle: null,
      },
      right: {
        distance: 5,
        obstacle: null,
      },
    };
    const targetLocator = {
      longitudinal: -8,
      transverse: -6,
    };
    const action = huntNew(surroundings, forwardSurroundings, targetLocator);
    expect(action).toBe('L');
  });

  test('huntNew should return R when no enemy reachable at cost 2 and the target is on the right', () => {
    const surroundings = {
      front: {
        distance: 5,
        obstacle: null,
      },
      back: {
        distance: 5,
        obstacle: null,
      },
      left: {
        distance: 5,
        obstacle: null,
      },
      right: {
        distance: 5,
        obstacle: null,
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 5,
        obstacle: null,
      },
      back: {
        distance: 5,
        obstacle: null,
      },
      left: {
        distance: 5,
        obstacle: null,
      },
      right: {
        distance: 5,
        obstacle: null,
      },
    };
    const targetLocator = {
      longitudinal: 0,
      transverse: 6,
    };
    const action = huntNew(surroundings, forwardSurroundings, targetLocator);
    expect(action).toBe('R');
  });

  test('huntNew should return F or R when no enemy reachable at cost 2 and the target is on the front-right', () => {
    const surroundings = {
      front: {
        distance: 5,
        obstacle: null,
      },
      back: {
        distance: 5,
        obstacle: null,
      },
      left: {
        distance: 5,
        obstacle: null,
      },
      right: {
        distance: 5,
        obstacle: null,
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 5,
        obstacle: null,
      },
      back: {
        distance: 5,
        obstacle: null,
      },
      left: {
        distance: 5,
        obstacle: null,
      },
      right: {
        distance: 5,
        obstacle: null,
      },
    };
    const targetLocator = {
      longitudinal: 6,
      transverse: 2,
    };
    const action = huntNew(surroundings, forwardSurroundings, targetLocator);
    expect(['F', 'R']).toContain(action);
  });

  test('huntNew should return R when no enemy reachable at cost 2 and the target is on the back-right', () => {
    const surroundings = {
      front: {
        distance: 5,
        obstacle: null,
      },
      back: {
        distance: 5,
        obstacle: null,
      },
      left: {
        distance: 5,
        obstacle: null,
      },
      right: {
        distance: 5,
        obstacle: null,
      },
    };
    const forwardSurroundings = {
      front: {
        distance: 5,
        obstacle: null,
      },
      back: {
        distance: 5,
        obstacle: null,
      },
      left: {
        distance: 5,
        obstacle: null,
      },
      right: {
        distance: 5,
        obstacle: null,
      },
    };
    const targetLocator = {
      longitudinal: -8,
      transverse: 6,
    };
    const action = huntNew(surroundings, forwardSurroundings, targetLocator);
    expect(action).toBe('R');
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
