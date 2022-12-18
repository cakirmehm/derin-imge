import { GROUND_LEVEL, SCALE } from './Utils.js';

export default class Apple {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.image = document.getElementById('appleImg');

        this.width = 70;
        this.height = 70;

        this.x = this.gameWidth;
        this.y = getRand(50, 500);

        this.frameX = 0;
        this.frameY = 0;
        this.maxFrames = 0;

        this.fps = 25;
        this.frameCounter = 0;
        this.frameInterval = 1000 / this.fps;

        this.markedAsEaten = false;
        this.markedAsDeleted = false;
    }

    draw(context) {
        const sx = this.frameX * this.width;
        const sy = this.frameY * this.height;
        const sw = this.width;
        const sh = this.height;

        if (this.markedAsEaten) {
            this.image = document.getElementById('effectImg');
            this.width = 256;
            this.height = 256;
            //this.frameX = 0;
            this.frameY = 2;
            this.maxFrames = 10;

            context.drawImage(
                this.image,
                sx,
                sy,
                sw,
                sh,
                this.x - 64,
                this.y - this.height / 2,
                this.width,
                this.height
            );
        } else {
            context.drawImage(
                this.image,
                sx,
                sy,
                sw,
                sh,
                this.x,
                this.y,
                this.width * SCALE,
                this.height * SCALE
            );
        }
    }

    update(background, deltaTime) {
        if (this.markedAsEaten) {
            if (this.frameCounter + deltaTime > this.frameInterval) {
                if (this.frameX < this.maxFrames - 1) {
                    this.frameX++;
                } else {
                    this.frameX = 0;
                    this.markedAsDeleted = true;
                }

                this.frameCounter = 0;
            } else {
                this.frameCounter += deltaTime;
            }
        }

        this.x += -background.vx;
    }

    isOutOfScreen() {
        return this.x + this.width < 0;
    }

    hasCollision(that) {
        return (
            this.x < that.x + that.width * 0.5 &&
            this.x + this.width > that.x &&
            this.y < that.y + that.height * 0.5 &&
            this.height + this.y > that.y
        );
    }
}

function getRand(startInc, endInc) {
    return Math.trunc(Math.random() * (endInc - startInc)) + startInc;
}
