import * as THREE from 'three';
import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';

class Sketch {
    scene;
    camera;
    renderer;

    shaderMaterial;

    clock = new THREE.Clock();

    mouse = {
        x: 0,
        y: 0,
        prevX: 0,
        prevY: 0,
        vX: 0,
        vY: 0
    }

    setupMouseEvents() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.prevX = this.mouse.x;
            this.mouse.prevY = this.mouse.y;
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.mouse.vX = this.mouse.x - this.mouse.prevX;
            this.mouse.vY = this.mouse.y - this.mouse.prevY;
        });
    }

    setupScene() {
        this.scene = new THREE.Scene();

        const frustumSize = 1;
        this.camera = new THREE.OrthographicCamera(
            frustumSize / -2,
            frustumSize / 2,
            frustumSize / 2,
            frustumSize / -2,
            -1000,
            1000
        );
        this.camera.position.z = 1;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.getElementById('canvas') });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.render();
    }

    setupResizeEvent() {
        window.addEventListener('resize', this.resize.bind(this));
    }

    createShapes() {
        const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
        const material = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
        });
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
        // requestAnimationFrame(this.render.bind(this));
    }

    init() {
        this.setupMouseEvents();
        this.setupScene();
        this.setupResizeEvent();
        this.createShapes();
        this.render();
    }
}

export default new Sketch();