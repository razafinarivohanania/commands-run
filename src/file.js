const fs = require('fs');

/**
 * Read file as String
 * 
 * @param {String} path
 * @returns {Promise<String>} data
 */
module.exports.read = path => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (error, data) => {
            if (error)
                reject(error);
            else
                resolve(`${data}`);
        });
    });
}