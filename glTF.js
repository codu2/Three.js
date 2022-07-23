import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "../examples/jsm/loaders/GLTFLoader.js";

// 3차원 모델 데이터 포맷 중에서 가장 많이 사용하는 glTF 파일을 Three.js에서 사용하기
// Scene에 추가된 모델을 화면에 적당한 위치와 크기로 볼 수 있도록 자동으로 설정해주기
// glTF 파일을 로드할 수 있는 클래스인 GLTFLoader

class App {
	constructor() {
		const divContainer = document.querySelector("#webgl-container");
		this._divContainer = divContainer;

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		divContainer.appendChild(renderer.domElement);

		this._renderer = renderer;

		const scene = new THREE.Scene();
		this._scene = scene;

		this._setUpCamera();
		this._setUpLight();
		this._setUpModel();
		this._setUpControls();

		window.onresize = this.resize.bind(this);
		this.resize();

		requestAnimationFrame(this.render.bind(this));
	}

	_zoomFit(object3D, camera) {
		// 다양한 모델에 대해서 카메라가 적당한 위치에 있도록 하려면
		// 3차원 모델을 화면에 꽉 채우기 위한 적당한 거리 = 모델 크기의 절반 / tan(카메라 fov의 절반)
		// 화면에 가득 채워 표시할 object3D 객체와 카메라 객체를 인자로 받음
		// object3D -> gltf 파일로부터 로딩할 3차원 모델

		// 3차원 모델의 경계 박스
		const box = new THREE.Box3().setFromObject(object3D);

		// 모델의 경계 박스 대각선 길이
		const sizeBox = box.getSize(new THREE.Vector3()).length();

		// 대각선 길이를 모델 크기의 값으로 사용

		// 모델의 경계 박스의 중심 위치
		const centerBox = box.getCenter(new THREE.Vector3());

		// 모델 크기의 절반 값
		const halfSizeBox = sizeBox * 0.5;

		// 카메라의 fov의 절반 값
		const halfFov = THREE.MathUtils.degToRad(camera.fov * 0.5);

		// 모델을 화면에 꽉 채우기 위한 적당한 거리
		const distance = halfSizeBox / Math.tan(halfFov);

		// 앞서 구한 값들을 카메라의 설정값으로 지정해야 함
		// camera의 위치를 얻기 위해서 모델 중심에서 카메라 위치로 향하는 방향 단위 벡터 계산
		const direction = new THREE.Vector3()
			.subVectors(camera.position, centerBox)
			.normalize();

		// distance와 direction을 이용해 카메라의 위치를 설정
		const position = direction.multiplyScalar(distance).add(centerBox);
		camera.position.copy(position);

		// 모델의 크기에 따라 카메라의 near와 far값도 조절해줘야 함
		// 그래야 3차원 모델이 카메라의 절두체 안에 놓이게 됨
		camera.near = sizeBox / 100;
		camera.far = sizeBox * 100;

		// 카메라의 기본 속성이 변경되었으므로 투영행렬 업데이트
		camera.updateProjectionMatrix();

		// 카메라가 모델의 중심을 바라보도록 함
		camera.lookAt(centerBox.x, centerBox.y, centerBox.z);
	}
	// _zoomFit 메서드를 3차원 모델의 로딩이 완료되는 시점에 호출

	_setUpControls() {
		new OrbitControls(this._camera, this._divContainer);
	}

	_setUpCamera() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
		camera.position.z = 4;
		// 이 카메라 위치는 해당 모델에 대해서만 적당한 위치임
		this._camera = camera;

		this._scene.add(this._camera);
	}

	_setUpLight() {
		const color = 0xffffff;
		const intensity = 1;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-1, 2, 4);
		//this._scene.add(light);
		this._camera.add(light);
		// 광원이 장면의 한 위치에 고정되어 있는 것이 아닌 카메라를 따라가도록 하기 위해
	}

	_setUpModel() {
		const gltfLoader = new GLTFLoader();
		//const url = "data/adamhead/adamhead.gltf";
		const url = "data/microphone/scene.gltf";
		gltfLoader.load(url, (gltf) => {
			// gltf 파일 로드가 완료되면
			// gltf 인자의 scene 속성을 장면에 추가하면 됨
			const root = gltf.scene;
			this._scene.add(root);
			this._zoomFit(root, this._camera);
		});
		// gltf 객체를 통해 파일을 로드
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
		this.update(time);
		requestAnimationFrame(this.render.bind(this));
	}

	update(time) {
		time *= 0.001;
		//this._cube.rotation.x = time;
		//this._cube.rotation.y = time;
	}
}

window.onload = function () {
	new App();
};
