export function scanArena(dims, state) {
  const arena = [...Array(dims[1])].map(row => Array(dims[0]).fill(null));

  for (let key in state) {
    const { x, y } = state[key];
    arena[y][x] = {
      [key]: key,
      ...state[key]
    };
  }

  return arena;
}

export function checkEnemyInRange(ownState, arena, dims) {
  const { x, y, direction } = ownState;
  let dir = ['E', 'S'].includes(direction) ? 1 : -1;

  function checkIndexInRange(index, dimIndex) {
    return index >= 0 && index < dims[dimIndex];
  }

  switch (direction) {
    case 'E':
    case 'W':
      for (let i = 1; i < 4 && checkIndexInRange(x + i * dir, 0); i++) {
        if (arena[y][x + i * dir]) return true;
      }
      break;
    case 'S':
    case 'N':
      for (let i = 1; i < 4 && checkIndexInRange(y + i * dir, 1); i++) {
        if (arena[y + i * dir][x]) return true;
      }
      break;
    default:
      throw Error(`Invalid direction ${ownState.direction}`);
  }

  return false;
}
