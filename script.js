"use strict";

/* =========================================================
   UNIVERSE EXPLORER
   CORE ENGINE
   ========================================================= */

const universe =
  document.getElementById("universe");

const scene =
  new THREE.Scene();

scene.background =
  new THREE.Color(0x000207);

const camera =
  new THREE.PerspectiveCamera(
    55,
    window.innerWidth /
      window.innerHeight,
    0.01,
    100000
  );

camera.position.set(
  0,
  18,
  42
);

const renderer =
  new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
  });

renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio || 1,
    2
  )
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.outputColorSpace =
  THREE.SRGBColorSpace;

universe.appendChild(
  renderer.domElement
);


/* =========================================================
   LIGHTING
   ========================================================= */

const ambientLight =
  new THREE.AmbientLight(
    0xffffff,
    0.18
  );

scene.add(
  ambientLight
);

const sunLight =
  new THREE.PointLight(
    0xffffff,
    4,
    500
  );

sunLight.position.set(
  0,
  0,
  0
);

scene.add(
  sunLight
);


/* =========================================================
   MAIN GROUPS
   ========================================================= */

const universeGroup =
  new THREE.Group();

const solarSystemGroup =
  new THREE.Group();

const galaxyGroup =
  new THREE.Group();

const largeScaleGroup =
  new THREE.Group();

scene.add(
  universeGroup
);

universeGroup.add(
  solarSystemGroup
);

universeGroup.add(
  galaxyGroup
);

universeGroup.add(
  largeScaleGroup
);


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
   PLANET DATA
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

function createPlanetMaterial(
  color
) {

  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.82,
    metalness: 0.02
  });

}


function createStarMaterial(
  color,
  emissiveIntensity = 1
) {

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

const sunGeometry =
  new THREE.SphereGeometry(
    OBJECTS.Sun.radius,
    64,
    64
  );

const sunMaterial =
  createStarMaterial(
    OBJECTS.Sun.color,
    2.2
  );

const sun =
  new THREE.Mesh(
    sunGeometry,
    sunMaterial
  );

sun.name =
  "Sun";

sun.userData.objectKey =
  "Sun";

solarSystemGroup.add(
  sun
);


/* =========================================================
   SUN GLOW
   ========================================================= */

const sunGlowGeometry =
  new THREE.SphereGeometry(
    5.2,
    48,
    48
  );

const sunGlowMaterial =
  new THREE.MeshBasicMaterial({
    color: 0xffb733,
    transparent: true,
    opacity: 0.08,
    side: THREE.BackSide
  });

const sunGlow =
  new THREE.Mesh(
    sunGlowGeometry,
    sunGlowMaterial
  );

sun.add(
  sunGlow
);


/* =========================================================
   PLANETS
   ========================================================= */

const planetObjects = {};

const planetPivots = {};

for (
  const data of planetData
) {

  const objectInfo =
    OBJECTS[data.key];

  const pivot =
    new THREE.Group();

  planetPivots[data.key] =
    pivot;

  solarSystemGroup.add(
    pivot
  );

  const geometry =
    new THREE.SphereGeometry(
      objectInfo.radius,
      48,
      48
    );

  const material =
    createPlanetMaterial(
      objectInfo.color
    );

  const planet =
    new THREE.Mesh(
      geometry,
      material
    );

  planet.name =
    data.key;

  planet.userData.objectKey =
    data.key;

  planet.position.x =
    data.orbit;

  pivot.add(
    planet
  );

  planetObjects[data.key] =
    planet;

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

  const orbit =
    new THREE.Mesh(
      orbitGeometry,
      orbitMaterial
    );

  orbit.rotation.x =
    Math.PI / 2;

  solarSystemGroup.add(
    orbit
  );

}


/* =========================================================
   MOON
   ========================================================= */

const moonPivot =
  new THREE.Group();

planetObjects.Earth.add(
  moonPivot
);

const moonGeometry =
  new THREE.SphereGeometry(
    OBJECTS.Moon.radius,
    32,
    32
  );

const moonMaterial =
  createPlanetMaterial(
    OBJECTS.Moon.color
  );

const moon =
  new THREE.Mesh(
    moonGeometry,
    moonMaterial
  );

moon.name =
  "Moon";

moon.userData.objectKey =
  "Moon";

moon.position.set(
  2.2,
  0,
  0
);

moonPivot.add(
  moon
);


/* =========================================================
   SATURN RINGS
   ========================================================= */

const saturn =
  planetObjects.Saturn;

const ringGeometry =
  new THREE.RingGeometry(
    3.6,
    5.1,
    96
  );

const ringMaterial =
  new THREE.MeshBasicMaterial({
    color: 0xb9aa83,
    transparent: true,
    opacity: 0.68,
    side: THREE.DoubleSide
  });

const rings =
  new THREE.Mesh(
    ringGeometry,
    ringMaterial
  );

rings.rotation.x =
  Math.PI / 2.4;

saturn.add(
  rings
);


/* =========================================================
   ASTEROID BELT
   ========================================================= */

const asteroidCount =
  900;

const asteroidGeometry =
  new THREE.BufferGeometry();

const asteroidPositions =
  new Float32Array(
    asteroidCount * 3
  );

for (
  let i = 0;
  i < asteroidCount;
  i++
) {

  const angle =
    Math.random() *
    Math.PI * 2;

  const radius =
    25 +
    Math.random() * 4;

  const y =
    (Math.random() - 0.5) *
    1.3;

  asteroidPositions[
    i * 3
  ] =
    Math.cos(angle) *
    radius;

  asteroidPositions[
    i * 3 + 1
  ] =
    y;

  asteroidPositions[
    i * 3 + 2
  ] =
    Math.sin(angle) *
    radius;

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

const asteroidBelt =
  new THREE.Points(
    asteroidGeometry,
    asteroidMaterial
  );

solarSystemGroup.add(
  asteroidBelt
);


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
    new Float32Array(
      count * 3
    );

  for (
    let i = 0;
    i < count;
    i++
  ) {

    const r =
      radius *
      Math.pow(
        Math.random(),
        0.35
      );

    const theta =
      Math.random() *
      Math.PI * 2;

    const phi =
      Math.acos(
        2 * Math.random() - 1
      );

    positions[i * 3] =
      r *
      Math.sin(phi) *
      Math.cos(theta);

    positions[i * 3 + 1] =
      r *
      Math.cos(phi);

    positions[i * 3 + 2] =
      r *
      Math.sin(phi) *
      Math.sin(theta);

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


const stars =
  createStarField(
    12000,
    900,
    0.65,
    0.8
  );

scene.add(
  stars
);
/* =========================================================
   GALAXY VISUALIZATION
   ========================================================= */

function createGalaxy(
  radius,
  arms,
  particles,
  colorA,
  colorB
) {

  const geometry =
    new THREE.BufferGeometry();

  const positions =
    new Float32Array(
      particles * 3
    );

  const colors =
    new Float32Array(
      particles * 3
    );

  const c1 =
    new THREE.Color(colorA);

  const c2 =
    new THREE.Color(colorB);

  for (
    let i = 0;
    i < particles;
    i++
  ) {

    const ratio =
      i / particles;

    const r =
      Math.pow(
        Math.random(),
        0.62
      ) * radius;

    const arm =
      i % arms;

    const armAngle =
      (arm / arms) *
      Math.PI * 2;

    const spiral =
      r * 0.32;

    const angle =
      armAngle +
      spiral +
      (Math.random() - 0.5) *
      0.55;

    const thickness =
      (Math.random() - 0.5) *
      (1 - ratio) *
      5;

    positions[
      i * 3
    ] =
      Math.cos(angle) *
      r +
      thickness;

    positions[
      i * 3 + 1
    ] =
      (Math.random() - 0.5) *
      (1 - ratio) *
      3.5;

    positions[
      i * 3 + 2
    ] =
      Math.sin(angle) *
      r +
      thickness;

    const mixed =
      c1.clone().lerp(
        c2,
        Math.random()
      );

    colors[
      i * 3
    ] =
      mixed.r;

    colors[
      i * 3 + 1
    ] =
      mixed.g;

    colors[
      i * 3 + 2
    ] =
      mixed.b;
  }

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      positions,
      3
    )
  );

  geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(
      colors,
      3
    )
  );

  const material =
    new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
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

const milkyWayVisual =
  createGalaxy(
    85,
    5,
    22000,
    0x6c91ff,
    0xffd9a0
  );

milkyWayVisual.scale.set(
  1,
  0.18,
  1
);

milkyWayVisual.rotation.x =
  0.35;

milkyWayVisual.name =
  "Milky Way";

milkyWayVisual.userData.objectKey =
  "Milky Way";

galaxyGroup.add(
  milkyWayVisual
);


/* =========================================================
   ANDROMEDA
   ========================================================= */

const andromedaVisual =
  createGalaxy(
    70,
    4,
    17000,
    0x89b9ff,
    0xf0d4ff
  );

andromedaVisual.scale.set(
  1,
  0.15,
  1
);

andromedaVisual.rotation.x =
  -0.25;

andromedaVisual.position.set(
  120,
  20,
  -170
);

andromedaVisual.name =
  "Andromeda Galaxy";

andromedaVisual.userData.objectKey =
  "Andromeda Galaxy";

galaxyGroup.add(
  andromedaVisual
);


/* =========================================================
   BLACK HOLE
   ========================================================= */

const blackHoleGroup =
  new THREE.Group();

blackHoleGroup.name =
  "Sagittarius A*";

blackHoleGroup.userData.objectKey =
  "Sagittarius A*";

blackHoleGroup.position.set(
  0,
  0,
  0
);

galaxyGroup.add(
  blackHoleGroup
);


/* EVENT HORIZON */

const blackHoleGeometry =
  new THREE.SphereGeometry(
    2.4,
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

blackHoleGroup.add(
  blackHole
);


/* =========================================================
   ACCRETION DISK
   ========================================================= */

const diskGeometry =
  new THREE.RingGeometry(
    3.1,
    7.5,
    128
  );

const diskMaterial =
  new THREE.MeshBasicMaterial({
    color: 0xff7b32,
    transparent: true,
    opacity: 0.72,
    side: THREE.DoubleSide,
    blending:
      THREE.AdditiveBlending
  });

const disk =
  new THREE.Mesh(
    diskGeometry,
    diskMaterial
  );

disk.rotation.x =
  Math.PI / 2.15;

blackHoleGroup.add(
  disk
);


/* =========================================================
   BLACK HOLE OUTER GLOW
   ========================================================= */

const blackGlowGeometry =
  new THREE.SphereGeometry(
    8.2,
    48,
    48
  );

const blackGlowMaterial =
  new THREE.MeshBasicMaterial({
    color: 0xff5428,
    transparent: true,
    opacity: 0.045,
    side: THREE.BackSide
  });

const blackGlow =
  new THREE.Mesh(
    blackGlowGeometry,
    blackGlowMaterial
  );

blackHoleGroup.add(
  blackGlow
);


/* =========================================================
   DISTANT GALAXIES
   ========================================================= */

const distantGalaxies =
  new THREE.Group();

largeScaleGroup.add(
  distantGalaxies
);

for (
  let i = 0;
  i < 120;
  i++
) {

  const galaxy =
    createGalaxy(
      1.5 +
        Math.random() * 2.5,
      3 +
        Math.floor(
          Math.random() * 3
        ),
      160,
      0x6688cc,
      0xd9c4a2
    );

  const distance =
    180 +
    Math.random() * 500;

  const theta =
    Math.random() *
    Math.PI * 2;

  const phi =
    Math.acos(
      2 * Math.random() - 1
    );

  galaxy.position.set(
    distance *
      Math.sin(phi) *
      Math.cos(theta),

    distance *
      Math.cos(phi),

    distance *
      Math.sin(phi) *
      Math.sin(theta)
  );

  galaxy.scale.setScalar(
    0.3 +
      Math.random() * 0.8
  );

  distantGalaxies.add(
    galaxy
  );
}


/* =========================================================
   OBJECT REGISTRY
   ========================================================= */

const selectableObjects =
  [];

function registerObject(
  object,
  key
) {

  object.userData.objectKey =
    key;

  selectableObjects.push(
    object
  );

}

registerObject(
  sun,
  "Sun"
);

for (
  const key of Object.keys(
    planetObjects
  )
) {

  registerObject(
    planetObjects[key],
    key
  );

}

registerObject(
  moon,
  "Moon"
);

registerObject(
  milkyWayVisual,
  "Milky Way"
);

registerObject(
  andromedaVisual,
  "Andromeda Galaxy"
);

registerObject(
  blackHole,
  "Sagittarius A*"
);


/* =========================================================
   ORBITAL VISUAL SETTINGS
   ========================================================= */

solarSystemGroup.scale.set(
  1,
  1,
  1
);

galaxyGroup.scale.set(
  1,
  1,
  1
);

largeScaleGroup.scale.set(
  1,
  1,
  1
);


/* =========================================================
   CAMERA STATE
   ========================================================= */

let cameraTarget =
  new THREE.Vector3(
    0,
    0,
    0
  );

let cameraDistance =
  42;

let cameraAzimuth =
  0;

let cameraElevation =
  0.25;

let isCameraAnimating =
  false;

let selectedObject =
  null;


/* =========================================================
   CAMERA HELPERS
   ========================================================= */

function getCameraPosition() {

  const x =
    cameraTarget.x +
    Math.cos(cameraAzimuth) *
    Math.cos(cameraElevation) *
    cameraDistance;

  const y =
    cameraTarget.y +
    Math.sin(cameraElevation) *
    cameraDistance;

  const z =
    cameraTarget.z +
    Math.sin(cameraAzimuth) *
    Math.cos(cameraElevation) *
    cameraDistance;

  return new THREE.Vector3(
    x,
    y,
    z
  );

}


function updateCamera() {

  const position =
    getCameraPosition();

  camera.position.lerp(
    position,
    0.08
  );

  camera.lookAt(
    cameraTarget
  );

}


/* =========================================================
   FOCUS OBJECT
   ========================================================= */

function focusObject(
  object,
  key
) {

  if (
    !object ||
    !OBJECTS[key]
  ) {
    return;
  }

  selectedObject =
    object;

  const worldPosition =
    new THREE.Vector3();

  object.getWorldPosition(
    worldPosition
  );

  cameraTarget.copy(
    worldPosition
  );

  const info =
    OBJECTS[key];

  let distance = 12;

  if (
    info.radius < 1
  ) {

    distance = 5;

  } else if (
    info.radius < 3
  ) {

    distance = 9;

  } else if (
    info.radius < 10
  ) {

    distance = 18;

  } else {

    distance = 35;

  }

  cameraDistance =
    distance;

  isCameraAnimating =
    true;

  openObjectPanel(
    key
  );

}


/* =========================================================
   RAYCASTER
   ========================================================= */

const raycaster =
  new THREE.Raycaster();

const pointer =
  new THREE.Vector2();

function updatePointer(
  event
) {

  const rect =
    renderer.domElement.getBoundingClientRect();

  pointer.x =
    (
      (event.clientX -
        rect.left) /
      rect.width
    ) * 2 - 1;

  pointer.y =
    -(
      (event.clientY -
        rect.top) /
      rect.height
    ) * 2 + 1;

}


/* =========================================================
   CLICK DETECTION
   ========================================================= */

renderer.domElement.addEventListener(
  "click",
  event => {

    updatePointer(
      event
    );

    raycaster.setFromCamera(
      pointer,
      camera
    );

    const hits =
      raycaster.intersectObjects(
        selectableObjects,
        true
      );

    if (
      !hits.length
    ) {
      return;
    }

    let hit =
      hits[0].object;

    let key =
      hit.userData.objectKey ||
      hit.name;

    while (
      hit.parent &&
      !hit.userData.objectKey &&
      !hit.name
    ) {

      hit =
        hit.parent;

    }

    key =
      hit.userData.objectKey ||
      hit.name ||
      key;

    if (
      OBJECTS[key]
    ) {

      focusObject(
        hit,
        key
      );

    }

  }
);


/* =========================================================
   HOVER DETECTION
   ========================================================= */

renderer.domElement.addEventListener(
  "pointermove",
  event => {

    updatePointer(
      event
    );

    raycaster.setFromCamera(
      pointer,
      camera
    );

    const hits =
      raycaster.intersectObjects(
        selectableObjects,
        true
      );

    renderer.domElement.style.cursor =
      hits.length
        ? "pointer"
        : "default";

  }
);


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
   BASIC CAMERA DRAG
   ========================================================= */

let dragging =
  false;

let previousX =
  0;

let previousY =
  0;

renderer.domElement.addEventListener(
  "pointerdown",
  event => {

    dragging =
      true;

    previousX =
      event.clientX;

    previousY =
      event.clientY;

  }
);

window.addEventListener(
  "pointerup",
  () => {

    dragging =
      false;

  }
);

renderer.domElement.addEventListener(
  "pointermove",
  event => {

    if (
      !dragging
    ) {
      return;
    }

    const dx =
      event.clientX -
      previousX;

    const dy =
      event.clientY -
      previousY;

    previousX =
      event.clientX;

    previousY =
      event.clientY;

    cameraAzimuth -=
      dx * 0.006;

    cameraElevation +=
      dy * 0.004;

    cameraElevation =
      Math.max(
        -1.35,
        Math.min(
          1.35,
          cameraElevation
        )
      );

  }
);


/* =========================================================
   MOUSE WHEEL ZOOM
   ========================================================= */

renderer.domElement.addEventListener(
  "wheel",
  event => {

    event.preventDefault();

    cameraDistance *=
      1 +
      event.deltaY *
      0.001;

    cameraDistance =
      Math.max(
        2,
        Math.min(
          1500,
          cameraDistance
        )
      );

  },
  {
    passive: false
  }
);


/* =========================================================
   TOUCH ZOOM
   ========================================================= */

let touchDistance =
  null;

renderer.domElement.addEventListener(
  "touchmove",
  event => {

    if (
      event.touches.length !== 2
    ) {
      return;
    }

    const a =
      event.touches[0];

    const b =
      event.touches[1];

    const dx =
      a.clientX -
      b.clientX;

    const dy =
      a.clientY -
      b.clientY;

    const distance =
      Math.sqrt(
        dx * dx +
        dy * dy
      );

    if (
      touchDistance !== null
    ) {

      const delta =
        distance -
        touchDistance;

      cameraDistance *=
        1 -
        delta * 0.002;

      cameraDistance =
        Math.max(
          2,
          Math.min(
            1500,
            cameraDistance
          )
        );

    }

    touchDistance =
      distance;

  },
  {
    passive: true
  }
);

renderer.domElement.addEventListener(
  "touchend",
  () => {

    touchDistance =
      null;

  }
);


/* =========================================================
   INITIAL CAMERA
   ========================================================= */

cameraTarget.set(
  0,
  0,
  0
);

cameraDistance =
  42;

cameraAzimuth =
  0;

cameraElevation =
  0.25;


/* =========================================================
   ANIMATION CLOCK
   ========================================================= */

const clock =
  new THREE.Clock();
/* =========================================================
   UI REFERENCES
   ========================================================= */

const loading =
  document.getElementById(
    "loading"
  );

const loadingText =
  document.getElementById(
    "loading-text"
  );

const welcome =
  document.getElementById(
    "welcome"
  );

const infoPanel =
  document.getElementById(
    "info-panel"
  );

const objectTitle =
  document.getElementById(
    "object-title"
  );

const objectType =
  document.getElementById(
    "object-type"
  );

const objectInfo =
  document.getElementById(
    "object-info"
  );

const searchInput =
  document.getElementById(
    "search-input"
  );

const searchResults =
  document.getElementById(
    "search-results"
  );

const scaleLabel =
  document.getElementById(
    "scale-label"
  );

const breadcrumb =
  document.getElementById(
    "breadcrumb"
  );

const toast =
  document.getElementById(
    "toast"
  );


/* =========================================================
   UI SAFETY HELPERS
   ========================================================= */

function setText(
  element,
  value
) {

  if (
    element
  ) {

    element.textContent =
      value;

  }

}


function showElement(
  element
) {

  if (
    element
  ) {

    element.classList.remove(
      "hidden"
    );

  }

}


function hideElement(
  element
) {

  if (
    element
  ) {

    element.classList.add(
      "hidden"
    );

  }

}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer =
  null;

function showToast(
  message
) {

  if (
    !toast
  ) {
    return;
  }

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
      2800
    );

}


/* =========================================================
   INFORMATION PANEL
   ========================================================= */

function openObjectPanel(
  key
) {

  const data =
    OBJECTS[key];

  if (
    !data
  ) {
    return;
  }

  setText(
    objectTitle,
    data.name
  );

  setText(
    objectType,
    data.type
  );

  if (
    objectInfo
  ) {

    objectInfo.innerHTML =
      `
        <div class="object-stat">
          <span>Distance</span>
          <strong>${data.distance}</strong>
        </div>

        <div class="object-stat">
          <span>Size</span>
          <strong>${data.size}</strong>
        </div>

        <div class="object-stat">
          <span>Mass</span>
          <strong>${data.mass}</strong>
        </div>

        <div class="object-stat">
          <span>Temperature</span>
          <strong>${data.temperature}</strong>
        </div>
      `;

  }

  showElement(
    infoPanel
  );

  hideElement(
    welcome
  );

}


/* =========================================================
   CLOSE PANEL
   ========================================================= */

const closePanel =
  document.getElementById(
    "close-panel"
  );

if (
  closePanel
) {

  closePanel.addEventListener(
    "click",
    () => {

      hideElement(
        infoPanel
      );

      selectedObject =
        null;

    }
  );

}


/* =========================================================
   OBJECT EXTRA INFORMATION
   ========================================================= */

const extraData = {

  Sun: {
    composition:
      "Mostly hydrogen and helium.",
    formation:
      "Formed about 4.6 billion years ago.",
    discovery:
      "Known since prehistoric times.",
    orbit:
      "Orbits the center of the Milky Way.",
    curiosity:
      "Contains more than 99% of the Solar System's mass.",
    missions:
      "Parker Solar Probe, Solar Orbiter and many earlier missions."
  },

  Mercury: {
    composition:
      "Large metallic core with a rocky mantle and crust.",
    formation:
      "Formed during the early Solar System.",
    discovery:
      "Known since antiquity.",
    orbit:
      "Orbits the Sun every ≈88 Earth days.",
    curiosity:
      "It is the smallest planet in the Solar System.",
    missions:
      "MESSENGER and BepiColombo."
  },

  Venus: {
    composition:
      "Rocky planet with a dense carbon-dioxide atmosphere.",
    formation:
      "Formed approximately 4.5 billion years ago.",
    discovery:
      "Known since antiquity.",
    orbit:
      "Orbits the Sun every ≈225 Earth days.",
    curiosity:
      "Its day is longer than its year.",
    missions:
      "Venus Express, Magellan and other missions."
  },

  Earth: {
    composition:
      "Rocky planet with abundant surface liquid water.",
    formation:
      "Formed about 4.54 billion years ago.",
    discovery:
      "Known since prehistory.",
    orbit:
      "Orbits the Sun once every ≈365.25 days.",
    curiosity:
      "The only known world with life.",
    missions:
      "Thousands of Earth-observing satellites and missions."
  },

  Moon: {
    composition:
      "Rocky body dominated by silicate minerals.",
    formation:
      "Likely formed after a giant impact early in Earth's history.",
    discovery:
      "Known since prehistoric times.",
    orbit:
      "Orbits Earth in about 27.3 days relative to the stars.",
    curiosity:
      "It is tidally locked to Earth.",
    missions:
      "Apollo, Artemis, Chang'e, Chandrayaan and others."
  },

  Mars: {
    composition:
      "Rocky planet with an iron-rich interior.",
    formation:
      "Formed during the early Solar System.",
    discovery:
      "Known since antiquity.",
    orbit:
      "Orbits the Sun every ≈687 Earth days.",
    curiosity:
      "Home to Olympus Mons, the largest known volcano in the Solar System.",
    missions:
      "Mars rovers, orbiters and landers."
  },

  Jupiter: {
    composition:
      "Mostly hydrogen and helium.",
    formation:
      "Formed early in Solar System history.",
    discovery:
      "Known since antiquity.",
    orbit:
      "Orbits the Sun every ≈11.86 Earth years.",
    curiosity:
      "Its Great Red Spot is a gigantic atmospheric storm.",
    missions:
      "Juno, Galileo and Voyager flybys."
  },

  Saturn: {
    composition:
      "Mostly hydrogen and helium.",
    formation:
      "Formed about 4.5 billion years ago.",
    discovery:
      "Known since antiquity.",
    orbit:
      "Orbits the Sun every ≈29.5 Earth years.",
    curiosity:
      "Its rings are made mostly of water-ice particles.",
    missions:
      "Cassini-Huygens and Voyager."
  },

  Uranus: {
    composition:
      "Hydrogen, helium and volatile-rich materials.",
    formation:
      "Formed in the outer Solar System.",
    discovery:
      "Recognized as a planet in 1781.",
    orbit:
      "Orbits the Sun every ≈84 Earth years.",
    curiosity:
      "Its axis is tilted by about 98 degrees.",
    missions:
      "Voyager 2 is the only spacecraft to visit it closely."
  },

  Neptune: {
    composition:
      "Hydrogen, helium and heavier volatile compounds.",
    formation:
      "Formed in the outer Solar System.",
    discovery:
      "Discovered in 1846.",
    orbit:
      "Orbits the Sun every ≈165 Earth years.",
    curiosity:
      "It has some of the fastest winds measured on a planet.",
    missions:
      "Voyager 2."
  },

  Pluto: {
    composition:
      "Rock and ice.",
    formation:
      "Formed in the distant outer Solar System.",
    discovery:
      "Discovered in 1930.",
    orbit:
      "Orbits the Sun in about 248 Earth years.",
    curiosity:
      "It has a heart-shaped region called Tombaugh Regio.",
    missions:
      "New Horizons."
  },

  "Sagittarius A*": {
    composition:
      "A supermassive black hole surrounded by hot gas and stars.",
    formation:
      "Its exact formation history remains an active research topic.",
    discovery:
      "The compact radio source was identified through observations of the Galactic Center.",
    orbit:
      "Located at the center of the Milky Way.",
    curiosity:
      "Stars near it orbit an extremely compact massive object.",
    missions:
      "Observed with radio, infrared, X-ray and other telescopes."
  },

  "Milky Way": {
    composition:
      "Stars, gas, dust, dark matter and a central supermassive black hole.",
    formation:
      "Assembled over billions of years through mergers and accretion.",
    discovery:
      "Its structure has been reconstructed through astronomical observations.",
    orbit:
      "Moves through the Local Group.",
    curiosity:
      "The Solar System lies in one of its spiral-arm regions.",
    missions:
      "Gaia and many ground- and space-based observatories."
  },

  "Andromeda Galaxy": {
    composition:
      "Stars, gas, dust and dark matter.",
    formation:
      "Built through long-term galaxy evolution and mergers.",
    discovery:
      "Visible to the naked eye under dark skies.",
    orbit:
      "Part of the Local Group.",
    curiosity:
      "It is the nearest large spiral galaxy to the Milky Way.",
    missions:
      "Observed by Hubble, JWST and many other observatories."
  }

};


/* =========================================================
   RENDER EXTRA INFORMATION
   ========================================================= */

function renderExtraData(
  key
) {

  const data =
    extraData[key];

  if (
    !data ||
    !objectInfo
  ) {
    return;
  }

  const mainInfo =
    OBJECTS[key];

  objectInfo.innerHTML =
    `
      <div class="object-stat">
        <span>Distance</span>
        <strong>${mainInfo.distance}</strong>
      </div>

      <div class="object-stat">
        <span>Size</span>
        <strong>${mainInfo.size}</strong>
      </div>

      <div class="object-stat">
        <span>Mass</span>
        <strong>${mainInfo.mass}</strong>
      </div>

      <div class="object-stat">
        <span>Temperature</span>
        <strong>${mainInfo.temperature}</strong>
      </div>

      <div class="object-section">
        <h4>COMPOSITION</h4>
        <p>${data.composition}</p>
      </div>

      <div class="object-section">
        <h4>FORMATION</h4>
        <p>${data.formation}</p>
      </div>

      <div class="object-section">
        <h4>OBSERVATION</h4>
        <p>${data.discovery}</p>
      </div>

      <div class="object-section">
        <h4>ORBIT / MOTION</h4>
        <p>${data.orbit}</p>
      </div>

      <div class="object-section">
        <h4>CURIOSITY</h4>
        <p>${data.curiosity}</p>
      </div>

      <div class="object-section">
        <h4>MISSIONS</h4>
        <p>${data.missions}</p>
      </div>
    `;

}


/* =========================================================
   PANEL TAB SYSTEM
   ========================================================= */

const panelTabs =
  document.querySelectorAll(
    "[data-panel-tab]"
  );

panelTabs.forEach(
  tab => {

    tab.addEventListener(
      "click",
      () => {

        panelTabs.forEach(
          item => {

            item.classList.remove(
              "active"
            );

          }
        );

        tab.classList.add(
          "active"
        );

        const mode =
          tab.dataset.panelTab;

        if (
          selectedObject
        ) {

          const key =
            selectedObject.userData
              .objectKey;

          if (
            mode === "overview"
          ) {

            openObjectPanel(
              key
            );

          }

          if (
            mode === "details"
          ) {

            renderExtraData(
              key
            );

          }

        }

      }
    );

  }
);


/* =========================================================
   SEARCH DATABASE
   ========================================================= */

const searchableObjects =
  Object.keys(
    OBJECTS
  );


function searchObjects(
  query
) {

  const text =
    query
      .trim()
      .toLowerCase();

  if (
    !text
  ) {

    return [];

  }

  return searchableObjects
    .filter(
      key =>
        key
          .toLowerCase()
          .includes(text)
    )
    .slice(
      0,
      8
    );

}


/* =========================================================
   SEARCH RESULTS
   ========================================================= */

function renderSearchResults(
  results
) {

  if (
    !searchResults
  ) {
    return;
  }

  searchResults.innerHTML =
    "";

  results.forEach(
    key => {

      const button =
        document.createElement(
          "button"
        );

      button.type =
        "button";

      button.className =
        "search-result";

      button.textContent =
        OBJECTS[key].name;

      button.addEventListener(
        "click",
        () => {

          const object =
            findObjectByKey(
              key
            );

          if (
            object
          ) {

            focusObject(
              object,
              key
            );

          }

          searchResults.innerHTML =
            "";

          if (
            searchInput
          ) {

            searchInput.value =
              OBJECTS[key].name;

          }

        }
      );

      searchResults.appendChild(
        button
      );

    }
  );

}


/* =========================================================
   FIND OBJECT
   ========================================================= */

function findObjectByKey(
  key
) {

  if (
    planetObjects[key]
  ) {

    return planetObjects[key];

  }

  if (
    key === "Sun"
  ) {

    return sun;

  }

  if (
    key === "Moon"
  ) {

    return moon;

  }

  if (
    key === "Milky Way"
  ) {

    return milkyWayVisual;

  }

  if (
    key === "Andromeda Galaxy"
  ) {

    return andromedaVisual;

  }

  if (
    key === "Sagittarius A*"
  ) {

    return blackHole;

  }

  return null;

}


/* =========================================================
   SEARCH INPUT EVENTS
   ========================================================= */

if (
  searchInput
) {

  searchInput.addEventListener(
    "input",
    () => {

      const results =
        searchObjects(
          searchInput.value
        );

      renderSearchResults(
        results
      );

    }
  );

  searchInput.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter"
      ) {

        const results =
          searchObjects(
            searchInput.value
          );

        if (
          results.length
        ) {

          const key =
            results[0];

          const object =
            findObjectByKey(
              key
            );

          if (
            object
          ) {

            focusObject(
              object,
              key
            );

          }

        }

      }

    }
  );

}
/* =========================================================
   NAVIGATION SYSTEM
   ========================================================= */

