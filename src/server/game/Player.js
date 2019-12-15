function Player(name, id) {
  this.name = name;
  this.id = id;
  this.ready = false;
  this.score = 0;
}

Player.prototype.equals = function(player) {
  return player && this.id === player.id;
};

module.exports = Player;
