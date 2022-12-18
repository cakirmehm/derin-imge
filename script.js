import Apple from './Apple.js';
import Background from './Background.js';
import Enemy from './Enemy.js';
import InputHandler from './InputHandler.js';
import Player from './Player.js';
import { setSoundOn, SOUND_ON } from './Utils.js';

const SWIDTH = 2000;
const SHEIGHT = 930;
const canvas = document.getElementById('canvasMain');
const hitTheEnemyAudio = document.getElementById('hitTheEnemyAudio');
const startBtn = document.getElementById('startBtn');
const ctx = canvas.getContext('2d');

canvas.setAttribute('width', SWIDTH);
canvas.setAttribute('height', SHEIGHT);

let input = new InputHandler();
let player = new Player(SWIDTH, SHEIGHT);
let background = new Background(SWIDTH, SHEIGHT);
let enemies = [];
let apples = [];

let deltaTime = 0;
let lastTime = 0;

let enemyTimer = 0;
let appleTimer = 0;

const getRand = function (startInc, endInc) {
    return Math.trunc(Math.random() * (endInc - startInc)) + startInc;
};

function startGame() {
    canvas.setAttribute('width', SWIDTH);
    canvas.setAttribute('height', SHEIGHT);

    input = new InputHandler();
    player = new Player(SWIDTH, SHEIGHT);
    background = new Background(SWIDTH, SHEIGHT);
    enemies = [];
    apples = [];

    deltaTime = 0;
    lastTime = 0;

    enemyTimer = 0;
    appleTimer = 0;

    animate(0);
}

function animate(timeStamp) {
    deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    // Clear Canvas

    ctx.clearRect(0, 0, SWIDTH, SHEIGHT);

    background.draw(ctx);
    player.draw(ctx);
    player.update(input, deltaTime);
    background.update(player);

    handleEnemies(ctx, background, deltaTime);
    handleApples(ctx, background, deltaTime);

    //console.log(enemies);
    displayStatusText(ctx);

    IsGameOver = player.isOutOfEnergy;
    if (IsGameOver) {
        playSoundForGameOver();
        // ctx.clearRect(0, 0, SWIDTH, SHEIGHT);
        background.emptyDraw(ctx);
        player.update(input, deltaTime);
        displayGameOverStatus(ctx);
    } else {
        requestAnimationFrame(animate);
    }
}

const handleEnemies = function (context, background, deltaTime) {
    let randValLimit = Math.floor(2000 / player.vx);
    let enemyTimerLimit = getRand(randValLimit, randValLimit + 100);
    if (enemyTimer <= 0) {
        const en = new Enemy(SWIDTH, SHEIGHT);
        enemies.push(en);
        enemyTimer = enemyTimerLimit;
    } else {
        enemyTimer--;
    }

    enemies.forEach(e => {
        e.draw(context);

        if (e.hasCollision(player)) {
            if (e.markedAsBeaten == false) {
                player.energy -= player.vx;
                playSoundForHurting();
            }

            e.markedAsBeaten = true;
            e.gaveDamage = true;
        }

        if (e.isOutOfScreen()) {
            if (e.markedAsDeleted == false) player.energy += 1;

            e.markedAsDeleted = true;
        }

        player.hammers.forEach(h => {
            if (e.hasCollision(h)) {
                if (!e.markedAsBeaten) {
                    player.energy += 1;
                    hitTheEnemyAudio.play();
                }

                e.markedAsBeaten = true;
                h.markedAsDeleted = true;
            }
        });

        e.update(background, deltaTime);
    });

    enemies = enemies.filter(e => !e.markedAsDeleted);
};

const playSoundForEatingApple = function () {
    if (SOUND_ON) {
        new Audio('./sounds/Apple.wav').play();
    }
};

const playSoundForHurting = function () {
    if (SOUND_ON) {
        new Audio('./sounds/Hurt.wav').play();
    }
};

const playSoundForGameOver = function () {
    if (SOUND_ON) {
        new Audio('./sounds/GameOver.wav').play();
    }
};

