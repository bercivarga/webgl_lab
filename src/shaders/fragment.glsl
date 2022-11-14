precision mediump float;

uniform vec4 resolution;

float PI = 3.141592653589793238;

float sdSphere( vec3 p, float r )
{
    return length(p)-r;
}

float sdf( vec3 p )
{
    float d = sdSphere( p, 0.1 );
    return d;
}

void main()	{
    vec2 newUV = gl_FragCoord.xy / resolution.xy;
    vec3 camPos = vec3(0.0, 0.0, 2.0);
    vec3 ray = normalize(vec3((newUV - vec2(0.5)) * resolution.zw, -1.0));

    vec3 rayPos = camPos;
    float t = 0.0;
    float tMax = 5.0;

    for (int i = 0; i < 256; i++) {
        vec3 pos = camPos + ray * t;
        float h = sdf(pos);

        if (h < 0.001 || t > tMax) break;

        t += h;
    }

    vec3 color = vec3(0.0, 0.0, 0.0);

    if (t < tMax) {
        color = vec3(1.0, 1.0, 1.0);
    }

    gl_FragColor = vec4(color, 1.0);
}