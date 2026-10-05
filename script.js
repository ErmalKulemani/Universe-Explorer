/* =========================================================
   UNIVERSE EXPLORER
   Complete JavaScript
   Three.js interactive universe explorer
   ========================================================= */

"use strict";

/* =========================================================
   GLOBAL STATE
   ========================================================= */

const state = {
  initialized: false,
  loading: true,
  selectedKey: null,
  hoveredKey: null,
  currentMode: "universe",
  currentScale: "solar",
  simulationRunning: true,
  simulationSpeed: 1,
  performanceMode: "auto",
  showOrbits: true,
  showStars: true,
  showLabels: true,
  cinematicMode: false,
  dragging: false,
  rotatingObject: false,
  pointerId: null,
  lastPointerX: 0,
  lastPointerY: 0,
  pinchDistance: 0,
  cameraTarget: new THREE.Vector3(0, 0, 0),
  cameraDistance: 55,
  targetCameraDistance: 55,
  objectRotationX: 0,
  objectRotationY: 0,
  fps: 60,
  frameCounter: 0,
  fpsTime: performance.now(),
  universeTime: 0,
  timeTravelYear: 2026,
  searchQuery: "",
  compareMode: false,
  compareObjects: [],
  journeyRunning: false,
  journeyIndex: 0,
  journeyTimer: null
};

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x02040a);

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.01,
  100000000
);

camera.position.set(0, 22, 65);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
  powerPreference: "high-performance"
});

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio || 1, 2)
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.toneMapping = THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1.05;

const clock = new THREE.Clock();

/* =========================================================
   MAIN GROUPS
   ========================================================= */

const universeGroup = new THREE.Group();
const galaxyGroup = new THREE.Group();
const milkyWayGroup = new THREE.Group();
const solarSystemGroup = new THREE.Group();
const planetGroup = new THREE.Group();
const starGroup = new THREE.Group();
const orbitGroup = new THREE.Group();
const labelGroup = new THREE.Group();
const effectGroup = new THREE.Group();

scene.add(universeGroup);
scene.add(galaxyGroup);
scene.add(milkyWayGroup);
scene.add(solarSystemGroup);
solarSystemGroup.add(planetGroup);
solarSystemGroup.add(starGroup);
solarSystemGroup.add(orbitGroup);
scene.add(labelGroup);
scene.add(effectGroup);

/* =========================================================
   LIGHTING
   ========================================================= */

const ambientLight = new THREE.AmbientLight(
  0x8899bb,
  0.18
);

scene.add(ambientLight);

const sunLight = new THREE.PointLight(
  0xffffff,
  3.5,
  0,
  1.5
);

sunLight.position.set(0, 0, 0);

solarSystemGroup.add(sunLight);

/* =========================================================
   OBJECT DATABASE
   ========================================================= */

const OBJECTS = {

  sun: {
    name: "Sun",
    type: "Star",
    distance: "0 km",
    diameter: "1,392,700 km",
    mass: "1.989 × 10³⁰ kg",
    temperature: "≈ 5,500 °C surface",
    age: "≈ 4.6 billion years",
    color: 0xffcc55,
    radius: 6,
    position: [0, 0, 0],
    category: "star"
  },

  mercury: {
    name: "Mercury",
    type: "Planet",
    distance: "57.9 million km",
    diameter: "4,879 km",
    mass: "3.301 × 10²³ kg",
    temperature: "≈ -180 to 430 °C",
    age: "≈ 4.5 billion years",
    color: 0xaaa49a,
    radius: 0.45,
    orbit: 9,
    speed: 0.020,
    category: "planet"
  },

  venus: {
    name: "Venus",
    type: "Planet",
    distance: "108.2 million km",
    diameter: "12,104 km",
    mass: "4.867 × 10²⁴ kg",
    temperature: "≈ 465 °C",
    age: "≈ 4.5 billion years",
    color: 0xd8a96e,
    radius: 0.85,
    orbit: 13,
    speed: 0.015,
    category: "planet"
  },

  earth: {
    name: "Earth",
    type: "Planet",
    distance: "149.6 million km",
    diameter: "12,742 km",
    mass: "5.972 × 10²⁴ kg",
    temperature: "≈ 15 °C average",
    age: "≈ 4.54 billion years",
    color: 0x3f8fff,
    radius: 0.95,
    orbit: 17,
    speed: 0.010,
    category: "planet"
  },

  moon: {
    name: "Moon",
    type: "Natural satellite",
    distance: "384,400 km from Earth",
    diameter: "3,475 km",
    mass: "7.342 × 10²² kg",
    temperature: "≈ -173 to 127 °C",
    age: "≈ 4.5 billion years",
    color: 0xb8b8b8,
    radius: 0.28,
    orbit: 2.3,
    speed: 0.055,
    category: "moon"
  },

  mars: {
    name: "Mars",
    type: "Planet",
    distance: "227.9 million km",
    diameter: "6,779 km",
    mass: "6.417 × 10²³ kg",
    temperature: "≈ -63 °C average",
    age: "≈ 4.5 billion years",
    color: 0xc95b42,
    radius: 0.62,
    orbit: 21,
    speed: 0.008,
    category: "planet"
  },

  jupiter: {
    name: "Jupiter",
    type: "Gas giant",
    distance: "778.5 million km",
    diameter: "139,820 km",
    mass: "1.898 × 10²⁷ kg",
    temperature: "≈ -110 °C cloud tops",
    age: "≈ 4.5 billion years",
    color: 0xc89d75,
    radius: 2.7,
    orbit: 27,
    speed: 0.0045,
    category: "planet"
  },

  saturn: {
    name: "Saturn",
    type: "Gas giant",
    distance: "1.43 billion km",
    diameter: "116,460 km",
    mass: "5.683 × 10²⁶ kg",
    temperature: "≈ -140 °C",
    age: "≈ 4.5 billion years",
    color: 0xd7bf91,
    radius: 2.25,
    orbit: 34,
    speed: 0.003,
    category: "planet"
  },

  uranus: {
    name: "Uranus",
    type: "Ice giant",
    distance: "2.87 billion km",
    diameter: "50,724 km",
    mass: "8.681 × 10²⁵ kg",
    temperature: "≈ -195 °C",
    age: "≈ 4.5 billion years",
    color: 0x72c9d2,
    radius: 1.5,
    orbit: 41,
    speed: 0.002,
    category: "planet"
  },

  neptune: {
    name: "Neptune",
    type: "Ice giant",
    distance: "4.50 billion km",
    diameter: "49,244 km",
    mass: "1.024 × 10²⁶ kg",
    temperature: "≈ -200 °C",
    age: "≈ 4.5 billion years",
    color: 0x416de0,
    radius: 1.45,
    orbit: 48,
    speed: 0.0015,
    category: "planet"
  },

  pluto: {
    name: "Pluto",
    type: "Dwarf planet",
    distance: "≈ 5.9 billion km",
    diameter: "2,377 km",
    mass: "1.303 × 10²² kg",
    temperature: "≈ -229 °C",
    age: "≈ 4.5 billion years",
    color: 0xb59b8b,
    radius: 0.38,
    orbit: 55,
    speed: 0.0008,
    category: "dwarf"
  },

  proxima: {
    name: "Proxima Centauri",
    type: "Red dwarf star",
    distance: "4.24 light-years",
    diameter: "≈ 200,000 km",
    mass: "≈ 0.12 solar masses",
    temperature: "≈ 3,000 K",
    age: "≈ 4.85 billion years",
    color: 0xff7755,
    radius: 0.9,
    category: "star"
  },

  sirius: {
    name: "Sirius",
    type: "Binary star system",
    distance: "8.6 light-years",
    diameter: "≈ 2.4 solar diameters",
    mass: "≈ 3 solar masses combined",
    temperature: "≈ 9,900 K for Sirius A",
    age: "≈ 242 million years",
    color: 0xcfe8ff,
    radius: 1.15,
    category: "star"
  },

  vega: {
    name: "Vega",
    type: "Main-sequence star",
    distance: "25 light-years",
    diameter: "≈ 2.36 solar diameters",
    mass: "≈ 2.1 solar masses",
    temperature: "≈ 9,600 K",
    age: "≈ 455 million years",
    color: 0xbddcff,
    radius: 1.1,
    category: "star"
  },

  betelgeuse: {
    name: "Betelgeuse",
    type: "Red supergiant",
    distance: "≈ 640 light-years",
    diameter: "hundreds of millions km",
    mass: "≈ 10–20 solar masses",
    temperature: "≈ 3,500 K",
    age: "≈ 8 million years",
    color: 0xff7755,
    radius: 2.5,
    category: "star"
  },

  milkyway: {
    name: "Milky Way",
    type: "Barred spiral galaxy",
    distance: "Our galaxy",
    diameter: "≈ 100,000 light-years",
    mass: "≈ 1.5 trillion solar masses",
    temperature: "Varies by region",
    age: "≈ 13.6 billion years",
    color: 0x6688ff,
    category: "galaxy"
  },

  andromeda: {
    name: "Andromeda Galaxy",
    type: "Spiral galaxy",
    distance: "≈ 2.54 million light-years",
    diameter: "≈ 220,000 light-years",
    mass: "≈ 1 trillion solar masses",
    temperature: "Varies by region",
    age: "≈ 10 billion years",
    color: 0xaaaaff,
    category: "galaxy"
  },

  sagittariusA: {
    name: "Sagittarius A*",
    type: "Supermassive black hole",
    distance: "≈ 26,700 light-years",
    diameter: "event horizon ≈ 24 million km",
    mass: "≈ 4.3 million solar masses",
    temperature: "Accretion environment extremely hot",
    age: "Ancient",
    color: 0x111111,
    category: "blackhole"
  }
};

