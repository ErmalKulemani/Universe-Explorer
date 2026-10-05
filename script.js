/* =========================================================
   UNIVERSE EXPLORER
   Advanced 3D Solar System Engine
   ========================================================= */

const planets = [
  {
    name: "Mercury",
    type: "ROCKY PLANET",
    distance: "57.9 million km",
    diameter: "4,879 km",
    mass: "3.301 × 10²³ kg",
    temperature: "440 K",
    description:
      "Mercury is the smallest planet in the Solar System and the closest planet to the Sun.",
    orbit: 11,
    size: 0.75,
    speed: 0.020,
    color: 0x8b8178
  },

  {
    name: "Venus",
    type: "ROCKY PLANET",
    distance: "108.2 million km",
    diameter: "12,104 km",
    mass: "4.867 × 10²⁴ kg",
    temperature: "737 K",
    description:
      "Venus has a dense carbon-dioxide atmosphere and is the hottest planet in the Solar System.",
    orbit: 16,
    size: 1.15,
    speed: 0.014,
    color: 0xd4a05e
  },

  {
    name: "Earth",
    type: "ROCKY PLANET",
    distance: "149.6 million km",
    diameter: "12,742 km",
    mass: "5.972 × 10²⁴ kg",
    temperature: "288 K",
    description:
      "Earth is the third planet from the Sun and the only known astronomical body supporting life.",
    orbit: 21,
    size: 1.3,
    speed: 0.010,
    color: 0x2d72c8
  },

  {
    name: "Mars",
    type: "ROCKY PLANET",
    distance: "227.9 million km",
    diameter: "6,779 km",
    mass: "6.417 × 10²³ kg",
    temperature: "210 K",
    description:
      "Mars is a cold terrestrial planet with a thin atmosphere and a surface shaped by ancient geological activity.",
    orbit: 27,
    size: 1.0,
    speed: 0.008,
    color: 0xb84b35
  },

  {
    name: "Jupiter",
    type: "GAS GIANT",
    distance: "778.5 million km",
    diameter: "139,820 km",
    mass: "1.898 × 10²⁷ kg",
    temperature: "165 K",
    description:
      "Jupiter is the largest planet in the Solar System and is dominated by hydrogen and helium.",
    orbit: 37,
    size: 3.25,
    speed: 0.004,
    color: 0xb88763
  },

  {
    name: "Saturn",
    type: "GAS GIANT",
    distance: "1.43 billion km",
    diameter: "116,460 km",
    mass: "5.683 × 10²⁶ kg",
    temperature: "134 K",
    description:
      "Saturn is a gas giant famous for its extensive system of bright planetary rings.",
    orbit: 48,
    size: 2.85,
    speed: 0.003,
    color: 0xd2bd88
  },

  {
    name: "Uranus",
    type: "ICE GIANT",
    distance: "2.87 billion km",
    diameter: "50,724 km",
    mass: "8.681 × 10²⁵ kg",
    temperature: "76 K",
    description:
      "Uranus is an ice giant with an unusual axial tilt that causes extreme seasonal variations.",
    orbit: 59,
    size: 2.0,
    speed: 0.002,
    color: 0x6bd0d0
  },

  {
    name: "Neptune",
    type: "ICE GIANT",
    distance: "4.50 billion km",
    diameter: "49,244 km",
    mass: "1.024 × 10²⁶ kg",
    temperature: "72 K",
    description:
      "Neptune is the farthest major planet from the Sun and has some of the fastest winds in the Solar System.",
    orbit: 70,
    size: 2.0,
    speed: 0.0015,
    color: 0x4169e1
  }
];


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let scene;
let camera;
let renderer;

let sun;
let earth;
let moon;

const celestialObjects = [];
const orbitObjects = [];

let cameraYaw = 0.35;
let cameraPitch = 0.35;

let cameraDistance = 105;

let dragging = false;

let lastPointerX = 0;
let lastPointerY = 0;

let pinchDistance = 0;

let selectedObject = null;

let focusTarget = new THREE.Vector3();
let focusActive = false;

let targetCameraDistance = 105;

const clock = new THREE.Clock();


/* =========================================================
   INITIALIZATION
   ========================================================= */

function init() {

  scene = new THREE.Scene();

  scene.background = new THREE.Color(0x000208);

  createCamera();

  createRenderer();

  createLighting();

  createSun();

  createPlanets();

  createAsteroidBelt();

  createStars();

  createNebulaDust();

  setupInteraction();

  setupUI();

  window.addEventListener("resize", onResize);

  animate();
}


/* =========================================================
   CAMERA
   ========================================================= */

function createCamera() {

  camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    20000
  );

  updateCamera();
}


