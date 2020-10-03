var http = require('http');
let fs = require('fs');

const GitHub = require("github-api");

let handleRequest = (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    fs.readFile('../Website/index.html', null, function(error, data) {
        if (error) {
            response.writeHead(404);
            respone.write('Whoops! File not found!');
        } else {
            response.write(data);
        }
        response.end();
    });
};
http.createServer(handleRequest).listen(8000);


// by default all requests are unauthenticated
// unauthenticated clients are limited to 60 request per hour
var noAuth = new GitHub();

// you can authenticate with username and password
// var passwordAuth = new GitHub({
//     username: username,
//     password: password
// });

// you can also provide an OAuth token to authenticate the requests
// var oauthAuth = new GitHub({
//     token: 'MY_OAUTH_TOKEN'
// });