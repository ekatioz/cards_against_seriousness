const Round = require('./Round');

function Game(players) {
    this.players = players;
    this.rounds = [];
    this.usedCards = [];
    this.usedClozes = [];
}

Game.prototype.getPlayers = function () {
    return this.players;
};

Game.prototype.newRound = function (cloze) {
    this.usedClozes.push(cloze);
    let i = this.rounds[0]
        ? this.players.indexOf(this.getCurrentRound().getMaster())
        : Math.floor((Math.random() * this.players.length) - 1);
    i++;
    i = i === this.players.length ? 0 : i;
    this.rounds.push(new Round(this.players[i]));
};

Game.prototype.addUsedCards = function (cards) {
    this.usedCards.push(...cards);
};

Game.prototype.confirmCard = function (player, card) {
    this.getCurrentRound().confirmCard(player, card);
    const cards = this.getCurrentRound().getConfirmedCards();
    //  console.log('confirmed', cards.length, 'of', this.players.length - 1);
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
    return this.usedCards;
};

Game.prototype.getUsedClozes = function () {
    return this.usedClozes;
};

module.exports = Game;