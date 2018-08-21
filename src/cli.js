import fs from 'fs';
import path from 'path';
import { spawn } from 'cross-spawn';

/**
 * Find the path where next.js is installed
 *
 * @return {string} next.js location
 */
export const findNext = () => {
  const possiblePaths = [
    '../node_modules/next', // local development with npm link
    '../../next', // installed as a normal dependency
  ];

  const nextPath = possiblePaths.find(p => fs.existsSync(path.resolve(__dirname, p)));

  if (!nextPath) {
    throw new Error('next could not be found, make sure it is installed');
  }

  return path.resolve(__dirname, nextPath);
};

/**
 * Executes a command and handles exit codes correctly
 *
 * @param {string} command - Command to execute
 * @param {array} args - Arguments to pass to the command
 * @param {object} options - Options for the new process
 * @return {Promise} If `stdio` is set to 'pipe', returns a promise which contains the output
 */
export const executeCommand = (command, args = [], options = {}) => {
  const proc = spawn(command, args, {
    stdio: 'inherit',
    customFds: [0, 1, 2],
    ...options,
  });

  // handle process output
  let stdout = '';
  let stderr = '';
  let promise;
  const outputPromise = new Promise((resolve, reject) => {
    promise = { resolve, reject };
  });

  if (options.stdio === 'pipe') {
    proc.stdout.on('data', (data) => {
      stdout += data;
    });
    proc.stderr.on('data', (data) => {
      stderr += data;
    });
  }

  // handle process close
  proc.on('close', (code, signal) => {
    if (options.stdio === 'pipe') {
      if (stderr === '') {
        promise.resolve(stdout);
      } else {
        promise.reject(stderr);
      }
    }

    // wait for promises to resolve
    setTimeout(() => {
      if (code !== null) {
        process.exit(code);
      } else if (signal && signal === 'SIGKILL') {
        process.exit(137);
      } else if (signal) {
        process.exit(1);
      }

      process.exit(0);
    });
  });

  proc.on('error', (err) => {
    console.error(err);
    process.exit(1);
  });

  process.on('SIGINT', proc.kill);
  process.on('SIGTERM', proc.kill);
  process.on('exit', proc.kill);

  return outputPromise;
};
