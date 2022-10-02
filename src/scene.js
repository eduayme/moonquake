import * as THREE from "three";
import { OrbitControls } from "./OrbitControls";

const textureURL = "assets/texture.jpeg";
const displacementURL = "assets/displacement.jpeg";
const universeURL = "assets/universe.jpeg";

var animationFrame = null;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
var renderer = new THREE.WebGLRenderer();
var controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;

renderer.setSize(window.innerWidth, window.innerHeight);

var geometry = new THREE.SphereGeometry(2, 60, 60);
var textureLoader = new THREE.TextureLoader();
var texture = textureLoader.load(textureURL);
var displacementMap = textureLoader.load(displacementURL);

var material = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  map: texture,
  displacementMap: displacementMap,
  displacementScale: 0.03,
  bumpMap: displacementMap,
  bumpScale: 0.04,
  reflectivity: 0,
  shininess: 0,
});

var moon = new THREE.Mesh(geometry, material);
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
var world = new THREE.Mesh(worldGeometry, worldMaterial);
scene.add(world);
scene.add(moon);

geometry = new THREE.SphereGeometry(1.5, 60, 60);
material = new THREE.MeshBasicMaterial({
  color: 0xFB5000,
  transparent: true,
  opacity: 0.25,
});

const loadData = () => {
  fetch('public/data.json')
  .then(response => response.json())
  .then(data => {
    const colors = [0xFB5000, 0x1DB3E6, 0x82B431, 0xC20100]
    data.forEach(point => {
      geometry = new THREE.SphereGeometry(0.05, 60, 60);
      material = new THREE.MeshBasicMaterial({
        color: colors[point.Class],
        transparent: false
      });
    var sphere = new THREE.Mesh(geometry,material)
      sphere.position.set(point.Y_coord * 100, point.X_coord * 100, point.Z_coord * 100);
      moon.add(sphere)
    })
  })
  .catch(error => console.log(error));
}

camera.position.z = 5;

const PI = Math.PI;
const RADIUS_X = 0.02;
const RADIUS_Y = 1.54;
moon.rotation.x = PI * RADIUS_X;
moon.rotation.y = PI * RADIUS_Y;

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

export const createScene = (el) => {
  loadData();
  renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el });
  resize();
  startAnimation();
};

export const animate = (rotate) => {
  rotate ? startAnimation() : pauseAnimation();
};

window.addEventListener("resize", resize);