/* =========================================================
   EXTRA DATA
   ========================================================= */

const EXTRA_DATA = {

  sun: {
    composition: "Mostly hydrogen and helium.",
    formation: "Formed from the collapse of a molecular cloud about 4.6 billion years ago.",
    discovery: "Known since prehistory; its physical nature was understood progressively through modern astronomy.",
    orbit: "The Sun orbits the center of the Milky Way.",
    curiosity: "The Sun contains more than 99% of the mass of the Solar System.",
    missions: [
      "SOHO",
      "Solar Dynamics Observatory",
      "Parker Solar Probe",
      "Solar Orbiter"
    ]
  },

  earth: {
    composition: "Iron, oxygen, silicon, magnesium and other elements.",
    formation: "Accreted from material in the early Solar System.",
    discovery: "Earth is the reference world from which astronomy is conducted.",
    orbit: "One revolution around the Sun takes about 365.25 days.",
    curiosity: "Earth is currently the only known world with life.",
    missions: [
      "Earth observation satellites",
      "ISS",
      "Landsat",
      "Sentinel"
    ]
  },

  moon: {
    composition: "Rock and metal.",
    formation: "The leading model proposes a giant impact early in Earth's history.",
    discovery: "Visible to humanity since prehistory.",
    orbit: "Orbits Earth in about 27.3 days relative to the stars.",
    curiosity: "The Moon is tidally locked to Earth.",
    missions: [
      "Apollo",
      "Lunar Reconnaissance Orbiter",
      "Chang'e",
      "Chandrayaan"
    ]
  },

  mars: {
    composition: "Rock and iron-rich minerals.",
    formation: "Formed during the early accretion of the Solar System.",
    discovery: "Observed by ancient civilizations and later studied telescopically.",
    orbit: "One Martian year lasts about 687 Earth days.",
    curiosity: "Mars has the largest volcano known in the Solar System, Olympus Mons.",
    missions: [
      "Viking",
      "Mars Global Surveyor",
      "Curiosity",
      "Perseverance",
      "Mars Reconnaissance Orbiter"
    ]
  },

  jupiter: {
    composition: "Mostly hydrogen and helium.",
    formation: "Likely formed early and rapidly in the Solar System.",
    discovery: "Visible to the naked eye since antiquity.",
    orbit: "One revolution takes about 11.86 Earth years.",
    curiosity: "Jupiter is the largest planet in the Solar System.",
    missions: [
      "Galileo",
      "Juno",
      "Voyager"
    ]
  },

  saturn: {
    composition: "Mostly hydrogen and helium.",
    formation: "Formed in the outer Solar System.",
    discovery: "Known since antiquity.",
    orbit: "One revolution takes about 29.5 Earth years.",
    curiosity: "Its spectacular rings are made largely of ice and rocky material.",
    missions: [
      "Cassini-Huygens",
      "Voyager"
    ]
  },

  uranus: {
    composition: "Hydrogen, helium and volatile ices.",
    formation: "Formed in the outer Solar System.",
    discovery: "Recognized as a planet by William Herschel in 1781.",
    orbit: "One revolution takes about 84 Earth years.",
    curiosity: "Its rotation axis is tilted by about 98 degrees.",
    missions: [
      "Voyager 2"
    ]
  },

  neptune: {
    composition: "Hydrogen, helium and volatile compounds.",
    formation: "Formed in the outer Solar System.",
    discovery: "Predicted mathematically and observed in 1846.",
    orbit: "One revolution takes about 165 Earth years.",
    curiosity: "Neptune has some of the fastest winds known in the Solar System.",
    missions: [
      "Voyager 2"
    ]
  },

  pluto: {
    composition: "Rock and water ice.",
    formation: "Formed in the distant Kuiper Belt.",
    discovery: "Discovered in 1930 by Clyde Tombaugh.",
    orbit: "One revolution takes about 248 Earth years.",
    curiosity: "Pluto and Charon orbit a common center of mass outside Pluto itself.",
    missions: [
      "New Horizons"
    ]
  },

  proxima: {
    composition: "Hydrogen and helium with heavier elements.",
    formation: "Formed in the same stellar environment as the Alpha Centauri system.",
    discovery: "Discovered in 1915.",
    orbit: "Part of the Alpha Centauri stellar system.",
    curiosity: "It is the closest known star to the Sun.",
    missions: []
  },

  milkyway: {
    composition: "Stars, gas, dust, dark matter and a central supermassive black hole.",
    formation: "Built through billions of years of star formation and mergers.",
    discovery: "Recognized as a galaxy distinct from the Milky Way through modern astronomy.",
    orbit: "The Milky Way moves through the Local Group.",
    curiosity: "Our Solar System lies in a spiral-arm region called the Orion Arm.",
    missions: []
  },

  andromeda: {
    composition: "Stars, gas, dust and dark matter.",
    formation: "Built through long-term galaxy evolution and mergers.",
    discovery: "Known as a diffuse object since antiquity and identified as an external galaxy in modern astronomy.",
    orbit: "Member of the Local Group.",
    curiosity: "Andromeda and the Milky Way are approaching each other.",
    missions: []
  },

  sagittariusA: {
    composition: "A supermassive black hole surrounded by hot gas and stars.",
    formation: "Likely grew through accretion and mergers over cosmic history.",
    discovery: "Identified through observations of compact radio emission and stellar orbits.",
    orbit: "Located at the dynamical center of the Milky Way.",
    curiosity: "Stars near it orbit an enormous invisible mass.",
    missions: []
  }
};

/* =========================================================
   SCENE ELEMENTS
   ========================================================= */

const planetObjects = {};
const planetPivots = {};
const objectRegistry = {};
const labels = {};
const orbitObjects = {};
const starObjects = {};

let sunMesh = null;
let earthMesh = null;
let moonMesh = null;
let milkyWayVisual = null;
let andromedaVisual = null;
let blackHoleVisual = null;
let accretionDisk = null;
let asteroidBelt = null;
let selectionRing = null;

/* =========================================================
   MATERIAL HELPERS
   ========================================================= */

function createPlanetMaterial(color) {

  return new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.82,
    metalness: 0.02
  });
}

function createEmissiveMaterial(color, intensity) {

  return new THREE.MeshStandardMaterial({
    color: color,
    emissive: color,
    emissiveIntensity: intensity,
    roughness: 0.5,
    metalness: 0
  });
}

function createGlowMaterial(color, opacity) {

  return new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: opacity,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
}

/* =========================================================
   SUN
   ========================================================= */

function createSun() {

  const geometry = new THREE.SphereGeometry(
    OBJECTS.sun.radius,
    64,
    64
  );

  const material = createEmissiveMaterial(
    0xffb52e,
    1.6
  );

  sunMesh = new THREE.Mesh(
    geometry,
    material
  );

  sunMesh.userData.objectKey = "sun";

  solarSystemGroup.add(sunMesh);

  objectRegistry.sun = sunMesh;

  const glowGeometry =
    new THREE.SphereGeometry(
      OBJECTS.sun.radius * 1.45,
      48,
      48
    );

  const glow = new THREE.Mesh(
    glowGeometry,
    createGlowMaterial(
      0xffa800,
      0.12
    )
  );

  sunMesh.add(glow);

  return sunMesh;
}

/* =========================================================
   PLANET CREATION
   ========================================================= */

function createPlanet(key) {

  const data = OBJECTS[key];

  if (!data || !data.orbit) {
    return null;
  }

  const pivot = new THREE.Group();

  pivot.userData.objectKey = key;

  const geometry =
    new THREE.SphereGeometry(
      data.radius,
      40,
      40
    );

  const material =
    createPlanetMaterial(data.color);

  const mesh =
    new THREE.Mesh(
      geometry,
      material
    );

  mesh.position.x = data.orbit;

  mesh.userData.objectKey = key;

  pivot.add(mesh);

  planetGroup.add(pivot);

  planetObjects[key] = mesh;
  planetPivots[key] = pivot;
  objectRegistry[key] = mesh;

  createOrbit(data.orbit, key);

  return mesh;
}

/* =========================================================
   PLANET ORBITS
   ========================================================= */

function createOrbit(radius, key) {

  const curve =
    new THREE.EllipseCurve(
      0,
      0,
      radius,
      radius,
      0,
      Math.PI * 2,
      false,
      0
    );

  const points =
    curve.getPoints(160);

  const geometry =
    new THREE.BufferGeometry().setFromPoints(
      points.map(
        point =>
          new THREE.Vector3(
            point.x,
            0,
            point.y
          )
      )
    );

  const material =
    new THREE.LineBasicMaterial({
      color: 0x243b63,
      transparent: true,
      opacity: 0.55
    });

  const line =
    new THREE.LineLoop(
      geometry,
      material
    );

  line.userData.objectKey = key;

  orbitGroup.add(line);

  orbitObjects[key] = line;

  return line;
}

