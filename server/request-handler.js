/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
var fs = require("fs");

var storage;

var messageFile = __dirname+'/messages.json';
fs.readFile(messageFile, 'utf8', function(err, data){
  if (err) {
    return;
  }
  storage = JSON.parse(data);
  console.log(storage);
});


// storage.results.push({username: 'Rishi The G', message: 'GOOMAR!'});

var exports = module.exports = {};

exports.handler = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode = 404;
  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "text/plain";

  if (request.url === "/classes/messages") {

    if (request.method === 'GET'){
      statusCode = 200;
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(storage));
    } else if (request.method === 'POST') {
      var body = '';

      request.on('data', function(data){
        body += data;
      });

      request.on('end', function(){
        var jsonBody = JSON.parse(body);
        if (!jsonBody.createdAt) {
          jsonBody.createdAt = Date.now();
        }
        if (!jsonBody.roomname) {
          jsonBody.roomname = 'lobby';
        }
        storage.results.push(jsonBody);
        console.log(storage.results);
      });

      statusCode = 201;
      response.writeHead(statusCode, headers);
      response.end();
    }
  } else if (request.url === '/classes/room1') {
    if (request.method === 'GET') {
      statusCode = 200;
      response.writeHead(statusCode, headers);
      // Filter out based on roomname

      // Send the modified storage object
      response.end(JSON.stringify(storage));
    } else if (request.method === 'POST') {
      var body = '';

      request.on('data', function(data){
        body += data;
      });

      request.on('end', function(){
        var jsonBody = JSON.parse(body);
        if (!jsonBody.createdAt) {
          jsonBody.createdAt = Date.now();
        }
        jsonBody.roomname = 'room1';
        storage.results.push(jsonBody);
        console.log(storage.results);
      });

      statusCode = 201;
      response.writeHead(statusCode, headers);
      response.end();
    }
  } else {
    response.writeHead(statusCode, headers);
    response.end("Sorry, buster!");
  }

};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
