const directionAngle = {
  N: 0,
  E: 90,
  S: 180,
  W: 270,
};

const angleDirection = {
  0: 'N',
  90: 'E',
  180: 'S',
  270: 'W',
};

export function compareDirections(directionA, directionB) {
  return directionAngle[directionA] - directionAngle[directionB];
}

export function createEmptyArena(rows = 0, cols = 0) {
  return [...Array(rows)].map(row => Array(cols).fill(null));
}

export function scanArena(dims, state) {
  const arena = createEmptyArena(dims[1], dims[0]);

  for (let key in state) {
    const { x, y } = state[key];
    arena[y][x] = { key, ...state[key] };
  }

  return arena;
}

export function parseState(state, ownKey) {
  const ownState = state[ownKey];
  delete state[ownKey];

  return { ownState, enemyState: state };
}

export function rankEnemies(state) {
  const botIds = Object.keys(state);

  return botIds.sort((botIdA, botIdB) => {
    return state[botIdB].score - state[botIdA].score;
  });
}

export function checkIndexInRange(index, dimLimit) {
  return index >= 0 && index < dimLimit;
}

export function getDimAndIndex(direction, relativeDirection) {
  switch (relativeDirection) {
    case 'front':
    case 'back':
      return ['E', 'W'].includes(direction) ? { dim: 'x', index: 0 } : { dim: 'y', index: 1 };
    case 'left':
    case 'right':
      return ['E', 'W'].includes(direction) ? { dim: 'y', index: 1 } : { dim: 'x', index: 0 };
    default:
      throw Error(`Invalid relativeDirection - ${relativeDirection}`);
  }
}

export function getMultiplier(direction, relativeDirection) {
  switch (relativeDirection) {
    case 'front':
      return ['E', 'S'].includes(direction) ? 1 : -1;
    case 'back':
      return ['E', 'S'].includes(direction) ? -1 : 1;
    case 'left':
      return ['W', 'S'].includes(direction) ? 1 : -1;
    case 'right':
      return ['W', 'S'].includes(direction) ? -1 : 1;
    default:
      throw Error(`Invalid relativeDirection - ${relativeDirection}`);
  }
}

export function locateTarget({ ownState, enemyState }) {
  const { direction } = ownState;
  const rankedIds = rankEnemies(enemyState);

  if (!rankedIds.length) return null;

  const targetState = enemyState[rankedIds[rankedIds.length - 1]];

  const longitudinalAxis = getDimAndIndex(direction, 'front');
  const transverseAxis = getDimAndIndex(direction, 'right');
  const longitudinalMultiplier = getMultiplier(direction, 'front');
  const transverseMultiplier = getMultiplier(direction, 'right');
  const longitudinal = (targetState[longitudinalAxis.dim] - ownState[longitudinalAxis.dim]) * longitudinalMultiplier;
  const transverse = (targetState[transverseAxis.dim] - ownState[transverseAxis.dim]) * transverseMultiplier;

  return { longitudinal, transverse };
}

export function getForwardState(ownState, dims) {
  const forwardState = { ...ownState };
  const { direction } = forwardState;
  const { dim, index } = getDimAndIndex(direction, 'front');
  const multiplier = getMultiplier(direction, 'front');

  if (checkIndexInRange(forwardState[dim] + multiplier, dims[index])) {
    forwardState[dim] += multiplier;
    return forwardState;
  }

  return false
}

export function getTurnState(ownState, turn) {
  const multiplier = turn === 'L' ? -1 : 1;
  let rotatedAngle = (directionAngle[ownState.direction] + 90 * multiplier) % 360;

  if (rotatedAngle < 0) {
    rotatedAngle += 360;
  }

  const direction = angleDirection[rotatedAngle];

  return { ...ownState, direction };
}

