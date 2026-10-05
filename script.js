/* =========================================================
   UNIVERSE EXPLORER
   Main 3D engine
   Three.js
   ========================================================= */

"use strict";

/* =========================================================
   BASIC SETUP
   ========================================================= */

const universe = document.getElementById("universe");

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x000207);

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.01,
  100000
);

camera.position.set(0, 18, 42);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false
});

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio || 1, 2)
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.outputColorSpace = THREE.SRGBColorSpace;

universe.appendChild(renderer.domElement);


/* =========================================================
   LIGHTING
   ========================================================= */

const ambientLight = new THREE.AmbientLight(
  0xffffff,
  0.18
);

scene.add(ambientLight);

const sunLight = new THREE.PointLight(
  0xffffff,
  4,
  500
);

sunLight.position.set(0, 0, 0);

scene.add(sunLight);


/* =========================================================
   GROUPS
   ========================================================= */

const universeGroup = new THREE.Group();

const solarSystemGroup = new THREE.Group();

const galaxyGroup = new THREE.Group();

const largeScaleGroup = new THREE.Group();

scene.add(universeGroup);
universeGroup.add(solarSystemGroup);
universeGroup.add(galaxyGroup);
universeGroup.add(largeScaleGroup);


/* =========================================================
   OBJECT DATABASE
   ========================================================= */

const OBJECTS = {

  Sun: {
    name: "Sun",
    type: "STAR",
    distance: "0 AU from Earth",
    size: "1,391,000 km",
    mass: "1.989 × 10³⁰ kg",
    temperature: "≈ 5,500 °C surface",
    color: 0xffcc66,
    radius: 3.8
  },

  Mercury: {
    name: "Mercury",
    type: "PLANET",
    distance: "≈ 77 million km",
    size: "4,879 km",
    mass: "3.301 × 10²³ kg",
    temperature: "≈ 167 °C average",
    color: 0x9d9990,
    radius: 0.55
  },

  Venus: {
    name: "Venus",
    type: "PLANET",
    distance: "≈ 41 million km",
    size: "12,104 km",
    mass: "4.867 × 10²⁴ kg",
    temperature: "≈ 464 °C average",
    color: 0xd9b27a,
    radius: 0.95
  },

  Earth: {
    name: "Earth",
    type: "PLANET",
    distance: "1 AU",
    size: "12,742 km",
    mass: "5.972 × 10²⁴ kg",
    temperature: "≈ 15 °C average",
    color: 0x4d8dff,
    radius: 1.05
  },

  Moon: {
    name: "Moon",
    type: "NATURAL SATELLITE",
    distance: "≈ 384,400 km from Earth",
    size: "3,475 km",
    mass: "7.342 × 10²² kg",
    temperature: "Extreme surface variation",
    color: 0xb7b7b7,
    radius: 0.28
  },

  Mars: {
    name: "Mars",
    type: "PLANET",
    distance: "≈ 225 million km",
    size: "6,779 km",
    mass: "6.417 × 10²³ kg",
    temperature: "≈ −63 °C average",
    color: 0xb65f45,
    radius: 0.78
  },

  Jupiter: {
    name: "Jupiter",
    type: "GAS GIANT",
    distance: "≈ 778 million km",
    size: "139,820 km",
    mass: "1.898 × 10²⁷ kg",
    temperature: "≈ −110 °C cloud tops",
    color: 0xd5b58c,
    radius: 2.9
  },

  Saturn: {
    name: "Saturn",
    type: "GAS GIANT",
    distance: "≈ 1.43 billion km",
    size: "116,460 km",
    mass: "5.683 × 10²⁶ kg",
    temperature: "≈ −140 °C cloud tops",
    color: 0xd7c18e,
    radius: 2.55
  },

  Uranus: {
    name: "Uranus",
    type: "ICE GIANT",
    distance: "≈ 2.87 billion km",
    size: "50,724 km",
    mass: "8.681 × 10²⁵ kg",
    temperature: "≈ −195 °C",
    color: 0x75d7d9,
    radius: 1.7
  },

  Neptune: {
    name: "Neptune",
    type: "ICE GIANT",
    distance: "≈ 4.50 billion km",
    size: "49,244 km",
    mass: "1.024 × 10²⁶ kg",
    temperature: "≈ −200 °C",
    color: 0x4779e6,
    radius: 1.7
  },

  Pluto: {
    name: "Pluto",
    type: "DWARF PLANET",
    distance: "≈ 5.9 billion km",
    size: "2,377 km",
    mass: "1.303 × 10²² kg",
    temperature: "≈ −229 °C",
    color: 0xb9a99a,
    radius: 0.48
  },

  "Sagittarius A*": {
    name: "Sagittarius A*",
    type: "SUPERMASSIVE BLACK HOLE",
    distance: "≈ 26,700 light-years",
    size: "≈ 24 million km event-horizon diameter",
    mass: "≈ 4.3 million solar masses",
    temperature: "Accretion environment varies",
    color: 0x090909,
    radius: 2.4
  },

  "Milky Way": {
    name: "Milky Way",
    type: "BARRED SPIRAL GALAXY",
    distance: "Our galaxy",
    size: "≈ 100,000 light-years",
    mass: "≈ 1.5 trillion solar masses",
    temperature: "Multiple components",
    color: 0x9ec9ff,
    radius: 15
  },

  "Andromeda Galaxy": {
    name: "Andromeda Galaxy",
    type: "SPIRAL GALAXY",
    distance: "≈ 2.54 million light-years",
    size: "≈ 220,000 light-years",
    mass: "≈ 1 trillion solar masses",
    temperature: "Multiple components",
    color: 0xaed8ff,
    radius: 18
  }

};


