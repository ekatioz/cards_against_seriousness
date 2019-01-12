const Round = require('./Round');

function Game(players) {
    this.players = players;
    this.rounds = [];
    this.usedCards = [];
}

Game.prototype.newRound = function (cloze) {
    const i = rounds[0]
        ? this.players.indexOf(getCurrentRound().getMaster())
        : Math.floor((Math.random() * this.players.length) - 1);
    i++;
    i = i === this.players.length ? 0 : i;
    this.rounds.push(new Round(cloze, this.players[i]));
};

Game.prototype.confirmCard = function (player, card) {
    this.getCurrentRound().confirmCard(player, card);
    const cards = this.getCurrentRound().getUsedCards();
    console.log('confirmed', cards.length, 'of', this.players.length - 1);
    if (cards.length === this.players.length - 1) {
        this.allCardsConfirmed(this.getCurrentRound().getMaster(), cards);
    }
};

Game.prototype.onAllCardsConfirmed = function (callback) {
    this.allCardsConfirmed = callback;
};

Game.prototype.getCurrentRound = function () {
    return this.rounds[this.rounds.length - 1];
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