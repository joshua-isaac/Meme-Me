var express = require('express');
var socket = require('socket.io');

var app = express();

// App setup
var server = app.listen(8000, function () {
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
    "currentMaster": null,
    "round": 0
}

// Socket Connection
io.on('connection', function (socket) {

    // On Player Connection
    socket.on('player connected', function (data) {

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

        // If There Are 3 Players, Randomly Select Meme Master
        if (players.length == 3) {

            // Log Max Players
            console.log('Max Player');

            // Meme Master Will Randomly Be Selected
            master = players[Math.floor(Math.random() * players.length)];

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
        socket.on('displayName', function (data) {

            displayName = data.displayName;

            // Push Display Name Into Array
            game.player.displayName.push(displayName);
            console.log(game.player.displayName);

        });

        // Recieve Meme Image Link
        socket.on('memeImage', function (data) {
            console.log(data.memeImage);
            var memeImage = data.memeImage;

            // Emit Image To Other Clients
            io.emit('clientMeme', {
                clientMeme: memeImage
            });
        });


        // Recieve Captions From Clients
        socket.on('caption', function (data) {

            var caption = data.caption;
            captions.push(caption);
            console.log(captions);

            // Emit captions
            io.emit('captions', {
                captions: captions
            });

        });

        // Recieve answer one from client
        socket.on('answerOne', function (data) {
            console.log(data.answerOne);

            var answerOneWins = data.answerOne;
            var answerTwoLose = data.answerTwo;

            // Send answer one to meme master
            io.emit('answerOneWins', {
                answerOneWins: answerOneWins,
                answerTwoLose: answerTwoLose
            });
        });

        // Recieve answer two from client
        socket.on('answerTwo', function (data) {
            console.log(data.answerTwo);

            var answerTwoWins = data.answerTwo;
            var answerOneLose = data.answerOne;

            // Send answer to to meme master
            io.emit('answerTwoWins', {
                answerTwoWins: answerTwoWins,
                answerOneLose: answerOneLose
            });
        });

        socket.on('clear', function (data) {
            captions = data.clear;
            console.log(captions);
        });

        console.log('test');
        // Disconnection
        socket.on('disconnect', function () {
            console.log('disconnection');

            // Remove socket.id upon player disconnection
            var index = players.indexOf(socket.id);
            if (index > -1) {
                players.splice(index, 1);
            }

            // Log remaining players
            console.log(players);

        });


    });

});