var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http); //use io in place of nsp if not using namespace
var nsp = io.of('/chatroom1'); //new namespace

app.get('/', function(req, res){
res.sendFile(__dirname + '/index.html');
});

var clients = 0; //number of clients connected
nsp.on('connection', function(socket)
{
   ++clients; //increasing the number of clients
   //broadcast to all including sender
  // io.sockets.emit('broadcast',{ description: clients + ' clients connected!'});

  //broadcast to all except sender
   socket.broadcast.emit('newclientconnect',{ description: clients + ' clients connected!'})
   //emitting a braodcast in the start probably to tell who has joined the chat
   socket.emit('welcome','Welcome to free chat');

   //recieving a chat message and sending it back to all
   socket.on('chat message', function(msg)
   {
     socket.broadcast.emit('chat message', msg);
   });

  //a user disconnected
  socket.on('disconnect',function()
  {
    --clients;
   socket.broadcast.emit('newclientconnect',{ description: clients + ' clients connected!'})
  });


});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
