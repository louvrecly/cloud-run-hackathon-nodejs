'use strict';

import assert from 'assert';
import {
  scanArena,
  checkIndexInRange,
  scanSurroundings,
  checkEnemyInRange
} from '../server/services';

describe('Unit Tests on services', () => {
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
  const surroundingKeys = ['front', 'back', 'left', 'right'];
  let surroundings = scanSurroundings(ownState, arena, dims);

  it('scanArena should correctly scan the arena and identify the locations of all bots', () => {
    assert.ok(Array.isArray(arena), 'arena should be an array');
    assert.ok(Array.isArray(arena[0]), 'arena should be a 2-dimensional array');
    assert.equal(arena.length, dims[1], 'height of arena should be equal to value defined in dims');
    assert.equal(arena[0].length, dims[0], 'width of arena should be equal to value defined in dims');
    assert.ok(typeof arena[0][0] === 'object' && typeof arena[0][0] !== null, 'arena[0][0] should be an object');
    assert.ok(typeof arena[0][3] === 'object' && typeof arena[0][3] !== null, 'arena[0][3] should be an object');
    assert.ok(arena[0][1] === null, 'arena[0][1] should be null');
  });

  it('checkIndexInRange should correctly check if the index provided is within range', () => {
    assert.ok(checkIndexInRange(0, dims[0]), 'index 0 should be within range in x');
    assert.ok(checkIndexInRange(0, dims[1]), 'index 0 should be within range in y');
    assert.ok(!checkIndexInRange(4, dims[0]), 'index 4 should be out of range in x');
    assert.ok(!checkIndexInRange(4, dims[1]), 'index 4 should be out of range in y');
    assert.ok(checkIndexInRange(3, dims[0]), 'index 3 should be within range in x');
    assert.ok(!checkIndexInRange(3, dims[1]), 'index 3 should be out of range in y');
    assert.ok(!checkIndexInRange(-1, dims[0]), 'index -1 should be out of range in x');
    assert.ok(!checkIndexInRange(-1, dims[1]), 'index -1 should be out of range in y');
  });

  it('scanSurroundings should locate enemy in the front', () => {
    state = {
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
    ownState = state.BASE_URL;
    arena = scanArena(dims, state);
    surroundings = scanSurroundings(ownState, arena, dims);
    assert.ok(typeof surroundings === 'object', 'surroundings should be an object');
    assert.ok(Object.keys(surroundings).every(key => surroundingKeys.includes(key)) , 'surroundings should contain valid keys');
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
    state = {
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
    ownState = state.BASE_URL;
    arena = scanArena(dims, state);
    surroundings = scanSurroundings(ownState, arena, dims);
    assert.ok(typeof surroundings === 'object', 'surroundings should be an object');
    assert.ok(Object.keys(surroundings).every(key => surroundingKeys.includes(key)) , 'surroundings should contain valid keys');
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
    assert.ok(typeof surroundings === 'object', 'surroundings should be an object');
    assert.ok(Object.keys(surroundings).every(key => surroundingKeys.includes(key)) , 'surroundings should contain valid keys');
    assert.equal(surroundings.front.obstacle, null, 'no obstacle should be detected in the front');
    assert.equal(surroundings.front.distance, 4, 'no obstacle should be detected in the front at a distance of 4');
    assert.equal(surroundings.back.obstacle, 'wall', 'wall should be detected in the back');
    assert.equal(surroundings.back.distance, 1, 'wall should be detected in the back at a distance of 1');
    assert.equal(surroundings.left.obstacle, 'wall', 'wall should be detected on the left');
    assert.equal(surroundings.left.distance, 1, 'wall should be detected on the left at a distance of 1');
    assert.ok(typeof surroundings.right.obstacle === 'object' && surroundings.right.obstacle !== null, 'enemy should be detected on the right');
    assert.equal(surroundings.right.distance, 2, 'enemy should be detected on the right at a distance of 2');
  });

  it('scanSurroundings should locate enemy in the back', () => {
    state = {
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
    ownState = state.BASE_URL;
    arena = scanArena(dims, state);
    surroundings = scanSurroundings(ownState, arena, dims);
    assert.ok(typeof surroundings === 'object', 'surroundings should be an object');
    assert.ok(Object.keys(surroundings).every(key => surroundingKeys.includes(key)) , 'surroundings should contain valid keys');
    assert.equal(surroundings.front.obstacle, 'wall', 'wall should be detected in the front');
    assert.equal(surroundings.front.distance, 1, 'wall should be detected in the front at a distance of 1');
    assert.ok(typeof surroundings.back.obstacle === 'object' && surroundings.back.obstacle !== null, 'enemy should be detected in the back');
    assert.equal(surroundings.back.distance, 2, 'enemy should be detected in the back at a distance of 2');
    assert.equal(surroundings.left.obstacle, 'wall', 'wall should be detected on the left');
    assert.equal(surroundings.left.distance, 1, 'wall should be detected on the left at a distance of 1');
    assert.equal(surroundings.right.obstacle, null, 'no obstacle should be detected on the right');
    assert.equal(surroundings.right.distance, 4, 'no obstacle should be detected on the right at a distance of 4');
  });

  it('checkEnemyInRange should identify enemy in range', () => {
    state = {
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
    ownState = state.BASE_URL;
    arena = scanArena(dims, state);
    surroundings = scanSurroundings(ownState, arena, dims);
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
    state = {
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
    ownState = state.BASE_URL;
    arena = scanArena(dims, state);
    surroundings = scanSurroundings(ownState, arena, dims);
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
});
