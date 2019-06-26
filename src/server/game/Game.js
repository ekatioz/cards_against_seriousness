const Round = require("./Round");

function Game(players) {
  this.players = players;
  this.rounds = [];
}

Game.prototype.getPlayers = function() {
  return this.players;
};

Game.prototype.addPlayer = function(player) {
  player.new = true;
};

Game.prototype.newRound = function(cloze) {
  this.players.forEach(player => (player.new = false));
  let i = this.rounds[0]
    ? this.players.indexOf(this.getCurrentRound().getMaster())
    : Math.floor(Math.random() * this.players.length - 1);
  i++;
  i = i === this.players.length ? 0 : i;
  this.rounds.push(new Round(this.players[i], cloze));
};

Game.prototype.confirmCards = function(player, cards) {
  this.getCurrentRound().confirmCards(player, cards);
  const confirmed = this.getCurrentRound().getConfirmedCards();
  if (confirmed.length === this.players.filter(p => !p.new).length - 1) {
    this.allCardsConfirmed(this.getCurrentRound().getMaster(), confirmed);
  }
};

Game.prototype.onAllCardsConfirmed = function(callback) {
  this.allCardsConfirmed = callback;
};

Game.prototype.getCurrentRound = function() {
  return this.rounds[this.rounds.length - 1];
};

Game.prototype.isRunning = function() {
  return this.rounds.length !== 0;
};

module.exports = Game;
