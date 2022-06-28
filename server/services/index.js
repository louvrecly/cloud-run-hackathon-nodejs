const directionAngle = {
  N: 0,
  E: 90,
  S: 180,
  W: 270
};

export function compareDirections(directionA, directionB) {
  return directionAngle[directionA] - directionAngle[directionB];
}

export function scanArena(dims, state) {
  const arena = [...Array(dims[1])].map(row => Array(dims[0]).fill(null));

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

export function locateLeadingEnemy({ ownState, enemyState }) {
  const { direction } = ownState;
  const rankedIds = rankEnemies(enemyState);
  const targetState = enemyState[rankedIds[0]];

  const longitudinalAxis = getDimAndIndex(direction, 'front');
  const transverseAxis = getDimAndIndex(direction, 'right');
  const longitudinalMultiplier = getMultiplier(direction, 'front');
  const transverseMultiplier = getMultiplier(direction, 'right');
  const longitudinal = (targetState[longitudinalAxis.dim] - ownState[longitudinalAxis.dim]) * longitudinalMultiplier;
  const transverse = (targetState[transverseAxis.dim] - ownState[transverseAxis.dim]) * transverseMultiplier;

  return { longitudinal, transverse };
}

export function getForwardState(ownState, dims) {
  const { direction } = ownState;
  const { dim, index } = getDimAndIndex(direction, 'front');
  const multiplier = getMultiplier(direction, 'front');

  if (checkIndexInRange(ownState[dim] + multiplier, dims[index])) {
    ownState[dim] += multiplier;
    return ownState;
  }

  return false
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

export function evaluateOverallThreat(...threatLevels) {
  return threatLevels.reduce((overallThreat, threatLevel) => threatLevel > 0 ? overallThreat + threatLevel : overallThreat, 0);
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

      for (let i = 1; i < visibility; i++) {
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

export function checkEnemyInRange({ obstacle, distance }) {
  return typeof obstacle === 'object' && obstacle !== null && distance < 4;
}

export function hasEnemy({ obstacle }) {
  return !!obstacle && obstacle !== 'wall';
}

export function hasWall({ obstacle }) {
  return obstacle === 'wall';
}

export function escape(surroundings, targetLocation = null) {
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
          if (targetLocation) {
            if (
              // target on the left
              targetLocation.transverse < 0
            ) {
              return 'L';
            } else if (
              // target on the right
              targetLocation.transverse > 0
            ) {
              return 'R';
            }
          } else {
            return ['L', 'R'][Math.floor(Math.random()) * 2];
          }
        }
      }
    }
  } else if (
    // front has enemy within range of throw
    hasEnemy(front) && front.distance < 4
    ) {
    if (
      // left or right has enemy
      (hasEnemy(left) && left.distance < 4) ||
      (hasEnemy(right) && right.distance < 4)
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
        if (targetLocation) {
          if (
            // target on the left
            targetLocation.transverse < 0
          ) {
            return 'L';
          } else if (
            // target on the right
            targetLocation.transverse > 0
          ) {
            return 'R';
          }
        } else {
          return ['L', 'R'][Math.floor(Math.random()) * 2];
        }
      }
    }
  } else {
    // front has no enemy or wall within distance 1
    if (
      // left or right has enemy
      (hasEnemy(left) && left.distance < 4) ||
      (hasEnemy(right) && right.distance < 4)
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
          if (targetLocation) {
            if (
              // target on the left
              targetLocation.transverse < 0
            ) {
              return 'L';
            } else if (
              // target on the right
              targetLocation.transverse > 0
            ) {
              return 'R';
            }
          } else {
            return ['L', 'R'][Math.floor(Math.random()) * 2];
          }
        }
      }
    }
  }
}

