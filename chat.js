var express = require('express');
var redis = require('redis');
var redisClient = redis.createClient();
var app = express();
var http = require('http');
app.get('/',function(request,response){
	response.sendfile(__dirname + '/index.html');
});
var server = http.createServer(app);

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(client){
	console.log('Client connected');
	client.on('join', function(name){
		client.set('nickname', name);
		redisClient.lrange("messages", 0,49, function(err, messages){
			messages = messages.reverse();
			client.emit('joiningIn', messages);
			// messages.forEach(function(message){
			// 	message = JSON.parse(message);
			// 	client.emit('chat', {name: message.name, message: message.data});
			// });
		});
	});
	client.on('messages',function(data){
		client.get('nickname', function(err,name){
			storeMessage(name, data);
			io.sockets.emit("chat", {name:name, message:data});
		});
		
	});
});

var storeMessage = function(name, data){
	var message = JSON.stringify({ name: name, data: data });
	redisClient.lpush("messages", message, function(err, response){
		redisClient.ltrim("messages", 0,10);
	});
}

server.listen(1337);