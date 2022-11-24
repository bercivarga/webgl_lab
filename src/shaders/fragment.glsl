float PI = 3.141592653589793238;
uniform float time;
uniform vec4 resolution;
uniform vec2 mouse;

in vec3 vNormal;

in vec2 vUv;

float remap(float value, float low1, float high1, float low2, float high2) {
    return low2 + (value - low1) * (high2 - low2) / (high1 - low1);
}

void main() {
    vec3 baseColor = vec3(0.5);
    vec3 lightning = vec3(0.0);

    vec3 ambient = vec3(0.1);

    vec3 normal = normalize(vNormal);

    lightning += ambient;

    vec3 skyColor = vec3(0.6, 0.3, 0.1);
    vec3 groundColor = vec3(0.0, 0.3, 0.6);
    float hemilight = dot(normal, vec3(0.0, 1.0, 0.0));
    vec3 hemiColor = mix(skyColor, groundColor, hemilight * 0.5 + 0.5);

    vec3 color = baseColor + lightning ;

    gl_FragColor = vec4(hemiColor, 1.0);
}
