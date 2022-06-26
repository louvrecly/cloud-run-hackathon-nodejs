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

export function scanSurroundings(ownState, arena, dims) {
  const surroundings = {
    front: { obstacle: null, distance: 4 },
    back: { obstacle: null, distance: 4 },
    left: { obstacle: null, distance: 4 },
    right: { obstacle: null, distance: 4 }
  };
  const relativeDirections = Object.keys(surroundings);
  const { direction } = ownState;

  function findObstacle(direction) {
    return relativeDirection => {
      const multiplier = getMultiplier(direction, relativeDirection);
      const { dim, index } = getDimAndIndex(direction, relativeDirection);

      for (let i = 1; i < 4; i++) {
        if (!checkIndexInRange(ownState[dim] + i * multiplier, dims[index])) {
          surroundings[relativeDirection].obstacle = 'wall';
          surroundings[relativeDirection].distance = i;
          break;
        }

        const yIndex = dim === 'y' ? ownState.y + i * multiplier : ownState.y;
        const xIndex = dim === 'x' ? ownState.x + i * multiplier : ownState.x;

        if (arena[yIndex][xIndex]) {
          surroundings[relativeDirection].obstacle = arena[yIndex][xIndex];
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
