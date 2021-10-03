var bg, bgImg;
var player, shooterImg, shooter_shooting;
var heart1, heart2, heart3, zombie
var Bullets = 70;
var gamestate = "fight"
var life = 3;
var score = 0;
var lose_sound,win_sound,explosion_sound;
function preload() {

  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")

  bgImg = loadImage("assets/bg.jpeg")
  heart1 = loadImage("assets/heart_1.png");
  heart2 = loadImage("assets/heart_2.png");
  heart3 = loadImage("assets/heart_3.png");
  zombieimg = loadImage("assets/zombie.png");
  lose_sound = loadSound("assets/lose.mp3")
  win_sound = loadSound("assets/win.mp3")
  explosion_sound = loadSound("assets/explosion.mp3")

}

function setup() {


  createCanvas(windowWidth, windowHeight);

  //adding the background image
  bg = createSprite(displayWidth / 2 - 20, displayHeight / 2 - 40, 20, 20)
  bg.addImage(bgImg)
  bg.scale = 1.1


  //creating the player sprite
  player = createSprite(displayWidth - 1150, displayHeight - 300, 50, 50);
  player.addImage(shooterImg)
  player.scale = 0.3
  player.debug = true
  player.setCollider("rectangle", 0, 0, 300, 300)

  //creating the heart or life sprites
  heart1_life = createSprite(displayWidth - 150, 70, 50, 50)
  heart1_life.addImage(heart1);
  heart1_life.scale = 0.5
  heart1_life.visible = false
  heart2_life = createSprite(displayWidth - 150, 70, 50, 50)
  heart2_life.addImage(heart2);
  heart2_life.scale = 0.5
  heart2_life.visible = false
  heart3_life = createSprite(displayWidth - 150, 70, 50, 50)
  heart3_life.addImage(heart3);
  heart3_life.scale = 0.5
  //create the zombie group
  Zombiegroup = new Group()
  Bulletgroup = new Group()
}

function draw() {
  background(0);
if (gamestate === "fight") {
   if (life == 3){
     heart3.visible = true;
     heart2.visible = false;
     heart1.visible = false;
   }
   if (life == 2){
    heart3.visible = false;
    heart2.visible = true;
    heart1.visible = false;
  }
  if (life == 1){
    heart3.visible = false;
    heart2.visible = false;
    heart1.visible = true;
  }
  if (life == 0) {
  gamestate="lost";  
  }
  if (score == 100) {
    gamestate = "won";
  }


  //moving the player up and down and making the game mobile compatible using touches
  if (keyDown("UP_ARROW") || touches.length > 0) {
    player.y = player.y - 30
  }
  if (keyDown("DOWN_ARROW") || touches.length > 0) {
    player.y = player.y + 30
  }


  //release bullets and change the image of shooter to shooting position when space is pressed
  if (keyWentDown("space")) {

    player.addImage(shooter_shooting)
    var Bullet = createSprite(displayWidth - 1150, player.y - 30, 20, 20);
    Bullet.velocityX = 5;
    Bulletgroup.add(Bullet);
    player.depth = Bullet.depth;
    Bullets = Bullets - 1
    explosion_sound.play();

  }

  //player goes back to original standing image once we stop pressing the space bar
  else if (keyWentUp("space")) {
    player.addImage(shooterImg)
  }

  if (Bullets == 0) {
    gamestate = "bullet";
    lose_sound.play();
  }

  if (Zombiegroup.isTouching(player)) {
    lose_sound.play();
    for (var i = 0; i < Zombiegroup.length; i++) {
      if (Zombiegroup[i].isTouching(player)) {
        Zombiegroup[i].destroy();
        life= life-1;
        
      }
    }
  }
  if (Zombiegroup.isTouching(Bulletgroup)) {
    for (var i = 0; i < Zombiegroup.length; i++) {
      if (Zombiegroup[i].isTouching(Bulletgroup)) {
        Zombiegroup[i].destroy();
        Bulletgroup.destroyEach();
        explosion_sound.play();
        score = score + 10
        
      }
    }
  }
  enemy();
}
  drawSprites();
textSize(20);
fill("white");
text("Bullets = "+Bullets,displayWidth-200,displayHeight/2-250);
text("Score = "+score,displayWidth-200,displayHeight/2-220);
text("Lifes = "+life,displayWidth-200,displayHeight/2-280);
  if (gamestate == "lost") {
    fill("red");
    textSize(100);
    text("You Lost", 400, 400);
    Zombiegroup.destroyEach();
    player.destroy();
  }
  else if (gamestate == "won") {
    fill("green");
    textSize(100);
    text("You Won", 400, 400);
    Zombiegroup.destroyEach();
    player.destroy();
  } else if (gamestate == "bullet") {
    fill("yellow");
    textSize(100);
    text("You Ran out of bullets", 400, 400);
    Zombiegroup.destroyEach();
    player.destroy();
    Bulletgroup.destroyEach();
  }
}
function enemy() {

  if (frameCount % 50 === 0) {
    Zombie = createSprite(random(500, 1100), random(100, 500), 50, 50)
    Zombie.addImage(zombieimg);
    Zombie.scale = (0.2);
    Zombie.velocityX = -3
    Zombie.debug = true;
    Zombie.lifetime = 350;
    Zombie.setCollider("rectangle", 0, 0, 300, 350)
    Zombiegroup.add(Zombie)
  }
}