const navigationButtons =
  document.querySelectorAll(
    "[data-nav]"
  );

const navigationState = {
  current: "universe",
  history: []
};


/* =========================================================
   UPDATE BREADCRUMB
   ========================================================= */

function updateBreadcrumb(
  parts
) {

  if (
    !breadcrumb
  ) {
    return;
  }

  breadcrumb.innerHTML =
    "";

  parts.forEach(
    (part, index) => {

      const span =
        document.createElement(
          "span"
        );

      span.textContent =
        part;

      breadcrumb.appendChild(
        span
      );

      if (
        index <
        parts.length - 1
      ) {

        const separator =
          document.createElement(
            "span"
          );

        separator.textContent =
          " › ";

        separator.className =
          "breadcrumb-separator";

        breadcrumb.appendChild(
          separator
        );

      }

    }
  );

}


/* =========================================================
   SCALE SYSTEM
   ========================================================= */

const scaleLevels = [
  {
    id: "earth",
    label: "EARTH",
    distance: 2
  },

  {
    id: "solar",
    label: "SOLAR SYSTEM",
    distance: 80
  },

  {
    id: "stellar",
    label: "NEARBY STARS",
    distance: 180
  },

  {
    id: "galactic",
    label: "MILKY WAY",
    distance: 500
  },

  {
    id: "local",
    label: "LOCAL GROUP",
    distance: 900
  },

  {
    id: "cosmic",
    label: "LARGE-SCALE UNIVERSE",
    distance: 1400
  }
];

let currentScale =
  "solar";


function setScale(
  id
) {

  const level =
    scaleLevels.find(
      item =>
        item.id === id
    );

  if (
    !level
  ) {
    return;
  }

  currentScale =
    id;

  if (
    scaleLabel
  ) {

    scaleLabel.textContent =
      level.label;

  }

  if (
    id === "earth"
  ) {

    cameraDistance =
      5;

  }

  if (
    id === "solar"
  ) {

    cameraDistance =
      80;

  }

  if (
    id === "stellar"
  ) {

    cameraDistance =
      180;

  }

  if (
    id === "galactic"
  ) {

    cameraDistance =
      500;

  }

  if (
    id === "local"
  ) {

    cameraDistance =
      900;

  }

  if (
    id === "cosmic"
  ) {

    cameraDistance =
      1400;

  }

  updateScaleVisibility();

}


/* =========================================================
   SCALE VISIBILITY
   ========================================================= */

function updateScaleVisibility() {

  if (
    currentScale ===
    "earth"
  ) {

    solarSystemGroup.visible =
      true;

    galaxyGroup.visible =
      false;

    largeScaleGroup.visible =
      false;

  }

  else if (
    currentScale ===
    "solar"
  ) {

    solarSystemGroup.visible =
      true;

    galaxyGroup.visible =
      false;

    largeScaleGroup.visible =
      false;

  }

  else if (
    currentScale ===
    "stellar"
  ) {

    solarSystemGroup.visible =
      true;

    galaxyGroup.visible =
      true;

    largeScaleGroup.visible =
      false;

  }

  else if (
    currentScale ===
    "galactic"
  ) {

    solarSystemGroup.visible =
      false;

    galaxyGroup.visible =
      true;

    largeScaleGroup.visible =
      true;

  }

  else {

    solarSystemGroup.visible =
      false;

    galaxyGroup.visible =
      true;

    largeScaleGroup.visible =
      true;

  }

}


/* =========================================================
   NAVIGATION BUTTON EVENTS
   ========================================================= */

navigationButtons.forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        const target =
          button.dataset.nav;

        if (
          !target
        ) {
          return;
        }

        navigationState.history.push(
          navigationState.current
        );

        navigationState.current =
          target;

        handleNavigation(
          target
        );

      }
    );

  }
);


/* =========================================================
   NAVIGATION HANDLER
   ========================================================= */

function handleNavigation(
  target
) {

  if (
    target ===
    "solar"
  ) {

    setScale(
      "solar"
    );

    updateBreadcrumb([
      "Universe",
      "Milky Way",
      "Solar System"
    ]);

    cameraTarget.set(
      0,
      0,
      0
    );

    cameraDistance =
      80;

    showToast(
      "SOLAR SYSTEM MODE"
    );

  }

  else if (
    target ===
    "galaxy"
  ) {

    setScale(
      "galactic"
    );

    updateBreadcrumb([
      "Universe",
      "Local Group",
      "Milky Way"
    ]);

    cameraTarget.set(
      0,
      0,
      0
    );

    cameraDistance =
      160;

    showToast(
      "MILKY WAY VIEW"
    );

  }

  else if (
    target ===
    "blackhole"
  ) {

    setScale(
      "galactic"
    );

    const object =
      findObjectByKey(
        "Sagittarius A*"
      );

    if (
      object
    ) {

      focusObject(
        object,
        "Sagittarius A*"
      );

    }

    updateBreadcrumb([
      "Universe",
      "Milky Way",
      "Galactic Center",
      "Sagittarius A*"
    ]);

  }

  else if (
    target ===
    "universe"
  ) {

    setScale(
      "cosmic"
    );

    updateBreadcrumb([
      "Universe"
    ]);

    cameraTarget.set(
      0,
      0,
      0
    );

    cameraDistance =
      800;

    showToast(
      "OBSERVABLE UNIVERSE"
    );

  }

}


/* =========================================================
   SOLAR SYSTEM BUTTON
   ========================================================= */

const solarButton =
  document.getElementById(
    "solar-system-button"
  );

if (
  solarButton
) {

  solarButton.addEventListener(
    "click",
    () => {

      handleNavigation(
        "solar"
      );

    }
  );

}


/* =========================================================
   GALAXY BUTTON
   ========================================================= */

