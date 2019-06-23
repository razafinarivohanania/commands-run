const getCommands = require('./src/commands-file');
const runCommands = require('./src/commands');

/**
 * Entry point to run commands
 */
(async () => {
    const commands = await getCommands();
    await runCommands(commands);
})();