export function getThreatLevel(ownDirection, enemyDirection, relativeDirection) {
  const compareValue = compareDirections(enemyDirection, ownDirection);

  switch (relativeDirection) {
    case 'front':
      if (compareValue === 0) return -1;
      else if (Math.abs(compareValue) === 180) return 1;
      else return 0;
    case 'back':
      if (compareValue === 0) return 1;
      else if (Math.abs(compareValue) === 180) return -1;
      else return 0;
    case 'left':
      if ([-270, 90].includes(compareValue)) return 1;
      else if ([-90, 270].includes(compareValue)) return -1;
      else return 0;
    case 'right':
      if ([-270, 90].includes(compareValue)) return -1;
      else if ([-90, 270].includes(compareValue)) return 1;
      else return 0;
    default:
      throw Error(`Invalid relativeDirection - ${relativeDirection}`);
  }
}

export function analyzeThreats(surroundings) {
  const { front, back, left, right } = surroundings;

  const longitudinal = [front, back].reduce((threatCount, relativeDirection) => {
    return relativeDirection.obstacle?.threatLevel && relativeDirection.obstacle.threatLevel > 0
      ? threatCount + relativeDirection.obstacle.threatLevel
      : threatCount;
  }, 0);

  const transverse = [left, right].reduce((threatCount, relativeDirection) => {
    return relativeDirection.obstacle?.threatLevel && relativeDirection.obstacle.threatLevel > 0
      ? threatCount + relativeDirection.obstacle.threatLevel
      : threatCount;
    }, 0);

  const overall = longitudinal + transverse;
  return { longitudinal, transverse, overall };
}

export function scanSurroundings(ownState, arena, dims, visibility = 5) {
  const surroundings = {
    front: { obstacle: null, distance: visibility },
    back: { obstacle: null, distance: visibility },
    left: { obstacle: null, distance: visibility },
    right: { obstacle: null, distance: visibility }
  };
  const relativeDirections = Object.keys(surroundings);
  const { direction } = ownState;

  function findObstacle(direction) {
    return relativeDirection => {
      const multiplier = getMultiplier(direction, relativeDirection);
      const { dim, index } = getDimAndIndex(direction, relativeDirection);

      for (let i = 1; i <= visibility; i++) {
        if (!checkIndexInRange(ownState[dim] + i * multiplier, dims[index])) {
          surroundings[relativeDirection].obstacle = 'wall';
          surroundings[relativeDirection].distance = i;
          break;
        }

        const yIndex = dim === 'y' ? ownState.y + i * multiplier : ownState.y;
        const xIndex = dim === 'x' ? ownState.x + i * multiplier : ownState.x;

        const enemyState = arena[yIndex][xIndex];
        if (enemyState) {
          surroundings[relativeDirection].obstacle = {
            ...arena[yIndex][xIndex],
            threatLevel: getThreatLevel(direction, enemyState.direction, relativeDirection)
          };
          surroundings[relativeDirection].distance = i;
          break;
        }
      }
    };
  }

  relativeDirections.forEach(findObstacle(direction));

  return surroundings;
}

export function hasEnemy({ obstacle }) {
  return typeof obstacle === 'object' && obstacle !== null;
}

export function hasWall({ obstacle }) {
  return obstacle === 'wall';
}

export function checkEnemyInRange({ obstacle, distance }, offset = 0) {
  return hasEnemy({ obstacle }) && distance + offset < 4;
}

export function getMoves(frontDistance) {
  const moves = ['L', 'R', 'T'];

  if (frontDistance > 1) {
    moves.push('F');
  }

  return moves;
}

export function evaluateDelta(surroundings) {
  const benefit = checkEnemyInRange(surroundings.front) ? 1 : 0;
  const relativeDirections = Object.keys(surroundings);

  const cost = relativeDirections.reduce((subtotal, relativeDirection) => {
    const relativeDirectionView = surroundings[relativeDirection];

    if (
      checkEnemyInRange(relativeDirectionView) &&
      relativeDirectionView.obstacle?.threatLevel > 0
    ) {
      return subtotal + 1;
    }

    return subtotal;
  }, 0);

  return benefit - cost;
}

function getRandomAction(actions = []) {
  return actions.length
    ? actions[Math.floor(Math.random()) * actions.length]
    : '';
}

export function getNextState(ownState, move, dims = [0, 0]) {
  switch (move) {
    case 'F':
      return getForwardState(ownState, dims);
    case 'L':
    case 'R':
      return getTurnState(ownState, move);
    default:
      return ownState;
  }
}

