import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "../examples/jsm/loaders/FBXLoader.js";

// 3차원 모델 데이터 포맷 중 FBX 파일을 Three.js에서 사용하기
// FBX는 매우 다양한 3차원 모델의 툴에서 사용할 수 있는 파일이고 모델에 대한 애니메이션을 담을 수도 있음
// FBX 파일을 로드할 수 있는 클래스 FBXLoader

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
		scene.background = new THREE.Color(0xe2dcc8);

		this._setUpCamera();
		this._setUpLight();
		this._setUpModel();
		this._setUpControls();

		window.onresize = this.resize.bind(this);
		this.resize();

		requestAnimationFrame(this.render.bind(this));
	}

	_zoomFit(object3D, camera, viewMode, bFront) {
		const box = new THREE.Box3().setFromObject(object3D);
		const sizeBox = box.getSize(new THREE.Vector3()).length();
		const centerBox = box.getCenter(new THREE.Vector3());

		let offsetX = 0,
			offsetY = 0,
			offsetZ = 0;
		viewMode === "X"
			? (offsetX = 1)
			: viewMode === "Y"
			? (offsetY = 1)
			: (offsetZ = 1);

		if (!bFront) {
			offsetX *= 1;
			offsetY *= -1;
			offsetZ *= -1;
		}

		camera.position.set(
			centerBox.x + offsetX,
			centerBox.y + offsetY,
			centerBox.z + offsetZ
		);

		const halfSizeModel = sizeBox * 0.5;
		const halfFov = THREE.MathUtils.degToRad(camera.fov * 0.5);
		const distance = halfSizeModel / Math.tan(halfFov);
		const direction = new THREE.Vector3()
			.subVectors(camera.position, centerBox)
			.normalize();
		const position = direction.multiplyScalar(distance).add(centerBox);

		camera.position.copy(position);
		camera.near = sizeBox / 100;
		camera.far = sizeBox * 100;

		camera.updateProjectionMatrix();

		camera.lookAt(centerBox.x, centerBox.y, centerBox.z);
		// 위처럼 camera가 바라보는 위치를 모델의 중심으로 변경해주어도
		// OrbitControls 객체가 카메라가 바라보는 지점을 원점으로 변경해버림
		// 따라서 마우스로 모델을 회전시킬 때 중심이 예시 모델의 신발 쪽으로 이동해버림
		// 이를 해결하기 위해서는 OrbitControls도 카메라와 동일한 지점을 바라보도록 해줘야 함
		this._controls.target.set(centerBox.x, centerBox.y, centerBox.z);
		// 위와 같이 OrbitControls의 target을 지정해주면 마우스로 회전할 때 3차원 모델 중심으로 회전하게 됨
	}

	_setUpControls() {
		this._controls = new OrbitControls(this._camera, this._divContainer);
	}

	_setUpCamera() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
		camera.position.z = 4;
		this._camera = camera;

		this._scene.add(camera);
	}

	_setUpLight() {
		const color = 0xffffff;
		const intensity = 2;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-1, 2, 4);
		//this._scene.add(light);
		this._camera.add(light);
	}

	_setUpModel() {
		// 애니메이션은 경과된 시간이라는 것이 필요함
		this._clock = new THREE.Clock();

		const loader = new FBXLoader();
		loader.load("data/Standing Greeting.fbx", (object) => {
			// 3차원 모델의 애니메이션에 접근하기 위해서는 AnimationMixer 객체가 필요
			this._mixer = new THREE.AnimationMixer(object);

			// 그리고 object 객체의 clipAction에 접근해야 함
			const action = this._mixer.clipAction(object.animations[0]);
			// 첫번째 애니메이션에 접근

			// 애니메이션 재생
			action.play();

			this._scene.add(object);
			this._zoomFit(object, this._camera, "Z", true);
			// "Z": 앞쪽에서 true: 모델을 바라보게 하라는 의미
		});
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

		const delta = this._clock.getDelta();
		// getDelta 메서드가 호출된 시점부터 다시 호출되기까지 경과된 시간 값(단위: 초)
		if (this._mixer) this._mixer.update(delta);
	}
}

window.onload = function () {
	new App();
};
