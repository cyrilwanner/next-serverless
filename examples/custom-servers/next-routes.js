// This example shows how to use next-serverless together with next-routes.
const { createServer } = require('http')
const next = require('next')
const nextServerless = require('next-serverless/handler')
const routes = require('./routes')

const app = next({ dev: process.env.NODE_ENV !== 'production' })
const handler = routes.getRequestHandler(app)

module.exports.handler = nextServerless(app, handler, () => {
  // create a normal http node server for local usage
  createServer(handler).listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  });
});