export function escape(surroundings, targetLocator = null) {
  const { front, back, left, right } = surroundings;

  if (
    // front has enemy or a wall at distance 1
    front.distance === 1
  ) {
    if (
      // left, right and back has no space for escape
      left.distance === 1 &&
      right.distance === 1 &&
      back.distance === 1
    ) {
      if (
        // front has an enemy
        hasEnemy(front)
      ) {
        return 'T';
      } else if (
        // both left and right have enemy
        hasEnemy(left) &&
        hasEnemy(right)
      ) {
        if (
          // left enemy has a higher score
          left.obstacle.score > right.obstacle.score
        ) {
          return 'L';
        } else {
          // right enemy has a higher score
          return 'R';
        }
      } else if (
        // left has an enemy
        hasEnemy(left)
      ) {
        return 'L';
      } else {
        // right has an enemy
        return 'R';
      }
    } else if (
      // only left has space for escape
      left.distance > 1 &&
      right.distance === 1 &&
      back.distance === 1
    ) {
      return 'L';
    } else if (
      // only right has space for escape
      right.distance > 1 &&
      left.distance === 1 &&
      back.distance === 1
    ) {
      return 'R';
    } else if (
      // only back has space for escape
      back.distance > 1 &&
      left.distance === 1 &&
      right.distance === 1
    ) {
      if (
        // both left and right have enemy
        hasEnemy(left) &&
        hasEnemy(right)
      ) {
        if (
          // left enemy has a higher score
          left.obstacle.score > right.obstacle.score
        ) {
          return 'L';
        } else {
          // right enemy has a higher score
          return 'R';
        }
      } else if (
        // left has an enemy
        hasEnemy(left)
      ) {
        return 'L';
      } else {
        // right has an enemy
        return 'R';
      }
    } else if (
      // left has space for escape while right has none
      left.distance > 1 &&
      right.distance === 1
    ) {
      return 'L';
    } else if (
      // right has space for escape while left has none
      right.distance > 1 &&
      left.distance === 1
    ) {
      return 'R';
    } else if (
      // both left and right have space for escape
      left.distance > 1 &&
      right.distance > 1
    ) {
      if (
        // both left and right have enemy
        hasEnemy(left) &&
        hasEnemy(right)
      ) {
        if (
          // left enemy has a higher score
          left.obstacle.score > right.obstacle.score
        ) {
          return 'L';
        } else {
          // right enemy has a higher score
          return 'R';
        }
      } else if (
        // left has an enemy
        hasEnemy(left)
      ) {
        return 'L';
      } else if (
        // right has an enemy
        hasEnemy(right)
      ) {
        return 'R';
      } else {
        // no enemy on either left or right
        if (
          // left has a wall within distance 2
          hasWall(left) && left.distance < 3
        ) {
          return 'R';
        } else if (
          // right has a wall within distance 2
          hasWall(right) && right.distance < 3
        ) {
          return 'L';
        } else {
          // no wall on both left and right within distance 2
          if (targetLocator) {
            if (
              // target on the left
              targetLocator.transverse < 0
            ) {
              return 'L';
            } else if (
              // target on the right
              targetLocator.transverse > 0
            ) {
              return 'R';
            }
          } else {
            return getRandomAction(['L', 'R']);
          }
        }
      }
    }
  } else if (
      // front has enemy within range of throw
      checkEnemyInRange(front)
    ) {
    if (
      // left or right has enemy
      checkEnemyInRange(left) ||
      checkEnemyInRange(right)
    ) {
      return 'F';
    } else {
      // turn regardless of whether back has enemy or not
      if (
        // left has a wall within distance 2
        hasWall(left) && left.distance < 3
      ) {
        return 'R';
      } else if (
        // right has a wall within distance 2
        hasWall(right) && right.distance < 3
      ) {
        return 'L';
      } else {
        // no wall on both left and right within distance 2
        if (targetLocator) {
          if (
            // target on the left
            targetLocator.transverse < 0
          ) {
            return 'L';
          } else if (
            // target on the right
            targetLocator.transverse > 0
          ) {
            return 'R';
          }
        } else {
          return getRandomAction(['L', 'R']);
        }
      }
    }
  } else {
    // front has no enemy or wall within distance 1
    if (
      // left or right has enemy
      checkEnemyInRange(left) ||
      checkEnemyInRange(right)
    ) {
      return 'F';
    } else {
      // back has enemy
      if (
        // back has enemy at distance 3
        back.distance === 3
      ) {
        return 'F';
      } else {
        if (
          // left has a wall within distance 2
          hasWall(left) && left.distance < 3
        ) {
          return 'R';
        } else if (
          // right has a wall within distance 2
          hasWall(right) && right.distance < 3
        ) {
          return 'L';
        } else {
          // no wall on both left and right within distance 2
          if (targetLocator) {
            if (
              // target on the left
              targetLocator.transverse < 0
            ) {
              return 'L';
            } else if (
              // target on the right
              targetLocator.transverse > 0
            ) {
              return 'R';
            }
          } else {
            return getRandomAction(['L', 'R']);
          }
        }
      }
    }
  }
}

