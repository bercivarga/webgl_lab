import * as THREE from 'three';
import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';
import fairyMatcap from '../public/fairy.png';

class Sketch {
    scene;
    camera;
    renderer;

    shaderMaterial;

    clock = new THREE.Clock();

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

    createShapes() {
        const imageAspect = 1. / 1.;
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
                matcap: { type: 't', value: new THREE.TextureLoader().load(fairyMatcap) }
            }
        });

        this.shaderMaterial = material;

        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
    }

    render() {
        this.shaderMaterial.uniforms.time.value = this.clock.getElapsedTime();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }

    init() {
        this.setupScene();
        window.addEventListener('resize', this.resize.bind(this), false);
        this.createShapes()
        this.render();
    }
}

export default new Sketch();