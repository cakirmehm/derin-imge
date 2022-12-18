import { FRICTION, GROUND_LEVEL, SCALE } from './Utils.js';

export default class Hammer {
    constructor(gameWidth, gameHeight, player) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.image = document.getElementById('hammerImg');
        // this.image = document.getElementById('appleImg');

        this.width = 128;
        this.height = 128;

        this.x = player.x;
        this.y = player.y;

        this.vx = 20;
        this.vy = -5;

        this.responseFromGround = -10;

        this.weight = 1;
        this.scale = SCALE;

        this.frameX = 0;
        this.frameY = 0;
        this.maxFrames = 0;

        this.fps = 14;
        this.frameTimer = 0;
        this.frameInterval = 1000 / this.fps;

        this.markedAsDeleted = false;
    }

    draw(context) {
        const sx = this.frameX * this.width;
        const sy = this.frameY * this.height;
        const sw = this.width;
        const sh = this.height;

        context.drawImage(
            this.image,
            sx,
            sy,
            sw,
            sh,
            this.x,
            this.y,
            this.width * this.scale,
            this.height * this.scale
        );
    }

    update(deltaTime) {
        if (this.frameTimer + deltaTime > this.frameInterval) {
            this.frameTimer = 0;
        } else {
            this.frameTimer += deltaTime;
        }

        this.x += this.vx;

        if (!this.IsOnGround()) {
            this.vy += this.weight;
        } else {
            this.responseFromGround = Math.max(0, this.responseFromGround + 1);
            this.scale = Math.max(0, this.scale - 0.01);
            this.vy = this.responseFromGround;
        }

        this.y += this.vy;
    }

    isOutOfScreen() {
        return (
            this.x + this.width > this.gameWidth ||
            this.y + this.height > this.gameHeight ||
            this.y < 0 ||
            this.x < 0
        );
    }

    hasCollision(that) {
        return (
            this.x < that.x + that.width * 0.5 &&
            this.x + this.width > that.x &&
            this.y < that.y + that.height * 0.5 &&
            this.height + this.y > that.y
        );
    }

    IsOnGround() {
        // console.log(this.y == this.groundLevel);
        return this.y + this.height * this.scale >= GROUND_LEVEL;
    }
}
