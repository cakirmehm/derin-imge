export default class Hammer {
    constructor(gameWidth, gameHeight, player) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.image = document.getElementById('hammerImg');

        this.groundLevel = 120;
        this.x = player.x;
        this.y = player.y;

        this.width = 128;
        this.height = 128;

        this.vx = 20;
        this.vy = -5;

        this.weight = 1;

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
            this.width,
            this.height
        );
    }

    update(player, deltaTime) {
        if (this.frameTimer + deltaTime > this.frameInterval) {
            this.frameTimer = 0;
        } else {
            this.frameTimer += deltaTime;
        }

        this.x += this.vx;

        this.y += this.vy;
        if (!this.IsOnGround()) {
            this.vy += this.weight;
        } else this.vy = 0;
    }

    isOutOfScreen() {
        return (
            this.x + this.width < 0 || this.y + this.height > this.gameHeight
        );
    }

    hasCollision(that) {
        return (
            this.x < that.x + that.width * 0.8 &&
            this.x + this.width > that.x &&
            this.y < that.y + that.height * 0.8 &&
            this.height + this.y > that.y
        );
    }

    IsOnGround() {
        // console.log(this.y == this.groundLevel);
        return this.y === this.groundLevel;
    }
}
