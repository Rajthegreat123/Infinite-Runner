var Background, BackgroundImg, Title, TitleImg;
var Hills, HillsImg;
var Road, RoadImg;
var Sonic, SonicAni;
var Rings, RingsAni, RingsGroup;
var Counter, CounterAni;
var Ground;
var Spike, SpikeImg, SpikeGroup;
var Lives, LivesImg;
var Heart, HeartImg, HeartGroup;

var Restart, RestartImg;

var TitleSong;

var SonicFont;

var Score = 0;
var Life = 3;

var Gamestate = "Title";

function preload() {
  BackgroundImg = loadImage("Images/BackGround.png");
  HillsImg = loadImage("Images/Hills.png");
  RoadImg = loadImage("Images/Road.png");
  SpikeImg = loadImage("Images/Spike.png");
  SonicAni = loadAnimation("Images/Sonic-1.png", "Images/Sonic-2.png", "Images/Sonic-3.png", "Images/Sonic-4.png", "Images/Sonic-5.png",);
  RingsAni = loadAnimation("Images/1.png", "Images/2.png", "Images/3.png", "Images/4.png", "Images/5.png", "Images/6.png", "Images/7.png", "Images/8.png",);
  CounterAni = loadAnimation("Images/1.png", "Images/2.png", "Images/3.png", "Images/4.png", "Images/5.png", "Images/6.png", "Images/7.png", "Images/8.png",);
  LivesImg = loadImage("Images/Life.png")
  RestartImg = loadImage("Images/restart.png");
  TitleImg = loadImage("Images/Title.png");
  HeartImg = loadImage("Images/Heart.png");

  SonicFont = loadFont("Fonts/NiseSonic.ttf");

  TitleSong = loadSound("Music/TitleSong.mp3", loaded);
}



function setup() {
  createCanvas(670, 388);
  SonicAni.frameDelay = 0.5;

  Background = createSprite(335, 194, 670, 386);
  Background.addImage("Background", BackgroundImg);

  Title = createSprite(335, 194, 670, 386);
  Title.addImage("Title", TitleImg);
  Title.scale = 2.5

  Hills = createSprite(1000, 200, 2004, 391);
  Hills.addImage("Hills", HillsImg);

  Road = createSprite(1006, 187, 2010, 388);
  Road.addImage("Road", RoadImg);

  Sonic = createSprite(150, 280, 200, 180);
  Sonic.setCollider("rectangle", 0, 0, 400, 300);
  Sonic.addAnimation("Sonic", SonicAni);
  Sonic.scale = 0.25;

  Counter = createSprite(500, 50, 30, 30);
  Counter.addAnimation("Counter", CounterAni);
  Counter.scale = 0.10

  Ground = createSprite(340, 350, 670, 60);
  Ground.visible = false;

  Lives = createSprite(60, 50, 30, 30);
  Lives.addImage("Lives", LivesImg);
  Lives.scale = 0.3

  Restart = createSprite(325, 265, 150, 60);
  Restart.addImage("Restart", RestartImg);
  Restart.scale = 0.4;

  /*Rings = createSprite(300, 150, 150, 150);
  Rings.addAnimation("Rings", RingsAni);
  Rings.scale = 0.15;*/

  RingsGroup = createGroup();
  SpikeGroup = createGroup();
  HeartGroup = createGroup();
}

function loaded() {
  console.log("loaded");
}

function draw() {
  console.log(Gamestate)
  background(255, 255, 255);
  drawSprites();
  Sonic.debug = true;
  
  if (Gamestate == "Title") {

    if(!TitleSong.isPlaying()){
      TitleSong.play();
    } else {
      TitleSong.stop();
    }

    Restart.visible = false;
    Sonic.visible = false;
    Counter.visible = false;
    Lives.visible = false;
    Background.visible = false;
    Hills.visible = false;
    Road.visible = false;

    if (keyWentDown("Space")) {
      Gamestate = "Play";
      TitleSong.stop();
    }
  }

  if (Gamestate == "Play") {
    Sonic.visible = true;    
    Counter.visible = true;
    Lives.visible = true;
    Restart.visible = false;
    Background.visible = true;
    Hills.visible = true;
    Road.visible = true;
    Title.visible = false;
    Sonic.velocityY = Sonic.velocityY + 0.8
    Sonic.collide(Ground);

    if (RingsGroup.isTouching(Sonic)) {
      Score = Score + 1;
      RingsGroup.destroyEach();
    }


    Hills.velocityX = -16;
    if (Hills.x < 326) {
      Hills.x = 1000;
    }

    Road.velocityX = -16
    if (Road.x < 320) {
      Road.x = 1006;
    }

    if (keyWentDown("up") && Sonic.y >= 270 || keyWentDown("space") && Sonic.y >= 270) {
      Sonic.velocityY = -15;
    }
    if(Life < 2 || Life == 2){
      heart();
    }
    rings();
    spikes();

    if (HeartGroup.isTouching(Sonic)) {
      HeartGroup.destroyEach(Heart);
      Life = Life + 1;
    }

    textSize(20);
    textFont(SonicFont);
    stroke("black");
    strokeWeight(2);
    fill("yellow");
    text("Score: " + Score, 520, 56);

    textSize(20);
    textFont(SonicFont);
    stroke("white");
    strokeWeight(6)
    fill("blue");
    text("Lives: " + Life, 100, 56);

    if (SpikeGroup.isTouching(Sonic)) {
      Sonic.velocityX = 0;
      Hills.velocityX = 0;
      Road.velocityX = 0;
      Spike.velocityX = 0;
      SpikeGroup.destroyEach(Spike);
      Life = Life - 1;
    }

    if (Life == 0) {
      Gamestate = "End";
    }
  }

  if (Gamestate == "End") {
    Sonic.visible = false;
    Counter.visible = false;
    Lives.visible = false;
    Restart.visible = true;
    RingsGroup.destroyEach();
    SpikeGroup.destroyEach();
    textFont(SonicFont);
    textSize(50);
    stroke("black");
    fill("blue");
    text("GameOver", 150, 210);

    if (mousePressedOver(Restart)) {
      Sonic.visible = true;
      RingsGroup.destroyEach();
      SpikeGroup.destroyEach();
      Life = 3;
      Score = 0;
      Gamestate = "Play";

    }
  }
}

function rings() {
  if (World.frameCount % Math.round(random(150, 200)) == 0) {
    RingsAni.frameDelay = 2;
    Rings = createSprite(900, 280, 150, 150);
    Rings.addAnimation("Rings", RingsAni)
    Rings.scale = 0.20
    Rings.velocityX = -16;
    Rings.lifetime = 150;
    RingsGroup.add(Rings);
  }
}

function heart() {
  if (World.frameCount % Math.round(random(150, 200)) == 0) {
    Heart = createSprite(900, 280, 150, 150);
    Heart.addAnimation("Heart", HeartImg)
    Heart.scale = 0.10
    Heart.velocityX = -16;
    Heart.lifetime = 150;
    HeartGroup.add(Heart);
  }
}

function spikes() {
  if (World.frameCount % Math.round(random(100, 200)) == 0) {
    Spike = createSprite(900, 280, 150, 150);
    Spike.addImage("Spikes", SpikeImg)
    Spike.scale = 0.7
    Spike.velocityX = -16;
    Spike.lifetime = 150;
    SpikeGroup.add(Spike);
    Spike.debug = true;
  }
}

function reset() {

}
