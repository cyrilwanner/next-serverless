#!/usr/bin/env node
import path from 'path';
import { findNext, executeCommand } from '../cli';

const isHelp = process.argv.indexOf('-h') >= 0 || process.argv.indexOf('--help') >= 0;

// next-serverless dev
if (!isHelp && (process.argv.length <= 2 || process.argv[2].startsWith('-') || process.argv[2] === 'dev')) {
  require(path.resolve(__dirname, '..', 'server')); // eslint-disable-line

// next-serverless start
} else if (!isHelp && process.argv.length > 2 && process.argv[2] === 'start') {
  process.env.NODE_ENV = 'production';
  require(path.resolve(__dirname, '..', 'server')); // eslint-disable-line

// pipe all other commands to the next executable
} else {
  executeCommand(`${findNext()}/dist/bin/next`, process.argv.slice(2));
}
