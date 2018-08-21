const pathPrefixHostCache = {};
let pathPrefixCache = null;

/**
 * Check if the current code is running in a lambda environment
 *
 * @return {boolean} True if the current environment is a lambda env
 */
export const isLambda = () => !!(process.env.LAMBDA_TASK_ROOT && process.env.AWS_EXECUTION_ENV);

/**
 * Check if a path prefix is needed.
 * It is usually needed if no custom domain gets used as it then adds the current environment as a
 * path prefix.
 * Example of a prefixed URL: https://example.execute-api.eu-west-1.amazonaws.com/prod
 *
 * @param {string} host - Hostname to check
 * @return {boolean} Wether the current URL has a path prefix
 */
export const hasPathPrefix = (host) => {
  if (typeof pathPrefixHostCache[host] !== 'undefined') {
    return pathPrefixHostCache[host];
  }

  pathPrefixHostCache[host] = !!(host.match(/^[a-z0-9]*\.execute-api\.[a-z0-9-]*\.amazonaws.com$/));

  return pathPrefixHostCache[host];
};

/**
 * Extract the stage from the request path
 *
 * @param {string} path - Full path
 * @return {string} Stage
 */
export const getStage = path => path.replace(/^(\/[^/]*).*/, '$1');

/**
 * Get the current path prefix
 *
 * @return {string} Path prefix
 */
export const getPathPrefix = () => {
  if (typeof window === 'undefined') {
    return global.next_serverless_prefix || '';
  }

  if (pathPrefixCache === null) {
    if (hasPathPrefix(window.location.host)) {
      pathPrefixCache = getStage(window.location.pathname);
    } else {
      pathPrefixCache = '';
    }
  }

  return pathPrefixCache;
};

/**
 * Checks if a link is a local link or if it points to another domain
 *
 * @param {string} link - Link to check
 * @return {boolean} Wether the link is a local link
 */
export const isLocal = link => !(link.match(/^(\/\/|[^/])/));

/**
 * Prefixes a path if it is a local one.
 * If no prefix is needed, it just returns the input path.
 *
 * @param {string} path - Path to prefix
 * @return {string} Prefixed path
 */
export const prefixPath = (path) => {
  if (isLocal(path)) {
    return getPathPrefix() + path;
  }

  return path;
};
