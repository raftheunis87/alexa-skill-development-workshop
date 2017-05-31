const WELCOME_MESSAGE = 'Hello World!';

module.exports.newSessionHandlers = {
    NewSession() {
        this.emit(':tell', WELCOME_MESSAGE);
    }
};
