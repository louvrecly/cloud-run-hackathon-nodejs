export function parseState(state, ownKey) {
  const ownState = state[ownKey];
  delete state[ownKey];

  return { ownState, enemyStates: state };
}

export function checkEnemyInRange(ownState, enemyStates) {
  let checkDimensionOrder = null;
  let enemyState = null;

  switch (ownState.direction) {
    case 'N':
    case 'S':
      checkDimensionOrder = ['x', 'y'];
      break;
    case 'E':
    case 'W':
      checkDimensionOrder = ['y', 'x'];
      break;
    default:
      throw Error(`Invalid direction ${ownState.direction}`);
  }

  for (let key in enemyStates) {
    enemyState = enemyStates[key];

    if (
      ownState[checkDimensionOrder[0]] === enemyState[checkDimensionOrder[0]] &&
      Math.abs(ownState[checkDimensionOrder[1]] - enemyState[checkDimensionOrder[1]]) <= 3
    ) return true;
  }

  return false;
}
