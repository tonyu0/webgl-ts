#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 forward = vec3(0., 0., 1.);
vec3 up = vec3(0., 1., 0.);
vec3 pos = vec3(0.0, 0.5, -5.0);
vec3 side = cross(forward, up);
vec3 L = vec3(-0.5 + cos(time * 0.5), 0.7, 0.3 + sin(time));

float df(vec3 p) {
  vec3 center = vec3(0.0, 0.0, 0.0); // 箱の位置
  vec3 size = vec3(2, 1.0, 2);       // 箱のサイズ
  return max(
      distance(p.x, center.x) - size.x,
      max(distance(p.y, center.y) - size.y, distance(p.z, center.z) - size.z));
}

// quaternion * quaternion
vec4 mul(vec4 a, vec4 b) {
  return vec4(a.x * b.x - a.y * b.y - a.z * b.z - a.w * b.w,
              a.x * b.y + a.y * b.x + a.z * b.w - a.w * b.z,
              a.x * b.z - a.y * b.w + a.z * b.x + a.w * b.y,
              a.x * b.w + a.y * b.z - a.z * b.y + a.w * b.x);
}
// vector * quaternion
vec4 mul(vec3 v, vec4 q) { return mul(vec4(v, 1), q); }

void rotate(out vec3 pos, vec3 axis, float angle) {
  vec4 q1 = vec4(axis.x * sin(angle), axis.y * sin(angle), axis.z * sin(angle),
                 cos(angle));
  vec4 q2 = vec4(-q1.xyz, q1.w);
  pos = mul(q1, mul(pos, q2)).xyz;
}

vec3 getNormal(vec3 p) {
  float d = 0.001;
  vec3 dx = vec3(d, .0, .0);
  vec3 dy = vec3(.0, d, .0);
  vec3 dz = vec3(.0, .0, d);
  return normalize(vec3(df(p + dx) - df(p - dx), df(p + dy) - df(p - dy),
                        df(p + dz) - df(p - dz)));
}

void check(in vec3 pos, in vec3 ray, out float min_dist, out float len,
           out vec3 now) {
  now = pos;
  min_dist = df(now);
  len = 0.0;
  for (int i = 0; i < 200; ++i) {
    now = pos + ray * len;
    rotate(now, normalize(vec3(0.3, 1.2, 0.5)), time * 3.14 / 12.);
    min_dist = df(now);
    if (min_dist < 0.01)
      break;
    len += min_dist;
  }
}
float xor (float a, float b) { return abs(a - b); }

    void main() {
  vec2 p = (gl_FragCoord.xy * 2. - resolution) / resolution.y;
  vec3 ray = normalize(p.x * side + p.y * up + forward);

  float d, len;
  vec3 now;
  check(pos, ray, d, len, now);
  vec3 N = getNormal(now);
  vec3 b = vec3(step(fract(now.x), 0.5), step(fract(now.y), 0.5),
                step(fract(now.z), 0.5));
  float grid = xor(xor(b.r, b.g), b.b);
  vec3 color = mix(vec3(0.2, 0.1, 0.3), vec3(grid), 1. - d);
  gl_FragColor = vec4(vec3(color * dot(N, L)), 1.0);
}