const galaxyButton =
  document.getElementById(
    "galaxy-button"
  );

if (
  galaxyButton
) {

  galaxyButton.addEventListener(
    "click",
    () => {

      handleNavigation(
        "galaxy"
      );

    }
  );

}


/* =========================================================
   BLACK HOLE BUTTON
   ========================================================= */

const blackHoleButton =
  document.getElementById(
    "black-hole-button"
  );

if (
  blackHoleButton
) {

  blackHoleButton.addEventListener(
    "click",
    () => {

      handleNavigation(
        "blackhole"
      );

    }
  );

}


/* =========================================================
   UNIVERSE BUTTON
   ========================================================= */

const universeButton =
  document.getElementById(
    "universe-button"
  );

if (
  universeButton
) {

  universeButton.addEventListener(
    "click",
    () => {

      handleNavigation(
        "universe"
      );

    }
  );

}


/* =========================================================
   START EXPLORING
   ========================================================= */

const startButton =
  document.getElementById(
    "start-exploring"
  );

if (
  startButton
) {

  startButton.addEventListener(
    "click",
    () => {

      hideElement(
        welcome
      );

      setScale(
        "solar"
      );

      updateBreadcrumb([
        "Universe",
        "Milky Way",
        "Solar System"
      ]);

      showToast(
        "WELCOME TO THE UNIVERSE"
      );

    }
  );

}


/* =========================================================
   EXPLORE SOLAR SYSTEM
   ========================================================= */

const exploreSolar =
  document.getElementById(
    "explore-solar"
  );

if (
  exploreSolar
) {

  exploreSolar.addEventListener(
    "click",
    () => {

      hideElement(
        welcome
      );

      handleNavigation(
        "solar"
      );

    }
  );

}


/* =========================================================
   EXPLORE GALAXIES
   ========================================================= */

const exploreGalaxies =
  document.getElementById(
    "explore-galaxies"
  );

if (
  exploreGalaxies
) {

  exploreGalaxies.addEventListener(
    "click",
    () => {

      hideElement(
        welcome
      );

      handleNavigation(
        "galaxy"
      );

    }
  );

}


/* =========================================================
   EXPLORE BLACK HOLES
   ========================================================= */

const exploreBlackHoles =
  document.getElementById(
    "explore-black-holes"
  );

if (
  exploreBlackHoles
) {

  exploreBlackHoles.addEventListener(
    "click",
    () => {

      hideElement(
        welcome
      );

      handleNavigation(
        "blackhole"
      );

    }
  );

}


/* =========================================================
   ESCAPE KEY
   ========================================================= */

window.addEventListener(
  "keydown",
  event => {

    if (
      event.key ===
      "Escape"
    ) {

      hideElement(
        infoPanel
      );

      hideElement(
        searchResults
      );

      selectedObject =
        null;

    }

  }
);


/* =========================================================
   EXPLORE MODE
   ========================================================= */

const exploreMode =
  document.getElementById(
    "explore-mode"
  );

const exploreModeButton =
  document.getElementById(
    "explore-button"
  );

const exploreTitle =
  document.getElementById(
    "explore-title"
  );

const exploreDescription =
  document.getElementById(
    "explore-description"
  );

const exploreNext =
  document.getElementById(
    "explore-next"
  );

const exploreClose =
  document.getElementById(
    "explore-close"
  );


const explorationSteps = [

  {
    title:
      "EARTH",

    description:
      "Your starting point. A small world inside an enormous cosmic structure.",

    scale:
      "earth"
  },

  {
    title:
      "SOLAR SYSTEM",

    description:
      "The Sun and the worlds that orbit it.",

    scale:
      "solar"
  },

  {
    title:
      "MILKY WAY",

    description:
      "Our Solar System is one tiny part of a galaxy containing hundreds of billions of stars.",

    scale:
      "galactic"
  },

  {
    title:
      "LOCAL GROUP",

    description:
      "The Milky Way belongs to a gravitationally bound group of galaxies.",

    scale:
      "local"
  },

  {
    title:
      "OBSERVABLE UNIVERSE",

    description:
      "The visible cosmic horizon contains an immense network of galaxies and large-scale structures.",

    scale:
      "cosmic"
  }

];

let explorationIndex =
  0;


/* =========================================================
   UPDATE EXPLORE STEP
   ========================================================= */

function updateExploreStep() {

  const step =
    explorationSteps[
      explorationIndex
    ];

  if (
    !step
  ) {
    return;
  }

  setText(
    exploreTitle,
    step.title
  );

  setText(
    exploreDescription,
    step.description
  );

  setScale(
    step.scale
  );

}


/* =========================================================
   OPEN EXPLORE MODE
   ========================================================= */

if (
  exploreModeButton
) {

  exploreModeButton.addEventListener(
    "click",
    () => {

      explorationIndex =
        0;

      showElement(
        exploreMode
      );

      updateExploreStep();

    }
  );

}


/* =========================================================
   NEXT EXPLORE STEP
   ========================================================= */

if (
  exploreNext
) {

  exploreNext.addEventListener(
    "click",
    () => {

      explorationIndex++;

      if (
        explorationIndex >=
        explorationSteps.length
      ) {

        explorationIndex =
          explorationSteps.length -
          1;

        showToast(
          "YOU REACHED THE OBSERVABLE UNIVERSE"
        );

      }

      updateExploreStep();

    }
  );

}


/* =========================================================
   CLOSE EXPLORE MODE
   ========================================================= */

if (
  exploreClose
) {

  exploreClose.addEventListener(
    "click",
    () => {

      hideElement(
        exploreMode
      );

    }
  );

}


/* =========================================================
   TIME TRAVEL
   ========================================================= */

const timeTravelButton =
  document.getElementById(
    "time-travel-button"
  );

const timeTravelPanel =
  document.getElementById(
    "time-travel"
  );

const timeSlider =
  document.getElementById(
    "time-slider"
  );

const timeValue =
  document.getElementById(
    "time-value"
  );

const timeDescription =
  document.getElementById(
    "time-description"
  );


const timeEvents = [

  {
    value: 0,
    label: "13.8 BILLION YEARS AGO",
    description:
      "Early Universe: hot, dense and rapidly expanding."
  },

  {
    value: 20,
    label: "13.5 BILLION YEARS AGO",
    description:
      "The first generations of stars and galaxies begin forming."
  },

  {
    value: 45,
    label: "10 BILLION YEARS AGO",
    description:
      "Galaxies evolve through mergers, star formation and gas accretion."
  },

  {
    value: 65,
    label: "4.6 BILLION YEARS AGO",
    description:
      "The Solar System forms from a collapsing cloud of gas and dust."
  },

  {
    value: 82,
    label: "TODAY",
    description:
      "Modern Universe observed by telescopes across the electromagnetic spectrum."
  },

  {
    value: 100,
    label: "FAR FUTURE",
    description:
      "Long-term cosmic evolution is described through theoretical models."
  }

];


/* =========================================================
   TIME EVENT LOOKUP
   ========================================================= */

function getTimeEvent(
  value
) {

  let closest =
    timeEvents[0];

  let difference =
    Math.abs(
      value -
      closest.value
    );

  for (
    const event of timeEvents
  ) {

    const currentDifference =
      Math.abs(
        value -
        event.value
      );

    if (
      currentDifference <
      difference
    ) {

      closest =
        event;

      difference =
        currentDifference;

    }

  }

  return closest;

}


/* =========================================================
   TIME TRAVEL UPDATE
   ========================================================= */

function updateTimeTravel() {

  if (
    !timeSlider
  ) {
    return;
  }

  const value =
    Number(
      timeSlider.value
    );

  const event =
    getTimeEvent(
      value
    );

  setText(
    timeValue,
    event.label
  );

  setText(
    timeDescription,
    event.description
  );

}


/* =========================================================
   OPEN TIME TRAVEL
   ========================================================= */

if (
  timeTravelButton
) {

  timeTravelButton.addEventListener(
    "click",
    () => {

      showElement(
        timeTravelPanel
      );

      updateTimeTravel();

    }
  );

}


/* =========================================================
   TIME SLIDER
   ========================================================= */

if (
  timeSlider
) {

  timeSlider.addEventListener(
    "input",
    updateTimeTravel
  );

}


/* =========================================================
   CLOSE TIME TRAVEL
   ========================================================= */

const timeTravelClose =
  document.getElementById(
    "time-travel-close"
  );

if (
  timeTravelClose
) {

  timeTravelClose.addEventListener(
    "click",
    () => {

      hideElement(
        timeTravelPanel
      );

    }
  );

}


/* =========================================================
   COMPARE SYSTEM
   ========================================================= */

const compareButton =
  document.getElementById(
    "compare-button"
  );

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

const compareResult =
  document.getElementById(
    "compare-result"
  );


function populateCompareSelect(
  select
) {

  if (
    !select
  ) {
    return;
  }

  select.innerHTML =
    "";

  Object.keys(
    OBJECTS
  ).forEach(
    key => {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        key;

      option.textContent =
        OBJECTS[key].name;

      select.appendChild(
        option
      );

    }
  );

}


populateCompareSelect(
  compareA
);

populateCompareSelect(
  compareB
);


/* =========================================================
   COMPARE OBJECTS
   ========================================================= */

function compareObjects() {

  if (
    !compareA ||
    !compareB ||
    !compareResult
  ) {
    return;
  }

  const a =
    OBJECTS[
      compareA.value
    ];

  const b =
    OBJECTS[
      compareB.value
    ];

  if (
    !a ||
    !b
  ) {
    return;
  }

  compareResult.innerHTML =
    `
      <div class="compare-card">
        <h3>${a.name}</h3>
        <p>${a.type}</p>
        <span>${a.size}</span>
        <span>${a.mass}</span>
      </div>

      <div class="compare-vs">
        VS
      </div>

      <div class="compare-card">
        <h3>${b.name}</h3>
        <p>${b.type}</p>
        <span>${b.size}</span>
        <span>${b.mass}</span>
      </div>
    `;

}


/* =========================================================
   OPEN COMPARE
   ========================================================= */

if (
  compareButton
) {

  compareButton.addEventListener(
    "click",
    () => {

      showElement(
        comparePanel
      );

      compareObjects();

    }
  );

}


if (
  compareA
) {

  compareA.addEventListener(
    "change",
    compareObjects
  );

}


if (
  compareB
) {

  compareB.addEventListener(
    "change",
    compareObjects
  );

}


/* =========================================================
   CLOSE COMPARE
   ========================================================= */

const compareClose =
  document.getElementById(
    "compare-close"
  );

if (
  compareClose
) {

  compareClose.addEventListener(
    "click",
    () => {

      hideElement(
        comparePanel
      );

    }
  );

}


/* =========================================================
   DEFAULT STATE
   ========================================================= */

updateBreadcrumb([
  "Universe"
]);

setScale(
  "solar"
);

updateScaleVisibility();
/* =========================================================
   OBJECT ROTATION / FOCUS CONTROLS
   ========================================================= */

const objectViewport =
  document.getElementById(
    "object-viewport"
  );

let objectRotationX =
  0;

let objectRotationY =
  0;

let objectZoom =
  1;


/* =========================================================
   OBJECT VIEW RESET
   ========================================================= */

const resetObjectView =
  document.getElementById(
    "reset-object-view"
  );

if (
  resetObjectView
) {

  resetObjectView.addEventListener(
    "click",
    () => {

      objectRotationX =
        0;

      objectRotationY =
        0;

      objectZoom =
        1;

      if (
        selectedObject
      ) {

        selectedObject.rotation.set(
          0,
          0,
          0
        );

      }

    }
  );

}


/* =========================================================
   CAMERA PRESETS
   ========================================================= */

const cameraPresets = {

  close: 8,

  medium: 20,

  far: 80,

  extreme: 400

};


function setCameraPreset(
  preset
) {

  if (
    cameraPresets[preset] ===
    undefined
  ) {
    return;
  }

  cameraDistance =
    cameraPresets[preset];

}


/* =========================================================
   PRESET BUTTONS
   ========================================================= */

const presetButtons =
  document.querySelectorAll(
    "[data-camera]"
  );

presetButtons.forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        setCameraPreset(
          button.dataset.camera
        );

      }
    );

  }
);


/* =========================================================
   FOCUS SELECTED OBJECT
   ========================================================= */

const focusSelectedButton =
  document.getElementById(
    "focus-selected"
  );

if (
  focusSelectedButton
) {

  focusSelectedButton.addEventListener(
    "click",
    () => {

      if (
        !selectedObject
      ) {

        showToast(
          "SELECT A CELESTIAL OBJECT FIRST"
        );

        return;

      }

      const key =
        selectedObject.userData
          .objectKey;

      focusObject(
        selectedObject,
        key
      );

    }
  );

}


/* =========================================================
   ZOOM BUTTONS
   ========================================================= */

const zoomInButton =
  document.getElementById(
    "zoom-in"
  );

const zoomOutButton =
  document.getElementById(
    "zoom-out"
  );


if (
  zoomInButton
) {

  zoomInButton.addEventListener(
    "click",
    () => {

      cameraDistance *=
        0.75;

      cameraDistance =
        Math.max(
          2,
          cameraDistance
        );

    }
  );

}


if (
  zoomOutButton
) {

  zoomOutButton.addEventListener(
    "click",
    () => {

      cameraDistance *=
        1.35;

      cameraDistance =
        Math.min(
          1500,
          cameraDistance
        );

    }
  );

}


/* =========================================================
   CAMERA HOME
   ========================================================= */

const cameraHome =
  document.getElementById(
    "camera-home"
  );

if (
  cameraHome
) {

  cameraHome.addEventListener(
    "click",
    () => {

      cameraTarget.set(
        0,
        0,
        0
      );

      cameraDistance =
        42;

      cameraAzimuth =
        0;

      cameraElevation =
        0.25;

      selectedObject =
        null;

      hideElement(
        infoPanel
      );

      showToast(
        "CAMERA RESET"
      );

    }
  );

}


/* =========================================================
   POINTER ROTATION
   ========================================================= */

let rotationDragging =
  false;

let rotationStartX =
  0;

let rotationStartY =
  0;


if (
  objectViewport
) {

  objectViewport.addEventListener(
    "pointerdown",
    event => {

      rotationDragging =
        true;

      rotationStartX =
        event.clientX;

      rotationStartY =
        event.clientY;

      objectViewport.setPointerCapture(
        event.pointerId
      );

    }
  );


  objectViewport.addEventListener(
    "pointermove",
    event => {

      if (
        !rotationDragging
      ) {
        return;
      }

      const dx =
        event.clientX -
        rotationStartX;

      const dy =
        event.clientY -
        rotationStartY;

      rotationStartX =
        event.clientX;

      rotationStartY =
        event.clientY;

      objectRotationY +=
        dx * 0.01;

      objectRotationX +=
        dy * 0.01;

      if (
        selectedObject
      ) {

        selectedObject.rotation.y =
          objectRotationY;

        selectedObject.rotation.x =
          objectRotationX;

      }

    }
  );


  objectViewport.addEventListener(
    "pointerup",
    () => {

      rotationDragging =
        false;

    }
  );


  objectViewport.addEventListener(
    "pointercancel",
    () => {

      rotationDragging =
        false;

    }
  );

}


/* =========================================================
   TOUCH OBJECT ZOOM
   ========================================================= */

let objectTouchDistance =
  null;

if (
  objectViewport
) {

  objectViewport.addEventListener(
    "touchmove",
    event => {

      if (
        event.touches.length !==
        2
      ) {
        return;
      }

      const first =
        event.touches[0];

      const second =
        event.touches[1];

      const dx =
        first.clientX -
        second.clientX;

      const dy =
        first.clientY -
        second.clientY;

      const distance =
        Math.sqrt(
          dx * dx +
          dy * dy
        );

      if (
        objectTouchDistance !==
        null
      ) {

        const delta =
          distance -
          objectTouchDistance;

        objectZoom +=
          delta * 0.005;

        objectZoom =
          Math.max(
            0.5,
            Math.min(
              3,
              objectZoom
            )
          );

      }

      objectTouchDistance =
        distance;

    },
    {
      passive: true
    }
  );


  objectViewport.addEventListener(
    "touchend",
    () => {

      objectTouchDistance =
        null;

    }
  );

}


/* =========================================================
   OBJECT SCALE
   ========================================================= */

function updateSelectedObjectScale() {

  if (
    !selectedObject
  ) {
    return;
  }

  const scale =
    objectZoom;

  selectedObject.scale.set(
    scale,
    scale,
    scale
  );

}


/* =========================================================
   SELECTED OBJECT HIGHLIGHT
   ========================================================= */

let highlightRing =
  null;


function createHighlight() {

  if (
    highlightRing
  ) {
    scene.remove(
      highlightRing
    );
  }

  const geometry =
    new THREE.RingGeometry(
      1.15,
      1.22,
      64
    );

  const material =
    new THREE.MeshBasicMaterial({
      color: 0x56d9ff,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide
    });

  highlightRing =
    new THREE.Mesh(
      geometry,
      material
    );

  scene.add(
    highlightRing
  );

}


function updateHighlight() {

  if (
    !selectedObject
  ) {

    if (
      highlightRing
    ) {

      highlightRing.visible =
        false;

    }

    return;

  }

  if (
    !highlightRing
  ) {

    createHighlight();

  }

  const position =
    new THREE.Vector3();

  selectedObject.getWorldPosition(
    position
  );

  highlightRing.position.copy(
    position
  );

  highlightRing.visible =
    true;

}


/* =========================================================
   OBJECT INFORMATION MODES
   ========================================================= */

const informationButtons =
  document.querySelectorAll(
    "[data-info-mode]"
  );

informationButtons.forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        if (
          !selectedObject
        ) {

          showToast(
            "SELECT AN OBJECT"
          );

          return;

        }

        const key =
          selectedObject.userData
            .objectKey;

        const mode =
          button.dataset.infoMode;

        if (
          mode ===
          "overview"
        ) {

          openObjectPanel(
            key
          );

        }

        if (
          mode ===
          "details"
        ) {

          renderExtraData(
            key
          );

        }

      }
    );

  }
);


/* =========================================================
   MISSION DATABASE
   ========================================================= */

const missionData = {

  Sun: [
    "Parker Solar Probe",
    "Solar Orbiter"
  ],

  Mercury: [
    "MESSENGER",
    "BepiColombo"
  ],

  Venus: [
    "Magellan",
    "Venus Express",
    "Akatsuki"
  ],

  Earth: [
    "ISS",
    "James Webb Space Telescope",
    "Earth observation missions"
  ],

  Moon: [
    "Apollo",
    "Artemis",
    "Lunar Reconnaissance Orbiter"
  ],

  Mars: [
    "Perseverance",
    "Curiosity",
    "Mars Reconnaissance Orbiter",
    "MAVEN"
  ],

  Jupiter: [
    "Juno",
    "Galileo",
    "Voyager"
  ],

  Saturn: [
    "Cassini-Huygens",
    "Voyager"
  ],

  Uranus: [
    "Voyager 2"
  ],

  Neptune: [
    "Voyager 2"
  ],

  Pluto: [
    "New Horizons"
  ],

  "Sagittarius A*": [
    "Event Horizon Telescope observations",
    "Chandra X-ray Observatory",
    "James Webb Space Telescope"
  ],

  "Milky Way": [
    "Gaia",
    "Hubble Space Telescope",
    "James Webb Space Telescope"
  ],

  "Andromeda Galaxy": [
    "Hubble Space Telescope",
    "James Webb Space Telescope"
  ]

};


