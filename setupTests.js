// setupTests.js
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const outputDir = path.resolve(__dirname, process.env.TEST_OUTPUT_DIR);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

global.testOutputDir = outputDir;
