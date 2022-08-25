# My-Astray-WEB-Game
Three.js를 공부하기 위한 간단한 토이 프로젝트입니다.

### 벤치마킹한 오픈 프로젝트 => [Astray](https://wwwtyro.github.io/Astray/)

### **게임의 방향성**
1. 구체와 미로가 존재
2. 구체는 키보드로 컨트롤 할 수 있음.
3. 구체를 조작하여 미로 (1, 1) 지점에서 (n-1, n-1) 지점으로 이동
4. n 단계는 존재, 계속 올라감
5. 미로는 N x N의 랜덤 생성

### N X N의 랜덤한 미로 생성 알고리즘
dfs를 사용한 간단한 벽 뚫기 알고리즘을 사용했습니다.