const WIDTH = 5;
const HEIGHT = 5;
const UP=0, DOWN=1, LEFT=2, RIGHT=3;

const CELLS = [];
const MAZE = [];

for(let i=0; i<HEIGHT; i++){
    CELLS.push(new Array(WIDTH));
}

for(let i=0; i<2*HEIGHT+1; i++){
    MAZE.push(new Array(2*WIDTH+1));
}

for(let i=0; i < HEIGHT; i++){
    for(let j=0; j<WIDTH; j++){
        CELLS[i][j] = 0;
    }
}

for(let i=0; i<2*WIDTH+1; i++){
    for(let j=0; j<2*WIDTH+1; j++){
        if(i%2 === 0){
            MAZE[i][j] = '0';
        } else {
            if(j%2 === 0){
                MAZE[i][j] = '0';
            } else {
                MAZE[i][j] = ' ';
            }
        }
    }
    MAZE[i][2*WIDTH+1] = '\n';
}

function show(arr){
    for(let i=0; i<arr.length; i++){
        console.log(...arr[i]);
    }
}


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

function getRandomlyMaze_by_dfs(i, j){
    const direct = putRandomlyDirection();
    CELLS[i][j] = 1;
    direct.forEach(d => {
        if(d === UP){
            if( i!= 0 && CELLS[i-1][j] === 0){
                MAZE[i*2][j*2+1] = ' ';
                getRandomlyMaze_by_dfs(i-1, j);
            }
        } else if(d === DOWN){
            if(i != HEIGHT-1 && CELLS[i+1][j] === 0){
                MAZE[i*2+2][j*2+1] = ' ';
                getRandomlyMaze_by_dfs(i+1, j);
            }
        } else if(d === LEFT){
            if(j != 0 && CELLS[i][j-1] === 0){
                MAZE[i*2+1][j*2] = ' ';
                getRandomlyMaze_by_dfs(i, j-1);
            }
        } else if(d === RIGHT){
            if(j != WIDTH-1 && CELLS[i][j+1] === 0){
                MAZE[i*2+1][j*2+2] = ' ';
                getRandomlyMaze_by_dfs(i, j+1);
            }
        }
    });
}


getRandomlyMaze_by_dfs(0, 0);
show(MAZE);
show(CELLS);