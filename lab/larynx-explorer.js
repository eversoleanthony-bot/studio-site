import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

/* ==================================================================
   LANDMARK DATA — one entry per named mesh in larynx-styled.glb.
   Colors are the sRGB equivalents of each material's Blender base
   color, so list swatches match what's rendered in the viewport.
   Descriptions are a first identification-level pass (structure and
   attachment facts only — muscle-action content is phase 3, deferred).
   Flag anything you want rewritten or fact-checked.
   ================================================================== */
const LANDMARK_DATA = {
  Cartilage_Thyroid: {
    name: "Thyroid Cartilage",
    category: "Cartilages",
    color: 0xC5BCF1,
    description: "The largest laryngeal cartilage. Its two laminae meet at the front to form the laryngeal prominence, shielding the vocal folds and anchoring the cricothyroid joint below.",
  },
  Cartilage_Cricoid: {
    name: "Cricoid Cartilage",
    category: "Cartilages",
    color: 0x80E8E2,
    description: "A complete ring of cartilage, the only one in the airway. Forms the structural base the entire larynx sits on, with a broad posterior plate carrying the arytenoids.",
  },
  Cartilage_Arytenoid_L: {
    name: "Arytenoid Cartilage (L)",
    category: "Cartilages",
    color: 0xFFB696,
    description: "One of a pyramid-shaped pair perched on the cricoid's posterior plate. Rotates and glides to open and close the glottis; the vocal ligament attaches at its vocal process.",
  },
  Cartilage_Arytenoid_R: {
    name: "Arytenoid Cartilage (R)",
    category: "Cartilages",
    color: 0xFFB696,
    description: "One of a pyramid-shaped pair perched on the cricoid's posterior plate. Rotates and glides to open and close the glottis; the vocal ligament attaches at its vocal process.",
  },
  Cartilage_Corniculate_L: {
    name: "Corniculate Cartilage (L)",
    category: "Cartilages",
    color: 0xFFE593,
    description: "A small nodule sitting atop the arytenoid, extending its height into the aryepiglottic fold.",
  },
  Cartilage_Corniculate_R: {
    name: "Corniculate Cartilage (R)",
    category: "Cartilages",
    color: 0xFFE593,
    description: "A small nodule sitting atop the arytenoid, extending its height into the aryepiglottic fold.",
  },
  Cartilage_Epiglottis: {
    name: "Epiglottis",
    category: "Cartilages",
    color: 0xFB9DCC,
    description: "A leaf-shaped elastic cartilage above the vocal folds. Folds backward during swallowing to divert food and liquid away from the airway.",
  },
  Bone_Hyoid: {
    name: "Hyoid Bone",
    category: "Bone",
    color: 0xFFF5DC,
    description: "A free-floating, U-shaped bone suspended by muscle beneath the tongue. Not part of the larynx itself, but the entire larynx hangs from it, so its position sets laryngeal height.",
  },
  Fold_Vocal_L: {
    name: "Vocal Fold (L)",
    category: "Vocal Folds",
    color: 0xF5698A,
    description: "A mucosal cover and vocal ligament overlying a muscular body, the thyroarytenoid, whose medial fibers form the vocalis. Contraction shortens and thickens the fold, lowering pitch and deepening the vibrating mass. Runs between the arytenoid vocal process and the inner angle of the thyroid cartilage.",
  },
  Fold_Vocal_R: {
    name: "Vocal Fold (R)",
    category: "Vocal Folds",
    color: 0xF5698A,
    description: "A mucosal cover and vocal ligament overlying a muscular body, the thyroarytenoid, whose medial fibers form the vocalis. Contraction shortens and thickens the fold, lowering pitch and deepening the vibrating mass. Runs between the arytenoid vocal process and the inner angle of the thyroid cartilage.",
  },
  Ligament_Vestibular_L: {
    name: "Vestibular Ligament (L)",
    category: "Ligaments & Membranes",
    color: 0xFFCFDB,
    description: "Core of the false vocal fold, sitting just above the true vocal fold. Can add supraglottic compression but doesn't normally vibrate in phonation.",
  },
  Ligament_Vestibular_R: {
    name: "Vestibular Ligament (R)",
    category: "Ligaments & Membranes",
    color: 0xFFCFDB,
    description: "Core of the false vocal fold, sitting just above the true vocal fold. Can add supraglottic compression but doesn't normally vibrate in phonation.",
  },
  Ligament_Thyrohyoid_L: {
    name: "Lateral Thyrohyoid Ligament (L)",
    category: "Ligaments & Membranes",
    color: 0xCFEDE4,
    description: "A thickened cord along the rear edge of the thyrohyoid membrane, connecting the tip of the thyroid cartilage's superior horn to the hyoid bone.",
  },
  Ligament_Thyrohyoid_R: {
    name: "Lateral Thyrohyoid Ligament (R)",
    category: "Ligaments & Membranes",
    color: 0xCFEDE4,
    description: "A thickened cord along the rear edge of the thyrohyoid membrane, connecting the tip of the thyroid cartilage's superior horn to the hyoid bone.",
  },
  Membrane_Thyrohyoid_L: {
    name: "Thyrohyoid Membrane (L)",
    category: "Ligaments & Membranes",
    color: 0xCFEDE4,
    description: "The broad connective-tissue sheet spanning between the thyroid cartilage and the hyoid bone, the main suspension for the larynx.",
  },
  Membrane_Thyrohyoid_R: {
    name: "Thyrohyoid Membrane (R)",
    category: "Ligaments & Membranes",
    color: 0xCFEDE4,
    description: "The broad connective-tissue sheet spanning between the thyroid cartilage and the hyoid bone, the main suspension for the larynx.",
  },
  Ligament_Cricothyroid_Median: {
    name: "Median Cricothyroid Ligament",
    category: "Ligaments & Membranes",
    color: 0xCFEDE4,
    description: "The midline band connecting the cricoid and thyroid cartilages anteriorly. This is the structure accessed in an emergency cricothyrotomy.",
  },
  Ligament_Thyroepiglottic: {
    name: "Thyroepiglottic Ligament",
    category: "Ligaments & Membranes",
    color: 0xCFEDE4,
    description: "Anchors the stalk of the epiglottis to the inside of the thyroid cartilage.",
  },
  Ligament_Hyoepiglottic: {
    name: "Hyoepiglottic Ligament",
    category: "Ligaments & Membranes",
    color: 0xCFEDE4,
    description: "Connects the front surface of the epiglottis to the hyoid bone, holding the epiglottis upright at rest.",
  },
  Trachea: {
    name: "Trachea",
    category: "Airway",
    color: 0xFEF6D4,
    description: "The cartilage-ringed airway continuing below the cricoid, carrying air to the bronchi and lungs.",
  },
};