function turnToHighScorer(surroundings) {
  const { left, right } = surroundings;

  if (
    // both left and right have enemies
    hasEnemy(left) &&
    hasEnemy(right)
  ) {
    // turn to the enemy with higher score
    return left.obstacle.score > right.obstacle.score ? 'L' : 'R';
  }

  // only left has an enemy
  if (hasEnemy(left)) {
    return 'L';
  }

  // right or back has an enemy
  return 'R';
}

function decideForwardOrTurn(threatAnalysis, turn) {
  if (
    // at least 1 enemy is facing this way from the left or right or no enemy is facing this way from the front or back
    threatAnalysis.transverse > 0 ||
    threatAnalysis.longitudinal <= 0
  ) {
    return 'F';
  }

  // turn otherwise
  return turn;
}

export function escapeNew(surroundings, targetLocator = null) {
  const { front, back, left, right } = surroundings;
  const threatAnalysis = analyzeThreats(surroundings);
  const turnPreference = turnToHighScorer(surroundings);

  if (
    // front, left and right have no room to escape
    front.distance === 1 &&
    left.distance === 1 &&
    right.distance === 1
  ) {
    if (
      // back has no room to escape and front has an enemy
      back.distance === 1 &&
      hasEnemy(front)
    ) {
      return 'T';
    }

    return turnPreference;
  }

  if (
    // only front has room to escape
    front.distance > 1 &&
    left.distance === 1 &&
    right.distance === 1
  ) {
    return 'F';
  }

  if (
    // only left has room to escape
    front.distance === 1 &&
    left.distance > 1 &&
    right.distance === 1
  ) {
    return 'L';
  }

  if (
    // only right has room to escape
    front.distance === 1 &&
    left.distance === 1 &&
    right.distance > 1
  ) {
    return 'R';
  }

  if (
    // left has no room to escape
    front.distance > 1 &&
    left.distance === 1 &&
    right.distance > 1
  ) {
    return decideForwardOrTurn(threatAnalysis, 'R');
  }

  if (
    // right has no room to escape
    front.distance > 1 &&
    left.distance > 1 &&
    right.distance === 1
  ) {
    return decideForwardOrTurn(threatAnalysis, 'L');
  }

  if (
    // front has no room to escape
    front.distance === 1 &&
    left.distance > 1 &&
    right.distance > 1
  ) {
    return turnPreference;
  }

  return decideForwardOrTurn(threatAnalysis, turnPreference);
}

