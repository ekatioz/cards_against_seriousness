
function Player(name, socket) {
    this.name = name;
    this.socket = socket;
    this.ready = false;
}

Player.prototype.equals = function (player) {
    return this.name === player.name && this.socket === player.socket;
};

module.exports = Player;