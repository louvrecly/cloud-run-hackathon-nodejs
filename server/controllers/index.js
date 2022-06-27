import { scanArena, checkEnemyInRange, getForwardState, scanSurroundings, escape, hunt } from '../services';

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
  const forwardState = surroundings.front.distance > 1 ? getForwardState(ownState, dims) : false;
  const forwardSurroundings = forwardState && scanSurroundings(forwardState, arena, dims);

  // escape if under attack
  if (ownState.wasHit) return res.send(escape(surroundings));
  // throw if enemy within range of throw
  else if (checkEnemyInRange(surroundings.front)) return res.send('T');
  // hunt otherwise
  else return res.send(hunt(surroundings, forwardSurroundings));
}

export default { get, action };
