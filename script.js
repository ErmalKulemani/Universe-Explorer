// UNIVERSE EXPLORER
// Interactive 3D Universe

const planets = [
  {
    name: "Mercury",
    type: "Rocky planet",
    distance: "57.9 million km from the Sun",
    diameter: "4,879 km",
    color: 0x9b8f82
  },
  {
    name: "Venus",
    type: "Rocky planet",
    distance: "108.2 million km from the Sun",
    diameter: "12,104 km",
    color: 0xd9a441
  },
  {
    name: "Earth",
    type: "Rocky planet",
    distance: "149.6 million km from the Sun",
    diameter: "12,742 km",
    color: 0x2878c8
  },
  {
    name: "Mars",
    type: "Rocky planet",
    distance: "227.9 million km from the Sun",
    diameter: "6,779 km",
    color: 0xc94b35
  },
  {
    name: "Jupiter",
    type: "Gas giant",
    distance: "778.5 million km from the Sun",
    diameter: "139,820 km",
    color: 0xc28b62
  },
  {
    name: "Saturn",
    type: "Gas giant",
    distance: "1.43 billion km from the Sun",
    diameter: "116,460 km",
    color: 0xd6c28a
  },
  {
    name: "Uranus",
    type: "Ice giant",
    distance: "2.87 billion km from the Sun",
    diameter: "50,724 km",
    color: 0x6ed6d0
  },
  {
    name: "Neptune",
    type: "Ice giant",
    distance: "4.50 billion km from the Sun",
    diameter: "49,244 km",
    color: 0x4169e1
  }
];

let scene;
let camera;
let renderer;
let controls;
let selectedPlanet = null;

function init() {

  scene = new THREE.Scene();

  scene.background = new THREE.Color(0x02030a);

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100000
  );

  camera.position.set(0, 25, 80);

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

  document.body.appendChild(renderer.domElement);

  // LUCI

  const ambientLight = new THREE.AmbientLight(
    0xffffff,
    1.5
  );

  scene.add(ambientLight);

  const sunLight = new THREE.PointLight(
    0xffffff,
    5,
    1000
  );

  scene.add(sunLight);

  // SOLE

  const sunGeometry =
    new THREE.SphereGeometry(7, 64, 64);

  const sunMaterial =
    new THREE.MeshBasicMaterial({
      color: 0xffcc33
    });

  const sun =
    new THREE.Mesh(
      sunGeometry,
      sunMaterial
    );

  sun.name = "Sun";

  scene.add(sun);

  // PIANETI

  planets.forEach((planet, index) => {

    const geometry =
      new THREE.SphereGeometry(
        index === 4 ? 3.5 :
        index === 5 ? 3 :
        1.8,
        48,
        48
      );

    const material =
      new THREE.MeshStandardMaterial({
        color: planet.color,
        roughness: 0.8
      });

    const mesh =
      new THREE.Mesh(
        geometry,
        material
      );

    const angle =
      (index / planets.length) *
      Math.PI * 2;

    const distance =
      15 + index * 6;

    mesh.position.x =
      Math.cos(angle) * distance;

    mesh.position.z =
      Math.sin(angle) * distance;

    mesh.userData = planet;

    scene.add(mesh);

  });

  // STELLE

  createStars();

  // CONTROLLI

  controls =
    new THREE.OrbitControls(
      camera,
      renderer.domElement
    );

  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 5;
  controls.maxDistance = 10000;

  // CLICK

  renderer.domElement.addEventListener(
    "click",
    selectObject
  );

  window.addEventListener(
    "resize",
    resize
  );

  animate();
}

function createStars() {

  const geometry =
    new THREE.BufferGeometry();

  const positions = [];

  for (let i = 0; i < 5000; i++) {

    positions.push(
      (Math.random() - 0.5) * 5000,
      (Math.random() - 0.5) * 5000,
      (Math.random() - 0.5) * 5000
    );

  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      positions,
      3
    )
  );

  const material =
    new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.5
    });

  const stars =
    new THREE.Points(
      geometry,
      material
    );

  scene.add(stars);
}

function selectObject(event) {

  const mouse =
    new THREE.Vector2();

  mouse.x =
    (event.clientX /
      window.innerWidth) * 2 - 1;

  mouse.y =
    -(event.clientY /
      window.innerHeight) * 2 + 1;

  const raycaster =
    new THREE.Raycaster();

  raycaster.setFromCamera(
    mouse,
    camera
  );

  const objects =
    scene.children.filter(
      object =>
        object.isMesh &&
        object.userData &&
        object.userData.name
    );

  const hits =
    raycaster.intersectObjects(
      objects
    );

  if (hits.length === 0) return;

  selectedPlanet =
    hits[0].object;

  showInfo(
    selectedPlanet.userData
  );

  focusObject(
    selectedPlanet
  );
}

function focusObject(object) {

  const target =
    object.position.clone();

  controls.target.copy(target);

  camera.position.set(
    target.x + 10,
    target.y + 5,
    target.z + 10
  );

}

function showInfo(data) {

  let panel =
    document.getElementById(
      "info-panel"
    );

  if (!panel) {

    panel =
      document.createElement(
        "div"
      );

    panel.id =
      "info-panel";

    document.body.appendChild(
      panel
    );

  }

  panel.innerHTML = `
    <button onclick="closeInfo()">×</button>

    <h1>${data.name}</h1>

    <h3>${data.type}</h3>

    <div class="info-section">
      <strong>Distance</strong>
      <p>${data.distance}</p>
    </div>

    <div class="info-section">
      <strong>Diameter</strong>
      <p>${data.diameter}</p>
    </div>

    <div class="info-section">
      <strong>Scientific data</strong>
      <p>Real astronomical reference data.</p>
    </div>

    <div class="info-section">
      <strong>Sources</strong>
      <p>NASA / ESA / astronomical catalogs</p>
    </div>
  `;

  panel.classList.add("visible");
}

function closeInfo() {

  const panel =
    document.getElementById(
      "info-panel"
    );

  if (panel) {
    panel.classList.remove(
      "visible"
    );
  }
}

function resize() {

  camera.aspect =
    window.innerWidth /
    window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );
}

function animate() {

  requestAnimationFrame(
    animate
  );

  controls.update();

  renderer.render(
    scene,
    camera
  );
}

init();
