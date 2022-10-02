import * as THREE from "three";
import { OrbitControls } from "./OrbitControls";

var cheeseMode;
var animationFrame = null;
var scene = null;
var camera = null;
var renderer = null;
var controls = null;
var moon = null;
var light = null;
var world = null;

const createMoon = () => {
  const textureURL = cheeseMode
    ? "assets/texture_cheese.jpg"
    : "assets/texture.jpeg";
  const displacementURL = cheeseMode
    ? "assets/displacement_cheese.png"
    : "assets/displacement.jpeg";
  const universeURL = "assets/universe.jpeg";

  animationFrame = null;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer();
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;

  renderer.setSize(window.innerWidth, window.innerHeight);

  var geometry = new THREE.SphereGeometry(2, 40, 40);
  var textureLoader = new THREE.TextureLoader();
  var texture = textureLoader.load(textureURL);
  var displacementMap = textureLoader.load(displacementURL);

  var material = new THREE.MeshPhongMaterial({
    color: cheeseMode ? 0xfad126 : 0xffffff,
    map: texture,
    displacementMap: displacementMap,
    displacementScale: cheeseMode ? 0.06 : 0.03,
    bumpMap: displacementMap,
    bumpScale: cheeseMode ? 0.08 : 0.04,
    reflectivity: 0,
    shininess: 0,
  });

  moon = new THREE.Mesh(geometry, material);
  moon.position.set(0, 0, 0);

  var light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(-100, 10, 50);
  scene.add(light);

  var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
  hemiLight.color.setHSL(0.6, 1, 0.6);
  hemiLight.groundColor.setHSL(0.095, 1, 0.75);
  hemiLight.position.set(0, 0, 0);
  scene.add(hemiLight);

  var worldTextureLoader = new THREE.TextureLoader();
  var worldTexture = worldTextureLoader.load(universeURL);
  var worldGeometry = new THREE.SphereGeometry(1000, 60, 60);
  var worldMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.BackSide,
    map: worldTexture,
    transparent: true,
  });
  world = new THREE.Mesh(worldGeometry, worldMaterial);
  scene.add(world);
  scene.add(moon);

  geometry = new THREE.SphereGeometry(1.5, 60, 60);
  material = new THREE.MeshBasicMaterial({
    color: 0xfb5000,
    transparent: true,
    opacity: 0.25,
  });

  camera.position.z = 5;

  const PI = Math.PI;
  const RADIUS_X = 0.02;
  const RADIUS_Y = 1.54;
  moon.rotation.x = PI * RADIUS_X;
  moon.rotation.y = PI * RADIUS_Y;
};

const loadData = (legendDisplay) => {
  fetch("public/data.json")
    .then((response) => response.json())
    .then((data) => {
      const colors = [0xfb5000, 0x1db3e6, 0x82b431, 0xc20100];
      const maxAmplitude = Math.max(...data.map(p => p.Amplitude));

      data.forEach(point => {
        if (legendDisplay.some(p => p == point.Class)) {
          var geometry = new THREE.SphereGeometry(0.05, 60, 60);
          var material = new THREE.MeshBasicMaterial({
            color: colors[point.Class],
            transparent: true,
            opacity: 0.6,
          });
          var center = new THREE.Mesh(geometry,material)
          center.position.set(point.X_coord * 100, point.Y_coord * 100, point.Z_coord * 100);
          moon.add(center)

          geometry = new THREE.SphereGeometry(Math.max(0.1, point.Amplitude/maxAmplitude), 60, 60);
          material = new THREE.MeshBasicMaterial({
            color: colors[point.Class],
            transparent: true,
            opacity: 0.2,
          });
          center = new THREE.Mesh(geometry,material)
          center.position.set(point.X_coord * 100, point.Y_coord * 100, point.Z_coord * 100);
          moon.add(center)
        }
      })
    })
    .catch((error) => console.log(error));
};

const startAnimation = () => {
  animationFrame = requestAnimationFrame(startAnimation);
  moon.rotation.y += 0.002;
  moon.rotation.x += 0.0001;
  world.rotation.y += 0.0001;
  world.rotation.x += 0.0005;
  renderer.render(scene, camera);
};

const pauseAnimation = () => {
  cancelAnimationFrame(animationFrame);
  animationFrame = null;
};

const resize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};

export const createScene = (el, cheese, legendDisplay) => {
  pauseAnimation();
  cheeseMode = cheese;
  createMoon();
  loadData(legendDisplay);
  renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el });
  resize();
  startAnimation();
};

export const animate = (rotate) => {
  rotate ? startAnimation() : pauseAnimation();
};

window.addEventListener("resize", resize);
