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

export function escape(surroundings) {
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
        front.obstacle !== 'wall'
      ) {
        return 'T';
      } else if (
        // left has an enemy
        left.obstacle !== 'wall'
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
        // left has an enemy
        left.obstacle !== 'wall'
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
    }  else if (
      // right has space for escape while left has none
      right.distance > 1 &&
      left.distance === 1
    ) {
      return 'R';
    }else if (
      // left has no space for escape
      left.distance === 1
    ) {
      return 'R';
    } else if (
      // both left and right have space for escape
      left.distance > 1 &&
      right.distance > 1
    ) {
      if (
        // left has an enemy
        left.obstacle !== 'wall'
      ) {
        return 'L';
      } else if (
        // right has an enemy
        right.obstacle !== 'wall'
      ) {
        return 'R';
      } else {
        // no enemy on either left or right
        if (
          // left has a wall within distance 2
          left.distance < 3 && left.obstacle === 'wall'
        ) {
          return 'R';
        } else if (
          // right has a wall within distance 2
          right.distance < 3 && right.obstacle === 'wall'
        ) {
          return 'L';
        } else {
          return ['L', 'R'][Math.floor(Math.random()) * 2];
        }
      }
    }
  } else if (
    // front has enemy
    front.distance < 4 && front.obstacle !== 'wall'
  ) {
    if (
      // left or right has enemy
      (left.distance < 4 && left.obstacle !== 'wall') ||
      (right.distance < 4 && right.obstacle !== 'wall')
    ) {
      return 'F';
    } else {
      // turn regardless of whether back has enemy or not
      if (
        // left has a wall within distance 2
        left.distance < 3 && left.obstacle === 'wall'
      ) {
        return 'R';
      } else if (
        // right has a wall within distance 2
        right.distance < 3 && right.obstacle === 'wall'
      ) {
        return 'L';
      } else {
        return ['L', 'R'][Math.floor(Math.random()) * 2];
      }
    }
  } else {
    // front has no enemy or wall within distance 1
    if (
      // left or right has enemy
      (left.distance < 4 && left.obstacle !== 'wall') ||
      (right.distance < 4 && right.obstacle !== 'wall')
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
          left.distance < 3 && left.obstacle === 'wall'
        ) {
          return 'R';
        } else if (
          // right has a wall within distance 2
          right.distance < 3 && right.obstacle === 'wall'
        ) {
          return 'L';
        } else {
          // no wall on both left and right within distance 2
          return ['L', 'R'][Math.floor(Math.random()) * 2];
        }
      }
    }
  }
}

export function hunt(surroundings, forwardSurroundings = false) {
  const { front, back, left, right } = surroundings;

  // look for potential target at cost 1
  if (
    // left has enemy within range of throw
    left.distance < 4 && left.obstacle !== 'wall'
  ) {
    return 'L';
  } else if (
    // right has enemy within range of throw
    right.distance < 4 && right.obstacle !== 'wall'
  ) {
    return 'R';
  } else if (
    // front has enemy at distance 4
    front.distance === 4 && front.obstacle !== 'wall'
  ) {
    return 'F';
  }

  // look for potential target at cost 2
  if (
    // back has enemy within range of throw
    back.distance < 4 && back.obstacle !== 'wall'
  ) {
    if (
      // left has a wall within distance 2
      left.distance < 3 && left.obstacle === 'wall'
    ) {
      return 'R';
    } else if (
      // right has a wall within distance 2
      right.distance < 3 && right.obstacle === 'wall'
    ) {
      return 'L';
    } else {
      // no wall on both left and right within distance 2
      return ['L', 'R'][Math.floor(Math.random()) * 2];
    }
  } else if (
    // left has enemy at distance 4
    left.distance === 4 && left.obstacle !== 'wall'
  ) {
    return 'L';
  } else if (
    // right has enemy at distance 4
    right.distance === 4 && right.obstacle !== 'wall'
  ) {
    return 'R';
  } else if (
    // front has enemy at distance 5
    front.distance === 5 && front.obstacle !== 'wall'
  ) {
    return 'F';
  } else if (
    // check for forward surroundings if forward is available
    forwardSurroundings
  ) {
    if (
      // left has enemy within range of throw when stepped forward
      forwardSurroundings.left.distance < 4 &&
      forwardSurroundings.left.obstacle !== 'wall'
    ) {
      return 'F';
    } else if (
      // right has enemy within range of throw when stepped forward
      forwardSurroundings.right.distance < 4 &&
      forwardSurroundings.right.obstacle !== 'wall'
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

export function decideAction(wasHit, surroundings, forwardSurroundings = false) {
  // escape if under attack
  if (wasHit) return escape(surroundings);
  // throw if enemy within range of throw
  else if (checkEnemyInRange(surroundings.front)) return 'T';
  // hunt otherwise
  else return hunt(surroundings, forwardSurroundings);
}
