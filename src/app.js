const WELCOME_MESSAGE = 'Hello World!';

const handlers = {
    LaunchRequest() {
        this.emitWithState('Start');
    },
    Start() {
        this.emit(':tell', WELCOME_MESSAGE); 
    }
};

module.exports = { handlers };
