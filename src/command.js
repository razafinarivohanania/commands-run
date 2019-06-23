const { spawn } = require('child_process');
const { parseArgsStringToArgv } = require('string-argv');
const string = require('./string');

class Command {
    
    /**
     * Constructor needs command object :
     * 
     * command.command : 
     *     The command line to run (eg : ls -a -l)
     * 
     * command.directory : 
     *     The directory where the command line will be runned
     *     If absent, current directory of opening terminal will be used.
     * 
     * command.timeout : 
     *     Timeout defines the waiting delay where there is no new data neither on debug nor error
     *     Infinite timeout will be used if it is absent
     *     When timeout is reached, callback provided from whenDone() function will be rised
     * 
     * @param {Object} command 
     */
    constructor(command) {
        this.command = command;
        this.alreadyDone = false;
        this.isThereUpdate = true;
    }

    /**
     * Callback to call when command is done
     * 
     * Command is considered as done when :
     *    - timeout is reached or
     *    - command has finished its task
     * 
     * @param {Function} callback 
     */
    whenDone(callback) {
        this.whenDoneCallback = callback;
        this._process();
    }

    _process() {
        const parameters = this._parseCommand();
        const directory = this._getDirectory();
        const run = spawn(parameters.name, parameters.args, {cwd: directory});
        this._log(`Run command [${this.command.command}] at [${directory}]`, false, true);

        run.stdout.on('data', data => {
            this.isThereUpdate = true;
            this._log(data);
        });

        run.stderr.on('data', data => {
            this.isThereUpdate = true;
            this._log(data, true);
        });

        run.on('close', code => {
            this.isThereUpdate = true;
            this._log(`Command closed with code [${code}]`, false, true);
            this._riseDone();
        });

        if (this._hasTimeout())
            this._handleTimeout();
    }

    _getDirectory() {
        return this.command.directory ?
            this.command.directory :
            process.cwd();
    }

    _handleTimeout() {
        if (this.alreadyDone)
            return;

        if (!this.isThereUpdate) {
            this._log(`Timeout [${this.command.timeout} ms] reached`, false, true);
            this._riseDone();
            return;
        }

        this.isThereUpdate = false;
        setTimeout(() => this._handleTimeout(), this.command.timeout);
    }

    _hasTimeout() {
        return typeof this.command.timeout != 'undefined' && this.command.timeout != null;
    }

    _parseCommand() {
        const name = string.substringBefore(this.command.command, ' ');
        const args = string.substringAfter(this.command.command, ' ');

        return {
            name: name,
            args: parseArgsStringToArgv(args, name).slice(1)
        };
    }

    _riseDone() {
        if (this.alreadyDone)
            return;

        this.alreadyDone = true;
        this.whenDoneCallback();
    }

    _log(data, isError, isNative) {
        `${data}`
            .split('\n')
            .filter(line => line)
            .forEach(line => this._logLine(line, isError, isNative));
    }

    _logLine(line, isError, isNative) {
        const label = isError ?
            'ERROR' :
            'DEBUG';

        const separator = isNative ?
            '>' :
            ':'

        const message = `[${label} ${this.command.name}] ${separator} ${line}`;

        if (isError)
            console.error(message);
        else
            console.log(message);
    }
}

module.exports = Command;