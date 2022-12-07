precision mediump float;

uniform sampler2D image;
uniform float pixelDensity;
uniform vec2 mouse;
uniform float time;

in vec2 vUv;

float PI = 3.141592653589793238;

void main()	{
    vec4 imageBackground = texture2D(image, vUv);
    vec2 textUv = floor(vUv * pixelDensity) / pixelDensity;
    imageBackground = texture2D(image, textUv);

    vec2 mouseCoords = mouse + vec2(0.5, 0.5);

    float distToCenter = length(vUv - mouseCoords);
    float d = sin(distToCenter * 100.0 + time * 0.5) * 0.5 + 0.5;
    vec2 dir = normalize(vUv - mouseCoords);
    vec2 rippleCoords = vUv + dir * d * 0.02;

    imageBackground = texture2D(image, rippleCoords);

    gl_FragColor = imageBackground;
}