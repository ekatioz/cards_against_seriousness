const http = require('http');
const exec = require('child_process').exec;

http.createServer((req, res) => {
    exec('./update.sh',
        function (err, stdout, stderr) {
            if (err) throw err;
            else console.log(stdout);
        });
    res.write('OK');
    res.end();
}).listen(9080);