/* =========================================================
   RENDER MISSIONS
   ========================================================= */

function renderMissions(
  key
) {

  const missions =
    missionData[key];

  if (
    !missions
  ) {
    return;
  }

  const missionContainer =
    document.getElementById(
      "mission-list"
    );

  if (
    !missionContainer
  ) {
    return;
  }

  missionContainer.innerHTML =
    "";

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

      missionContainer.appendChild(
        item
      );

    }
  );

}


/* =========================================================
   CURIOSITIES
   ========================================================= */

const curiosityData = {

  Sun: [
    "The Sun contains almost all the mass of the Solar System.",
    "Its energy comes from nuclear fusion in its core."
  ],

  Mercury: [
    "Mercury has enormous temperature differences between day and night.",
    "It has a surprisingly large metallic core."
  ],

  Venus: [
    "Venus rotates in the opposite direction to most planets.",
    "Its atmosphere produces an extreme greenhouse effect."
  ],

  Earth: [
    "Earth has active plate tectonics.",
    "Most of its surface is covered by oceans."
  ],

  Moon: [
    "The Moon is slowly moving away from Earth.",
    "Its surface preserves evidence of ancient impacts."
  ],

  Mars: [
    "Mars has polar ice caps.",
    "Evidence shows that liquid water existed on its surface in the past."
  ],

  Jupiter: [
    "Jupiter is the largest planet in the Solar System.",
    "Its magnetic field is extremely powerful."
  ],

  Saturn: [
    "Saturn has a very low average density.",
    "Its ring system is extraordinarily complex."
  ],

  Uranus: [
    "Uranus rotates almost on its side.",
    "Its atmosphere contains methane."
  ],

  Neptune: [
    "Neptune was predicted mathematically before it was observed.",
    "Its winds can reach enormous speeds."
  ],

  Pluto: [
    "Pluto has mountains made largely of water ice.",
    "Its orbit is significantly tilted and eccentric."
  ],

  "Sagittarius A*": [
    "It lies at the center of the Milky Way.",
    "Its gravitational influence affects nearby stars."
  ],

  "Milky Way": [
    "The Solar System is located in the Orion Arm region.",
    "The galaxy has a central supermassive black hole."
  ],

  "Andromeda Galaxy": [
    "Andromeda is approaching the Milky Way.",
    "It is visible as a faint object from very dark skies."
  ]

};


/* =========================================================
   RENDER CURIOSITIES
   ========================================================= */

function renderCuriosities(
  key
) {

  const list =
    curiosityData[key];

  if (
    !list
  ) {
    return;
  }

  const container =
    document.getElementById(
      "curiosity-list"
    );

  if (
    !container
  ) {
    return;
  }

  container.innerHTML =
    "";

  list.forEach(
    text => {

      const item =
        document.createElement(
          "div"
        );

      item.className =
        "curiosity-item";

      item.textContent =
        text;

      container.appendChild(
        item
      );

    }
  );

}


/* =========================================================
   FULL OBJECT PANEL REFRESH
   ========================================================= */

function refreshObjectPanel(
  key
) {

  openObjectPanel(
    key
  );

  renderExtraData(
    key
  );

  renderMissions(
    key
  );

  renderCuriosities(
    key
  );

}


/* =========================================================
   OVERRIDE FOCUS PANEL
   ========================================================= */

const originalFocusObject =
  focusObject;


/* =========================================================
   OBJECT LABELS
   ========================================================= */

const objectLabels =
  new THREE.Group();

scene.add(
  objectLabels
);


function createObjectLabel(
  text,
  color = 0x8fe8ff
) {

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width =
    512;

  canvas.height =
    128;

  const context =
    canvas.getContext(
      "2d"
    );

  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  context.font =
    "bold 34px Arial";

  context.textAlign =
    "center";

  context.textBaseline =
    "middle";

  context.fillStyle =
    "#ffffff";

  context.fillText(
    text,
    canvas.width / 2,
    canvas.height / 2
  );

  const texture =
    new THREE.CanvasTexture(
      canvas
    );

  texture.colorSpace =
    THREE.SRGBColorSpace;

  const material =
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false
    });

  const sprite =
    new THREE.Sprite(
      material
    );

  sprite.scale.set(
    8,
    2,
    1
  );

  return sprite;

}


/* =========================================================
   PLANET LABELS
   ========================================================= */

const labelObjects = {};


for (
  const key of [
    "Earth",
    "Mars",
    "Jupiter",
    "Saturn",
    "Neptune"
  ]
) {

  const object =
    findObjectByKey(
      key
    );

  if (
    !object
  ) {
    continue;
  }

  const label =
    createObjectLabel(
      key
    );

  label.visible =
    false;

  object.add(
    label
  );

  label.position.set(
    0,
    OBJECTS[key].radius + 1.5,
    0
  );

  labelObjects[key] =
    label;

}


/* =========================================================
   LABEL VISIBILITY
   ========================================================= */

function updateLabels() {

  Object.keys(
    labelObjects
  ).forEach(
    key => {

      labelObjects[key].visible =
        selectedObject ===
        planetObjects[key];

    }
  );

}


/* =========================================================
   INFORMATION SOURCE DATA
   ========================================================= */

const sourceData = {

  Sun: [
    "NASA Solar System Exploration",
    "ESA Solar System"
  ],

  Earth: [
    "NASA Earth",
    "ESA Earth Observation"
  ],

  Moon: [
    "NASA Moon",
    "NASA Artemis"
  ],

  Mars: [
    "NASA Mars Exploration",
    "ESA Mars Express"
  ],

  Jupiter: [
    "NASA Juno",
    "NASA Solar System Exploration"
  ],

  Saturn: [
    "NASA Cassini",
    "NASA Solar System Exploration"
  ],

  Uranus: [
    "NASA Voyager 2",
    "NASA Solar System Exploration"
  ],

  Neptune: [
    "NASA Voyager 2",
    "NASA Solar System Exploration"
  ],

  Pluto: [
    "NASA New Horizons",
    "NASA Solar System Exploration"
  ],

  "Milky Way": [
    "NASA",
    "ESA Gaia"
  ],

  "Andromeda Galaxy": [
    "NASA Hubble",
    "NASA Webb"
  ],

  "Sagittarius A*": [
    "NASA Chandra",
    "Event Horizon Telescope"
  ]

};


/* =========================================================
   RENDER SOURCES
   ========================================================= */

function renderSources(
  key
) {

  const sources =
    sourceData[key];

  const container =
    document.getElementById(
      "source-list"
    );

  if (
    !container
  ) {
    return;
  }

  container.innerHTML =
    "";

  if (
    !sources
  ) {

    const empty =
      document.createElement(
        "div"
      );

    empty.textContent =
      "Sources unavailable.";

    container.appendChild(
      empty
    );

    return;

  }

  sources.forEach(
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
   FINAL PANEL UPDATE
   ========================================================= */

function updateObjectInterface(
  key
) {

  refreshObjectPanel(
    key
  );

  renderSources(
    key
  );

  updateLabels();

}


/* =========================================================
   SCALE INDICATOR
   ========================================================= */

const scaleIndicator =
  document.getElementById(
    "scale-indicator"
  );


function updateScaleIndicator() {

  if (
    !scaleIndicator
  ) {
    return;
  }

  const level =
    scaleLevels.find(
      item =>
        item.id ===
        currentScale
    );

  if (
    level
  ) {

    scaleIndicator.textContent =
      `SCALE: ${level.label}`;

  }

}


/* =========================================================
   CAMERA DISTANCE DISPLAY
   ========================================================= */

const cameraDistanceLabel =
  document.getElementById(
    "camera-distance"
  );


function updateCameraDistanceLabel() {

  if (
    !cameraDistanceLabel
  ) {
    return;
  }

  let text;

  if (
    cameraDistance < 10
  ) {

    text =
      "LOCAL";

  }

  else if (
    cameraDistance < 100
  ) {

    text =
      "SOLAR";

  }

  else if (
    cameraDistance < 500
  ) {

    text =
      "STELLAR";

  }

  else if (
    cameraDistance < 1000
  ) {

    text =
      "GALACTIC";

  }

  else {

    text =
      "COSMIC";

  }

  cameraDistanceLabel.textContent =
    `RANGE: ${text}`;

}


/* =========================================================
   UI STATE UPDATE
   ========================================================= */

function updateInterface() {

  updateHighlight();

  updateLabels();

  updateScaleIndicator();

  updateCameraDistanceLabel();

}


/* =========================================================
   SELECTED OBJECT PANEL CLICK
   ========================================================= */

document.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "[data-object]"
      );

    if (
      !button
    ) {
      return;
    }

    const key =
      button.dataset.object;

    const object =
      findObjectByKey(
        key
      );

    if (
      object
    ) {

      focusObject(
        object,
        key
      );

      updateObjectInterface(
        key
      );

    }

  }
);
/* =========================================================
   KEYBOARD NAVIGATION
   ========================================================= */

window.addEventListener(
  "keydown",
  event => {

    const active =
      document.activeElement;

    const editing =
      active &&
      (
        active.tagName === "INPUT" ||
        active.tagName === "TEXTAREA" ||
        active.tagName === "SELECT"
      );

    if (
      editing
    ) {
      return;
    }

    if (
      event.key === "ArrowLeft"
    ) {

      cameraAzimuth -=
        0.08;

    }

    if (
      event.key === "ArrowRight"
    ) {

      cameraAzimuth +=
        0.08;

    }

    if (
      event.key === "ArrowUp"
    ) {

      cameraElevation +=
        0.05;

    }

    if (
      event.key === "ArrowDown"
    ) {

      cameraElevation -=
        0.05;

    }

    cameraElevation =
      Math.max(
        -1.35,
        Math.min(
          1.35,
          cameraElevation
        )
      );

  }
);


/* =========================================================
   QUICK OBJECT KEYS
   ========================================================= */

const quickKeys = {
  "1": "Sun",
  "2": "Earth",
  "3": "Moon",
  "4": "Mars",
  "5": "Jupiter",
  "6": "Saturn",
  "7": "Uranus",
  "8": "Neptune",
  "9": "Pluto"
};


window.addEventListener(
  "keydown",
  event => {

    const active =
      document.activeElement;

    if (
      active &&
      (
        active.tagName === "INPUT" ||
        active.tagName === "TEXTAREA"
      )
    ) {
      return;
    }

    const key =
      quickKeys[event.key];

    if (
      !key
    ) {
      return;
    }

    const object =
      findObjectByKey(
        key
      );

    if (
      object
    ) {

      focusObject(
        object,
        key
      );

      updateObjectInterface(
        key
      );

    }

  }
);


/* =========================================================
   DOUBLE CLICK FOCUS
   ========================================================= */

renderer.domElement.addEventListener(
  "dblclick",
  event => {

    updatePointer(
      event
    );

    raycaster.setFromCamera(
      pointer,
      camera
    );

    const hits =
      raycaster.intersectObjects(
        selectableObjects,
        true
      );

    if (
      !hits.length
    ) {
      return;
    }

    let object =
      hits[0].object;

    let key =
      object.userData.objectKey ||
      object.name;

    while (
      object.parent &&
      !object.userData.objectKey &&
      !object.name
    ) {

      object =
        object.parent;

    }

    key =
      object.userData.objectKey ||
      object.name ||
      key;

    if (
      OBJECTS[key]
    ) {

      focusObject(
        object,
        key
      );

      updateObjectInterface(
        key
      );

    }

  }
);


/* =========================================================
   CAMERA SMOOTHING
   ========================================================= */

function smoothCameraTarget() {

  if (
    !selectedObject
  ) {
    return;
  }

  const target =
    new THREE.Vector3();

  selectedObject.getWorldPosition(
    target
  );

  cameraTarget.lerp(
    target,
    0.035
  );

}


/* =========================================================
   SCALE-BASED CAMERA
   ========================================================= */

function applyScaleCamera() {

  if (
    currentScale ===
    "earth"
  ) {

    cameraDistance =
      Math.min(
        cameraDistance,
        15
      );

  }

  if (
    currentScale ===
    "solar"
  ) {

    cameraDistance =
      Math.max(
        cameraDistance,
        20
      );

  }

  if (
    currentScale ===
    "galactic"
  ) {

    cameraDistance =
      Math.max(
        cameraDistance,
        100
      );

  }

}


/* =========================================================
   ANIMATION VARIABLES
   ========================================================= */

let animationSpeed =
  1;

let paused =
  false;

let showStars =
  true;

let showOrbits =
  true;


/* =========================================================
   PAUSE / PLAY
   ========================================================= */

const pauseButton =
  document.getElementById(
    "pause-button"
  );

if (
  pauseButton
) {

  pauseButton.addEventListener(
    "click",
    () => {

      paused =
        !paused;

      pauseButton.textContent =
        paused
          ? "PLAY"
          : "PAUSE";

      showToast(
        paused
          ? "SIMULATION PAUSED"
          : "SIMULATION RESUMED"
      );

    }
  );

}


/* =========================================================
   SPEED CONTROL
   ========================================================= */

const speedSlider =
  document.getElementById(
    "speed-slider"
  );

const speedValue =
  document.getElementById(
    "speed-value"
  );


if (
  speedSlider
) {

  speedSlider.addEventListener(
    "input",
    () => {

      let value =
        Number(
          speedSlider.value
        );

      if (
        !Number.isFinite(
          value
        )
      ) {

        value =
          1;

      }

      animationSpeed =
        Math.max(
          0.05,
          Math.min(
            10,
            value
          )
        );

      if (
        speedValue
      ) {

        speedValue.textContent =
          `${animationSpeed.toFixed(2)}×`;

      }

    }
  );

}


/* =========================================================
   TOGGLE STARS
   ========================================================= */

const starsToggle =
  document.getElementById(
    "stars-toggle"
  );

if (
  starsToggle
) {

  starsToggle.addEventListener(
    "click",
    () => {

      showStars =
        !showStars;

      stars.visible =
        showStars;

      starsToggle.classList.toggle(
        "active",
        showStars
      );

    }
  );

}


/* =========================================================
   TOGGLE ORBITS
   ========================================================= */

const orbitToggle =
  document.getElementById(
    "orbits-toggle"
  );


if (
  orbitToggle
) {

  orbitToggle.addEventListener(
    "click",
    () => {

      showOrbits =
        !showOrbits;

      solarSystemGroup
        .children
        .forEach(
          child => {

            if (
              child.geometry &&
              child.geometry.type ===
              "RingGeometry"
            ) {

              child.visible =
                showOrbits;

            }

          }
        );

      orbitToggle.classList.toggle(
        "active",
        showOrbits
      );

    }
  );

}


/* =========================================================
   PERFORMANCE MODE
   ========================================================= */

let performanceMode =
  "high";

const performanceButton =
  document.getElementById(
    "performance-button"
  );


if (
  performanceButton
) {

  performanceButton.addEventListener(
    "click",
    () => {

      performanceMode =
        performanceMode === "high"
          ? "balanced"
          : performanceMode === "balanced"
            ? "low"
            : "high";

      applyPerformanceMode();

      showToast(
        `PERFORMANCE: ${performanceMode.toUpperCase()}`
      );

    }
  );

}


function applyPerformanceMode() {

  if (
    performanceMode ===
    "high"
  ) {

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        2
      )
    );

    stars.material.size =
      0.65;

    stars.material.opacity =
      0.8;

  }

  else if (
    performanceMode ===
    "balanced"
  ) {

    renderer.setPixelRatio(
      1.25
    );

    stars.material.size =
      0.55;

    stars.material.opacity =
      0.7;

  }

  else {

    renderer.setPixelRatio(
      1
    );

    stars.material.size =
      0.45;

    stars.material.opacity =
      0.55;

  }

}


/* =========================================================
   LOW DETAIL GALAXIES
   ========================================================= */

function updateGalaxyDetail() {

  const distance =
    camera.position.length();

  if (
    distance < 250
  ) {

    distantGalaxies.visible =
      false;

  }

  else {

    distantGalaxies.visible =
      true;

  }

}


 /* =========================================================
    OBJECT VISIBILITY BY SCALE
    ========================================================= */

function updateObjectVisibility() {

  if (
    currentScale === "earth"
  ) {

    planetObjects.Earth.visible =
      true;

    moon.visible =
      true;

  }

  else if (
    currentScale === "solar"
  ) {

    Object.keys(
      planetObjects
    ).forEach(
      key => {

        planetObjects[key].visible =
          true;

      }
    );

    moon.visible =
      true;

  }

  else if (
    currentScale === "stellar"
  ) {

    Object.keys(
      planetObjects
    ).forEach(
      key => {

        planetObjects[key].visible =
          false;

      }
    );

    moon.visible =
      false;

  }

}


/* =========================================================
   NEARBY STARS
   ========================================================= */

const nearbyStars =
  new THREE.Group();

galaxyGroup.add(
  nearbyStars
);


const nearbyStarData = [

  {
    name: "Proxima Centauri",
    distance: "4.24 light-years",
    color: 0xff6644,
    position: [
      35,
      5,
      -30
    ]
  },

  {
    name: "Alpha Centauri",
    distance: "4.37 light-years",
    color: 0xffcc88,
    position: [
      -42,
      8,
      -18
    ]
  },

  {
    name: "Sirius",
    distance: "8.6 light-years",
    color: 0xddeeff,
    position: [
      28,
      -10,
      40
    ]
  },

  {
    name: "Vega",
    distance: "25 light-years",
    color: 0xbcdcff,
    position: [
      -60,
      25,
      20
    ]
  },

  {
    name: "Betelgeuse",
    distance: "≈ 640 light-years",
    color: 0xff6633,
    position: [
      75,
      18,
      -55
    ]
  }

];


nearbyStarData.forEach(
  data => {

    const geometry =
      new THREE.SphereGeometry(
        0.45,
        24,
        24
      );

    const material =
      createStarMaterial(
        data.color,
        2
      );

    const star =
      new THREE.Mesh(
        geometry,
        material
      );

    star.position.set(
      data.position[0],
      data.position[1],
      data.position[2]
    );

    star.name =
      data.name;

    star.userData.objectKey =
      data.name;

    star.userData.distance =
      data.distance;

    nearbyStars.add(
      star
    );

    selectableObjects.push(
      star
    );

  }
);


