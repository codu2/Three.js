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
		camera.position.z = 3;
		this._camera = camera;
		this._scene.add(camera);
	}

	_setUpLight() {
		// aoMap 설정을 위한 ambient light
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
		this._scene.add(ambientLight);

		const color = 0xffffff;
		const intensity = 1; // 광원의 세기
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-1, 2, 4);
		//this._scene.add(light);
		// 광원이 정적인 위치에 고정되어 있어서 마우스를 이용해 카메라를 회전시켜도 광원의 효과가 변하지 않아 한쪽 면만 밝고 다른 면은 매우 어둡게 표현됨
		// 이를 개선하기 위해 광원이 카메라와 함께 회전되도록 하기 위해 light를 Scene이 아닌 Camera의 자식으로 추가해줌
		this._camera.add(light);
		// 그리고 Camera를 Scene의 자식으로 추가해줌
	}

	/*
	Points Material
	_setUpModel() {
		// PointsMaterial을 적용할 10000개의 point를 Scene에 추가하는 코드
		const vertices = [];
		for (let i = 0; i < 10000; i++) {
			const x = THREE.MathUtils.randFloatSpread(5);
			const y = THREE.MathUtils.randFloatSpread(5);
			const z = THREE.MathUtils.randFloatSpread(5);
			// -5 ~ 5 사이의 난수값을 구해 x,y,z 축 좌표로 지정하고 vertices 배열에 추가해줌

			vertices.push(x, y, z);
		}

		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute(
			"position",
			new THREE.Float32BufferAttribute(vertices, 3) // 3은 vertices에 저장된 좌표가 x,y,z로 하나의 좌표라는 것을 의미함
		);

		// 1. 먼저 이미지를 로드해서 texture 객체로 만들고
		const sprite = new THREE.TextureLoader().load(
			"../examples/textures/sprites/disc.png"
		);

		const material = new THREE.PointsMaterial({
			map: sprite, // 2. texture 객체를 넣어줌
			alphaTest: 0.5, // 이미지의 픽셀 값 중 알파값이 이 alphaTest 값보다 클 때만 픽셀이 렌더링되도록 함
			color: "#00ffff", // point의 색상값으로 rgb 값으로 16진수 값이나 색상에 대한 이름 또는 #으로 시작하는 값으로 지정될 수 있음
			size: 0.1, //point의 크기 값
			sizeAttenuation: true,
			// point가 카메라의 거리에 따라 크기가 감쇄되도록 함, false이면 거리에 상관없이 항상 같은 크기의 point로 렌더링됨
			// true이면 카메라에서 가까운 point와 먼 point의 크기가 다르고 카메라에 가까운 point의 크기가 더 크게 렌더링됨
			// 기본 point의 형태는 사각형으로, 이를 원하는 형태로 변경하기 위해서는 이미지를 사용해야 함
			// 다음 순서대로 진행 1 -> 2
		});

		const points = new THREE.Points(geometry, material); // Points 타입의 Object3D 객체 생성
		this._scene.add(points);
	}
	*/

	/*
	Line Meterial
	_setUpModel() {
		const vertices = [-1, 1, 0, 1, 1, 0, -1, -1, 0, 1, -1, 0];
		// line에 대한 좌표를 vertices 배열에 순서대로 저장함

		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute(
			"position",
			new THREE.Float32BufferAttribute(vertices, 3)
		);

		//const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
		// LineBasicMaterial은 선에 대해 색상만 지정할 수 있음. 굵기도 지정할 수는 있으나 실제로 반영되지는 않음

		const material = new THREE.LineDashedMaterial({
			color: 0xffff00,
			dashSize: 0.2, // dashSize 만큼 선이 그려지고
			gapSize: 0.3, // gapSize 만큼 선이 그려지지 않기를 반복
			scale: 1, // dash 영역에 대한 표현 횟수를 몇 배로 할 것인지에 대한 값
		});

		const line = new THREE.Line(geometry, material); // Line 타입의 Object3D 객체 생성
		// vertices의 구성 좌표가 순서대로 연결되어 라인으로 렌더링되는 것은 Line 타입의 Object3D의 특징
		line.computeLineDistances();
		// LineDashedMaterial은 선의 길이를 참조해서 material이 적용되므로 위의 코드를 통해 선의 길이를 계산해줘야 함
		this._scene.add(line);
	}
	*/

	/* 
	Mesh Material
	_setUpModel() {
		// MeshBasicMaterial
		const material = new THREE.MeshBasicMaterial({
			// Material 속성
			visible: true, // 렌더링 시 Mesh가 보일지 안보일지를 지정
			transparent: false, // material의 불투명도 속성인 opacity를 사용할지에 대한 여부
			opacity: 1, // material의 불투명도를 지정하는 값으로 0과 1 사이의 값, transparent를 true로 지정했을 때만 작동함
			depthTest: true, // 렌더링되고 있는 Mesh의 픽셀의 z값을 depth buffer 값을 이용해 검사할지에 대한 여부
			depthWrite: true, // 렌더링되고 있는 Mesh의 픽셀에 대한 z값을 depth buffer에 기록할지에 대한 여부
			// depth buffer는 깊이 버퍼이고 z-buffer 라고도 함
			// z-buffer는 3차원 객체를 카메라를 통해 좌표로 변화시켜 화면상에 렌더링 될 때 해당 3차원 객체를 구성하는 각 픽셀에 대한 z 좌표 값을 0~1 로 정규화 시킴
			// 이 정규화된 z값이 저장된 버퍼가 z-buffer임. 이 값이 작을 수록 카메라에서 가까운 3차원 객체의 픽셀임
			// z-buffer의 값 : 0과 1 사이의 값
			// 카메라와 가까울 수록 z-buffer 값이 작음
			// z-buffer 값이 작을 수록 어둡게 표현됨
			// 이 z-buffer는 주로 더 멀리 있는 3차원 객체가 가까운 객체를 덮어서 렌더링되지 않도록 하기 위해 사용됨
			side: THREE.FrontSide,
			// Mesh를 구성하는 삼각형 면에 대해 앞 면만 렌더링 할 것인지(FrontSide), 뒷 면만 렌더링 할 것인지(BackSide), 아니면 모두 렌더링 할 것인지(DoubleSide)를 지정
			// 광원의 영향을 받지 않는 MeshBasicMaterial은 이 side 속성의 변화에 따른 차이를 볼 수 없음
			// 삼각형 면이 앞면인지에 대한 여부는 삼각형을 구성하는 좌표가 반시계 방향으로 구성되었는지로 결정함

			color: 0xffff00, // Mesh를 color에 지정한 색상으로 렌더링
			wireframe: false, // Mesh를 선 형태로 렌더링 할지에 대한 여부
		});

		// MeshPhongMaterial
		const material = new THREE.MeshLambertMaterial({
			transparent: true,
			opacity: 0.5,
			side: THREE.FrontSide,

			color: "#d25383",
			emissive: 0x555500, 
			// 다른 광원에 영향을 받지 않는, material 자체에서 방출하는 색상 값. 기본값은 검정색으로 어떤 색상도 방출하지 않음
			// 만약 emissive 값으로 약간 노란색인 0x555500을 주면 color 속성값에 더해져 지정한 색상인 노란색 빛을 조금 띠게 됨
			wireframe: false,
		});
		// MeshLambertMaterial은 Mesh를 구성하는 정점에서 광원의 영향을 계산하는 material

		// MeshPhongMaterial
		const material = new THREE.MeshPhongMaterial({
			color: 0xff0000,
			emissive: 0x00000,
			specular: 0xffff00, // 광원에 의해 반사되는 색상으로 기본값은 연한 회색, 광원이 비치는 면이 해당 색상으로 반사되어야 함
			shininess: 10, // 광원에 의해 반사되는 정도를 설정
			flatShading: true, // Mesh를 평편하게 렌더링할지에 대한 여부, 즉 Mesh를 구성하는 면에 대해서 평편하게 렌더링 할 것인지를 설정
			wireframe: false,
		});
		// MeshPhongMaterial은 Mesh가 렌더링되는 픽셀 단위로 광원의 영향을 계산하는 material

		// 물리기반 렌더링, 즉 PBR을 위한 Material
		// PBR(Physically Based Rendering) Material : MeshStandardMaterial, MeshPhysicalMaterial
		// 3차원 그래픽에서 가장 많이 사용하는 Material
		// 속도 면에서는 이 두 재질이 다른 재질보다 상대적으로 느리지만 훨씬 고품질의 렌더링 결과를 얻을 수 있음

		// MeshStandardMaterial
		const material = new THREE.MeshStandardMaterial({
			color: 0xff0000,
			emissive: 0x00000,
			roughness: 0.25,
			// 거칠기, 0은 거칠기가 전혀 없는 표면이 마치 거울과 같은 상태, 최대값은 1
			// 거칠기 값이 커질수록 광원에 대한 반사가 희미해지다가 1이 되면 빛 자체가 반사되지 않음
			metalness: 0.7,
			// 금속성, 0은 마치 돌처럼 금속성이 전혀 없다는 것이고, 1은 완전한 금속성이라는 의미
			// roughness가 1이면 금속성을 표현하기가 어려움
			wireframe: false,
			flatShading: false,
		});

		// MeshPhysicalMaterial
		const material = new THREE.MeshPhysicalMaterial({
			color: 0xff0000,
			emissive: 0x00000,
			roughness: 1,
			metalness: 0,
			clearcoat: 1, // 0과 1 사이의 값으로 0이면 Mesh의 표면에 코팅이 전혀 안되어 있는 재질이고, 1이면 코팅에 대한 효과를 최대로 표현하게 됨
			clearcoatRoughness: 0, // 코팅에 대한 거칠기 값으로 0과 1 사이의 값
			// clearcoat 값을 설정하면 roughness가 1이고 metalness가 0임에도
			// 즉 재질이 거칠고 금속성이 전혀 없음에도 표면에 코팅 효과가 적용되어서 광원의 반사 효과가 나타남

			wireframe: false,
			flatShading: false,
		});
		// MeshPhysicalMaterial은 MeshStandardMaterial을 상속받는 보다 발전된 물리기반 렌더링 Material
		// 표면에 코팅 효과를 줄 수 있고 다른 재질처럼 단순 투명도 처리가 아닌 실제 유리같은 효과를 표현할 수 있음

		// Material은 저마다의 속성값 변화와 함께 외부 광원(Light)의 영향을 민감하게, 크게 받음
	
		const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
		box.position.set(-1, 0, 0);
		this._scene.add(box);

		const sphere = new THREE.Mesh(
			new THREE.SphereGeometry(0.7, 32, 32),
			material
		);
		sphere.position.set(1, 0, 0);
		this._scene.add(sphere);
	}
	*/

	/* 
	Texture
	_setUpModel() {
		// 이미지를 texture 객체로 생성
		const textureLoader = new THREE.TextureLoader(); // TextureLoader 클래스의 객체를 생성하고
		const map = textureLoader.load(
			"../examples/textures/uv_grid_opengl.jpg",
			(texture) => {
				// 텍스쳐의 반복 수 = repeat의 x,y 기본값 1
				texture.repeat.x = 1;
				texture.repeat.y = 1;

				// repeat 속성은 wrapS, wrapT와 함께 사용될 수 있음
				texture.wrapS = THREE.ClampToEdgeWrapping;
				texture.wrapT = THREE.ClampToEdgeWrapping;
				// RepeatWrapping : 이미지를 반복해서 맵핑
				// ClampToEdgeWrapping : 처음에만 이미지가 한번 맵핑되고 반복부터는 이미지의 끝단 픽셀로 나머지 영역을 채움
				// MirroredRepeatWrapping : 이미지를 x와 y 방향으로 반복하되 짝수번째 반복에서는 이미지가 거울에 반사되어 뒤집힌 모양으로 맵핑됨

				// UV 좌표의 시작 위치 조정 - offset의 x,y 기본값 0
				texture.offset.x = 0;
				texture.offset.y = 0;
				// x,y 값을 0.5로 주면 이미지가 좌측 하단 방향으로 0.5만큼 이동되어 맵핑됨
				// x,y 값을 -0.5로 주면 이미지가 우측 싱단 방향으로 0.5만큼 이동되어 맵핑됨

				// 이미지 맵핑을 회전시키기 위한 rotation 속성
				texture.rotation = THREE.MathUtils.degToRad(45);
				// 이미지가 UV 좌표 (0,0)을 기준으로 45도 반시계 방향으로 회전해서 맵핑됨
				// 회전의 기준 좌표는 center 속성으로 조정할 수 있음
				texture.center.x = 0.5;
				texture.center.y = 0.5;

				// 텍스쳐 이미지가 렌더링될 때 사용할 필터에 대한 속성
				// 텍스쳐 이미지의 원래 크기보다 화면에 더 크게 확대되어 렌더링될 때 사용할 필터는 magFilter, 더 작게 렌더링될 때는 minFilter
				texture.magFilter = THREE.LinearFilter;
				// magFilter에 대한 LinearFilter는 가장 가까운 4개의 픽셀 색상을 얻어와 선형 보간한 값을 사용함
				// NearestFilter는 단순히 가장 가까운 하나의 픽셀의 색상을 가져와 그대로 사용함 - 계단현상 발생
				texture.minFilter = THREE.NearestMipmapLinearFilter;
				// mipMap은 원래 이미지 크기를 절반으로 줄여서 미리 만들어 놓은 이미지 셋
				// 512x512 -> 256x256 -> 128x128 -> ... => 이미지 집합 = mipMap
				// NearestMipmapLinearFilter는 렌더링할 맵핑 크기와 크기가 가장 가까운 mipMap 이미지 2개를 선택하고 선택한 2개의 mipMap 이미지로부터 가장 가까운 픽셀 1개씩을 얻은 뒤 이렇게 얻어진 2개의 픽셀의 가중치 평균 값을 최종 색상값으로 사용함
				// NearestFilter는 mipMap을 사용하지 않고 단순히 가장 가까운 픽셀 하나를 가져와 사용
				// LinearFilter는 mipMap을 사용하지 않고 원래 텍스쳐로부터 가장 가까운 4개의 픽셀을 얻어와 선형 보간한 값을 사용
				// NearestMipmapNearestFilter는 렌더링할 맵핑 크기와 가장 가까운 mipMap 이미지 1개를 선택하고 그 이미지에서 가장 가까운 1개의 픽셀 값을 가져와 사용
				// LinearMipmapNearestFilter는 렌더링할 맵핑 크기와 가장 가까운 mipMap 이미지 1개를 선택하고 가장 가까운 4개의 픽셀을 가져와 선형 보간한 값을 사용
				// LinearMipmapLinearFilter는 렌더링할 맵핑 크기와 가장 크기가 가까운 mipMap 이미지 2개를 선택하고 각각의 mipMap 이미지에서 가장 가까운 픽셀 4개씩을 얻은 뒤에 선형 보간하여 2개의 색상값을 얻고 이 두값을 다시 가중치 평균한 색상값을 사용
				// 결과적으로 mipMap을 사용한 경우가 렌더링 품질이 더 좋으나 항상 mipMap을 사용하는 것이 답은 아님
				// mipMap의 생성을 위한 메모리 사용량이 상당하고 렌더링 시 하나의 픽셀값을 결정하기 위한 계산에 필요한 연산량이 각 속성에 따라 모두 다르므로
				// 텍스쳐 맵핑의 크기 등에 따라서 적절한 minFilter의 속성값을 지정해서 사용해야 함
				// 대부분의 경우 기본값을 사용해도 무리가 없음
			}
		); // textureLoader 객체의 load 메서드에 이미지 경로를 지정
		// 그리고 이 이미지가 성공적으로 네트워크를 통해 다운로드 된 후 texture 생성이 완료되면 호출되는 콜백 함수를 지정해줌
		const material = new THREE.MeshStandardMaterial({ map: map });
		// map에 대한 속성을 지정하기 위해서는 texture 객체가 필요함
		// 이 texture 객체는 이미지나 동영상 등을 통해서 생성됨
		// map 속성에 texture 객체인 map을 주면 이미지가 Mesh에 맵핑되어 렌더링됨
		// 기본적으로 텍스쳐 맵핑은 Geometry에 UV 좌표 개념으로 맵핑 되어있음
		// 이 UV 좌표는 three.js에서 제공하는 Geometry에 기본적으로 지정되어 있고 이 지정된 UV 좌표대로 텍스쳐가 맵핑됨
		// UV 좌표는 0과 1 사이의 값으로 U는 이미지의 수평방향에 대한 축이고 V는 수직방향에 대한 축임
		// 이미지의 좌측 하단의 UV 좌표는 (0,0)이고 우측 하단의 UV 좌표는 (1,0)이며
		// 좌측 상단의 UV 좌표는 (0,1)이고 우측 상단의 UV 좌표는 (1,1)

		// 텍스쳐의 속성은 텍스쳐 객체가 생성된 이후에 설정되어야 함
		// 꼭 그럴 필요는 없으나 여기서는 텍스쳐 객체가 생성되고 이미지가 성공적으로 로드된 이후에 실행되는 콜백함수에서 설정해줌

		const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
		box.position.set(-1, 0, 0);
		this._scene.add(box);

		const sphere = new THREE.Mesh(
			new THREE.SphereGeometry(0.7, 32, 32),
			material
		);
		sphere.position.set(1, 0, 0);
		this._scene.add(sphere);
	}
	*/

	_setUpModel() {
		const textureLoader = new THREE.TextureLoader();
		const map = textureLoader.load(
			"images/glass/Glass_Window_002_basecolor.jpg"
		);
		const mapAO = textureLoader.load(
			"images/glass/Glass_Window_002_ambientOcclusion.jpg"
		);
		const mapHeight = textureLoader.load(
			"images/glass/Glass_Window_002_height.png"
		);
		const mapNormal = textureLoader.load(
			"images/glass/Glass_Window_002_normal.jpg"
		);
		const mapRoughness = textureLoader.load(
			"images/glass/Glass_Window_002_roughness.jpg"
		);
		const mapMetallic = textureLoader.load(
			"images/glass/Glass_Window_002_metallic.jpg"
		);
		const mapAlpha = textureLoader.load(
			"images/glass/Glass_Window_002_opacity.jpg"
		);
		const mapLight = textureLoader.load("images/glass/light.jpeg");

		const material = new THREE.MeshStandardMaterial({
			map: map,
			normalMap: mapNormal, // Mesh의 표면에 입체감이 나타남
			// normalMap은 법선 벡터를 이미지화 해서 저장해 둔 것으로, 법선 벡터는 Mesh의 표면에 대한 수직 벡터로 광원에 대한 영향을 계산하는 데 사용됨
			// Mesh에 대한 법선 벡터를 시각화해보기 위해 VertexNormalsHelper 클래스 사용
			// normalMap을 사용하면 박스 표면의 노말 벡터를 normalMap 이미지의 RGB 값을 이용해 계산함
			// 이렇게 되면 인위적으로 Mesh 표면의 각 픽셀에 대해 법선 벡터를 지정할 수 있게 되고 각 픽셀 단위로 광원 효과가 달라져 입체감을 표현할 수 있음
			// Mesh의 Geometry 형상이 바뀌는 것이 아니기 때문에 입체감은 착시 현상이지만
			// 그럼에도 매우 적은 Geometry의 좌표 구성만으로도 입체감을 매우 효과적으로 표현할 수 있는 방법임

			displacementMap: mapHeight, // 실제로 Mesh의 Geometry 좌표를 변경시켜 입체감을 표현
			// 맵핑 이미지의 픽셀값이 밝을 수록 좌표의 변위가 커지게 됨
			// 과장된 변위를 조정하기 위해 displacementScale과 displacementBias 속성을 사용할 수 있음
			displacementScale: 0.2, // 변위 효과를 기존의 100%가 아닌 20%만 발생시키게 됨
			displacementBias: -0.15, // 변위 결과를 이 값만큼 조정할 수 있음 (box의 구성 면이 변위에 의해 분리되어버리는 문제를 displacementBias에 음수값을 설정하여 해결할 수 있음)

			// 그런데 예시에서 구와는 달리 박스에 대해서는 변위가 발생하지 않음
			// 이는 displacementMap이 실제 Geometry의 구성 좌표를 변경시키기 때문에 박스의 표면에 대한 구성 좌표가 제공되어져야 하기 때문임
			// 이를 위해 이 박스의 Geometry 표면을 여러 개의 면으로 분할시켜줘야 하므로 각 면에 대해 256개로 분할(segment)시켜줌
			// 구의 경우에도 분할 수를 기존의 32가 아닌 512로 변경하면 훨씬 displacementMap의 효과가 잘 적용됨
			// 하지만 displacementMap 효과를 위해서 이렇게 좌표를 더 많이 추가하는 것은 렌더링 속도 면에서 비효율적임
			// 이를 위해 적절한 normalMap과 함께 displacementMap 효과를 위한 적절한 segment 값 지정(면 분할)이 필요함

			aoMap: mapAO, // 텍스쳐 이미지에 미리 음영 효과를 그려 놓은 것
			// aoMap 속성이 적용되기 위해서는 두기지를 필수적으로 추가해야 함
			// 그 중 하나는 ambient light로, 모든 Mesh의 전체 면에 대해서 균일하게 비추는 광원
			// 다른 하나는 Geometry의 속성에 uv2 데이터를 지정해줘야 함
			aoMapIntensity: 1, // aoMap 속성으로 인한 그림자 효과의 강도를 지정, 기본값 1
			// 이 aoMap을 이용하면 미리 만들어진 세밀한 그림자와 같은 느낌의 효과를 지정할 수 있음

			roughnessMap: mapRoughness, // 거칠기에 대한 재질이 적용됨, 맵 이미지의 픽셀값이 밝을 수록 거칠기가 강하게 됨
			roughness: 1, // 거칠기 강도 조절, 기본값 1

			metalnessMap: mapMetallic, // 금속 재질에 대한 느낌을 부여, metalness 속성값을 지정해줘야 함
			metalness: 0.5, // 이 값을 따로 지정하지 않으면 0

			alphaMap: mapAlpha, // 투명도에 대한 map 속성, 투명도에 대한 활성화가 필요
			transparent: true,
			// 이미지의 픽셀값이 밝을 수록 불투명하게 되는데, 만약 픽셀값이 완전 검정색이라면 완전히 투명하게 됨
			// 이때 구와 박스를 일직선 상에 놓고 앞에 둔 구의 투명한 부분을 통해 보면 바로 박스가 보이게 되는데, 사실 구의 뒷면을 볼 수 있어야 하므로 Mesh의 뒷면도 렌더링되도록 바꿔줌
			side: THREE.DoubleSide,

			lightMap: mapLight, // 지정된 이미지의 색상으로 발광하는 느낌을 표현할 수 있음
			lightMapIntensity: 1, // 발광 정도 조절, 기본값 1
			// lightMap은 aoMap처럼 Geometry의 속성에 uv2 데이터를 지정해줘야 함
		});

		const box = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1, 256, 256, 256),
			material
		);
		box.position.set(-1, 0, 0);
		// aoMap, lightMap 속성을 위한 uv2 지정
		box.geometry.attributes.uv2 = box.geometry.attributes.uv;
		this._scene.add(box);

		// box에 대한 법선 벡터의 시각화를 위해
		//const boxHelper = new VertexNormalsHelper(box, 0.1, 0xffff00);
		//this._scene.add(boxHelper);

		const sphere = new THREE.Mesh(
			new THREE.SphereGeometry(0.7, 512, 512),
			material
		);
		sphere.position.set(1, 0, 0);
		// aoMap, lightMap 속성을 위한 uv2 지정
		sphere.geometry.attributes.uv2 = sphere.geometry.attributes.uv;
		this._scene.add(sphere);

		// sphere에 대한 법선 벡터의 시각화를 위해
		//const sphereHelper = new VertexNormalsHelper(sphere, 0.1, 0xffff00);
		//this._scene.add(sphereHelper);
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
