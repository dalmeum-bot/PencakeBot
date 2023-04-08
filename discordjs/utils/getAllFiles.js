const Filestream = require('fs');
const Path = require('path');

module.exports = (directory, foldersOnly = false) => {
    let fileNames = [];

    const files = Filestream.readdirSync(directory, { withFileTypes: true });
    for (const file of files) {
        const filePath = Path.join(directory, file.name);

        if (foldersOnly && file.isDirectory()) {
            fileNames.push(filePath);
        } else if (!foldersOnly && file.isFile()) {
            fileNames.push(filePath);
        }
    }

    return fileNames;
};