/* =========================================================
   ADD NEARBY STARS TO DATABASE
   ========================================================= */

nearbyStarData.forEach(
  data => {

    if (
      OBJECTS[data.name]
    ) {
      return;
    }

    OBJECTS[data.name] = {

      name:
        data.name,

      type:
        "STAR",

      distance:
        data.distance,

      size:
        "Varies",

      mass:
        "Varies",

      temperature:
        "Varies",

      color:
        data.color,

      radius:
        0.45

    };

  }
);


/* =========================================================
   NEARBY STAR INFO
   ========================================================= */

nearbyStarData.forEach(
  data => {

    extraData[data.name] = {

      composition:
        "A stellar object composed primarily of hydrogen and helium.",

      formation:
        "Formed through the collapse of a molecular cloud.",

      discovery:
        "Observed and catalogued through astronomical surveys.",

      orbit:
        "Moves through the Milky Way.",

      curiosity:
        `Located approximately ${data.distance} from the Solar System.`,

      missions:
        "Observed by astronomical observatories and space telescopes."

    };

    sourceData[data.name] = [
      "SIMBAD Astronomical Database",
      "ESA Gaia"
    ];

  }
);


/* =========================================================
   STAR LABELS
   ========================================================= */

nearbyStarData.forEach(
  data => {

    const star =
      nearbyStars.children.find(
        item =>
          item.name ===
          data.name
      );

    if (
      !star
    ) {
      return;
    }

    const label =
      createObjectLabel(
        data.name
      );

    label.scale.set(
      4,
      1,
      1
    );

    label.position.y =
      1.2;

    label.visible =
      false;

    star.add(
      label
    );

    star.userData.label =
      label;

  }
);


/* =========================================================
   NEARBY STAR LABEL UPDATE
   ========================================================= */

function updateNearbyStarLabels() {

  nearbyStars.children.forEach(
    star => {

      if (
        !star.userData.label
      ) {
        return;
      }

      star.userData.label.visible =
        selectedObject ===
        star;

    }
  );

}


/* =========================================================
   EXPANDED SEARCH OBJECTS
   ========================================================= */

const specialObjects = {

  "Proxima Centauri":
    "STAR",

  "Alpha Centauri":
    "STAR",

  "Sirius":
    "STAR",

  "Vega":
    "STAR",

  "Betelgeuse":
    "RED SUPERGIANT STAR"

};


Object.keys(
  specialObjects
).forEach(
  key => {

    if (
      !OBJECTS[key]
    ) {
      return;
    }

    OBJECTS[key].type =
      specialObjects[key];

  }
);


/* =========================================================
   SEARCH INDEX REFRESH
   ========================================================= */

function rebuildSearchIndex() {

  searchableObjects.length =
    0;

  Object.keys(
    OBJECTS
  ).forEach(
    key => {

      searchableObjects.push(
        key
      );

    }
  );

}


rebuildSearchIndex();


/* =========================================================
   SCALE VISIBILITY EXTENSION
   ========================================================= */

function updateExtendedVisibility() {

  if (
    currentScale ===
    "stellar"
  ) {

    nearbyStars.visible =
      true;

  }

  else if (
    currentScale ===
    "galactic"
  ) {

    nearbyStars.visible =
      false;

  }

  else if (
    currentScale ===
    "local"
  ) {

    nearbyStars.visible =
      false;

  }

  else if (
    currentScale ===
    "cosmic"
  ) {

    nearbyStars.visible =
      false;

  }

}


/* =========================================================
   COMBINED VISIBILITY UPDATE
   ========================================================= */

function updateVisibility() {

  updateScaleVisibility();

  updateObjectVisibility();

  updateExtendedVisibility();

  updateGalaxyDetail();

}


/* =========================================================
   CAMERA BOUNDS
   ========================================================= */

function clampCamera() {

  cameraDistance =
    Math.max(
      2,
      Math.min(
        1500,
        cameraDistance
      )
    );

  cameraElevation =
    Math.max(
      -1.35,
      Math.min(
        1.35,
        cameraElevation
      )
    );

}


/* =========================================================
   CAMERA UPDATE LOOP
   ========================================================= */

function updateCameraSystem() {

  clampCamera();

  smoothCameraTarget();

  updateCamera();

  applyScaleCamera();

}


/* =========================================================
   SELECTED OBJECT SCALE UPDATE
   ========================================================= */

function updateObjectSystem() {

  updateSelectedObjectScale();

  updateHighlight();

  updateNearbyStarLabels();

}


/* =========================================================
   SIMULATION STATUS
   ========================================================= */

const statusText =
  document.getElementById(
    "simulation-status"
  );


function updateSimulationStatus() {

  if (
    !statusText
  ) {
    return;
  }

  statusText.textContent =
    paused
      ? "PAUSED"
      : "LIVE";

}


/* =========================================================
   FPS COUNTER
   ========================================================= */

const fpsElement =
  document.getElementById(
    "fps-counter"
  );

let fpsFrames =
  0;

let fpsLastTime =
  performance.now();

let currentFPS =
  60;


function updateFPS() {

  fpsFrames++;

  const now =
    performance.now();

  if (
    now -
    fpsLastTime >=
    1000
  ) {

    currentFPS =
      fpsFrames;

    fpsFrames =
      0;

    fpsLastTime =
      now;

    if (
      fpsElement
    ) {

      fpsElement.textContent =
        `${currentFPS} FPS`;

    }

  }

}


/* =========================================================
   LOADING STATE
   ========================================================= */

let universeReady =
  false;

function finishLoading() {

  universeReady =
    true;

  if (
    loading
  ) {

    loading.classList.add(
      "hidden"
    );

  }

  setText(
    loadingText,
    "UNIVERSE READY"
  );

  showToast(
    "UNIVERSE ONLINE"
  );

}
/* =========================================================
   BLOCK 7/12 — ANIMATION + SIMULATION
   ========================================================= */

let animationFrameId =
  null;

let lastFrameTime =
  performance.now();

let frameCounter =
  0;

let fpsTimer =
  performance.now();

let currentFPS =
  60;

let simulationTime =
  0;

let simulationPaused =
  false;

let simulationSpeed =
  1;

const DEFAULT_SIMULATION_SPEED =
  1;

const MIN_SIMULATION_SPEED =
  0.05;

const MAX_SIMULATION_SPEED =
  20;


/* =========================================================
   SIMULATION CONTROLS
   ========================================================= */

function setSimulationSpeed(
  value
) {

  let speed =
    Number(value);

  if (
    !Number.isFinite(speed)
  ) {
    speed =
      DEFAULT_SIMULATION_SPEED;
  }

  speed =
    Math.max(
      MIN_SIMULATION_SPEED,
      Math.min(
        MAX_SIMULATION_SPEED,
        speed
      )
    );

  simulationSpeed =
    speed;

  setText(
    speedValue,
    speed.toFixed(2) + "x"
  );

}


function toggleSimulation() {

  simulationPaused =
    !simulationPaused;

  if (pauseButton) {

    pauseButton.textContent =
      simulationPaused
        ? "▶ PLAY"
        : "Ⅱ PAUSE";

  }

  showToast(
    simulationPaused
      ? "SIMULATION PAUSED"
      : "SIMULATION RUNNING"
  );

}


function resetSimulation() {

  simulationTime =
    0;

  simulationPaused =
    false;

  simulationSpeed =
    DEFAULT_SIMULATION_SPEED;

  if (pauseButton) {

    pauseButton.textContent =
      "Ⅱ PAUSE";

  }

  setText(
    speedValue,
    "1.00x"
  );

}


/* =========================================================
   ORBIT SIMULATION
   ========================================================= */

function updatePlanetOrbits(
  delta
) {

  if (
    simulationPaused
  ) {
    return;
  }

  const scaledDelta =
    delta *
    simulationSpeed;

  planetData.forEach(
    data => {

      const pivot =
        planetPivots[
          data.key
        ];

      if (!pivot) {
        return;
      }

      pivot.rotation.y +=
        data.speed *
        scaledDelta *
        60;

    }
  );

}


function updateMoonOrbit(
  delta
) {

  if (
    simulationPaused
  ) {
    return;
  }

  moonPivot.rotation.y +=
    delta *
    simulationSpeed *
    0.45;

}


function updatePlanetRotation(
  delta
) {

  if (
    simulationPaused
  ) {
    return;
  }

  Object.keys(
    planetObjects
  ).forEach(
    key => {

      const planet =
        planetObjects[key];

      if (!planet) {
        return;
      }

      planet.rotation.y +=
        delta *
        simulationSpeed *
        0.18;

    }
  );

  if (sun) {

    sun.rotation.y +=
      delta *
      simulationSpeed *
      0.025;

  }

  if (moon) {

    moon.rotation.y +=
      delta *
      simulationSpeed *
      0.22;

  }

}


/* =========================================================
   ASTEROIDS
   ========================================================= */

function updateAsteroidBelt(
  delta
) {

  if (
    simulationPaused ||
    !asteroidBelt
  ) {
    return;
  }

  asteroidBelt.rotation.y +=
    delta *
    simulationSpeed *
    0.035;

}


function updateGalaxyMotion(
  delta
) {

  if (
    simulationPaused
  ) {
    return;
  }

  if (
    milkyWayVisual
  ) {

    milkyWayVisual.rotation.z +=
      delta *
      simulationSpeed *
      0.003;

  }

  if (
    andromedaVisual
  ) {

    andromedaVisual.rotation.z -=
      delta *
      simulationSpeed *
      0.002;

  }

}


function updateBlackHole(
  delta
) {

  if (
    simulationPaused
  ) {
    return;
  }

  if (
    disk
  ) {

    disk.rotation.z +=
      delta *
      simulationSpeed *
      0.9;

  }

  if (
    diskGlow
  ) {

    diskGlow.rotation.z -=
      delta *
      simulationSpeed *
      0.35;

  }

}


/* =========================================================
   STAR FIELD
   ========================================================= */

function updateStarField(
  delta
) {

  if (
    simulationPaused ||
    !stars
  ) {
    return;
  }

  stars.rotation.y +=
    delta *
    simulationSpeed *
    0.002;

  stars.rotation.x +=
    delta *
    simulationSpeed *
    0.0004;

}


/* =========================================================
   OBJECT HIGHLIGHT
   ========================================================= */

function updateHighlight(
  delta
) {

  if (
    !highlightRing
  ) {
    return;
  }

  if (
    !highlightRing.visible
  ) {
    return;
  }

  highlightRing.rotation.z +=
    delta *
    simulationSpeed *
    0.6;

  const pulse =
    1 +
    Math.sin(
      performance.now() *
      0.004
    ) *
    0.04;

  highlightRing.scale.set(
    pulse,
    pulse,
    pulse
  );

}


/* =========================================================
   CAMERA SMOOTHING
   ========================================================= */

function updateCamera(
  delta
) {

  if (
    !cameraTarget
  ) {
    return;
  }

  const factor =
    1 -
    Math.pow(
      0.001,
      delta
    );

  camera.position.lerp(
    cameraTarget,
    factor
  );

  if (
    controls &&
    controls.target
  ) {

    controls.target.lerp(
      targetLookAt,
      factor
    );

  }

}


/* =========================================================
   CAMERA DISTANCE
   ========================================================= */

function updateCameraDistance() {

  if (
    !camera ||
    !controls
  ) {
    return;
  }

  const distance =
    camera.position.distanceTo(
      controls.target
    );

  if (
    !Number.isFinite(distance)
  ) {
    return;
  }

  currentCameraDistance =
    distance;

}


/* =========================================================
   SCALE INDICATOR
   ========================================================= */

function updateScaleIndicator() {

  if (
    !scaleIndicator
  ) {
    return;
  }

  const distance =
    currentCameraDistance;

  let label =
    "LOCAL SPACE";

  if (
    distance > 500000
  ) {

    label =
      "GALACTIC SCALE";

  } else if (
    distance > 5000
  ) {

    label =
      "STELLAR SCALE";

  } else if (
    distance > 200
  ) {

    label =
      "SOLAR SYSTEM";

  } else if (
    distance > 20
  ) {

    label =
      "PLANETARY SCALE";

  } else {

    label =
      "OBJECT VIEW";

  }

  scaleIndicator.textContent =
    label;

}


/* =========================================================
   FPS
   ========================================================= */

function updateFPS(
  now
) {

  frameCounter++;

  if (
    now -
    fpsTimer >=
    1000
  ) {

    currentFPS =
      frameCounter;

    frameCounter =
      0;

    fpsTimer =
      now;

    if (fpsCounter) {

      fpsCounter.textContent =
        currentFPS +
        " FPS";

    }

  }

}


/* =========================================================
   SIMULATION STATUS
   ========================================================= */

function updateSimulationStatus() {

  if (
    simulationStatus
  ) {

    simulationStatus.textContent =
      simulationPaused
        ? "PAUSED"
        : "LIVE";

  }

  if (
    universeStatus
  ) {

    universeStatus.textContent =
      universeReady
        ? "ONLINE"
        : "INITIALIZING";

  }

}


/* =========================================================
   TIME TRAVEL
   ========================================================= */

function updateCosmicTime(
  delta
) {

  if (
    simulationPaused
  ) {
    return;
  }

  if (
    typeof timeTravelActive ===
    "undefined" ||
    !timeTravelActive
  ) {
    return;
  }

  cosmicTimelinePosition +=
    delta *
    simulationSpeed *
    0.02;

  if (
    cosmicTimelinePosition >
    1
  ) {

    cosmicTimelinePosition =
      1;

  }

  updateTimeTravelUI();

}


function updateTimeTravelUI() {

  if (
    !timelineProgress
  ) {
    return;
  }

  timelineProgress.value =
    cosmicTimelinePosition;

}


/* =========================================================
   MAIN UPDATE
   ========================================================= */

function updateUniverse(
  delta,
  now
) {

  if (
    !Number.isFinite(delta)
  ) {

    delta =
      0.016;

  }

  delta =
    Math.min(
      delta,
      0.1
    );

  simulationTime +=
    delta *
    simulationSpeed;

  updatePlanetOrbits(
    delta
  );

  updateMoonOrbit(
    delta
  );

  updatePlanetRotation(
    delta
  );

  updateAsteroidBelt(
    delta
  );

  updateGalaxyMotion(
    delta
  );

  updateBlackHole(
    delta
  );

  updateStarField(
    delta
  );

  updateHighlight(
    delta
  );

  updateCamera(
    delta
  );

  updateCameraDistance();

  updateScaleIndicator();

  updateCosmicTime(
    delta
  );

  updateFPS(
    now
  );

  updateSimulationStatus();

}


/* =========================================================
   RENDER LOOP
   ========================================================= */

function animateUniverse(
  now
) {

  animationFrameId =
    requestAnimationFrame(
      animateUniverse
    );

  let delta =
    (now -
      lastFrameTime) /
    1000;

  if (
    !Number.isFinite(delta) ||
    delta < 0
  ) {

    delta =
      0.016;

  }

  lastFrameTime =
    now;

  updateUniverse(
    delta,
    now
  );

  if (
    renderer &&
    scene &&
    camera
  ) {

    renderer.render(
      scene,
      camera
    );

  }

}


/* =========================================================
   START ANIMATION
   ========================================================= */

function startUniverseAnimation() {

  if (
    animationFrameId
  ) {
    return;
  }

  lastFrameTime =
    performance.now();

  animationFrameId =
    requestAnimationFrame(
      animateUniverse
    );

}


/* =========================================================
   STOP ANIMATION
   ========================================================= */

function stopUniverseAnimation() {

  if (
    animationFrameId
  ) {

    cancelAnimationFrame(
      animationFrameId
    );

    animationFrameId =
      null;

  }

}


/* =========================================================
   VISIBILITY RECOVERY
   ========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {

    if (
      document.hidden
    ) {

      lastFrameTime =
        performance.now();

    } else {

      lastFrameTime =
        performance.now();

      if (
        !animationFrameId
      ) {

        startUniverseAnimation();

      }

    }

  }
);


/* =========================================================
   REDUCED MOTION
   ========================================================= */

const reducedMotion =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );


function applyReducedMotion() {

  if (
    reducedMotion.matches
  ) {

    simulationSpeed =
      Math.min(
        simulationSpeed,
        0.35
      );

  }

}


if (
  reducedMotion.addEventListener
) {

  reducedMotion.addEventListener(
    "change",
    applyReducedMotion
  );

}

applyReducedMotion();


/* =========================================================
   INITIALIZE ANIMATION
   ========================================================= */

updateSimulationStatus();

startUniverseAnimation();
/* =========================================================
   BLOCK 8/12 — INTERACTION + OBJECT CONTROL
   ========================================================= */

let interactionEnabled =
  true;

let pointerDown =
  false;

let pointerMoved =
  false;

let pointerStartX =
  0;

let pointerStartY =
  0;

let pointerLastX =
  0;

let pointerLastY =
  0;

let selectedObject =
  null;

let selectedObjectKey =
  null;

let hoveredObject =
  null;

let hoveredObjectKey =
  null;

let objectRotationX =
  0;

let objectRotationY =
  0;

let objectZoom =
  1;

let objectViewActive =
  false;


/* =========================================================
   POINTER HELPERS
   ========================================================= */

function getPointerPosition(
  event
) {

  const rect =
    renderer.domElement.getBoundingClientRect();

  return {
    x:
      (
        event.clientX -
        rect.left
      ) /
      rect.width *
      2 -
      1,

    y:
      -(
        event.clientY -
        rect.top
      ) /
      rect.height *
      2 +
      1
  };

}


function getIntersection(
  event
) {

  if (
    !raycaster ||
    !camera ||
    !scene
  ) {
    return null;
  }

  const point =
    getPointerPosition(
      event
    );

  mouse.x =
    point.x;

  mouse.y =
    point.y;

  raycaster.setFromCamera(
    mouse,
    camera
  );

  const intersections =
    raycaster.intersectObjects(
      scene.children,
      true
    );

  for (
    const hit of intersections
  ) {

    let object =
      hit.object;

    while (
      object &&
      object.parent &&
      !object.userData.objectKey &&
      !object.name
    ) {

      object =
        object.parent;

    }

    const key =
      object?.userData?.objectKey ||
      object?.name;

    if (
      key &&
      OBJECTS[key]
    ) {

      return {
        object,
        key,
        hit
      };

    }

  }

  return null;

}


/* =========================================================
   OBJECT SELECTION
   ========================================================= */

function selectObject(
  object,
  key
) {

  if (
    !object ||
    !key
  ) {
    return;
  }

  selectedObject =
    object;

  selectedObjectKey =
    key;

  showObjectHighlight(
    object
  );

  focusObject(
    object,
    key
  );

  objectViewActive =
    true;

  updateSelectedObjectUI();

}


function clearObjectSelection() {

  selectedObject =
    null;

  selectedObjectKey =
    null;

  objectViewActive =
    false;

  hideObjectHighlight();

  updateSelectedObjectUI();

}


