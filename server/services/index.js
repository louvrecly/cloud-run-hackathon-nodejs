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

export function scanSurroundings(ownState, arena, dims) {
  const { direction } = ownState;

  const dimAxis = {
    longitudinal: ['E', 'W'].includes(direction) ? 'x' : 'y',
    transverse: ['E', 'W'].includes(direction) ? 'y' : 'x'
  };
  const dimAxisIndex = {
    longitudinal: dimAxis.longitudinal === 'x' ? 0 : 1,
    transverse: dimAxis.transverse === 'x' ? 0 : 1
  };

  const surroundings = {
    front: { obstacle: null, distance: 4 },
    back: { obstacle: null, distance: 4 },
    left: { obstacle: null, distance: 4 },
    right: { obstacle: null, distance: 4 }
  };

  function getMultiplier(direction, surroundingKey) {
    switch (surroundingKey) {
      case 'front':
        return ['E', 'S'].includes(direction) ? 1 : -1;
      case 'back':
        return ['E', 'S'].includes(direction) ? -1 : 1;
      case 'left':
        return ['W', 'S'].includes(direction) ? 1 : -1;
      case 'right':
        return ['W', 'S'].includes(direction) ? -1 : 1;
      default:
        throw Error(`Invalid surroundingKey - ${surroundingKey}`);
    }
  }

  function findObstacle(direction) {
    return ({ surroundingKey, orientation }) => {
      const multiplier = getMultiplier(direction, surroundingKey);

      for (let i = 1; i < 4; i++) {
        if (!checkIndexInRange(ownState[dimAxis[orientation]] + i * multiplier, dims[dimAxisIndex[orientation]])) {
          surroundings[surroundingKey].obstacle = 'wall';
          surroundings[surroundingKey].distance = i;
          break;
        }

        const yIndex = dimAxis[orientation] === 'y' ? ownState.y + i * multiplier : ownState.y;
        const xIndex = dimAxis[orientation] === 'x' ? ownState.x + i * multiplier : ownState.x;

        if (arena[yIndex][xIndex]) {
          surroundings[surroundingKey].obstacle = arena[yIndex][xIndex];
          surroundings[surroundingKey].distance = i;
          break;
        }
      }
    };
  }

  [
    { surroundingKey: 'front', orientation: 'longitudinal' },
    { surroundingKey: 'back', orientation: 'longitudinal' },
    { surroundingKey: 'left', orientation: 'transverse' },
    { surroundingKey: 'right', orientation: 'transverse' }
  ].forEach(findObstacle(direction));

  return surroundings;
}

export function checkEnemyInRange(surroundings) {
  return typeof surroundings.front.obstacle === 'object' && surroundings.front.obstacle !== null && surroundings.front.distance < 4;
}
