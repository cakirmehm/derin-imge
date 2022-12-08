import Apple from './Apple.js';
import Background from './Background.js';
import Enemy from './Enemy.js';
import InputHandler from './InputHandler.js';
import Player from './Player.js';

const getRand = function (startInc, endInc) {
    return Math.trunc(Math.random() * (endInc - startInc)) + startInc;
};

window.addEventListener('load', e => {
    const canvas = document.getElementById('canvasMain');
    const ctx = canvas.getContext('2d');

    const SWIDTH = 2000;
    const SHEIGHT = 1000;

    canvas.setAttribute('width', SWIDTH);
    canvas.setAttribute('height', SHEIGHT);

    const input = new InputHandler();
    let player = new Player(SWIDTH, SHEIGHT);
    let background = new Background(SWIDTH, SHEIGHT);
    let enemies = [];
    let apples = [];

    let deltaTime = 0;
    let lastTime = 0;

    let enemyTimer = 0;

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
                    player.score -= player.vx;
                }

                e.markedAsBeaten = true;
                e.gaveDamage = true;
            }

            if (e.isOutOfScreen()) {
                if (e.markedAsDeleted == false) player.score += 1;

                e.markedAsDeleted = true;
            }

            player.hammers.forEach(h => {
                if (e.hasCollision(h)) {
                    if (!e.markedAsBeaten) player.score += 3;

                    e.markedAsBeaten = true;
                    h.markedAsDeleted = true;
                }
            });

            e.update(background, deltaTime);
        });

        enemies = enemies.filter(e => !e.markedAsDeleted);
    };

    let appleTimer = 0;

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
                    player.score += 1;
                    player.apples += 1;
                }

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
        context.fillStyle = 'orange';
        context.fillText(`Energy:  ${player.score}`, 32, 32);
        context.fillText(
            `Distance: ${player.runInMeters.toFixed(1)} m`,
            332,
            32
        );
        context.fillText('Speed: ' + player.vx, 832, 32);
        context.fillText('Apples: ' + player.apples, 1132, 32);
    };

    const displayGameOverStatus = function (context) {
        setCommonStyles(context);
        context.font = '84px Tahoma';

        context.fillStyle = 'orange';
        context.fillText(`GAME OVER !`, SWIDTH / 2.1, SHEIGHT / 4);

        context.fillText(
            `Derin İmge run ${player.runInMeters.toFixed(1)} m !`,
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

        if (player.isOutOfEnergy) {
            // ctx.clearRect(0, 0, SWIDTH, SHEIGHT);
            background.emptyDraw(ctx);
            player.update(input, deltaTime);
            displayGameOverStatus(ctx);
        } else {
            requestAnimationFrame(animate);
        }
    }

    animate(0);
});
