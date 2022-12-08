export default class Background {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.level = 1;

        this.vx = 5;

        this.maxSpeed = 40;

        this.image = document.getElementById(`backgroundImg`);

        this.repeatX = 10;
        this.width = 2048;
        this.height = 1000;

        this.x = 0;
        this.y = 0;

        this.isVictory = false;
        this.isGameOver = false;
    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);

        context.drawImage(
            this.image,
            this.x + this.width - this.vx,
            this.y,
            this.width,
            this.height
        );
    }

    emptyDraw(context) {
        context.fillStyle = 'black';
        context.fillRect(this.width / 3.5, this.y, this.width, this.height);
    }

    update(player) {
        this.vx = player.vx;
        this.x -= this.vx;
        if (this.x < 0 - this.width) this.x = 0;
    }
}
