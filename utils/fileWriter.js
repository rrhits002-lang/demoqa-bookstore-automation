const fs = require('fs');
const path = require('path');

/**
 * Writes book details (Title, Author, Publisher) to a text file
 * inside the /output directory. Creates the directory if missing.
 */
function writeBookDetailsToFile(bookDetails, fileName = 'bookDetails.txt') {
  const outputDir = path.join(__dirname, '..', 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filePath = path.join(outputDir, fileName);
  const content =
    `Title: ${bookDetails.title}\n` +
    `Author: ${bookDetails.author}\n` +
    `Publisher: ${bookDetails.publisher}\n` +
    `Captured At: ${new Date().toISOString()}\n`;

  fs.writeFileSync(filePath, content, { encoding: 'utf-8' });
  return filePath;
}

module.exports = { writeBookDetailsToFile };
