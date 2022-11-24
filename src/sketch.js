import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';
import catimage from "./textures/cat.png";

import left from './resources/Cold_Sunset__Cam_2_Left+X.png';
import right from './resources/Cold_Sunset__Cam_3_Right-X.png';
import top from './resources/Cold_Sunset__Cam_4_Up+Y.png';
import bottom from './resources/Cold_Sunset__Cam_5_Down-Y.png';
import back from './resources/Cold_Sunset__Cam_1_Back-Z.png';
import front from './resources/Cold_Sunset__Cam_0_Front+Z.png';

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
            this.mouse.x = (e.pageX / this.renderer.domElement.offsetWidth - 0.5) * 2;
            this.mouse.y = (e.pageY / this.renderer.domElement.offsetHeight - 0.5) * -2;
            this.mouse.vX = this.mouse.x - this.mouse.prevX;
            this.mouse.vY = this.mouse.y - this.mouse.prevY;
        });
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.getElementById('canvas') });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.camera.position.z = 1;

        const controls = new OrbitControls(this.camera, this.renderer.domElement);
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

    loadAssets() {
        const cubeTextureLoader = new THREE.CubeTextureLoader();
        this.scene.background = cubeTextureLoader.load([
            left,
            right,
            top,
            bottom,
            front,
            back,
        ]);

        const material = new THREE.ShaderMaterial({
            uniforms: {
                specMap: {type: 't', value: this.scene.background},
            },
            vertexShader: vertex,
            fragmentShader: fragment,
        });

        const glbLoader = new GLTFLoader();
        glbLoader.load("suzanne.glb", (gltf) => {
            gltf.scene.scale.set(0.1, 0.1, 0.1);
            gltf.scene.position.set(0, 0, 0);
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    child.material = material;
                }
            });
            this.scene.add(gltf.scene);
        });
    }

    async createShapes() {
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

        const texture = await new THREE.TextureLoader().load(catimage);
        texture.magFilter = THREE.NearestFilter;
        // texture.wrapS = THREE.RepeatWrapping;
        // texture.wrapT = THREE.RepeatWrapping;

        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: {
                resolution: { type: 'v4', value: new THREE.Vector4(width, height, a1, a2) },
                time: { type: 'f', value: 0 },
                // matcap: { type: 't', value: new THREE.TextureLoader().load(rainbowRipple) },
                mouse: { type: 'v2', value: new THREE.Vector2(0, 0) },
                color1: {type: "v4", value: new THREE.Vector4(1.0, 0.5, 1.0, 1.0)},
                color2: {type: "v4", value: new THREE.Vector4(1.0, 0.0, 0.5, 1.0)},
                uTexture: {type: 'sampler2D', value: texture},
                uTint: {type: "v4", value: new THREE.Vector4(1.0, 0.0, 0.0, 1.0)},
            }
        });

        this.shaderMaterial = material;
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
    }

    render() {
        // this.shaderMaterial.uniforms.time.value = this.clock.getElapsedTime();
        // this.shaderMaterial.uniforms.mouse.value = new THREE.Vector2(this.mouse.x, this.mouse.y);
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }

    async init() {
        this.setupMouseEvents();
        this.setupScene();
        this.setupResizeEvent();
        // await this.createShapes();
        this.loadAssets();
        this.render();
    }
}

export default new Sketch();