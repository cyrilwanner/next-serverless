import fs from 'fs';
import path from 'path';

const projectDir = process.env.INIT_CWD || process.cwd();

// copy the deafult serverless.yml to the project if it doesn't exist yet
if (
  fs.existsSync(path.resolve(projectDir, 'package.json'))
  && !fs.existsSync(path.resolve(projectDir, 'serverless.yml'))
  && projectDir !== path.resolve(__dirname, '..')
) {
  const src = path.resolve(__dirname, '..', 'default-serverless.yml');
  const dest = path.resolve(projectDir, 'serverless.yml');

  let appName = 'next-serverless';

  try {
    appName = require(path.resolve(projectDir, 'package.json')).name; // eslint-disable-line
  } catch (ignored) {}

  const content = fs.readFileSync(src, 'utf-8').replace(/\$APP_NAME/g, appName);

  fs.writeFileSync(dest, content, 'utf-8');
  console.log('Copied', src, 'to', dest);
}
