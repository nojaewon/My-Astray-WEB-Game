export default class Handelr {
    constructor(){
        this.keyArrow = {
            up: false,
            down: false,
            left: false,
            right: false,
        }

        window.addEventListener('keydown', this.keyDownHandler.bind(this));
        window.addEventListener('keyup', this.keyUpHandler.bind(this));
    }

    keyDownHandler(e) {
        if(e.key === 'ArrowUp'){
            this.keyArrow.up = true;
        } else if(e.key === 'ArrowDown') {
            this.keyArrow.down = true;
        } else if(e.key === 'ArrowLeft') {
            this.keyArrow.left = true;
        } else if(e.key === 'ArrowRight') {
            this.keyArrow.right = true;
        }
    }

    keyUpHandler(e) {
        if(e.key === 'ArrowUp'){
            this.keyArrow.up = false;
        } else if(e.key === 'ArrowDown') {
            this.keyArrow.down = false;
        } else if(e.key === 'ArrowLeft') {
            this.keyArrow.left = false;
        } else if(e.key === 'ArrowRight') {
            this.keyArrow.right = false;
        }
    }
}