function updateSelectedObjectUI() {

  if (
    selectedObjectKey
  ) {

    const data =
      OBJECTS[
        selectedObjectKey
      ];

    if (
      data &&
      selectedObjectLabel
    ) {

      selectedObjectLabel.textContent =
        data.name ||
        selectedObjectKey;

    }

  } else if (
    selectedObjectLabel
  ) {

    selectedObjectLabel.textContent =
      "NO OBJECT SELECTED";

  }

}


/* =========================================================
   HIGHLIGHT
   ========================================================= */

function showObjectHighlight(
  object
) {

  if (
    !highlightRing ||
    !object
  ) {
    return;
  }

  highlightRing.visible =
    true;

  const box =
    new THREE.Box3()
      .setFromObject(
        object
      );

  const size =
    new THREE.Vector3();

  box.getSize(
    size
  );

  const radius =
    Math.max(
      size.x,
      size.y,
      size.z,
      1
    );

  highlightRing.scale.set(
    radius * 0.8,
    radius * 0.8,
    radius * 0.8
  );

  highlightRing.position.copy(
    object.getWorldPosition(
      new THREE.Vector3()
    )
  );

}


function hideObjectHighlight() {

  if (
    highlightRing
  ) {

    highlightRing.visible =
      false;

  }

}


/* =========================================================
   FOCUS OBJECT
   ========================================================= */

function focusObject(
  object,
  key
) {

  if (
    !object
  ) {
    return;
  }

  selectedObject =
    object;

  selectedObjectKey =
    key;

  const position =
    object.getWorldPosition(
      new THREE.Vector3()
    );

  const box =
    new THREE.Box3()
      .setFromObject(
        object
      );

  const size =
    new THREE.Vector3();

  box.getSize(
    size
  );

  const radius =
    Math.max(
      size.x,
      size.y,
      size.z,
      1
    );

  const distance =
    Math.max(
      radius * 4,
      3
    );

  const direction =
    new THREE.Vector3(
      1,
      0.65,
      1
    ).normalize();

  cameraTarget =
    position.clone()
      .add(
        direction.multiplyScalar(
          distance
        )
      );

  targetLookAt =
    position.clone();

  showObjectHighlight(
    object
  );

  openObjectPanel(
    key
  );

}


/* =========================================================
   OPEN OBJECT PANEL
   ========================================================= */

function openObjectPanel(
  key
) {

  if (
    !key ||
    !OBJECTS[key]
  ) {
    return;
  }

  const data =
    OBJECTS[key];

  if (
    infoPanel
  ) {

    infoPanel.classList.add(
      "open"
    );

  }

  if (
    infoTitle
  ) {

    infoTitle.textContent =
      data.name ||
      key;

  }

  if (
    infoType
  ) {

    infoType.textContent =
      data.type ||
      "Celestial object";

  }

  if (
    infoDistance
  ) {

    infoDistance.textContent =
      data.distance ||
      "Unknown";

  }

  if (
    infoDescription
  ) {

    infoDescription.textContent =
      data.description ||
      "Astronomical information available.";

  }

  renderExtraData(
    key
  );

  renderSources(
    key
  );

  updateBreadcrumb(
    key
  );

}


/* =========================================================
   CLOSE OBJECT PANEL
   ========================================================= */

if (
  closeInfoButton
) {

  closeInfoButton.addEventListener(
    "click",
    () => {

      if (
        infoPanel
      ) {

        infoPanel.classList.remove(
          "open"
        );

      }

      clearObjectSelection();

    }
  );

}


/* =========================================================
   CLICK INTERACTION
   ========================================================= */

renderer.domElement.addEventListener(
  "pointerdown",
  event => {

    if (
      !interactionEnabled
    ) {
      return;
    }

    pointerDown =
      true;

    pointerMoved =
      false;

    pointerStartX =
      event.clientX;

    pointerStartY =
      event.clientY;

    pointerLastX =
      event.clientX;

    pointerLastY =
      event.clientY;

  }
);


renderer.domElement.addEventListener(
  "pointermove",
  event => {

    if (
      !interactionEnabled
    ) {
      return;
    }

    const dx =
      event.clientX -
      pointerLastX;

    const dy =
      event.clientY -
      pointerLastY;

    if (
      Math.abs(
        event.clientX -
        pointerStartX
      ) > 5 ||
      Math.abs(
        event.clientY -
        pointerStartY
      ) > 5
    ) {

      pointerMoved =
        true;

    }

    pointerLastX =
      event.clientX;

    pointerLastY =
      event.clientY;

    const result =
      getIntersection(
        event
      );

    if (
      result &&
      result.object
    ) {

      hoveredObject =
        result.object;

      hoveredObjectKey =
        result.key;

      renderer.domElement.style.cursor =
        "pointer";

    } else {

      hoveredObject =
        null;

      hoveredObjectKey =
        null;

      renderer.domElement.style.cursor =
        "default";

    }

    if (
      pointerDown &&
      pointerMoved &&
      objectViewActive
    ) {

      objectRotationY +=
        dx *
        0.008;

      objectRotationX +=
        dy *
        0.008;

    }

  }
);


renderer.domElement.addEventListener(
  "pointerup",
  event => {

    if (
      !interactionEnabled
    ) {
      return;
    }

    if (
      pointerDown &&
      !pointerMoved
    ) {

      const result =
        getIntersection(
          event
        );

      if (
        result
      ) {

        selectObject(
          result.object,
          result.key
        );

      }

    }

    pointerDown =
      false;

  }
);


renderer.domElement.addEventListener(
  "pointercancel",
  () => {

    pointerDown =
      false;

  }
);


/* =========================================================
   DOUBLE CLICK
   ========================================================= */

renderer.domElement.addEventListener(
  "dblclick",
  event => {

    const result =
      getIntersection(
        event
      );

    if (
      result
    ) {

      focusObject(
        result.object,
        result.key
      );

    }

  }
);


/* =========================================================
   WHEEL ZOOM
   ========================================================= */

renderer.domElement.addEventListener(
  "wheel",
  event => {

    if (
      !interactionEnabled
    ) {
      return;
    }

    event.preventDefault();

    const factor =
      event.deltaY > 0
        ? 1.12
        : 0.89;

    const direction =
      camera.position
        .clone()
        .sub(
          controls.target
        )
        .normalize();

    const distance =
      camera.position.distanceTo(
        controls.target
      );

    const newDistance =
      Math.max(
        0.5,
        Math.min(
          1000000000,
          distance *
          factor
        )
      );

    camera.position.copy(
      controls.target
        .clone()
        .add(
          direction.multiplyScalar(
            newDistance
          )
        )
    );

  },
  {
    passive: false
  }
);


/* =========================================================
   KEYBOARD OBJECT NAVIGATION
   ========================================================= */

document.addEventListener(
  "keydown",
  event => {

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

    const quickKeys = {
      "1": "sun",
      "2": "earth",
      "3": "moon",
      "4": "mars",
      "5": "jupiter",
      "6": "saturn",
      "7": "uranus",
      "8": "neptune",
      "9": "pluto"
    };

    const key =
      quickKeys[
        event.key
      ];

    if (
      key &&
      planetObjects[key]
    ) {

      focusObject(
        planetObjects[key],
        key
      );

    }

    if (
      event.key ===
      "Escape"
    ) {

      clearObjectSelection();

      if (
        infoPanel
      ) {

        infoPanel.classList.remove(
          "open"
        );

      }

    }

  }
);


/* =========================================================
   OBJECT VIEW ROTATION
   ========================================================= */

function applyObjectRotation() {

  if (
    !selectedObject
  ) {
    return;
  }

  selectedObject.rotation.x =
    objectRotationX;

  selectedObject.rotation.y =
    objectRotationY;

}


function resetObjectRotation() {

  objectRotationX =
    0;

  objectRotationY =
    0;

  if (
    selectedObject
  ) {

    selectedObject.rotation.x =
      0;

    selectedObject.rotation.y =
      0;

  }

}


/* =========================================================
   OBJECT ZOOM
   ========================================================= */

function zoomSelectedObject(
  factor
) {

  if (
    !selectedObject
  ) {
    return;
  }

  objectZoom =
    Math.max(
      0.5,
      Math.min(
        5,
        objectZoom *
        factor
      )
    );

  selectedObject.scale.setScalar(
    objectZoom
  );

}


/* =========================================================
   OBJECT VIEW BUTTONS
   ========================================================= */

if (
  objectZoomInButton
) {

  objectZoomInButton.addEventListener(
    "click",
    () => {

      zoomSelectedObject(
        1.15
      );

    }
  );

}


if (
  objectZoomOutButton
) {

  objectZoomOutButton.addEventListener(
    "click",
    () => {

      zoomSelectedObject(
        0.87
      );

    }
  );

}


if (
  objectResetButton
) {

  objectResetButton.addEventListener(
    "click",
    () => {

      resetObjectRotation();

      objectZoom =
        1;

      if (
        selectedObject
      ) {

        selectedObject.scale.setScalar(
          1
        );

      }

    }
  );

}


/* =========================================================
   APPLY OBJECT ROTATION
   ========================================================= */

const previousUpdateUniverse =
  updateUniverse;

updateUniverse =
  function(
    delta,
    now
  ) {

    previousUpdateUniverse(
      delta,
      now
    );

    applyObjectRotation();

  };


/* =========================================================
   TOUCH PINCH
   ========================================================= */

let touchDistance =
  null;

renderer.domElement.addEventListener(
  "touchstart",
  event => {

    if (
      event.touches.length ===
      2
    ) {

      const a =
        event.touches[0];

      const b =
        event.touches[1];

      const dx =
        a.clientX -
        b.clientX;

      const dy =
        a.clientY -
        b.clientY;

      touchDistance =
        Math.hypot(
          dx,
          dy
        );

    }

  },
  {
    passive: true
  }
);


renderer.domElement.addEventListener(
  "touchmove",
  event => {

    if (
      event.touches.length !==
      2 ||
      touchDistance ===
      null
    ) {
      return;
    }

    const a =
      event.touches[0];

    const b =
      event.touches[1];

    const dx =
      a.clientX -
      b.clientX;

    const dy =
      a.clientY -
      b.clientY;

    const distance =
      Math.hypot(
        dx,
        dy
      );

    const difference =
      distance -
      touchDistance;

    const factor =
      difference > 0
        ? 0.97
        : 1.03;

    if (
      camera &&
      controls
    ) {

      const direction =
        camera.position
          .clone()
          .sub(
            controls.target
          )
          .normalize();

      const currentDistance =
        camera.position.distanceTo(
          controls.target
        );

      const nextDistance =
        Math.max(
          0.5,
          Math.min(
            1000000000,
            currentDistance *
            factor
          )
        );

      camera.position.copy(
        controls.target
          .clone()
          .add(
            direction.multiplyScalar(
              nextDistance
            )
          )
      );

    }

    touchDistance =
      distance;

  },
  {
    passive: true
  }
);


renderer.domElement.addEventListener(
  "touchend",
  () => {

    touchDistance =
      null;

  },
  {
    passive: true
  }
);


/* =========================================================
   READY
   ========================================================= */

setSimulationSpeed(
  DEFAULT_SIMULATION_SPEED
);

updateSelectedObjectUI();
/* =========================================================
   BLOCK 9/12 — UI CONTROLS + NAVIGATION
   ========================================================= */

let currentView =
  "universe";

let currentMode =
  "explore";

let currentSection =
  "home";

let previousSection =
  null;

let interfaceLocked =
  false;


/* =========================================================
   SECTION MANAGEMENT
   ========================================================= */

function setSection(
  section
) {

  if (
    !section
  ) {
    return;
  }

  previousSection =
    currentSection;

  currentSection =
    section;

  document
    .querySelectorAll(
      "[data-section]"
    )
    .forEach(
      element => {

        const active =
          element.dataset.section ===
          section;

        element.classList.toggle(
          "active",
          active
        );

      }
    );

}


function goBackSection() {

  if (
    previousSection
  ) {

    const target =
      previousSection;

    previousSection =
      null;

    setSection(
      target
    );

  }

}


/* =========================================================
   VIEW MANAGEMENT
   ========================================================= */

function setView(
  view
) {

  if (
    !view
  ) {
    return;
  }

  currentView =
    view;

  document
    .querySelectorAll(
      "[data-view]"
    )
    .forEach(
      element => {

        element.classList.toggle(
          "active",
          element.dataset.view ===
          view
        );

      }
    );

  updateBreadcrumb(
    selectedObjectKey
  );

}


function activateSolarSystem() {

  currentView =
    "solar";

  currentMode =
    "explore";

  if (
    solarSystemGroup
  ) {

    solarSystemGroup.visible =
      true;

  }

  if (
    milkyWayVisual
  ) {

    milkyWayVisual.visible =
      true;

  }

  setCameraPreset(
    "solar"
  );

  setSection(
    "solar"
  );

  showToast(
    "SOLAR SYSTEM MODE"
  );

}


function activateGalaxyMode() {

  currentView =
    "galaxy";

  currentMode =
    "explore";

  setCameraPreset(
    "galaxy"
  );

  setSection(
    "galaxies"
  );

  showToast(
    "GALACTIC EXPLORATION"
  );

}


function activateBlackHoleMode() {

  currentView =
    "blackhole";

  currentMode =
    "explore";

  if (
    OBJECTS["sagittarius-a"]
  ) {

    focusObject(
      blackHole,
      "sagittarius-a"
    );

  }

  setSection(
    "blackholes"
  );

  showToast(
    "BLACK HOLE MODE"
  );

}


function activateUniverseMode() {

  currentView =
    "universe";

  currentMode =
    "explore";

  setCameraPreset(
    "universe"
  );

  setSection(
    "universe"
  );

  showToast(
    "UNIVERSE SCALE"
  );

}


/* =========================================================
   CAMERA PRESETS
   ========================================================= */

function setCameraPreset(
  preset
) {

  if (
    !camera ||
    !controls
  ) {
    return;
  }

  let position =
    new THREE.Vector3();

  let target =
    new THREE.Vector3();

  if (
    preset ===
    "solar"
  ) {

    position.set(
      0,
      180,
      280
    );

    target.set(
      0,
      0,
      0
    );

  } else if (
    preset ===
    "galaxy"
  ) {

    position.set(
      0,
      850,
      1400
    );

    target.set(
      0,
      0,
      0
    );

  } else if (
    preset ===
    "universe"
  ) {

    position.set(
      0,
      2500,
      4200
    );

    target.set(
      0,
      0,
      0
    );

  } else if (
    preset ===
    "blackhole"
  ) {

    position.set(
      0,
      35,
      65
    );

    target.set(
      0,
      0,
      0
    );

  } else {

    position.set(
      0,
      120,
      220
    );

    target.set(
      0,
      0,
      0
    );

  }

  cameraTarget =
    position;

  targetLookAt =
    target;

}


/* =========================================================
   NAVIGATION BUTTONS
   ========================================================= */

function bindButton(
  element,
  callback
) {

  if (
    !element
  ) {
    return;
  }

  element.addEventListener(
    "click",
    event => {

      event.preventDefault();

      if (
        interfaceLocked
      ) {
        return;
      }

      callback();

    }
  );

}


bindButton(
  solarButton,
  activateSolarSystem
);


bindButton(
  galaxyButton,
  activateGalaxyMode
);


bindButton(
  blackHoleButton,
  activateBlackHoleMode
);


bindButton(
  universeButton,
  activateUniverseMode
);


/* =========================================================
   HOME
   ========================================================= */

function goHome() {

  currentView =
    "universe";

  currentMode =
    "explore";

  clearObjectSelection();

  if (
    infoPanel
  ) {

    infoPanel.classList.remove(
      "open"
    );

  }

  setCameraPreset(
    "universe"
  );

  setSection(
    "home"
  );

  showToast(
    "UNIVERSE EXPLORER"
  );

}


bindButton(
  homeButton,
  goHome
);


/* =========================================================
   START EXPLORING
   ========================================================= */

function startExploring() {

  currentMode =
    "explore";

  currentView =
    "universe";

  setSection(
    "explore"
  );

  setCameraPreset(
    "universe"
  );

  showToast(
    "EXPLORATION STARTED"
  );

}


bindButton(
  startButton,
  startExploring
);


/* =========================================================
   EXPLORE JOURNEY
   ========================================================= */

const explorationSteps = [
  {
    name:
      "Earth",
    message:
      "Starting from Earth.",
    preset:
      "solar"
  },
  {
    name:
      "Solar System",
    message:
      "Entering the Solar System.",
    preset:
      "solar"
  },
  {
    name:
      "Milky Way",
    message:
      "Leaving the Solar System.",
    preset:
      "galaxy"
  },
  {
    name:
      "Local Group",
    message:
      "Approaching the Local Group.",
    preset:
      "galaxy"
  },
  {
    name:
      "Observable Universe",
    message:
      "Reaching cosmic scale.",
    preset:
      "universe"
  }
];

let explorationIndex =
  0;

let explorationActive =
  false;


function startExplorationJourney() {

  explorationIndex =
    0;

  explorationActive =
    true;

  showExplorationStep();

}


function showExplorationStep() {

  if (
    !explorationActive
  ) {
    return;
  }

  const step =
    explorationSteps[
      explorationIndex
    ];

  if (
    !step
  ) {

    explorationActive =
      false;

    showToast(
      "JOURNEY COMPLETE"
    );

    return;

  }

  setCameraPreset(
    step.preset
  );

  showToast(
    step.message
  );

  if (
    journeyLabel
  ) {

    journeyLabel.textContent =
      step.name;

  }

}


function nextExplorationStep() {

  if (
    !explorationActive
  ) {
    startExplorationJourney();
    return;
  }

  explorationIndex++;

  showExplorationStep();

}


bindButton(
  exploreButton,
  startExplorationJourney
);


bindButton(
  nextJourneyButton,
  nextExplorationStep
);


/* =========================================================
   TIME TRAVEL
   ========================================================= */

let timeTravelActive =
  false;

let cosmicTimelinePosition =
  0;

const cosmicEpochs = [
  {
    value:
      0,
    title:
      "13.8 BILLION YEARS AGO",
    description:
      "Early Universe."
  },
  {
    value:
      0.25,
    title:
      "12 BILLION YEARS AGO",
    description:
      "Early galaxies formed."
  },
  {
    value:
      0.5,
    title:
      "8 BILLION YEARS AGO",
    description:
      "Galaxies continued evolving."
  },
  {
    value:
      0.75,
    title:
      "4.6 BILLION YEARS AGO",
    description:
      "The Solar System formed."
  },
  {
    value:
      1,
    title:
      "TODAY",
    description:
      "Present-day observable Universe."
  }
];


function startTimeTravel() {

  timeTravelActive =
    true;

  cosmicTimelinePosition =
    0;

  setSection(
    "time"
  );

  updateTimeTravelUI();

  showToast(
    "TIME TRAVEL ACTIVATED"
  );

}


