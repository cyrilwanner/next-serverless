// This example is exactly the same as the one in the readme of next.js (https://github.com/zeit/next.js#custom-server-and-routing)
// but updated to work with next-serverless.

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const nextServerless = require('next-serverless/handler')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const requestHandler = (req, res) => {
  // Be sure to pass `true` as the second argument to `url.parse`.
  // This tells it to parse the query portion of the URL.
  const parsedUrl = parse(req.url, true)
  const { pathname, query } = parsedUrl

  if (pathname === '/a') {
    app.render(req, res, '/b', query)
  } else if (pathname === '/b') {
    app.render(req, res, '/a', query)
  } else {
    handle(req, res, parsedUrl)
  }
};

module.exports.handler = nextServerless(app, requestHandler, () => {
  // create a normal http node server for local usage
  createServer(requestHandler).listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  });
});
