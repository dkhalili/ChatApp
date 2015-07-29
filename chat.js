var net = require("net");
var port = 2002;
var fs = require("fs");

var clients = [];



var server = net.createServer(function(connection) {
	console.log("connected");	
	connection.setEncoding("utf8");
	
	clients.push(connection);
	
	server.listen("connection", function () {
			broadcast(connection);	
	})


	

	var broadcast = function broadcast(client) {
		fs.readFile("chat.json", "utf8", function(err, data) {
			if (err) {
				console.log(err);
			}
			else {
				var parsed = JSON.parse(data);
				parsed.forEach(function(message) {
						client.write(message);
				})
			}
		})
		
	}










	connection.on("data", function(clientData) {
		var message = clientData.trim();
		fs.readFile("chat.json", "utf8", function(err, data) {
			if (err) {
				console.log(err);
			}
			else {
				var parsed = JSON.parse(data);
				
				clients.forEach(function(socket) {
					socket.write(message+ "\n");
				})

				parsed.push(message);
				var stringify = JSON.stringify(parsed);
				fs.writeFile("chat.json", stringify, function(err) {
					if (err) {
						console.log(err);
					}
				})
				
			}

		})
	})


})



server.listen(port, function(){
	console.log("listening to " + port);
})





