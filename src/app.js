const Alexa = require('alexa-sdk');

const EXIT_SKILL_MESSAGE = 'Thank you for playing this game! Hope to see you again soon!';

const states = {
    GUESSMODE: '_GUESSMODE', // User is trying to guess the number.
    STARTMODE: '_STARTMODE'  // Prompt the user to start or restart the game.
};

const speech = '';

module.exports.handlers = {
    LaunchRequest() {
        // prepare session variables
        if (Object.keys(this.attributes).length === 0) {
            this.attributes.endedSessionCount = 0;
            this.attributes.gamesPlayed = 0;
        }
        this.handler.state = states.STARTMODE;
        this.emitWithState('Start');
    },
    SessionEndedRequest() {
        this.emit(':tell', EXIT_SKILL_MESSAGE);
    }
};

module.exports.startModeHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    Start() {
        this.emit(':ask', `Welcome to High Low guessing game. You have played ${
            this.attributes.gamesPlayed.toString()} times. would you like to play?`,
            'Say yes to start the game or no to quit.');
    },
    'AMAZON.YesIntent': function () {
        this.attributes.guessNumber = Math.floor(Math.random() * 100);
        this.handler.state = states.GUESSMODE;
        this.emit(':ask', 'Great! Try saying a number to start the game.', 'Try saying a number.');
    },
    'AMAZON.NoIntent': function () {
        this.emit(':tell', 'Ok, see you next time!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', EXIT_SKILL_MESSAGE);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', EXIT_SKILL_MESSAGE);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', 'Say yes to start the game or no to quit.', 'Say yes to start the game or no to quit.');
    },
    SessionEndedRequest() {
        this.emit(':tell', EXIT_SKILL_MESSAGE);
    },
    Unhandled() {
        this.emitWithState('Start');
    }
});

module.exports.guessModeHandlers = Alexa.CreateStateHandler(states.GUESSMODE, {
    NumberGuessIntent() {
        const guessNum = parseInt(this.event.request.intent.slots.number.value, 10);
        const targetNum = this.attributes.guessNumber;
        console.log(`user guessed: ${guessNum}`);

        if (guessNum > targetNum) {
            this.emit('TooHigh', guessNum);
        } else if (guessNum < targetNum) {
            this.emit('TooLow', guessNum);
        } else if (guessNum === targetNum) {
            // With a callback, use the arrow function to preserve the correct 'this' context
            this.emit('JustRight', () => {
                this.emit(':ask', `${guessNum.toString()} is correct! Would you like to play a new game?`,
                    'Say yes to start a new game, or no to end the game.');
            });
        } else {
            this.emit('NotANum');
        }
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', 'I am thinking of a number between zero and one hundred, try to guess and I will tell you' +
            ' if it is higher or lower.', 'Try saying a number.');
    },
    'AMAZON.StopIntent': function () {
        console.log('STOPINTENT');
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.CancelIntent': function () {
        console.log('CANCELINTENT');
    },
    SessionEndedRequest() {
        this.attributes.endedSessionCount++;
        this.emit(':tell', EXIT_SKILL_MESSAGE);
    },
    Unhandled() {
        console.log('UNHANDLED');
        this.emit(':ask', 'Sorry, I didn\'t get that. Try saying a number.', 'Try saying a number.');
    }
});

// These handlers are not bound to a state
module.exports.guessAttemptHandlers = {
    TooHigh(val) {
        this.emit(':ask', `${val.toString()} is too high.`, 'Try saying a smaller number.');
    },
    TooLow(val) {
        this.emit(':ask', `${val.toString()} is too low.`, 'Try saying a larger number.');
    },
    JustRight(callback) {
        this.handler.state = states.STARTMODE;
        this.attributes.gamesPlayed++;
        callback();
    },
    NotANum() {
        this.emit(':ask', 'Sorry, I didn\'t get that. Try saying a number.', 'Try saying a number.');
    }
};

