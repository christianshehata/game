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
var won = false;
var currentScore = 0;
var winningScore = 50;
var clickMeButton;
var attempts = 0;

// Catalogue questions & answers

questions = [
  'Please answer the following question: Are you retarded?',
  'What the fuck are you doing?',
  'Who the fuck are you?',
  'Using MAC or Windows?',
  'Is Strembeck bullshitting us?'
];
answers = ['Yes', 'Chilling', 'Christian', 'MAC', 'Hell yeah'];

// create a single animated item and add to screen
function createItem(left, top, image) {
  var item = items.create(left, top, image);
  item.animations.add('spin');
  item.animations.play('spin', 10, true);
}


// add collectable items to the game
function addItems() {
  items = game.add.physicsGroup();
  createItem(300, 500, 'coin');
  createItem(500, 100, 'coin');
  createItem(200, 150, 'coin');
  createItem(150, 300, 'coin');
  createItem(500, 500, 'coin');


}

// add platforms to the game
function addPlatforms() {
  platforms = game.add.physicsGroup();
  platforms.create(450, 150, 'platform');
  platforms.create(200, 200, 'platform');
  platforms.create(150, 350, 'platform');
  platforms.create(100, 450, 'platform');
  platforms.setAll('body.immovable', true);
}



// create the winning badge and add to screen
function createBadge() {
  badges = game.add.physicsGroup();
  var badge = badges.create(150, 150, 'badge');
  badge.animations.add('spin');
  badge.animations.play('spin', 10, true);

}

// when the player collects an item on the screen
async function itemHandler(player, item) {
  item.kill();
  let randomIndex = Math.floor(Math.random() * questions.length);
  let randomQuestion = questions[randomIndex];
  let randomAnswer = answers[randomIndex];
  const {value: usersChoiceIndex} = await Swal.fire({
    title: randomQuestion,
    input: 'radio',
    inputOptions: answers,
    inputValidator: (value) => {
      if (!value) {
        return 'You need to choose something!'
      }
    }
  });

  // Validation of the correct answer
  if (answers[usersChoiceIndex] === randomAnswer) {
    currentScore = currentScore + 10;
  } else {
    alert('Still retarded...god damn..');
    attempts = attempts + 1;
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
}

// setup game when the web page loads
window.onload = function () {
  game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

  
  // before the game begins
  function preload() {
    game.stage.backgroundColor = '#2562ff';
    
    //Load images
    game.load.image('platform', 'platform_1.png');
    
    //Load spritesheets
    game.load.spritesheet('player', 'chalkers.png', 48, 62);
    game.load.spritesheet('coin', 'coin.png', 36, 44);
    game.load.spritesheet('question', 'question.png', 36, 44);
    game.load.spritesheet('badge', 'badge.png', 42, 54);
    game.load.spritesheet('button', 'instructions.png', 32, 32);

  }

  // Initial PopUp for information reasons before the game loads
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
  `
});

  function actionOnClick() {
    // confirm('So this is the first level: HTML and you have come to challenge me for knowledge. Come at me bra!')
    Swal.fire({
        icon: 'info',
        title: 'Instruction',
        text: 'Welcome to your first level: HTML 🧐 Answer the questions by collecting the coins!',
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
    attemptsText = game.add.text(640, 16, "WRONG: " + attemptsText, { font: "bold 24px Permanent Marker", fill: "white" });
    clickMeButton = game.add.button(16, 50, 'button', actionOnClick, this);
    winningMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 48px Permanent Marker", fill: "white" });
    winningMessage.anchor.setTo(0.5, 1);
  }



  // while the game is running
  function update() {
    text.text = "SCORE: " + currentScore;
    attemptsText.text = "WRONG: " + attempts;
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(player, items, itemHandler);
    game.physics.arcade.overlap(player, badges, badgeHandler);
    player.body.velocity.x = 0;

    // is the left cursor key pressed?
    if (cursors.left.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = -300;
      player.scale.x = - 1;
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
      player.body.velocity.y = -400;
    }
    // when the player wins the game
    if (won) {
      winningMessage.text = 'YOU WON !! 😎'
    }
  }

  function render() {
  }

};
