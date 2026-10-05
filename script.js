const universe = document.getElementById("universe");

if (!universe || typeof THREE === "undefined") {
  throw new Error("Three.js o contenitore #universe non trovato.");
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x02040a);

const camera = new THREE.PerspectiveCamera(
  60,
  universe.clientWidth / Math.max(universe.clientHeight, 1),
  0.1,
  100000
);

camera.position.set(0, 12, 38);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
  universe.clientWidth,
  universe.clientHeight
);

universe.appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(
  0xffffff,
  0.35
);

scene.add(ambient);

const sunLight = new THREE.PointLight(
  0xffffff,
  3,
  0,
  2
);

scene.add(sunLight);

const root = new THREE.Group();

scene.add(root);

const objects = {};
const pivots = {};

const DATA = {

  Sun: {
    type: "Stella",
    distance: "0 UA",
    size: "1,39 milioni km",
    temp: "Circa 5.500 °C sulla superficie"
  },

  Mercury: {
    type: "Pianeta roccioso",
    distance: "57,9 milioni km dal Sole",
    size: "4.879 km",
    temp: "Circa 167 °C"
  },

  Venus: {
    type: "Pianeta roccioso",
    distance: "108,2 milioni km dal Sole",
    size: "12.104 km",
    temp: "Circa 464 °C"
  },

  Earth: {
    type: "Pianeta roccioso",
    distance: "149,6 milioni km dal Sole",
    size: "12.742 km",
    temp: "Circa 15 °C"
  },

  Moon: {
    type: "Satellite naturale",
    distance: "384.400 km dalla Terra",
    size: "3.475 km",
    temp: "Molto variabile"
  },

  Mars: {
    type: "Pianeta roccioso",
    distance: "227,9 milioni km dal Sole",
    size: "6.779 km",
    temp: "Circa -63 °C"
  },

  Jupiter: {
    type: "Gigante gassoso",
    distance: "778,5 milioni km dal Sole",
    size: "139.820 km",
    temp: "Circa -110 °C"
  },

  Saturn: {
    type: "Gigante gassoso",
    distance: "1,43 miliardi km dal Sole",
    size: "116.460 km",
    temp: "Circa -140 °C"
  },

  Uranus: {
    type: "Gigante ghiacciato",
    distance: "2,87 miliardi km dal Sole",
    size: "50.724 km",
    temp: "Circa -195 °C"
  },

  Neptune: {
    type: "Gigante ghiacciato",
    distance: "4,50 miliardi km dal Sole",
    size: "49.244 km",
    temp: "Circa -200 °C"
  },

  Pluto: {
    type: "Pianeta nano",
    distance: "Circa 5,9 miliardi km dal Sole",
    size: "2.377 km",
    temp: "Circa -230 °C"
  },

  "Sagittarius A*": {
    type: "Buco nero supermassiccio",
    distance: "Circa 26.700 anni luce",
    size: "Orizzonte degli eventi enorme",
    temp: "Ambiente estremamente energetico"
  },

  "Milky Way": {
    type: "Galassia a spirale barrata",
    distance: "Casa del Sistema Solare",
    size: "Circa 100.000 anni luce",
    temp: "Non applicabile"
  },

  "Andromeda Galaxy": {
    type: "Galassia a spirale",
    distance: "Circa 2,5 milioni di anni luce",
    size: "Circa 220.000 anni luce",
    temp: "Non applicabile"
  }

};

const planetSpecs = [

  ["Mercury", 1.2, 5.8, 0xaaa9a5, 0.020],

  ["Venus", 1.8, 7.2, 0xd7b47a, 0.015],

  ["Earth", 2.0, 10, 0x3d78d8, 0.012],

  ["Mars", 1.5, 13, 0xb85b3a, 0.010],

  ["Jupiter", 3.6, 17, 0xd4a06a, 0.006],

  ["Saturn", 3.0, 22, 0xd8c28d, 0.005],

  ["Uranus", 2.3, 27, 0x79c8d1, 0.004],

  ["Neptune", 2.3, 32, 0x466de0, 0.003],

  ["Pluto", 0.7, 37, 0xb7a58c, 0.002]

];

function sphere(
  name,
  radius,
  color,
  x,
  y = 0,
  z = 0
) {

  const material =
    new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.85,
      metalness: 0.05
    });

  const mesh =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        radius,
        48,
        48
      ),
      material
    );

  mesh.position.set(
    x,
    y,
    z
  );

  mesh.userData.objectKey = name;

  objects[name] = mesh;

  root.add(mesh);

  return mesh;
}

const sun =
  sphere(
    "Sun",
    3.4,
    0xffcc55,
    0
  );

sun.material.emissive =
  new THREE.Color(0xff8800);

