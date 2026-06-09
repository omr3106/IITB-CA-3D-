import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const canvas = document.getElementById('bg');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.4, 7.8);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const ambient = new THREE.AmbientLight(0xffffff, 0.45);
const point = new THREE.PointLight(0xffdfb8, 0.9, 18);
point.position.set(3, 4, 4);
const point2 = new THREE.PointLight(0xbfd6ff, 0.7, 18);
point2.position.set(-4, -2, 2);
scene.add(ambient, point, point2);

const grid = new THREE.GridHelper(18, 18, 0xcfd7e4, 0xe5ebf7);
grid.material.opacity = 0.18;
grid.material.transparent = true;
scene.add(grid);

const group = new THREE.Group();
scene.add(group);

const geometry = new THREE.TorusGeometry(1.15, 0.22, 16, 120);
const ringMat = new THREE.MeshStandardMaterial({ color: 0xb7c7e1, emissive: 0x18253a, metalness: 0.25, roughness: 0.35 });
const ring = new THREE.Mesh(geometry, ringMat);
ring.position.set(0, 1.4, 0);
ring.rotation.x = 1.1;
ring.rotation.y = 0.4;

group.add(ring);

const boxGeo = new THREE.BoxGeometry(0.55, 0.55, 0.55);
const boxMat = new THREE.MeshStandardMaterial({ color: 0xb8c7e6, emissive: 0x1c2a3f, metalness: 0.18, roughness: 0.24 });
for (let i = 0; i < 9; i++) {
  const box = new THREE.Mesh(boxGeo, boxMat);
  box.position.set((i % 3 - 1) * 1.8, Math.floor(i / 3) * 1.1 - 0.6, -2 + (i % 4) * 0.6);
  box.rotation.set(0.4, 0.6, 0.1);
  group.add(box);
}

const particles = new THREE.BufferGeometry();
const count = 180;
const pos = new Float32Array(count * 3);
for (let i = 0; i < count; i++) {
  pos[i * 3] = (Math.random() - 0.5) * 14;
  pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
  pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
}
particles.setAttribute('position', new THREE.BufferAttribute(pos, 3));
const particleMat = new THREE.PointsMaterial({ color: 0x95a9c5, size: 0.025, transparent: true, opacity: 0.55 });
const particleField = new THREE.Points(particles, particleMat);
scene.add(particleField);

const mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', onResize);

const clock = new THREE.Clock();
function animate() {
  const t = clock.getElapsedTime();
  group.rotation.y = t * 0.18;
  ring.rotation.z = Math.sin(t * 0.7) * 0.12;
  ring.position.y = 1.4 + Math.sin(t * 1.2) * 0.1;
  particleField.rotation.y = t * 0.04;

  camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 0.45, 0.03);
  camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.4 + mouse.y * 0.35, 0.03);
  camera.lookAt(0, 0.4, 0);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

const timeLabel = document.getElementById('timeLabel');
const taskTime = document.getElementById('taskTime');
if (timeLabel || taskTime) {
  function updateClock() {
    const now = new Date();
    const text = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (timeLabel) timeLabel.textContent = text;
    if (taskTime) taskTime.textContent = text;
  }
  updateClock();
  setInterval(updateClock, 1000);
}

const themeBadge = document.getElementById('themeBadge');
const hero = document.querySelector('.hero-copy');
const cards = document.querySelectorAll('.window-card');

if (themeBadge && hero) {
  window.addEventListener('scroll', () => {
    const progress = Math.min(window.scrollY / 520, 1);
    hero.style.transform = `translateY(${progress * 10}px)`;
    themeBadge.textContent = progress > 0.35 ? 'Adaptive Mode: LIVE' : 'Adaptive Mode: FOCUS';
    cards.forEach((card, index) => {
      const offset = window.scrollY * 0.04 + index * 18;
      card.style.transform = `translateY(${Math.max(0, offset - 80)}px)`;
    });
  });
}

const appNotes = document.getElementById('appNotes');
const launchBtn = document.getElementById('launchBtn');
const windows = document.querySelectorAll('.window-card');
const startButton = document.getElementById('startButton');
const startMenu = document.getElementById('startMenu');

if (startButton && startMenu) {
  startButton.addEventListener('click', (event) => {
    event.preventDefault();
    startMenu.classList.toggle('open');
    startMenu.setAttribute('aria-hidden', String(!startMenu.classList.contains('open')));
  });

  document.addEventListener('click', (event) => {
    if (!startMenu.contains(event.target) && !startButton.contains(event.target)) {
      startMenu.classList.remove('open');
      startMenu.setAttribute('aria-hidden', 'true');
    }
  });
}

if (appNotes) {
  windows.forEach((item) => {
    item.addEventListener('click', () => {
      const label = item.querySelector('.tag').textContent;
      appNotes.textContent = `${label} section opened — IIT Bombay Techfest 2026 is ready to guide you through the festival.`;
      item.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.02)' }, { transform: 'scale(1)' }], { duration: 260 });
    });
  });
}

if (launchBtn && appNotes) {
  launchBtn.addEventListener('click', () => {
    appNotes.textContent = 'Festival overview loaded. Explore the schedule, exhibits, and campus highlights.';
  });
}
