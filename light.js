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
		// AmbientLight - 생성자에 빛의 색상과 세기값(광원의 밝기 조절)을 인자로 받음
		//const light = new THREE.AmbientLight(0xffffff, 5);
		// 객체의 재질에 대한 색상과 광원의 색상이 섞여서 렌더링됨
		// 주변광 또는 환경광이라고 불리는데, 단순히 Scene에 존재하는 모든 물체에 대해서 단일 색상으로 렌더링되도록 함
		// 대부분의 경우 세기값을 매우 약하게 지정해서 장면에 추가되는데, 광원의 영향을 받지 못하는 물체도 살짝 보여지도록 하는데 사용됨

		// HemisphereLight - AmbientLight와 마찬가지로 주변광인데, 그와 다르게 빛에 대한 색상값이 하나가 아닌 두개임
		// 하나는 위에서 비치는 빛의 색상이고, 다른 하나는 아래에서 비치는 빛의 색상임
		//const light = new THREE.HemisphereLight("#b0d8f5", "#bb7a1c", 1);

		// DirectionalLight - 태양과 같은 광원으로 태양처럼 빛과 물체 간의 거리에 상관없이 동일한 빛의 효과를 줌
		//const light = new THREE.DirectionalLight(0xffffff, 1);
		//light.position.set(0, 5, 0); // 광원의 위치
		//light.target.position.set(0, 0, 0); // 광원이 비추는 대상의 위치
		// 빛과 물체 간의 거리에 상관없이 동일한 빛의 효과를 주기 때문에 이 빛의 position과 target 속성의 position으로 결정되는 방향만이 의미있음
		//this._scene.add(light.target);

		// 광원을 화면상에 시각화해주는 helper 객체
		//const helper = new THREE.DirectionalLightHelper(light);
		//this._scene.add(helper);
		//this._lightHelper = helper;

		// PointLight - 빛이 광원 위치에서 사방으로 퍼져나감
		//const light = new THREE.PointLight(0xffffff, 2);
		//light.position.set(0, 5, 0);
		//light.distance = 0;
		// distance 속성 값으로 지정된 거리까지만 광원의 영향을 받도록 함
		// 기본값은 0으로 무한한 거리까지 광원의 영향을 받도록 함

		// 광원을 화면상에 시각화해주는 helper 객체
		//const helper = new THREE.PointLightHelper(light);
		//this._scene.add(helper);

		// SpotLight - 빛이 광원의 위치에서 깔대기 모양으로 퍼져나감
		//const light = new THREE.SpotLight(0xffffff, 1);
		//light.position.set(0, 5, 0);
		//light.target.position.set(0, 0, 0);
		//light.angle = THREE.MathUtils.degToRad(40); // 광원이 만드는 빛 깔대기의 각도
		//light.penumbra = 0; // 빛의 감쇄율, 기본값은 0으로 빛의 감쇄가 전혀 없다는 것, 0과 1 사이의 값을 가지며 1에 가까울수록 빛이 중심에서 점점 감쇄되는 것을 볼 수 있음
		//this._scene.add(light.target);

		// 광원을 화면상에 시각화해주는 helper 객체
		//const helper = new THREE.SpotLightHelper(light);
		//this._scene.add(helper);
		//this._lightHelper = helper;

		// RectAreaLight - 형광등이나 창문에서 들어오는 광원
		RectAreaLightUniformsLib.init();
		// RectAreaLight 광원을 사용하기 위해서는 위와 같은 초기화 코드가 선행되어야 함
		const light = new THREE.RectAreaLight(0xffffff, 10, 3, 0.5);
		// (광원의 색상, 광원의 세기값, 광원의 가로 크기, 광원의 세로 크기)
		// 광원의 밝기는 세기값 인자 뿐만 아니라 광원의 크기값 인자로도 변경할 수 있음
		// 광원의 형상이 물체의 표면에 비침
		light.position.set(0, 5, 0);
		light.rotation.x = THREE.MathUtils.degToRad(-90);
		// 이전에는 광원의 방향을 대상의 위치로 지정했던 것과 다르게 RectAreaLight는 각도로 지정한다는 차이점이 있음

		// 광원을 화면상에 시각화해주는 helper 객체
		const helper = new RectAreaLightHelper(light);
		this._scene.add(helper);

		this._scene.add(light);
		this._light = light;
		// 실제로는 보다 나은 렌더링 결과를 위해 여러 종류의 광원을 2개 이상 사용함
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
		this._scene.add(ground);

		// bigSphere
		const bigSphereGeometry = new THREE.SphereGeometry(1.5, 64, 64, 0, Math.PI);
		const bigSphereMaterial = new THREE.MeshStandardMaterial({
			color: "#ffffff",
			roughness: 0.1,
			metalness: 0.2,
		});
		const bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
		bigSphere.rotation.x = THREE.MathUtils.degToRad(-90);
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
			if (this._light) {
				const smallSphere = smallSpherePivot.children[0];
				smallSphere.getWorldPosition(this._light.position);

				if (this._lightHelper) this._lightHelper.update();
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
