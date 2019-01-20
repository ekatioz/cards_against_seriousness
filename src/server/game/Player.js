
function Player(name, socket) {
    this.name = name;
    this.socket = socket;
    this.ready = false;
}

Player.prototype.equals = function (player) {
    console.log(`${this.name === player.name} && ${this.socket === player.socket}`);
    return this.name === player.name && this.socket === player.socket;
};

module.exports = Player;