function stopTimeTravel() {

  timeTravelActive =
    false;

  showToast(
    "TIME TRAVEL PAUSED"
  );

}


function updateTimeTravelUI() {

  if (
    !timelineProgress
  ) {
    return;
  }

  timelineProgress.value =
    cosmicTimelinePosition;

  let closest =
    cosmicEpochs[0];

  let difference =
    Infinity;

  cosmicEpochs.forEach(
    epoch => {

      const d =
        Math.abs(
          epoch.value -
          cosmicTimelinePosition
        );

      if (
        d <
        difference
      ) {

        difference =
          d;

        closest =
          epoch;

      }

    }
  );

  if (
    timelineTitle
  ) {

    timelineTitle.textContent =
      closest.title;

  }

  if (
    timelineDescription
  ) {

    timelineDescription.textContent =
      closest.description;

  }

}


bindButton(
  timeTravelButton,
  startTimeTravel
);


if (
  timelineProgress
) {

  timelineProgress.addEventListener(
    "input",
    () => {

      cosmicTimelinePosition =
        Number(
          timelineProgress.value
        );

      timeTravelActive =
        true;

      updateTimeTravelUI();

    }
  );

}


/* =========================================================
   COMPARE MODE
   ========================================================= */

let compareActive =
  false;

let compareFirst =
  null;

let compareSecond =
  null;


function enterCompareMode() {

  compareActive =
    true;

  compareFirst =
    null;

  compareSecond =
    null;

  setSection(
    "compare"
  );

  showToast(
    "SELECT TWO OBJECTS"
  );

}


function addCompareObject(
  key
) {

  if (
    !compareActive ||
    !OBJECTS[key]
  ) {
    return;
  }

  if (
    !compareFirst
  ) {

    compareFirst =
      key;

    showToast(
      "FIRST OBJECT: " +
      OBJECTS[key].name
    );

    return;

  }

  if (
    !compareSecond &&
    key !== compareFirst
  ) {

    compareSecond =
      key;

    renderComparison();

    return;

  }

}


function renderComparison() {

  if (
    !compareFirst ||
    !compareSecond
  ) {
    return;
  }

  const first =
    OBJECTS[
      compareFirst
    ];

  const second =
    OBJECTS[
      compareSecond
    ];

  if (
    comparePanel
  ) {

    comparePanel.classList.add(
      "open"
    );

  }

  setText(
    compareNameA,
    first.name
  );

  setText(
    compareNameB,
    second.name
  );

  setText(
    compareTypeA,
    first.type ||
    "Unknown"
  );

  setText(
    compareTypeB,
    second.type ||
    "Unknown"
  );

  setText(
    compareDistanceA,
    first.distance ||
    "Unknown"
  );

  setText(
    compareDistanceB,
    second.distance ||
    "Unknown"
  );

  setText(
    compareSizeA,
    first.size ||
    "Unknown"
  );

  setText(
    compareSizeB,
    second.size ||
    "Unknown"
  );

  showToast(
    "COMPARISON READY"
  );

}


bindButton(
  compareButton,
  enterCompareMode
);


/* =========================================================
   SEARCH SHORTCUT
   ========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key ===
      "/" &&
      document.activeElement !==
      searchInput
    ) {

      event.preventDefault();

      if (
        searchInput
      ) {

        searchInput.focus();

      }

    }

  }
);


/* =========================================================
   UI STATUS
   ========================================================= */

function updateNavigationStatus() {

  if (
    currentViewLabel
  ) {

    currentViewLabel.textContent =
      currentView.toUpperCase();

  }

  if (
    currentModeLabel
  ) {

    currentModeLabel.textContent =
      currentMode.toUpperCase();

  }

}


const oldUpdateUniverseStatus =
  updateUniverse;

updateUniverse =
  function(
    delta,
    now
  ) {

    oldUpdateUniverseStatus(
      delta,
      now
    );

    updateNavigationStatus();

  };


/* =========================================================
   INITIAL NAVIGATION STATE
   ========================================================= */

setSection(
  "home"
);

setView(
  "universe"
);

updateNavigationStatus();
/* =========================================================
   BLOCK 10/12 — SEARCH + DATA + SOURCES
   ========================================================= */

const sourceRegistry = {
  nasa:
    "NASA",
  esa:
    "ESA",
  simbad:
    "SIMBAD",
  exoplanet:
    "NASA Exoplanet Archive"
};


/* =========================================================
   SEARCH DATABASE
   ========================================================= */

const universeSearchIndex = [];

function rebuildSearchIndex() {

  universeSearchIndex.length =
    0;

  Object.keys(
    OBJECTS
  ).forEach(
    key => {

      const object =
        OBJECTS[key];

      if (
        !object
      ) {
        return;
      }

      universeSearchIndex.push({
        key,
        name:
          object.name ||
          key,
        type:
          object.type ||
          "",
        aliases:
          object.aliases ||
          [],
        description:
          object.description ||
          ""
      });

    }
  );

}


/* =========================================================
   SEARCH NORMALIZATION
   ========================================================= */

function normalizeSearchText(
  value
) {

  return String(
    value || ""
  )
    .toLowerCase()
    .normalize(
      "NFD"
    )
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .trim();

}


/* =========================================================
   SEARCH OBJECTS
   ========================================================= */

function searchUniverse(
  query
) {

  const normalized =
    normalizeSearchText(
      query
    );

  if (
    !normalized
  ) {
    return [];
  }

  return universeSearchIndex
    .map(
      item => {

        const name =
          normalizeSearchText(
            item.name
          );

        const type =
          normalizeSearchText(
            item.type
          );

        const aliases =
          item.aliases
            .map(
              normalizeSearchText
            );

        let score =
          0;

        if (
          name ===
          normalized
        ) {

          score +=
            100;

        } else if (
          name.startsWith(
            normalized
          )
        ) {

          score +=
            60;

        } else if (
          name.includes(
            normalized
          )
        ) {

          score +=
            40;

        }

        if (
          type.includes(
            normalized
          )
        ) {

          score +=
            15;

        }

        aliases.forEach(
          alias => {

            if (
              alias ===
              normalized
            ) {

              score +=
                80;

            } else if (
              alias.includes(
                normalized
              )
            ) {

              score +=
                30;

            }

          }
        );

        if (
          normalizeSearchText(
            item.description
          ).includes(
            normalized
          )
        ) {

          score +=
            10;

        }

        return {
          ...item,
          score
        };

      }
    )
    .filter(
      item =>
        item.score >
        0
    )
    .sort(
      (
        a,
        b
      ) =>
        b.score -
        a.score
    )
    .slice(
      0,
      12
    );

}


/* =========================================================
   SEARCH RESULT UI
   ========================================================= */

function clearSearchResults() {

  if (
    searchResults
  ) {

    searchResults.innerHTML =
      "";

  }

}


function renderSearchResults(
  results
) {

  if (
    !searchResults
  ) {
    return;
  }

  searchResults.innerHTML =
    "";

  if (
    !results.length
  ) {

    const empty =
      document.createElement(
        "div"
      );

    empty.className =
      "search-empty";

    empty.textContent =
      "NO OBJECTS FOUND";

    searchResults.appendChild(
      empty
    );

    return;

  }

  results.forEach(
    result => {

      const button =
        document.createElement(
          "button"
        );

      button.type =
        "button";

      button.className =
        "search-result";

      const name =
        document.createElement(
          "strong"
        );

      name.textContent =
        result.name;

      const type =
        document.createElement(
          "span"
        );

      type.textContent =
        result.type ||
        "Celestial object";

      button.appendChild(
        name
      );

      button.appendChild(
        type
      );

      button.addEventListener(
        "click",
        () => {

          const object =
            findObjectByKey(
              result.key
            );

          if (
            object
          ) {

            focusObject(
              object,
              result.key
            );

          }

          if (
            searchInput
          ) {

            searchInput.value =
              result.name;

          }

          clearSearchResults();

        }
      );

      searchResults.appendChild(
        button
      );

    }
  );

}


/* =========================================================
   SEARCH INPUT
   ========================================================= */

if (
  searchInput
) {

  searchInput.addEventListener(
    "input",
    () => {

      const query =
        searchInput.value;

      if (
        !query.trim()
      ) {

        clearSearchResults();

        return;

      }

      const results =
        searchUniverse(
          query
        );

      renderSearchResults(
        results
      );

    }
  );

  searchInput.addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "Enter"
      ) {

        const results =
          searchUniverse(
            searchInput.value
          );

        if (
          results.length
        ) {

          const object =
            findObjectByKey(
              results[0].key
            );

          if (
            object
          ) {

            focusObject(
              object,
              results[0].key
            );

          }

          clearSearchResults();

        }

      }

      if (
        event.key ===
        "Escape"
      ) {

        clearSearchResults();

        searchInput.blur();

      }

    }
  );

}


/* =========================================================
   FIND OBJECT
   ========================================================= */

function findObjectByKey(
  key
) {

  if (
    !key
  ) {
    return null;
  }

  if (
    planetObjects[key]
  ) {

    return planetObjects[key];

  }

  if (
    nearbyStarObjects[key]
  ) {

    return nearbyStarObjects[key];

  }

  if (
    objectRegistry[key]
  ) {

    return objectRegistry[key];

  }

  if (
    OBJECTS[key] &&
    OBJECTS[key].object
  ) {

    return OBJECTS[key].object;

  }

  return null;

}


/* =========================================================
   OBJECT REGISTRY
   ========================================================= */

const objectRegistry =
  {};


function registerUniverseObject(
  key,
  object
) {

  if (
    !key ||
    !object
  ) {
    return;
  }

  objectRegistry[key] =
    object;

  object.userData =
    object.userData ||
    {};

  object.userData.objectKey =
    key;

}


function registerAllObjects() {

  Object.keys(
    planetObjects
  ).forEach(
    key => {

      registerUniverseObject(
        key,
        planetObjects[key]
      );

    }
  );

  Object.keys(
    nearbyStarObjects
  ).forEach(
    key => {

      registerUniverseObject(
        key,
        nearbyStarObjects[key]
      );

    }
  );

  if (
    sun
  ) {

    registerUniverseObject(
      "sun",
      sun
    );

  }

  if (
    moon
  ) {

    registerUniverseObject(
      "moon",
      moon
    );

  }

  if (
    milkyWayVisual
  ) {

    registerUniverseObject(
      "milky-way",
      milkyWayVisual
    );

  }

  if (
    andromedaVisual
  ) {

    registerUniverseObject(
      "andromeda",
      andromedaVisual
    );

  }

  if (
    blackHole
  ) {

    registerUniverseObject(
      "sagittarius-a",
      blackHole
    );

  }

}


/* =========================================================
   OBJECT METADATA
   ========================================================= */

function getObjectMetadata(
  key
) {

  if (
    extraData &&
    extraData[key]
  ) {

    return extraData[key];

  }

  if (
    OBJECTS[key]
  ) {

    return OBJECTS[key];

  }

  return null;

}


/* =========================================================
   DATA FORMATTER
   ========================================================= */

function formatValue(
  value,
  fallback =
    "Unknown"
) {

  if (
    value ===
    undefined ||
    value ===
    null ||
    value ===
    ""
  ) {

    return fallback;

  }

  return String(
    value
  );

}


/* =========================================================
   INFORMATION TABLE
   ========================================================= */

function createDataRow(
  label,
  value
) {

  const row =
    document.createElement(
      "div"
    );

  row.className =
    "data-row";

  const labelElement =
    document.createElement(
      "span"
    );

  labelElement.className =
    "data-label";

  labelElement.textContent =
    label;

  const valueElement =
    document.createElement(
      "span"
    );

  valueElement.className =
    "data-value";

  valueElement.textContent =
    formatValue(
      value
    );

  row.appendChild(
    labelElement
  );

  row.appendChild(
    valueElement
  );

  return row;

}


function renderObjectStatistics(
  key
) {

  if (
    !statisticsContainer
  ) {
    return;
  }

  statisticsContainer.innerHTML =
    "";

  const data =
    getObjectMetadata(
      key
    );

  if (
    !data
  ) {
    return;
  }

  const fields = [
    [
      "Type",
      data.type
    ],
    [
      "Distance",
      data.distance
    ],
    [
      "Size",
      data.size
    ],
    [
      "Mass",
      data.mass
    ],
    [
      "Age",
      data.age
    ],
    [
      "Temperature",
      data.temperature
    ],
    [
      "Composition",
      data.composition
    ],
    [
      "Orbit",
      data.orbit
    ]
  ];

  fields.forEach(
    field => {

      statisticsContainer.appendChild(
        createDataRow(
          field[0],
          field[1]
        )
      );

    }
  );

}


/* =========================================================
   SOURCE DATA
   ========================================================= */

const sourceData = {

  sun: [
    "NASA Solar System Exploration",
    "NASA"
  ],

  earth: [
    "NASA Earth Observatory",
    "NASA"
  ],

  moon: [
    "NASA Moon",
    "NASA"
  ],

  mars: [
    "NASA Mars Exploration",
    "NASA"
  ],

  jupiter: [
    "NASA Solar System Exploration",
    "NASA"
  ],

  saturn: [
    "NASA Solar System Exploration",
    "NASA"
  ],

  uranus: [
    "NASA Solar System Exploration",
    "NASA"
  ],

  neptune: [
    "NASA Solar System Exploration",
    "NASA"
  ],

  pluto: [
    "NASA New Horizons",
    "NASA"
  ],

  "milky-way": [
    "NASA Universe",
    "NASA"
  ],

  andromeda: [
    "NASA / ESA astronomical observations",
    "NASA / ESA"
  ],

  "sagittarius-a": [
    "Event Horizon Telescope observations",
    "EHT"
  ]

};


/* =========================================================
   RENDER SOURCES
   ========================================================= */

function renderSources(
  key
) {

  if (
    !sourcesContainer
  ) {
    return;
  }

  sourcesContainer.innerHTML =
    "";

  const sources =
    sourceData[key] ||
    [
      "Astronomical catalogs",
      "Scientific observations"
    ];

  sources.forEach(
    source => {

      const item =
        document.createElement(
          "div"
        );

      item.className =
        "source-item";

      item.textContent =
        source;

      sourcesContainer.appendChild(
        item
      );

    }
  );

}


/* =========================================================
   DATA QUALITY LABEL
   ========================================================= */

function getDataQuality(
  key
) {

  const data =
    getObjectMetadata(
      key
    );

  if (
    !data
  ) {

    return "REFERENCE";

  }

  if (
    data.hypothesis
  ) {

    return "HYPOTHESIS";

  }

  if (
    data.model
  ) {

    return "MODEL";

  }

  if (
    data.estimated
  ) {

    return "ESTIMATED";

  }

  return "OBSERVED / CATALOGUED";

}


function updateDataQuality(
  key
) {

  if (
    dataQuality
  ) {

    dataQuality.textContent =
      getDataQuality(
        key
      );

  }

}


/* =========================================================
   EXTENDED OBJECT PANEL
   ========================================================= */

const oldOpenObjectPanel =
  openObjectPanel;

openObjectPanel =
  function(
    key
  ) {

    oldOpenObjectPanel(
      key
    );

    renderObjectStatistics(
      key
    );

    updateDataQuality(
      key
    );

  };


/* =========================================================
   OBJECT DISCOVERY
   ========================================================= */

function discoverObject(
  key
) {

  const object =
    findObjectByKey(
      key
    );

  if (
    !object
  ) {

    showToast(
      "OBJECT NOT AVAILABLE"
    );

    return;

  }

  focusObject(
    object,
    key
  );

  setSection(
    "discover"
  );

}


/* =========================================================
   QUICK DISCOVERY BUTTONS
   ========================================================= */

document
  .querySelectorAll(
    "[data-object]"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          const key =
            button.dataset.object;

          discoverObject(
            key
          );

        }
      );

    }
  );


/* =========================================================
   INITIAL DATA SETUP
   ========================================================= */

registerAllObjects();

rebuildSearchIndex();

if (
  selectedObjectKey
) {

  updateDataQuality(
    selectedObjectKey
  );

}
/* =========================================================
   BLOCK 11/12 — LABELS + VISUAL SYSTEM + PERFORMANCE
   ========================================================= */

const labelObjects =
  {};

const labelCanvas =
  document.createElement(
    "canvas"
  );

labelCanvas.width =
  1024;

labelCanvas.height =
  256;

const labelContext =
  labelCanvas.getContext(
    "2d"
  );


/* =========================================================
   LABEL CREATION
   ========================================================= */

function createObjectLabel(
  text,
  color =
    "#ffffff"
) {

  labelContext.clearRect(
    0,
    0,
    labelCanvas.width,
    labelCanvas.height
  );

  labelContext.font =
    "bold 42px Arial";

  labelContext.textAlign =
    "center";

  labelContext.textBaseline =
    "middle";

  labelContext.fillStyle =
    "rgba(0,0,0,0.72)";

  labelContext.fillRect(
    80,
    55,
    864,
    146
  );

  labelContext.strokeStyle =
    "rgba(80,220,255,0.75)";

  labelContext.lineWidth =
    4;

  labelContext.strokeRect(
    80,
    55,
    864,
    146
  );

  labelContext.fillStyle =
    color;

  labelContext.fillText(
    text,
    512,
    128
  );

  const texture =
    new THREE.CanvasTexture(
      labelCanvas
    );

  texture.needsUpdate =
    true;

  const material =
    new THREE.SpriteMaterial({
      map:
        texture,
      transparent:
        true,
      depthWrite:
        false
    });

  const sprite =
    new THREE.Sprite(
      material
    );

  sprite.scale.set(
    20,
    5,
    1
  );

  return sprite;

}


/* =========================================================
   ADD LABEL
   ========================================================= */

function addObjectLabel(
  key,
  object,
  color
) {

  if (
    !object ||
    !OBJECTS[key]
  ) {
    return;
  }

  if (
    labelObjects[key]
  ) {

    return labelObjects[key];

  }

  const label =
    createObjectLabel(
      OBJECTS[key].name ||
      key,
      color
    );

  label.userData =
    label.userData ||
    {};

  label.userData.objectKey =
    key;

  object.add(
    label
  );

  label.position.set(
    0,
    2.5,
    0
  );

  labelObjects[key] =
    label;

  return label;

}


/* =========================================================
   PLANET LABELS
   ========================================================= */

Object.keys(
  planetObjects
).forEach(
  key => {

    addObjectLabel(
      key,
      planetObjects[key]
    );

  }
);


if (
  sun
) {

  addObjectLabel(
    "sun",
    sun,
    "#ffe28a"
  );

}


if (
  moon
) {

  addObjectLabel(
    "moon",
    moon,
    "#d8e7ff"
  );

}


/* =========================================================
   GALAXY LABELS
   ========================================================= */

