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

    pixelDensity = 100;

    setupDomEvents() {
        document.getElementById('range-input').addEventListener('change', (e) => {
            this.pixelDensity = e.target.value;
            this.shaderMaterial.uniforms.pixelDensity.value = this.pixelDensity;
        });
    }

    setupMouseEvents() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.prevX = this.mouse.x;
            this.mouse.prevY = this.mouse.y;
            this.mouse.x = (e.pageX / this.renderer.domElement.offsetWidth - 0.5) * 2;
            this.mouse.y = (e.pageY / this.renderer.domElement.offsetHeight - 0.5) * -2;
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
        const imageAspect = 1; // e.g. (1. / 1.5);
        let a1;
        let a2;

        const {clientWidth: width, clientHeight: height} = this.renderer.domElement;

        if (height / width > imageAspect) {
          a1 = (width / height) * imageAspect;
          a2 = 1;
        } else {
          a1 = 1;
          a2 = (height / width) / imageAspect;
        }

        const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
        const material = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: {
                resolution: { type: 'v4', value: new THREE.Vector4(width, height, a1, a2) },
                time: { type: 'f', value: 0 },
                // matcap: { type: 't', value: new THREE.TextureLoader().load(rainbowRipple) },
                mouse: { type: 'v2', value: new THREE.Vector2(0, 0) },
                image: { type: 't', value: new THREE.TextureLoader().load('spacefight.jpg') },
                pixelDensity: { type: 'f', value: this.pixelDensity }
            }
        });
        this.shaderMaterial = material;
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
    }

    render() {
        this.shaderMaterial.uniforms.time.value = this.clock.getElapsedTime();
        this.shaderMaterial.uniforms.mouse.value = new THREE.Vector2(this.mouse.x, this.mouse.y);
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }

    init() {
        this.setupMouseEvents();
        this.setupDomEvents();
        this.setupScene();
        this.setupResizeEvent();
        this.createShapes();
        this.render();
    }
}

export default new Sketch();