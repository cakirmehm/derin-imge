import { GROUND_LEVEL, SCALE } from './Utils.js';

export default class Enemy {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.imageIndex = getRand(1, 5);
        this.image = document.getElementById(`enemyImg${this.imageIndex}`);

        this.width = 300;
        this.height = 256;

        this.x = this.gameWidth;
        this.y = this.imageIndex === 4 ? 0 : GROUND_LEVEL - this.height + 32;

        this.frameX = 0;
        this.frameY = 0;
        this.maxFrames = 0;

        this.fps = 25;
        this.frameCounter = 0;
        this.frameInterval = 1000 / this.fps;

        this.gaveDamage = false;
        this.markedAsBeaten = false;
        this.markedAsDeleted = false;
    }

    draw(context) {
        const sx = this.frameX * this.width;
        const sy = this.frameY * this.height;
        const sw = this.width;
        const sh = this.height;

        if (this.markedAsBeaten) {
            this.image = document.getElementById('effectImg');
            this.width = 256;
            this.height = 256;
            //this.frameX = 0;
            this.frameY = this.gaveDamage ? 3 : 0;
            this.maxFrames = 10;

            context.drawImage(
                this.image,
                sx,
                sy,
                sw,
                sh,
                this.x - 35,
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
                this.width,
                this.height
            );
        }
    }

    update(background, deltaTime) {
        if (this.markedAsBeaten) {
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

const getRand = function (startInc, endInc) {
    return Math.trunc(Math.random() * (endInc - startInc)) + startInc;
};
