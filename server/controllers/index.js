import { parseState, checkEnemyInRange } from "../services";

function get(req, res) {
  return res.send('Let the battle begin!');
}

function action(req, res) {
  const {
    _links: { self: { href } },
    arena: { state }
  } = req.body;

  const { ownState, enemyStates } = parseState(state, href);

  if (ownState.wasHit) {
    return res.send(['F', 'L', 'R'][Math.floor(Math.random() * 3)]);
  } else if (checkEnemyInRange(ownState, enemyStates)) {
    return res.send('T');
  } else {
    return res.send(['L', 'R'][Math.floor(Math.random()) * 2]);
  }
}

export default { get, action };
