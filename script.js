// Configuración inicial
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("canvas-container").appendChild(renderer.domElement);

// Controles de órbita (para zoom y rotación)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Posición inicial de la cámara
camera.position.z = 30;

// Iluminación
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Array de imágenes (cambia las rutas por las tuyas)
const images = [
    { path: "images/img1.jpg", title: "Imagen 1", desc: "Descripción 1" },
    { path: "images/img2.jpg", title: "Imagen 2", desc: "Descripción 2" },
    // Añade más imágenes...
];

const textures = [];
const materials = [];
const meshes = [];

// Carga las texturas y crea los planos
images.forEach((img, index) => {
    const texture = new THREE.TextureLoader().load(img.path);
    textures.push(texture);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    materials.push(material);
    const geometry = new THREE.PlaneGeometry(5, 5);
    const mesh = new THREE.Mesh(geometry, material);
    
    // Posición aleatoria inicial
    mesh.position.x = (Math.random() - 0.5) * 20;
    mesh.position.y = (Math.random() - 0.5) * 20;
    mesh.position.z = (Math.random() - 0.5) * 20;
    
    // Guardamos la referencia para animación
    mesh.userData = { title: img.title, desc: img.desc };
    meshes.push(mesh);
    scene.add(mesh);
});

// Animación de flotabilidad
function floatAnimation() {
    meshes.forEach(mesh => {
        mesh.rotation.x += 0.001;
        mesh.rotation.y += 0.002;
        mesh.position.y += Math.sin(Date.now() * 0.001) * 0.01;
    });
}

// Interacción con el ratón
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(meshes);
    
    if (intersects.length > 0) {
        const selected = intersects[0].object;
        const infoPanel = document.getElementById("info-panel");
        infoPanel.style.display = "block";
        document.getElementById("image-title").textContent = selected.userData.title;
        document.getElementById("image-desc").textContent = selected.userData.desc;
    }
});

// Botones de morfología
document.getElementById("cross-btn").addEventListener("click", () => {
    arrangeInCross();
});

document.getElementById("cloud-btn").addEventListener("click", () => {
    arrangeInCloud();
});

function arrangeInCross() {
    meshes.forEach((mesh, index) => {
        const row = Math.floor(index / 3) - 1;
        const col = (index % 3) - 1;
        mesh.position.x = col * 6;
        mesh.position.y = row * 6;
        mesh.position.z = 0;
    });
}

function arrangeInCloud() {
    meshes.forEach(mesh => {
        mesh.position.x = (Math.random() - 0.5) * 20;
        mesh.position.y = (Math.random() - 0.5) * 20;
        mesh.position.z = (Math.random() - 0.5) * 20;
    });
}

// Renderizado y animación
function animate() {
    requestAnimationFrame(animate);
    floatAnimation();
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Ajuste de tamaño en ventana
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});