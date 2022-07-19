import * as THREE from "../build/three.module.js";

class App {
	constructor() {
		const divContainer = document.querySelector("#webgl-container");
		this._divContainer = divContainer;

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		// antialias:true 를 활성화 시켜주면 3차원 장면이 렌더링될 때 오브젝트들의 경계선이 계단 현상없이 부드럽게 표현됨
		renderer.setPixelRatio(window.devicePixelRatio);
		divContainer.appendChild(renderer.domElement);
		// renderer.domElement는 canvas 타입의 dom 객체
		this._renderer = renderer;

		const scene = new THREE.Scene();
		this._scene = scene;

		this._setUpCamera();
		this._setUpLight();
		this._setUpModel();

		window.onresize = this.resize.bind(this);
		// window 창 크기가 변경될 때마다 호출되는 메서드
		// renderer나 camera는 창 크기가 변경될 때마다 그 크기에 맞게 속성 값을 재설정 해줘야 함
		this.resize();
		// 창 크기 변경에 상관없이 resize 메서드를 호출해주고 있는데, 이렇게 함으로써 renderer나 camera의 창 크기에 맞게 설정해주게 됨

		requestAnimationFrame(this.render.bind(this));
	}

	_setUpCamera() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		// three.js가 3차원 그래픽을 출력할 영역에 대한 가로와 세로에 대한 크기
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
		camera.position.z = 2;
		this._camera = camera;
	}

	_setUpLight() {
		const color = 0xffffff; // 광원의 색상
		const intensity = 1; // 광원의 세기 값
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-1, 2, 4); // 광원의 위치 조절
		this._scene.add(light); // 광원을 scene 객체의 구성 요소로 추가
	}

	_setUpModel() {
		const geometry = new THREE.BoxGeometry(1, 1, 1); // 가로, 세로, 깊이
		const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });

		const cube = new THREE.Mesh(geometry, material);

		this._scene.add(cube);
		this._cube = cube;
	}

	resize() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;

		this._camera.aspect = width / height;
		this._camera.updateProjectionMatrix();
		// camera의 속성값 설정

		this._renderer.setSize(width, height);
		// renderer의 크기 설정
	}

	render(time) {
		// time은 렌더링이 처음 시작된 이후 경과된 시간값으로 단위는 밀리초
		// time 인자를 scene의 애니메이션에 이용할 수 있음
		this._renderer.render(this._scene, this._camera);
		// 위 코드는 renderer가 scene을 camera의 시점으로 렌더링하라는 코드
		this.update(time);
		// update() 메서드에서 time을 인자로 받고 어떤 속성값을 변경하는데, 이 속성값을 변경함으로써 애니메이션 효과를 발생시킴
		requestAnimationFrame(this.render.bind(this));
		// 이 코드를 통해 render() 메서드가 반복 호출되도록 함
		// 무조건적으로 호출되는 것이 아니라 적당한 시점에 최대한 빠르게 호출해줌
		// time 값은 requestAnimationFrame 함수가 render 함수에 전달해 주는 값임
	}

	update(time) {
		time *= 0.001; // time에 0.001을 곱해줌으로써 밀리초를 초로 변경해줌
		this._cube.rotation.x = time;
		this._cube.rotation.y = time;
		// cube의 x,y축 회전값에 time값을 지정함
		// 시간은 계속 변하므로 x,y축으로 cube가 계속 회전하게 됨
	}
}

window.onload = function () {
	new App();
};
