/*******************************************************/
// fc_game.mjs
// fruit catcher
// A simple game where you move the basket to catch the falling fruits
// written by Aditi Modi term 1 2026
/*******************************************************/

/*******************************************************/
// variables()
/*******************************************************/
import { fb_initialise, fb_writeScore } from '../fb/fb_io.mjs';

fb_initialise();

const BASKETVEL = 10;
const FRUITVELMIN = 5;
const FRUITVELMAX = 8;
const MAXLIVES = 20;

let score = 0;
let BGimage, gameOverImage, imgBasket, fruitcatcherImage;
let fruitImages = [];
let imageArray = [];
let basket;
let missedFruits = 0;
let lives = MAXLIVES;
var fruitGroup;
let song;
let restartButton, homeButton, selectButton, leaderboardButton;
let wallBot;

let user = {
    uid: sessionStorage.getItem("uid"),
    displayName: sessionStorage.getItem("displayName") || "Player"
};

/*******************************************************/
// preload()
/*******************************************************/
function preload() {
    console.log("preload()");

    BGimage = loadImage('../assets/images/treebg.jpg');
    gameOverImage = loadImage('../assets/images/gameoversdisplay.jpg');
    imgBasket = loadImage('../assets/images/basket.png');
    fruitcatcherImage = loadImage('../assets/images/fruitcatcher.jpg');

    fruitImages.push(loadImage('../assets/images/apple.jpg'));
    fruitImages.push(loadImage('../assets/images/banana.jpg'));
    fruitImages.push(loadImage('../assets/images/grape.jpg'));
    fruitImages.push(loadImage('../assets/images/kiwi.jpg'));
    fruitImages.push(loadImage('../assets/images/lemon.jpg'));
    fruitImages.push(loadImage('../assets/images/neactrine.jpg'));
    fruitImages.push(loadImage('../assets/images/orange.jpg'));
    fruitImages.push(loadImage('../assets/images/pear.jpg'));
    fruitImages.push(loadImage('../assets/images/pineapple.jpg'));
    fruitImages.push(loadImage('../assets/images/plum.jpg'));
    fruitImages.push(loadImage('../assets/images/strawberry.jpg'));
    fruitImages.push(loadImage('../assets/images/watermelon.jpg'));

    imageArray = [
        {name: 'apple', img: fruitImages[0], w: 40, h: 0, imgW: 80, imgH: 80},
        {name: 'banana', img: fruitImages[1], w: 40, h: 45, imgW: 70, imgH: 70},
        {name: 'grape', img: fruitImages[2], w: 40, h: 45, imgW: 70, imgH: 70},
        {name: 'kiwi', img: fruitImages[3], w: 40, h: 45, imgW: 70, imgH: 70},
        {name: 'lemon', img: fruitImages[4], w: 40, h: 0, imgW: 70, imgH: 70},
        {name: 'neactrine', img: fruitImages[5], w: 40, h: 45, imgW: 70, imgH: 70},
        {name: 'orange', img: fruitImages[6], w: 40, h: 0, imgW: 70, imgH: 70},
        {name: 'pear', img: fruitImages[7], w: 40, h: 45, imgW: 70, imgH: 70},
        {name: 'pineapple', img: fruitImages[8], w: 40, h: 45, imgW: 70, imgH: 70},
        {name: 'plum', img: fruitImages[9], w: 40, h: 45, imgW: 70, imgH: 70},
        {name: 'strawberry', img: fruitImages[10], w: 40, h: 45, imgW: 70, imgH: 70},
        {name: 'watermelon', img: fruitImages[11], w: 40, h: 45, imgW: 80, imgH: 70}
    ];

    console.log(imageArray); 
}

/*******************************************************/
// setup()
/*******************************************************/
function setup() {
    console.log("setup: ");

    let cnv = new Canvas(windowWidth - 5, windowHeight - 5);
    world.gravity.y = 10;

    createWalls();
    createBasket();

    fruitGroup = new Group();
    fruitGroup.collides(wallBot, fruitHitWall);

    createFruits();

    html_listen4Debug();
}

/*******************************************************/
// createWalls()
/*******************************************************/
function createWalls() {
    wallBot = new Sprite(width, height, 2 * width, 8, 'k');
    wallBot.color = 'black';

    new Sprite(0, height / 2, 8, height, 'k');
    new Sprite(width, height / 2, 8, height, 'k');
    new Sprite(width, 0, 2 * width, 8, 'k');
}

/*******************************************************/
// createBasket()
/*******************************************************/
function createBasket() {
    basket = new Sprite(width / 2, height - 50, 100, 50);
    basket.drag = 0;
    basket.rotationLock = true;
    basket.image = imgBasket;
    imgBasket.resize(150, 150);
}

/*******************************************************/
// createFruits()  
/*******************************************************/
function createFruits() {
    console.log("createFruits()");

    let fruit = {};
    let randImg = random(imageArray);

    console.log(randImg); // show full object like last year

    if (randImg.h == 0) {
        fruit = new Sprite(random(width), 50, randImg.w, randImg.h, 'd');
    }
    else {
        fruit = new Sprite(random(width), 0, randImg.w, randImg.h, 'd');
    }

    fruit.name  = randImg.name;
    fruit.image = randImg.img; 
    fruit.image.resize(randImg.imgW, randImg.imgH);
    fruit.vel.y = random(FRUITVELMIN, FRUITVELMAX);

    console.log("fruit spawned:", fruit.name);

    fruitGroup.add(fruit);
}

