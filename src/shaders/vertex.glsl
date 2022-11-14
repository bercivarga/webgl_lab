precision mediump float;

float PI = 3.141592653589793238;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}