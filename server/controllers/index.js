import { scanArena, checkEnemyInRange, scanSurroundings } from '../services';

function get(req, res) {
  return res.send('Let the battle begin!');
}

function action(req, res) {
  const {
    _links: { self: { href } },
    arena: { dims, state }
  } = req.body;

  const arena = scanArena(dims, state);
  const ownState = state[href];
  const { front, back, left, right } = scanSurroundings(ownState, arena, dims);

  // check if under attack
  if (ownState.wasHit) {
    if (
      // left or right has enemy
      (
        (left.obstacle !== null && left.obstacle !== 'wall') ||
        (right.obstacle !== null && right.obstacle !== 'wall')
      ) &&
      // front has no obstacle within distance 2
      front.distance > 2
    ) {
      return res.send('F');
    } else if (
      // front or back has enemy
      (
        (front.obstacle !== null && front.obstacle !== 'wall') ||
        (back.obstacle !== null && back.obstacle !== 'wall')
      ) &&
      // left has no obstacle within distance 2
      left.distance > 2
    ) {
      return res.send('L');
    } else {
      return res.send('R');
    }
  // check if enemy within range of throw
  } else if (checkEnemyInRange(front)) {
    return res.send('T');
  // look for target
  } else {
    if (
      // left has enemy or right has wall
      (left.obstacle !== null && left.obstacle !== 'wall') ||
      right.obstacle === 'wall'
    ) {
      return res.send('L');
    } else if (
      // right has enemy or left has wall
      (right.obstacle !== null && right.obstacle !== 'wall') ||
      right.obstacle === 'wall'
    ) {
      return res.send('R');
    } else if (
      // front has no wall within distance 2
      front.distance > 2
    ) {
      return res.send('F');
    } else {
      return res.send(['L', 'R'][Math.floor(Math.random()) * 2]);
    }
  }
}

export default { get, action };