export function hunt(surroundings, forwardSurroundings = false, targetLocator = null) {
  const { front, back, left, right } = surroundings;

  // look for proximal target at cost 1
  if (
    // both left and right have enemy within range of throw and front has enemy at distance 4
    checkEnemyInRange(front) &&
    checkEnemyInRange(left) &&
    checkEnemyInRange(right)
  ) {
    const threatAnalysis = analyzeThreats(surroundings);
    if (
      // at least 2 enemy are considered threats
      threatAnalysis.overall > 1
    ) {
      return 'F';
    } else if (
      // only 1 enemy is considered a threat
      threatAnalysis.overall === 1
    ) {
      if (
        // left or right enemy is a threat
        left.obstacle.threatLevel === 1 ||
        right.obstacle.threatLevel === 1
      ) {
        return 'F';
      } else {
        // front enemy is a potential threat if stepped forward
        if (
          // left enemy has a higher score
          left.obstacle.score > right.obstacle.score
        ) {
          return 'L';
        } else {
          // right enemy has a higher score
          return 'R';
        }
      }
    } else {
      // no immediate threat among the 3 enemies
      const highestScore = Math.max(front.obstacle.score, left.obstacle.score, right.obstacle.score);
      if (
        // left enemy has the highest score among the 3
        highestScore === left.obstacle.score
      ) {
        return 'L';
      } else if (
        // right enemy has the highest score among the 3
        highestScore === right.obstacle.score
      ) {
        return 'R';
      } else {
        // front enemy has the highest score among the 3
        return 'F';
      }
    }
  } else if (
    // both left and right have enemy within range of throw
    checkEnemyInRange(left) &&
    checkEnemyInRange(right)
  ) {
    if (
      // left enemy has a higher score
      left.obstacle.score > right.obstacle.score
    ) {
      return 'L';
    } else {
      // right enemy has a higher score
      return 'R';
    }
  } else if (
    // left has enemy within range of throw and front has enemy at distance 4
    !checkEnemyInRange(front) && checkEnemyInRange(front, -1) &&
    checkEnemyInRange(left)
  ) {
    if (
      // left enemy is a threat
      left.obstacle.threatLevel === 1
    ) {
      return 'F';
    } else {
      if (
        // left enemy has a higher score
        left.obstacle.score > front.obstacle.score
      ) {
        return 'L';
      } else {
        // front enemy has a higher score
        return 'F';
      }
    }
  } else if (
    // right has enemy within range of throw and front has enemy at distance 4
    !checkEnemyInRange(front) && checkEnemyInRange(front, -1) &&
    checkEnemyInRange(right)
  ) {
    if (
      // right enemy is a threat
      right.obstacle.threatLevel === 1
    ) {
      return 'F';
    } else {
      if (
        // right enemy has a higher score
        right.obstacle.score > front.obstacle.score
      ) {
        return 'R';
      } else {
        // front enemy has a higher score
        return 'F';
      }
    }
  } else if (
    // left has enemy within range of throw
    checkEnemyInRange(left)
  ) {
    return 'L';
  } else if (
    // right has enemy within range of throw
    checkEnemyInRange(right)
  ) {
    return 'R';
  } else if (
    // front has enemy at distance 4
    !checkEnemyInRange(front) && checkEnemyInRange(front, -1)
  ) {
    return 'F';
  }

  // look for proximal target at cost 2
  if (
    // back has enemy within range of throw and both left and right have enemy at distance 4
    !checkEnemyInRange(left) && checkEnemyInRange(left, -1) &&
    !checkEnemyInRange(right) && checkEnemyInRange(right, -1) &&
    checkEnemyInRange(back)
  ) {
    if (
      // left enemy has a higher score
      left.obstacle.score > right.obstacle.score
    ) {
      return 'L';
    } else {
      // right enemy has a higher score
      return 'R';
    }
  } else if (
    // both left and right have enemy at distance 4
    !checkEnemyInRange(left) && checkEnemyInRange(left, -1) &&
    !checkEnemyInRange(right) && checkEnemyInRange(right, -1)
  ) {
    if (
      // left enemy has a higher score
      left.obstacle.score > right.obstacle.score
    ) {
      return 'L';
    } else {
      // right enemy has a higher score
      return 'R';
    }
  } else if (
    // back has enemy within range of throw and left has enemy at distance 4
    !checkEnemyInRange(left) && checkEnemyInRange(left, -1) &&
    checkEnemyInRange(back)
  ) {
    return 'L';
  } else if (
    // back has enemy within range of throw and right has enemy at distance 4
    !checkEnemyInRange(right) && checkEnemyInRange(right, -1) &&
    checkEnemyInRange(back)
  ) {
    return 'R';
  } else if (
    // back has enemy within range of throw
    checkEnemyInRange(back)
  ) {
    if (
      // left has a wall within distance 2
      hasWall(left) && left.distance < 3
    ) {
      return 'R';
    } else if (
      // right has a wall within distance 2
      hasWall(right) && right.distance < 3
    ) {
      return 'L';
    } else {
      // no wall on both left and right within distance 2
      if (targetLocator) {
        if (
          // target on the left
          targetLocator.transverse < 0
        ) {
          return 'L';
        } else if (
          // target on the right
          targetLocator.transverse > 0
        ) {
          return 'R';
        }
      } else {
        return getRandomAction(['L', 'R']);
      }
    }
  } else if (
    // left has enemy at distance 4
    !checkEnemyInRange(left) && checkEnemyInRange(left, -1)
  ) {
    return 'L';
  } else if (
    // right has enemy at distance 4
    !checkEnemyInRange(right) && checkEnemyInRange(right, -1)
  ) {
    return 'R';
  } else if (
    // front has enemy at distance 5
    !checkEnemyInRange(front, -1) && checkEnemyInRange(front, -2)
  ) {
    return 'F';
  } else if (
    // check for forward surroundings if forward is available
    forwardSurroundings
  ) {
    if (
      // both left and right have enemy within range of throw when stepped forward
      checkEnemyInRange(forwardSurroundings.left) &&
      checkEnemyInRange(forwardSurroundings.right)
    ) {
      if (
        // both left and right enemy are threats when stepped forward
        forwardSurroundings.left.obstacle.threatLevel === 1 &&
        forwardSurroundings.right.obstacle.threatLevel === 1
      ) {
        if (
          // left enemy has a higher score
          forwardSurroundings.left.obstacle.score < forwardSurroundings.right.obstacle.score
        ) {
          return 'L';
        } else {
          // right enemy has a higher score
          return 'R';
        }
      } else if (
        // left enemy is a threat when stepped forward
        forwardSurroundings.left.obstacle.threatLevel === 1
      ) {
        return 'L';
      } else if (
        // right enemy is a threat when stepped forward
        forwardSurroundings.right.obstacle.threatLevel === 1
      ) {
        return 'R';
      } else {
        // both left and right enemy are not threat when stepped forward
        return 'F';
      }
    } else if (
      // either left or right has enemy within range of throw when stepped forward
      checkEnemyInRange(forwardSurroundings.left) &&
      checkEnemyInRange(forwardSurroundings.right)
    ) {
      return 'F';
    }
  }

  // no proximal target under cost 2
  if (
    // front has no wall within distance 2
    front.distance > 2
  ) {
    return 'F';
  } else {
    return getRandomAction(['L', 'R']);
  }
}

