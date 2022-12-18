import Player from './player.js';

export const states = {
    WALKING_RIGHT: 0,
    JUMPING_RIGHT: 1,
    FALLING_RIGHT: 2,
    ATTACKING_RIGHT: 3,
};

class State {
    constructor(state) {
        this.state = state;
    }
}

/// --------------------WALKING----------------------
export class WalkingRight extends State {
    constructor(player) {
        super('WALKING RIGHT');
        this.player = player;
    }

    enter() {
        this.player.frameX = 0;
        this.player.frameY = 0;
        this.player.maxFrames = 4;
        this.player.frameTimer = 0;
        this.player.vx = Math.min(
            this.player.maxvx,
            Math.max(this.player.vx, 5)
        );
    }

    handleInput(input) {
        if (input.lastKey === 'PRESS up') {
            this.player.setState(states.JUMPING_RIGHT);
        } else if (input.lastKey === 'PRESS space') {
            this.player.setState(states.ATTACKING_RIGHT);
        }
    }
}

/// -------------------JUMPING -----------------------
export class JumpingRight extends State {
    constructor(player) {
        super('JUMPING RIGHT');
        this.player = player;
        this.sound = document.getElementById('jumpAudio');
    }

    enter() {
        this.sound.play();
        this.player.frameX = 0;
        this.player.frameY = 2;
        this.player.maxFrames = 1;
        if (this.player.IsOnGround()) {
            this.player.vy = -20;
        }

        this.player.vx = Math.min(
            this.player.maxvx,
            Math.max(this.player.vx, 10)
        );
    }

    handleInput(input) {
        if (input.lastKey === 'PRESS space') {
            this.player.setState(states.ATTACKING_RIGHT);
        }

        if (this.player.vy > 0) {
            this.player.setState(states.FALLING_RIGHT);
        }
    }
}

/// -------------------FALLING -----------------------
export class FallingRight extends State {
    constructor(player) {
        super('FALLING RIGHT');
        this.player = player;
    }

    enter() {
        this.player.frameX = 0;
        this.player.frameY = 1;
        this.player.maxFrames = 1;

        // if (this.player.IsOnGround()) this.player.vy = -15;
    }

    handleInput(input) {
        if (this.player.IsOnGround()) {
            this.player.setState(states.WALKING_RIGHT);
        }
    }
}

/// -------------------ATTACKING -----------------------
export class AttackingRight extends State {
    constructor(player) {
        super('ATTACKING RIGHT');
        this.player = player;
    }

    enter() {
        this.player.frameX = 0;
        this.player.frameY = 3;
        this.player.maxFrames = 2;

        // if (this.player.IsOnGround()) this.player.vy = -15;
    }

    handleInput(input) {
        if (input.lastKey === 'RELEASE space') {
            if (this.player.previousStateName === 'WALKING RIGHT')
                this.player.setState(states.WALKING_RIGHT);
            else if (this.player.previousStateName === 'JUMPING RIGHT')
                this.player.setState(states.JUMPING_RIGHT);
            else if (this.player.IsOnGround())
                this.player.setState(states.WALKING_RIGHT);
        }

        if (this.player.vy > 0) {
            this.player.setState(states.FALLING_RIGHT);
        }
    }
}
