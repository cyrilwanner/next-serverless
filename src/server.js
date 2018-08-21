import { createServer } from 'http';
import next from 'next';
import parseArgs from 'minimist';
import nextServerless from './handler';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handler = app.getRequestHandler();
const argv = parseArgs(process.argv.slice(2), {
  alias: {
    h: 'help',
    H: 'hostname',
    p: 'port',
  },
  boolean: ['h'],
  string: ['H'],
  default: { p: process.env.PORT || 3000 },
});

module.exports.handler = nextServerless(app, handler, () => {
  // create a normal http node server for local usage
  createServer(handler).listen(argv.port, argv.hostname, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${argv.hostname || 'localhost'}:${argv.port}`);
  });
});
