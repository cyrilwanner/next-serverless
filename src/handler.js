import serverless from 'serverless-http';
import { isLambda } from './util';

let requestHandler;

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
      requestHandler = serverless(handler);
      requestHandler(...gatewayParams);
    });
  };
};
