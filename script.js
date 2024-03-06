let player;
let playerSpeedVariable = 0.5;
let frameCount = 0;
let bullets = [];
let largeAsteroidSheet; 
let largeAsteroids = [];
let medAsteroidSheet;
let medAsteroids = [];
let smallAsteroidSheet;
let smallAsteroids = [];
let difficulty = 20;
let asteroids = [];
let asteroidCount = 0;
let score = 0;
let font;

function preload() {
    font = loadFont('./Slim-Thirteen-Pixel-Fonts.ttf');
    largeAsteroidSheet = loadImage("./Large-Rocks.png");
    medAsteroidSheet = loadImage("./Medium-Rocks.png");
    smallAsteroidSheet = loadImage("./Small-Rocks.png");
  }

function setup(){
    //angleMode(DEGREES)
    imageMode(CENTER);
    createCanvas(windowWidth, windowHeight);
    player = {
        x: width / 2,
        y: height / 2,
        xv: 0,
        yv: 0,
        tx1: -20,
        ty1: 25,
        tx2: 20,
        ty2: 25,
        tx3: 0,
        ty3: -25,
        rotation: 0
    }

    for(let i = 0; i < 8; i++){
        largeAsteroids.push(largeAsteroidSheet.get(i*1000, 0, 1000, 1000));
        medAsteroids.push(medAsteroidSheet.get(i*500, 0, 500, 500));
        smallAsteroids.push(smallAsteroidSheet.get(i*250, 0, 250, 250));
    }

   //triangle(width/2 - 20, height/2, width/2 + 20, height/2, width/2, height/2 - 50);
   //fill('black');
   //triangle(width/2 - 15, height/2, width/2 + 15, height/2, width/2, height/2 - 40);
   //fill('white');
   //triangle(width/2 - 20, height/2, width/2 + 20, height/2, width/2, height/2 - 20);
   //fill('black');
   //triangle(width/2 - 15, height/2, width/2 + 15, height/2, width/2, height/2 - 15);

}

function draw(){
    frameCount++;
    let degree = player.rotation * (Math.PI / 180);
    findMovement(degree);
    movePlayer();
    background('black');
    moveBullet();
    moveAsteroids();
    updatePlayer(degree);
    loadScore();
    let rand = Math.floor(Math.random() * 25);
    if(rand == 1 && asteroidCount < difficulty){
        addAsteroid();
    };


    //console.log(player.rotation);
}

//UPDATE PLAYER
function updatePlayer(degree) { 
    strokeWeight(0);
    fill('white');
    push();
    translate(player.x, player.y)
    rotate(degree)
    triangle(
        player.tx1,
        player.ty1,
        player.tx2,
        player.ty2,
        player.tx3,
        player.ty3
    );
    fill('black');
    triangle(
        player.tx1 + 4,
        player.ty1 + 1,
        player.tx2 - 4,
        player.ty2 + 1,
        player.tx3,
        player.ty3 + 10
    );
    fill('white');
    triangle(
        player.tx1,
        player.ty1 + 1,
        player.tx2,
        player.ty2 + 1,
        player.tx3,
        player.ty3 + 35
    );
    fill('black');
    triangle(
        player.tx1,
        player.ty1 + 6,
        player.tx2,
        player.ty2 + 6,
        player.tx3,
        player.ty3 + 40
    );
    fill('white');
    pop();
}
    
function findMovement(degree) {
    //PLAYER MOVEMENT
    //W
    if(keyIsDown(87) && player.yv > playerSpeedVariable*-20){
        if(player.rotation < 90 || player.rotation > 270){
            player.yv -= playerSpeedVariable * (Math.cos(degree));
        } else {
            player.yv += playerSpeedVariable * -(Math.cos(degree));
        };
        if(player.rotation > 360 || player.rotation < 180) {
            player.xv += playerSpeedVariable * (Math.sin(degree));
        } else {
            player.xv -= playerSpeedVariable * -(Math.sin(degree));
        };
    };
    //S
    if(keyIsDown(83) && player.yv < playerSpeedVariable*10){
        if(player.rotation < 90 || player.rotation > 270){
            player.yv +=playerSpeedVariable * (Math.cos(degree));
        } else {
            player.yv -=playerSpeedVariable * -(Math.cos(degree));
        };
        if(player.rotation > 360 || player.rotation < 180) {
            player.xv -= playerSpeedVariable * (Math.sin(degree));
        } else {
            player.xv += playerSpeedVariable * -(Math.sin(degree));
        };
    };
    //A
    if(keyIsDown(65)){
        if(player.rotation == 0){
            player.rotation = 360;
        };
        player.rotation -= 5;
    };
    //D
    if(keyIsDown(68)){
        if(player.rotation == 360){
            player.rotation = 0;
        };
        player.rotation += 5;
    };
}
//MOVE PLAYER
function movePlayer(){
    if(player.y > height - 40 || player.y < 40){
        player.yv *= -1
    };
    if(player.x > width - 40 || player.x < 40){
        player.xv *= -1
    };
    player.x += player.xv;
    player.y += player.yv;
    if(player.yv != 0 || player.xv != 0){
        if(player.yv > 0){
            player.yv -= 0.25;
        } else if(player.yv < 0){
            player.yv += 0.25;
        };
        if(player.xv > 0){
            player.xv -= 0.25;
        } else if(player.xv < 0){
            player.xv += 0.25;
        };
    };
}
//CREATE BULLET
function mousePressed() {
    let bullet = {
        x: player.x,
        y: player.y,
        size: 5,
        rotation: player.rotation,
        xv: 20*(Math.cos((player.rotation - 90)*(Math.PI / 180))),
        yv: 20*(Math.sin((player.rotation - 90)*(Math.PI / 180)))
    }

    bullets.push(bullet);
}