const CATEGORY_ORDER = ["Cartilages", "Bone", "Vocal Folds", "Ligaments & Membranes", "Airway"];

/* Structures where the useful view is from the interior/posterior
   side rather than straight-on — matches the camera direction
   confirmed during the lighting pass in Blender. Vectors are in
   glTF (Y-up) space. Anything not listed uses the generic reframe. */
const VIEW_OVERRIDES = {
  // Folds are overhung by the arytenoids from behind, so a posterior view
  // is blocked. These come in from above tilted slightly posterior, which
  // threads the laryngeal inlet between the epiglottis (anterior) and the
  // arytenoids (posterior) — effectively the laryngoscopic view.
  Fold_Vocal_L: new THREE.Vector3(0.15, 0.94, -0.32),
  Fold_Vocal_R: new THREE.Vector3(-0.15, 0.94, -0.32),
  Cartilage_Arytenoid_L: new THREE.Vector3(0.267, 0.249, -0.931),
  Cartilage_Arytenoid_R: new THREE.Vector3(0.267, 0.249, -0.931),
  Cartilage_Corniculate_L: new THREE.Vector3(0.267, 0.249, -0.931),
  Cartilage_Corniculate_R: new THREE.Vector3(0.267, 0.249, -0.931),

  // Anterior midline structure sitting in the cricothyroid gap. Without an
  // override it inherits whatever direction the camera was already in, which
  // means flying to a point buried behind the whole larynx. 25 degrees below
  // horizontal, straight on, is both the clinically natural angle and the one
  // that exposes the most of it (measured by ray-cast sweep, see note below).
  Ligament_Cricothyroid_Median: new THREE.Vector3(0, -0.423, 0.906),

  // Attaches the epiglottic petiole to the inner thyroid, so it reads from
  // above and behind the epiglottis looking down onto the stalk. 25 degrees
  // above horizontal, just off midline. The thyroid still covers roughly
  // two thirds of it from here; that is the structure's real depth, not a
  // framing problem (a near-vertical view exposes more but flattens the
  // epiglottis relationship this angle is chosen to show).
  Ligament_Thyroepiglottic: new THREE.Vector3(0.079, 0.423, -0.903),
};