/* =========================================================
   MOON
   ========================================================= */

function createMoon() {

  if (!earthMesh) {
    return;
  }

  const pivot =
    new THREE.Group();

  pivot.userData.objectKey =
    "moon-orbit";

  earthMesh.add(pivot);

  const geometry =
    new THREE.SphereGeometry(
      OBJECTS.moon.radius,
      32,
      32
    );

  const material =
    createPlanetMaterial(
      OBJECTS.moon.color
    );

  moonMesh =
    new THREE.Mesh(
      geometry,
      material
    );

  moonMesh.position.x =
    OBJECTS.moon.orbit;

  moonMesh.userData.objectKey =
    "moon";

  pivot.add(moonMesh);

  objectRegistry.moon =
    moonMesh;

  starObjects.moonPivot =
    pivot;
}

/* =========================================================
   SATURN RINGS
   ========================================================= */

function createSaturnRings() {

  const saturn =
    planetObjects.saturn;

  if (!saturn) {
    return;
  }

  const geometry =
    new THREE.RingGeometry(
      OBJECTS.saturn.radius * 1.35,
      OBJECTS.saturn.radius * 2.15,
      96
    );

  const material =
    new THREE.MeshBasicMaterial({
      color: 0xc8b58c,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide
    });

  const rings =
    new THREE.Mesh(
      geometry,
      material
    );

  rings.rotation.x =
    Math.PI / 2.15;

  saturn.add(rings);
}

/* =========================================================
   ASTEROID BELT
   ========================================================= */

function createAsteroidBelt() {

  asteroidBelt =
    new THREE.Group();

  asteroidBelt.userData.objectKey =
    "asteroid-belt";

  const geometry =
    new THREE.SphereGeometry(
      0.035,
      6,
      6
    );

  const material =
    new THREE.MeshBasicMaterial({
      color: 0x777777
    });

  const count = 900;

  for (
    let i = 0;
    i < count;
    i++
  ) {

    const mesh =
      new THREE.Mesh(
        geometry,
        material
      );

    const radius =
      23 +
      Math.random() * 3.5;

    const angle =
      Math.random() *
      Math.PI *
      2;

    const height =
      (Math.random() - 0.5) *
      0.8;

    mesh.position.set(
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    );

    asteroidBelt.add(mesh);
  }

  solarSystemGroup.add(
    asteroidBelt
  );
}

/* =========================================================
   STAR FIELD
   ========================================================= */

function createStarField() {

  const count = 7000;

  const positions =
    new Float32Array(
      count * 3
    );

  const sizes =
    new Float32Array(
      count
    );

  for (
    let i = 0;
    i < count;
    i++
  ) {

    const radius =
      400 +
      Math.random() * 5000;

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

    sizes[i] =
      0.5 +
      Math.random() * 1.8;
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

  geometry.setAttribute(
    "size",
    new THREE.BufferAttribute(
      sizes,
      1
    )
  );

  const material =
    new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.4,
      transparent: true,
      opacity: 0.82,
      sizeAttenuation: true
    });

  const stars =
    new THREE.Points(
      geometry,
      material
    );

  starGroup.add(stars);

  starObjects.background =
    stars;
}

/* =========================================================
   GALAXY GENERATOR
   ========================================================= */

function createGalaxy(
  radius,
  arms,
  stars,
  color
) {

  const positions =
    new Float32Array(
      stars * 3
    );

  for (
    let i = 0;
    i < stars;
    i++
  ) {

    const r =
      Math.pow(
        Math.random(),
        0.55
      ) * radius;

    const arm =
      Math.floor(
        Math.random() * arms
      );

    const angle =
      (arm / arms) *
      Math.PI *
      2 +
      r * 0.18 +
      (Math.random() - 0.5) *
      0.6;

    const vertical =
      (Math.random() - 0.5) *
      Math.max(
        0.1,
        radius * 0.07
      ) *
      (1 - r / radius);

    positions[i * 3] =
      Math.cos(angle) * r;

    positions[i * 3 + 1] =
      vertical;

    positions[i * 3 + 2] =
      Math.sin(angle) * r;
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
      color: color,
      size: 0.7,
      transparent: true,
      opacity: 0.72,
      blending:
        THREE.AdditiveBlending
    });

  return new THREE.Points(
    geometry,
    material
  );
}

/* =========================================================
   MILKY WAY
   ========================================================= */

function createMilkyWay() {

  milkyWayVisual =
    createGalaxy(
      180,
      5,
      18000,
      0x6688ff
    );

  milkyWayVisual.rotation.x =
    0.25;

  milkyWayVisual.userData.objectKey =
    "milkyway";

  milkyWayGroup.add(
    milkyWayVisual
  );

  objectRegistry.milkyway =
    milkyWayVisual;
}

/* =========================================================
   ANDROMEDA
   ========================================================= */

function createAndromeda() {

  andromedaVisual =
    createGalaxy(
      105,
      4,
      10000,
      0xaabbee
    );

  andromedaVisual.position.set(
    470,
    80,
    -320
  );

  andromedaVisual.rotation.x =
    -0.55;

  andromedaVisual.rotation.z =
    0.35;

  andromedaVisual.userData.objectKey =
    "andromeda";

  galaxyGroup.add(
    andromedaVisual
  );

  objectRegistry.andromeda =
    andromedaVisual;
}

/* =========================================================
   BLACK HOLE
   ========================================================= */

function createBlackHole() {

  const geometry =
    new THREE.SphereGeometry(
      10,
      64,
      64
    );

  const material =
    new THREE.MeshBasicMaterial({
      color: 0x000000
    });

  blackHoleVisual =
    new THREE.Mesh(
      geometry,
      material
    );

  blackHoleVisual.position.set(
    -360,
    110,
    -150
  );

  blackHoleVisual.userData.objectKey =
    "sagittariusA";

  galaxyGroup.add(
    blackHoleVisual
  );

  objectRegistry.sagittariusA =
    blackHoleVisual;

  const diskGeometry =
    new THREE.RingGeometry(
      13,
      32,
      128
    );

  const diskMaterial =
    new THREE.MeshBasicMaterial({
      color: 0xff6a2e,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
      blending:
        THREE.AdditiveBlending
    });

  accretionDisk =
    new THREE.Mesh(
      diskGeometry,
      diskMaterial
    );

  accretionDisk.rotation.x =
    Math.PI / 2;

  blackHoleVisual.add(
    accretionDisk
  );
}

/* =========================================================
   NEARBY STARS
   ========================================================= */

function createNearbyStars() {

  const starDefinitions = [
    {
      key: "proxima",
      position: [220, 45, -90],
      color: 0xff5533
    },
    {
      key: "sirius",
      position: [-190, 70, 130],
      color: 0xcceeff
    },
    {
      key: "vega",
      position: [140, 130, 180],
      color: 0xbddcff
    },
    {
      key: "betelgeuse",
      position: [-90, 180, -210],
      color: 0xff5533
    }
  ];

  starDefinitions.forEach(
    definition => {

      const data =
        OBJECTS[
          definition.key
        ];

      const geometry =
        new THREE.SphereGeometry(
          data.radius,
          32,
          32
        );

      const material =
        createEmissiveMaterial(
          definition.color,
          1.4
        );

      const mesh =
        new THREE.Mesh(
          geometry,
          material
        );

      mesh.position.set(
        definition.position[0],
        definition.position[1],
        definition.position[2]
      );

      mesh.userData.objectKey =
        definition.key;

      galaxyGroup.add(mesh);

      objectRegistry[
        definition.key
      ] = mesh;

      starObjects[
        definition.key
      ] = mesh;
    }
  );
}

/* =========================================================
   LABEL CREATION
   ========================================================= */

function createLabel(
  text,
  object,
  color = "#bfeaff"
) {

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width = 512;
  canvas.height = 128;

  const context =
    canvas.getContext(
      "2d"
    );

  context.clearRect(
    0,
    0,
    512,
    128
  );

  context.font =
    "bold 42px Arial";

  context.textAlign =
    "center";

  context.textBaseline =
    "middle";

  context.fillStyle =
    color;

  context.shadowColor =
    "#00aaff";

  context.shadowBlur =
    12;

  context.fillText(
    text,
    256,
    64
  );

  const texture =
    new THREE.CanvasTexture(
      canvas
    );

  const material =
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false
    });

  const sprite =
    new THREE.Sprite(
      material
    );

  sprite.scale.set(
    9,
    2.25,
    1
  );

  sprite.userData.objectKey =
    object.userData.objectKey;

  labelGroup.add(sprite);

  labels[
    object.userData.objectKey
  ] = {
    sprite,
    object
  };

  return sprite;
}

/* =========================================================
   SELECTION RING
   ========================================================= */

function createSelectionRing() {

  const geometry =
    new THREE.RingGeometry(
      1.1,
      1.18,
      64
    );

  const material =
    new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });

  selectionRing =
    new THREE.Mesh(
      geometry,
      material
    );

  selectionRing.rotation.x =
    Math.PI / 2;

  selectionRing.visible =
    false;

  effectGroup.add(
    selectionRing
  );
}

/* =========================================================
   UI HELPERS
   ========================================================= */

function getElement(id) {
  return document.getElementById(id);
}

