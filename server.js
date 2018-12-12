var express = require('express');
var socket = require('socket.io');

var app = express();

// App setup
var server = app.listen(8000, function(){
    console.log('listening to requests on port 8000');
});

// Static files
app.use(express.static('public'));

// Socket setup
var io = socket(server);

// Global Variables
var players = [];
var player;
var master;
var displayName;
var displayNames = [];
var captions = [];

// Game Logic
game = {
    "player": {
        "playerId": [],
        "displayName": [],
    },
    "currentMaster" : null,
    "round": 0 
}

// Socket Connection
io.on('connection', function(socket){

    // On Player Connection
    socket.on('player connected', function(data){

        // Log Player Connection
        console.log('player connected');

        // Log Player Socket Id
        console.log(data.playerId);

        // Let Player = data.playerId (Socket.id)
        player = data.playerId;

        // Put Player Id Into Game Object
        game.player.playerId.push(player);
        console.log(game.player.playerId);

        // Push Player Into Players Array
        players.push(player);

        // If There Are 4 Players, Randomly Select Meme Master
        if (players.length == 3){

            // Log Max Players
            console.log('Max Player');

            // Meme Master Will Randomly Be Selected
            master = players[Math.floor(Math.random()*players.length)];

            // Put Master Into Game Object
            game.currentMaster = master;

            // Log Meme Master
            console.log('Player: ' + game.currentMaster + ' Is The Meme Master!');

            // Emit Current Master Id
            io.emit('masterId', {
                masterId: game.currentMaster
            });

        }

        // Recieve Display Name
        socket.on('displayName', function(data){

            displayName = data.displayName;

            // Push Display Name Into Array
            game.player.displayName.push(displayName);
            console.log(game.player.displayName);

        });

        // Recieve Meme Image Link
        socket.on('memeImage', function(data){
            console.log(data.memeImage);
            var memeImage = data.memeImage;

            // Emit Image To Other Clients
            io.emit('clientMeme', {
                clientMeme: memeImage
            });
        });

        
        // Recieve Captions From Clients
        socket.on('caption', function(data){

            var caption = data.caption;
            captions.push(caption);
            console.log(captions);

            io.emit('captions', {
                captions: captions
            });

        });

        socket.on('answerOne', function(data){
            console.log(data.answerOne);

            var answerOneWins = data.answerOne;

            io.emit('answerOneWins', {
                answerOneWins: answerOneWins
            });
        });

        socket.on('answerTwo', function(data){
            console.log(data.answerTwo);

            var answerTwoWins = data.answerTwo

            io.emit('answerTwoWins', {
                answerTwoWins: answerTwoWins
            });
        });

    });


    
      

});