function updateCamera() {

  const horizontal =
    Math.cos(cameraPitch) * cameraDistance;

  camera.position.x =
    Math.sin(cameraYaw) * horizontal;

  camera.position.z =
    Math.cos(cameraYaw) * horizontal;

  camera.position.y =
    Math.sin(cameraPitch) * cameraDistance;

  camera.lookAt(focusTarget);
}


/* =========================================================
   RENDERER
   ========================================================= */

function createRenderer() {

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance"
  });

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 1.8)
  );

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

  renderer.outputColorSpace =
    THREE.SRGBColorSpace;

  document
    .getElementById("universe")
    .appendChild(renderer.domElement);
}


/* =========================================================
   LIGHTING
   ========================================================= */

function createLighting() {

  const ambient =
    new THREE.AmbientLight(
      0xffffff,
      0.18
    );

  scene.add(ambient);

  const sunLight =
    new THREE.PointLight(
      0xfff4d6,
      5,
      2000
    );

  sunLight.position.set(
    0,
    0,
    0
  );

  scene.add(sunLight);
}


/* =========================================================
   SUN
   ========================================================= */

function createSun() {

  const geometry =
    new THREE.SphereGeometry(
      6,
      64,
      64
    );

  const material =
    new THREE.MeshBasicMaterial({
      color: 0xffcc55
    });

  sun =
    new THREE.Mesh(
      geometry,
      material
    );

  sun.name = "Sun";

  sun.userData = {
    name: "Sun",
    type: "STAR",
    distance: "0 km",
    diameter: "1,392,700 km",
    mass: "1.989 × 10³⁰ kg",
    temperature: "5,778 K",
    description:
      "The Sun is the star at the center of our Solar System and contains almost all of its mass."
  };

  scene.add(sun);

  celestialObjects.push(sun);

  createSunGlow();
}


function createSunGlow() {

  const glowGeometry =
    new THREE.SphereGeometry(
      7.5,
      32,
      32
    );

  const glowMaterial =
    new THREE.MeshBasicMaterial({
      color: 0xffa533,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide
    });

  const glow =
    new THREE.Mesh(
      glowGeometry,
      glowMaterial
    );

  sun.add(glow);
}


/* =========================================================
   PLANETS
   ========================================================= */

function createPlanets() {

  planets.forEach((data, index) => {

    const planetGeometry =
      new THREE.SphereGeometry(
        data.size,
        48,
        48
      );

    const planetMaterial =
      new THREE.MeshStandardMaterial({
        color: data.color,
        roughness: 0.8,
        metalness: 0.0
      });

    const planet =
      new THREE.Mesh(
        planetGeometry,
        planetMaterial
      );

    planet.userData = data;

    planet.name = data.name;

    const angle =
      index * 0.8;

    planet.position.set(
      Math.cos(angle) * data.orbit,
      0,
      Math.sin(angle) * data.orbit
    );

    scene.add(planet);

    celestialObjects.push(planet);

    orbitObjects.push({
      mesh: planet,
      data: data,
      angle: angle
    });

    createOrbit(data.orbit);

    if (data.name === "Earth") {

      earth = planet;

      createMoon(planet);
    }

    if (data.name === "Saturn") {

      createSaturnRings(planet);
    }
  });
}


/* =========================================================
   ORBITS
   ========================================================= */

function createOrbit(radius) {

  const points = [];

  const segments = 160;

  for (let i = 0; i <= segments; i++) {

    const angle =
      (i / segments) *
      Math.PI *
      2;

    points.push(
      new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      )
    );
  }

  const geometry =
    new THREE.BufferGeometry()
      .setFromPoints(points);

  const material =
    new THREE.LineBasicMaterial({
      color: 0x244b6e,
      transparent: true,
      opacity: 0.32
    });

  const line =
    new THREE.Line(
      geometry,
      material
    );

  scene.add(line);
}


/* =========================================================
   EARTH + MOON
   ========================================================= */

function createMoon(parent) {

  const geometry =
    new THREE.SphereGeometry(
      0.35,
      32,
      32
    );

  const material =
    new THREE.MeshStandardMaterial({
      color: 0xb9b9b9,
      roughness: 1
    });

  moon =
    new THREE.Mesh(
      geometry,
      material
    );

  moon.name = "Moon";

  moon.userData = {
    name: "Moon",
    type: "NATURAL SATELLITE",
    distance: "384,400 km from Earth",
    diameter: "3,474 km",
    mass: "7.342 × 10²² kg",
    temperature: "250 K",
    description:
      "The Moon is Earth's natural satellite and the fifth-largest moon in the Solar System."
  };

  scene.add(moon);

  celestialObjects.push(moon);

  moon.userData.orbitParent = parent;

  moon.userData.orbitAngle = 0;
}


