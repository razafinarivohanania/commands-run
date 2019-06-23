const path = require('path');
const { read } = require('./file');
const getArgs = require('./args');

/**
 * Check if there is commands into "commands.json" according to arg
 * Note : If absent, process will be closed
 * 
 * @returns {Array<Object>} commands
 */
module.exports = async () => {
    const command = getArgs()[0];
    const data = await read(path.resolve(__dirname, '..', 'commands.json'));
    const commands = JSON.parse(data)[command];

    if (!commands || commands.length == 0) {
        console.error(`No command available on commands.json for [${command}]`);
        process.exit(0);
    }

    return commands;
}