/* =========================================================
   SOLAR SYSTEM DATA
   ========================================================= */

const planetData = [

  {
    key: "Mercury",
    orbit: 8,
    speed: 0.020
  },

  {
    key: "Venus",
    orbit: 12,
    speed: 0.015
  },

  {
    key: "Earth",
    orbit: 17,
    speed: 0.011
  },

  {
    key: "Mars",
    orbit: 22,
    speed: 0.009
  },

  {
    key: "Jupiter",
    orbit: 30,
    speed: 0.005
  },

  {
    key: "Saturn",
    orbit: 40,
    speed: 0.0035
  },

  {
    key: "Uranus",
    orbit: 50,
    speed: 0.0023
  },

  {
    key: "Neptune",
    orbit: 60,
    speed: 0.0017
  },

  {
    key: "Pluto",
    orbit: 70,
    speed: 0.001
  }

];


/* =========================================================
   MATERIAL HELPERS
   ========================================================= */

function createPlanetMaterial(color) {

  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.82,
    metalness: 0.02
  });

}


function createStarMaterial(color, emissiveIntensity = 1) {

  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity,
    roughness: 0.25,
    metalness: 0
  });

}


/* =========================================================
   SUN
   ========================================================= */

const sunGeometry = new THREE.SphereGeometry(
  OBJECTS.Sun.radius,
  64,
  64
);

const sunMaterial = createStarMaterial(
  OBJECTS.Sun.color,
  2.2
);

const sun = new THREE.Mesh(
  sunGeometry,
  sunMaterial
);

sun.name = "Sun";

solarSystemGroup.add(sun);


/* Sun glow */

const sunGlowGeometry = new THREE.SphereGeometry(
  5.2,
  48,
  48
);

const sunGlowMaterial = new THREE.MeshBasicMaterial({
  color: 0xffb733,
  transparent: true,
  opacity: 0.08,
  side: THREE.BackSide
});

const sunGlow = new THREE.Mesh(
  sunGlowGeometry,
  sunGlowMaterial
);

sun.add(sunGlow);


/* =========================================================
   PLANETS
   ========================================================= */

const planetObjects = {};

const planetPivots = {};

for (const data of planetData) {

  const objectInfo = OBJECTS[data.key];

  const pivot = new THREE.Group();

  planetPivots[data.key] = pivot;

  solarSystemGroup.add(pivot);

  const geometry = new THREE.SphereGeometry(
    objectInfo.radius,
    48,
    48
  );

  const material = createPlanetMaterial(
    objectInfo.color
  );

  const planet = new THREE.Mesh(
    geometry,
    material
  );

  planet.name = data.key;

  planet.userData.objectKey = data.key;

  planet.position.x = data.orbit;

  pivot.add(planet);

  planetObjects[data.key] = planet;


  /* Orbit line */

  const orbitGeometry =
    new THREE.RingGeometry(
      data.orbit - 0.012,
      data.orbit + 0.012,
      256
    );

  const orbitMaterial =
    new THREE.MeshBasicMaterial({
      color: 0x2b8bb5,
      transparent: true,
      opacity: 0.13,
      side: THREE.DoubleSide
    });

  const orbit = new THREE.Mesh(
    orbitGeometry,
    orbitMaterial
  );

  orbit.rotation.x = Math.PI / 2;

  solarSystemGroup.add(orbit);

}


/* =========================================================
   MOON
   ========================================================= */

const moonPivot = new THREE.Group();

planetObjects.Earth.add(moonPivot);

const moonGeometry = new THREE.SphereGeometry(
  OBJECTS.Moon.radius,
  32,
  32
);

const moonMaterial = createPlanetMaterial(
  OBJECTS.Moon.color
);

const moon = new THREE.Mesh(
  moonGeometry,
  moonMaterial
);

moon.name = "Moon";

moon.userData.objectKey = "Moon";

moon.position.set(
  2.2,
  0,
  0
);

moonPivot.add(moon);


/* =========================================================
   SATURN RINGS
   ========================================================= */

const saturn = planetObjects.Saturn;

const ringGeometry = new THREE.RingGeometry(
  3.6,
  5.1,
  96
);

const ringMaterial = new THREE.MeshBasicMaterial({
  color: 0xb9aa83,
  transparent: true,
  opacity: 0.68,
  side: THREE.DoubleSide
});

const rings = new THREE.Mesh(
  ringGeometry,
  ringMaterial
);

rings.rotation.x = Math.PI / 2.4;

saturn.add(rings);


/* =========================================================
   ASTEROID BELT
   ========================================================= */

const asteroidCount = 900;

const asteroidGeometry =
  new THREE.BufferGeometry();

const asteroidPositions =
  new Float32Array(asteroidCount * 3);

for (let i = 0; i < asteroidCount; i++) {

  const angle =
    Math.random() * Math.PI * 2;

  const radius =
    25 + Math.random() * 4;

  const y =
    (Math.random() - 0.5) * 1.3;

  asteroidPositions[i * 3] =
    Math.cos(angle) * radius;

  asteroidPositions[i * 3 + 1] =
    y;

  asteroidPositions[i * 3 + 2] =
    Math.sin(angle) * radius;

}

asteroidGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(
    asteroidPositions,
    3
  )
);

const asteroidMaterial =
  new THREE.PointsMaterial({
    color: 0x8b8175,
    size: 0.07,
    transparent: true,
    opacity: 0.7
  });

const asteroidBelt = new THREE.Points(
  asteroidGeometry,
  asteroidMaterial
);

solarSystemGroup.add(asteroidBelt);


/* =========================================================
   STAR FIELD
   ========================================================= */

function createStarField(
  count,
  radius,
  size,
  opacity
) {

  const geometry =
    new THREE.BufferGeometry();

  const positions =
    new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {

    const r =
      radius * Math.pow(Math.random(), 0.35);

    const theta =
      Math.random() * Math.PI * 2;

    const phi =
      Math.acos(
        2 * Math.random() - 1
      );

    positions[i * 3] =
      r * Math.sin(phi) * Math.cos(theta);

    positions[i * 3 + 1] =
      r * Math.cos(phi);

    positions[i * 3 + 2] =
      r * Math.sin(phi) * Math.sin(theta);

  }

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      positions,
      3
    )
  );

  const material =
    new THREE.PointsMaterial({
      color: 0xbfdfff,
      size,
      transparent: true,
      opacity,
      depthWrite: false
    });

  return new THREE.Points(
    geometry,
    material
  );

}

const stars = createStarField(
  12000,
  900,
  0.65,
  0.8
);

scene.add(stars);


/* =========================================================
   MILKY WAY
   ========================================================= */

function createGalaxy(
  radius,
  arms,
  starsCount,
  color
) {

  const geometry =
    new THREE.BufferGeometry();

  const positions =
    new Float32Array(
      starsCount * 3
    );

  for (let i = 0; i < starsCount; i++) {

    const r =
      Math.pow(Math.random(), 0.65) *
      radius;

    const arm =
      Math.floor(
        Math.random() * arms
      );

    const baseAngle =
      (arm / arms) *
      Math.PI * 2;

    const spiral =
      r * 0.32;

    const angle =
      baseAngle +
      spiral +
      (Math.random() - 0.5) *
      0.65;

    const thickness =
      (Math.random() - 0.5) *
      Math.max(0.2, radius * 0.035);

    positions[i * 3] =
      Math.cos(angle) * r;

    positions[i * 3 + 1] =
      thickness *
      (1 - r / radius);

    positions[i * 3 + 2] =
      Math.sin(angle) * r;

  }

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      positions,
      3
    )
  );

  const material =
    new THREE.PointsMaterial({
      color,
      size: 0.09,
      transparent: true,
      opacity: 0.72,
      depthWrite: false
    });

  return new THREE.Points(
    geometry,
    material
  );

}

const milkyWayVisual =
  createGalaxy(
    85,
    5,
    18000,
    0x8dbdff
  );

milkyWayVisual.rotation.x = 0.18;

galaxyGroup.add(milkyWayVisual);


/* =========================================================
   ANDROMEDA
   ========================================================= */

const andromedaVisual =
  createGalaxy(
    105,
    4,
    14000,
    0xb8d8ff
  );

andromedaVisual.scale.set(
  0.72,
  0.25,
  0.72
);

andromedaVisual.position.set(
  160,
  20,
  -80
);

andromedaVisual.rotation.x =
  -0.45;

galaxyGroup.add(andromedaVisual);


/* =========================================================
   SAGITTARIUS A*
   ========================================================= */

const blackHoleGroup =
  new THREE.Group();

blackHoleGroup.position.set(
  0,
  0,
  0
);

galaxyGroup.add(blackHoleGroup);

const blackHoleGeometry =
  new THREE.SphereGeometry(
    3,
    64,
    64
  );

const blackHoleMaterial =
  new THREE.MeshBasicMaterial({
    color: 0x000000
  });

const blackHole =
  new THREE.Mesh(
    blackHoleGeometry,
    blackHoleMaterial
  );

blackHole.name =
  "Sagittarius A*";

blackHole.userData.objectKey =
  "Sagittarius A*";

blackHoleGroup.add(blackHole);


/* Accretion disk */

const diskGeometry =
  new THREE.RingGeometry(
    4,
    10,
    128
  );

const diskMaterial =
  new THREE.MeshBasicMaterial({
    color: 0xff7b32,
    transparent: true,
    opacity: 0.65,
    side: THREE.DoubleSide
  });

const disk =
  new THREE.Mesh(
    diskGeometry,
    diskMaterial
  );

disk.rotation.x =
  Math.PI / 2;

blackHoleGroup.add(disk);


/* =========================================================
   LARGE-SCALE UNIVERSE
   ========================================================= */

const largeScaleGeometry =
  new THREE.BufferGeometry();

const largeScaleCount = 1800;

const largeScalePositions =
  new Float32Array(
    largeScaleCount * 3
  );

for (let i = 0; i < largeScaleCount; i++) {

  const x =
    (Math.random() - 0.5) * 600;

  const y =
    (Math.random() - 0.5) * 250;

  const z =
    (Math.random() - 0.5) * 600;

  largeScalePositions[i * 3] = x;
  largeScalePositions[i * 3 + 1] = y;
  largeScalePositions[i * 3 + 2] = z;

}

largeScaleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(
    largeScalePositions,
    3
  )
);

const largeScaleMaterial =
  new THREE.PointsMaterial({
    color: 0x6faeff,
    size: 0.8,
    transparent: true,
    opacity: 0.45,
    depthWrite: false
  });

const largeScaleUniverse =
  new THREE.Points(
    largeScaleGeometry,
    largeScaleMaterial
  );

largeScaleGroup.add(
  largeScaleUniverse
);


/* =========================================================
   VISIBILITY MODES
   ========================================================= */

function setMode(mode) {

  solarSystemGroup.visible =
    mode === "solar";

  galaxyGroup.visible =
    mode === "galaxies" ||
    mode === "blackholes" ||
    mode === "universe";

  largeScaleGroup.visible =
    mode === "universe";

  if (mode === "blackholes") {

    focusObject(
      blackHole,
      "Sagittarius A*"
    );

    showToast(
      "SAGITTARIUS A* — BLACK HOLE MODE"
    );

  }

  if (mode === "galaxies") {

    cameraTarget.set(
      35,
      35,
      120
    );

    showToast(
      "GALAXY EXPLORATION MODE"
    );

  }

  if (mode === "universe") {

    cameraTarget.set(
      0,
      80,
      300
    );

    showToast(
      "LARGE-SCALE UNIVERSE VIEW"
    );

  }

  if (mode === "solar") {

    cameraTarget.set(
      0,
      15,
      42
    );

    showToast(
      "SOLAR SYSTEM MODE"
    );

  }

  updateScaleDisplay(mode);

}


/* =========================================================
   CAMERA
   ========================================================= */

const cameraTarget =
  new THREE.Vector3(
    0,
    15,
    42
  );

let cameraFocus =
  new THREE.Vector3(
    0,
    0,
    0
  );

let focusObjectRef = null;

function focusObject(
  object,
  key
) {

  if (!object) return;

  selectedObject = object;

  focusObjectRef = object;

  cameraFocus.copy(
    object.getWorldPosition(
      new THREE.Vector3()
    )
  );

  const radius =
    OBJECTS[key]?.radius || 2;

  cameraTarget.copy(
    cameraFocus
  ).add(
    new THREE.Vector3(
      radius * 3.2,
      radius * 1.8,
      radius * 5
    )
  );

  openObjectPanel(key);
}


/* =========================================================
   CAMERA CONTROLS
   ========================================================= */

let isDragging = false;

let pointerMoved = false;

let previousX = 0;
let previousY = 0;

let cameraDistance = 42;

let cameraAzimuth = 0;
let cameraElevation = 0.3;


renderer.domElement.addEventListener(
  "pointerdown",
  event => {

    isDragging = true;

    pointerMoved = false;

    previousX = event.clientX;
    previousY = event.clientY;

    renderer.domElement.setPointerCapture(
      event.pointerId
    );

  }
);


renderer.domElement.addEventListener(
  "pointermove",
  event => {

    if (!isDragging) return;

    const dx =
      event.clientX - previousX;

    const dy =
      event.clientY - previousY;

    if (
      Math.abs(dx) > 2 ||
      Math.abs(dy) > 2
    ) {

      pointerMoved = true;

    }

    previousX = event.clientX;
    previousY = event.clientY;

    cameraAzimuth -=
      dx * 0.006;

    cameraElevation -=
      dy * 0.004;

    cameraElevation =
      THREE.MathUtils.clamp(
        cameraElevation,
        -1.35,
        1.35
      );

  }
);


renderer.domElement.addEventListener(
  "pointerup",
  event => {

    isDragging = false;

    try {

      renderer.domElement.releasePointerCapture(
        event.pointerId
      );

    } catch (_) {}

  }
);


renderer.domElement.addEventListener(
  "wheel",
  event => {

    event.preventDefault();

    cameraDistance *=
      1 + event.deltaY * 0.001;

    cameraDistance =
      THREE.MathUtils.clamp(
        cameraDistance,
        3,
        1500
      );

  },
  {
    passive: false
  }
);


/* =========================================================
   RAYCASTING
   ========================================================= */

const raycaster =
  new THREE.Raycaster();

const pointer =
  new THREE.Vector2();

let selectedObject = null;

