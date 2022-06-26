'use strict';

import supertest from 'supertest';
import assert from 'assert';
import app from '../web';

let request;

describe('Unit Tests on requests at /', () => {
  before(async () => {
    request = supertest(app);
  });

  it('should respond OK to GET /', async () => {
    await request.get('/').expect(200);
  });

  it('should respond an action (F, L, R or T) to POST /', async () => {
    const payload = {
      _links: { self: { href: 'BASE_URL' } },
      arena: {
        dims: [4, 3],
        state: {
          BASE_URL: {
            x: 0,
            y: 0,
            direction: 'E',
            wasHit: false,
            score: 0
          },
          ENEMY_BOT_URL: {
            x: 3,
            y: 0,
            direction: 'N',
            wasHit: false,
            score: 0
          }
        }
      }
    };

    await request.post('/')
      .send(payload)
      .set('Content-Type', 'application/json')
      .expect(200)
      .then(res => assert.ok(['F', 'L', 'R', 'T'].includes(res.text), 'an action of F, L, R or T should be responded to POST /'));
  });

  it('should respond F when being hit by enemy from the left and forward is available', async () => {
    const payload = {
      _links: { self: { href: 'BASE_URL' } },
      arena: {
        dims: [4, 3],
        state: {
          BASE_URL: {
            x: 0,
            y: 0,
            direction: 'S',
            wasHit: true,
            score: 0
          },
          ENEMY_BOT_URL: {
            x: 3,
            y: 0,
            direction: 'W',
            wasHit: false,
            score: 0
          }
        }
      }
    };

    await request.post('/')
      .send(payload)
      .set('Content-Type', 'application/json')
      .expect(200)
      .then(res => assert.equal(res.text, 'F', 'F should be responded when being hit from the left and forward is available'));
  });

  it('should respond F when being hit by enemy from the right and forward is available', async () => {
    const payload = {
      _links: { self: { href: 'BASE_URL' } },
      arena: {
        dims: [4, 3],
        state: {
          BASE_URL: {
            x: 3,
            y: 2,
            direction: 'W',
            wasHit: true,
            score: 0
          },
          ENEMY_BOT_URL: {
            x: 3,
            y: 0,
            direction: 'S',
            wasHit: false,
            score: 0
          }
        }
      }
    };

    await request.post('/')
      .send(payload)
      .set('Content-Type', 'application/json')
      .expect(200)
      .then(res => assert.equal(res.text, 'F', 'F should be responded when being hit from the right and forward is available'));
  });

  it('should respond L when being hit by enemy from the front and left is available', async () => {
    const payload = {
      _links: { self: { href: 'BASE_URL' } },
      arena: {
        dims: [4, 3],
        state: {
          BASE_URL: {
            x: 3,
            y: 2,
            direction: 'N',
            wasHit: true,
            score: 0
          },
          ENEMY_BOT_URL: {
            x: 3,
            y: 0,
            direction: 'S',
            wasHit: false,
            score: 0
          }
        }
      }
    };

    await request.post('/')
      .send(payload)
      .set('Content-Type', 'application/json')
      .expect(200)
      .then(res => assert.equal(res.text, 'L', 'L should be responded when being hit from the front and left is available'));
  });

  it('should respond R when being hit by enemy from the front and right is available', async () => {
    const payload = {
      _links: { self: { href: 'BASE_URL' } },
      arena: {
        dims: [4, 3],
        state: {
          BASE_URL: {
            x: 0,
            y: 0,
            direction: 'E',
            wasHit: true,
            score: 0
          },
          ENEMY_BOT_URL: {
            x: 3,
            y: 0,
            direction: 'W',
            wasHit: false,
            score: 0
          }
        }
      }
    };

    await request.post('/')
      .send(payload)
      .set('Content-Type', 'application/json')
      .expect(200)
      .then(res => assert.equal(res.text, 'R', 'R should be responded when being hit from the front and right is available'));
  });

  it('should respond L when being hit by enemy from the back and left is available', async () => {
    const payload = {
      _links: { self: { href: 'BASE_URL' } },
      arena: {
        dims: [4, 3],
        state: {
          BASE_URL: {
            x: 0,
            y: 0,
            direction: 'W',
            wasHit: true,
            score: 0
          },
          ENEMY_BOT_URL: {
            x: 3,
            y: 0,
            direction: 'W',
            wasHit: false,
            score: 0
          }
        }
      }
    };

    await request.post('/')
      .send(payload)
      .set('Content-Type', 'application/json')
      .expect(200)
      .then(res => assert.equal(res.text, 'L', 'L should be responded when being hit from the back and left is available'));
  });

  it('should respond R when being hit by enemy from the back and right is available', async () => {
    const payload = {
      _links: { self: { href: 'BASE_URL' } },
      arena: {
        dims: [4, 3],
        state: {
          BASE_URL: {
            x: 3,
            y: 2,
            direction: 'S',
            wasHit: true,
            score: 0
          },
          ENEMY_BOT_URL: {
            x: 3,
            y: 0,
            direction: 'S',
            wasHit: false,
            score: 0
          }
        }
      }
    };

    await request.post('/')
      .send(payload)
      .set('Content-Type', 'application/json')
      .expect(200)
      .then(res => assert.equal(res.text, 'R', 'R should be responded when being hit from the back and right is available'));
  });

  it('should respond T when enemy is in range of throw', async () => {
    const payloads = [
      {
        _links: { self: { href: 'BASE_URL' } },
        arena: {
          dims: [4, 3],
          state: {
            BASE_URL: {
              x: 0,
              y: 0,
              direction: 'E',
              wasHit: false,
              score: 0
            },
            ENEMY_BOT_URL: {
              x: 3,
              y: 0,
              direction: 'S',
              wasHit: false,
              score: 0
            }
          }
        }
      },
      {
        _links: { self: { href: 'BASE_URL' } },
        arena: {
          dims: [4, 3],
          state: {
            BASE_URL: {
              x: 0,
              y: 0,
              direction: 'S',
              wasHit: false,
              score: 0
            },
            ENEMY_BOT_URL: {
              x: 0,
              y: 2,
              direction: 'E',
              wasHit: false,
              score: 0
            }
          }
        }
      },
      {
        _links: { self: { href: 'BASE_URL' } },
        arena: {
          dims: [4, 3],
          state: {
            BASE_URL: {
              x: 3,
              y: 2,
              direction: 'N',
              wasHit: false,
              score: 0
            },
            ENEMY_BOT_URL: {
              x: 3,
              y: 0,
              direction: 'E',
              wasHit: false,
              score: 0
            }
          }
        }
      },
      {
        _links: { self: { href: 'BASE_URL' } },
        arena: {
          dims: [4, 3],
          state: {
            BASE_URL: {
              x: 3,
              y: 2,
              direction: 'W',
              wasHit: false,
              score: 0
            },
            ENEMY_BOT_URL: {
              x: 0,
              y: 2,
              direction: 'E',
              wasHit: false,
              score: 0
            }
          }
        }
      }
    ];

    await Promise.all(
      payloads.map(
        payload => request.post('/')
          .send(payload)
          .set('Content-Type', 'application/json')
          .expect(200)
          .then(res => assert.equal(res.text, 'T', 'T should be responded when enemy is in range of throw'))
      )
    );
  });
});
