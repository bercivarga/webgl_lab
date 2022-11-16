precision mediump float;

uniform vec4 resolution;
uniform float time;
uniform sampler2D matcap;
uniform vec2 mouse;

float PI = 3.141592653589793238;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 getMatcap(vec3 eye, vec3 normal) {
    vec3 r = reflect(eye, normal);
    float m = 2.0 * sqrt(r.x*r.x + r.y*r.y + (r.z+1.0)*(r.z+1.0));
    return r.xy / m + 0.5;
}

float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

mat4 rotationMatrix( vec3 axis, float angle )
{
    axis = normalize( axis );
    float s = sin( angle );
    float c = cos( angle );
    float oc = 1.0 - c;

    return mat4( oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s, 0.0,
    oc * axis.x * axis.y + axis.z * s,   oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s, 0.0,
    oc * axis.z * axis.x - axis.y * s,   oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c,           0.0,
    0.0,                               0.0,                               0.0,                               1.0 );
}

vec3 rotate( vec3 v, vec3 axis, float angle )
{
    mat4 m = rotationMatrix( axis, angle );
    return ( m * vec4( v, 1.0 ) ).xyz;
}

float sdSphere( vec3 p, float r )
{
    return length(p)-r;
}

float sdBox( vec3 p, vec3 b )
{
    vec3 q = abs(p) - b;
    return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float sdf( vec3 p )
{
    vec3 p1 = rotate(p, vec3(1.0), time/5.0);
    float box = smin(sdBox( p1, vec3(0.3) ), sdSphere( p1, 0.2 ), 0.3);

    float realSphere = sdSphere( p1, 0.3 );
    float final = mix(box, realSphere, 0.2);

    for (float i = 0.0; i < 10.0; i++) {
        float randOffset = rand(vec2(i, 0.0));
        float prog = 1.0 - fract(time / 4.0 + randOffset);

        vec3 pos = vec3(sin(randOffset * 2.0 * PI), cos(randOffset * 2.0 * PI), 0.0) * 1.5;

        float goToCenter = sdSphere( p - pos*prog, 0.1 );
        final = smin(final, goToCenter, 0.3);
    }

    float mouseSphere = sdSphere( p - vec3(mouse * resolution.zw, 0.0), 0.1 );
    return smin(final, mouseSphere, 0.4);
}

vec3 getNormal(vec3 p) {
    float h = 0.001;
    vec3 n = vec3(
        sdf(p + vec3(h, 0, 0)) - sdf(p - vec3(h, 0, 0)),
        sdf(p + vec3(0, h, 0)) - sdf(p - vec3(0, h, 0)),
        sdf(p + vec3(0, 0, h)) - sdf(p - vec3(0, 0, h))
    );
    return normalize(n);
}

void main()	{
    vec2 newUV = gl_FragCoord.xy / resolution.xy;
    vec3 camPos = vec3(0.0, 0.0, 2.0);
    vec3 ray = normalize(vec3((newUV - vec2(0.5)) * resolution.zw, -1.));

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
        vec3 pos = camPos + ray * t;
        color = vec3(1.0, 1.0, 1.0);
        vec3 normal = getNormal(pos);
//        color = normal;
        float diff = dot(vec3(1.0, 1.0, 1.0), normal);
//        color *= diff;
        vec2 matcapUv = getMatcap(ray, normal);
        color = texture2D(matcap, matcapUv).rgb;

        float fresnel = pow(1.0 + dot(normal, ray), 3.0);
        color = mix(color, vec3(1.0, 1.0, 1.0), fresnel);
    }

    gl_FragColor = vec4(color, 1.0);
}