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
  this.rounds.push(new Round(this.players[i]));
};

Game.prototype.confirmCard = function(player, card) {
  this.getCurrentRound().confirmCard(player, card);
  const cards = this.getCurrentRound().getConfirmedCards();
  /*     console.log(this.players.map(p => `${p.name} - ${p.new}`));
    console.log('confirmed', cards.length, 'of', this.players.filter(p => !p.new).length - 1); */
  if (cards.length === this.players.filter(p => !p.new).length - 1) {
    this.allCardsConfirmed(this.getCurrentRound().getMaster(), cards);
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
