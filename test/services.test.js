'use strict';

import assert from 'assert';
import {
  compareDirections,
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

describe('Unit Tests on services', () => {
  const relativeDirections = ['front', 'back', 'left', 'right'];

  it('compareDirections should return 0 for E against E', () => {
    const directionA = 'E';
    const directionB = 'E';
    const compareValue = compareDirections(directionA, directionB);
    assert.equal(typeof compareValue, 'number', 'compareValue should be a number');
    assert.equal(compareValue, 0, '0 should be returned for E against E');
  });

  it('compareDirections should return 0 for S against S', () => {
    const directionA = 'S';
    const directionB = 'S';
    const compareValue = compareDirections(directionA, directionB);
    assert.equal(typeof compareValue, 'number', 'compareValue should be a number');
    assert.equal(compareValue, 0, '0 should be returned for S against S');
  });

  it('compareDirections should return 0 for W against W', () => {
    const directionA = 'W';
    const directionB = 'W';
    const compareValue = compareDirections(directionA, directionB);
    assert.equal(typeof compareValue, 'number', 'compareValue should be a number');
    assert.equal(compareValue, 0, '0 should be returned for W against W');
  });

  it('compareDirections should return 0 for N against N', () => {
    const directionA = 'N';
    const directionB = 'N';
    const compareValue = compareDirections(directionA, directionB);
    assert.equal(typeof compareValue, 'number', 'compareValue should be a number');
    assert.equal(compareValue, 0, '0 should be returned for N against N');
  });

  it('compareDirections should return 90 for S against E', () => {
    const directionA = 'S';
    const directionB = 'E';
    const compareValue = compareDirections(directionA, directionB);
    assert.equal(typeof compareValue, 'number', 'compareValue should be a number');
    assert.equal(compareValue, 90, '90 should be returned for S against E');
  });

  it('compareDirections should return 90 for W against S', () => {
    const directionA = 'W';
    const directionB = 'S';
    const compareValue = compareDirections(directionA, directionB);
    assert.equal(typeof compareValue, 'number', 'compareValue should be a number');
    assert.equal(compareValue, 90, '90 should be returned for W against S');
  });

  it('compareDirections should return 180 for W against E', () => {
    const directionA = 'W';
    const directionB = 'E';
    const compareValue = compareDirections(directionA, directionB);
    assert.equal(typeof compareValue, 'number', 'compareValue should be a number');
    assert.equal(compareValue, 180, '180 should be returned for W against E');
  });

  it('compareDirections should return 270 for W against N', () => {
    const directionA = 'W';
    const directionB = 'N';
    const compareValue = compareDirections(directionA, directionB);
    assert.equal(typeof compareValue, 'number', 'compareValue should be a number');
    assert.equal(compareValue, 270, '270 should be returned for W against N');
  });

  it('compareDirections should return -270 for N against W', () => {
    const directionA = 'N';
    const directionB = 'W';
    const compareValue = compareDirections(directionA, directionB);
    assert.equal(typeof compareValue, 'number', 'compareValue should be a number');
    assert.equal(compareValue, -270, '-270 should be returned for N against W');
  });

  it('compareDirections should return -180 for N against S', () => {
    const directionA = 'N';
    const directionB = 'S';
    const compareValue = compareDirections(directionA, directionB);
    assert.equal(typeof compareValue, 'number', 'compareValue should be a number');
    assert.equal(compareValue, -180, '-180 should be returned for N against S');
  });

  it('compareDirections should return -180 for E against W', () => {
    const directionA = 'E';
    const directionB = 'W';
    const compareValue = compareDirections(directionA, directionB);
    assert.equal(typeof compareValue, 'number', 'compareValue should be a number');
    assert.equal(compareValue, -180, '-180 should be returned for E against W');
  });

  it('compareDirections should return -90 for E against S', () => {
    const directionA = 'E';
    const directionB = 'S';
    const compareValue = compareDirections(directionA, directionB);
    assert.equal(typeof compareValue, 'number', 'compareValue should be a number');
    assert.equal(compareValue, -90, '-90 should be returned for E against S');
  });

  it('compareDirections should return -90 for N against E', () => {
    const directionA = 'N';
    const directionB = 'E';
    const compareValue = compareDirections(directionA, directionB);
    assert.equal(typeof compareValue, 'number', 'compareValue should be a number');
    assert.equal(compareValue, -90, '-90 should be returned for N against E');
  });

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

  it('getForwardState should return a state at (1, 0) towards E', () => {
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
    assert.ok(typeof forwardState === 'object' && forwardState !== null, 'forwardState should be an object');
    assert.ok(forwardState.hasOwnProperty('x') && typeof forwardState.x === 'number', 'x key should exist and be a number');
    assert.ok(forwardState.hasOwnProperty('y') && typeof forwardState.y === 'number', 'y key should exist and be a number');
    assert.ok(forwardState.hasOwnProperty('direction') && typeof forwardState.direction === 'string', 'direction key should exist and be a string');
    assert.equal(forwardState.x, 1, '1 should be returned as x value');
    assert.equal(forwardState.y, 0, '0 should be returned as y value');
    assert.equal(forwardState.direction, 'E', 'E should be returned as direction value');
  });

  it('getForwardState should return a state at (0, 1) towards S', () => {
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
    assert.ok(typeof forwardState === 'object' && forwardState !== null, 'forwardState should be an object');
    assert.ok(forwardState.hasOwnProperty('x') && typeof forwardState.x === 'number', 'x key should exist and be a number');
    assert.ok(forwardState.hasOwnProperty('y') && typeof forwardState.y === 'number', 'y key should exist and be a number');
    assert.ok(forwardState.hasOwnProperty('direction') && typeof forwardState.direction === 'string', 'direction key should exist and be a string');
    assert.equal(forwardState.x, 0, '0 should be returned as x value');
    assert.equal(forwardState.y, 1, '1 should be returned as y value');
    assert.equal(forwardState.direction, 'S', 'S should be returned as direction value');
  });

  it('getForwardState should return a state at (2, 2) towards W', () => {
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
    assert.ok(typeof forwardState === 'object' && forwardState !== null, 'forwardState should be an object');
    assert.ok(forwardState.hasOwnProperty('x') && typeof forwardState.x === 'number', 'x key should exist and be a number');
    assert.ok(forwardState.hasOwnProperty('y') && typeof forwardState.y === 'number', 'y key should exist and be a number');
    assert.ok(forwardState.hasOwnProperty('direction') && typeof forwardState.direction === 'string', 'direction key should exist and be a string');
    assert.equal(forwardState.x, 2, '2 should be returned as x value');
    assert.equal(forwardState.y, 2, '2 should be returned as y value');
    assert.equal(forwardState.direction, 'W', 'W should be returned as direction value');
  });

  it('getForwardState should return a state at (3, 1) towards N', () => {
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
    assert.ok(typeof forwardState === 'object' && forwardState !== null, 'forwardState should be an object');
    assert.ok(forwardState.hasOwnProperty('x') && typeof forwardState.x === 'number', 'x key should exist and be a number');
    assert.ok(forwardState.hasOwnProperty('y') && typeof forwardState.y === 'number', 'y key should exist and be a number');
    assert.ok(forwardState.hasOwnProperty('direction') && typeof forwardState.direction === 'string', 'direction key should exist and be a string');
    assert.equal(forwardState.x, 3, '3 should be returned as x value');
    assert.equal(forwardState.y, 1, '1 should be returned as y value');
    assert.equal(forwardState.direction, 'N', 'N should be returned as direction value');
  });

  it('getForwardState should return false when wall is in the front', () => {
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
    assert.equal(typeof forwardState, 'boolean', 'forwardState should be a boolean');
    assert.equal(forwardState, false, 'false should be returned when wall is in the front');
  });

  it('getThreatLevel should return -1 for E vs E in the front', () => {
    const ownDirection = 'E';
    const enemyDirection = 'E';
    const relativeDirection = 'front';
    const threatLevel = getThreatLevel(ownDirection, enemyDirection, relativeDirection);
    assert.equal(typeof threatLevel, 'number', 'threatLevel should be a number');
    assert.equal(threatLevel, -1, '-1 should be returned for E vs E in the front');
  });

  it('getThreatLevel should return -1 for S vs S in the front', () => {
    const ownDirection = 'S';
    const enemyDirection = 'S';
    const relativeDirection = 'front';
    const threatLevel = getThreatLevel(ownDirection, enemyDirection, relativeDirection);
    assert.equal(typeof threatLevel, 'number', 'threatLevel should be a number');
    assert.equal(threatLevel, -1, '-1 should be returned for S vs S in the front');
  });

  it('getThreatLevel should return 1 for W vs W in the back', () => {
    const ownDirection = 'W';
    const enemyDirection = 'W';
    const relativeDirection = 'back';
    const threatLevel = getThreatLevel(ownDirection, enemyDirection, relativeDirection);
    assert.equal(typeof threatLevel, 'number', 'threatLevel should be a number');
    assert.equal(threatLevel, 1, '1 should be returned for W vs W in the back');
  });

  it('getThreatLevel should return 1 for N vs N in the back', () => {
    const ownDirection = 'N';
    const enemyDirection = 'N';
    const relativeDirection = 'back';
    const threatLevel = getThreatLevel(ownDirection, enemyDirection, relativeDirection);
    assert.equal(typeof threatLevel, 'number', 'threatLevel should be a number');
    assert.equal(threatLevel, 1, '1 should be returned for N vs N in the back');
  });

  it('getThreatLevel should return 0 for S vs E in the front', () => {
    const ownDirection = 'E';
    const enemyDirection = 'S';
    const relativeDirection = 'front';
    const threatLevel = getThreatLevel(ownDirection, enemyDirection, relativeDirection);
    assert.equal(typeof threatLevel, 'number', 'threatLevel should be a number');
    assert.equal(threatLevel, 0, '0 should be returned for S vs E in the front');
  });

  it('getThreatLevel should return 1 for N vs S in the front', () => {
    const ownDirection = 'S';
    const enemyDirection = 'N';
    const relativeDirection = 'front';
    const threatLevel = getThreatLevel(ownDirection, enemyDirection, relativeDirection);
    assert.equal(typeof threatLevel, 'number', 'threatLevel should be a number');
    assert.equal(threatLevel, 1, '1 should be returned for N vs S in the front');
  });

  it('getThreatLevel should return -1 for E vs W in the back', () => {
    const ownDirection = 'W';
    const enemyDirection = 'E';
    const relativeDirection = 'back';
    const threatLevel = getThreatLevel(ownDirection, enemyDirection, relativeDirection);
    assert.equal(typeof threatLevel, 'number', 'threatLevel should be a number');
    assert.equal(threatLevel, -1, '-1 should be returned for E vs W in the back');
  });

  it('getThreatLevel should return 0 for W vs N in the back', () => {
    const ownDirection = 'N';
    const enemyDirection = 'W';
    const relativeDirection = 'back';
    const threatLevel = getThreatLevel(ownDirection, enemyDirection, relativeDirection);
    assert.equal(typeof threatLevel, 'number', 'threatLevel should be a number');
    assert.equal(threatLevel, 0, '0 should be returned for W vs N in the back');
  });

  it('getThreatLevel should return 1 for S vs E on the left', () => {
    const ownDirection = 'E';
    const enemyDirection = 'S';
    const relativeDirection = 'left';
    const threatLevel = getThreatLevel(ownDirection, enemyDirection, relativeDirection);
    assert.equal(typeof threatLevel, 'number', 'threatLevel should be a number');
    assert.equal(threatLevel, 1, '1 should be returned for S vs E on the left');
  });

  it('getThreatLevel should return 0 for N vs S on the right', () => {
    const ownDirection = 'S';
    const enemyDirection = 'N';
    const relativeDirection = 'right';
    const threatLevel = getThreatLevel(ownDirection, enemyDirection, relativeDirection);
    assert.equal(typeof threatLevel, 'number', 'threatLevel should be a number');
    assert.equal(threatLevel, 0, '0 should be returned for N vs S on the right');
  });

  it('getThreatLevel should return 0 for E vs W on the left', () => {
    const ownDirection = 'W';
    const enemyDirection = 'E';
    const relativeDirection = 'left';
    const threatLevel = getThreatLevel(ownDirection, enemyDirection, relativeDirection);
    assert.equal(typeof threatLevel, 'number', 'threatLevel should be a number');
    assert.equal(threatLevel, 0, '0 should be returned for E vs W on the left');
  });

  it('getThreatLevel should return 1 for W vs N on the right', () => {
    const ownDirection = 'N';
    const enemyDirection = 'W';
    const relativeDirection = 'right';
    const threatLevel = getThreatLevel(ownDirection, enemyDirection, relativeDirection);
    assert.equal(typeof threatLevel, 'number', 'threatLevel should be a number');
    assert.equal(threatLevel, 1, '1 should be returned for W vs N on the right');
  });

  it('evaluateOverallThreat should return 0 for threat levels 0, 0, 0', () => {
    const threatLevels = [0, 0, 0];
    const overallThreat = evaluateOverallThreat(...threatLevels);
    assert.equal(typeof overallThreat, 'number', 'overallThreat should be a number');
    assert.equal(overallThreat, 0, '0 should be returned for threat levels 0, 0, 0');
  });

  it('evaluateOverallThreat should return 0 for threat levels -1, 0, 0', () => {
    const threatLevels = [-1, 0, 0];
    const overallThreat = evaluateOverallThreat(...threatLevels);
    assert.equal(typeof overallThreat, 'number', 'overallThreat should be a number');
    assert.equal(overallThreat, 0, '0 should be returned for threat levels -1, 0, 0');
  });

  it('evaluateOverallThreat should return 0 for threat levels -1, 0, -1', () => {
    const threatLevels = [-1, 0, -1];
    const overallThreat = evaluateOverallThreat(...threatLevels);
    assert.equal(typeof overallThreat, 'number', 'overallThreat should be a number');
    assert.equal(overallThreat, 0, '0 should be returned for threat levels -1, 0, -1');
  });

  it('evaluateOverallThreat should return 0 for threat levels -1, -1, -1', () => {
    const threatLevels = [-1, -1, -1];
    const overallThreat = evaluateOverallThreat(...threatLevels);
    assert.equal(typeof overallThreat, 'number', 'overallThreat should be a number');
    assert.equal(overallThreat, 0, '0 should be returned for threat levels -1, -1, -1');
  });

  it('evaluateOverallThreat should return 1 for threat levels 0, 0, 1', () => {
    const threatLevels = [0, 0, 1];
    const overallThreat = evaluateOverallThreat(...threatLevels);
    assert.equal(typeof overallThreat, 'number', 'overallThreat should be a number');
    assert.equal(overallThreat, 1, '1 should be returned for threat levels 0, 0, 1');
  });

  it('evaluateOverallThreat should return 1 for threat levels -1, 0, 1', () => {
    const threatLevels = [-1, 0, 1];
    const overallThreat = evaluateOverallThreat(...threatLevels);
    assert.equal(typeof overallThreat, 'number', 'overallThreat should be a number');
    assert.equal(overallThreat, 1, '1 should be returned for threat levels -1, 0, 1');
  });

  it('evaluateOverallThreat should return 1 for threat levels 1, -1, -1', () => {
    const threatLevels = [1, -1, -1];
    const overallThreat = evaluateOverallThreat(...threatLevels);
    assert.equal(typeof overallThreat, 'number', 'overallThreat should be a number');
    assert.equal(overallThreat, 1, '1 should be returned for threat levels 1, -1, -1');
  });

  it('evaluateOverallThreat should return 2 for threat levels 1, 1, 0', () => {
    const threatLevels = [1, 1, 0];
    const overallThreat = evaluateOverallThreat(...threatLevels);
    assert.equal(typeof overallThreat, 'number', 'overallThreat should be a number');
    assert.equal(overallThreat, 2, '2 should be returned for threat levels 1, 1, 0');
  });

  it('evaluateOverallThreat should return 2 for threat levels 1, 1, -1', () => {
    const threatLevels = [1, 1, -1];
    const overallThreat = evaluateOverallThreat(...threatLevels);
    assert.equal(typeof overallThreat, 'number', 'overallThreat should be a number');
    assert.equal(overallThreat, 2, '2 should be returned for threat levels 1, 1, -1');
  });

  it('evaluateOverallThreat should return 3 for threat levels 1, 1, 1', () => {
    const threatLevels = [1, 1, 1];
    const overallThreat = evaluateOverallThreat(...threatLevels);
    assert.equal(typeof overallThreat, 'number', 'overallThreat should be a number');
    assert.equal(overallThreat, 3, '3 should be returned for threat levels 1, 1, 1');
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
    assert.ok(surroundings.front.obstacle.hasOwnProperty('key') && typeof surroundings.front.obstacle.key === 'string', 'key property should exist in obstacle and be a string');
    assert.ok(surroundings.front.obstacle.hasOwnProperty('x') && typeof surroundings.front.obstacle.x === 'number', 'x property should exist in obstacle and be a number');
    assert.ok(surroundings.front.obstacle.hasOwnProperty('y') && typeof surroundings.front.obstacle.y === 'number', 'y property should exist in obstacle and be a number');
    assert.ok(surroundings.front.obstacle.hasOwnProperty('direction') && typeof surroundings.front.obstacle.direction === 'string', 'direction property should exist in obstacle and be a string');
    assert.ok(surroundings.front.obstacle.hasOwnProperty('wasHit') && typeof surroundings.front.obstacle.wasHit === 'boolean', 'wasHit property should exist in obstacle and be a boolean');
    assert.ok(surroundings.front.obstacle.hasOwnProperty('score') && typeof surroundings.front.obstacle.score === 'number', 'score property should exist in obstacle and be a number');
    assert.ok(surroundings.front.obstacle.hasOwnProperty('threatLevel') && typeof surroundings.front.obstacle.threatLevel === 'number', 'threatLevel property should exist in obstacle and be a number');
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
    assert.ok(surroundings.left.obstacle.hasOwnProperty('key') && typeof surroundings.left.obstacle.key === 'string', 'key property should exist in obstacle and be a string');
    assert.ok(surroundings.left.obstacle.hasOwnProperty('x') && typeof surroundings.left.obstacle.x === 'number', 'x property should exist in obstacle and be a number');
    assert.ok(surroundings.left.obstacle.hasOwnProperty('y') && typeof surroundings.left.obstacle.y === 'number', 'y property should exist in obstacle and be a number');
    assert.ok(surroundings.left.obstacle.hasOwnProperty('direction') && typeof surroundings.left.obstacle.direction === 'string', 'direction property should exist in obstacle and be a string');
    assert.ok(surroundings.left.obstacle.hasOwnProperty('wasHit') && typeof surroundings.left.obstacle.wasHit === 'boolean', 'wasHit property should exist in obstacle and be a boolean');
    assert.ok(surroundings.left.obstacle.hasOwnProperty('score') && typeof surroundings.left.obstacle.score === 'number', 'score property should exist in obstacle and be a number');
    assert.ok(surroundings.left.obstacle.hasOwnProperty('threatLevel') && typeof surroundings.left.obstacle.threatLevel === 'number', 'threatLevel property should exist in obstacle and be a number');
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
    assert.ok(surroundings.right.obstacle.hasOwnProperty('key') && typeof surroundings.right.obstacle.key === 'string', 'key property should exist in obstacle and be a string');
    assert.ok(surroundings.right.obstacle.hasOwnProperty('x') && typeof surroundings.right.obstacle.x === 'number', 'x property should exist in obstacle and be a number');
    assert.ok(surroundings.right.obstacle.hasOwnProperty('y') && typeof surroundings.right.obstacle.y === 'number', 'y property should exist in obstacle and be a number');
    assert.ok(surroundings.right.obstacle.hasOwnProperty('direction') && typeof surroundings.right.obstacle.direction === 'string', 'direction property should exist in obstacle and be a string');
    assert.ok(surroundings.right.obstacle.hasOwnProperty('wasHit') && typeof surroundings.right.obstacle.wasHit === 'boolean', 'wasHit property should exist in obstacle and be a boolean');
    assert.ok(surroundings.right.obstacle.hasOwnProperty('score') && typeof surroundings.right.obstacle.score === 'number', 'score property should exist in obstacle and be a number');
    assert.ok(surroundings.right.obstacle.hasOwnProperty('threatLevel') && typeof surroundings.right.obstacle.threatLevel === 'number', 'threatLevel property should exist in obstacle and be a number');
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
    assert.ok(surroundings.back.obstacle.hasOwnProperty('key') && typeof surroundings.back.obstacle.key === 'string', 'key property should exist in obstacle and be a string');
    assert.ok(surroundings.back.obstacle.hasOwnProperty('x') && typeof surroundings.back.obstacle.x === 'number', 'x property should exist in obstacle and be a number');
    assert.ok(surroundings.back.obstacle.hasOwnProperty('y') && typeof surroundings.back.obstacle.y === 'number', 'y property should exist in obstacle and be a number');
    assert.ok(surroundings.back.obstacle.hasOwnProperty('direction') && typeof surroundings.back.obstacle.direction === 'string', 'direction property should exist in obstacle and be a string');
    assert.ok(surroundings.back.obstacle.hasOwnProperty('wasHit') && typeof surroundings.back.obstacle.wasHit === 'boolean', 'wasHit property should exist in obstacle and be a boolean');
    assert.ok(surroundings.back.obstacle.hasOwnProperty('score') && typeof surroundings.back.obstacle.score === 'number', 'score property should exist in obstacle and be a number');
    assert.ok(surroundings.back.obstacle.hasOwnProperty('threatLevel') && typeof surroundings.back.obstacle.threatLevel === 'number', 'threatLevel property should exist in obstacle and be a number');
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

  it('hasEnemy should detect enemy in no relative direction while hasWall should detect wall in none', () => {
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
    assert.equal(typeof frontHasEnemy, 'boolean', 'frontHasEnemy should be a boolean');
    assert.equal(typeof backHasEnemy, 'boolean', 'backHasEnemy should be a boolean');
    assert.equal(typeof leftHasEnemy, 'boolean', 'leftHasEnemy should be a boolean');
    assert.equal(typeof rightHasEnemy, 'boolean', 'rightHasEnemy should be a boolean');
    assert.equal(frontHasEnemy, false, 'enemy should not be detected in the front');
    assert.equal(backHasEnemy, false, 'enemy should not be detected in the back');
    assert.equal(leftHasEnemy, false, 'enemy should not be detected on the left');
    assert.equal(rightHasEnemy, false, 'enemy should not be detected on the right');
    const frontHasWall = hasWall(front);
    const backHasWall = hasWall(back);
    const leftHasWall = hasWall(left);
    const rightHasWall = hasWall(right);
    assert.equal(typeof frontHasWall, 'boolean', 'frontHasWall should be a boolean');
    assert.equal(typeof backHasWall, 'boolean', 'backHasWall should be a boolean');
    assert.equal(typeof leftHasWall, 'boolean', 'leftHasWall should be a boolean');
    assert.equal(typeof rightHasWall, 'boolean', 'rightHasWall should be a boolean');
    assert.equal(frontHasWall, false, 'wall should not be detected in the front');
    assert.equal(backHasWall, false, 'wall should not be detected in the back');
    assert.equal(leftHasWall, false, 'wall should not be detected on the left');
    assert.equal(rightHasWall, false, 'wall should not be detected on the right');
  });

  it('hasEnemy should detect enemy in no relative direction while hasWall should detect wall in four', () => {
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
    assert.equal(typeof frontHasEnemy, 'boolean', 'frontHasEnemy should be a boolean');
    assert.equal(typeof backHasEnemy, 'boolean', 'backHasEnemy should be a boolean');
    assert.equal(typeof leftHasEnemy, 'boolean', 'leftHasEnemy should be a boolean');
    assert.equal(typeof rightHasEnemy, 'boolean', 'rightHasEnemy should be a boolean');
    assert.equal(frontHasEnemy, false, 'enemy should not be detected in the front');
    assert.equal(backHasEnemy, false, 'enemy should not be detected in the back');
    assert.equal(leftHasEnemy, false, 'enemy should not be detected on the left');
    assert.equal(rightHasEnemy, false, 'enemy should not be detected on the right');
    const frontHasWall = hasWall(front);
    const backHasWall = hasWall(back);
    const leftHasWall = hasWall(left);
    const rightHasWall = hasWall(right);
    assert.equal(typeof frontHasWall, 'boolean', 'frontHasWall should be a boolean');
    assert.equal(typeof backHasWall, 'boolean', 'backHasWall should be a boolean');
    assert.equal(typeof leftHasWall, 'boolean', 'leftHasWall should be a boolean');
    assert.equal(typeof rightHasWall, 'boolean', 'rightHasWall should be a boolean');
    assert.equal(frontHasWall, true, 'wall should be detected in the front');
    assert.equal(backHasWall, true, 'wall should be detected in the back');
    assert.equal(leftHasWall, true, 'wall should be detected on the left');
    assert.equal(rightHasWall, true, 'wall should be detected on the right');
  });

  it('hasEnemy should detect enemy in one relative direction while hasWall should detect wall in three', () => {
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
    assert.equal(typeof frontHasEnemy, 'boolean', 'frontHasEnemy should be a boolean');
    assert.equal(typeof backHasEnemy, 'boolean', 'backHasEnemy should be a boolean');
    assert.equal(typeof leftHasEnemy, 'boolean', 'leftHasEnemy should be a boolean');
    assert.equal(typeof rightHasEnemy, 'boolean', 'rightHasEnemy should be a boolean');
    assert.equal(frontHasEnemy, true, 'enemy should be detected in the front');
    assert.equal(backHasEnemy, false, 'enemy should not be detected in the back');
    assert.equal(leftHasEnemy, false, 'enemy should not be detected on the left');
    assert.equal(rightHasEnemy, false, 'enemy should not be detected on the right');
    const frontHasWall = hasWall(front);
    const backHasWall = hasWall(back);
    const leftHasWall = hasWall(left);
    const rightHasWall = hasWall(right);
    assert.equal(typeof frontHasWall, 'boolean', 'frontHasWall should be a boolean');
    assert.equal(typeof backHasWall, 'boolean', 'backHasWall should be a boolean');
    assert.equal(typeof leftHasWall, 'boolean', 'leftHasWall should be a boolean');
    assert.equal(typeof rightHasWall, 'boolean', 'rightHasWall should be a boolean');
    assert.equal(frontHasWall, false, 'wall should not be detected in the front');
    assert.equal(backHasWall, true, 'wall should be detected in the back');
    assert.equal(leftHasWall, true, 'wall should be detected on the left');
    assert.equal(rightHasWall, true, 'wall should be detected on the right');
  });

  it('hasEnemy should detect enemy in two relative directions while hasWall should detect wall in two', () => {
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
    assert.equal(typeof frontHasEnemy, 'boolean', 'frontHasEnemy should be a boolean');
    assert.equal(typeof backHasEnemy, 'boolean', 'backHasEnemy should be a boolean');
    assert.equal(typeof leftHasEnemy, 'boolean', 'leftHasEnemy should be a boolean');
    assert.equal(typeof rightHasEnemy, 'boolean', 'rightHasEnemy should be a boolean');
    assert.equal(frontHasEnemy, false, 'enemy should not be detected in the front');
    assert.equal(backHasEnemy, true, 'enemy should be detected in the back');
    assert.equal(leftHasEnemy, false, 'enemy should not be detected on the left');
    assert.equal(rightHasEnemy, true, 'enemy should be detected on the right');
    const frontHasWall = hasWall(front);
    const backHasWall = hasWall(back);
    const leftHasWall = hasWall(left);
    const rightHasWall = hasWall(right);
    assert.equal(typeof frontHasWall, 'boolean', 'frontHasWall should be a boolean');
    assert.equal(typeof backHasWall, 'boolean', 'backHasWall should be a boolean');
    assert.equal(typeof leftHasWall, 'boolean', 'leftHasWall should be a boolean');
    assert.equal(typeof rightHasWall, 'boolean', 'rightHasWall should be a boolean');
    assert.equal(frontHasWall, true, 'wall should be detected in the front');
    assert.equal(backHasWall, false, 'wall should not be detected in the back');
    assert.equal(leftHasWall, true, 'wall should be detected on the left');
    assert.equal(rightHasWall, false, 'wall should not be detected on the right');
  });

  it('hasEnemy should detect enemy in three relative directions while hasWall should detect wall in one', () => {
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
    assert.equal(typeof frontHasEnemy, 'boolean', 'frontHasEnemy should be a boolean');
    assert.equal(typeof backHasEnemy, 'boolean', 'backHasEnemy should be a boolean');
    assert.equal(typeof leftHasEnemy, 'boolean', 'leftHasEnemy should be a boolean');
    assert.equal(typeof rightHasEnemy, 'boolean', 'rightHasEnemy should be a boolean');
    assert.equal(frontHasEnemy, true, 'enemy should be detected in the front');
    assert.equal(backHasEnemy, true, 'enemy should be detected in the back');
    assert.equal(leftHasEnemy, true, 'enemy should be detected on the left');
    assert.equal(rightHasEnemy, false, 'enemy should not be detected on the right');
    const frontHasWall = hasWall(front);
    const backHasWall = hasWall(back);
    const leftHasWall = hasWall(left);
    const rightHasWall = hasWall(right);
    assert.equal(typeof frontHasWall, 'boolean', 'frontHasWall should be a boolean');
    assert.equal(typeof backHasWall, 'boolean', 'backHasWall should be a boolean');
    assert.equal(typeof leftHasWall, 'boolean', 'leftHasWall should be a boolean');
    assert.equal(typeof rightHasWall, 'boolean', 'rightHasWall should be a boolean');
    assert.equal(frontHasWall, false, 'wall should not be detected in the front');
    assert.equal(backHasWall, false, 'wall should not be detected in the back');
    assert.equal(leftHasWall, false, 'wall should not be detected on the left');
    assert.equal(rightHasWall, true, 'wall should be detected on the right');
  });

  it('hasEnemy should detect enemy in four relative directions while hasWall should detect wall in none', () => {
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
    assert.equal(typeof frontHasEnemy, 'boolean', 'frontHasEnemy should be a boolean');
    assert.equal(typeof backHasEnemy, 'boolean', 'backHasEnemy should be a boolean');
    assert.equal(typeof leftHasEnemy, 'boolean', 'leftHasEnemy should be a boolean');
    assert.equal(typeof rightHasEnemy, 'boolean', 'rightHasEnemy should be a boolean');
    assert.equal(frontHasEnemy, true, 'enemy should be detected in the front');
    assert.equal(backHasEnemy, true, 'enemy should be detected in the back');
    assert.equal(leftHasEnemy, true, 'enemy should be detected on the left');
    assert.equal(rightHasEnemy, true, 'enemy should be detected on the right');
    const frontHasWall = hasWall(front);
    const backHasWall = hasWall(back);
    const leftHasWall = hasWall(left);
    const rightHasWall = hasWall(right);
    assert.equal(typeof frontHasWall, 'boolean', 'frontHasWall should be a boolean');
    assert.equal(typeof backHasWall, 'boolean', 'backHasWall should be a boolean');
    assert.equal(typeof leftHasWall, 'boolean', 'leftHasWall should be a boolean');
    assert.equal(typeof rightHasWall, 'boolean', 'rightHasWall should be a boolean');
    assert.equal(frontHasWall, false, 'wall should not be detected in the front');
    assert.equal(backHasWall, false, 'wall should not be detected in the back');
    assert.equal(leftHasWall, false, 'wall should not be detected on the left');
    assert.equal(rightHasWall, false, 'wall should not be detected on the right');
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

  it('escape should return R when being hit from the front and the back while left has a wall within distance 2', () => {
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
    assert.ok(typeof action === 'string' && action.length === 1, 'action should be a string of length 1');
    assert.equal(action, 'R', 'R should be returned when being hit from the front and the back while left has a wall within distance 2');
  });

  it('escape should return L when being hit from the front and the back while right has a wall within distance 2', () => {
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
    assert.ok(typeof action === 'string' && action.length === 1, 'action should be a string of length 1');
    assert.equal(action, 'L', 'L should be returned when being hit from the front and the back while right has a wall within distance 2');
  });

  it('escape should return L or R when being hit from the front and the back while left and right have no wall', () => {
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
    assert.ok(typeof action === 'string' && action.length === 1, 'action should be a string of length 1');
    assert.ok(['L', 'R'].includes(action), 'L or R should be returned when being hit from the front and the back while left and right have no wall');
  });

  it('escape should return R when being hit from the left and the right while front has a wall and right enemy has a higher score', () => {
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
    assert.ok(typeof action === 'string' && action.length === 1, 'action should be a string of length 1');
    assert.equal(action, 'R', 'R should be returned when being hit from the left and the right while front has a wall and right enemy has a higher score');
  });

  it('escape should return R when being hit from the right while front has a wall at distance 1 and left has a wall within distance 2', () => {
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
    assert.ok(typeof action === 'string' && action.length === 1, 'action should be a string of length 1');
    assert.equal(action, 'R', 'R should be returned when being hit from the right while front has a wall at distance 1 and left has a wall within distance 2');
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

  it('hunt should return F when enemy is in the front at a distance 5', () => {
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
    assert.ok(typeof action === 'string' && action.length === 1, 'action should be a string of length 1');
    assert.equal(action, 'F', 'F should be returned when enemy is in the front at a distance 5');
  });

  it('hunt should return F when enemy is on the left within range of throw when stepped forward', () => {
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
    assert.ok(typeof action === 'string' && action.length === 1, 'action should be a string of length 1');
    assert.equal(action, 'F', 'F should be returned when enemy is on the left within range of throw when stepped forward');
  });

  it('hunt should return F when enemy is on the right within range of throw when stepped forward', () => {
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
    assert.ok(typeof action === 'string' && action.length === 1, 'action should be a string of length 1');
    assert.equal(action, 'F', 'F should be returned when enemy is on the right within range of throw when stepped forward');
  });

  it('decideAction should return L when being hit from the left and forward has a wall', () => {
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
    assert.ok(typeof action === 'string' && action.length === 1, 'action should be a string of length 1');
    assert.equal(action, 'L', 'L should be returned when being hit from the left and forward has a wall');
  });

  it('decideAction should return R when being hit from the right and forward has a wall', () => {
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
    assert.ok(typeof action === 'string' && action.length === 1, 'action should be a string of length 1');
    assert.equal(action, 'R', 'R should be returned when being hit from the right and forward has a wall');
  });

  it('decideAction should return L when being hit from the left and the back while forward has a wall', () => {
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
    assert.ok(typeof action === 'string' && action.length === 1, 'action should be a string of length 1');
    assert.equal(action, 'L', 'L should be returned when being hit from the left and the back while forward has a wall');
  });

  it('decideAction should return R when being hit from the left and the back while forward has a wall', () => {
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
    assert.ok(typeof action === 'string' && action.length === 1, 'action should be a string of length 1');
    assert.equal(action, 'R', 'R should be returned when being hit from the left and the back while forward has a wall');
  });

  it('decideAction should return F when being hit from the left and forward is available', () => {
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
    assert.ok(typeof action === 'string' && action.length === 1, 'action should be a string of length 1');
    assert.equal(action, 'F', 'F should be returned when being hit from the left and forward is available');
  });

  it('decideAction should return F when being hit from the right and forward is available', () => {
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
    assert.ok(typeof action === 'string' && action.length === 1, 'action should be a string of length 1');
    assert.equal(action, 'F', 'F should be returned when being hit from the right and forward is available');
  });
});