function setText(
  id,
  value
) {

  const element =
    getElement(id);

  if (element) {
    element.textContent =
      value;
  }
}

function showElement(id) {

  const element =
    getElement(id);

  if (element) {
    element.classList.remove(
      "hidden"
    );
  }
}

function hideElement(id) {

  const element =
    getElement(id);

  if (element) {
    element.classList.add(
      "hidden"
    );
  }
}

function toast(message) {

  let element =
    getElement(
      "universe-toast"
    );

  if (!element) {

    element =
      document.createElement(
        "div"
      );

    element.id =
      "universe-toast";

    element.style.position =
      "fixed";

    element.style.left =
      "50%";

    element.style.bottom =
      "28px";

    element.style.transform =
      "translateX(-50%)";

    element.style.padding =
      "12px 20px";

    element.style.border =
      "1px solid rgba(0,220,255,.55)";

    element.style.borderRadius =
      "12px";

    element.style.background =
      "rgba(2,10,20,.9)";

    element.style.color =
      "#c9f7ff";

    element.style.fontFamily =
      "Arial,sans-serif";

    element.style.fontSize =
      "14px";

    element.style.zIndex =
      "99999";

    element.style.pointerEvents =
      "none";

    document.body.appendChild(
      element
    );
  }

  element.textContent =
    message;

  element.style.opacity =
    "1";

  clearTimeout(
    element._timer
  );

  element._timer =
    setTimeout(
      () => {
        element.style.opacity =
          "0";
      },
      2200
    );
}

/* =========================================================
   INFO PANEL
   ========================================================= */

function openInfoPanel(key) {

  const data =
    OBJECTS[key];

  if (!data) {
    return;
  }

  const extra =
    EXTRA_DATA[key] || {};

  state.selectedKey =
    key;

  setText(
    "object-name",
    data.name
  );

  setText(
    "object-type",
    data.type
  );

  setText(
    "object-distance",
    data.distance
  );

  setText(
    "object-diameter",
    data.diameter
  );

  setText(
    "object-mass",
    data.mass
  );

  setText(
    "object-temperature",
    data.temperature
  );

  setText(
    "object-age",
    data.age
  );

  setText(
    "object-composition",
    extra.composition ||
      "Information not available."
  );

  setText(
    "object-formation",
    extra.formation ||
      "Information not available."
  );

  setText(
    "object-orbit",
    extra.orbit ||
      "Information not available."
  );

  setText(
    "object-curiosity",
    extra.curiosity ||
      "No additional information."
  );

  const panel =
    getElement(
      "info-panel"
    );

  if (panel) {
    panel.classList.add(
      "active"
    );

    panel.classList.remove(
      "hidden"
    );
  }

  renderMissions(key);
  updateBreadcrumb(key);
}

function closeInfoPanel() {

  const panel =
    getElement(
      "info-panel"
    );

  if (panel) {
    panel.classList.remove(
      "active"
    );
  }

  state.selectedKey =
    null;

  clearSelection();
}

/* =========================================================
   MISSIONS
   ========================================================= */

function renderMissions(key) {

  const container =
    getElement(
      "mission-list"
    );

  if (!container) {
    return;
  }

  container.innerHTML =
    "";

  const missions =
    (
      EXTRA_DATA[key] &&
      EXTRA_DATA[key].missions
    ) || [];

  if (!missions.length) {

    container.innerHTML =
      "<div>No dedicated mission data.</div>";

    return;
  }

  missions.forEach(
    mission => {

      const item =
        document.createElement(
          "div"
        );

      item.className =
        "mission-item";

      item.textContent =
        mission;

      container.appendChild(
        item
      );
    }
  );
}

/* =========================================================
   BREADCRUMB
   ========================================================= */

function updateBreadcrumb(key) {

  const element =
    getElement(
      "breadcrumb"
    );

  if (!element) {
    return;
  }

  const data =
    OBJECTS[key];

  if (!data) {
    element.textContent =
      "Universe";
    return;
  }

  let path =
    "Universe";

  if (
    data.category ===
    "planet" ||
    data.category ===
    "moon" ||
    data.category ===
    "dwarf"
  ) {
    path =
      "Universe  ›  Milky Way  ›  Solar System  ›  " +
      data.name;
  }
  else if (
    data.category ===
    "galaxy"
  ) {
    path =
      "Universe  ›  Local Group  ›  " +
      data.name;
  }
  else if (
    data.category ===
    "blackhole"
  ) {
    path =
      "Universe  ›  Milky Way  ›  Galactic Center  ›  " +
      data.name;
  }
  else {
    path =
      "Universe  ›  Nearby Stars  ›  " +
      data.name;
  }

  element.textContent =
    path;
}

/* =========================================================
   SELECTION
   ========================================================= */

function clearSelection() {

  if (selectionRing) {
    selectionRing.visible =
      false;
  }
}

function selectObject(key) {

  const object =
    objectRegistry[key];

  if (!object) {
    return;
  }

  state.selectedKey =
    key;

  if (selectionRing) {

    selectionRing.visible =
      true;

    selectionRing.position.copy(
      object.getWorldPosition(
        new THREE.Vector3()
      )
    );

    const scale =
      Math.max(
        1,
        object.scale.x * 1.8
      );

    selectionRing.scale.set(
      scale,
      scale,
      scale
    );
  }

  openInfoPanel(key);
}

/* =========================================================
   CAMERA FOCUS
   ========================================================= */

function focusObject(key) {

  const object =
    objectRegistry[key];

  if (!object) {
    return;
  }

  const position =
    object.getWorldPosition(
      new THREE.Vector3()
    );

  state.cameraTarget.copy(
    position
  );

  let distance =
    15;

  const data =
    OBJECTS[key];

  if (data) {

    if (
      data.category ===
      "planet"
    ) {
      distance =
        Math.max(
          6,
          data.radius * 6
        );
    }

    if (
      data.category ===
      "star"
    ) {
      distance =
        Math.max(
          8,
          data.radius * 7
        );
    }

    if (
      data.category ===
      "galaxy"
    ) {
      distance =
        180;
    }

    if (
      data.category ===
      "blackhole"
    ) {
      distance =
        45;
    }

    if (
      data.category ===
      "moon"
    ) {
      distance =
        4;
    }
  }

  state.targetCameraDistance =
    distance;

  selectObject(key);

  toast(
    "Focusing on " +
    data.name
  );
}

/* =========================================================
   RAYCASTING
   ========================================================= */

const raycaster =
  new THREE.Raycaster();

const pointer =
  new THREE.Vector2();

function getPointerPosition(
  event
) {

  const rect =
    renderer.domElement.getBoundingClientRect();

  pointer.x =
    (
      (event.clientX - rect.left) /
      rect.width
    ) *
      2 -
    1;

  pointer.y =
    -(
      (event.clientY - rect.top) /
      rect.height
    ) *
      2 +
    1;
}

function getIntersectedObject(
  event
) {

  getPointerPosition(
    event
  );

  raycaster.setFromCamera(
    pointer,
    camera
  );

  const objects =
    Object.values(
      objectRegistry
    );

  const intersections =
    raycaster.intersectObjects(
      objects,
      true
    );

  if (
    intersections.length ===
    0
  ) {
    return null;
  }

  let object =
    intersections[0].object;

  while (
    object &&
    !object.userData.objectKey
  ) {
    object =
      object.parent;
  }

  return object;
}

/* =========================================================
   MOUSE / TOUCH
   ========================================================= */

function onPointerDown(event) {

  state.dragging =
    true;

  state.pointerId =
    event.pointerId;

  state.lastPointerX =
    event.clientX;

  state.lastPointerY =
    event.clientY;

  const object =
    getIntersectedObject(
      event
    );

  if (object) {

    const key =
      object.userData.objectKey;

    if (key) {

      state.rotatingObject =
        true;

      state.hoveredKey =
        key;
    }
  }
}

function onPointerMove(event) {

  if (!state.dragging) {
    return;
  }

  const dx =
    event.clientX -
    state.lastPointerX;

  const dy =
    event.clientY -
    state.lastPointerY;

  state.lastPointerX =
    event.clientX;

  state.lastPointerY =
    event.clientY;

  if (
    state.rotatingObject &&
    state.selectedKey
  ) {

    state.objectRotationY +=
      dx * 0.008;

    state.objectRotationX +=
      dy * 0.008;

    state.objectRotationX =
      Math.max(
        -1.4,
        Math.min(
          1.4,
          state.objectRotationX
        )
      );

    return;
  }

  const rotationSpeed =
    0.004;

  const offset =
    new THREE.Vector3();

  offset
    .subVectors(
      camera.position,
      state.cameraTarget
    )
    .applyAxisAngle(
      new THREE.Vector3(
        0,
        1,
        0
      ),
      -dx * rotationSpeed
    );

  camera.position.copy(
    state.cameraTarget
  ).add(
    offset
  );

  camera.lookAt(
    state.cameraTarget
  );
}

function onPointerUp() {

  state.dragging =
    false;

  state.rotatingObject =
    false;

  state.pointerId =
    null;
}

function onDoubleClick(event) {

  const object =
    getIntersectedObject(
      event
    );

  if (!object) {
    return;
  }

  const key =
    object.userData.objectKey;

  if (key) {
    focusObject(key);
  }
}

