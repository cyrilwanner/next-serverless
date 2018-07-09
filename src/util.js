/**
 * Checks if the current code is running in a lambda environment
 */
export const isLambda = () => !!(process.env.LAMBDA_TASK_ROOT && process.env.AWS_EXECUTION_ENV);