/* =========================================================
   SATURN RINGS
   ========================================================= */

function createSaturnRings(parent) {

  const geometry =
    new THREE.RingGeometry(
      parent.userData.size * 1.45,
      parent.userData.size * 2.25,
      96
    );

  const material =
    new THREE.MeshBasicMaterial({
      color: 0xc7b58d,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75
    });

  const rings =
    new THREE.Mesh(
      geometry,
      material
    );

  rings.rotation.x =
    Math.PI / 2.2;

  parent.add(rings);
}


/* =========================================================
   ASTEROID BELT
   ========================================================= */

function createAsteroidBelt() {

  const count = 900;

  const positions =
    new Float32Array(
      count * 3
    );

  for (let i = 0; i < count; i++) {

    const angle =
      Math.random() *
      Math.PI *
      2;

    const radius =
      31 +
      Math.random() * 3.5;

    const height =
      (Math.random() - 0.5) *
      1.2;

    positions[i * 3] =
      Math.cos(angle) * radius;

    positions[i * 3 + 1] =
      height;

    positions[i * 3 + 2] =
      Math.sin(angle) * radius;
  }

  const geometry =
    new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      positions,
      3
    )
  );

  const material =
    new THREE.PointsMaterial({
      color: 0x9a8f83,
      size: 0.09,
      transparent: true,
      opacity: 0.8
    });

  const belt =
    new THREE.Points(
      geometry,
      material
    );

  scene.add(belt);
}


/* =========================================================
   STARS
   ========================================================= */

function createStars() {

  const count = 12000;

  const positions =
    new Float32Array(
      count * 3
    );

  for (let i = 0; i < count; i++) {

    const radius =
      300 +
      Math.random() * 7000;

    const theta =
      Math.random() *
      Math.PI *
      2;

    const phi =
      Math.acos(
        2 * Math.random() - 1
      );

    positions[i * 3] =
      radius *
      Math.sin(phi) *
      Math.cos(theta);

    positions[i * 3 + 1] =
      radius *
      Math.cos(phi);

    positions[i * 3 + 2] =
      radius *
      Math.sin(phi) *
      Math.sin(theta);
  }

  const geometry =
    new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      positions,
      3
    )
  );

  const material =
    new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.15,
      transparent: true,
      opacity: 0.85
    });

  const stars =
    new THREE.Points(
      geometry,
      material
    );

  scene.add(stars);
}


/* =========================================================
   BACKGROUND DUST
   ========================================================= */

function createNebulaDust() {

  const count = 2500;

  const positions =
    new Float32Array(
      count * 3
    );

  for (let i = 0; i < count; i++) {

    positions[i * 3] =
      (Math.random() - 0.5) *
      900;

    positions[i * 3 + 1] =
      (Math.random() - 0.5) *
      900;

    positions[i * 3 + 2] =
      (Math.random() - 0.5) *
      900;
  }

  const geometry =
    new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      positions,
      3
    )
  );

  const material =
    new THREE.PointsMaterial({
      color: 0x31557a,
      size: 0.35,
      transparent: true,
      opacity: 0.25
    });

  scene.add(
    new THREE.Points(
      geometry,
      material
    )
  );
}


/* =========================================================
   INTERACTION
   ========================================================= */

function setupInteraction() {

  const canvas =
    renderer.domElement;

  canvas.addEventListener(
    "pointerdown",
    pointerDown
  );

  canvas.addEventListener(
    "pointermove",
    pointerMove
  );

  canvas.addEventListener(
    "pointerup",
    pointerUp
  );

  canvas.addEventListener(
    "pointercancel",
    pointerUp
  );

  canvas.addEventListener(
    "wheel",
    event => {

      event.preventDefault();

      cameraDistance +=
        event.deltaY * 0.08;

      cameraDistance =
        THREE.MathUtils.clamp(
          cameraDistance,
          8,
          800
        );
    },
    { passive: false }
  );

  canvas.addEventListener(
    "click",
    selectObject
  );

  canvas.addEventListener(
    "touchstart",
    handleTouchStart,
    { passive: false }
  );

  canvas.addEventListener(
    "touchmove",
    handleTouchMove,
    { passive: false }
  );
}


function pointerDown(event) {

  dragging = true;

  lastPointerX =
    event.clientX;

  lastPointerY =
    event.clientY;
}


function pointerMove(event) {

  if (!dragging) return;

  const dx =
    event.clientX -
    lastPointerX;

  const dy =
    event.clientY -
    lastPointerY;

  cameraYaw -=
    dx * 0.005;

  cameraPitch -=
    dy * 0.005;

  cameraPitch =
    THREE.MathUtils.clamp(
      cameraPitch,
      -1.4,
      1.4
    );

  lastPointerX =
    event.clientX;

  lastPointerY =
    event.clientY;
}


