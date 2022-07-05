#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
#define M(n) mod(l.x, 3.) == n

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float map(vec3 p) { return length(p) - 1.; }
void main() {
  vec2 p = (gl_FragCoord.xy * 2. - resolution) / resolution.y,
       l = floor(1e2 * p);
  p = l / 1e2;
  vec3 d;
  float s = sin(2. * p.x + time * 2.), c = cos(4. * p.y + time),
        x = p.x * 1.5 * s;
  if (c > x && M(0.))
    d.r += 1.;
  if (c < x && M(2.))
    d.b += 1.;
  if (s > p.y * 1.5 * c && M(1.))
    d.g += 1.;
  gl_FragColor.rgb = d;
}

mat3 rotate(float angle, vec3 axis) {
  vec3 a = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  mat3 rotX = mat3(1., 0., 0., 0., c, -s, 0., s, c);
  mat3 rotY = mat3(c, 0., s, 0., 1., 0., -s, 0., c);
  mat3 rotZ = mat3(c, -s, 0., s, c, 0., 0., 0., 1.);
  return rotX * rotY * rotZ;
}

void main() {
  float ci, cj, l, d = 9.;
  vec3 p, q;
  for (float i = 0.; ++i < 20. && d > 1e-5; l += d) {
    ci += 1.;
    p = vec3(l * (gl_FragCoord.xy * 2. - resolution) / resolution.y, 5. - l) *
        rotate(time * 5., vec3(1, sin(time), 1));
    for (float j = 0.; j < 1.2; j += .2) {
      cj += 1.;
      d = min(d, length(vec3(length(p.xz) - 2. + j, p.y + j, 0) + j) - .3 - j);
    }
  }
  gl_FragColor += cos(p.xyzz) * 9. / i;
}