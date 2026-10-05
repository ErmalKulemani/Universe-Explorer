const planets = [
  { name: "Mercury", type: "Rocky planet", distance: "57.9 million km", diameter: "4,879 km", color: 0x9b8f82 },
  { name: "Venus", type: "Rocky planet", distance: "108.2 million km", diameter: "12,104 km", color: 0xd9a441 },
  { name: "Earth", type: "Rocky planet", distance: "149.6 million km", diameter: "12,742 km", color: 0x2878c8 },
  { name: "Mars", type: "Rocky planet", distance: "227.9 million km", diameter: "6,779 km", color: 0xc94b35 },
  { name: "Jupiter", type: "Gas giant", distance: "778.5 million km", diameter: "139,820 km", color: 0xc28b62 },
  { name: "Saturn", type: "Gas giant", distance: "1.43 billion km", diameter: "116,460 km", color: 0xd6c28a },
  { name: "Uranus", type: "Ice giant", distance: "2.87 billion km", diameter: "50,724 km", color: 0x6ed6d0 },
  { name: "Neptune", type: "Ice giant", distance: "4.50 billion km", diameter: "49,244 km", color: 0x4169e1 }
];

let scene, camera, renderer;
let objects = [];
let rotationX = 0;
let rotationY = 0;
let zoom = 80;
let dragging = false;
let lastX = 0;
let lastY = 0;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x02030a);

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 1.5));

  const light = new THREE.PointLight(0xffffff, 5, 1000);
  scene.add(light);

  createSun();
  createPlanets();
  createStars();
  setupControls();

  window.addEventListener("resize", resize);

  animate();
}

function createSun() {
  const geometry = new THREE.SphereGeometry(7, 48, 48);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffcc33
  });

  const sun = new THREE.Mesh(geometry, material);
  sun.name = "Sun";
  scene.add(sun);
}

function createPlanets() {
  planets.forEach((planet, index) => {
    const size =
      index === 4 ? 3.5 :
      index === 5 ? 3 :
      1.8;

    const geometry = new THREE.SphereGeometry(size, 32, 32);

    const material = new THREE.MeshStandardMaterial({
      color: planet.color,
      roughness: 0.8
    });

    const mesh = new THREE.Mesh(geometry, material);

    const angle = (index / planets.length) * Math.PI * 2;
    const distance = 15 + index * 6;

    mesh.position.set(
      Math.cos(angle) * distance,
      0,
      Math.sin(angle) * distance
    );

    mesh.userData = planet;

    scene.add(mesh);
    objects.push(mesh);
  });
}

function createStars() {
  const geometry = new THREE.BufferGeometry();
  const positions = [];

  for (let i = 0; i < 4000; i++) {
    positions.push(
      (Math.random() - 0.5) * 4000,
      (Math.random() - 0.5) * 4000,
      (Math.random() - 0.5) * 4000
    );
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.5
  });

  scene.add(new THREE.Points(geometry, material));
}

function setupControls() {
  renderer.domElement.addEventListener("pointerdown", e => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });

  renderer.domElement.addEventListener("pointermove", e => {
    if (!dragging) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;

    rotationY += dx * 0.005;
    rotationX += dy * 0.005;

    lastX = e.clientX;
    lastY = e.clientY;
  });

  renderer.domElement.addEventListener("pointerup", () => {
    dragging = false;
  });

  renderer.domElement.addEventListener("pointercancel", () => {
    dragging = false;
  });

  renderer.domElement.addEventListener("wheel", e => {
    zoom += e.deltaY * 0.05;
    zoom = Math.max(15, Math.min(500, zoom));
  });

  renderer.domElement.addEventListener("click", selectObject);
}

function selectObject(event) {
  const mouse = new THREE.Vector2();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const hits = raycaster.intersectObjects(objects);

  if (hits.length > 0) {
    showInfo(hits[0].object.userData);
  }
}

function showInfo(data) {
  const panel = document.getElementById("info-panel");

  panel.innerHTML = `
    <button onclick="closeInfo()">×</button>

    <h1>${data.name}</h1>

    <p>${data.type}</p>

    <div class="info-section">
      <strong>Distance from Sun</strong>
      <p>${data.distance}</p>
    </div>

    <div class="info-section">
      <strong>Diameter</strong>
      <p>${data.diameter}</p>
    </div>
  `;

  panel.classList.add("info-panel");
}

function closeInfo() {
  const panel = document.getElementById("info-panel");
  panel.innerHTML = "";
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  camera.position.x = Math.sin(rotationY) * zoom;
  camera.position.z = Math.cos(rotationY) * zoom;
  camera.position.y = rotationX * 30;

  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}

init();
