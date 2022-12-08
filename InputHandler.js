export default class InputHandler {
    constructor() {
        this.lastKey = '';

        this.touchX = '';
        this.touchY = '';
        this.threshold = 30;

        window.addEventListener('keydown', e => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.lastKey = 'PRESS left';
                    break;

                case 'ArrowRight':
                    this.lastKey = 'PRESS right';
                    break;

                case 'ArrowDown':
                    this.lastKey = 'PRESS down';
                    break;

                case 'ArrowUp':
                    this.lastKey = 'PRESS up';
                    break;

                case 'Control':
                    this.lastKey = 'PRESS control';
                    break;

                case ' ':
                    this.lastKey = 'PRESS space';
                    break;
            }
        });

        window.addEventListener('keyup', e => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.lastKey = 'RELEASE left';
                    break;

                case 'ArrowRight':
                    this.lastKey = 'RELEASE right';
                    break;

                case 'ArrowDown':
                    this.lastKey = 'RELEASE down';
                    break;

                case 'ArrowUp':
                    this.lastKey = 'RELEASE up';
                    break;

                case 'Control':
                    this.lastKey = 'RELEASE control';
                    break;

                case ' ':
                    this.lastKey = 'RELEASE space';
                    break;
            }
        });

        window.addEventListener('touchstart', e => {
            this.touchX = e.changedTouches[0].pageX;
            this.touchY = e.changedTouches[0].pageY;
            this.lastKey = 'PRESS up';
        });

        window.addEventListener('touchmove', e => {
            const swipeChangeX = e.changedTouches[0].pageX - this.touchX;
            const swipeChangeY = e.changedTouches[0].pageY - this.touchY;

            if (swipeChangeY < -this.threshold) this.lastKey = 'PRESS up';

            if (Math.abs(swipeChangeX) > this.threshold)
                this.lastKey = 'PRESS space';
            else this.lastKey = 'RELEASE space';
            // else this.lastKey = 'PRESS space';
        });

        window.addEventListener('touchend', e => {
            this.lastKey = 'RELEASE space';
        });
    }
}
