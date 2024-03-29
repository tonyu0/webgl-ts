#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define ITER 45
#define EPS 0.001
#define NEAR 0.
#define FAR 5.0

mat2 rotate(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, s, -s, c);
}
float cloverR(vec3 p) {
  return length((abs(p.xy * rotate(p.z * 3.)) + vec2(-.1, -.1))) - .2;
}
float twist(vec3 p, float r) {
  vec3 q = vec3(length(p.xz) - r, p.y, atan(p.x, p.z));
  return cloverR(q);
}
float map(vec3 p) {
  p.yz *= rotate(time * .7);
  p.xz *= rotate(time * .9);
  return twist(p, .75);
}

float trace(vec3 ro, vec3 rd, out float c, out vec3 n) {
  float t = NEAR, d;
  vec3 p;
  vec2 e = vec2(.1, -.1);
  for (int i = 0; i < ITER; i++) {
    p = ro + rd * t;
    d = map(p);
    if (abs(d) < EPS || t > FAR)
      break;
    t += step(d, 2.) * d * .5 + d * .1;
    c += 1.;
  }
  return min(t, FAR);
}

void main(void) {
  vec2 uv = (gl_FragCoord.xy - .5 * resolution.xy) / resolution.y;
  vec3 n;
  float c = 0., v = trace(vec3(0, 0, -1.9), vec3(uv, .6), c, n);
  c /= float(ITER);
  gl_FragColor = vec4(vec3(c, v / FAR, c), 1);
}