renderer.domElement.addEventListener(
  "click",
  event => {

    if (pointerMoved) {

      pointerMoved = false;

      return;

    }

    const rect =
      renderer.domElement.getBoundingClientRect();

    pointer.x =
      ((event.clientX - rect.left) /
        rect.width) *
        2 - 1;

    pointer.y =
      -(
        (event.clientY - rect.top) /
        rect.height
      ) *
        2 + 1;

    raycaster.setFromCamera(
      pointer,
      camera
    );

    const objects = [
      ...Object.values(planetObjects),
      moon,
      sun,
      blackHole
    ];

    const hits =
      raycaster.intersectObjects(
        objects,
        true
      );

    if (!hits.length) return;

    let hit =
      hits[0].object;

    let key =
      hit.userData.objectKey ||
      hit.name;

    if (!key) return;

while (
  hit.parent &&
  !hit.userData.objectKey &&
  !hit.name
) {
  hit = hit.parent;
}

key =
  hit.userData.objectKey ||
  hit.name ||
  key;

if (OBJECTS[key]) {
  focusObject(
    hit,
    key
  );
}
);


/* =========================================================
   PANEL
   ========================================================= */

const objectPanel =
  document.getElementById(
    "object-panel"
  );

const objectName =
  document.getElementById(
    "object-name"
  );

const objectType =
  document.getElementById(
    "object-type"
  );

const panelContent =
  document.getElementById(
    "panel-content"
  );


function openObjectPanel(key) {

  const data =
    OBJECTS[key];

  if (!data) return;

  objectName.textContent =
    data.name;

  objectType.textContent =
    data.type;

  renderOverview(key);

  objectPanel.classList.add(
    "visible"
  );

}


function renderOverview(key) {

  const data =
    OBJECTS[key];

  panelContent.innerHTML = `

    <div class="fact">
      <span>Distance</span>
      <span>${data.distance}</span>
    </div>

    <div class="fact">
      <span>Size</span>
      <span>${data.size}</span>
    </div>

    <div class="fact">
      <span>Mass</span>
      <span>${data.mass}</span>
    </div>

    <div class="fact">
      <span>Temperature</span>
      <span>${data.temperature}</span>
    </div>

    <p style="
      margin-top:18px;
      color:#91adbb;
      line-height:1.7;
    ">
      Scientific representation using publicly
      available astronomical information.
      Visual distances and object sizes are
      compressed for interactive exploration.
    </p>

  `;

}


document
  .getElementById("close-panel")
  ?.addEventListener(
    "click",
    () => {

      objectPanel.classList.remove(
        "visible"
      );

      selectedObject = null;
      focusObjectRef = null;

    }
  );


document
  .getElementById("focus-button")
  ?.addEventListener(
    "click",
    () => {

      if (!selectedObject) return;

      const key =
        selectedObject.userData.objectKey ||
        selectedObject.name;

      focusObject(
        selectedObject,
        key
      );

    }
  );


/* =========================================================
   TABS
   ========================================================= */

document
  .querySelectorAll(
    ".object-tabs button"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(
            ".object-tabs button"
          )
          .forEach(
            b => b.classList.remove(
              "active"
            )
          );

        button.classList.add(
          "active"
        );

        const key =
          selectedObject?.userData
            ?.objectKey ||
          selectedObject?.name;

        if (!key) return;

        if (
          button.dataset.tab ===
          "overview"
        ) {

          renderOverview(key);

        }

        if (
          button.dataset.tab ===
          "facts"
        ) {

          renderFacts(key);

        }

        if (
          button.dataset.tab ===
          "history"
        ) {

          renderHistory(key);

        }

      }
    );

  });


function renderFacts(key) {

  const data =
    OBJECTS[key];

  panelContent.innerHTML = `

    <p>
      <strong style="color:#55eaff">
        ${data.name}
      </strong>
      is classified as a
      ${data.type.toLowerCase()}.
    </p>

    <div class="fact">
      <span>Catalog status</span>
      <span>REAL OBJECT</span>
    </div>

    <div class="fact">
      <span>Data status</span>
      <span>OBSERVED / ESTIMATED</span>
    </div>

    <div class="fact">
      <span>Visualization</span>
      <span>COMPRESSED SCALE</span>
    </div>

  `;

}


function renderHistory(key) {

  const messages = {

    Sun:
      "The Sun has been observed since antiquity and studied in detail with modern space missions.",

    Earth:
      "Earth is the only known astronomical body confirmed to support life.",

    Moon:
      "The Moon has been studied extensively, including direct exploration by crewed and robotic missions.",

    Mars:
      "Mars has been observed for centuries and explored by numerous robotic missions.",

    Jupiter:
      "Jupiter has been observed since antiquity and explored by spacecraft including Galileo and Juno.",

    Saturn:
      "Saturn's rings and moons have been studied extensively by missions including Cassini-Huygens.",

    Uranus:
      "Uranus was identified as a planet in the modern era after observations by William Herschel.",

    Neptune:
      "Neptune was mathematically predicted before being observed in 1846.",

    Pluto:
      "Pluto was discovered in 1930 and is now classified as a dwarf planet.",

    "Milky Way":
      "The structure of the Milky Way has been reconstructed through observations across many wavelengths.",

    "Andromeda Galaxy":
      "Andromeda has been observed for centuries and is one of the best-studied nearby galaxies.",

    "Sagittarius A*":
      "Sagittarius A* has been studied through observations of stars orbiting the compact object at the center of the Milky Way."

  };

  panelContent.innerHTML = `

    <p style="
      color:#a9c0cc;
      line-height:1.8;
    ">
      ${messages[key] ||
      "Astronomical observations and modern scientific measurements provide information about this object."}
    </p>

  `;

}


/* =========================================================
   SEARCH
   ========================================================= */

const search =
  document.getElementById(
    "search"
  );

const searchResults =
  document.getElementById(
    "search-results"
  );


