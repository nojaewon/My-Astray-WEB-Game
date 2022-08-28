export default class Helper {
    constructor(){
        this.start = Date.now();
        this.container = document.createElement('div');
        this.container.id = 'interface';

        this.developer = 'noje';
        this.developerContainer = document.createElement('h1');
        this.developerContainer.id = 'dev';
        this.developerContainer.innerText = this.developer;

        this.title = document.createElement('h1');
        this.title.innerHTML = "MY ASTRAY WEB GAME";

        this.levelContainer = document.createElement('h2');
        this.levelContainer.id = 'score';
        this.level = 0;

        this.timeList = document.createElement('ul');

        this.container.appendChild(this.title);
        this.container.appendChild(this.developerContainer);
        this.container.appendChild(this.levelContainer);
        this.container.appendChild(this.timeList);
        this.levelContainer.innerText = this.level;

        

        document.body.appendChild(this.container);
    }

    levelUp(N){
        const li = document.createElement('li');
        li.innerText = `${N-1} X ${N-1} maze - ${Date.now() - this.start}ms`;
        this.timeList.appendChild(li);

        this.levelContainer.innerText = `${++this.level}  <${N}x${N} maze>`;

    }
}