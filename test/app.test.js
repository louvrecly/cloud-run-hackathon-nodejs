import { describe, beforeAll, test, expect } from 'vitest';
import supertest from 'supertest';
import app from '../web';

let request;

describe('Unit Tests on requests at /', () => {
  beforeAll(async () => {
    request = supertest(app);
  });

  test('should respond OK to GET /', async () => {
    await request.get('/').expect(200);
  });

  test('should respond an action (F, L, R or T) to POST /', async () => {
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
      .then(res => expect(['F', 'L', 'R', 'T']).toContain(res.text));
  });

  test('should respond F when being hit by enemy from the left and forward is available', async () => {
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
      .then(res => expect(res.text).toBe('F'));
  });

  test('should respond F when being hit by enemy from the right and forward is available', async () => {
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
      .then(res => expect(res.text).toBe('F'));
  });

  test('should respond L when being hit by enemy from the front and left is available', async () => {
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
      .then(res => expect(res.text).toBe('L'));
  });

  test('should respond R when being hit by enemy from the front and right is available', async () => {
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
      .then(res => expect(res.text).toBe('R'));
  });

  test('should respond L when being hit by enemy from the back and left is available', async () => {
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
      .then(res => expect(res.text).toBe('L'));
  });

  test('should respond R when being hit by enemy from the back and right is available', async () => {
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
      .then(res => expect(res.text).toBe('R'));
  });

  test('should respond T when enemy is in range of throw', async () => {
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
          .then(res => expect(res.text).toBe('T'))
      )
    );
  });
});