sun.material.emissiveIntensity = 1.4;

sunLight.position.copy(
  sun.position
);
planetSpecs.forEach(
  ([name, radius, distance, color, speed]) => {

    const pivot =
      new THREE.Group();

    root.add(pivot);

    pivots[name] = pivot;

    const planet =
      sphere(
        name,
        radius,
        color,
        distance
      );

    pivot.add(planet);

    planet.position.set(
      distance,
      0,
      0
    );

    objects[name] = planet;

    const points = [];

    for (
      let i = 0;
      i <= 128;
      i++
    ) {

      const angle =
        i / 128 *
        Math.PI *
        2;

      points.push(
        new THREE.Vector3(
          Math.cos(angle) * distance,
          0,
          Math.sin(angle) * distance
        )
      );

    }

    const orbitGeometry =
      new THREE.BufferGeometry()
        .setFromPoints(points);

    const orbitMaterial =
      new THREE.LineBasicMaterial({
        color: 0x25445d,
        transparent: true,
        opacity: 0.5
      });

    const orbit =
      new THREE.LineLoop(
        orbitGeometry,
        orbitMaterial
      );

    root.add(orbit);

    if (name === "Saturn") {

      const ring =
        new THREE.Mesh(
          new THREE.RingGeometry(
            3.8,
            5.6,
            96
          ),

          new THREE.MeshBasicMaterial({
            color: 0xb9a77c,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7
          })
        );

      ring.rotation.x =
        Math.PI / 2.4;

      planet.add(ring);

    }

  }
);


/* LUNA */

const moonPivot =
  new THREE.Group();

objects.Earth.add(
  moonPivot
);

const moon =
  sphere(
    "Moon",
    0.55,
    0xbfc2c7,
    3.5
  );

moon.position.set(
  3.5,
  0,
  0
);

moonPivot.add(moon);


/* STELLE */

function createStarField() {

  const count = 5000;

  const positions =
    new Float32Array(
      count * 3
    );

  for (
    let i = 0;
    i < count;
    i++
  ) {

    const radius =
      180 +
      Math.random() * 700;

    const angle =
      Math.random() *
      Math.PI * 2;

    const vertical =
      (Math.random() - 0.5) *
      Math.PI;

    positions[i * 3] =
      Math.cos(angle) *
      Math.cos(vertical) *
      radius;

    positions[i * 3 + 1] =
      Math.sin(vertical) *
      radius;

    positions[i * 3 + 2] =
      Math.sin(angle) *
      Math.cos(vertical) *
      radius;

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
      size: 0.7
    });

  const stars =
    new THREE.Points(
      geometry,
      material
    );

  scene.add(stars);

}

createStarField();


/* GALASSIE */

const galaxyGroup =
  new THREE.Group();

scene.add(
  galaxyGroup
);


function makeGalaxy(
  name,
  color,
  position,
  scale
) {

  const galaxy =
    new THREE.Group();

  galaxy.position.copy(
    position
  );

  galaxy.scale.setScalar(
    scale
  );

  const count = 1600;

  const positions =
    new Float32Array(
      count * 3
    );

  for (
    let i = 0;
    i < count;
    i++
  ) {

    const radius =
      Math.pow(
        Math.random(),
        0.55
      ) * 35;

    const angle =
      Math.random() *
      Math.PI *
      2 +
      radius * 0.28;

    const arm =
      Math.random() < 0.5
        ? 0
        : Math.PI;

    positions[i * 3] =
      Math.cos(
        angle + arm
      ) * radius;

    positions[i * 3 + 1] =
      (Math.random() - 0.5) *
      (2.5 + radius * 0.04);

    positions[i * 3 + 2] =
      Math.sin(
        angle + arm
      ) * radius * 0.45;

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
      size: 0.22
    });

  const points =
    new THREE.Points(
      geometry,
      material
    );

  galaxy.add(points);

  galaxy.userData.objectKey =
    name;

  galaxyGroup.add(
    galaxy
  );

  objects[name] =
    galaxy;

  return galaxy;

}


makeGalaxy(
  "Milky Way",
  0x79a9ff,
  new THREE.Vector3(
    0,
    0,
    0
  ),
  1
);

makeGalaxy(
  "Andromeda Galaxy",
  0xd6b1ff,
  new THREE.Vector3(
    90,
    15,
    -40
  ),
  1.4
);


/* BUCO NERO */

const blackHole =
  new THREE.Group();

blackHole.position.set(
  -65,
  8,
  -35
);

blackHole.userData.objectKey =
  "Sagittarius A*";

const blackCore =
  new THREE.Mesh(
    new THREE.SphereGeometry(
      5,
      48,
      48
    ),

    new THREE.MeshBasicMaterial({
      color: 0x000000
    })
  );