/* Where the camera aims, when the mesh's own bounding-box center is a poor
   target. The cricothyroid membrane runs up behind the thyroid lamina, so its
   bbox center is an interior point that no anterior view can see; aiming there
   frames a hidden spot. This is the centroid of the portion actually exposed
   in the cricothyroid gap. Anything not listed aims at its own bbox center. */
const TARGET_OVERRIDES = {
  Ligament_Cricothyroid_Median: new THREE.Vector3(-0.57, 38.24, 27.66),
  Ligament_Thyroepiglottic: new THREE.Vector3(-1.05, 51.35, 33.15),
};

let selected = null;
let ghostingEnabled = true;

/* Ghosting: when a landmark is selected, everything else drops to a low
   opacity so the selection reads through the cartilage framework. Several
   structures here (thyroepiglottic and median cricothyroid ligaments, the
   vestibular ligaments, and thyroarytenoid later) are 60-85% occluded from
   every camera angle, so framing alone can't expose them.

   Non-selected meshes all ghost to the same level rather than only the ones
   measured as occluding. Occluder sets change as you orbit, so a per-occluder
   version would pop structures in and out mid-drag; a uniform level stays
   quiet and is correct from any angle. Hovering a ghosted mesh lifts it back
   toward solid so the scene stays explorable while a selection is active. */
const GHOST_OPACITY = 0.2;
const GHOST_HOVER_OPACITY = 0.55;
const OPACITY_LERP = 0.12;
const OPAQUE_EPSILON = 0.995; // above this, treat as fully opaque and restore depth writing

/* ==================================================================
   SCENE SETUP
   ================================================================== */
const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1c1b1a);

const camera = new THREE.PerspectiveCamera(42, 1, 0.01, 10000);
camera.position.set(50, 50, 100); // placeholder until the model loads and sets real framing
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.target.set(0, 0, 0);

const hemi = new THREE.HemisphereLight(0xfff2df, 0x2a2420, 0.9);
scene.add(hemi);
const key = new THREE.DirectionalLight(0xffffff, 1.6);
key.position.set(60, 90, 60);
scene.add(key);
const rim = new THREE.DirectionalLight(0xC3E8FF, 0.7);
rim.position.set(-70, 40, -60);
scene.add(rim);
const fillAmb = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(fillAmb);