function performSearch(query) {

  const text =
    query.trim().toLowerCase();

  searchResults.innerHTML = "";

  if (!text) {

    searchResults.classList.remove(
      "visible"
    );

    return;

  }

  const matches =
    Object.keys(OBJECTS)
      .filter(
        key =>
          key.toLowerCase()
            .includes(text)
      )
      .slice(0, 8);

  if (!matches.length) {

    searchResults.innerHTML =
      `<div class="search-result">
        No object found
      </div>`;

  } else {

    matches.forEach(key => {

      const item =
        document.createElement(
          "div"
        );

      item.className =
        "search-result";

      item.textContent =
        OBJECTS[key].name;

      item.addEventListener(
        "click",
        () => {

          search.value =
            OBJECTS[key].name;

          searchResults.classList.remove(
            "visible"
          );

          selectSearchObject(key);

        }
      );

      searchResults.appendChild(
        item
      );

    });

  }

  searchResults.classList.add(
    "visible"
  );

}


function selectSearchObject(key) {

  const object =
    getObjectByKey(key);

  if (!object) return;

  if (
    key === "Milky Way" ||
    key === "Andromeda Galaxy"
  ) {

    setMode("galaxies");

  }

  if (
    key === "Sagittarius A*"
  ) {

    setMode("blackholes");

  }

  if (
    key !== "Milky Way" &&
    key !== "Andromeda Galaxy" &&
    key !== "Sagittarius A*"
  ) {

    setMode("solar");

  }

  focusObject(
    object,
    key
  );

}


function getObjectByKey(key) {

  if (planetObjects[key])
    return planetObjects[key];

  if (key === "Moon")
    return moon;

  if (key === "Sun")
    return sun;

  if (key === "Sagittarius A*")
    return blackHole;

  if (key === "Milky Way")
    return milkyWayVisual;

  if (key === "Andromeda Galaxy")
    return andromedaVisual;

  return null;

}


search?.addEventListener(
  "input",
  () => {

    performSearch(
      search.value
    );

  }
);


search?.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Enter"
    ) {

      const first =
        Object.keys(OBJECTS)
          .find(key =>
            key.toLowerCase()
              .includes(
                search.value
                  .trim()
                  .toLowerCase()
              )
          );

      if (first) {

        selectSearchObject(
          first
        );

        searchResults.classList.remove(
          "visible"
        );

      }

    }

  }
);


/* =========================================================
   SIDE MENU
   ========================================================= */

const menu =
  document.getElementById(
    "side-menu"
  );

document
  .getElementById("menuButton")
  ?.addEventListener(
    "click",
    () => {

      menu.classList.toggle(
        "visible"
      );

    }
  );


document
  .querySelectorAll(
    "#side-menu button"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const action =
          button.dataset.action;

        menu.classList.remove(
          "visible"
        );

        handleAction(action);

      }
    );

  });


function handleAction(action) {

  if (action === "solar")
    setMode("solar");

  if (action === "galaxies")
    setMode("galaxies");

  if (action === "blackholes")
    setMode("blackholes");

  if (action === "compare")
    openCompare();

  if (action === "time")
    openTimeTravel();

  if (action === "reset")
    resetCamera();

}


/* =========================================================
   TOP BUTTONS
   ========================================================= */

document
  .getElementById("homeButton")
  ?.addEventListener(
    "click",
    () => {

      setMode("solar");

      closeAllPanels();

      resetCamera();

    }
  );


document
  .getElementById("startButton")
  ?.addEventListener(
    "click",
    () => {

      document
        .getElementById("welcome")
        ?.remove();

      setMode("solar");

      showToast(
        "SOLAR SYSTEM INITIALIZED"
      );

    }
  );


document
  .querySelector(
    '[data-mode="solar"]'
  )
  ?.addEventListener(
    "click",
    () => {

      document
        .getElementById("welcome")
        ?.remove();

      setMode("solar");

    }
  );


/* =========================================================
   EXPLORE JOURNEY
   ========================================================= */

const explorePanel =
  document.getElementById(
    "explore-panel"
  );

const journeyText =
  document.getElementById(
    "journey-text"
  );

const journeyProgress =
  document.getElementById(
    "journey-progress"
  );

const journeySteps = [

  {
    title: "EARTH",
    description:
      "Our home planet."
  },

  {
    title: "SOLAR SYSTEM",
    description:
      "The Sun and its planetary system."
  },

  {
    title: "MILKY WAY",
    description:
      "Our barred spiral galaxy."
  },

  {
    title: "LOCAL GROUP",
    description:
      "A gravitationally bound collection of galaxies."
  },

  {
    title: "LARGE-SCALE UNIVERSE",
    description:
      "Galaxies form enormous cosmic structures."
  },

  {
    title: "OBSERVABLE UNIVERSE",
    description:
      "The region whose light can reach us."
  }

];

let journeyIndex = 0;


function updateJourney() {

  const step =
    journeySteps[
      journeyIndex
    ];

  journeyText.innerHTML = `
    <strong>${step.title}</strong>
    <br>
    <span style="
      color:#8da9ba;
      font-size:12px;
      font-weight:400;
    ">
      ${step.description}
    </span>
  `;

  journeyProgress.style.width =
    (
      journeyIndex /
      (journeySteps.length - 1) *
      100
    ) + "%";

  if (
    journeyIndex <= 1
  ) {

    setMode("solar");

  } else if (
    journeyIndex <= 3
  ) {

    setMode("galaxies");

  } else {

    setMode("universe");

  }

}


document
  .getElementById("exploreButton")
  ?.addEventListener(
    "click",
    () => {

      journeyIndex = 0;

      explorePanel.classList.remove(
        "hidden"
      );

      updateJourney();

    }
  );