const handleApples = function (context, background, deltaTime) {
    let appleTimerLimit = getRand(20, 200);

    if (appleTimer <= 0) {
        const ap = new Apple(SWIDTH, SHEIGHT);
        apples.push(ap);
        appleTimer = appleTimerLimit;
    } else {
        appleTimer--;
    }

    apples.forEach(a => {
        a.draw(context);

        if (a.hasCollision(player)) {
            if (a.markedAsEaten == false) {
                player.energy += 1;
                player.apples += 1;
                playSoundForEatingApple();
            }
            // getTheAppleAudio.play();

            a.markedAsEaten = true;
        }

        if (a.isOutOfScreen()) {
            a.markedAsDeleted = true;
        }

        a.update(background, deltaTime);
    });

    apples = apples.filter(e => !e.markedAsDeleted);
};

const displayStatusText = function (context) {
    context.font = '32px Tahoma';
    context.fillStyle = 'lime';
    context.fillText(`🔋Energy:  ${player.energy}`, 32, SHEIGHT - 7);
    context.fillText(
        `🏁Distance: ${player.runInMeters.toFixed(1)} m`,
        332,
        SHEIGHT - 7
    );
    context.fillText('🏃‍♀️Speed: ' + player.vx, 732, SHEIGHT - 7);
    context.fillText('🍏Apples: ' + player.apples, 1032, SHEIGHT - 7);
    context.fillText('🚩Level: ' + player.vx, 1332, SHEIGHT - 7);
};

const displayGameOverStatus = function (context) {
    setCommonStyles(context);
    context.font = '84px Tahoma';

    context.fillStyle = 'orange';
    context.fillText(`GAME OVER !`, SWIDTH / 2.1, SHEIGHT / 4);

    context.fillText(
        `Total Distance: ${player.runInMeters.toFixed(1)} m !`,
        SWIDTH / 2.4,
        SHEIGHT / 2.8
    );

    context.font = '34px Tahoma';
    context.fillText(
        `Click tap to start a new game!`,
        SWIDTH / 2.1,
        SHEIGHT / 1.618
    );
};

const displayWelcomeScreenStatus = function (context) {
    // setCommonStyles(context);

    context.fillStyle = 'steelblue';
    context.fillRect(0, 0, SWIDTH, SHEIGHT);
    context.font = '64px Tahoma';

    context.fillStyle = 'lime';
    context.fillText(`🏃‍♀️ DERIN IMGE - RUN GAME 🏁`, SWIDTH / 3.6, SHEIGHT / 4);

    context.font = '34px Tahoma';
    context.fillText(`JUMP: Tap or ArrowUp`, SWIDTH / 2.6, SHEIGHT / 2.8);

    context.fillText(`FIRE: Slide or Space`, SWIDTH / 2.6, SHEIGHT / 2.4);
};

function setCommonStyles(context) {
    context.shadowColor = '#d53';
    context.shadowBlur = 20;
    context.lineJoin = 'bevel';
    context.lineWidth = 5;
}

function requestFullScreen(element) {
    // Supports most browsers and their versions.
    var requestMethod =
        element.requestFullScreen ||
        element.webkitRequestFullScreen ||
        element.mozRequestFullScreen ||
        element.msRequestFullScreen;

    if (requestMethod) {
        // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== 'undefined') {
        // Older IE.
        var wscript = new ActiveXObject('WScript.Shell');
        if (wscript !== null) {
            wscript.SendKeys('{F11}');
        }
    }
}

const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return (
            navigator.userAgent.match(/IEMobile/i) ||
            navigator.userAgent.match(/WPDesktop/i)
        );
    },
    any: function () {
        return (
            isMobile.Android() ||
            isMobile.BlackBerry() ||
            isMobile.iOS() ||
            isMobile.Opera() ||
            isMobile.Windows()
        );
    },
};

window.addEventListener('load', e => {
    if (isMobile.any()) {
        setSoundOn(false);
    }

    displayWelcomeScreenStatus(ctx);
    //startGame();
});

startBtn.addEventListener('click', e => {
    // requestFullScreen(document.body);

    try {
        if (isMobile.any()) {
            requestFullScreen(document.documentElement);
        } else {
            document.documentElement.webkitRequestFullScreen();
        }

        startBtn.style.display = 'none';
        startGame();
    } catch (error) {
        alert(error);
    }
});

export let IsGameOver = false;
export function setGameOver(value) {
    IsGameOver = value;

    if (!IsGameOver) {
        startGame();
    }
}
