import { scanArena, checkEnemyInRange, scanSurroundings } from "../services";

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
  const surroundings = scanSurroundings(ownState, arena, dims);

  if (ownState.wasHit) {
    if (
      // left or right has enemy
      (
        (surroundings.left.obstacle !== null && surroundings.left.obstacle !== 'wall') ||
        (surroundings.right.obstacle !== null && surroundings.right.obstacle !== 'wall')
      ) &&
      // front has no obstacle within distance 2
      surroundings.front.distance > 2
    ) {
      return res.send('F');
    } else if (
      // front or back has enemy
      (
        (surroundings.front.obstacle !== null && surroundings.front.obstacle !== 'wall') ||
        (surroundings.back.obstacle !== null && surroundings.back.obstacle !== 'wall')
      ) &&
      // left has no obstacle within distance 2
      surroundings.left.distance > 2
    ) {
      return res.send('L')
    } else {
      return res.send('R')
    }
  } else if (checkEnemyInRange(surroundings)) {
    return res.send('T');
  } else {
    return res.send(['L', 'R'][Math.floor(Math.random()) * 2]);
  }
}

export default { get, action };
