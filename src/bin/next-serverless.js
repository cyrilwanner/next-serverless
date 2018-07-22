#!/usr/bin/env node
import path from 'path';
import { findNext, executeCommand } from '../cli';

// next-serverless dev
if (process.argv.length <= 2 || process.argv[2].startsWith('-') || process.argv[2] === 'dev') {
  require(path.resolve(__dirname, '..', 'server')); // eslint-disable-line

// next-serverless start
} else if (process.argv.length > 2 && process.argv[2] === 'start') {
  process.env.NODE_ENV = 'production';
  require(path.resolve(__dirname, '..', 'server')); // eslint-disable-line

// pipe all other commands to the next executable
} else {
  executeCommand(`${findNext()}/dist/bin/next`, process.argv.slice(2));
}