function onWheel(event) {

  event.preventDefault();

  const factor =
    event.deltaY > 0
      ? 1.12
      : 0.89;

  state.targetCameraDistance =
    Math.max(
      1.2,
      Math.min(
        100000,
        state.targetCameraDistance *
          factor
      )
    );
}

/* =========================================================
   TOUCH PINCH
   ========================================================= */

function touchDistance(
  a,
  b
) {

  const dx =
    a.clientX -
    b.clientX;

  const dy =
    a.clientY -
    b.clientY;

  return Math.sqrt(
    dx * dx +
    dy * dy
  );
}

function onTouchStart(event) {

  if (
    event.touches.length ===
    2
  ) {

    state.pinchDistance =
      touchDistance(
        event.touches[0],
        event.touches[1]
      );
  }
}

function onTouchMove(event) {

  if (
    event.touches.length !==
    2
  ) {
    return;
  }

  const distance =
    touchDistance(
      event.touches[0],
      event.touches[1]
    );

  if (
    state.pinchDistance <=
    0
  ) {
    state.pinchDistance =
      distance;
    return;
  }

  const difference =
    distance -
    state.pinchDistance;

  state.targetCameraDistance *=
    difference > 0
      ? 0.985
      : 1.015;

  state.targetCameraDistance =
    Math.max(
      1.2,
      Math.min(
        100000,
        state.targetCameraDistance
      )
    );

  state.pinchDistance =
    distance;
}

/* =========================================================
   SEARCH
   ========================================================= */

function normalizeSearch(
  text
) {

  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .trim();
}

function searchUniverse(
  query
) {

  const normalized =
    normalizeSearch(
      query
    );

  if (!normalized) {
    return [];
  }

  return Object.entries(
    OBJECTS
  )
    .filter(
      ([key, data]) => {

        const content =
          normalizeSearch(
            [
              key,
              data.name,
              data.type,
              data.category
            ].join(" ")
          );

        return content.includes(
          normalized
        );
      }
    )
    .slice(
      0,
      12
    );
}

function renderSearchResults(
  results,
  container
) {

  if (!container) {
    return;
  }

  container.innerHTML =
    "";

  if (!results.length) {

    container.innerHTML =
      "<div class='search-empty'>No objects found.</div>";

    return;
  }

  results.forEach(
    ([key, data]) => {

      const item =
        document.createElement(
          "button"
        );

      item.type =
        "button";

      item.className =
        "universe-search-result";

      item.textContent =
        data.name +
        " — " +
        data.type;

      item.addEventListener(
        "click",
        () => {

          focusObject(
            key
          );

          hideSearchResults();
        }
      );

      container.appendChild(
        item
      );
    }
  );
}

function hideSearchResults() {

  const container =
    getElement(
      "search-results"
    );

  if (container) {
    container.innerHTML =
      "";
  }
}

/* =========================================================
   SEARCH EVENTS
   ========================================================= */

function setupSearch() {

  const input =
    getElement(
      "universe-search"
    );

  const results =
    getElement(
      "search-results"
    );

  if (!input) {
    return;
  }

  input.addEventListener(
    "input",
    () => {

      state.searchQuery =
        input.value;

      const matches =
        searchUniverse(
          input.value
        );

      renderSearchResults(
        matches,
        results
      );
    }
  );

  input.addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "Enter"
      ) {

        const matches =
          searchUniverse(
            input.value
          );

        if (
          matches.length
        ) {

          focusObject(
            matches[0][0]
          );

          hideSearchResults();
        }
      }

      if (
        event.key ===
        "Escape"
      ) {
        input.value =
          "";

        hideSearchResults();

        input.blur();
      }
    }
  );
}

/* =========================================================
   NAVIGATION
   ========================================================= */

function setMode(mode) {

  state.currentMode =
    mode;

  document.body.dataset.mode =
    mode;

  if (
    mode ===
    "solar"
  ) {

    state.currentScale =
      "solar";

    solarSystemGroup.visible =
      true;

    galaxyGroup.visible =
      false;

    toast(
      "Solar System mode"
    );
  }

  else if (
    mode ===
    "galaxy"
  ) {

    state.currentScale =
      "galaxy";

    solarSystemGroup.visible =
      false;

    galaxyGroup.visible =
      true;

    toast(
      "Galaxy mode"
    );
  }

  else if (
    mode ===
    "universe"
  ) {

    state.currentScale =
      "universe";

    solarSystemGroup.visible =
      true;

    galaxyGroup.visible =
      true;

    toast(
      "Universe mode"
    );
  }

  else if (
    mode ===
    "blackhole"
  ) {

    state.currentScale =
      "blackhole";

    solarSystemGroup.visible =
      false;

    galaxyGroup.visible =
      true;

    focusObject(
      "sagittariusA"
    );
  }
}

function goHome() {

  state.cameraTarget.set(
    0,
    0,
    0
  );

  state.targetCameraDistance =
    70;

  state.currentMode =
    "universe";

  state.currentScale =
    "solar";

  camera.position.set(
    0,
    28,
    70
  );

  camera.lookAt(
    0,
    0,
    0
  );

  closeInfoPanel();

  toast(
    "Universe Explorer"
  );
}

/* =========================================================
   EXPLORE JOURNEY
   ========================================================= */

const journeySteps = [
  {
    title: "Earth",
    key: "earth",
    distance: 8
  },
  {
    title: "Solar System",
    key: "sun",
    distance: 65
  },
  {
    title: "Milky Way",
    key: "milkyway",
    distance: 260
  },
  {
    title: "Local Group",
    key: "andromeda",
    distance: 750
  },
  {
    title: "Observable Universe",
    key: null,
    distance: 1800
  }
];

function startExploreJourney() {

  if (
    state.journeyRunning
  ) {
    return;
  }

  state.journeyRunning =
    true;

  state.journeyIndex =
    0;

  runJourneyStep();
}

function runJourneyStep() {

  if (
    state.journeyIndex >=
    journeySteps.length
  ) {

    state.journeyRunning =
      false;

    toast(
      "Journey complete"
    );

    return;
  }

  const step =
    journeySteps[
      state.journeyIndex
    ];

  state.targetCameraDistance =
    step.distance;

  if (step.key) {

    state.cameraTarget.copy(
      objectRegistry[
        step.key
      ]
        ? objectRegistry[
            step.key
          ].getWorldPosition(
            new THREE.Vector3()
          )
        : new THREE.Vector3()
    );
  }
  else {

    state.cameraTarget.set(
      0,
      0,
      0
    );
  }

  setText(
    "explore-status",
    step.title
  );

  toast(
    "Exploring: " +
    step.title
  );

  state.journeyIndex++;

  state.journeyTimer =
    setTimeout(
      runJourneyStep,
      2800
    );
}

/* =========================================================
   TIME TRAVEL
   ========================================================= */

function setTimeTravel(
  year
) {

  state.timeTravelYear =
    Number(year);

  const element =
    getElement(
      "time-value"
    );

  if (element) {

    if (
      state.timeTravelYear <
      -1000000000
    ) {

      element.textContent =
        "Deep cosmic history";
    }
    else if (
      state.timeTravelYear <
      0
    ) {

      element.textContent =
        Math.abs(
          state.timeTravelYear
        ) +
        " years ago";
    }
    else {

      element.textContent =
        state.timeTravelYear;
    }
  }

  updateTimeTravelDescription();
}

function updateTimeTravelDescription() {

  const element =
    getElement(
      "time-description"
    );

  if (!element) {
    return;
  }

  const year =
    state.timeTravelYear;

  if (
    year <=
    -13800000000
  ) {

    element.textContent =
      "Early observable Universe. Models and observations reconstruct its earliest stages.";
  }

  else if (
    year <
    -4500000000
  ) {

    element.textContent =
      "The Universe evolves through galaxy formation, stars and large-scale structures.";
  }

  else if (
    year <
    -4500000000 + 1
  ) {

    element.textContent =
      "The Solar System has not yet formed.";
  }

  else if (
    year <
    0
  ) {

    element.textContent =
      "Ancient cosmic history: stellar and planetary systems evolve over billions of years.";
  }

  else if (
    year <=
    2026
  ) {

    element.textContent =
      "Present-day Universe based on observations, measurements and scientific models.";
  }

  else {

    element.textContent =
      "Future cosmic evolution is represented through theoretical models and projections.";
  }
}

/* =========================================================
   COMPARE MODE
   ========================================================= */

function addCompareObject(
  key
) {

  if (
    !OBJECTS[key]
  ) {
    return;
  }

  if (
    state.compareObjects.includes(
      key
    )
  ) {
    return;
  }

  if (
    state.compareObjects.length >=
    2
  ) {
    state.compareObjects.shift();
  }

  state.compareObjects.push(
    key
  );

  state.compareMode =
    state.compareObjects.length ===
    2;

  renderComparison();
}

