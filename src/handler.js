import serverless from 'serverless-http';
import { isLambda, hasPathPrefix } from './util';

let requestHandler;

/**
 * Handle incoming requests in the lambda function
 *
 * @param {object} app - Next.js app instance
 * @param {function} handler - Request handler
 */
export const lambdaRequestHandler = (app, handler) => {
  const serverlessHandler = serverless(handler);

  return (event, context, ...params) => {
    // set asset prefix based on current host and stage
    const hasPrefix = event && event.headers && event.headers.Host
      ? hasPathPrefix(event.headers.Host) : false;

    if (hasPrefix) {
      app.setAssetPrefix('/prod'); // todo: get this dynamically
    } else {
      app.setAssetPrefix('');
    }

    return serverlessHandler(event, context, ...params);
  };
};

/**
 * Next serverless request handler
 *
 * @param {object} app - Next.js app object
 * @param {function} handler - Request handler function
 * @param {function} runLocal - Function to run when the server is started locally
 * @return {function} A lambda request handler
 */
export default (app, handler, runLocal) => {
  // start local server when not in a lambda environment
  if (!isLambda()) {
    return app.prepare().then(runLocal);
  }

  // handle api gateway requests in a lambda environment
  return (...gatewayParams) => {
    if (requestHandler) {
      return requestHandler(...gatewayParams);
    }

    // on first start, initially prepare the next.js app before handling requests
    app.prepare().then(() => {
      requestHandler = lambdaRequestHandler(app, handler);
      requestHandler(...gatewayParams);
    });
  };
};
