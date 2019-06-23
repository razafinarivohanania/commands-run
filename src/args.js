/**
 * Extract args
 * Exit on no group command
 * 
 * @returns {Array<String>} args
 */
module.exports = () => {
    const args = process.argv.slice(2);
    if (args.length == 0){
        console.error('No group command name mentionned on args');
        process.exit(0);
    }

    return args;
}