blackHole.add(
  blackCore
);

const disk =
  new THREE.Mesh(
    new THREE.RingGeometry(
      7,
      15,
      128
    ),

    new THREE.MeshBasicMaterial({
      color: 0xff7a20,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65
    })
  );

disk.rotation.x =
  Math.PI / 2;

blackHole.add(
  disk
);

scene.add(
  blackHole
);

objects["Sagittarius A*"] =
  blackHole;


/* PANNELLO */

let selected = null;

function showObjectPanel(key) {

  const panel =
    document.getElementById(
      "object-panel"
    );

  if (
    !panel ||
    !DATA[key]
  ) {
    return;
  }

  const data =
    DATA[key];

  const name =
    document.getElementById(
      "object-name"
    );

  const type =
    document.getElementById(
      "object-type"
    );

  const content =
    document.getElementById(
      "panel-content"
    );

  if (name) {
    name.textContent =
      key;
  }

  if (type) {
    type.textContent =
      data.type;
  }

  if (content) {

    content.innerHTML = `
      <p><b>Distanza:</b> ${data.distance}</p>
      <p><b>Dimensioni:</b> ${data.size}</p>
      <p><b>Temperatura:</b> ${data.temp}</p>
    `;

  }

  panel.classList.add(
    "active"
  );

}
function focusObject(
  object,
  key
) {

  selected =
    object;

  showObjectPanel(
    key
  );

  const position =
    new THREE.Vector3();

  object.getWorldPosition(
    position
  );

  camera.position.set(
    position.x,
    position.y + 5,
    position.z + 15
  );

  camera.lookAt(
    position
  );

}


/* CLICK SUGLI OGGETTI */

const raycaster =
  new THREE.Raycaster();

const pointer =
  new THREE.Vector2();


renderer.domElement.addEventListener(
  "pointerdown",
  function(event) {

    const rect =
      renderer.domElement
        .getBoundingClientRect();

    pointer.x =
      (
        (event.clientX - rect.left) /
        rect.width
      ) * 2 - 1;

    pointer.y =
      -(
        (event.clientY - rect.top) /
        rect.height
      ) * 2 + 1;

    raycaster.setFromCamera(
      pointer,
      camera
    );

    const hits =
      raycaster.intersectObjects(
        Object.values(objects),
        true
      );

    if (!hits.length) {
      return;
    }

    let hit =
      hits[0].object;

    while (
      hit.parent &&
      !hit.userData.objectKey &&
      !hit.name
    ) {

      hit =
        hit.parent;

    }

    const key =
      hit.userData.objectKey ||
      hit.name;

    if (DATA[key]) {

      focusObject(
        hit,
        key
      );

    }

  }
);


/* MODALITÀ */

function showSolar() {

  root.visible =
    true;

  galaxyGroup.visible =
    false;

  blackHole.visible =
    false;

  camera.position.set(
    0,
    14,
    48
  );

  camera.lookAt(
    0,
    0,
    0
  );

}


function showGalaxies() {

  root.visible =
    false;

  galaxyGroup.visible =
    true;

  blackHole.visible =
    false;

  camera.position.set(
    0,
    45,
    145
  );

  camera.lookAt(
    0,
    0,
    0
  );

}


function showBlackHoles() {

  root.visible =
    false;

  galaxyGroup.visible =
    true;

  blackHole.visible =
    true;

  camera.position.set(
    -65,
    15,
    55
  );

  camera.lookAt(
    blackHole.position
  );

}


function resetCamera() {

  showSolar();

  const panel =
    document.getElementById(
      "object-panel"
    );

  if (panel) {

    panel.classList.remove(
      "active"
    );

  }

}


/* MENU */

document
  .querySelectorAll(
    "[data-action]"
  )
  .forEach(
    function(button) {

      button.addEventListener(
        "click",
        function() {

          const action =
            button.dataset.action;

          if (
            action === "solar"
          ) {

            showSolar();

          }

          if (
            action === "galaxies"
          ) {

            showGalaxies();

          }

          if (
            action === "blackholes"
          ) {

            showBlackHoles();

          }

          if (
            action === "reset"
          ) {

            resetCamera();

          }

          if (
            action === "compare"
          ) {

            const panel =
              document.getElementById(
                "compare-panel"
              );

            if (panel) {

              panel.classList.add(
                "active"
              );

            }

          }

          if (
            action === "time"
          ) {

            const panel =
              document.getElementById(
                "time-panel"
              );

            if (panel) {

              panel.classList.add(
                "active"
              );

            }

          }

        }
      );

    }
  );


/* ZOOM */

const zoomIn =
  document.getElementById(
    "zoom-in"
  );

