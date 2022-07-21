import * as THREE from "../build/three.module.js";

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

		window.onresize = this.resize.bind(this);
		this.resize();

		requestAnimationFrame(this.render.bind(this));
	}

	_setUpCamera() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
		camera.position.z = 25;
		this._camera = camera;
	}

	_setUpLight() {
		const color = 0xffffff;
		const intensity = 1;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-1, 2, 4);
		this._scene.add(light);
	}

	_setUpModel() {
		// Scene Graph의 내용을 참고!
		// 먼저 Object3D 타입의 solarSystem 객체를 생성하고 Scene에 추가
		const solarSystem = new THREE.Object3D();
		this._scene.add(solarSystem);

		// 구 모양의 Geometry 생성
		const radius = 1; // 반지름은 1
		const widthSegments = 12;
		const heightSegments = 12;
		const sphereGeometry = new THREE.SphereGeometry(
			radius,
			widthSegments,
			heightSegments
		);

		// 태양의 재질을 생성
		const sunMaterial = new THREE.MeshPhongMaterial({
			emissive: 0xffff00, // 색상은 노랑색
			flatShading: true,
		});

		// sphereGeomery와 sunMaterial을 이용해 sunMesh를 생성하고 solarSystem에 추가
		const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
		sunMesh.scale.set(3, 3, 3); // sunMesh의 scale 속성을 3, 3, 3으로 설정하고 있는데, 이는 원래 geometry가 갖는 크기보다 x,y,z 축에 대해 3배 크게 표시하기 위함
		solarSystem.add(sunMesh);

		// 그 다음 Object3D 타입의 earthOrbit 객체를 생성하고 solarSystem의 자식으로 추가
		const earthOrbit = new THREE.Object3D();
		solarSystem.add(earthOrbit);

		// 지구에 대한 재질 추가 - geometry는 sphereGeometry를 사용
		const earthMaterial = new THREE.MeshPhongMaterial({
			color: 0x2233ff,
			emissive: 0x112244,
			flatShading: true,
		});

		// sphereGeometry와 earthMaterial을 이용해 earthMesh를 생성하고 earthOrbit에 추가
		const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
		earthOrbit.position.x = 10; // 지구가 태양에서 x축으로 10만큼 떨어진 위치에 배치되도록 하기 위함
		earthOrbit.add(earthMesh);

		// 그 다음 Object3D 타입의 moonOrbit 객체를 생성하고 earthOrbit의 자식으로 추가
		const moonOrbit = new THREE.Object3D();
		moonOrbit.position.x = 2; // moonOrbit은 earthOrbit의 자식이므로 earthOrbit을 기준으로 x축으로 2만큼 떨어진 위치에 배치됨
		earthOrbit.add(moonOrbit);

		// 달에 대한 재질 추가 - geometry는 sphereGeometry를 사용
		const moonMaterial = new THREE.MeshPhongMaterial({
			color: 0x888888,
			emissive: 0x222222,
			flatShading: true,
		});

		// sphereGeometry와 moonMaterial을 이용해 moonMesh를 생성하고 moonOrbit에 추가
		const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
		moonMesh.scale.set(0.5, 0.5, 0.5); // moonMesh의 크기를 모든 축에 대해 0.5로 지정하여 지구보다 작게 만들어줌
		moonOrbit.add(moonMesh);

		this._solarSystem = solarSystem;
		this._earthOrbit = earthOrbit;
		this._moonOrbit = moonOrbit;
		// 다른 메서드에서도 참조하기 위함
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

		// 태양의 자전 - solarSystem의 y축의 회전 값을 변경시켜줌
		this._solarSystem.rotation.y = time / 2;
		// y축의 회전 값으로 time 값의 절반을 지정함
		// 결과를 보면 태양이 자전할 뿐만 아니라 지구와 달도 태양을 중심으로 회전하고 있음
		// 이는 지구가 태양의 자식이고 달이 지구의 자식이기 때문에 태양의 회전에 영향을 받기 때문임

		// 지구의 자전 - earthOrbit을 y축으로 회전시킴
		this._earthOrbit.rotation.y = time * 2;
		// 지구가 자전할 뿐만 아니라 지구의 자식인 달도 지구를 중심으로 회전하고 있음

		// 달의 자전 - moonOrbit을 y축으로 회전시킴
		this._moonOrbit.rotation.y = time * 5;
	}
}

window.onload = function () {
	new App();
};
