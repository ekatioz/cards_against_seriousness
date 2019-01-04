const Round = require('./Round');

function Game(players) {
    this.players = players;
    this.rounds = [];
    this.usedCards = [];
}

Game.prototype.newRound = function (cloze) {
    this.rounds.push(new Round(cloze, this.players[0]));
};

Game.prototype.getCurrentRound = function () {
    return this.rounds[this.rounds.length -1];
};

Game.prototype.getUsedCards = function () {
    const collector = [];
    rounds.forEach(round => {
        collector.push(...round.getUsedCards());
    });
    return collector;
};

Game.prototype.getUsedClozes = function () {
    const collector = [];
    rounds.forEach(round => {
        collector.push(round.getUsedCloze());
    });
    return collector;
};

module.exports = Game;