if (
  milkyWayVisual
) {

  addObjectLabel(
    "milky-way",
    milkyWayVisual,
    "#9bdcff"
  );

}


if (
  andromedaVisual
) {

  addObjectLabel(
    "andromeda",
    andromedaVisual,
    "#c9b8ff"
  );

}


if (
  blackHole
) {

  addObjectLabel(
    "sagittarius-a",
    blackHole,
    "#ffb36b"
  );

}


/* =========================================================
   LABEL VISIBILITY
   ========================================================= */

let labelsVisible =
  true;


function setLabelsVisible(
  visible
) {

  labelsVisible =
    Boolean(
      visible
    );

  Object.values(
    labelObjects
  ).forEach(
    label => {

      label.visible =
        labelsVisible;

    }
  );

}


if (
  labelsToggle
) {

  labelsToggle.addEventListener(
    "click",
    () => {

      setLabelsVisible(
        !labelsVisible
      );

      labelsToggle.classList.toggle(
        "active",
        labelsVisible
      );

    }
  );

}


/* =========================================================
   ORBIT VISIBILITY
   ========================================================= */

let orbitsVisible =
  true;


function setOrbitsVisible(
  visible
) {

  orbitsVisible =
    Boolean(
      visible
    );

  if (
    orbitGroup
  ) {

    orbitGroup.visible =
      orbitsVisible;

  }

}


if (
  orbitsToggle
) {

  orbitsToggle.addEventListener(
    "click",
    () => {

      setOrbitsVisible(
        !orbitsVisible
      );

      orbitsToggle.classList.toggle(
        "active",
        orbitsVisible
      );

    }
  );

}


/* =========================================================
   STAR VISIBILITY
   ========================================================= */

let starsVisible =
  true;


function setStarsVisible(
  visible
) {

  starsVisible =
    Boolean(
      visible
    );

  if (
    stars
  ) {

    stars.visible =
      starsVisible;

  }

}


if (
  starsToggle
) {

  starsToggle.addEventListener(
    "click",
    () => {

      setStarsVisible(
        !starsVisible
      );

      starsToggle.classList.toggle(
        "active",
        starsVisible
      );

    }
  );

}


/* =========================================================
   PERFORMANCE MODE
   ========================================================= */

let performanceMode =
  "high";


function setPerformanceMode(
  mode
) {

  if (
    mode !==
    "high" &&
    mode !==
    "balanced" &&
    mode !==
    "low"
  ) {

    mode =
      "balanced";

  }

  performanceMode =
    mode;

  if (
    renderer
  ) {

    renderer.setPixelRatio(
      mode === "high"
        ? Math.min(
            window.devicePixelRatio,
            2
          )
        : mode === "balanced"
          ? Math.min(
              window.devicePixelRatio,
              1.5
            )
          : 1
    );

  }

  updatePerformanceObjects();

}


function updatePerformanceObjects() {

  const lowDetail =
    performanceMode ===
    "low";

  const balanced =
    performanceMode ===
    "balanced";

  if (
    asteroidBelt
  ) {

    asteroidBelt.visible =
      !lowDetail;

  }

  if (
    stars
  ) {

    stars.visible =
      starsVisible;

  }

  Object.values(
    labelObjects
  ).forEach(
    label => {

      label.visible =
        labelsVisible &&
        !lowDetail;

    }
  );

  if (
    renderer
  ) {

    renderer.shadowMap.enabled =
      performanceMode ===
      "high";

  }

}


/* =========================================================
   PERFORMANCE BUTTONS
   ========================================================= */

if (
  performanceButton
) {

  performanceButton.addEventListener(
    "click",
    () => {

      const modes = [
        "high",
        "balanced",
        "low"
      ];

      const index =
        modes.indexOf(
          performanceMode
        );

      const next =
        modes[
          (index + 1) %
          modes.length
        ];

      setPerformanceMode(
        next
      );

      showToast(
        "PERFORMANCE: " +
        next.toUpperCase()
      );

    }
  );

}


/* =========================================================
   QUALITY BASED ON FPS
   ========================================================= */

let automaticQuality =
  true;


function updateAutomaticQuality() {

  if (
    !automaticQuality
  ) {
    return;
  }

  if (
    currentFPS <
    24 &&
    performanceMode ===
    "high"
  ) {

    setPerformanceMode(
      "balanced"
    );

    return;

  }

  if (
    currentFPS <
    18 &&
    performanceMode !==
    "low"
  ) {

    setPerformanceMode(
      "low"
    );

  }

}


/* =========================================================
   UI CLOCK
   ========================================================= */

function updateInterfaceClock() {

  if (
    !interfaceClock
  ) {
    return;
  }

  const now =
    new Date();

  const hours =
    String(
      now.getHours()
    ).padStart(
      2,
      "0"
    );

  const minutes =
    String(
      now.getMinutes()
    ).padStart(
      2,
      "0"
    );

  const seconds =
    String(
      now.getSeconds()
    ).padStart(
      2,
      "0"
    );

  interfaceClock.textContent =
    hours +
    ":" +
    minutes +
    ":" +
    seconds;

}


setInterval(
  updateInterfaceClock,
  1000
);

updateInterfaceClock();


/* =========================================================
   DATA CLOCK
   ========================================================= */

function updateCosmicCounter() {

  if (
    cosmicCounter
  ) {

    const years =
      13.8 -
      cosmicTimelinePosition *
      13.8;

    cosmicCounter.textContent =
      years.toFixed(
        2
      ) +
      " BY";

  }

}


const oldTimeTravelUI =
  updateTimeTravelUI;

updateTimeTravelUI =
  function() {

    oldTimeTravelUI();

    updateCosmicCounter();

  };


/* =========================================================
   TOOLTIP
   ========================================================= */

const tooltip =
  document.createElement(
    "div"
  );

tooltip.className =
  "universe-tooltip";

tooltip.style.position =
  "fixed";

tooltip.style.pointerEvents =
  "none";

tooltip.style.display =
  "none";

document.body.appendChild(
  tooltip
);


function showTooltip(
  text,
  x,
  y
) {

  if (
    !text
  ) {
    return;
  }

  tooltip.textContent =
    text;

  tooltip.style.left =
    (
      x + 14
    ) +
    "px";

  tooltip.style.top =
    (
      y + 14
    ) +
    "px";

  tooltip.style.display =
    "block";

}


function hideTooltip() {

  tooltip.style.display =
    "none";

}


/* =========================================================
   HOVER INFORMATION
   ========================================================= */

renderer.domElement.addEventListener(
  "pointermove",
  event => {

    if (
      pointerDown
    ) {

      hideTooltip();

      return;

    }

    const result =
      getIntersection(
        event
      );

    if (
      result &&
      OBJECTS[result.key]
    ) {

      showTooltip(
        OBJECTS[
          result.key
        ].name ||
        result.key,
        event.clientX,
        event.clientY
      );

    } else {

      hideTooltip();

    }

  }
);


/* =========================================================
   HOVER RESET
   ========================================================= */

renderer.domElement.addEventListener(
  "pointerleave",
  hideTooltip
);


/* =========================================================
   AUTO QUALITY UPDATE
   ========================================================= */

const previousUniverseUpdate =
  updateUniverse;

updateUniverse =
  function(
    delta,
    now
  ) {

    previousUniverseUpdate(
      delta,
      now
    );

    updateAutomaticQuality();

  };


/* =========================================================
   MOBILE UI
   ========================================================= */

function isMobileDevice() {

  return (
    window.innerWidth <=
    700
  );

}


function updateMobileInterface() {

  document.body.classList.toggle(
    "mobile-interface",
    isMobileDevice()
  );

}


window.addEventListener(
  "resize",
  updateMobileInterface
);

updateMobileInterface();


/* =========================================================
   FULLSCREEN STYLE MODE
   ========================================================= */

let cinematicMode =
  false;


function toggleCinematicMode() {

  cinematicMode =
    !cinematicMode;

  document.body.classList.toggle(
    "cinematic-mode",
    cinematicMode
  );

  showToast(
    cinematicMode
      ? "CINEMATIC MODE"
      : "STANDARD MODE"
  );

}


if (
  cinematicButton
) {

  cinematicButton.addEventListener(
    "click",
    toggleCinematicMode
  );

}


/* =========================================================
   ESCAPE UI
   ========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key !==
      "Escape"
    ) {
      return;
    }

    hideTooltip();

    if (
      searchResults
    ) {

      clearSearchResults();

    }

    if (
      comparePanel
    ) {

      comparePanel.classList.remove(
        "open"
      );

    }

  }
);


/* =========================================================
   FINAL PERFORMANCE SETUP
   ========================================================= */

setPerformanceMode(
  "high"
);

setLabelsVisible(
  true
);

setOrbitsVisible(
  true
);

setStarsVisible(
  true
);
/* =========================================================
   BLOCK 12/12 — FINAL SYSTEM + INITIALIZATION
   ========================================================= */

/* =========================================================
   OBJECT PRESENTATION
   ========================================================= */

function prepareObjectForPresentation(
  key
) {

  const object =
    findObjectByKey(
      key
    );

  if (
    !object
  ) {
    return;
  }

  selectedObject =
    object;

  selectedObjectKey =
    key;

  objectViewActive =
    true;

  objectZoom =
    1;

  objectRotationX =
    0;

  objectRotationY =
    0;

  showObjectHighlight(
    object
  );

  openObjectPanel(
    key
  );

}


/* =========================================================
   BREADCRUMB UPDATE
   ========================================================= */

function updateBreadcrumb(
  key
) {

  if (
    !breadcrumb
  ) {
    return;
  }

  const parts = [];

  parts.push(
    "Universe"
  );

  if (
    currentView ===
    "galaxy"
  ) {

    parts.push(
      "Galaxies"
    );

  } else if (
    currentView ===
    "solar"
  ) {

    parts.push(
      "Milky Way"
    );

    parts.push(
      "Solar System"
    );

  } else if (
    currentView ===
    "blackhole"
  ) {

    parts.push(
      "Black Holes"
    );

  }

  if (
    key &&
    OBJECTS[key]
  ) {

    parts.push(
      OBJECTS[key].name ||
      key
    );

  }

  breadcrumb.textContent =
    parts.join(
      "  ›  "
    );

}


/* =========================================================
   INFO PANEL TABS
   ========================================================= */

document
  .querySelectorAll(
    "[data-info-tab]"
  )
  .forEach(
    tab => {

      tab.addEventListener(
        "click",
        () => {

          const target =
            tab.dataset.infoTab;

          document
            .querySelectorAll(
              "[data-info-tab]"
            )
            .forEach(
              item => {

                item.classList.toggle(
                  "active",
                  item ===
                  tab
                );

              }
            );

          document
            .querySelectorAll(
              "[data-info-content]"
            )
            .forEach(
              content => {

                content.classList.toggle(
                  "active",
                  content.dataset.infoContent ===
                  target
                );

              }
            );

        }
      );

    }
  );


/* =========================================================
   MISSION DATA
   ========================================================= */

const missionData = {

  earth: [
    "Apollo",
    "International Space Station",
    "Earth observation missions"
  ],

  moon: [
    "Apollo",
    "Artemis",
    "Lunar Reconnaissance Orbiter"
  ],

  mars: [
    "Mars Reconnaissance Orbiter",
    "Curiosity",
    "Perseverance"
  ],

  jupiter: [
    "Juno",
    "Galileo"
  ],

  saturn: [
    "Cassini-Huygens"
  ],

  pluto: [
    "New Horizons"
  ]

};


function renderMissions(
  key
) {

  if (
    !missionsContainer
  ) {
    return;
  }

  missionsContainer.innerHTML =
    "";

  const missions =
    missionData[key] ||
    [];

  if (
    !missions.length
  ) {

    const empty =
      document.createElement(
        "div"
      );

    empty.className =
      "mission-empty";

    empty.textContent =
      "No dedicated mission data.";

    missionsContainer.appendChild(
      empty
    );

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

      missionsContainer.appendChild(
        item
      );

    }
  );

}


/* =========================================================
   CURIOSITIES
   ========================================================= */

const curiosityData = {

  earth: [
    "Earth has a global magnetic field.",
    "Most of its surface is covered by oceans.",
    "Its atmosphere is dominated by nitrogen and oxygen."
  ],

  moon: [
    "The Moon is tidally locked to Earth.",
    "Its surface preserves evidence of ancient impacts.",
    "It is Earth's natural satellite."
  ],

  mars: [
    "Mars has the largest volcano in the Solar System.",
    "Its atmosphere is very thin.",
    "Water ice exists at its poles and underground."
  ],

  jupiter: [
    "Jupiter is the largest planet in the Solar System.",
    "It has a powerful magnetic field.",
    "The Great Red Spot is a giant atmospheric storm."
  ],

  saturn: [
    "Saturn is famous for its extensive ring system.",
    "It has many moons.",
    "Its atmosphere is mostly hydrogen and helium."
  ],

  andromeda: [
    "Andromeda is the nearest large spiral galaxy to the Milky Way.",
    "It belongs to the Local Group.",
    "It is expected to interact strongly with the Milky Way in the distant future."
  ]

};


function renderCuriosities(
  key
) {

  if (
    curiositiesContainer
  ) {

    curiositiesContainer.innerHTML =
      "";

    const list =
      curiosityData[key] ||
      [
        "Astronomical observations continue to reveal new details about this object."
      ];

    list.forEach(
      text => {

        const item =
          document.createElement(
            "div"
          );

        item.className =
          "curiosity-item";

        item.textContent =
          "• " +
          text;

        curiositiesContainer.appendChild(
          item
        );

      }
    );

  }

}


/* =========================================================
   EXTEND OBJECT PANEL
   ========================================================= */

const previousPanelFunction =
  openObjectPanel;

openObjectPanel =
  function(
    key
  ) {

    previousPanelFunction(
      key
    );

    renderMissions(
      key
    );

    renderCuriosities(
      key
    );

    prepareObjectForPresentation(
      key
    );

  };


/* =========================================================
   PANEL ACTIONS
   ========================================================= */

if (
  missionTabButton
) {

  missionTabButton.addEventListener(
    "click",
    () => {

      if (
        selectedObjectKey
      ) {

        renderMissions(
          selectedObjectKey
        );

      }

    }
  );

}


if (
  curiosityTabButton
) {

  curiosityTabButton.addEventListener(
    "click",
    () => {

      if (
        selectedObjectKey
      ) {

        renderCuriosities(
          selectedObjectKey
        );

      }

    }
  );

}


/* =========================================================
   CAMERA HOME
   ========================================================= */

if (
  cameraHomeButton
) {

  cameraHomeButton.addEventListener(
    "click",
    () => {

      setCameraPreset(
        currentView ===
        "solar"
          ? "solar"
          : currentView ===
            "galaxy"
              ? "galaxy"
              : "universe"
      );

      showToast(
        "CAMERA RESET"
      );

    }
  );

}


/* =========================================================
   CAMERA ZOOM BUTTONS
   ========================================================= */

function cameraZoom(
  factor
) {

  if (
    !camera ||
    !controls
  ) {
    return;
  }

  const direction =
    camera.position
      .clone()
      .sub(
        controls.target
      )
      .normalize();

  const distance =
    camera.position.distanceTo(
      controls.target
    );

  const nextDistance =
    Math.max(
      0.5,
      Math.min(
        1000000000,
        distance *
        factor
      )
    );

  camera.position.copy(
    controls.target
      .clone()
      .add(
        direction.multiplyScalar(
          nextDistance
        )
      )
  );

}


if (
  zoomInButton
) {

  zoomInButton.addEventListener(
    "click",
    () => {

      cameraZoom(
        0.82
      );

    }
  );

}


if (
  zoomOutButton
) {

  zoomOutButton.addEventListener(
    "click",
    () => {

      cameraZoom(
        1.22
      );

    }
  );

}


/* =========================================================
   PANELS
   ========================================================= */

document
  .querySelectorAll(
    "[data-close-panel]"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          const selector =
            button.dataset.closePanel;

          const panel =
            document.querySelector(
              selector
            );

          if (
            panel
          ) {

            panel.classList.remove(
              "open"
            );

          }

        }
      );

    }
  );


/* =========================================================
   RESPONSIVE CAMERA
   ========================================================= */

function updateCameraAspect() {

  if (
    !camera ||
    !renderer
  ) {
    return;
  }

  const width =
    Math.max(
      1,
      window.innerWidth
    );

  const height =
    Math.max(
      1,
      window.innerHeight
    );

  camera.aspect =
    width /
    height;

  camera.updateProjectionMatrix();

  renderer.setSize(
    width,
    height,
    false
  );

}


window.addEventListener(
  "resize",
  updateCameraAspect
);


/* =========================================================
   SAFE INITIALIZATION
   ========================================================= */

function initializeUniverseExplorer() {

  try {

    registerAllObjects();

    rebuildSearchIndex();

    updateCameraAspect();

    setPerformanceMode(
      performanceMode
    );

    setLabelsVisible(
      labelsVisible
    );

    setOrbitsVisible(
      orbitsVisible
    );

    setStarsVisible(
      starsVisible
    );

    updateNavigationStatus();

    updateBreadcrumb(
      null
    );

    updateInterfaceClock();

    updateSimulationStatus();

    finishLoading();

  } catch (
    error
  ) {

    console.error(
      error
    );

    if (
      loadingText
    ) {

      loadingText.textContent =
        "INITIALIZATION ERROR";

    }

  }

}


/* =========================================================
   LOADING FALLBACK
   ========================================================= */

setTimeout(
  () => {

    if (
      !universeReady
    ) {

      finishLoading();

    }

  },
  2500
);


/* =========================================================
   FINAL START
   ========================================================= */

initializeUniverseExplorer();


/* =========================================================
   FINAL RENDER SAFETY
   ========================================================= */

if (
  !animationFrameId
) {

  startUniverseAnimation();

}


/* =========================================================
   UNIVERSE READY MESSAGE
   ========================================================= */

setTimeout(
  () => {

    if (
      universeReady
    ) {

      showToast(
        "UNIVERSE ONLINE"
      );

    }

  },
  600
);


/* =========================================================
   GLOBAL ERROR RECOVERY
   ========================================================= */

window.addEventListener(
  "error",
  event => {

    console.error(
      "Universe Explorer error:",
      event.error ||
      event.message
    );

  }
);


/* =========================================================
   FINAL STATE
   ========================================================= */

currentMode =
  "explore";

currentView =
  "universe";

currentSection =
  "home";

simulationPaused =
  false;

simulationSpeed =
  DEFAULT_SIMULATION_SPEED;

labelsVisible =
  true;

orbitsVisible =
  true;

starsVisible =
  true;


/* =========================================================
   UNIVERSE EXPLORER READY
   ========================================================= */

console.log(
  "UNIVERSE EXPLORER READY"
);

console.log(
  "Objects:",
  Object.keys(
    OBJECTS
  ).length
);

console.log(
  "Search index:",
  universeSearchIndex.length
);
