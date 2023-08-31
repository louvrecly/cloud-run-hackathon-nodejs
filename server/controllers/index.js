import * as fs from 'fs';
import { scanArena, parseState, locateTarget, getForwardState, scanSurroundings, decideAction } from '../services';

function get(req, res) {
  return res.send('Let the battle begin!');
}

function action(req, res) {
  const RECORDS_LIMIT = 4;
  let records = [];

  try {
    const recordsString = fs.readFileSync('data.json', { encoding: 'utf-8', flag: 'r' });
    // const records = JSON.parse(recordsString);
    records = JSON.parse(recordsString);

    const recordsCount = records.length;

    if (recordsCount > RECORDS_LIMIT) {
      records.splice(0, recordsCount - RECORDS_LIMIT);
    }

    console.log({ records });
  } catch(err) {
    console.log({ err });
  }

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

  const action = decideAction(ownState.wasHit, surroundings, forwardSurroundings, targetLocator);

  const record = { action, ownState, enemyState, surroundings, targetLocator };

  fs.writeFile(
    'data.json',
    JSON.stringify([...records, record]),
    err => {
      if (err) console.log({ err });
    }
  );

  return res.send(action);
}

export default { get, action };
