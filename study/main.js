import * as THREE from 'three';
import Handelr from './Handler.js';
import MazeCreater from './MazeCreater.js';

let N = 3;

class App {
    constructor(eventHandler){
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
        camera.up.set(0, 0, 5);
        camera.lookAt(0, 0, 0);
        this._camera = camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity = 1;
        const bigLight = new THREE.DirectionalLight(color, 1);
        bigLight.position.set(0, 0, 4);
        bigLight.lookAt(0, 0, 1);

        const light = new THREE.PointLight(color, 0.5);

        this._light = light;

        this._scene.add(bigLight);
        this._scene.add(light);
    }

    _setupModel() {
        const texture = new THREE.TextureLoader().load('./ball.jpg');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);
        const wallMaterial = new THREE.MeshBasicMaterial({
            map: texture
        });

        // 미로의 바닥면을 만드는 플레인 지오메트리
        const plane = new THREE.PlaneGeometry(1000, 1000);
        const planeMaterial = new THREE.MeshPhongMaterial({color: 0x000000});
        const planeObj = new THREE.Mesh(plane, planeMaterial);
        planeObj.position.set(0, 0, 1);
        this._scene.add(planeObj);

        // 구체 지오메트리 생성 부분
        this._ballRadius = 0.3;
        const sphereGeometry = new THREE.SphereGeometry(this._ballRadius);
        const sphereMaterial = new THREE.MeshPhongMaterial({color: 0x44a88,});

        
        const ball = new THREE.Mesh(sphereGeometry, wallMaterial);
        ball.position.set(1, 1, 1);

        this._scene.add(ball);
        this._ball = ball;
        
        this._setupMaze();
    }

    _setupMaze(){
        const texture = new THREE.TextureLoader().load('./wall_texture.jpg');
        const wallMaterial = new THREE.MeshLambertMaterial({
            map: texture
        });

        // 미로의 벽면을 생성하는 박스 지오메트리를 그룹화
        const mz = new MazeCreater(N, N);
        this.mazeBlocks = mz.maze;
        this._wallWidth = 1;
        const geometry = new THREE.BoxGeometry(this._wallWidth, this._wallWidth, this._wallWidth);
        const mazeWall = new THREE.Group();
        this.mazeBlocks.forEach((boxList, y)=>{
            boxList.forEach((box, x)=>{
                if(box === "0"){
                    let newBox = new THREE.Mesh(geometry, wallMaterial);
                    newBox.position.set(x, y, 1);
                    mazeWall.add(newBox);
                }
            })
        })

        this._scene.add(mazeWall);
        this._walls = mazeWall;

        // 목적지 구체 생성
        const targetSphereGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        const targetMaterial = new THREE.MeshLambertMaterial({
            color: 0xffff55,
        });
        const target = new THREE.Mesh(targetSphereGeometry, targetMaterial);

        target.position.set(2*N-1, 2*N-1, 1);

        this._target = target;
        this._scene.add(target);
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
        this._light.position.set(this._ball.position.x, this._ball.position.y, 1);
        
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

        if(x == 2*N-1 && y == 2*N-1){
            this._ball.position.set(1, 1, 1);
            this._scene.remove(this._walls);
            this._scene.remove(this._target);
            N++;
            this._setupMaze();
        }

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