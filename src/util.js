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
export const hasPathPrefix = host => !!(host.match(/^[a-z0-9]*\.execute-api\.[a-z0-9-]*\.amazonaws.coms/));
