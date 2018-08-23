# :cloud: next-serverless [![npm version](https://badgen.net/npm/v/next-serverless)](https://www.npmjs.com/package/next-serverless) [![license](https://badgen.net/npm/license/next-serverless)](https://github.com/cyrilwanner/next-serverless/blob/master/LICENSE)

> It has never been easier to deploy a [next.js](https://github.com/zeit/next.js) application to AWS Lambda!

`next-serverless` handles everything for you and deploys your [next.js](https://github.com/zeit/next.js) application to AWS Lambda with minimal or even no configuration using the [serverless](https://serverless.com/framework/) framework.

## Table of contents

- [Installation](#installation)
  - [Using ApiGateway hostnames](#using-apigateway-hostnames)
    - [Serverless links](#serverless-links)
    - [Asset prefixes](#asset-prefixes)
  - [Using a custom server](#using-a-custom-server)
    - [Examples](#examples)
    - [Updating `serverless.yml`](#updating-serverlessyml)
- [Serverless commands](#serverless-commands)
- [License](#license)

## Installation

```
npm install --save next-serverless
```

During install, a default `serverless.yml` gets created if you don't already have one (if not, copy it from [here](https://github.com/cyrilwanner/next-serverless/blob/master/default-serverless.yml)).
You might want to update it to your needs.

If you are not using a custom server, replace the `next` binaries in your `package.json` with `next-serverless`:

```diff
{
  "scripts": {
-    "dev": "next",
-    "build": "next build",
-    "start": "next start"
+    "dev": "next-serverless",
+    "build": "next-serverless build",
+    "start": "next-serverless start"
  }
}
```

Or if you are using a custom server, please read [using a custom server](#using-a-custom-server) below.

You are now already good to go and your application is ready for the first deployment ([serverless commands](#serverless-commands)) to AWS Lambda.
However, if you are using a randomly generated ApiGateway hostname (e.g. `nnptap4nw2.execute-api.eu-west-1.amazonaws.com/prod`) and you are not using a custom (sub-) domain, please read [using ApiGateway hostnames](#using-apigateway-hostnames) as some small changes are necessary.

### Using ApiGateway hostnames

In this section, we cover a few required changes if you want to use the randomly generated ApiGateway hostnames (e.g. `nnptap4nw2.execute-api.eu-west-1.amazonaws.com/prod`).

If you are always using a dedicated (sub-) domain (e.g. `myproduct.com` or `my.product.com`), you don't have to perform these changes.
Please note that it is not possible to have a mix: a custom (sub-) domain and a stage prefix (`/prod`) which you have with ApiGateway hostnames.
This is a limitation by next.js as it, unfortunately, doesn't support path prefixes.

#### Serverless links

If you are using the randomly generated ApiGateway hostnames, you may have noticed that they have the stage as a path prefix (e.g. `nnptap4nw2.execute-api.eu-west-1.amazonaws.com/prod`).

`next-serverless` provides a link component which automatically detects those links and automatically adds the stage prefix if required.

This link component has exactly the same signature as the default next.js link component, so you can simply change the imports:

```diff
-import Link from 'next/link';
+import Link from 'next-serverless/link';

export default () => (
  <Link href="/about">
    <a>I will automatically have the stage prefix if needed</a>
  </Link>
);
```

#### Asset prefixes

When you are including assets in your app (e.g. `/_next/static/style.css` for CSS or an image `/_next/static/my-image.png`), you would also get a 404 because it doesn't include the stage prefix.

`next-serverless` provides a few helper functions which you can use in these cases:

##### `prefixPath(path: string): string`

You can pass in any path you want which then gets prefixes if needed. It automatically takes care of full URLs (`https://example.com/styles.css`) and doesn't prefix these.

##### `getPathPrefix(): string`

It returns either the path prefix (`'/prod'`) or an empty string (`''`) if none is needed for the current request.

If you are using this function instead of `prefixPath`, you have to take care of full URLs by yourself.

##### Examples

```js
// ./pages/_document.js
import Document, { Head, Main, NextScript } from 'next/document';
import { prefixPath, getPathPrefix } from 'next-serverless';

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>

          <link rel="stylesheet" href={prefixPath('/_next/static/style.css')} />
          {/* or */}
          <link rel="stylesheet" href={getPathPrefix() + '/_next/static/style.css'} />

        </Head>
        <body>

          <img src={prefixPath(require('./my-image.png'))} />
          {/* or */}
          <img src={getPathPrefix() + require('./my-image.png')} />

          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
```

If you end up using these helper functions a lot, you may want to create a wrapper component.
For example, create a new `Image` component which automatically prefixes the `src` attribute.

### Using a custom server

There are a few changes needed to perform if you are using a [custom server](https://github.com/zeit/next.js#custom-server-and-routing).

First of all, your server file needs to export a handler function which AWS Lambda will then call.
`next-serverless/handler` provides you a wrapper function for that so you don't have to handle much on your own.

Please note that you should **not** call `app.prepare()` by yourself anymore, `next-serverless` will automatically do it at the right time.
You can just use the callback or handler functions provided.

#### `nextServerless(app: Server, handler: (req, res) => void, runLocal: () => void)`

Parameters:

##### `app: Server`

This needs to be an instance of the next.js server/app which you create with `next({ /* options */ })`.

##### `handler: (req, res) => void`

The `handler` function you provide here will be called for every request.
You can just pass in the default next.js request handler or use your own function here to fully customize the requests and responses.

You can use the normal `req` and `res` objects of an HTTP Node or express server, we automatically map the Lambda event object to them.

##### `runLocal: () => void`

When you run the app locally and not in AWS Lambda, you still want to start your own development server.
You should do that within this callback function.
`app.prepare()` already got called before this function gets executed so you don't have to do this again.

#### Examples

```js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const nextServerless = require('next-serverless/handler');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const requestHandler = (req, res) => {
  const parsedUrl = parse(req.url, true);
  const { pathname } = parsedUrl;

  // implement a custom behavior for /hello
  if (pathname === '/hello') {
    res.end('hello world');

  // let next.js handle all other requests
  } else {
    handle(req, res, parsedUrl)
  }
};

// export the nextServerless function
module.exports.handler = nextServerless(app, requestHandler, () => {
  // create a normal http node server for local usage
  createServer(requestHandler).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
```

There are also a few more examples (custom routing, using `next-routes` or `express`) in the [examples](https://github.com/cyrilwanner/next-serverless/tree/master/examples/custom-servers) directory.

If you need assistance to get your custom server running, please feel free to create an issue.
More examples are also welcome with a PR.

#### Updating `serverless.yml`

The last step you have to do when using a custom server is updating your `serverless.yml` file.

In `functions.app.handler`, we specify the file and exported function which AWS Lambda should execute for every request.
By default, we use the provided server by `next-serverless` but since you are using a custom server, you also want to change that.

Simply change this value to the location and exported function of your custom server using the standard Lambda syntax.

For example, if you have a `server.js` in your root folder, simply use `server.handler`.

## Serverless commands

`next-serverless` is fully compatible with the [serverless](https://serverless.com/framework/) framework so you can use the same commands here.

You can either install `serverless` locally, globally (`npm install --global serverless`) or use `npx` which comes with npm 5.2+ and higher.

A few example commands:

```bash
# build the application before deploying it
$ npm run build

# deploy to the default stage
$ npx serverless deploy

# deploy to a specific stage
$ npx serverless deploy --stage prod

# get the server logs
$ npx logs --stage prod -f app

# watch the server logs
$ npx logs --stage prod -f app -t
```

## License

[MIT](https://github.com/cyrilwanner/next-serverless/blob/master/LICENSE) © Cyril Wanner