/*******************************************************/
// fruitHitWall() 
/*******************************************************/
function fruitHitWall(_fruit, _wall) {
    console.log("fruitHitWall()");

    console.log("fruit hit wall:", _fruit.name);

    _fruit.remove();

    lives--;

    console.log("lives left:", lives);

    if (lives <= 0) {
        gameOverScreen();
    }
}

/*******************************************************/
// fruitHitsBasket() 
/*******************************************************/
function fruitHitsBasket(fruit, basket) {
    console.log("fruitHitsBasket()");

    console.log("caught fruit:", fruit.name);

    fruit.position.x = random(width);
    fruit.position.y = 0;

    score++;

    console.log("score:", score);
}

/*******************************************************/
// draw()
/*******************************************************/
function draw() {

    if (lives <= 0) return;

    background(BGimage);

    // spawn fruits
    if (frameCount % 45 === 0) {
        createFruits();
    }

    // movement
    if (kb.pressing('left')) basket.vel.x = -BASKETVEL * 2;
    else if (kb.pressing('right')) basket.vel.x = BASKETVEL * 2;
    else basket.vel.x = 0;

    // collisions
    for (let i = 0; i < fruitGroup.length; i++) {
        fruitGroup[i].collides(basket, fruitHitsBasket);
    }

    drawScoreBox();
    drawLivesBox();
}

/*******************************************************/
// drawScoreBox()
/*******************************************************/
function drawScoreBox() {
    fill(220);
    rect(10, 10, 150, 40);
    fill(0);
    text("Score: " + score, 20, 35);
}

/*******************************************************/
// drawLivesBox()
/*******************************************************/
function drawLivesBox() {
    fill(255);
    rect(10, 60, 150, 40);
    fill(0);
    text("Lives: " + lives, 20, 85);
}

/*******************************************************/
// saveScore()
/*******************************************************/
function saveScore() {

    const scoreRecord = {
        uid: user.uid,
        displayName: user.displayName,
        score: score
    };

    fb_writeScore(scoreRecord);
}

/*******************************************************/
// gameOverScreen()
/*******************************************************/
function gameOverScreen() {

    saveScore();
    noLoop();

    //REMOVE ALL FRUITS ON GAME OVER SCREEN
       fruitGroup.removeAll();
    
    // REMOVE BASKET ON GAME OVER SCREEN
       basket.remove();

    // canvas with a clear background
     background('#ffcccc'); // light red colour

    textAlign(CENTER, CENTER);

    // GAME OVER TITLE
    fill(90, 0, 0);
    stroke(0);
    strokeWeight(4);
    textSize(90); 
    textStyle(BOLD);
    text("GAME OVER", width / 2, height / 5);

    //Score display
    fill(0);
    textSize(40);
    text("Your score: " + score, width / 2, height /2 - 40);

       // ===== BUTTONS =====

    // Restart
    restartButton = createButton('Restart');
    restartButton.position(width / 2 - 100, height / 2 + 20);
    restartButton.size(200, 45);
    styleButton(restartButton);
    restartButton.mousePressed(restartGame);

    // Home (index.html)
    homeButton = createButton('Home');
    homeButton.position(width / 2 - 100, height / 2 + 80);
    homeButton.size(200, 45);
    styleButton(homeButton);
    homeButton.mousePressed(() => {
    window.location.href = "../index.html";
    });

    // Game Selection
    selectButton = createButton('Game Selection');
    selectButton.position(width / 2 - 100, height / 2 + 140);
    selectButton.size(200, 45);
    styleButton(selectButton);
    selectButton.mousePressed(() => {
    window.location.href = "../html/select_game.html";
});

    // Leaderboard
    leaderboardButton = createButton('Leaderboard');
    leaderboardButton.position(width / 2 - 100, height / 2 + 200);
    leaderboardButton.size(200, 45);
    styleButton(leaderboardButton);
    leaderboardButton.mousePressed(() => {
    window.location.href = "../html/leaderboard.html";
});
}

/*******************************************************/
// restartGame()
/*******************************************************/
function restartGame() {

    // REMOVE ALL BUTTONS WHEN RESTARTING GAME
    restartButton.remove();
    homeButton.remove();
    selectButton.remove();
    leaderboardButton.remove();

    score = 0;
    lives = MAXLIVES;

    createWalls();
    createBasket();

    fruitGroup = new Group();
    fruitGroup.collides(wallBot, fruitHitWall);

    createFruits();

    loop();
}

/*******************************************************/
// debug
/*******************************************************/
function html_listen4Debug() {
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'z') {
            noLoop();
        } else if (event.ctrlKey && event.key === 'x') {
            loop();
        }
    });
}

/*******************************************************/
// STYLE BUTTON
/*******************************************************/
function styleButton(btn) {
    btn.style('font-size', '18px');
    btn.style('background-color', '#ffffff');
    btn.style('border', '3px solid #660000');
    btn.style('border-radius', '12px');
    btn.style('padding', '5px');
    btn.style('cursor', 'pointer');
    btn.style('font-weight', 'bold');
}


/*******************************************************/
window.preload = preload;
window.draw = draw;
window.setup = setup;
/*******************************************************/