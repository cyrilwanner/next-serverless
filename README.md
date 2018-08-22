# :cloud: next-serverless

Deploys your [next.js](https://github.com/zeit/next.js) application to AWS Lambda with minimal or even no configuration using the [serverless](https://serverless.com/framework/) framework.

## Table of contents

- [Installation](#installation)
  - [Using a custom server](#using-a-custom-server)
- [Serverless links](#serverless-links)
- [Serverless commands](#serverless-commands)
- [License](#license)

## Installation

```
npm install --save next-serverless
```

During install, a default `serverless.yml` get created if you don't already have one (if not, copy it from [here](https://github.com/cyrilwanner/next-serverless/blob/master/default-serverless.yml)).
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

Or if you are using a custom server, read [using a custom server](#using-a-custom-server) below.

You are now already good to go and your application is ready for the first deployment ([serverless commands](#serverless-commands)) to AWS Lambda.
However, if you are using a randomly generated ApiGateway hostname and you are not using a custom (sub-) domain, a small change to your links is required to ensure they are still working (see [serverless-links](#serverless-links)).

### Using a custom server

> todo

## Serverless links

If you are using the randomly generated ApiGateway hostnames, you may have noticed that they have the stage as a path prefix (e.g. `nnptap4nw2.execute-api.eu-west-1.amazonaws.com/prod`).

`next-serverless` provides a link component which automatically detects those links and automatically adds the stage prefix.

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
```

## License

[MIT](https://github.com/cyrilwanner/next-serverless/blob/master/LICENSE) © Cyril Wanner