function renderComparison() {

  const container =
    getElement(
      "compare-panel"
    );

  if (!container) {
    return;
  }

  if (
    state.compareObjects.length <
    2
  ) {

    container.innerHTML =
      "<div>Select two objects to compare.</div>";

    return;
  }

  const a =
    OBJECTS[
      state.compareObjects[0]
    ];

  const b =
    OBJECTS[
      state.compareObjects[1]
    ];

  container.innerHTML = `
    <div class="compare-grid">
      <div class="compare-column">
        <h3>${a.name}</h3>
        <p>Type: ${a.type}</p>
        <p>Diameter: ${a.diameter}</p>
        <p>Mass: ${a.mass}</p>
        <p>Temperature: ${a.temperature}</p>
        <p>Age: ${a.age}</p>
      </div>
      <div class="compare-column">
        <h3>${b.name}</h3>
        <p>Type: ${b.type}</p>
        <p>Diameter: ${b.diameter}</p>
        <p>Mass: ${b.mass}</p>
        <p>Temperature: ${b.temperature}</p>
        <p>Age: ${b.age}</p>
      </div>
    </div>
  `;
}

/* =========================================================
   CAMERA UPDATE
   ========================================================= */

function updateCamera() {

  const direction =
    new THREE.Vector3(
      0,
      0,
      1
    );

  direction.applyQuaternion(
    camera.quaternion
  );

  const desired =
    new THREE.Vector3(
      0,
      0,
      state.targetCameraDistance
    );

  desired.applyQuaternion(
    camera.quaternion
  );

  const targetPosition =
    state.cameraTarget.clone();

  targetPosition.add(
    new THREE.Vector3(
      0,
      state.targetCameraDistance *
        0.18,
      state.targetCameraDistance
    )
  );

  camera.position.lerp(
    targetPosition,
    0.045
  );

  camera.lookAt(
    state.cameraTarget
  );
}

/* =========================================================
   SCALE INDICATOR
   ========================================================= */

function updateScaleIndicator() {

  const element =
    getElement(
      "scale-indicator"
    );

  if (!element) {
    return;
  }

  const distance =
    state.targetCameraDistance;

  let text =
    "LOCAL SPACE";

  if (
    distance < 100
  ) {
    text =
      "SOLAR SYSTEM SCALE";
  }
  else if (
    distance < 500
  ) {
    text =
      "STELLAR NEIGHBORHOOD";
  }
  else if (
    distance < 1200
  ) {
    text =
      "GALACTIC SCALE";
  }
  else {
    text =
      "COSMIC SCALE";
  }

  element.textContent =
    text;
}

/* =========================================================
   ORBIT VISIBILITY
   ========================================================= */

function setOrbitVisibility(
  visible
) {

  state.showOrbits =
    visible;

  orbitGroup.visible =
    visible;
}

function toggleOrbits() {

  setOrbitVisibility(
    !state.showOrbits
  );

  toast(
    state.showOrbits
      ? "Orbits ON"
      : "Orbits OFF"
  );
}

/* =========================================================
   STAR VISIBILITY
   ========================================================= */

function setStarVisibility(
  visible
) {

  state.showStars =
    visible;

  starGroup.visible =
    visible;
}

function toggleStars() {

  setStarVisibility(
    !state.showStars
  );

  toast(
    state.showStars
      ? "Stars ON"
      : "Stars OFF"
  );
}

/* =========================================================
   LABEL VISIBILITY
   ========================================================= */

function toggleLabels() {

  state.showLabels =
    !state.showLabels;

  labelGroup.visible =
    state.showLabels;
}

/* =========================================================
   PERFORMANCE
   ========================================================= */

function applyPerformanceMode(
  mode
) {

  state.performanceMode =
    mode;

  if (
    mode ===
    "low"
  ) {

    renderer.setPixelRatio(
      1
    );

    starObjects.background &&
      (
        starObjects
          .background
          .material
          .size = 1
      );
  }

  else if (
    mode ===
    "high"
  ) {

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio ||
          1,
        2
      )
    );

    starObjects.background &&
      (
        starObjects
          .background
          .material
          .size = 1.4
      );
  }

  else {

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio ||
          1,
        1.5
      )
    );
  }

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );
}

/* =========================================================
   RESPONSIVE
   ========================================================= */

function onResize() {

  camera.aspect =
    window.innerWidth /
    window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );
}

window.addEventListener(
  "resize",
  onResize
);

/* =========================================================
   KEYBOARD CONTROLS
   ========================================================= */

const keyboardObjects = [
  "sun",
  "earth",
  "moon",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto"
];

function onKeyboard(
  event
) {

  if (
    event.target &&
    (
      event.target.tagName ===
      "INPUT" ||
      event.target.tagName ===
      "TEXTAREA"
    )
  ) {
    return;
  }

  const number =
    Number(event.key);

  if (
    number >= 1 &&
    number <= 9
  ) {

    const key =
      keyboardObjects[
        number - 1
      ];

    if (key) {
      focusObject(
        key
      );
    }

    return;
  }

  if (
    event.key ===
    "Escape"
  ) {

    closeInfoPanel();

    hideSearchResults();

    return;
  }

  if (
    event.key ===
    "o"
  ) {
    toggleOrbits();
  }

  if (
    event.key ===
    "s"
  ) {
    toggleStars();
  }

  if (
    event.key ===
    "l"
  ) {
    toggleLabels();
  }

  if (
    event.key ===
    " "
  ) {

    event.preventDefault();

    toggleSimulation();
  }

  if (
    event.key ===
    "h"
  ) {
    goHome();
  }
}

window.addEventListener(
  "keydown",
  onKeyboard
);

/* =========================================================
   SIMULATION
   ========================================================= */

function toggleSimulation() {

  state.simulationRunning =
    !state.simulationRunning;

  toast(
    state.simulationRunning
      ? "Simulation running"
      : "Simulation paused"
  );
}

function setSimulationSpeed(
  speed
) {

  const value =
    Number(speed);

  if (
    !Number.isFinite(value)
  ) {
    return;
  }

  state.simulationSpeed =
    Math.max(
      0,
      Math.min(
        20,
        value
      )
    );
}

/* =========================================================
   ANIMATION
   ========================================================= */

function updateSolarSystem(
  delta
) {

  if (
    !state.simulationRunning
  ) {
    return;
  }

  const speed =
    state.simulationSpeed;

  Object.keys(
    planetPivots
  ).forEach(
    key => {

      const data =
        OBJECTS[key];

      const pivot =
        planetPivots[key];

      const planet =
        planetObjects[key];

      if (
        pivot &&
        data &&
        data.speed
      ) {

        pivot.rotation.y +=
          data.speed *
          speed *
          delta *
          12;
      }

      if (planet) {

        planet.rotation.y +=
          0.45 *
          speed *
          delta;
      }
    }
  );

  const moonPivot =
    starObjects.moonPivot;

  if (moonPivot) {

    moonPivot.rotation.y +=
      1.2 *
      speed *
      delta;
  }

  if (moonMesh) {

    moonMesh.rotation.y +=
      0.3 *
      speed *
      delta;
  }

  if (asteroidBelt) {

    asteroidBelt.rotation.y +=
      0.025 *
      speed *
      delta;
  }
}

function updateGalaxies(
  delta
) {

  if (
    !state.simulationRunning
  ) {
    return;
  }

  if (milkyWayVisual) {

    milkyWayVisual.rotation.z +=
      0.0015 *
      delta *
      state.simulationSpeed;
  }

  if (andromedaVisual) {

    andromedaVisual.rotation.z -=
      0.001 *
      delta *
      state.simulationSpeed;
  }

  if (accretionDisk) {

    accretionDisk.rotation.z +=
      0.2 *
      delta *
      state.simulationSpeed;
  }

  if (
    starObjects.background
  ) {

    starObjects.background.rotation.y +=
      0.00008 *
      delta *
      state.simulationSpeed;
  }
}

/* =========================================================
   LABEL POSITIONING
   ========================================================= */

function updateLabels() {

  Object.values(
    labels
  ).forEach(
    entry => {

      if (
        !entry ||
        !entry.sprite ||
        !entry.object
      ) {
        return;
      }

      const position =
        entry.object.getWorldPosition(
          new THREE.Vector3()
        );

      position.y +=
        2.5;

      entry.sprite.position.copy(
        position
      );

      const distance =
        camera.position.distanceTo(
          position
        );

      entry.sprite.visible =
        state.showLabels &&
        distance < 300;
    }
  );
}

/* =========================================================
   SELECTION RING UPDATE
   ========================================================= */

function updateSelectionRing() {

  if (
    !selectionRing ||
    !state.selectedKey
  ) {
    return;
  }

  const object =
    objectRegistry[
      state.selectedKey
    ];

  if (!object) {
    return;
  }

  const position =
    object.getWorldPosition(
      new THREE.Vector3()
    );

  selectionRing.position.copy(
    position
  );

  const data =
    OBJECTS[
      state.selectedKey
    ];

  if (data) {

    const scale =
      Math.max(
        1,
        data.radius * 1.8
      );

    selectionRing.scale.set(
      scale,
      scale,
      scale
    );

    selectionRing.rotation.z +=
      0.01;
  }
}

/* =========================================================
   FPS
   ========================================================= */

function updateFPS() {

  state.frameCounter++;

  const now =
    performance.now();

  const elapsed =
    now -
    state.fpsTime;

  if (
    elapsed >=
    1000
  ) {

    state.fps =
      Math.round(
        (
          state.frameCounter *
          1000
        ) /
        elapsed
      );

    state.frameCounter =
      0;

    state.fpsTime =
      now;

    setText(
      "fps-counter",
      state.fps +
        " FPS"
    );
  }
}

