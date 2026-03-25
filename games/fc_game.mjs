// fc_game.js
// fruit catcher
// A simple game where you move the basket to catch the falling fruits
// written by Aditi Modi term 1 2026

/*******************************************************/
// variables()
/*******************************************************/
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
let restartButton;
let wallBot;

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

    // Build array of images and their widths/heights
    imageArray = [
        {name: 'apple',      img: fruitImages[0],  w: 40, h: 0,   imgW: 80, imgH: 80},
        {name: 'banana',     img: fruitImages[1],  w: 40, h: 45,  imgW: 70, imgH: 70},
        {name: 'grape',      img: fruitImages[2],  w: 40, h: 45,  imgW: 70, imgH: 70},
        {name: 'kiwi',       img: fruitImages[3],  w: 40, h: 45,  imgW: 70, imgH: 70},
        {name: 'lemon',      img: fruitImages[4],  w: 40, h: 0,   imgW: 70, imgH: 70},
        {name: 'neactrine',  img: fruitImages[5],  w: 40, h: 45,  imgW: 70, imgH: 70},
        {name: 'orange',     img: fruitImages[6],  w: 40, h: 0,   imgW: 70, imgH: 70},
        {name: 'pear',       img: fruitImages[7],  w: 40, h: 45,  imgW: 70, imgH: 70},
        {name: 'pineapple',  img: fruitImages[8],  w: 40, h: 45,  imgW: 70, imgH: 70},
        {name: 'plum',       img: fruitImages[9],  w: 40, h: 45,  imgW: 70, imgH: 70},
        {name: 'strawberry', img: fruitImages[10], w: 40, h: 45,  imgW: 70, imgH: 70},
        {name: 'watermelon', img: fruitImages[11], w: 40, h: 45,  imgW: 80, imgH: 70}
    ];

    console.log(imageArray);
}

/*******************************************************/
// setup()
/*******************************************************/
function setup() {
    console.log("setup: ");

    let cnv = createCanvas(windowWidth - 5, windowHeight - 5);
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
    console.log("createWalls()");

    wallBot = new Sprite(width, height, 2 * width, 8, 'k');
    wallBot.color = 'black';

    let wallLH = new Sprite(0, height / 2, 8, height, 'k');
    wallLH.color = 'purple';
    let wallRH = new Sprite(width, height / 2, 8, height, 'k');
    wallRH.color = 'pink';
    let wallTop = new Sprite(width, 0, 2 * width, 8, 'k');
    wallTop.color = 'blue';
}

/*******************************************************/
// createBasket()
/*******************************************************/
function createBasket() {
    console.log("createBasket()");

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

    if (randImg.h == 0) {
        fruit = new Sprite(random(width), 50, randImg.w, randImg.h, 'd');
    } else {
        fruit = new Sprite(random(width), 0, randImg.w, randImg.h, 'd');
    }

    fruit.name  = randImg.name;
    fruit.image = randImg.img;
    fruit.image.resize(randImg.imgW, randImg.imgH);
    fruit.vel.y = random(FRUITVELMIN, FRUITVELMAX);
    fruitGroup.add(fruit);
}

/*******************************************************/
// fruitHitWall()
/*******************************************************/
function fruitHitWall(_fruit, _wall) {
    console.log("fruitHitWall()");
    _fruit.remove();

    lives--;
    if (lives <= 0) {
        gameOverScreen();
    }
}

/*******************************************************/
// fruitHitsBasket()
/*******************************************************/
function fruitHitsBasket(fruit, basket) {
    fruit.position.x = random(width);
    fruit.position.y = 0;
    score++;
}

/*******************************************************/
// draw()
/*******************************************************/
function draw() {
    if (basket.debug == false) {
        background(BGimage);
    } else {
        background('white');
    }

    if (frameCount % 60 === 0) {
        for (let i = 0; i < 5; i++) {
            createFruits();
        }
    }

    if (kb.pressing('left')) {
        basket.vel.x = -BASKETVEL * 2;
    } else if (kb.pressing('right')) {
        basket.vel.x = BASKETVEL * 2;
    } else {
        basket.vel.x = 0;
    }

    for (let i = 0; i < fruitGroup.length; i++) {
        fruitGroup[i].collides(basket, fruitHitsBasket);
    }

    textAlign(LEFT);
    drawScoreBox();
    drawLivesBox();
}

/*******************************************************/
// drawLivesBox()
/*******************************************************/
function drawLivesBox() {
    fill(255);
    stroke(0);
    rect(10, 60, 150, 40);
    fill(0);
    noStroke();
    textSize(20);
    text("Lives: " + lives, 20, 85);
}

/*******************************************************/
// drawScoreBox()
/*******************************************************/
function drawScoreBox() {
    fill(220);
    stroke(0);
    rect(10, 10, 150, 40);
    fill(0);
    noStroke();
    textSize(20);
    text("Score: " + score, 20, 35);
}

/*******************************************************/
// gameOverScreen()
/*******************************************************/
function gameOverScreen() {
    console.log('gameOverScreen()');

    noLoop();
    background(fruitcatcherImage);

    fill(255);
    textSize(50);
    textFont('Georgia');
    textAlign(CENTER);
    stroke(0);
    strokeWeight(4);
    text("YOUR SCORE: " + score, width / 2, height / 2 + 100);

    image(gameOverImage, width / 2 - gameOverImage.width / 2 + 70, 80);
    allSprites.remove();

    restartButton = createButton('Restart');
    restartButton.position(width / 2 - 50, height / 2 + 200);  
    restartButton.size(200, 60);
    restartButton.mousePressed(restartGame);
}

/*******************************************************/
// restartGame()
/*******************************************************/
function restartGame() {
    console.log('restartGame()');

    restartButton.remove();
    score = 0;  
    lives = MAXLIVES;  
    missedFruits = 0;

    createWalls();  
    createBasket();
    fruitGroup = new Group();
    fruitGroup.collides(wallBot, fruitHitWall);
    createFruits();

    loop();
}

/*******************************************************/
// html_listen4Debug()
/*******************************************************/
function html_listen4Debug() {
    console.log('html_listen4Debug(): ');

    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'z') {
            console.log('html_listen4Debug(): ACTIVE');
            for (let i = 0; i < fruitGroup.length; i++) {
                fruitGroup[i].debug = true;
            }
            basket.debug = true;
            noLoop();
        } else if (event.ctrlKey && event.key === 'x') {
            console.log('html_listen4Debug(): INACTIVE');
            for (let i = 0; i < fruitGroup.length; i++) {
                fruitGroup[i].debug = false;
            }
            basket.debug = false;
            loop();
        }
    });
}

/*******************************************************/
//allowing p5.js functions to the global window object
/*******************************************************/
window.preload = preload;
window.draw = draw;
window.setup = setup;

/*******************************************************/
// END OF APP
/*******************************************************/