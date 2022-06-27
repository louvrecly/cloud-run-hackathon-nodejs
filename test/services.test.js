'use strict';

import assert from 'assert';
import {
  scanArena,
  checkIndexInRange,
  getDimAndIndex,
  getMultiplier,
  scanSurroundings,
  checkEnemyInRange,
  escape,
  hunt
} from '../server/services';

describe('Unit Tests on services', () => {
  const relativeDirections = ['front', 'back', 'left', 'right'];

  it('scanArena should correctly scan the arena and identify the locations of all bots', () => {
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
    assert.ok(Array.isArray(arena), 'arena should be an array');
    assert.ok(Array.isArray(arena[0]), 'arena should be a 2-dimensional array');
    assert.equal(arena.length, dims[1], 'height of arena should be equal to value defined in dims');
    assert.equal(arena[0].length, dims[0], 'width of arena should be equal to value defined in dims');
    assert.ok(typeof arena[0][0] === 'object' && typeof arena[0][0] !== null, 'arena[0][0] should be an object');
    assert.ok(typeof arena[0][3] === 'object' && typeof arena[0][3] !== null, 'arena[0][3] should be an object');
    assert.ok(arena[0][1] === null, 'arena[0][1] should be null');
  });

  it('checkIndexInRange should correctly check if the index provided is within range', () => {
    const dims = [4, 3];
    assert.ok(checkIndexInRange(0, dims[0]), 'index 0 should be within range in x');
    assert.ok(checkIndexInRange(0, dims[1]), 'index 0 should be within range in y');
    assert.ok(!checkIndexInRange(4, dims[0]), 'index 4 should be out of range in x');
    assert.ok(!checkIndexInRange(4, dims[1]), 'index 4 should be out of range in y');
    assert.ok(checkIndexInRange(3, dims[0]), 'index 3 should be within range in x');
    assert.ok(!checkIndexInRange(3, dims[1]), 'index 3 should be out of range in y');
    assert.ok(!checkIndexInRange(-1, dims[0]), 'index -1 should be out of range in x');
    assert.ok(!checkIndexInRange(-1, dims[1]), 'index -1 should be out of range in y');
  });

  it('getDimAndIndex should return x dimension and 0 index for E and front', () => {
    const direction = 'E';
    const relativeDirection = 'front';
    const dimAndIndex = getDimAndIndex(direction, relativeDirection);
    assert.ok(typeof dimAndIndex === 'object' && dimAndIndex !== null, 'dimAndIndex should be an object');
    assert.ok(dimAndIndex.hasOwnProperty('dim') && typeof dimAndIndex.dim === 'string', 'dim key should exist and be a string');
    assert.ok(dimAndIndex.hasOwnProperty('index') && typeof dimAndIndex.index === 'number', 'index key should exist and be a number');
    assert.equal(dimAndIndex.dim, 'x', 'x should be returned as dim value');
    assert.equal(dimAndIndex.index, 0, '0 should be returned as index value');
  });

  it('getDimAndIndex should return y dimension and 1 index for S and front', () => {
    const direction = 'S';
    const relativeDirection = 'front';
    const dimAndIndex = getDimAndIndex(direction, relativeDirection);
    assert.ok(typeof dimAndIndex === 'object' && dimAndIndex !== null, 'dimAndIndex should be an object');
    assert.ok(dimAndIndex.hasOwnProperty('dim') && typeof dimAndIndex.dim === 'string', 'dim key should exist and be a string');
    assert.ok(dimAndIndex.hasOwnProperty('index') && typeof dimAndIndex.index === 'number', 'index key should exist and be a number');
    assert.equal(dimAndIndex.dim, 'y', 'y should be returned as dim value');
    assert.equal(dimAndIndex.index, 1, '1 should be returned as index value');
  });

  it('getDimAndIndex should return x dimension and 0 index for W and back', () => {
    const direction = 'W';
    const relativeDirection = 'back';
    const dimAndIndex = getDimAndIndex(direction, relativeDirection);
    assert.ok(typeof dimAndIndex === 'object' && dimAndIndex !== null, 'dimAndIndex should be an object');
    assert.ok(dimAndIndex.hasOwnProperty('dim') && typeof dimAndIndex.dim === 'string', 'dim key should exist and be a string');
    assert.ok(dimAndIndex.hasOwnProperty('index') && typeof dimAndIndex.index === 'number', 'index key should exist and be a number');
    assert.equal(dimAndIndex.dim, 'x', 'x should be returned as dim value');
    assert.equal(dimAndIndex.index, 0, '0 should be returned as index value');
  });

  it('getDimAndIndex should return y dimension and 1 index for N and back', () => {
    const direction = 'N';
    const relativeDirection = 'back';
    const dimAndIndex = getDimAndIndex(direction, relativeDirection);
    assert.ok(typeof dimAndIndex === 'object' && dimAndIndex !== null, 'dimAndIndex should be an object');
    assert.ok(dimAndIndex.hasOwnProperty('dim') && typeof dimAndIndex.dim === 'string', 'dim key should exist and be a string');
    assert.ok(dimAndIndex.hasOwnProperty('index') && typeof dimAndIndex.index === 'number', 'index key should exist and be a number');
    assert.equal(dimAndIndex.dim, 'y', 'y should be returned as dim value');
    assert.equal(dimAndIndex.index, 1, '1 should be returned as index value');
  });

  it('getDimAndIndex should return y dimension and 1 index for E and left', () => {
    const direction = 'E';
    const relativeDirection = 'left';
    const dimAndIndex = getDimAndIndex(direction, relativeDirection);
    assert.ok(typeof dimAndIndex === 'object' && dimAndIndex !== null, 'dimAndIndex should be an object');
    assert.ok(dimAndIndex.hasOwnProperty('dim') && typeof dimAndIndex.dim === 'string', 'dim key should exist and be a string');
    assert.ok(dimAndIndex.hasOwnProperty('index') && typeof dimAndIndex.index === 'number', 'index key should exist and be a number');
    assert.equal(dimAndIndex.dim, 'y', 'y should be returned as dim value');
    assert.equal(dimAndIndex.index, 1, '1 should be returned as index value');
  });

  it('getDimAndIndex should return x dimension and 0 index for S and right', () => {
    const direction = 'S';
    const relativeDirection = 'right';
    const dimAndIndex = getDimAndIndex(direction, relativeDirection);
    assert.ok(typeof dimAndIndex === 'object' && dimAndIndex !== null, 'dimAndIndex should be an object');
    assert.ok(dimAndIndex.hasOwnProperty('dim') && typeof dimAndIndex.dim === 'string', 'dim key should exist and be a string');
    assert.ok(dimAndIndex.hasOwnProperty('index') && typeof dimAndIndex.index === 'number', 'index key should exist and be a number');
    assert.equal(dimAndIndex.dim, 'x', 'x should be returned as dim value');
    assert.equal(dimAndIndex.index, 0, '0 should be returned as index value');
  });

  it('getDimAndIndex should return y dimension and 1 index for W and right', () => {
    const direction = 'W';
    const relativeDirection = 'right';
    const dimAndIndex = getDimAndIndex(direction, relativeDirection);
    assert.ok(typeof dimAndIndex === 'object' && dimAndIndex !== null, 'dimAndIndex should be an object');
    assert.ok(dimAndIndex.hasOwnProperty('dim') && typeof dimAndIndex.dim === 'string', 'dim key should exist and be a string');
    assert.ok(dimAndIndex.hasOwnProperty('index') && typeof dimAndIndex.index === 'number', 'index key should exist and be a number');
    assert.equal(dimAndIndex.dim, 'y', 'y should be returned as dim value');
    assert.equal(dimAndIndex.index, 1, '1 should be returned as index value');
  });

  it('getDimAndIndex should return x dimension and 0 index for N and left', () => {
    const direction = 'N';
    const relativeDirection = 'left';
    const dimAndIndex = getDimAndIndex(direction, relativeDirection);
    assert.ok(typeof dimAndIndex === 'object' && dimAndIndex !== null, 'dimAndIndex should be an object');
    assert.ok(dimAndIndex.hasOwnProperty('dim') && typeof dimAndIndex.dim === 'string', 'dim key should exist and be a string');
    assert.ok(dimAndIndex.hasOwnProperty('index') && typeof dimAndIndex.index === 'number', 'index key should exist and be a number');
    assert.equal(dimAndIndex.dim, 'x', 'x should be returned as dim value');
    assert.equal(dimAndIndex.index, 0, '0 should be returned as index value');
  });

  it('getMultiplier should return 1 as multiplier value for E and front', () => {
    const direction = 'E';
    const relativeDirection = 'front';
    const multiplier = getMultiplier(direction, relativeDirection);
    assert.equal(typeof multiplier, 'number', 'multiplier should be a number');
    assert.equal(multiplier, 1, 'multiplier should be 1 for E and front');
  });

  it('getMultiplier should return -1 as multiplier value for S and back', () => {
    const direction = 'S';
    const relativeDirection = 'back';
    const multiplier = getMultiplier(direction, relativeDirection);
    assert.equal(typeof multiplier, 'number', 'multiplier should be a number');
    assert.equal(multiplier, -1, 'multiplier should be -1 for S and back');
  });

  it('getMultiplier should return -1 as multiplier value for W and front', () => {
    const direction = 'W';
    const relativeDirection = 'front';
    const multiplier = getMultiplier(direction, relativeDirection);
    assert.equal(typeof multiplier, 'number', 'multiplier should be a number');
    assert.equal(multiplier, -1, 'multiplier should be -1 for W and front');
  });

  it('getMultiplier should return 1 as multiplier value for N and back', () => {
    const direction = 'N';
    const relativeDirection = 'back';
    const multiplier = getMultiplier(direction, relativeDirection);
    assert.equal(typeof multiplier, 'number', 'multiplier should be a number');
    assert.equal(multiplier, 1, 'multiplier should be 1 for N and back');
  });

  it('getMultiplier should return -1 as multiplier value for E and left', () => {
    const direction = 'E';
    const relativeDirection = 'left';
    const multiplier = getMultiplier(direction, relativeDirection);
    assert.equal(typeof multiplier, 'number', 'multiplier should be a number');
    assert.equal(multiplier, -1, 'multiplier should be -1 for E and left');
  });

  it('getMultiplier should return 1 as multiplier value for S and left', () => {
    const direction = 'S';
    const relativeDirection = 'left';
    const multiplier = getMultiplier(direction, relativeDirection);
    assert.equal(typeof multiplier, 'number', 'multiplier should be a number');
    assert.equal(multiplier, 1, 'multiplier should be 1 for S and left');
  });

  it('getMultiplier should return -1 as multiplier value for W and right', () => {
    const direction = 'W';
    const relativeDirection = 'right';
    const multiplier = getMultiplier(direction, relativeDirection);
    assert.equal(typeof multiplier, 'number', 'multiplier should be a number');
    assert.equal(multiplier, -1, 'multiplier should be -1 for W and right');
  });

  it('getMultiplier should return 1 as multiplier value for N and right', () => {
    const direction = 'N';
    const relativeDirection = 'right';
    const multiplier = getMultiplier(direction, relativeDirection);
    assert.equal(typeof multiplier, 'number', 'multiplier should be a number');
    assert.equal(multiplier, 1, 'multiplier should be 1 for N and right');
  });

  it('scanSurroundings should locate enemy in the front', () => {
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
    assert.ok(typeof surroundings === 'object' && surroundings !== null, 'surroundings should be an object');
    assert.ok(Object.keys(surroundings).every(key => relativeDirections.includes(key)) , 'surroundings should contain valid keys');
    assert.ok(typeof surroundings.front.obstacle === 'object' && surroundings.front.obstacle !== null, 'enemy should be detected in the front');
    assert.equal(surroundings.front.distance, 3, 'enemy should be detected in the front at a distance of 3');
    assert.equal(surroundings.back.obstacle, 'wall', 'wall should be detected in the back');
    assert.equal(surroundings.back.distance, 1, 'wall should be detected in the back at a distance of 1');
    assert.equal(surroundings.left.obstacle, 'wall', 'wall should be detected on the left');
    assert.equal(surroundings.left.distance, 1, 'wall should be detected on the left at a distance of 1');
    assert.equal(surroundings.right.obstacle, 'wall', 'wall should be detected on the right');
    assert.equal(surroundings.right.distance, 3, 'wall should be detected on the right at a distance of 3');
  });

  it('scanSurroundings should locate enemy on the left', () => {
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
    assert.ok(typeof surroundings === 'object' && surroundings !== null, 'surroundings should be an object');
    assert.ok(Object.keys(surroundings).every(key => relativeDirections.includes(key)) , 'surroundings should contain valid keys');
    assert.equal(surroundings.front.obstacle, 'wall', 'wall should be detected in the front');
    assert.equal(surroundings.front.distance, 3, 'wall should be detected in the front at a distance of 3');
    assert.equal(surroundings.back.obstacle, 'wall', 'wall should be detected in the back');
    assert.equal(surroundings.back.distance, 1, 'wall should be detected in the back at a distance of 1');
    assert.ok(typeof surroundings.left.obstacle === 'object' && surroundings.left.obstacle !== null, 'enemy should be detected on the left');
    assert.equal(surroundings.left.distance, 3, 'enemy should be detected on the left at a distance of 3');
    assert.equal(surroundings.right.obstacle, 'wall', 'wall should be detected on the right');
    assert.equal(surroundings.right.distance, 1, 'wall should be detected on the right at a distance of 1');
  });

  it('scanSurroundings should locate enemy on the right', () => {
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
    assert.ok(typeof surroundings === 'object' && surroundings !== null, 'surroundings should be an object');
    assert.ok(Object.keys(surroundings).every(key => relativeDirections.includes(key)) , 'surroundings should contain valid keys');
    assert.equal(surroundings.front.obstacle, 'wall', 'wall should be detected in the front');
    assert.equal(surroundings.front.distance, 4, 'no obstacle should be detected in the front at a distance of 4');
    assert.equal(surroundings.back.obstacle, 'wall', 'wall should be detected in the back');
    assert.equal(surroundings.back.distance, 1, 'wall should be detected in the back at a distance of 1');
    assert.equal(surroundings.left.obstacle, 'wall', 'wall should be detected on the left');
    assert.equal(surroundings.left.distance, 1, 'wall should be detected on the left at a distance of 1');
    assert.ok(typeof surroundings.right.obstacle === 'object' && surroundings.right.obstacle !== null, 'enemy should be detected on the right');
    assert.equal(surroundings.right.distance, 2, 'enemy should be detected on the right at a distance of 2');
  });

  it('scanSurroundings should locate enemy in the back', () => {
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
    assert.ok(typeof surroundings === 'object' && surroundings !== null, 'surroundings should be an object');
    assert.ok(Object.keys(surroundings).every(key => relativeDirections.includes(key)) , 'surroundings should contain valid keys');
    assert.equal(surroundings.front.obstacle, 'wall', 'wall should be detected in the front');
    assert.equal(surroundings.front.distance, 1, 'wall should be detected in the front at a distance of 1');
    assert.ok(typeof surroundings.back.obstacle === 'object' && surroundings.back.obstacle !== null, 'enemy should be detected in the back');
    assert.equal(surroundings.back.distance, 2, 'enemy should be detected in the back at a distance of 2');
    assert.equal(surroundings.left.obstacle, 'wall', 'wall should be detected on the left');
    assert.equal(surroundings.left.distance, 1, 'wall should be detected on the left at a distance of 1');
    assert.equal(surroundings.right.obstacle, 'wall', 'no obstacle should be detected on the right');
    assert.equal(surroundings.right.distance, 4, 'no obstacle should be detected on the right at a distance of 4');
  });

  it('checkEnemyInRange should identify enemy in range', () => {
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
    assert.ok(checkEnemyInRange(surroundings.front), 'enemy should be detected within range of throw');

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
    assert.ok(checkEnemyInRange(surroundings.front), 'enemy should be detected within range of throw');
  });

  it('checkEnemyInRange should identify enemy is not in range', () => {
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
    assert.ok(!checkEnemyInRange(surroundings.front), 'enemy should not be detected within range of throw');

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
    assert.ok(!checkEnemyInRange(surroundings.front), 'enemy should not be detected within range of throw');
  });

  it('escape should return F when being hit from the left while forward is available', () => {
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
    assert.ok(typeof action === 'string' && action.length === 1, 'action should be a string of length 1');
    assert.equal(action, 'F', 'F should be returned when being hit from the left and forward is available');
  });

  it('escape should return R when being hit from the front and left has a wall', () => {
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
    assert.ok(typeof action === 'string' && action.length === 1, 'action should be a string of length 1');
    assert.equal(action, 'R', 'R should be returned when being hit from the front and left has a wall');
  });

  it('escape should return R when being hit from the right and left has a wall', () => {
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
    assert.ok(typeof action === 'string' && action.length === 1, 'action should be a string of length 1');
    assert.equal(action, 'R', 'R should be returned when being hit from the right and left has a wall');
  });

  it('escape should return L when being hit from the back and right has a wall', () => {
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
    assert.ok(typeof action === 'string' && action.length === 1, 'action should be a string of length 1');
    assert.equal(action, 'L', 'L should be returned when being hit from the back and right has a wall');
  });

  it('escape should return L or R when being hit from both left and right while forward is unavailable', () => {
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
    assert.ok(typeof action === 'string' && action.length === 1, 'action should be a string of length 1');
    assert.ok(['L', 'R'].includes(action), 'L or R should be returned when being hit from both left and right while forward is unavailable');
  });

  it('hunt should return L when enemy is on the left', () => {
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
    assert.ok(typeof action === 'string' && action.length === 1, 'action should be a string of length 1');
    assert.equal(action, 'L', 'L should be returned when enemy is on the left');
  });

  it('hunt should return R when enemy is on the right', () => {
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
    assert.ok(typeof action === 'string' && action.length === 1, 'action should be a string of length 1');
    assert.equal(action, 'R', 'R should be returned when enemy is on the right');
  });

  it('hunt should return F when enemy is in the front at a distance 4', () => {
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
    assert.ok(typeof action === 'string' && action.length === 1, 'action should be a string of length 1');
    assert.equal(action, 'F', 'F should be returned when enemy is in the front at a distance 4');
  });

  it('hunt should return L when enemy is in the back and right has a wall', () => {
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
    assert.ok(typeof action === 'string' && action.length === 1, 'action should be a string of length 1');
    assert.equal(action, 'L', 'L should be returned when enemy is in the back and right has a wall');
  });

  it('hunt should return R when enemy is in the back and left has a wall', () => {
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
    assert.ok(typeof action === 'string' && action.length === 1, 'action should be a string of length 1');
    assert.equal(action, 'R', 'R should be returned when enemy is in the back and left has a wall');
  });

  it('hunt should return L when enemy is on the left at a distance 4', () => {
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
    assert.ok(typeof action === 'string' && action.length === 1, 'action should be a string of length 1');
    assert.equal(action, 'L', 'L should be returned when enemy is on the left at a distance 4');
  });

  it('hunt should return R when enemy is on the right at a distance 4', () => {
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
    assert.ok(typeof action === 'string' && action.length === 1, 'action should be a string of length 1');
    assert.equal(action, 'R', 'R should be returned when enemy is on the right at a distance 4');
  });
});
