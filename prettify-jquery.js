const fs = require('fs');
const prettier = require('prettier');

try {
  // Read the minified jQuery file
  const minifiedCode = fs.readFileSync('./js/jquery-3.5.1.min.dc5e7f18c8.js', 'utf8');

  // Prettify the code synchronously
  const formattedCode = prettier.format(minifiedCode, { 
    parser: 'babel',
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
    bracketSpacing: true,
    printWidth: 100
  });

  // Write the prettified code to a new file
  fs.writeFileSync('./js/jquery-3.5.1.prettified.js', formattedCode);
  console.log('jQuery file has been prettified successfully!');
} catch (error) {
  console.error('Error prettifying jQuery file:', error);
} 