import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";
// 사용자가 마우스로 직접 회전시킬 수 있도록 하기
import { FontLoader } from "../examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "../examples/jsm/geometries/TextGeometry.js";

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
		this._setUpControls(); // OrbitControls와 같은 컨트롤들을 정의하는데 사용하는 메서드

		window.onresize = this.resize.bind(this);
		this.resize();

		requestAnimationFrame(this.render.bind(this));
	}

	_setUpControls() {
		new OrbitControls(this._camera, this._divContainer);
		// OrbitControls 객체를 생성할 때는 camera 객체와 마우스 이벤트를 받는 DOM 요소가 필요함
	}

	_setUpCamera() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
		camera.position.x = -15;
		camera.position.z = 15;
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
		//const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
		// BoxGeometry는 정육면체 모양의 geometry이며, (가로, 세로, 깊이, 가로 세그먼트, 세로 세그먼트, 깊이 세그먼트)를 인자로 받음. 모두 기본값은 1

		//const geometry = new THREE.CircleGeometry(0.9, 16, 0, Math.PI / 2);
		// CircleGeometry는 원판 모양의 geometry이며, 생성자에 4개의 인자를 받음
		// (원판의 반지름 = 기본값 1, 원판을 구성하는 분할 개수 = 세그먼트 수 = 기본값 8 = 이 값이 클수록 좀 더 완전한 원의 형태가 됨,
		// 시작 각도 = 단위는 radian = 기본값 0 = 기준이 되는 방향은 3시 방향, 연장 각도 = 단위는 radian = 기본값 2PI => 360도 = 양수면 반시계 방향으로)

		//const geometry = new THREE.ConeGeometry(0.5, 1.6, 16, 5, true, 0, Math.PI);
		//ConeGeometry는 원뿔 모양의 geometry이며, 생성자에 7개의 인자를 받음
		// (밑면에 해당되는 원의 반지름 크기 = 기본값 1, 원뿔의 높이 = 기본값 1, 원뿔의 둘레방향에 대한 분할 개수 = 기본값 8, 원뿔의 높이방향에 대한 분할 개수 = 기본값 1,
		// 원뿔 밑면을 열어 놓을 것인지에 대한 여부 = 기본값 false, 원뿔의 시작 각 = 기본값 0, 원뿔의 연장 각 = 기본값 2PI => 360도)

		//const geometry = new THREE.CylinderGeometry(
		//	0.5,
		//	0.9,
		//	0.8,
		//	6,
		//	3,
		//	true,
		//	0,
		//	Math.PI
		//);
		// CylinderGeometry는 원통 모양의 geometry이며, 생성자에 8개의 인자를 받음
		// (윗면에 해당하는 원의 반지름 크기 = 기본값 1, 밑면에 해당하는 원의 반지름 크기 = 기본값 1, 원통의 높이 = 기본값 1, 원통의 둘레방향에 대한 분할 개수 = 기본값 8,
		// 원통의 높이방향에 대한 분할 개수 = 기본값 1, 원통 윗면과 밑면을 열어놓을 것인지에 대한 여부 = 기본값 false, 원통의 시작 각 = 기본값 0, 원통의 연장 각 = 기본 값 2PI => 360도)

		//const geometry = new THREE.SphereGeometry(
		//	0.9,
		//	32,
		//	12,
		//	0,
		//	Math.PI,
		//	0,
		//	Math.PI / 2
		//);
		// SphereGeometry는 구 형태의 geometry이며, 생성자에 7개의 인자를 받음
		// (구의 반지름 크기 = 기본값 1, 수평방향에 대한 분할 수 = 기본값 32, 수직방향에 대한 분할 수 = 기본값 16, 수평방향에 대한 구의 시작 각 = 기본값 0, 수평방향에 대한 구의 연장 각 = 기본값 2PI => 360도,
		// 수직방향에 대한 구의 시작 각 = 기본값 0, 수직방향에 대한 구의 연장 각 = 기본값 PI => 180도)

		//const geometry = new THREE.RingGeometry(0.4, 0.9, 5, 2, 0, Math.PI);
		// RingGeometry는 2차원 형태의 반지 모양이며, 생성자에 6개의 인자를 받음
		// (내부 반지름 값 = 기본값 0.5, 외부 반지름 값 = 기본값 1, 가장자리 둘레방향으로의 분할 수 = 기본값 8,
		// 내부 방향에 대한 분할 수 = 기본값 1, 시작 각 = 기본값 0, 연장 각 = 기본값 2PI => 360도 )

		//const geometry = new THREE.PlaneGeometry(0.8, 1.4, 2, 4);
		// PlaneGeometry는 평면 모양의 사각형이며, 생성자에 4개의 인자를 받음
		// (너비에 대한 길이 = 기본값 1, 높이에 대한 길이 = 기본값 1, 너비 방향에 대한 분할 수 = 기본값 1, 높이 방향에 대한 분할 수 = 기본값 1)
		// PlaneGeometry는 지리 정보 시스템, 즉 GIS에서 3차원 지형 등을 표현하는데 유용하게 사용됨

		//const geometry = new THREE.TorusGeometry(0.9, 0.3, 24, 32, Math.PI);
		// TorusGeometry는 3차원 형태의 반지 모양이며, 생성자에 4개의 인자를 받음
		// (토러스의 반지름 = 기본값 1, 토러스를 만드는 원통의 반지름 값 = 기본값 0.4,
		// 토러스의 방사방향에 대한 분할 수 = 기본값 8, 토러스의 긴 원통에 대한 분할 수 = 기본값 6, 연장 각의 길이 = 시작 각이 따로 없음 = 기본값 2PI)
		// 토러스는 긴 원통으로 360도 한바퀴를 돌아서 이어진 형태

		//const geometry = new THREE.TorusKnotGeometry(0.6, 0.4, 64, 32, 3, 4);
		// TorusKnotGeometry는 활용도가 떨어짐
		// (TorusKnot의 반지름, TorusKnot을 구성하는 원통의 반지름 크기, 분할 수, 분할 수,
		// TorusKnot을 구성하는 데 사용되는 어떤 반복 수, TorusKnot을 구성하는 데 사용되는 어떤 반복 수)

		//const shape = new THREE.Shape(); !
		// Shape 클래스 생성 후
		//shape.moveTo(1, 1);
		//shape.lineTo(1, -1);
		//shape.lineTo(-1, -1);
		//shape.lineTo(-1, 1);
		//shape.closePath();
		// (x,y) 좌표를 사용해서 Shape의 모양에 대해 정의해줌
		// 마지막으로 closePath() 메서드를 호출해서 이 도형을 닫으라고 지정해줌
		//const x = 0, !
		//	y = 0;
		//shape.moveTo(x + 5, y + 5);
		//shape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
		//shape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
		//shape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
		//shape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
		//shape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
		//shape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5); !

		//const geometry = new THREE.BufferGeometry();
		//const points = shape.getPoints();
		//geometry.setFromPoints(points);

		//const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
		//const line = new THREE.Line(geometry, material);

		//this._scene.add(line);

		//const geometry = new THREE.ShapeGeometry(shape); !
		// ShapeGeometry는 생성 시에 Shape 클래스의 객체를 인자로 받음
		// Shape은 2차형의 도형을 정의하기 위한 클래스
		// Shape 객체를 생성한 후 ShapeGeometry의 인자로 전달해줌

		//class CustomSinCurve extends THREE.Curve { !
		// Curve 클래스를 상속받아 CustomSinCurve 클래스를 새롭게 정의함
		// 이 클래스는 curve를 t 매개변수 방정식으로 정의함
		//	constructor(scale) {
		//		super();
		//		this.scale = scale;
		//	}
		//	getPoint(t) {
		// 0과 1 사이의 t값에 대한 curve의 구성좌표를 계산할 수 있음
		//		const tx = t * 3 - 1.5;
		//		const ty = Math.sin(2 * Math.PI * t);
		//		const tz = 0;
		//		return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
		//	}
		//} !

		//const path = new CustomSinCurve(4); !
		// 튜브가 이어지는 형태를 결정하기 위한 커브 객체를 path라는 이름으로 생성해줌

		//const geometry = new THREE.BufferGeometry();
		//const points = path.getPoints(30);
		// getPoints의 인자 기본값은 5인데, 더 부드러운 곡선을 얻고자 한다면 적당한 정수값을 넣어주면 됨
		// 이 값은 커브를 구성하는 좌표의 개수로, 적당한 값을 지정해서 원하는 곡선을 얻으면 됨
		//geometry.setFromPoints(points);

		//const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
		//const line = new THREE.Line(geometry, material);

		//this._scene.add(line);

		//const geometry = new THREE.TubeGeometry(path, 18, 0.9, 6, true); !
		// TubeGeometry는 어떤 곡선을 따라서 원통이 이어지는 형태이며, path 인자 외에 4개의 인자를 받음
		// 곡선을 정의할 수 있는 Curve 클래스
		// path를 TubeGeometry의 생성자에 전달해줌
		// (path, 튜브의 진행방향에 대한 분할 수 = 기본값 64, 튜브의 원통에 대한 반지름 크기 = 기본값 1, 원통에 대한 분할 수 = 기본값 8, 원통의 시작 단과 끝 단을 닫을 지에 대한 여부 = 기본값 false)

		//const points = []; !
		//for (let i = 0; i < 10; i++) {
		//	points.push(new THREE.Vector2(Math.sin(i * 0.2) * 3 + 3, (i - 5) * 0.8));
		//} !

		//const geometry = new THREE.BufferGeometry();
		//geometry.setFromPoints(points);

		//const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
		//const line = new THREE.Line(geometry, material);

		//this._scene.add(line);
		// points로 구성되는 좌표들이 이루는 선
		// 이 선을 y축으로 회전시켜 생성되는 3차원 Mesh를 얻기 위해 LatheGeometry를 사용함

		//const geometry = new THREE.LatheGeometry(points, 32, 0, Math.PI); !
		// LatheGeometry는 y축으로 회전하여 얻어지는 3차원 Mesh
		// LathGeometry를 정의하기 위해서 먼저 무엇을 회전할 것인지를 지정해야 함
		// LatheGeometry는 생성자의 인자로 회전시킬 대상에 대한 좌표 배열 뿐만 아니라 3개의 인자를 받음
		// (분할 수 = 기본 값 12, 시작 각 = 기본값 0 => 3시 방향, 연장 각 = 기본값 2PI => 360도)

		//const shape = new THREE.Shape();
		//const x = 0,
		//	y = 0;
		//shape.moveTo(x + 5, y + 5);
		//shape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
		//shape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
		//shape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
		//shape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
		//shape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
		//shape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);
		// 앞서 봤던 하트 모양의 Shape을 생성하는 코드

		//const settings = {
		//	steps: 2, // 깊이 방향으로의 분할 수 = 기본값 1
		//	depth: 4, // 깊이 값 = 기본값 100
		//	bevelEnabled: true, // 베벨링 처리를 할 것인지에 대한 여부 = 기본값 true = 이 값이 true로 설정되어야 bevel에 대한 속성값이 적용됨
		//	bevelThickness: 1, // 베벨링에 대한 두께 값 = 기본값 6
		//	bevelSize: 2, // shape의 외곽선으로부터 얼마나 멀리 베벨링할 것인지의 거리 값 = 기본값 2
		//	bevelSegments: 2, // 베벨링 단계 수 = 기본값 3
		//};
		// ExtrudeGeometry를 생성할 때 지정하는 설정 값

		//const geometry = new THREE.ExtrudeGeometry(shape, settings);
		// ExtrudeGeometry는 평면 Shape에 깊이 값을 부여해주고 Mesh의 윗 면과 밑면을 비스듬하게 처리해 주는 geometry
		// 이렇게 비스듬하게 처리해 주는 것을 베벨링이라고 함
		// ExtrudeGeometry를 생성할 때 shape과 settings 객체를 인자로 넘겨줌

		const fontLoader = new FontLoader();
		// 폰트 데이터를 비동기적으로 불러오기 위해 loadFont 비동기 함수를 추가함
		async function loadFont(that) {
			const url = "../examples/fonts/helvetiker_regular.typeface.json";
			const font = await new Promise((resolve, reject) => {
				fontLoader.load(url, resolve, undefined, reject);
			});
			const geometry = new TextGeometry("GIS", {
				font: font, // fontLoader를 통해 얻어온 폰트 객체
				size: 9, // text Mesh의 크기 = 기본값 100
				height: 2, // 깊이 값 = 기본값 50
				curveSegments: 12, // 글자 하나는 여려개의 커브로 구성되어 있으며, 하나의 커브를 구성하는 정점의 개수 = 기본값 12
				// setting for ExtrudeGeometry
				bevelEnabled: true,
				bevelThickness: 0.7,
				bevelSize: 0.7,
				bevelSegments: 2,
			});
			// TextGeometry는 3차원 Mesh로 생성할 문자열을 첫번째 인자로 받음
			// 두번째 인자로는 속성값을 지정한 객체를 받음
			// 비동기 함수 내부에서 geometry를 생성하였으므로 다른 코드들도 비동기 함수 내에서 호출해주어야 함

			const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
			const cube = new THREE.Mesh(geometry, fillMaterial);

			const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
			const line = new THREE.LineSegments(
				new THREE.WireframeGeometry(geometry),
				lineMaterial
			);

			const group = new THREE.Group();
			group.add(cube);
			group.add(line);

			that._scene.add(group);
			that._cube = group;
		}
		loadFont(this);
		// loadFont 비동기 함수를 this 인자와 함께 호출해줌

		// TextGeometry는 ExtrudeGeometry의 파생 클래스
		// TextGeometry는 폰트 데이터가 필요한데, TTF 등과 같은 폰트 파일을 Three.js에서 폰트로 사용할 수 있는 포맷으로 변경해 사용함
		// 형식은 json이며, 폰트를 로드하기 위해서는 FontLoader 클래스가 필요함
		// 폰트 데이터를 비동기적으로 불러와야 함

		/*
		const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
		const cube = new THREE.Mesh(geometry, fillMaterial);

		const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
		const line = new THREE.LineSegments(
			new THREE.WireframeGeometry(geometry), // WireframeGeometry는 wireframe 형태로 geometry를 표현하기 위해 사용됨. 적용하지 않는다면 모델의 모든 외곽선이 표시되지 않음
			lineMaterial
		);

		const group = new THREE.Group();
		group.add(cube);
		group.add(line);
		// Mesh object와 Line object를 하나의 object로 다루기 위해 group으로 묶어줌

		this._scene.add(group);
		this._cube = group;
		*/
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