function resize() {
  const w = canvas.clientWidth || window.innerWidth;
  const h = canvas.clientHeight || window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", resize);

/* ==================================================================
   MODEL LOADING
   ================================================================== */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://unpkg.com/three@0.169.0/examples/jsm/libs/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

const meshMap = {};
const pickables = [];
let overviewCamPos = null;
let overviewTarget = null;
let modelRadius = null; // whole-model radius, used to floor fly-in distance so small parts keep surrounding context

const loadingNote = document.getElementById("loading-note");

gltfLoader.load(
  "./larynx-styled.glb",
  (gltf) => {
    const root = gltf.scene;
    scene.add(root);

    root.traverse((obj) => {
      if (!obj.isMesh) return;
      let key2 = obj.name;
      if (!LANDMARK_DATA[key2] && obj.parent && LANDMARK_DATA[obj.parent.name]) {
        key2 = obj.parent.name; // defensive: handles either flat or one-level-wrapped export hierarchy
      }
      if (!LANDMARK_DATA[key2]) return;

      obj.material = obj.material.clone(); // per-object material so hover/select glow never bleeds across shared-material siblings (e.g. the connective-tissue group)
      obj.material.emissive = new THREE.Color(LANDMARK_DATA[key2].color);
      obj.material.emissiveIntensity = 0.04;
      obj.userData.landmarkKey = key2;
      obj.userData.opacity = 1;
      meshMap[key2] = obj;
      pickables.push(obj);
    });

    const box = new THREE.Box3().setFromObject(root);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const radius = size.length() * 0.5;
    modelRadius = radius;

    controls.minDistance = radius * 0.15;
    controls.maxDistance = radius * 5.5;
    camera.near = Math.max(radius * 0.005, 0.001);
    camera.far = radius * 20;
    camera.updateProjectionMatrix();

    const dir = new THREE.Vector3(0.55, 0.42, 0.72).normalize();
    overviewCamPos = center.clone().add(dir.multiplyScalar(radius * 2.9));
    overviewTarget = center.clone();

    camera.position.copy(overviewCamPos);
    controls.target.copy(overviewTarget);
    controls.update();

    buildLandmarkList();
    buildLandmarkSelect();
    loadingNote.style.display = "none";
    resize();
  },
  undefined,
  (err) => {
    loadingNote.textContent = "Failed to load model — check the browser console.";
    console.error(err);
  }
);

/* ==================================================================
   CAMERA FLIGHT — eased position/target interpolation, shared by
   landmark selection and the Overview button.
   ================================================================== */
let flight = null;

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function flyTo(toPos, toTarget, duration = 900) {
  flight = {
    fromPos: camera.position.clone(),
    toPos: toPos.clone(),
    fromTarget: controls.target.clone(),
    toTarget: toTarget.clone(),
    duration,
    start: performance.now(),
  };
  controls.enabled = false;
}

function updateFlight(now) {
  if (!flight) return;
  const t = Math.min((now - flight.start) / flight.duration, 1);
  const e = easeInOutCubic(t);
  camera.position.lerpVectors(flight.fromPos, flight.toPos, e);
  controls.target.lerpVectors(flight.fromTarget, flight.toTarget, e);
  if (t >= 1) {
    flight = null;
    controls.enabled = true;
  }
}

function focusOnLandmark(name) {
  const mesh = meshMap[name];
  if (!mesh) return;

  const box = new THREE.Box3().setFromObject(mesh);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const radius = Math.max(size.length() * 0.5, 1);

  // Two competing needs: big structures (thyroid, epiglottis) have to be
  // framed by their own size, while small ones (folds, corniculates) would
  // fill the screen and lose all surrounding context if framed that way.
  // The floor is tied to the whole-model radius rather than a fixed number,
  // so the framing stays proportional if the model's scale ever changes.
  const contextFloor = modelRadius ? modelRadius * 1.15 : 55;
  const distance = Math.max(radius * 4.2, contextFloor);

  const override = VIEW_OVERRIDES[name];
  const dir = override
    ? override.clone().normalize()
    : camera.position.clone().sub(controls.target).normalize();

  const focusPoint = TARGET_OVERRIDES[name] ? TARGET_OVERRIDES[name].clone() : center;
  const newCamPos = focusPoint.clone().add(dir.multiplyScalar(distance));
  flyTo(newCamPos, focusPoint, 900);
}

function goToOverview() {
  if (!overviewCamPos) return;
  flyTo(overviewCamPos, overviewTarget, 900);
  selected = null;
  syncListUI();
  syncCaption();
}

/* ==================================================================
   SELECTION — raycast picking and the list UI both funnel through
   this one function (same pattern as the muscle-picker prototype).
   ================================================================== */
function selectLandmark(name) {
  selected = name;
  focusOnLandmark(name);
  syncListUI();
  syncCaption();
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let hovered = null;

function setPointerFromEvent(e) {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
}

function pickAt(e) {
  setPointerFromEvent(e);
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(pickables, false);
  return hits.length ? hits[0].object : null;
}

canvas.addEventListener("pointermove", (e) => {
  hovered = pickAt(e);
  canvas.style.cursor = hovered ? "pointer" : "grab";
});

/* Selection fires on pointerUP, not pointerDOWN, and only when the
   gesture was a genuine single-finger tap: it didn't drift past
   TAP_MOVE_LIMIT (which would mean an orbit drag), and no second pointer
   ever joined it (which would mean a pinch/pan). Picking straight off
   pointerdown, the previous behavior, fired on the very first finger of
   a two-finger pinch, hijacking the gesture into a landmark fly-to
   instead of letting OrbitControls treat it as a zoom. */
const TAP_MOVE_LIMIT = 8; // px
const activePointers = new Map(); // pointerId -> {x, y} at pointerdown
let multiTouchActive = false;

canvas.addEventListener("pointerdown", (e) => {
  activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (activePointers.size > 1) multiTouchActive = true;
});

canvas.addEventListener("pointerup", (e) => {
  const start = activePointers.get(e.pointerId);
  activePointers.delete(e.pointerId);
  const wasMultiTouch = multiTouchActive;
  if (activePointers.size === 0) multiTouchActive = false;

  if (!start || wasMultiTouch) return;
  const dx = e.clientX - start.x;
  const dy = e.clientY - start.y;
  if (Math.hypot(dx, dy) > TAP_MOVE_LIMIT) return;

  const hit = pickAt(e);
  if (hit) selectLandmark(hit.userData.landmarkKey);
});

canvas.addEventListener("pointercancel", (e) => {
  activePointers.delete(e.pointerId);
  if (activePointers.size === 0) multiTouchActive = false;
});

/* ==================================================================
   LANDMARK LIST — grouped by category, built once the model (and
   therefore LANDMARK_DATA's matching meshes) has actually loaded.
   ================================================================== */
const listEl = document.getElementById("landmark-list");
const listButtons = {};

function buildLandmarkList() {
  CATEGORY_ORDER.forEach((cat) => {
    const header = document.createElement("div");
    header.className = "panel-category-label";
    header.textContent = cat;
    listEl.appendChild(header);

    Object.entries(LANDMARK_DATA)
      .filter(([, data]) => data.category === cat)
      .forEach(([key3, data]) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "landmark-btn";
        btn.style.setProperty("--swatch", `#${data.color.toString(16).padStart(6, "0")}`);
        btn.innerHTML = `<span class="landmark-swatch"></span><span class="landmark-btn-name">${data.name}</span>`;
        btn.addEventListener("click", () => selectLandmark(key3));
        listEl.appendChild(btn);
        listButtons[key3] = btn;
      });
  });
}

/* Mobile/touch equivalent of the button list above: a native <select>,
   grouped the same way by CATEGORY_ORDER via <optgroup>, since a picker
   is the one control that stays a fixed, small height no matter how many
   landmarks there are or how long their names run. */
const landmarkSelect = document.getElementById("landmark-select");

function buildLandmarkSelect() {
  CATEGORY_ORDER.forEach((cat) => {
    const group = document.createElement("optgroup");
    group.label = cat;

    Object.entries(LANDMARK_DATA)
      .filter(([, data]) => data.category === cat)
      .forEach(([key3, data]) => {
        const opt = document.createElement("option");
        opt.value = key3;
        opt.textContent = data.name;
        group.appendChild(opt);
      });

    landmarkSelect.appendChild(group);
  });
}

landmarkSelect.addEventListener("change", () => {
  if (landmarkSelect.value) selectLandmark(landmarkSelect.value);
});

document.getElementById("overview-btn").addEventListener("click", goToOverview);

const ghostBtn = document.getElementById("ghost-btn");
ghostBtn.addEventListener("click", () => {
  ghostingEnabled = !ghostingEnabled;
  ghostBtn.textContent = ghostingEnabled ? "Ghosting \u00B7 On" : "Ghosting \u00B7 Off";
  ghostBtn.classList.toggle("is-on", ghostingEnabled);
});

function syncListUI() {
  Object.entries(listButtons).forEach(([key4, btn]) => {
    btn.classList.toggle("active", key4 === selected);
  });
  landmarkSelect.value = selected || "";
}

/* ==================================================================
   CAPTION CARD
   ================================================================== */
const captionCard = document.getElementById("caption-card");
const captionCategory = document.getElementById("caption-category");
const captionName = document.getElementById("caption-name");
const captionDescription = document.getElementById("caption-description");

function syncCaption() {
  if (!selected) {
    captionCard.classList.remove("visible");
    return;
  }
  const data = LANDMARK_DATA[selected];
  captionCard.style.setProperty("--swatch", `#${data.color.toString(16).padStart(6, "0")}`);
  captionCategory.textContent = data.category;
  captionName.textContent = data.name;
  captionDescription.textContent = data.description;
  captionCard.classList.add("visible");
}

/* ==================================================================
   RENDER LOOP
   ================================================================== */
function applyMaterialState() {
  pickables.forEach((mesh) => {
    const key5 = mesh.userData.landmarkKey;
    const isSelected = key5 === selected;
    const isHovered = mesh === hovered;

    const emTarget = 0.04 + (isSelected ? 0.5 : 0) + (isHovered ? 0.2 : 0);
    mesh.material.emissiveIntensity += (emTarget - mesh.material.emissiveIntensity) * 0.2;

    let opTarget = 1;
    if (ghostingEnabled && selected && !isSelected) {
      opTarget = isHovered ? GHOST_HOVER_OPACITY : GHOST_OPACITY;
    }

    const next = mesh.userData.opacity + (opTarget - mesh.userData.opacity) * OPACITY_LERP;
    mesh.userData.opacity = next;
    mesh.material.opacity = next;

    // Flipping `transparent` recompiles the shader program, so only touch it
    // on an actual state change rather than every frame. depthWrite goes off
    // while ghosted, otherwise ghosts punch holes in whatever sits behind them.
    const nowTransparent = next < OPAQUE_EPSILON;
    if (mesh.material.transparent !== nowTransparent) {
      mesh.material.transparent = nowTransparent;
      mesh.material.needsUpdate = true;
    }
    mesh.material.depthWrite = !nowTransparent;
  });
}

function tick(now) {
  updateFlight(now);
  applyMaterialState();
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

resize();
requestAnimationFrame(tick);
