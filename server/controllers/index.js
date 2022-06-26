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
    return res.send(['F', 'L', 'R'][Math.floor(Math.random() * 3)]);
  } else if (checkEnemyInRange(surroundings)) {
    return res.send('T');
  } else {
    return res.send(['L', 'R'][Math.floor(Math.random()) * 2]);
  }
}

export default { get, action };
