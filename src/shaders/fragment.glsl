precision mediump float;

uniform sampler2D image;
uniform float pixelDensity;
uniform float time;

in vec2 vUv;

float PI = 3.141592653589793238;

void main()	{
    vec4 imageBackground = texture2D(image, vUv);
    vec2 textUv = floor(vUv * pixelDensity) / pixelDensity;
    imageBackground = texture2D(image, textUv);

    float distToCenter = length(vUv - 0.5);
    float d = sin(distToCenter * 100.0 + time * 0.5) * 0.5 + 0.5;
    d = smoothstep(0.0, 0.1, d);
    imageBackground.rgb = vec3(0.0);
    imageBackground.rgb = mix(imageBackground.rgb, vec3(1.0, 0.0, 0.0), d);

    gl_FragColor = imageBackground;
}