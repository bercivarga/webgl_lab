float PI = 3.141592653589793238;
uniform float time;
uniform vec4 resolution;

uniform sampler2D uDiffuse;
uniform vec4 uTint;


uniform vec4 color1;
uniform vec4 color2;

uniform vec2 mouse;

in vec2 vUv;

// create a function that creates particles at mouse position on an image
vec4 createParticles(vec2 uv, vec2 mouse, vec4 color1, vec4 color2) {
    // create a variable that stores the distance between the mouse and the uv
    float distance = length(uv - mouse);
    // create a variable that stores the color of the image
    vec4 imageColor = texture(uDiffuse, uv);
    // create a variable that stores the color of the image multiplied by the distance
    vec4 color = mix(color1, color2, distance) * imageColor;
    // return the color
    return color;
}


// draw a circle at mouse position
void main() {
    gl_FragColor = createParticles(vUv, mouse + 0.5, color1, color2);
}
