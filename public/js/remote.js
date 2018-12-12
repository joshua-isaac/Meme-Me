var socket = io();
var master;
var displayName;
var players = [];

// Socket setup
var io = socket;

$(document).ready(function(){

    // Check if the body has the ID of #remote
    if ($('body').is('#remote')){

        $('#master').addClass('hidden');
        $('#game').addClass('hidden');

        // Log ID Confirmation
        console.log('This is a remote device');

        // Log Player Socket.id
        console.log('Your socket.id is ' + socket.id);

        // Player Connection To Server
        socket.emit('player connected', {
            playerId: socket.id
        })

        // Access Master Id From Server
        io.on('masterId', function(data){

            console.log(data.masterId + ' Is the Meme Master!');

            // Start Game Function
            $('#start').click(function(){

                // If Master Id = Socket Id, Show Master UI
                if ( data.masterId == socket.id ){
                    console.log('i am the meme master');
                    $('#master').removeClass('hidden');
                    $('#entry').addClass('hidden');
                    $('#game').addClass('hidden');
                        
                    // Randomize Image Function Click Event
                    $('#randomize').click(changeImg);

                    var imageLink;

                    // Randomize Image Function
                    function changeImg() {

                        // Select a random number from amount of images stored in database
                        var images = [1, 2, 3, 4, 5];
                        var rand = images[Math.floor(Math.random()*images.length)];
                        console.log(rand); 

                        // Turn Random Number Into String
                        var randString = rand.toString();

                        // Retrieve Document in Images Collection with the document id of the random string
                        var docImgRef = db.collection('images').doc(randString);
                        docImgRef.get().then(function(doc){

                            // Set imageLink to link of image from database
                            console.log(doc.data().imageLink);
                            imageLink = doc.data().imageLink

                            // Set image src with link pulled from database
                            $('#randImg').attr("src", imageLink);


                    });

                    $('#send').click(function(){
                        // Emite selected image src link
                        socket.emit('memeImage', {
                            memeImage: imageLink
                        });
                    });
                }

                socket.on('captions', function(data){
                    console.log(data.captions);
                    var i;
                    for(i = 0; i < data.captions.length; i++){
                        var answerOne = data.captions[0];
                        var answerTwo = data.captions[1];
                    }

                    $('.answerOne').text(answerOne);
                    $('.answerTwo').text(answerTwo);

                    function handleAnswerOne(){
                        value = $('.answerOne').text();
                        console.log(value);
                        
                        socket.emit('answerOne', {
                            answerOne: value
                        });
                    }

                    function handleAnswerTwo(){
                        value = $('.answerTwo').text();
                        console.log(value);

                        socket.emit('answerTwo', {
                            answerTwo: value
                        });
                    }

                    $('.answerOne').click(handleAnswerOne);
                    $('.answerTwo').click(handleAnswerTwo);
                });

                // Else show game UI
                }  else {
                    
                    console.log('im just a player')
                    $('#game').removeClass('hidden');
                    $('#entry').addClass('hidden');
                    $('#master').addClass('hidden');

                    // Recieve Meme Image From Server
                    socket.on('clientMeme', function(data){
                        console.log(data.clientMeme);
                        var memeImage = data.clientMeme
                        $('#memeImg').attr("src", memeImage);
                    });

                        // Select random caption from the amount of captions stored in database
                        var captions = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114];
                        var randCap = captions[Math.floor(Math.random()*captions.length)];

                        // Retrieve Document in Cards Collection with the document id of the random string
                        var randCapString = randCap.toString();

                        // Reference cards in database
                        var docCapRef = db.collection('cards').doc(randCapString);
                        docCapRef.get().then(function(doc){

                        var captionCard = doc.data().card;

                        console.log(captionCard);

                        $('.caption').text(captionCard);

                        });

                        $('.shuffle').click(shuffle);

                        function shuffle(){
                            var i;
                            for (i = 0; i < 3; i++){
                                // Select random caption from the amount of captions stored in database
                                var captions = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114];
                                var randCapShuffle = captions[Math.floor(Math.random()*captions.length)];
                                console.log(randCapShuffle);

                                var randCapShuffleString = randCapShuffle.toString();
                                // Reference cards in database
                                var docCapRef = db.collection('cards').doc(randCapShuffleString);
                                docCapRef.get().then(function(doc){

                                var shuffleCaptionCard = doc.data().card;

                                console.log(shuffleCaptionCard);

                                $('.caption').text(shuffleCaptionCard);
                        });

                        } 
    
                        }

                        function handleCaption(){
                            value = $('.caption').text();
                            console.log(value);

                            // Send Captions To Server
                            socket.emit('caption', {
                                caption: value
                            });
                        }

                        $('.caption').click(handleCaption);

                        socket.on('answerOneWins', function(data){
                            console.log(data.answerOneWins);

                            $('.winner').text(data.answerOneWins + ' was the best caption!');
                        });

                        socket.on('answerTwoWins', function(data){
                            console.log(data.answerTwoWins);

                            $('.winner').text(data.answerTwoWins + ' was the best caption!');
                        });


                }

                var displayName = $('#display-name-input').val();
                console.log(displayName);

                // Set Display Name Text To Proper Div
                $('.display-name').text(displayName);

            });

        });


    }

});