//Move Bullet

function moveBullet(){
    for(let i=0; i < bullets.length; i++){
        fill('white');
        rect(bullets[i].x, bullets[i].y, bullets[i].size, bullets[i].size);
        bullets[i].x += bullets[i].xv;
        bullets[i].y += bullets[i].yv;
        if(checkCollisions(bullets[i])){
            //console.log('hit');
            splitAsteroid(checkCollisions(bullets[i]), bullets[i]);
            bullets.splice(i, 1);
        } else if(bullets[i].x > width || bullets[i].x < 0 || bullets[i].y > height || bullets[i].y < 0){
            bullets.splice(i, 1);
        }
        
    }
}

//Create Asteroid

function initAsteroid(tier = Math.floor(Math.random()* 3) + 1){
    asteroidCount++;
    let asteroid = {
        x: 0,
        y: 0,
        xv: Math.floor(Math.random()* 10) + 1,
        yv: Math.floor(Math.random()* 10) + 1,
        size: 150,
        imgSize: 200,
        tier: tier,
        img: largeAsteroids[Math.floor(Math.random()*7)],
        pts: 50
    }
    if(asteroid.tier == 1){
        asteroid.imgSize = 50;
        asteroid.size = 37;
        asteroid.pts = 200;
        asteroid.img = smallAsteroids[Math.floor(Math.random()*7)];
    } else if(asteroid.tier == 2){
        asteroid.imgSize = 100;
        asteroid.size = 75;
        asteroid.pts = 100;
        asteroid.img = medAsteroids[Math.floor(Math.random()*7)];
    }else{
        asteroid.img = largeAsteroids[Math.floor(Math.random()*7)];
    }
    return asteroid;
}

function addAsteroid() {
    let asteroid = initAsteroid();
    let asteroidHorizontal = Math.floor(Math.random() * width);
    let asteroidVertical = Math.floor(Math.random() * 2) + 1;
    if(asteroidVertical == 1) {
        asteroid.x = asteroidHorizontal;
        asteroid.y = -500;
        if(Math.floor(Math.random()*2) == 1){
            asteroid.xv *= -1;
        }
    } else if(asteroidVertical == 2) {
        asteroid.y = Math.floor(Math.random() * height);
        let side = Math.floor(Math.random() * 2);
        if(side == 1){
            asteroid.x = -500;
        } else {
            asteroid.x = width + 500;
            asteroid.xv *= -1;
        }
        if(Math.floor(Math.random()*2) == 1){
            asteroid.yv *= -1;
        }
    } else if(asteroidVertical ==3 ) {
        asteroid.x = asteroidHorizontal;
        asteroid.y = height + 500;
        if(Math.floor(Math.random()*2) == 1){
            asteroid.yv *= -1;
        }
    }
   // console.log(asteroidHorizontal + ', ' + asteroidVertical);

    asteroids.push(asteroid);

    //console.log(asteroid);

}

//Move Asteroids

function moveAsteroids() {
    for(let i=0; i < asteroids.length; i++){
        fill('white');
        if(asteroids[i].x > width + 1000 || asteroids[i].x < -1000){
            asteroids[i].xv *= -1;
        }
        if(asteroids[i].y > height + 1000 || asteroids[i].y < -1000){
            asteroids[i].yv *= -1;
        }
        asteroids[i].x += asteroids[i].xv;
        asteroids[i].y += asteroids[i].yv;
        //console.log(asteroids[i])
        image(asteroids[i].img, asteroids[i].x, asteroids[i].y, asteroids[i].imgSize, asteroids[i].imgSize);
        //rect(asteroids[i].x, asteroids[i].y, asteroids[i].size, asteroids[i].size);

    }

    
}

function checkCollisions(object) {
    for(let i = 0; i < asteroids.length; i++){
        let xDiff = object.x-asteroids[i].x;
        let yDiff = object.y-asteroids[i].y;
        let dist = Math.sqrt(xDiff*xDiff + yDiff*yDiff);
        if(dist <= asteroids[i].size){
            return asteroids[i];
        }
    }
    return false;
    
}

function splitAsteroid(asteroidToSplit, bullet){
    
if(asteroidToSplit.tier != 1){
    let splitAsteroid1 = initAsteroid(asteroidToSplit.tier - 1);
    splitAsteroid1.x = asteroidToSplit.x;
    splitAsteroid1.y = asteroidToSplit.y;
    
    let splitAsteroid2 = initAsteroid(asteroidToSplit.tier - 1);
    splitAsteroid2.x = asteroidToSplit.x;
    splitAsteroid2.y = asteroidToSplit.y;
    
    asteroids.push(splitAsteroid1);
    asteroids.push(splitAsteroid2);
    if(bullet.xv < 0){
        splitAsteroid1.xv = -Math.abs(splitAsteroid1.xv);
        splitAsteroid2.xv = -Math.abs(splitAsteroid2.xv);
    } else {
        splitAsteroid1.xv = Math.abs(splitAsteroid1.xv);
        splitAsteroid2.xv = Math.abs(splitAsteroid2.xv);
    }
    if(bullet.yv < 0){
        splitAsteroid1.yv = -Math.abs(splitAsteroid1.yv);
        splitAsteroid2.yv = -Math.abs(splitAsteroid2.yv);
    } else {
        splitAsteroid1.yv = Math.abs(splitAsteroid1.yv);
        splitAsteroid2.yv = Math.abs(splitAsteroid2.yv);
    }
}
    score += asteroidToSplit.pts;
    asteroidCount--;
    asteroids.splice(asteroids.indexOf(asteroidToSplit), 1);

}


function loadScore(){
    fill('white');
    textFont(font);
    textSize(50)

    text(`Score: ${score}`, 20, 40);
}