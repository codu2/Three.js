import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";
import { RectAreaLightUniformsLib } from "../examples/jsm/lights/RectAreaLightUniformsLib.js";
import { RectAreaLightHelper } from "../examples/jsm/helpers/RectAreaLightHelper.js";

class App {
	constructor() {
		const divContainer = document.querySelector("#webgl-container");
		this._divContainer = divContainer;

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.shadowMap.enabled = true; // 그림자맵을 활성화해줌
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

	_setUpControls() {
		new OrbitControls(this._camera, this._divContainer);
	}

	_setUpCamera() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);

		//camera.position.z = 2;
		camera.position.set(7, 7, 0);
		camera.lookAt(0, 0, 0);

		this._camera = camera;
	}

	_setUpLight() {
		// 광원을 밝게 하기 위해 추가
		const auxLight = new THREE.DirectionalLight(0xffffff, 0.5);
		auxLight.position.set(0, 5, 0);
		auxLight.target.position.set(0, 0, 0);
		this._scene.add(auxLight.target);
		this._scene.add(auxLight);

		// DirectionalLight - 태양과 같은 광원으로 태양처럼 빛과 물체 간의 거리에 상관없이 동일한 빛의 효과를 줌
		//const light = new THREE.DirectionalLight(0xffffff, 1);
		//light.position.set(0, 5, 0); // 광원의 위치
		//light.target.position.set(0, 0, 0); // 광원이 비추는 대상의 위치
		// 빛과 물체 간의 거리에 상관없이 동일한 빛의 효과를 주기 때문에 이 빛의 position과 target 속성의 position으로 결정되는 방향만이 의미있음
		//this._scene.add(light.target);
		//light.shadow.camera.top = light.shadow.camera.right = 6;
		//light.shadow.camera.bottom = light.shadow.camera.left = -6;

		// PointLight - 빛이 광원 위치에서 사방으로 퍼져나감
		//const light = new THREE.PointLight(0xffffff, 2);
		//light.position.set(0, 5, 0);
		//light.distance = 0;
		// distance 속성 값으로 지정된 거리까지만 광원의 영향을 받도록 함
		// 기본값은 0으로 무한한 거리까지 광원의 영향을 받도록 함
		// 그림자를 던지는 광원의 위치 변경에 따라서 그림자가 변함 (update 메서드에서 광원이 회전하는 구를 추적하도록 했기 때문)
		// PointLight의 경우 사방으로 빛을 던지므로 그에 맞게 그림자가 적당하게 변하는 것을 볼 수 있음

		// SpotLight - 빛이 광원의 위치에서 깔대기 모양으로 퍼져나감
		const light = new THREE.SpotLight(0xffffff, 1);
		light.position.set(0, 5, 0);
		light.target.position.set(0, 0, 0);
		light.angle = THREE.MathUtils.degToRad(30); // 광원이 만드는 빛 깔대기의 각도
		light.penumbra = 0.2; // 빛의 감쇄율, 기본값은 0으로 빛의 감쇄가 전혀 없다는 것, 0과 1 사이의 값을 가지며 1에 가까울수록 빛이 중심에서 점점 감쇄되는 것을 볼 수 있음
		this._scene.add(light.target);
		// SpotLight의 광원이 비추는 대상의 위치가 회전하는 구를 추적하도록 함 (update 메서드에서)
		// 광원에 변경에 따라 그림자 역시 그에 맞게 적절하게 변하는 것을 볼 수 있음

		// 그림자의 품질을 향상시키고자 함. 그림자는 텍스쳐 맵핑 이미지를 통해 표현됨
		// 기본적으로 이 텍스쳐 맵핑 이미지의 크기는 가로와 세로 모두 512임
		// 이 크기를 더 크게 하면 그림자의 품질이 향상되고 그림자의 경계가 선명해짐
		light.shadow.mapSize.width = light.shadow.mapSize.height = 2048;
		// 상황에 따라 그림자의 경계가 선명하지 않고 블러링 처리가 될 필요가 있음
		// shadow의 radius 값을 통해 설정할 수 있음. 기본값은 1이고 그림자의 외곽을 블러링 처리하는데 사용됨
		// 값이 클수록 블러링 효과가 커짐. 지나치게 값이 크면 그림자가 이상하게 표현되므로 시각적으로 적당한 값을 지정해야 함
		light.shadow.radius = 1;

		// 광원의 그림자를 위한 카메라를 시각화
		const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
		this._scene.add(cameraHelper);
		// 그림자를 지원하는 광원은 모두 shadow라는 속성을 갖고 이 shadow 속성에는 camera 속성이 존재함
		// 이 camera가 그림자에 대한 텍스쳐 이미지를 생성하기 위해서 사용됨
		// DirectionalLight의 그림자를 위한 카메라는 OrthographicCamera로 카메라의 절두체를 벗어나는 객체는 모두 짤려나가게 됨
		// 그림자가 짤리는 이유는 그림자가 절두체를 벗어나기 때문
		// 이를 해결하기 위해 그림자를 위한 카메라의 절두체를 좀 더 크게 해주면 됨

		this._scene.add(light);
		this._light = light;
		// 실제로는 보다 나은 렌더링 결과를 위해 여러 종류의 광원을 2개 이상 사용함
		light.castShadow = true; // 그림자를 줄 것인지에 대한 여부
	}

	_setUpModel() {
		// ground
		const groundGeometry = new THREE.PlaneGeometry(10, 10);
		const groundMaterial = new THREE.MeshStandardMaterial({
			color: "#2c3e50",
			roughness: 0.5,
			metalness: 0.5,
			side: THREE.DoubleSide,
		});
		const ground = new THREE.Mesh(groundGeometry, groundMaterial);
		ground.rotation.x = THREE.MathUtils.degToRad(-90);
		// 그림자를 받아서 그림자를 표현하도록 하기 위해 다음 코드를 추가
		ground.receiveShadow = true;
		this._scene.add(ground);

		// bigSphere
		//const bigSphereGeometry = new THREE.SphereGeometry(1.5, 64, 64, 0, Math.PI);
		const bigSphereGeometry = new THREE.TorusKnotGeometry(
			1,
			0.3,
			128,
			64,
			2,
			3
		);
		const bigSphereMaterial = new THREE.MeshStandardMaterial({
			color: "#ffffff",
			roughness: 0.1,
			metalness: 0.2,
		});
		const bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
		//bigSphere.rotation.x = THREE.MathUtils.degToRad(-90);
		bigSphere.position.y = 1.6;
		// 그림자를 받아서 그림자를 표현하도록 하기 위해 다음 코드를 추가
		bigSphere.receiveShadow = true;
		// bigSphere는 그림자를 주기도 함
		bigSphere.castShadow = true;
		this._scene.add(bigSphere);

		// torusPivot, torus
		const torusGeometry = new THREE.TorusGeometry(0.4, 0.1, 32, 32);
		const torusMaterial = new THREE.MeshStandardMaterial({
			color: "#9b59b6",
			roughness: 0.5,
			metalness: 0.9,
		});
		for (let i = 0; i < 8; i++) {
			const torusPivot = new THREE.Object3D();
			const torus = new THREE.Mesh(torusGeometry, torusMaterial);
			torusPivot.rotation.y = THREE.MathUtils.degToRad(45 * i);
			torus.position.set(3, 0.5, 0);
			torusPivot.add(torus);
			// 그림자를 받아서 그림자를 표현하도록 하기 위해 다음 코드를 추가
			torus.receiveShadow = true;
			// torus는 그림자를 주기도 함
			torus.castShadow = true;
			this._scene.add(torusPivot);
		}

		// smallSpherePivot, smallSphere
		const smallSphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
		const smallSphereMaterial = new THREE.MeshStandardMaterial({
			color: "#e74c3c",
			roughness: 0.2,
			metalness: 0.5,
		});
		const smallSpherePivot = new THREE.Object3D();
		const smallSphere = new THREE.Mesh(
			smallSphereGeometry,
			smallSphereMaterial
		);
		smallSpherePivot.add(smallSphere);
		smallSpherePivot.name = "smallSpherePivot";
		// 이름을 부여해두면 이 객체를 Scene을 통해서 언제든지 조회할 수 있음
		smallSphere.position.set(3, 0.5, 0);
		// 그림자를 받아서 그림자를 표현하도록 하기 위해 다음 코드를 추가
		smallSphere.receiveShadow = true;
		// smallSphere는 그림자를 주기도 함
		smallSphere.castShadow = true;
		this._scene.add(smallSpherePivot);

		// 광원 설정을 안하면 아무것도 표시되지 않음
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

		const smallSpherePivot = this._scene.getObjectByName("smallSpherePivot");
		if (smallSpherePivot) {
			smallSpherePivot.rotation.y = THREE.MathUtils.degToRad(time * 50);
			// Scene을 구성하는 객체 중에서 이름이 "smallSpherePivot"인 객체를 얻고 이 객체가 있다면 smallSpherePivot을 y축으로 회전시킴

			/*
			if (this._light.target) {
				const smallSphere = smallSpherePivot.children[0];
				// 광원에 대한 target 속성이 있을 때 smallSpherePivot의 첫번째 자식(smallSphere)을 얻어옴
				smallSphere.getWorldPosition(this._light.target.position);
				// smallsphere의 world 좌표계의 위치를 구해서 광원의 target 위치에 저장

				if (this._lightHelper) this._lightHelper.update();
				// 광원의 target 속성이 변경되었으므로 이 광원을 시각화해주는 helper도 업데이트 해줌
			}
			*/
			// DirectionalLight 광원의 target의 위치가 회전하는 smallSphere 구의 위치를 추적하도록 함

			/*
			if (this._light instanceof THREE.PointLight) {
				const smallSphere = smallSpherePivot.children[0];
				smallSphere.getWorldPosition(this._light.position);
			}
			*/
			// PointLight 광원의 회전하는 smallSphere 구의 위치를 추적하도록 함

			if (this._light.target) {
				const smallSphere = smallSpherePivot.children[0];
				smallSphere.getWorldPosition(this._light.target.position);

				if (this._lightHelper) this._lightHelper.update();
			}
			// SpotLight 광원의 target의 위치가 회전하는 smallSphere 구의 위치를 추적하도록 함
		}
	}
}

window.onload = function () {
	new App();
};
