const UP=0, DOWN=1, LEFT=2, RIGHT=3;

function putRandomlyDirection(){
    const direct = new Array(4);

    for(let i=0; i<4; i++){
        direct[i] = Math.floor(Math.random()*4);

        for(let j=0; j<i; j++){
            if(direct[i] === direct[j]){
                i--;
            }
        }
    }

    return direct;
}

export default class MazeCreater{
    constructor(width, height){
        this.width = width;
        this.height = height;

        this.cells = [];
        this.maze = [];

        this.init();
        this.getMazeRandomly(0, 0);
        this.log();
    }
    
    init(){
        for(let i=0; i<this.height; i++){
            this.cells.push(new Array(this.width));
        }

        for(let i=0; i<2*this.height+1; i++){
            this.maze.push(new Array(2*this.width+1));
        }

        for(let i=0; i < this.height; i++){
            for(let j=0; j<this.width; j++){
                this.cells[i][j] = 0;
            }
        }

        for(let i=0; i<2*this.height+1; i++){
            for(let j=0; j<2*this.width+1; j++){
                if(i%2 === 0){
                    this.maze[i][j] = '0';
                } else {
                    if(j%2 === 0){
                        this.maze[i][j] = '0';
                    } else {
                        this.maze[i][j] = ' ';
                    }
                }
            }
            this.maze[i][2*this.width+1] = '\n';
        }
    }

    log(){
        for(let i=0; i<this.maze.length; i++){
            console.log(...this.maze[i]);
        }
    }

    getMazeRandomly(i, j){
        const direct = putRandomlyDirection();
        this.cells[i][j] = 1;
        direct.forEach(function(d){
            if(d === UP){
                if( i!= 0 && this.cells[i-1][j] === 0){
                    this.maze[i*2][j*2+1] = ' ';
                    this.getMazeRandomly(i-1, j);
                }
            } else if(d === DOWN){
                if(i != this.height-1 && this.cells[i+1][j] === 0){
                    this.maze[i*2+2][j*2+1] = ' ';
                    this.getMazeRandomly(i+1, j);
                }
            } else if(d === LEFT){
                if(j != 0 && this.cells[i][j-1] === 0){
                    this.maze[i*2+1][j*2] = ' ';
                    this.getMazeRandomly(i, j-1);
                }
            } else if(d === RIGHT){
                if(j != this.width-1 && this.cells[i][j+1] === 0){
                    this.maze[i*2+1][j*2+2] = ' ';
                    this.getMazeRandomly(i, j+1);
                }
            }
        }.bind(this));
    }
}
