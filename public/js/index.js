var socket = io();
var master;
var displayName;
var players = [];

// Socket setup
var io = socket;

// Hide Elements
$('.how-to-play').hide();
$('#master').addClass('hidden');
$('#game').addClass('hidden');
$('.shuffle').hide();
$('.shuffle-counter').hide();


$(document).ready(function(){

    $('#how-to').click(function(){
        $('.how-to-play').fadeToggle();
    });

    // Check if the body has the ID of #remote
    if ($('body').is('#remote')){

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

            $('.answerOne').hide();
            $('.answerTwo').hide();

            // Start Game Function
            $('#start').click(function(){

                var displayName = $('#display-name-input').val();
                console.log(displayName);

                // Set Display Name Text To Proper Div
                $('.display-name').text(displayName);

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
                        var images = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120];
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

                    // Emit Selected image src link
                    $('#send').click(function(){
                        socket.emit('memeImage', {
                            memeImage: imageLink
                        });

                        // Show response cards
                        $('.answerOne').show();
                        $('.answerTwo').show();
                        $('.answerOne').text('Waiting for response...');
                        $('.answerTwo').text('Waiting for response...');

                    });
                }


                var answerOne;
                var answerTwo;
                // Recieving player captions
                socket.on('captions', function(data){
                    console.log(data.captions);
                    var i;
                    for(i = 0; i < data.captions.length; i++){
                        answerOne = data.captions[0];
                        answerTwo = data.captions[1];
                    }

                    // Add first answer to answerOne and second answer to answerTwo
                    $('.answerOne').text(answerOne);
                    $('.answerTwo').text(answerTwo);

                    // Handle answer two
                    function handleAnswerOne(){
                        value = $('.answerOne').text();
                        console.log(value);
                        
                        // Emit value to server
                        socket.emit('answerOne', {
                            answerOne: value
                        });
                    }

                    // Handle answer two
                    function handleAnswerTwo(){
                        value= $('.answerTwo').text();
                        console.log(value);

                        // emit value to server
                        socket.emit('answerTwo', {
                            answerTwo: value
                        });
                    }

                    // Click functions for answer handlers
                    $('.answerOne').click(handleAnswerOne);
                    $('.answerTwo').click(handleAnswerTwo);

                    // Hide answer cards
                    $('.answerOne').click(function(){
                        $('.answerOne').hide();
                        $('.answerTwo').hide();
                    });

                    // Hide answer cards
                    $('.answerTwo').click(function(){
                        $('.answerOne').hide();
                        $('.answerTwo').hide();
                    });

                });

                // Else show game UI
                }  else {
                    
                    // Remove/Add Hidden to elements
                    $('#game').removeClass('hidden');
                    $('#entry').addClass('hidden');
                    $('#master').addClass('hidden');

                    $('.caption').hide();

                    $('#game-instruction').hide();
                    // Recieve Meme Image From Server
                    socket.on('clientMeme', function(data){
                        console.log(data.clientMeme);
                        var memeImage = data.clientMeme
                        $('#memeImg').attr("src", memeImage);

                        // Show/Hide Elements For Players
                        $('.caption').show();
                        $('.shuffle').show();
                        $('.shuffle-counter').show();
                        $('#game-welcome').hide();
                        $('#game-instruction').show();
                        
                    });

                        // Select random caption from the amount of captions stored in database
                        var captions = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 121, 122, 123, 124, 125, 126, 127, 128, 129, 129, 130];
                
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

                        // Player has 3 shuffles
                        shuffles = 3;
                        console.log(shuffles);
                        function shuffle(){
                            shuffles--;
                            console.log(shuffles);
                            $('.shuffles-count').text(shuffles);
                            if (shuffles == 0){
                                $('.shuffle').hide();
                            }
                            var i;
                            for (i = 0; i < 1; i++){
                                // Select random caption from the amount of captions stored in database
                                var captions = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, ];
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

                        // Handle caption
                        function handleCaption(){
                            value = $('.caption').text();
                            console.log(value);

                            // Send Captions To Server
                            socket.emit('caption', {
                                caption: value
                            });

                        }


                        $('.caption').click(handleCaption);
                        $('.winner').hide();
                        
                        // If first answer wins
                        socket.on('answerOneWins', function(data){
                            console.log(data.answerOneWins);

                            $('.winner').show();
                            $('.winner').text(data.answerOneWins + ': was the best caption!');
              
                            $('.shuffle').hide();
                            $('.shuffle-counter').hide();
                            $('.caption').hide();
                            $('#game-instruction').hide();

                        });

                        // If second answer wins
                        socket.on('answerTwoWins', function(data){
                            console.log(data.answerTwoWins);

                            $('.winner').show();
                            $('.winner').text(data.answerTwoWins + ' was the best caption!');

                            $('.shuffle').hide();
                            $('.shuffle-counter').hide();
                            $('.caption').hide();
                            $('#game-instruction').hide();

                        });

                }

            });

        });

     

    }

});