function pointerUp() {

  dragging = false;
}


/* =========================================================
   TOUCH / PINCH ZOOM
   ========================================================= */

function handleTouchStart(event) {

  if (event.touches.length === 2) {

    pinchDistance =
      getTouchDistance(event.touches);
  }
}


function handleTouchMove(event) {

  if (event.touches.length !== 2) return;

  event.preventDefault();

  const distance =
    getTouchDistance(event.touches);

  const difference =
    distance -
    pinchDistance;

  cameraDistance -=
    difference * 0.12;

  cameraDistance =
    THREE.MathUtils.clamp(
      cameraDistance,
      8,
      800
    );

  pinchDistance =
    distance;
}


function getTouchDistance(touches) {

  const dx =
    touches[0].clientX -
    touches[1].clientX;

  const dy =
    touches[0].clientY -
    touches[1].clientY;

  return Math.sqrt(
    dx * dx +
    dy * dy
  );
}


/* =========================================================
   OBJECT SELECTION
   ========================================================= */

function selectObject(event) {

  if (dragging) return;

  const mouse =
    new THREE.Vector2();

  mouse.x =
    (event.clientX /
      window.innerWidth) *
      2 -
    1;

  mouse.y =
    -(event.clientY /
      window.innerHeight) *
      2 +
    1;

  const raycaster =
    new THREE.Raycaster();

  raycaster.setFromCamera(
    mouse,
    camera
  );

  const hits =
    raycaster.intersectObjects(
      celestialObjects
    );

  if (!hits.length) return;

  const object =
    hits[0].object;

  selectedObject =
    object;

  showObject(object.userData);

  focusObject(object);
}


/* =========================================================
   FOCUS CAMERA
   ========================================================= */

function focusObject(object) {

  if (!object) return;

  focusTarget =
    object.position.clone();

  targetCameraDistance =
    Math.max(
      object.userData?.size
        ? object.userData.size * 7
        : 12,
      8
    );

  cameraDistance =
    targetCameraDistance;

  focusActive = true;
}


/* =========================================================
   UI
   ========================================================= */

function setupUI() {

  const closeButton =
    document.getElementById(
      "close-panel"
    );

  closeButton.addEventListener(
    "click",
    closePanel
  );

  document
    .getElementById("zoom-in")
    .addEventListener(
      "click",
      () => {

        cameraDistance *= 0.75;

        cameraDistance =
          Math.max(
            8,
            cameraDistance
          );
      }
    );

  document
    .getElementById("zoom-out")
    .addEventListener(
      "click",
      () => {

        cameraDistance *= 1.3;

        cameraDistance =
          Math.min(
            800,
            cameraDistance
          );
      }
    );

  document
    .getElementById("reset-camera")
    .addEventListener(
      "click",
      resetCamera
    );

  document
    .getElementById("focus-button")
    .addEventListener(
      "click",
      () => {

        if (selectedObject) {
          focusObject(
            selectedObject
          );
        }
      }
    );

  const search =
    document.getElementById(
      "search"
    );

  search.addEventListener(
    "keydown",
    event => {

      if (event.key === "Enter") {

        searchObject(
          search.value
        );
      }
    }
  );

  document
    .getElementById("exploreButton")
    .addEventListener(
      "click",
      resetCamera
    );
}


function showObject(data) {

  if (!data) return;

  document
    .getElementById("object-type")
    .textContent =
    data.type || "CELESTIAL BODY";

  document
    .getElementById("object-name")
    .textContent =
    data.name || "Unknown";

  document
    .getElementById("object-distance")
    .textContent =
    data.distance || "—";

  document
    .getElementById("object-diameter")
    .textContent =
    data.diameter || "—";

  document
    .getElementById("object-mass")
    .textContent =
    data.mass || "—";

  document
    .getElementById("object-temperature")
    .textContent =
    data.temperature || "—";

  document
    .getElementById("object-description")
    .textContent =
    data.description || "";

  document
    .getElementById("object-panel")
    .classList.add("visible");
}


function closePanel() {

  document
    .getElementById("object-panel")
    .classList.remove("visible");

  selectedObject = null;
}


function resetCamera() {

  focusTarget.set(
    0,
    0,
    0
  );

  cameraYaw = 0.35;

  cameraPitch = 0.35;

  cameraDistance = 105;

  closePanel();
}


/* =========================================================
   SEARCH
   ========================================================= */

function searchObject(query) {

  const text =
    query
      .trim()
      .toLowerCase();

  if (!text) return;

  const object =
    celestialObjects.f
