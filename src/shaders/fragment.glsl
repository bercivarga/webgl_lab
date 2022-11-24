float PI = 3.141592653589793238;
uniform float time;
uniform vec4 resolution;
uniform vec2 mouse;

uniform sampler2D uTexture;

in vec2 vUv;

// offset a texture by mouse position
vec4 offset(sampler2D tex, vec2 uv, vec2 offset) {
    return texture(tex, uv + offset);
}

float inverseLerp(float a, float b, float v) {
    return (v - a) / (b - a);
}

float remap(float a, float b, float c, float d, float v) {
    return inverseLerp(a, b, v) * (d - c) + c;
}

void main() {
    vec3 color = vec3(0.75);

    float t1 = sin((vUv.y * (1.0 - vUv.y) * 4.0) * 200.0 + time * 2.0) + 0.5;

    color = texture(uTexture, vUv - mouse).rgb * t1 / 1.5;

    gl_FragColor = vec4(color, 1.0);
}