export function hunt(surroundings, forwardSurroundings = false, targetLocation = null) {
  const { front, back, left, right } = surroundings;

  // look for potential target at cost 1
  if (
    // both left and right have enemy within range of throw and front has enemy at distance 4
    hasEnemy(front) && front.distance < 4 &&
    hasEnemy(left) && left.distance < 4 &&
    hasEnemy(right) && right.distance < 4
  ) {
    const overallThreat = evaluateOverallThreat(front.obstacle.threatLevel, left.obstacle.threatLevel, right.obstacle.threatLevel);
    if (
      // at least 2 enemy are considered threats
      overallThreat > 1
    ) {
      return 'F';
    } else if (
      // only 1 enemy is considered a threat
      overallThreat === 1
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
    hasEnemy(left) && left.distance < 4 &&
    hasEnemy(right) && right.distance < 4
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
    hasEnemy(front) && front.distance === 4 &&
    hasEnemy(left) && left.distance < 4
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
    hasEnemy(front) && front.distance === 4 &&
    hasEnemy(right) && right.distance < 4
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
    hasEnemy(left) && left.distance < 4
  ) {
    return 'L';
  } else if (
    // right has enemy within range of throw
    hasEnemy(right) && right.distance < 4
  ) {
    return 'R';
  } else if (
    // front has enemy at distance 4
    hasEnemy(front) && front.distance === 4
  ) {
    return 'F';
  }

  // look for potential target at cost 2
  if (
    // back has enemy within range of throw and both left and right have enemy at distance 4
    hasEnemy(left) && left.distance === 4 &&
    hasEnemy(right) && right.distance === 4 &&
    hasEnemy(back) && back.distance < 4
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
    hasEnemy(left) && left.distance === 4 &&
    hasEnemy(right) && right.distance === 4
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
    hasEnemy(left) && left.distance === 4 &&
    hasEnemy(back) && back.distance < 4
  ) {
    return 'L';
  } else if (
    // back has enemy within range of throw and right has enemy at distance 4
    hasEnemy(right) && right.distance === 4 &&
    hasEnemy(back) && back.distance < 4
  ) {
    return 'R';
  } else if (
    // back has enemy within range of throw
    hasEnemy(back) && back.distance < 4
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
      if (targetLocation) {
        if (
          // target on the left
          targetLocation.transverse < 0
        ) {
          return 'L';
        } else if (
          // target on the right
          targetLocation.transverse > 0
        ) {
          return 'R';
        }
      } else {
        return ['L', 'R'][Math.floor(Math.random()) * 2];
      }
    }
  } else if (
    // left has enemy at distance 4
    hasEnemy(left) && left.distance === 4
  ) {
    return 'L';
  } else if (
    // right has enemy at distance 4
    hasEnemy(right) && right.distance === 4
  ) {
    return 'R';
  } else if (
    // front has enemy at distance 5
    hasEnemy(front) && front.distance === 5
  ) {
    return 'F';
  } else if (
    // check for forward surroundings if forward is available
    forwardSurroundings
  ) {
    if (
      // both left and right have enemy within range of throw when stepped forward
      hasEnemy(forwardSurroundings.left) && forwardSurroundings.left.distance < 4 &&
      hasEnemy(forwardSurroundings.right) && forwardSurroundings.right.distance < 4
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
      hasEnemy(forwardSurroundings.left) && forwardSurroundings.left.distance < 4 &&
      hasEnemy(forwardSurroundings.right) && forwardSurroundings.right.distance < 4
    ) {
      return 'F';
    }
  }

  // no potential target under cost 2
  if (
    // front has no wall within distance 2
    front.distance > 2
  ) {
    return 'F';
  } else {
    return ['L', 'R'][Math.floor(Math.random()) * 2];
  }
}

export function decideAction(wasHit, surroundings, forwardSurroundings = false, targetLocation = null) {
  // escape if under attack
  if (wasHit) return escape(surroundings, targetLocation);
  // throw if enemy within range of throw
  else if (checkEnemyInRange(surroundings.front)) return 'T';
  // hunt otherwise
  else return hunt(surroundings, forwardSurroundings, targetLocation);
}
