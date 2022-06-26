import { scanArena, getForwardState, scanSurroundings, decideAction, greetPeers } from '../services';

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

  greetPeers(state, href, req.body, 100);

  return res.send(decideAction(ownState.wasHit, surroundings, forwardSurroundings));
}

export default { get, action };
