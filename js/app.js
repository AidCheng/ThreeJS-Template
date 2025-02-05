import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

export default class sketch{
    constructor(options){
        this.container = options.dom;
        this.scene = new THREE.Scene();

        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.renderer = new THREE.WebGLRenderer({
            alpha: true
        });
        this.renderer.setSize(this.width, this.height);
        this.container.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(70, this.width/this.height, 0.01, 10);
        this.camera.position.z = 1;

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.time = 0;
        this.addObjects();
        this.setupResize();
        this.render();
    }

    setupResize(){
        window.addEventListener('resize', this.resize.bind(this));
    }

    resize(){
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;

        this.camera.updateProjectionMatrix();
    }

    addObjects(){
        this.geometry = new THREE.PlaneGeometry(1, 1, 50, 50);

        this.material = new THREE.MeshNormalMaterial();
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                time: {value: 0}
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            wireframe: true
        });

        this.mesh = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.mesh);
    }

    render(){
        this.time += 0.05;

        this.material.uniforms.time.value = this.time;

        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(this.render.bind(this));
    }
}

new sketch({
    dom: document.getElementById('container')
})