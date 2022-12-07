precision mediump float;

uniform sampler2D image;
uniform vec2 mouse;
uniform float pixelDensity;

in vec2 vUv;

float PI = 3.141592653589793238;

void main()	{
    vec4 imageBackground = texture2D(image, vUv);
    vec2 textUv = floor(vUv * pixelDensity) / pixelDensity;
    imageBackground = texture2D(image, textUv);

    gl_FragColor = imageBackground;
}