/* =========================================================
   BUTTON HELPERS
   ========================================================= */

function bindButton(
  ids,
  callback
) {

  ids.forEach(
    id => {

      const element =
        getElement(id);

      if (!element) {
        return;
      }

      element.addEventListener(
        "click",
        callback
      );
    }
  );
}

/* =========================================================
   NAVIGATION BUTTONS
   ========================================================= */

function setupButtons() {

  bindButton(
    [
      "home-button",
      "nav-home",
      "btn-home"
    ],
    goHome
  );

  bindButton(
    [
      "solar-system-button",
      "explore-solar-system",
      "btn-solar"
    ],
    () => {

      setMode(
        "solar"
      );

      focusObject(
        "sun"
      );
    }
  );

  bindButton(
    [
      "galaxies-button",
      "discover-galaxies",
      "btn-galaxies"
    ],
    () => {

      setMode(
        "galaxy"
      );

      focusObject(
        "andromeda"
      );
    }
  );

  bindButton(
    [
      "black-holes-button",
      "explore-black-holes",
      "btn-blackholes"
    ],
    () => {

      setMode(
        "blackhole"
      );
    }
  );

  bindButton(
    [
      "start-exploring",
      "start-button",
      "btn-start"
    ],
    startExploreJourney
  );

  bindButton(
    [
      "explore-button"
    ],
    startExploreJourney
  );

  bindButton(
    [
      "time-travel-button",
      "btn-time"
    ],
    () => {

      const panel =
        getElement(
          "time-travel-panel"
        );

      if (panel) {
        panel.classList.toggle(
          "hidden"
        );
      }
    }
  );

  bindButton(
    [
      "compare-button",
      "btn-compare"
    ],
    () => {

      const panel =
        getElement(
          "compare-panel"
        );

      if (panel) {
        panel.classList.toggle(
          "hidden"
        );
      }
    }
  );

  bindButton(
    [
      "close-info",
      "close-panel",
      "info-close"
    ],
    closeInfoPanel
  );

  bindButton(
    [
      "toggle-orbits"
    ],
    toggleOrbits
  );

  bindButton(
    [
      "toggle-stars"
    ],
    toggleStars
  );

  bindButton(
    [
      "toggle-labels"
    ],
    toggleLabels
  );

  bindButton(
    [
      "pause-button",
      "simulation-toggle"
    ],
    toggleSimulation
  );

  bindButton(
    [
      "zoom-in"
    ],
    () => {

      state.targetCameraDistance *=
        0.8;

      state.targetCameraDistance =
        Math.max(
          1.2,
          state.targetCameraDistance
        );
    }
  );

  bindButton(
    [
      "zoom-out"
    ],
    () => {

      state.targetCameraDistance *=
        1.25;

      state.targetCameraDistance =
        Math.min(
          100000,
          state.targetCameraDistance
        );
    }
  );

  bindButton(
    [
      "camera-home"
    ],
    goHome
  );
}

/* =========================================================
   TIME CONTROLS
   ========================================================= */

function setupTimeControls() {

  const slider =
    getElement(
      "time-slider"
    );

  if (!slider) {
    return;
  }

  slider.addEventListener(
    "input",
    () => {

      setTimeTravel(
        Number(
          slider.value
        )
      );
    }
  );

  setTimeTravel(
    Number(
      slider.value
    )
  );
}

/* =========================================================
   SPEED CONTROLS
   ========================================================= */

function setupSpeedControls() {

  const slider =
    getElement(
      "simulation-speed"
    );

  if (!slider) {
    return;
  }

  slider.addEventListener(
    "input",
    () => {

      setSimulationSpeed(
        slider.value
      );

      setText(
        "speed-value",
        state.simulationSpeed.toFixed(
          1
        ) +
          "×"
      );
    }
  );
}

/* =========================================================
   INFO TAB SYSTEM
   ========================================================= */

function setupInfoTabs() {

  const buttons =
    document.querySelectorAll(
      "[data-info-tab]"
    );

  buttons.forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          const target =
            button.dataset.infoTab;

          document
            .querySelectorAll(
              "[data-info-section]"
            )
            .forEach(
              section => {

                section.classList.toggle(
                  "active",
                  section.dataset.infoSection ===
                    target
                );
              }
            );

          buttons.forEach(
            other => {

              other.classList.toggle(
                "active",
                other === button
              );
            }
          );
        }
      );
    }
  );
}

/* =========================================================
   REALISTIC PLANET DETAIL
   ========================================================= */

function addPlanetDetail(
  key,
  mesh
) {

  if (
    !mesh ||
    !OBJECTS[key]
  ) {
    return;
  }

  const data =
    OBJECTS[key];

  if (
    key ===
    "earth"
  ) {

    const atmosphere =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          data.radius * 1.04,
          48,
          48
        ),
        new THREE.MeshBasicMaterial({
          color: 0x55bbff,
          transparent: true,
          opacity: 0.08,
          side: THREE.BackSide
        })
      );

    mesh.add(
      atmosphere
    );
  }

  if (
    key ===
    "jupiter"
  ) {

    for (
      let i = 0;
      i < 6;
      i++
    ) {

      const stripe =
        new THREE.Mesh(
          new THREE.SphereGeometry(
            data.radius *
              (
                0.99 -
                i * 0.001
              ),
            40,
            20
          ),
          new THREE.MeshBasicMaterial({
            color:
              i % 2 === 0
                ? 0xb98f6a
                : 0xd5b28c,
            transparent: true,
            opacity: 0.035
          })
        );

      mesh.add(
        stripe
      );
    }
  }
}

/* =========================================================
   OBJECT LABEL SETUP
   ========================================================= */

function createAllLabels() {

  Object.entries(
    objectRegistry
  ).forEach(
    ([key, object]) => {

      if (
        !OBJECTS[key] ||
        labels[key]
      ) {
        return;
      }

      createLabel(
        OBJECTS[key].name,
        object
      );
    }
  );
}

/* =========================================================
   OBJECT VISIBILITY BY SCALE
   ========================================================= */

function updateScaleVisibility() {

  const distance =
    camera.position.length();

  if (
    distance < 100
  ) {

    solarSystemGroup.visible =
      true;
  }

  if (
    distance > 100
  ) {

    galaxyGroup.visible =
      true;
  }

  if (
    distance > 500
  ) {

    solarSystemGroup.visible =
      false;
  }

  if (
    distance < 250
  ) {

    galaxyGroup.visible =
      state.currentMode !==
      "solar";
  }
}

/* =========================================================
   UI STATUS
   ========================================================= */

function updateStatus() {

  setText(
    "simulation-status",
    state.simulationRunning
      ? "SIMULATION ONLINE"
      : "SIMULATION PAUSED"
  );

  setText(
    "scale-indicator",
    getScaleText()
  );

  if (
    state.selectedKey
  ) {

    const data =
      OBJECTS[
        state.selectedKey
      ];

    if (data) {

      setText(
        "selected-object",
        data.name
      );
    }
  }
}

function getScaleText() {

  const distance =
    state.targetCameraDistance;

  if (
    distance < 100
  ) {
    return "SOLAR SYSTEM";
  }

  if (
    distance < 500
  ) {
    return "STELLAR NEIGHBORHOOD";
  }

  if (
    distance < 1200
  ) {
    return "GALACTIC SCALE";
  }

  return "COSMIC SCALE";
}

/* =========================================================
   OBJECT DISCOVERY
   ========================================================= */

function registerObject(
  key,
  object
) {

  if (
    !key ||
    !object
  ) {
    return;
  }

  object.userData.objectKey =
    key;

  objectRegistry[key] =
    object;
}

function registerAllObjects() {

  Object.entries(
    planetObjects
  ).forEach(
    ([key, object]) => {

      registerObject(
        key,
        object
      );
    }
  );

  if (sunMesh) {
    registerObject(
      "sun",
      sunMesh
    );
  }

  if (moonMesh) {
    registerObject(
      "moon",
      moonMesh
    );
  }

  if (milkyWayVisual) {
    registerObject(
      "milkyway",
      milkyWayVisual
    );
  }

  if (andromedaVisual) {
    registerObject(
      "andromeda",
      andromedaVisual
    );
  }

  if (blackHoleVisual) {
    registerObject(
      "sagittariusA",
      blackHoleVisual
    );
  }
}

/* =========================================================
   SOURCES
   ========================================================= */

const SOURCE_DATA = {

  default: [
    "NASA Solar System Exploration",
    "NASA Science",
    "ESA",
    "SIMBAD Astronomical Database"
  ],

  exoplanets: [
    "NASA Exoplanet Archive"
  ],

  stars: [
    "SIMBAD Astronomical Database",
    "ESA Gaia"
  ],

  galaxies: [
    "NASA/IPAC Extragalactic Database",
    "ESA"
  ]
};

function getSources(
  key
) {

  const data =
    OBJECTS[key];

  if (!data) {
    return SOURCE_DATA.default;
  }

  if (
    data.category ===
    "star"
  ) {
    return SOURCE_DATA.stars;
  }

  if (
    data.category ===
    "galaxy"
  ) {
    return SOURCE_DATA.galaxies;
  }

  return SOURCE_DATA.default;
}

