const Command = require('./command');

function runCommand(commandToRun){
    return new Promise(resolve => {
        const command = new Command(commandToRun);
        command.whenDone(resolve);
    });
}

/**
 * Run each command of commands
 * 
 * @param {Array<Object>} commands
 * @returns {Promise<void>}
 */
module.exports = async commands => {
    for (const command of commands)
        await runCommand(command);
}