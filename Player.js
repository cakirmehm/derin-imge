import Hammer from './Hammer.js';
import {
    AttackingRight,
    FallingRight,
    JumpingRight,
    WalkingRight,
} from './State.js';
import { GROUND_LEVEL, SCALE, SOUND_ON } from './Utils.js';

export default class Player {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.image = document.getElementById('playerImg');
        this.dustEffect = document.getElementById('effectImg');

        this.maxvx = 40;
        this.vx = 10;
        this.vy = 0;

        this.width = 250;
        this.height = 400;
        this.weight = 0.5;

        this.x = 120;
        this.y = GROUND_LEVEL - this.height * SCALE;

        this.frameX = 0;
        this.frameY = 0;
        this.maxFrames = 4;

        this.frameXDust = 0;
        this.frameYDust = 1;
        this.maxFramesDust = 9;

        this.maxHammerAtOnce = 1;
        this.hammers = [];

        this.apples = 0;
        this.energy = 20;
        this.runInMeters = 0;

        this.fps = 8;
        this.frameInterval = 1000 / this.fps;
        this.frameCounter = 0;

        this.states = [
            new WalkingRight(this),
            new JumpingRight(this),
            new FallingRight(this),
            new AttackingRight(this),
        ];

        this.previousStateName = undefined;
        this.currentState = this.states[0];

        this.displayDust = false;
        this.isOutOfEnergy = false;
    }

    draw(context) {
        if (this.displayDust) {
            context.drawImage(
                this.dustEffect,
                256 * this.frameXDust,
                256 * this.frameYDust,
                256,
                256,
                this.x - 100,
                GROUND_LEVEL - 256,
                256,
                256
            );
        }

        context.drawImage(
            this.image,
            this.width * this.frameX,
            this.height * this.frameY,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width * SCALE,
            this.height * SCALE
        );

        this.hammers.forEach(h => {
            h.draw(context);
        });
    }

    getBottom() {
        return this.y + this.height * SCALE;
    }

    IsOnGround() {
        // console.log(this.y == this.groundLevel);
        return this.getBottom() == GROUND_LEVEL;
    }

    update(input, deltaTime) {
        // console.log(this);
        if (this.frameCounter + deltaTime > this.frameInterval) {
            if (this.displayDust) {
                if (this.frameXDust < this.maxFramesDust - 1) {
                    this.frameXDust++;
                } else {
                    this.frameXDust = 0;
                    this.displayDust = false;
                }
            }

            if (this.frameX < this.maxFrames - 1) {
                this.frameX++;
            } else {
                this.frameX = 0;
            }

            this.runInMeters += this.vx * 0.02;

            this.vx = Math.min(
                this.maxvx,
                10 + Math.floor(this.runInMeters / 60)
            );

            this.frameCounter = 0;
        } else {
            this.frameCounter += deltaTime;
        }

        // handle current state according to the input
        this.currentState.handleInput(input);

        // handle x position
        // this.x += this.vx;
        if (this.x < 0) this.x = 0;
        else if (this.x + this.width > this.gameWidth)
            this.x = this.gameWidth - this.width;

        // handle y
        this.y += this.vy;
        if (!this.IsOnGround()) this.vy += this.weight;
        else {
            this.vy = 0;
            if (this.currentState.state === 'FALLING RIGHT') {
                if (!this.displayDust) {
                    this.frameXDust = 0;
                    this.frameYDust = 1;
                    this.maxFramesDust = 9;
                    this.displayDust = true;
                }
            }
        }

        if (this.currentState.state === 'ATTACKING RIGHT') {
            if (this.frameCounter + deltaTime > this.frameInterval) {
                const hm = new Hammer(this.gameWidth, this.gameHeight, this);

                if (this.hammers.length < this.maxHammerAtOnce) {
                    this.hammers.push(hm);
                    this.playSoundForThrowingHammer();
                }
            }
        }

        this.hammers.forEach(h => {
            h.update(deltaTime);

            if (h.isOutOfScreen()) {
                h.markedAsDeleted = true;
            }
        });

        this.hammers = this.hammers.filter(h => !h.markedAsDeleted);

        this.isOutOfEnergy = this.energy < 0;
    }

    setState(state) {
        try {
            this.previousStateName = this.currentState.state;
            this.currentState = this.states[state];
            this.currentState.enter();
        } catch (error) {
            console.log(error);
        }
    }

    hasCollision(that) {
        return (
            this.x < that.x + that.width &&
            this.x + this.width > that.x &&
            this.y < that.y + that.height &&
            this.height + this.y > that.y
        );
    }

    playSoundForThrowingHammer() {
        if (SOUND_ON) {
            new Audio('./sounds/Fire Ball.wav').play();
        }
    }
}
