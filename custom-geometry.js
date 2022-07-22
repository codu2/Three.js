import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";
import { VertexNormalsHelper } from "../examples/jsm/helpers/VertexNormalsHelper.js";

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
		camera.position.z = 2;
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
		// 생성할 객체인 사각형을 구성하는 4개의 정점을 배열 객체로 정의
		const rawPositions = [-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0];

		// 법선 벡터에 대한 배열 데이터
		const rawNormals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
		// 4개의 좌표에 대해서 법선 벡터가 모두 (0,0,1)인데, 이는 Mesh의 면으로 봤을 때 면에 대한 수직인 벡터가 모두 (0,0,1)이기 때문

		// 각 정점에 대한 색상값 지정을 위한 배열
		const rawColors = [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0];

		// uv 좌표를 담고 있는 배열
		const rawUVs = [0, 0, 1, 0, 0, 1, 1, 1];
		// uv 좌표 (0,0)은 좌측 하단 좌표로 geometry의 정점 좌표 (-1,-1,0)에 맵핑됨

		// rawPositions, rawNormals, rawColors, rawUVs 배열을 Float32Array 클래스의 객체로 랩핑
		const positions = new Float32Array(rawPositions);
		const normals = new Float32Array(rawNormals);
		const colors = new Float32Array(rawColors);
		const uvs = new Float32Array(rawUVs);

		// BuffetGeometry 객체 생성
		const geometry = new THREE.BufferGeometry();

		// geometry에 position 속성 지정 - BufferAttribute 클래스를 통해 positions 정점 데이터를 지정
		geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3)); // 하나의 정점이 3개의 항목, 즉 x,y,z로 구성된다는 의미

		// 법선 벡터를 geometry에 지정
		geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));

		// 각 vertex(정점)마다 색상값 지정 - 적용을 위해서는 재질에 vertexColors: true 속성을 추가해주어야 함
		geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
		// 각 vertex에 적용된 색상은 재질 자체의 색상에 영향을 받음

		// geometry에 uv 속성 지정
		geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2)); // uv는 2개의 값이 하나의 uv 좌표를 구성하므로 2

		// Vertex Index 지정
		// Vertex Index는 삼각형 면을 정의함. 사각형은 모두 2개의 삼각형으로 구성됨
		// 정점의 인덱스를 지정할 때 주의해야 할 점은 삼각형을 구성하는 정점의 배치 순서가 반시계 방향이어야 함
		// 인덱스는 0이 시작값이므로 첫번째 인덱스는 0
		geometry.setIndex([0, 1, 2, 2, 1, 3]);

		// 다음 코드를 통해 모든 정점에 대한 법선 벡터를 자동으로 지정할 수 있음
		//geometry.computeVertexNormals();

		// 텍스쳐 맵핑을 위한 텍스쳐 객체 생성
		const textureLoader = new THREE.TextureLoader();
		const map = textureLoader.load("../examples/texture/uv_grid_opengl.jpg");

		const material = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			vertexColors: true,
			map: map,
		});

		const box = new THREE.Mesh(geometry, material);
		this._scene.add(box);

		// Mesh를 화면에 렌더링하기 위해서는 정점에 대한 법선 벡터를 지정해줘야 함
		// 법선 벡터는 광원이 Mesh의 표면에 미치는 입사각과 반사각을 계산하여 재질과 함게 표면의 색상을 결정하는데 사용됨

		// Mesh에 대한 법선 벡터를 시각화하기 위해서 VertexNormalsHelper 클래스 이용
		const helper = new VertexNormalsHelper(box, 0.1, 0xffff00);
		this._scene.add(helper);
		// 사각형을 구성하는 4개의 정점에 노란색의 선이 표시됨
		// 사각형을 눕혀보면 법선 벡터가 Mesh의 표면에 수직이라는 것을 명확히 알 수 있음

		// color 속성을 이용해서 각 vertex 마다 색상 값을 지정할 수 있음
		// uv 속성은 텍스쳐 맵핑을 위한 속성
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
	}
}

window.onload = function () {
	new App();
};
