const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', '.locale', 'docs');

const getAllFiles = (dir, files = []) => {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getAllFiles(fullPath, files);
        } else {
            files.push(fullPath);
        }
    });
    return files;
};

// Alle HTML-Dateien im docs-Ordner finden
const htmlFiles = getAllFiles(docsDir).filter(file => file.endsWith('.html'));

// Alle HTML-Dateien bearbeiten
htmlFiles.forEach(filePath => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file ${filePath}:`, err);
            return;
        }

        // `\@` durch `@` ersetzen
        let fixedData = data.replace(/\\@/g, '@');

        fs.writeFile(filePath, fixedData, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing file ${filePath}:`, err);
                return;
            }

            console.log(`Fixed escaping in ${filePath}`);
        });

    });
});
