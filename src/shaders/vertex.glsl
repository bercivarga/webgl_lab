precision mediump float;

float PI = 3.141592653589793238;

out vec2 vUv;

varying vec3 vNormal;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    vUv = uv;
    vNormal = (modelViewMatrix * vec4(normal, 0.0)).xyz;
}