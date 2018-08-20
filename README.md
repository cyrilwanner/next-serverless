# :cloud: next-serverless

Deploys your [next.js](https://github.com/zeit/next.js) application to AWS Lambda with minimal or even no configuration using the [serverless](https://serverless.com/) framework.

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

During install, a default `serverless.yml` get created if you don't already have one. You might want to update it to your needs.

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

Or if you are using a custom server, read [Using a custom server](#using-a-custom-server) below.

You are now already good to go and your application is ready for the first deployment ([serverless commands](#serverless-commands)) to AWS Lambda.
However, if you are using a randomly generated ApiGateway hostname and you are not using a custom (sub-) domain, a small change to your links is required to ensure they are still working (see [serverless-links](#serverless-links)).

### Using a custom server

> todo

## Serverless links

If you are using the randomly generated ApiGateway hostnames, you may have noticed that they have the stage as a path prefix (e.g. `d-6a4anys982.execute-api.eu-west-1.amazonaws.com/prod`).

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

`next-serverless` is fully compatible with the [serverless](https://serverless.com/) framework so you can use the same commands here.

You can either install `serverless` globally (`npm install --global serverless`) or use `npx` (it comes with npm 5.2+ and higher).

A few example commands:

```bash
# deploy to the default stage
$ npx serverless deploy

# deploy to a specific stage
$ npx serverless deploy --stage prod

# get the server logs
$ npx logs --stage prod --app app
```

## Ideas and todos

Ideas/Todos:

* make sure to pass -p & -H args to custom server
* only set assetPrefix when the user didn't set it
* automatically add request prefix (e.g. /prod/_next instead of /_next)
* provide link component which overrides `as` with the request prefix (e.g. /prod/about instead of /about)
* make router overwritable (e.g. for next-routes)
* deploy static assets to s3

## License

[MIT](https://github.com/cyrilwanner/next-serverless/blob/master/LICENSE) © Cyril Wanner