document
  .getElementById("journey-next")
  ?.addEventListener(
    "click",
    () => {

      journeyIndex =
        Math.min(
          journeyIndex + 1,
          journeySteps.length - 1
        );

      updateJourney();

    }
  );


document
  .getElementById("journey-prev")
  ?.addEventListener(
    "click",
    () => {

      journeyIndex =
        Math.max(
          journeyIndex - 1,
          0
        );

      updateJourney();

    }
  );


document
  .getElementById("close-explore")
  ?.addEventListener(
    "click",
    () => {

      explorePanel.classList.add(
        "hidden"
      );

    }
  );


/* =========================================================
   COMPARE
   ========================================================= */

const comparePanel =
  document.getElementById(
    "compare-panel"
  );

const compareA =
  document.getElementById(
    "compare-a"
  );

const compareB =
  document.getElementById(
    "compare-b"
  );

const compareTable =
  document.getElementById(
    "compare-table"
  );


const compareObjects = [
  "Earth",
  "Mars",
  "Jupiter",
  "Saturn",
  "Venus",
  "Neptune"
];


compareObjects.forEach(key => {

  const optionA =
    document.createElement(
      "option"
    );

  optionA.value = key;
  optionA.textContent = key;

  compareA.appendChild(
    optionA
  );


  const optionB =
    document.createElement(
      "option"
    );

  optionB.value = key;
  optionB.textContent = key;

  compareB.appendChild(
    optionB
  );

});


compareB.value =
  "Mars";


function updateComparison() {

  const a =
    OBJECTS[
      compareA.value
    ];

  const b =
    OBJECTS[
      compareB.value
    ];

  if (!a || !b) return;

  compareTable.innerHTML = `

    <div class="compare-row">
      <span>PROPERTY</span>
      <span>${a.name}</span>
      <span>${b.name}</span>
    </div>

    <div class="compare-row">
      <span>TYPE</span>
      <span>${a.type}</span>
      <span>${b.type}</span>
    </div>

    <div class="compare-row">
      <span>SIZE</span>
      <span>${a.size}</span>
      <span>${b.size}</span>
    </div>

    <div class="compare-row">
      <span>MASS</span>
      <span>${a.mass}</span>
      <span>${b.mass}</span>
    </div>

    <div class="compare-row">
      <span>TEMPERATURE</span>
      <span>${a.temperature}</span>
      <span>${b.temperature}</span>
    </div>

  `;

}


compareA.addEventListener(
  "change",
  updateComparison
);

compareB.addEventListener(
  "change",
  updateComparison
);


function openCompare() {

  comparePanel.classList.remove(
    "hidden"
  );

  updateComparison();

}


document
  .getElementById("close-compare")
  ?.addEventListener(
    "click",
    () => {

      comparePanel.classList.add(
        "hidden"
      );

    }
  );


/* =========================================================
   TIME TRAVEL
   ========================================================= */

const timeSlider =
  document.getElementById(
    "time-slider"
  );

const timeDescription =
  document.getElementById(
    "time-description"
  );

const timeBadge =
  document.getElementById(
    "time-badge"
  );


const timeline = [

  {
    description:
      "The early Universe was extremely hot and dense.",
    badge:
      "MODEL / RECONSTRUCTION"
  },

  {
    description:
      "The first generations of stars and galaxies formed.",
    badge:
      "MODEL / OBSERVATION"
  },

  {
    description:
      "Galaxies evolved and large-scale cosmic structures developed.",
    badge:
      "OBSERVED + MODELED"
  },

  {
    description:
      "The Solar System formed approximately 4.6 billion years ago.",
    badge:
      "OBSERVED / MODELED"
  },

  {
    description:
      "Today: approximately 13.8 billion years after the beginning of cosmic expansion.",
    badge:
      "OBSERVED / MEASURED"
  },

  {
    description:
      "The far future depends on cosmological models and remains uncertain.",
    badge:
      "HYPOTHESIS / MODEL"
  }

];


function updateTimeTravel() {

  const index =
    Number(
      timeSlider.value
    );

  const item =
    timeline[index];

  timeDescription.textContent =
    item.description;

  timeBadge.textContent =
    item.badge;

}


timeSlider?.addEventListener(
  "input",
  updateTimeTravel
);


function openTimeTravel() {

  document
    .getElementById("time-panel")
    ?.classList.remove(
      "hidden"
    );

  updateTimeTravel();

}


document
  .getElementById("close-time")
  ?.addEventListener(
    "click",
    () => {

      document
        .getElementById("time-panel")
        ?.classList.add(
          "hidden"
        );

    }
  );


/* =========================================================
   BREADCRUMB
   ========================================================= */

document
  .querySelectorAll(
    "[data-breadcrumb]"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const value =
          button.dataset.breadcrumb;

        if (
          value === "universe"
        ) {

          setMode("universe");

        }

        if (
          value === "milkyway"
        ) {

          setMode("galaxies");

        }

        if (
          value === "solarsystem"
        ) {

          setMode("solar");

        }

      }
    );

  });


/* =========================================================
   ZOOM BUTTONS
   ========================================================= */

document
  .getElementById("zoom-in")
  ?.addEventListener(
    "click",
    () => {

      cameraDistance *= 0.75;

      cameraDistance =
        Math.max(
          cameraDistance,
          3
        );

    }
  );