function approachProximalTargetAtCost1(surroundings, threatAnalysis, turnPreference) {
  const { front, left, right } = surroundings;

  // front has no room to move
  if (front.distance === 1) {
    return turnPreference;
  }

  if (
    // front has an enemy just out of reach while left and right have no enemy
    checkEnemyInRange(front, -1) &&
    !checkEnemyInRange(left) &&
    !checkEnemyInRange(right)
  ) {
    return 'F';
  }

  if (
    // front has an enemy just out of reach and left has an enemy within range of throw
    checkEnemyInRange(front, -1) &&
    checkEnemyInRange(left) &&
    !checkEnemyInRange(right)
  ) {
    return decideForwardOrTurn(threatAnalysis, 'L');
  }

  if (
    // front has an enemy just out of reach and right has an enemy within range of throw
    checkEnemyInRange(front, -1) &&
    !checkEnemyInRange(left) &&
    checkEnemyInRange(right)
  ) {
    return decideForwardOrTurn(threatAnalysis, 'R');
  }

  if (
    // front has an enemy just out of reach while left and right have enemies within range of throw
    checkEnemyInRange(front, -1) &&
    checkEnemyInRange(left) &&
    checkEnemyInRange(right)
  ) {
    return decideForwardOrTurn(threatAnalysis, turnPreference);
  }

  return '';
}

