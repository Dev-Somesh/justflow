#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the built HTML file
const htmlPath = path.join(__dirname, '..', 'dist', 'index.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Remove any trailing whitespace
htmlContent = htmlContent.replace(/[ \t]+$/gm, '');

// Ensure proper line endings
htmlContent = htmlContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

// Write the cleaned HTML back
fs.writeFileSync(htmlPath, htmlContent);

console.log('✅ HTML validation issues fixed');
