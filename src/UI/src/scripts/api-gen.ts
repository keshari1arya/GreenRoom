const execSync = require('child_process').execSync;

const inputPath = 'https://localhost:5001/api/specification.json';
const outputPath = 'src/app/lib/openapi-generated';

console.log('Input: ' + inputPath);
console.log('Output: ' + outputPath);
console.log('Starting...');

const output = execSync(
  `npx ng-openapi-gen --input ${inputPath} --output ${outputPath}`,
  { encoding: 'utf8' }
);
console.log(output);