function chooseProximalTarget(surroundings, forwardSurroundings, turnPreference) {
  const { front, back, left, right } = surroundings;

  // iterate through all possible actions to locate proximal targets at cost 2
  const proximalTargetLocators = [];

  if (checkEnemyInRange(front, -2)) {
    proximalTargetLocators.push({ actions: 'FF', score: front.obstacle.score });
  }

  if (checkEnemyInRange(forwardSurroundings.left)) {
    proximalTargetLocators.push({ actions: 'FL', score: forwardSurroundings.left.obstacle.score });
  }

  if (checkEnemyInRange(forwardSurroundings.right)) {
    proximalTargetLocators.push({ actions: 'FR', score: forwardSurroundings.right.obstacle.score });
  }

  if (checkEnemyInRange(left, -1)) {
    proximalTargetLocators.push({ actions: 'LF', score: left.obstacle.score });
  }

  if (checkEnemyInRange(right, -1)) {
    proximalTargetLocators.push({ actions: 'RF', score: right.obstacle.score });
  }

  if (checkEnemyInRange(back)) {
    proximalTargetLocators.push({ actions: turnPreference + turnPreference, score: back.obstacle.score });
  }

  // at least 1 proximal target located
  if (proximalTargetLocators.length) {
    proximalTargetLocators.sort((locatorA, locatorB) => locatorB.score - locatorA.score);
    const { actions } = proximalTargetLocators[proximalTargetLocators.length - 1];

    return actions[0];
  }

  return '';
}

function approachProximalTargetAtCost2(surroundings, forwardSurroundings, threatAnalysis, turnPreference) {
  const forwardThreatAnalysis = analyzeThreats(forwardSurroundings);

  // front has fewer enemies facing this way from left and right than those at the current location
  if (threatAnalysis.transverse > forwardThreatAnalysis.transverse) {
    return 'F';
  }

  // front has more enemies facing this way from left and right than those at the current location
  if (threatAnalysis.transverse < forwardThreatAnalysis.transverse) {
    return turnPreference;
  }

  return chooseProximalTarget(surroundings, forwardSurroundings, turnPreference);
}

function approachDistalTarget(targetLocator) {
  const { longitudinal, transverse } = targetLocator;

  // target is not in the front
  if (longitudinal <= 0) {
    // target on the left
    if (transverse < 0) {
      return 'L';
    }

    // target on the right
    if (transverse > 0) {
      return 'R';
    }

    return getRandomAction(['L', 'R']);
  }

  // target in the front
  if (transverse === 0) {
    return 'F';
  }

  // target is closer from the side than from the front
  if (Math.abs(transverse) < longitudinal) {
    // target on the front-left
    if (transverse < 0) {
      return 'L';
    }

    // target on the front-right
    return 'R';
  }

  return 'F';
}

export function huntNew(surroundings, forwardSurroundings = false, targetLocator = null) {
  const threatAnalysis = analyzeThreats(surroundings);
  const turnPreference = turnToHighScorer(surroundings);

  // look for proximal target at cost 0
  if (checkEnemyInRange(surroundings.front)) {
    return 'T';
  }

  // look for proximal target at cost 1
  const actionAtCost1 = approachProximalTargetAtCost1(surroundings, threatAnalysis, turnPreference);

  if (actionAtCost1) {
    return actionAtCost1;
  }

  // look for proximal target at cost 2
  const actionAtCost2 = approachProximalTargetAtCost2(surroundings, forwardSurroundings, threatAnalysis, turnPreference);

  if (actionAtCost2) {
    return actionAtCost2;
  }

  // target available
  if (targetLocator) {
    return approachDistalTarget(targetLocator);
  }

  return getRandomAction(['L', 'R']);
}

export function decideAction(wasHit, surroundings, forwardSurroundings = false, targetLocator = null) {
  // escape if under attack
  if (wasHit) return escapeNew(surroundings, targetLocator);
  // hunt otherwise
  else return huntNew(surroundings, forwardSurroundings, targetLocator);
}

export function decideMove(ownState, arena, dims) {
  const { front } = scanSurroundings(ownState, arena, dims);

  if (!ownState.wasHit && checkEnemyInRange(front)) {
    return 'T';
  }

  const moves = getMoves(front.distance);
  const moveOptions = moves.map(move => {
    const nextState = getNextState(ownState, move, dims);
    const nextSurroundings = scanSurroundings(nextState, arena, dims);
    const delta = evaluateDelta(nextSurroundings);

    return { move, delta };
  });

  moveOptions.sort((moveOptionA, moveOptionB) => moveOptionB.delta - moveOptionA.delta);

  return moveOptions[0].move;
}
