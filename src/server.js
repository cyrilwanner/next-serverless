import { createServer } from 'http';
import next from 'next';
import nextServerless from './handler';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handler = app.getRequestHandler();

module.exports.handler = nextServerless(app, handler, () => {
  // create a normal http node server for local usage
  const port = process.env.PORT || 3000;
  createServer(handler).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`); // eslint-disable-line no-console
  });
});
