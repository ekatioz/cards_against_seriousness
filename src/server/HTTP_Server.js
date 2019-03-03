const { join } = require('path');
const express = require('express');

function HTTP_Server() {
    this.app = express();
    this.app.use(express.static(join(__dirname, '..', '..', 'dist')));
    this.app.use('/admin', express.static(join(__dirname, '..', 'adminUI')));
    console.log(join(__dirname, '..', 'adminUI'));
    this.app.setMaxListeners(1);
}

HTTP_Server.prototype.start = function (port) {
    var server = this.app.listen(port, () => {
        var host = server.address().address;
        var port = server.address().port;
        console.log("Example app listening at http://%s:%s", host, port);
    });
    return this;
};

HTTP_Server.prototype.get = function (route, callback) {
    this.app.get(route, callback);
};

module.exports = HTTP_Server;