
function Player(name, id, socket) {
    this.name = name;
    this.id = id;
    this.socket = socket;
    this.ready = false;
}

Player.prototype.equals = function (player) {
    return player && this.id === player.id;
};

module.exports = Player;