// define variables
var game;
var player;
var platforms;
var badges;
var items;
var cursors;
var jumpButton;
var text;
var attemptsText;
var winningMessage;
var loseMessage;
var won = false;
var lose = false;
var currentScore = 0;
var winningScore = 70;
var clickMeButton;
var attempts = 0;
var questionArray = [];
var rightAnswersArray = [];
var falseAnswersArrayFirst = [];
var falseAnswersArraySecond = [];
var time;
var t;
var usersName = '';
var current_playing_back = false
var current_playing_win = false


// Connecting our 'database' with our cool game ._.
var connect = new XMLHttpRequest();
connect.open('GET', 'xml/FragenKatalog.xsd', false);
connect.setRequestHeader('Content-Type', "text/xml");
connect.send(null);
var theDocument = connect.responseXML;
var gameQuestions = theDocument.childNodes[0];
for (var i = 0; i < gameQuestions.children.length; i++) {
    var gameQuestion = gameQuestions.children[i];
    // Extracting the false answers (answer1) out of the XML Document
    var falseAnswersCollectionFirst = gameQuestion.getElementsByTagName('answer');
    var falseAnswersFirst = falseAnswersCollectionFirst[0].textContent.toString();
    // Extracting the false answers (answer1) out of the XML Document
    var falseAnswersCollectionSecond = gameQuestion.getElementsByTagName('answer2');
    var falseAnswersSecond = falseAnswersCollectionSecond[0].textContent.toString();
    // Extracting the right answers out of the XML Document
    var rightAnswersCollection = gameQuestion.getElementsByTagName('rightanswer');
    var rightAnswers = rightAnswersCollection[0].textContent.toString();
    // Extracting the questions
    var questionsCollection = gameQuestion.getElementsByTagName('question');
    var questions = questionsCollection[0].textContent.toString();
    questionArray.push(questions);
    rightAnswersArray.push(rightAnswers);
    falseAnswersArrayFirst.push(falseAnswersFirst);
    falseAnswersArraySecond.push(falseAnswersSecond);
}




// create a single animated item and add to screen
function createItem(left, top, image) {
    var item = items.create(left, top, image);
    item.animations.add('spin');
    item.animations.play('spin', 10, true);
}

// randomInt between range
function getRandomInt(x, y) {
    x = Math.ceil(x);
    y = Math.floor(y);
    var randomNumber = Math.floor(Math.random() * (y - x)) + x;
    return Math.abs(randomNumber)

}

// add collectable items to the game
// X Width = 900, Y Height = 700
function addItems() {
    items = game.add.physicsGroup();
    //
    createItem(820, 100, 'coin');
    createItem(400, 100, 'coin');
    createItem(150, 100, 'coin');
    //
    createItem(810, 300, 'coin');
    createItem(420, 300, 'coin');
    createItem(120, 300, 'coin');
    //
    createItem(800, 500, 'coin');
    createItem(430, 500, 'coin');
    createItem(140, 500, 'coin');
    //
    /*  createItem(690, 520, 'coin');
      createItem(130, 260, 'coin');
      createItem(700, 500, 'coin');*/
}

// add platforms to the game
function addPlatforms() {
    platforms = game.add.physicsGroup();
    //
    platforms.create(50, 150, 'platform');
    platforms.create(350, 150, 'platform');
    platforms.create(700, 150, 'platform');
    //
    platforms.create(50, 350, 'platform');
    platforms.create(350, 350, 'platform');
    platforms.create(700, 350, 'platform');
    //
    platforms.create(50, 550, 'platform');
    platforms.create(350, 550, 'platform');
    platforms.create(700, 550, 'platform');
    //
    platforms.setAll('body.immovable', true);
}



// create the winning badge and add to screen
function createBadge() {
    badges = game.add.physicsGroup();
    var badge = badges.create(350, 250, 'badge');
    badge.animations.add('spin');
    badge.animations.play('spin', 10, true);

}

// function for shuffeling elements in an array
// used for shuffeling the inputOptions
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}



// when the player collects an item on the screen
async function itemHandler(player, item) {
    item.kill();
    let randomQuestionIndex = Math.floor(Math.random() * questionArray.length);
    let inputOptions = [rightAnswersArray[randomQuestionIndex], falseAnswersArrayFirst[randomQuestionIndex], falseAnswersArraySecond[randomQuestionIndex]];
    var randomQuestion = questionArray[randomQuestionIndex];


    shuffle(inputOptions);
    const { value: usersChoiceIndex } = await Swal.fire({
        width: 600,
        title: randomQuestion,
        input: 'radio',
        inputOptions: inputOptions,
        inputValidator: (value) => {
            if (!value) {
                return 'You need to choose something!'
            }
        }
    });


    // Validation of the correct answer
    if (rightAnswersArray.includes(inputOptions[usersChoiceIndex])) {
        currentScore = currentScore + 10;
        questionArray.splice(randomQuestionIndex, 1);
        rightAnswersArray.splice(randomQuestionIndex, 1);
        falseAnswersArrayFirst.splice(randomQuestionIndex, 1);
        falseAnswersArraySecond.splice(randomQuestionIndex, 1);
        console.log('Asked question: ' + randomQuestion + 'Related answers ' + inputOptions)
        console.log(questionArray);
        console.log(rightAnswersArray);
        console.log(falseAnswersArrayFirst);
        console.log(falseAnswersArraySecond);

    } else {
        createItem(getRandomInt(50, 500), getRandomInt(50, 500), 'coin');
        attempts = attempts + 1;
        if (attempts === 5) {
            lose = true;
        }
    }
    if (currentScore === winningScore) {
        createBadge();
        Swal.fire('Good job!', 'Take the badge', 'success')
    }

}