if (zoomIn) {

  zoomIn.addEventListener(
    "click",
    function() {

      camera.position.multiplyScalar(
        0.8
      );

    }
  );

}


const zoomOut =
  document.getElementById(
    "zoom-out"
  );

if (zoomOut) {

  zoomOut.addEventListener(
    "click",
    function() {

      camera.position.multiplyScalar(
        1.25
      );

    }
  );

}


const resetButton =
  document.getElementById(
    "reset-camera"
  );

if (resetButton) {

  resetButton.addEventListener(
    "click",
    resetCamera
  );

}


/* CHIUDI PANNELLO */

const closePanel =
  document.getElementById(
    "close-panel"
  );

if (closePanel) {

  closePanel.addEventListener(
    "click",
    function() {

      const panel =
        document.getElementById(
          "object-panel"
        );

      if (panel) {

        panel.classList.remove(
          "active"
        );

      }

    }
  );

}


/* MENU MOBILE */

const menuButton =
  document.getElementById(
    "menuButton"
  );

if (menuButton) {

  menuButton.addEventListener(
    "click",
    function() {

      const menu =
        document.getElementById(
          "side-menu"
        );

      if (menu) {

        menu.classList.toggle(
          "active"
        );

      }

    }
  );

}


/* START */

const startButton =
  document.getElementById(
    "startButton"
  );

if (startButton) {

  startButton.addEventListener(
    "click",
    function() {

      const welcome =
        document.getElementById(
          "welcome"
        );

      if (welcome) {

        welcome.classList.add(
          "hidden"
        );

      }

      showSolar();

    }
  );

}


/* EXPLORE */

const exploreButton =
  document.getElementById(
    "exploreButton"
  );

if (exploreButton) {

  exploreButton.addEventListener(
    "click",
    function() {

      showSolar();

    }
  );

}


/* HOME */

const homeButton =
  document.getElementById(
    "homeButton"
  );

if (homeButton) {

  homeButton.addEventListener(
    "click",
    function() {

      const welcome =
        document.getElementById(
          "welcome"
        );

      if (welcome) {

        welcome.classList.remove(
          "hidden"
        );

      }

      resetCamera();

    }
  );

}
const search =
  document.getElementById(
    "search"
  );

if (search) {

  search.addEventListener(
    "keydown",
    function(event) {

      if (
        event.key !== "Enter"
      ) {
        return;
      }

      const query =
        search.value
          .trim()
          .toLowerCase();

      const key =
        Object.keys(DATA)
          .find(
            function(name) {

              return name
                .toLowerCase()
                .includes(query);

            }
          );

      if (
        key &&
        objects[key]
      ) {

        focusObject(
          objects[key],
          key
        );

      }

    }
  );

}


/* TIME TRAVEL */

const timeSlider =
  document.getElementById(
    "time-slider"
  );

if (timeSlider) {

  timeSlider.addEventListener(
    "input",
    function(event) {

      const value =
        Number(
          event.target.value
        );

      const label =
        document.getElementById(
          "time-value"
        );

      if (!label) {
        return;
      }

      if (value < 0) {

        label.textContent =
          Math.abs(value) +
          " miliardi di anni fa";

      } else {

        label.textContent =
          value +
          " miliardi di anni nel futuro";

      }

    }
  );

}


/* RIDIMENSIONAMENTO */

window.addEventListener(
  "resize",
  function() {

    const width =
      universe.clientWidth;

    const height =
      Math.max(
        universe.clientHeight,
        1
      );

    camera.aspect =
      width / height;

    camera.updateProjectionMatrix();

    renderer.setSize(
      width,
      height
    );

  }
);


/* ANIMAZIONE */

let lastTime =
  performance.now();


function animate(now) {

  requestAnimationFrame(
    animate
  );

  const delta =
    Math.min(
      (now - lastTime) / 1000,
      0.05
    );

  lastTime =
    now;


  planetSpecs.forEach(
    function(data) {

      const name =
        data[0];

      const speed =
        data[4];

      if (
        pivots[name]
      ) {

        pivots[name].rotation.y +=
          speed *
          delta *
          60;

      }

      if (
        objects[name]
      ) {

        objects[name].rotation.y +=
          0.01 *
          delta *
          60;

      }

    }
  );


  moonPivot.rotation.y +=
    0.35 *
    delta;

  moon.rotation.y +=
    0.003 *
    delta *
    60;

  disk.rotation.z +=
    0.7 *
    delta;

  galaxyGroup.rotation.y +=
    0.0005;


  renderer.render(
    scene,
    camera
  );

}


animate(
  performance.now()
);


/* FINE CARICAMENTO */

const loading =
  document.getElementById(
    "loading"
  );

if (loading) {

  loading.classList.add(
    "hidden"
  );

}
