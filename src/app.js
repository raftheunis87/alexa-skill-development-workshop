const WELCOME_MESSAGE = 'Hello World!';

module.exports.handlers = {
    LaunchRequest() {
        this.emitWithState('Start');
    },
    Start() {
        this.emit(':tell', WELCOME_MESSAGE); 
    }
};
