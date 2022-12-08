import { scanArena, parseState, locateTarget, getForwardState, scanSurroundings, decideAction } from '../services';

function get(req, res) {
  return res.send('Let the battle begin!');
}

function action(req, res) {
  const {
    _links: { self: { href } },
    arena: { dims, state }
  } = req.body;

  const arena = scanArena(dims, state);
  const parsedState = parseState(state, href);
  const { ownState, enemyState } = parsedState;
  const surroundings = scanSurroundings(ownState, arena, dims);
  const targetLocator = locateTarget({ ownState, enemyState });
  const forwardState = surroundings.front.distance > 1 ? getForwardState(ownState, dims) : null;
  const forwardSurroundings = forwardState && scanSurroundings(forwardState, arena, dims);

  return res.send(decideAction(ownState.wasHit, surroundings, forwardSurroundings, targetLocator));
}

export default { get, action };
