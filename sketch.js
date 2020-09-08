var trex, trex_running, trex_collided, trex_start;
var ground, invisibleGround, groundImage;
var cloudImage, Clouds;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, Obstacles;
var Score = 0;
var gameState, START, PLAY, GAMEOVER;
var GameOver, RestartButton;
var GameOverImage, RestartButtonImage;
var die, jump, checkpoint;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadImage("trex_collided.png");
  trex_start = loadImage("trex1.png")
  cloudImage = loadImage("cloud.png");
  groundImage = loadImage("ground2.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  GameOverImage = loadImage("gameOver.png");
  RestartButtonImage = loadImage("restart.png");
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
  checkpoint = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);

  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("still", trex_start)
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  RestartButton = createSprite(300, 125);
  RestartButton.addImage("Button", RestartButtonImage);
  RestartButton.scale = 0.5;
  RestartButton.visible = false;

  GameOver = createSprite(300, 70)
  GameOver.addImage("text", GameOverImage)
  GameOver.visible = false;

  Clouds = new Group();
  Obstacles = new Group();
  START = 1;
  PLAY = 2;
  GAMEOVER = 0;
  gameState = START;
  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;
}

function reset() {
  Score = 0;
  gameState = PLAY;
  Obstacles.destroyEach();
  Clouds.destroyEach();
  trex.changeAnimation("trex");
  trex.y = 180;
  GameOver.visible = false;
  RestartButton.visible = false;
}

function genClouds() {
  if (frameCount % 15 === 0) {
    var cloud = createSprite(620, random(38, 120));
    cloud.addImage("cloud", cloudImage);
    cloud.velocityX = -10;
    trex.depth = cloud.depth + 1;
    cloud.lifetime = 75;
    Clouds.add(cloud);
    GameOver.depth = cloud.depth + 1;
    RestartButton.depth = cloud.depth + 1;
  }
}

function genCacti() {
  if (frameCount % 50 === 0) {
    var Obstacle = createSprite(610, 160);
    var rand = Math.round(random(1, 6))
    if (rand === 1) {
      Obstacle.addImage("obstacle", obstacle1);
    } else if (rand === 2) {
      Obstacle.addImage("obstacle", obstacle2);
    } else if (rand === 3) {
      Obstacle.addImage("obstacle", obstacle3);
    } else if (rand === 4) {
      Obstacle.addImage("obstacle", obstacle4);
    } else if (rand === 5) {
      Obstacle.addImage("obstacle", obstacle5);
    } else if (rand === 6) {
      Obstacle.addImage("obstacle", obstacle6);
    }
    Obstacle.velocityX = -10;
    Obstacle.lifetime = 75;
    Obstacles.add(Obstacle);
    Obstacles.setScaleEach(0.75);

  }
}

function draw() {
  background("white");

  text(Score, 550, 15);



  if ((keyDown("SPACE") || keyDown("up") || keyDown("W")) && gameState === START) {
    gameState = PLAY;
  } else if (gameState === PLAY) {
    if ((keyDown("space") || keyDown("up") || keyDown("w")) && trex.isTouching(ground)) {
      trex.velocityY = -15;
      trex.changeAnimation("still");
      jump.play();
    }
    trex.changeAnimation("running");
    ground.velocityX = -10;
    trex.velocityY = trex.velocityY + 0.8
    if (frameCount % 3 === 0) {
      Score = Score + 1;
    }
    if (Score % 100 === 0&&Score > 0) {
      checkpoint.play();
    }
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    genClouds();
    genCacti();
    if (trex.isTouching(Obstacles)) {
      gameState = GAMEOVER;
      die.play();
    }
  } else if (gameState === GAMEOVER) {
    ground.velocityX = 0;
    trex.velocityY = 0;
    Obstacles.setVelocityXEach(0);
    Clouds.setVelocityXEach(0);
    Clouds.setLifetimeEach(-1);
    Obstacles.setLifetimeEach(-1);
    trex.changeAnimation("collided");
    trex.scale = 0.5;
    GameOver.visible = true;
    RestartButton.visible = true;
  }
  if (gameState === GAMEOVER && (keyDown("space") || keyDown("up")) || keyDown("w") || mousePressedOver(RestartButton)) {
    reset();

  }



  trex.collide(invisibleGround);
  drawSprites();
}