// when the player collects the badge at the end of the game
function badgeHandler(player, badge) {
    badge.kill();
    won = true;
    //Winsound
  if(!current_playing_win) {
    current_playing_win = true
    var snd_win = game.add.audio('winsound');
    snd_win.play('',0 ,0.7, false);
  }
  badge.kill();
  won = true;
}



// setup game when the web page loads
window.onload = function() {
    game = new Phaser.Game(900, 700, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });


    // before the game begins
    function preload() {
        game.stage.backgroundColor = '#2562ff';

        //Load images
        game.load.image('platform', 'assets/images/platform_1.png');

        //Load spritesheets
        game.load.spritesheet('player', 'assets/images/chalkers.png', 48, 62);
        game.load.spritesheet('coin', 'assets/images/coin.png', 36, 44);
        game.load.spritesheet('question', 'assets/images/question.png', 36, 44);
        game.load.spritesheet('badge', 'assets/images/badge.png', 42, 54);
        game.load.spritesheet('button', 'assets/images/instructions.png', 32, 32);

        // Load sounds
        game.load.audio('coin_sammeln', ['assets/sounds/Coin3.ogg', 'assets/sounds/Coin3.mp3']);
        game.load.audio('jump', ['assets/sounds/Jump1.ogg', 'assets/sounds/Jump1.mp3']);
        game.load.audio('background', ['assets/sounds/Background.ogg', 'assets/sounds/Background.mp3']);
        game.load.audio('winsound', ['assets/sounds/Winsound.ogg', 'assets/sounds/Winsound.mp3']);

    }

    // PopUp for information reasons before the game loads
        Swal.fire({
            title: 'Hi 😊 Welcome to the digital world. You will be transformed into zeros and ones. U ready ?',
            width: 600,
            padding: '3em',
            background: '#fff url(https://sweetalert2.github.io/images/trees.png)',
            backdrop: `
        rgba(0,0,123,0.4)
        url("https://sweetalert2.github.io/images/nyan-cat.gif")
        left top
        no-repeat
      `,
            confirmButtonText: 'Continue',
        });


    //Time running out
    function noTime() {
        Swal.fire({
            title: 'Time ran out!!',
            text: 'you are too slow'
        })
        location.reload()
    }


    // Instruction PopUp
    function actionOnClick() {
        Swal.fire({
            icon: 'info',
            title: 'Instruction',
            text: 'Welcome to the Corporate IT game. 🧐 Answer the questions by collecting the coins!' + 'Good Luck ',
            footer: '<a href="https://github.com/christianshehata/game">Fork the project right here:</a>'
        })
    }

    //Lose message
    function loseOnClick() {
        Swal.fire({
            icon: 'warning',
            title: 'You failed, keep it up!' + '\nYou have left ' + seconds + ' seconds \n' + milliSec + ' milliseconds',
            text: 'Reload to play again 🚀',
            footer: '<a href="https://github.com/christianshehata/game">Fork the project right here:</a>'
        })
    }


    // initial game set up
    function create() {
        player = game.add.sprite(50, 600, 'player');
        player.animations.add('walk');
        player.anchor.setTo(0.5, 1);
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        player.body.gravity.y = 500;

        addItems();
        addPlatforms();

        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        text = game.add.text(16, 16, "SCORE: " + currentScore, { font: "bold 24px Permanent Marker", fill: "white" });
        attemptsText = game.add.text(740, 16, "WRONG: " + attemptsText, { font: "bold 24px Permanent Marker", fill: "white" });
        clickMeButton = game.add.button(16, 50, 'button', actionOnClick, this);
        winningMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 30px Permanent Marker", fill: "white" });
        winningMessage.anchor.setTo(0.5, 1);
        loseMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 48px Permanent Marker", fill: "white" });
        loseMessage.anchor.setTo(0.5, 1);
        time = game.add.text(350, 16, seconds + ":" + milliSec, { font: "bold 24px Permanent Marker", fill: "white" });
    }



    // while the game is running
    function update() {
        text.text = "SCORE: " + currentScore;
        attemptsText.text = "WRONG: " + attempts;
        time.text = seconds + ":" + milliSec;
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.overlap(player, items, itemHandler);
        game.physics.arcade.overlap(player, badges, badgeHandler);
        player.body.velocity.x = 0;

          //Music
        if(!current_playing_back) {
          current_playing_back = true;
          var snd_back = game.add.audio('background');
          snd_back.play('',0 ,0.3, true);
        }

        // Timer
        t = setTimeout(updateTime);

        // is the left cursor key pressed?
        if (cursors.left.isDown) {
            player.animations.play('walk', 10, true);
            player.body.velocity.x = -300;
            player.scale.x = -1;
        }
        // is the right cursor key pressed?
        else if (cursors.right.isDown) {
            player.animations.play('walk', 10, true);
            player.body.velocity.x = 300;
            player.scale.x = 1;
        }
        // player doesn't move
        else {
            player.animations.stop();
        }

        if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down)) {
            var snd_jump = game.add.audio('jump');
            snd_jump.play();
            player.body.velocity.y = -450;
        }
        // when the player wins the game
        if (won) {
            clearTimeout(t);
            winningMessage.text = 'YOU WON ' + '!! 😎' + 'Time left: ' + seconds + ':' + milliSec
        } else if (lose) {
            loseOnClick();
            player.animations.stop()
            clearTimeout(t)
        }
    }


    // Update time
    function updateTime() {
        if (milliSec === 0 && seconds === 0) {
            noTime();
            clearTimeout(t);
            return
        }

        if (milliSec <= 0) {
            milliSec = 60;
            seconds--;
        } else {
            milliSec--;
        }
    }

    function render() {}

};