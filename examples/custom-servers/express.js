// This example shows how to use express instead of a normal http node server.

const { parse } = require('url')
const express = require('express')
const next = require('next')
const nextServerless = require('next-serverless/handler')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const requestHandler = (req, res) => {
  const parsedUrl = parse(req.url, true)
  const { pathname } = parsedUrl

  // implement a custom behavior for /hello
  if (pathname === '/hello') {
    res.end('hello world')

    // let next.js handle all other requests
  } else {
    handle(req, res, parsedUrl)
  }
};

module.exports.handler = nextServerless(app, requestHandler, () => {
  // create an express server for local usage
  express().use(requestHandler).listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  });
});