document
  .getElementById("zoom-out")
  ?.addEventListener(
    "click",
    () => {

      cameraDistance *= 1.35;

      cameraDistance =
        Math.min(
          cameraDistance,
          1500
        );

    }
  );


document
  .getElementById("reset-camera")
  ?.addEventListener(
    "click",
    resetCamera
  );


function resetCamera() {

  cameraDistance = 42;

  cameraAzimuth = 0;

  cameraElevation = 0.3;

  cameraTarget.set(
    0,
    15,
    42
  );

  cameraFocus.set(
    0,
    0,
    0
  );

  focusObjectRef = null;

  selectedObject = null;

  objectPanel.classList.remove(
    "visible"
  );

}


/* =========================================================
   CLOSE ALL PANELS
   ========================================================= */

function closeAllPanels() {

  objectPanel.classList.remove(
    "visible"
  );

  comparePanel.classList.add(
    "hidden"
  );

  document
    .getElementById("time-panel")
    ?.classList.add(
      "hidden"
    );

  explorePanel.classList.add(
    "hidden"
  );

}


/* =========================================================
   SCALE DISPLAY
   ========================================================= */

const scaleValue =
  document.getElementById(
    "scale-value"
  );


function updateScaleDisplay(mode) {

  const names = {

    solar:
      "SOLAR SYSTEM",

    galaxies:
      "GALAXIES / LOCAL GROUP",

    blackholes:
      "GALACTIC CENTER",

    universe:
      "LARGE-SCALE UNIVERSE"

  };

  scaleValue.textContent =
    names[mode] ||
    "SOLAR SYSTEM";

}


/* =========================================================
   TOAST
   ========================================================= */

const toast =
  document.getElementById(
    "toast"
  );

let toastTimer = null;


function showToast(message) {

  if (!toast) return;

  toast.textContent =
    message;

  toast.classList.add(
    "visible"
  );

  clearTimeout(
    toastTimer
  );

  toastTimer =
    setTimeout(
      () => {

        toast.classList.remove(
          "visible"
        );

      },
      2400
    );

}


/* =========================================================
   ANIMATION
   ========================================================= */

const clock =
  new THREE.Clock();


function animate() {

  requestAnimationFrame(
    animate
  );

  const elapsed =
    clock.getElapsedTime();


  sun.rotation.y =
    elapsed * 0.05;


  planetData.forEach(data => {

    const pivot =
      planetPivots[data.key];

    if (pivot) {

      pivot.rotation.y +=
        data.speed;

    }

    const planet =
      planetObjects[data.key];

    if (planet) {

      planet.rotation.y +=
        0.0025;

    }

  });


  moonPivot.rotation.y =
    elapsed * 0.25;

  moon.rotation.y +=
    0.003;


  asteroidBelt.rotation.y +=
    0.0004;


  milkyWayVisual.rotation.z =
    elapsed * 0.003;

  andromedaVisual.rotation.z =
    -elapsed * 0.002;


  disk.rotation.z =
    elapsed * 0.7;


  if (
    focusObjectRef &&
    focusObjectRef.parent
  ) {

    const worldPosition =
      focusObjectRef.getWorldPosition(
        new THREE.Vector3()
      );

    cameraFocus.lerp(
      worldPosition,
      0.08
    );

  }


  const desiredX =
    cameraFocus.x +
    Math.sin(cameraAzimuth) *
    Math.cos(cameraElevation) *
    cameraDistance;

  const desiredY =
    cameraFocus.y +
    Math.sin(cameraElevation) *
    cameraDistance;

  const desiredZ =
    cameraFocus.z +
    Math.cos(cameraAzimuth) *
    Math.cos(cameraElevation) *
    cameraDistance;


  const desiredPosition =
    new THREE.Vector3(
      desiredX,
      desiredY,
      desiredZ
    );

  camera.position.lerp(
    desiredPosition,
    0.08
  );

  camera.lookAt(
    cameraFocus
  );


  renderer.render(
    scene,
    camera
  );

}


animate();


/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }
);


/* =========================================================
   LOADING
   ========================================================= */

const loading =
  document.getElementById(
    "loading"
  );

const loadingProgress =
  document.getElementById(
    "loading-progress"
  );

const loadingText =
  document.getElementById(
    "loading-text"
  );


let progress = 0;

const loadingInterval =
  setInterval(
    () => {

      progress +=
        Math.random() * 15 + 5;

      progress =
        Math.min(
          progress,
          100
        );

      loadingProgress.style.width =
        progress + "%";


      if (progress < 35) {

        loadingText.textContent =
          "INITIALIZING STAR FIELD...";

      } else if (progress < 65) {

        loadingText.textContent =
          "BUILDING SOLAR SYSTEM...";

      } else if (progress < 90) {

        loadingText.textContent =
          "LOADING COSMIC STRUCTURES...";

      } else {

        loadingText.textContent =
          "UNIVERSE READY";

      }


      if (progress >= 100) {

        clearInterval(
          loadingInterval
        );

        setTimeout(
          () => {

            loading.classList.add(
              "hidden"
            );

          },
          450
        );

      }

    },
    100
  );


/* =========================================================
   INITIAL STATE
   ========================================================= */

setMode("solar");

updateScaleDisplay(
  "solar"
);


console.log(
  "UNIVERSE EXPLORER ONLINE"
);
