const Round = require("./Round");

function Game() {
  this.players = [];
  this.rounds = [];
}

Game.prototype.getPlayers = function() {
  return this.players;
};

Game.prototype.getPlayer = function(id) {
  return this.players.find(player => player.id === id);
};

Game.prototype.addPlayer = function(player) {
  player.new = true;
  this.players.push(player);
};

Game.prototype.removePlayer = function(id) {
  const player = this.getPlayer(id);
  if (player) {
    this.players.splice(this.players.indexOf(player), 1);
  }
  return player;
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
  console.log("confirmCards",player,cards);
  this.getCurrentRound().confirmCards(player, cards);
  const confirmed = this.getCurrentRound().getConfirmedCards();
  console.log("confirmed",confirmed);
  console.log("plyers",this.players);
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
