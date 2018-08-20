#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

if (fs.existsSync(path.resolve(__dirname, 'lib'))) {
  require('./lib/install.js'); // eslint-disable-line
}
