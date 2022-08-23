import * as THREE from 'three';
import Handelr from './Handler.js';

import MazeCreater from './MazeCreater.js';

class App {
    constructor(eventHandler){
        const mz = new MazeCreater(5, 5);
        this.temp = mz.maze;

        this.speed = 0.05;
        this._handler = eventHandler;

        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;
        this._setupCamera();
        this._setupLight();
        this._setupModel();

        window.onresize = this.resize.bind(this);
        this.resize();
        requestAnimationFrame(this.render.bind(this));
    }

    _setupCamera() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        const camera = new THREE.PerspectiveCamera(
            80,
            width / height,
            0.1,
            1000
        );
        this._camera = camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 4, 4);
        this._scene.add(light);
    }

    _setupModel() {
        // 미로의 바닥면을 만드는 플레인 지오메트리
        const plane = new THREE.PlaneGeometry(1000, 1000);
        const planeMaterial = new THREE.MeshPhongMaterial({color: 0x00ffff});
        const planeObj = new THREE.Mesh(plane, planeMaterial);

        // 미로의 벽면을 생성하는 박스 지오메트리를 그룹화
        this._wallWidth = 1;
        const geometry = new THREE.BoxGeometry(this._wallWidth, this._wallWidth, this._wallWidth);
        const material = new THREE.MeshPhongMaterial({color: 0x44a88});
        const mazeWall = new THREE.Group();
        this.temp.forEach((boxList, y)=>{
            boxList.forEach((box, x)=>{
                if(box === "0"){
                    let newBox = new THREE.Mesh(geometry, material);
                    newBox.position.set(x, y, 1);
                    mazeWall.add(newBox);
                }
                
            })
        })

        mazeWall.add(planeObj)
        this._scene.add(mazeWall);
        this._walls = mazeWall;

        // 구체 지오메트리 생성 부분
        this._ballRadius = 0.3;
        const sphereGeometry = new THREE.SphereGeometry(this._ballRadius);
        const sphereMaterial = new THREE.MeshPhongMaterial({color: 0x44a88});
        const cube = new THREE.Mesh(sphereGeometry, sphereMaterial);


        const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
        const line = new THREE.LineSegments(
            new THREE.WireframeGeometry(sphereGeometry),
            lineMaterial
        );

        const ball = new THREE.Group();
        ball.position.set(1, 1, 1);
        ball.add(cube);
        ball.add(line);

        this._scene.add(ball);
        this._ball = ball;

    }


    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }

    render(time) {
        this._renderer.render(this._scene, this._camera);
        this.update();
        requestAnimationFrame(this.render.bind(this));
    }

    update() {
        // 구체 이동 컨트롤
        this.ballControlls();

        // 카메라를 구체 좌표에 고정
        this._camera.position.set(this._ball.position.x, this._ball.position.y, 5);
    }

    ballControlls(){
        const collision = this.ballCollision();

        if(this._handler.keyArrow.up && !collision.up){
            this._ball.position.y += this.speed;
            this._ball.rotation.x += this.speed;
        }

        if(this._handler.keyArrow.down && !collision.down){
            this._ball.position.y -= this.speed;
            this._ball.rotation.x -= this.speed;
        }

        if(this._handler.keyArrow.left && !collision.left){
            this._ball.position.x -= this.speed;
            this._ball.rotation.y -= this.speed;
        }

        if(this._handler.keyArrow.right && !collision.right){
            this._ball.position.x += this.speed;
            this._ball.rotation.y += this.speed;
        }
    }

    ballCollision(){
        const collision = {
            up: false,
            down: false,
            left: false,
            right: false
        }

        const ball4Direction = {
            up : Math.round(this._ball.position.y + this._ballRadius),
            down : Math.round(this._ball.position.y - this._ballRadius),
            left : Math.round(this._ball.position.x - this._ballRadius),
            right : Math.round(this._ball.position.x + this._ballRadius)
        }

        const [x, y] = [Math.round(this._ball.position.x), Math.round(this._ball.position.y)];

        // 공이 안정된 길 경로 위에 있는 지 검사
        for(let wall of this._walls.children){
            if(wall.position.x == x && wall.position.y == y-1){ // down
                if(ball4Direction.down == wall.position.y){
                    collision.down = true;
                }
            } else if(wall.position.x == x-1 && wall.position.y == y){ // left
                if(ball4Direction.left == wall.position.x){
                    collision.left = true;
                }
            } else if(wall.position.x == x+1 && wall.position.y == y){ // right
                if(ball4Direction.right == wall.position.x){
                    collision.right = true;
                }
            } else if(wall.position.x == x && wall.position.y == y+1){ // up
                if(ball4Direction.up == wall.position.y){
                    collision.up = true;
                }
            }
        }
        return collision;
    }
}


window.onload = ()=>{
    new App(
        new Handelr()
    );
}