function renderSources(
  key
) {

  const container =
    getElement(
      "source-list"
    );

  if (!container) {
    return;
  }

  container.innerHTML =
    "";

  getSources(
    key
  ).forEach(
    source => {

      const item =
        document.createElement(
          "div"
        );

      item.className =
        "source-item";

      item.textContent =
        source;

      container.appendChild(
        item
      );
    }
  );
}

/* =========================================================
   OPEN PANEL WRAPPER
   ========================================================= */

function showObject(
  key
) {

  if (
    !OBJECTS[key]
  ) {
    return;
  }

  selectObject(
    key
  );

  focusCameraOnly(
    key
  );

  renderSources(
    key
  );
}

function focusCameraOnly(
  key
) {

  const object =
    objectRegistry[key];

  if (!object) {
    return;
  }

  const position =
    object.getWorldPosition(
      new THREE.Vector3()
    );

  state.cameraTarget.copy(
    position
  );

  const data =
    OBJECTS[key];

  if (!data) {
    return;
  }

  if (
    data.category ===
    "galaxy"
  ) {

    state.targetCameraDistance =
      180;
  }

  else if (
    data.category ===
    "blackhole"
  ) {

    state.targetCameraDistance =
      45;
  }

  else {

    state.targetCameraDistance =
      Math.max(
        5,
        data.radius * 7
      );
  }
}

/* =========================================================
   INITIAL SCENE
   ========================================================= */

function buildUniverse() {

  createSun();

  const planetKeys = [
    "mercury",
    "venus",
    "earth",
    "mars",
    "jupiter",
    "saturn",
    "uranus",
    "neptune",
    "pluto"
  ];

  planetKeys.forEach(
    key => {
      createPlanet(
        key
      );
    }
  );

  earthMesh =
    planetObjects.earth;

  createMoon();

  createSaturnRings();

  createAsteroidBelt();

  createStarField();

  createMilkyWay();

  createAndromeda();

  createBlackHole();

  createNearbyStars();

  createSelectionRing();

  registerAllObjects();

  createAllLabels();

  planetKeys.forEach(
    key => {

      addPlanetDetail(
        key,
        planetObjects[key]
      );
    }
  );
}

/* =========================================================
   RENDERER DOM
   ========================================================= */

function attachRenderer() {

  const container =
    getElement(
      "universe-container"
    ) ||
    getElement(
      "scene-container"
    ) ||
    document.body;

  if (
    renderer.domElement.parentElement !==
    container
  ) {

    container.appendChild(
      renderer.domElement
    );
  }

  renderer.domElement.style.display =
    "block";

  renderer.domElement.style.width =
    "100%";

  renderer.domElement.style.height =
    "100%";

  renderer.domElement.style.touchAction =
    "none";
}

/* =========================================================
   EVENT LISTENERS
   ========================================================= */

function setupInteraction() {

  renderer.domElement.addEventListener(
    "pointerdown",
    onPointerDown
  );

  renderer.domElement.addEventListener(
    "pointermove",
    onPointerMove
  );

  renderer.domElement.addEventListener(
    "pointerup",
    onPointerUp
  );

  renderer.domElement.addEventListener(
    "pointercancel",
    onPointerUp
  );

  renderer.domElement.addEventListener(
    "dblclick",
    onDoubleClick
  );

  renderer.domElement.addEventListener(
    "wheel",
    onWheel,
    {
      passive: false
    }
  );

  renderer.domElement.addEventListener(
    "touchstart",
    onTouchStart,
    {
      passive: true
    }
  );

  renderer.domElement.addEventListener(
    "touchmove",
    onTouchMove,
    {
      passive: true
    }
  );

  renderer.domElement.addEventListener(
    "click",
    event => {

      if (
        state.dragging
      ) {
        return;
      }

      const object =
        getIntersectedObject(
          event
        );

      if (!object) {
        return;
      }

      const key =
        object.userData.objectKey;

      if (
        key &&
        OBJECTS[key]
      ) {

        focusObject(
          key
        );
      }
    }
  );
}

/* =========================================================
   HOVER INFORMATION
   ========================================================= */

function setupHover() {

  renderer.domElement.addEventListener(
    "pointermove",
    event => {

      if (
        state.dragging
      ) {
        return;
      }

      const object =
        getIntersectedObject(
          event
        );

      if (!object) {

        state.hoveredKey =
          null;

        renderer.domElement.style.cursor =
          "default";

        return;
      }

      const key =
        object.userData.objectKey;

      if (
        key &&
        OBJECTS[key]
      ) {

        state.hoveredKey =
          key;

        renderer.domElement.style.cursor =
          "pointer";
      }
    }
  );
}

/* =========================================================
   INITIAL CAMERA
   ========================================================= */

function setupCamera() {

  camera.position.set(
    0,
    24,
    68
  );

  camera.lookAt(
    0,
    0,
    0
  );

  state.cameraTarget.set(
    0,
    0,
    0
  );

  state.targetCameraDistance =
    68;
}

/* =========================================================
   LIGHT EFFECT
   ========================================================= */

function createAmbientStars() {

  const geometry =
    new THREE.SphereGeometry(
      0.03,
      6,
      6
    );

  const material =
    new THREE.MeshBasicMaterial({
      color: 0x88bbff
    });

  for (
    let i = 0;
    i < 250;
    i++
  ) {

    const star =
      new THREE.Mesh(
        geometry,
        material
      );

    star.position.set(
      (
        Math.random() -
        0.5
      ) *
        1200,
      (
        Math.random() -
        0.5
      ) *
        1200,
      (
        Math.random() -
        0.5
      ) *
        1200
    );

    universeGroup.add(
      star
    );
  }
}

/* =========================================================
   LOADING
   ========================================================= */

function finishLoading() {

  state.loading =
    false;

  const loading =
    getElement(
      "loading"
    );

  if (loading) {

    loading.classList.add(
      "hidden"
    );

    loading.style.opacity =
      "0";

    loading.style.pointerEvents =
      "none";
  }

  setText(
    "loading-text",
    "UNIVERSE READY"
  );

  setTimeout(
    () => {

      if (loading) {
        loading.style.display =
          "none";
      }
    },
    700
  );
}

/* =========================================================
   ERROR HANDLING
   ========================================================= */

window.addEventListener(
  "error",
  event => {

    console.error(
      "Universe Explorer error:",
      event.error ||
        event.message
    );

    const text =
      getElement(
        "loading-text"
      );

    if (
      state.loading &&
      text
    ) {

      text.textContent =
        "UNIVERSE ERROR: " +
        event.message;
    }
  }
);

/* =========================================================
   MAIN ANIMATION LOOP
   ========================================================= */

function animate() {

  requestAnimationFrame(
    animate
  );

  const delta =
    Math.min(
      clock.getDelta(),
      0.05
    );

  state.universeTime +=
    delta;

  updateSolarSystem(
    delta
  );

  updateGalaxies(
    delta
  );

  updateCamera();

  updateLabels();

  updateSelectionRing();

  updateScaleIndicator();

  updateScaleVisibility();

  updateStatus();

  updateFPS();

  renderer.render(
    scene,
    camera
  );
}

/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeUniverseExplorer() {

  if (
    state.initialized
  ) {
    return;
  }

  state.initialized =
    true;

  try {

    attachRenderer();

    setupCamera();

    buildUniverse();

    createAmbientStars();

    setupInteraction();

    setupHover();

    setupSearch();

    setupButtons();

    setupTimeControls();

    setupSpeedControls();

    setupInfoTabs();

    applyPerformanceMode(
      "auto"
    );

    setOrbitVisibility(
      true
    );

    setStarVisibility(
      true
    );

    labelGroup.visible =
      true;

    setMode(
      "universe"
    );

    finishLoading();

    toast(
      "Universe Explorer ready"
    );

    animate();

    console.log(
      "UNIVERSE EXPLORER READY"
    );

    console.log(
      "Objects:",
      Object.keys(
        OBJECTS
      ).length
    );

  }

  catch (error) {

    console.error(
      error
    );

    const loadingText =
      getElement(
        "loading-text"
      );

    if (loadingText) {

      loadingText.textContent =
        "INITIALIZATION ERROR: " +
        error.message;
    }
  }
}

/* =========================================================
   DOM READY
   ========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeUniverseExplorer,
    {
      once: true
    }
  );

}
else {

  initializeUniverseExplorer();

}

/* =========================================================
   FALLBACK LOADING SAFETY
   ========================================================= */

setTimeout(
  () => {

    if (
      state.loading
    ) {

      const loading =
        getElement(
          "loading"
        );

      if (loading) {

        loading.classList.add(
          "hidden"
        );

        loading.style.pointerEvents =
          "none";
      }

      state.loading =
        false;
    }

  },
  8000
);

/* =========================================================
   GLOBAL API
   ========================================================= */

window.UniverseExplorer = {

  focusObject,

  selectObject,

  openInfoPanel,

  closeInfoPanel,

  searchUniverse,

  startExploreJourney,

  setMode,

  goHome,

  toggleSimulation,

  setSimulationSpeed,

  toggleOrbits,

  toggleStars,

  toggleLabels,

  setTimeTravel,

  addCompareObject,

  renderComparison,

  applyPerformanceMode,

  state,

  objects: OBJECTS

};

/* =========================================================
   END OF UNIVERSE EXPLORER
   ========================================================= */
