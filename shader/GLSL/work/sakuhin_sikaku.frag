#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float GRID_SCALE = 1.;
const float LINE_SIZE = .1;

vec3 forward = vec3(0., 0., 1.);
vec3 up = vec3(0., 1., 0.);
vec3 pos = vec3(0.0, 0.1, -5.);
vec3 side = cross(forward, up);
vec3 L = normalize(vec3(0, 1, 0.3));

// レイマーチするライトベクトルをその都度rotateでは再現できなかったが、
// dfでrotate,
// 法線取った後にもう一度rotateするとうまくいった。法線前でもうまくいかない。
// ここを理解したい

float hash(float p) {
  p = fract(p * 0.011);
  p *= p + 7.5;
  p *= p + p;
  return fract(p);
}

float noise(vec3 x) {
  const vec3 step = vec3(110, 241, 171);

  vec3 i = floor(x);
  vec3 f = fract(x);
  float n = dot(i, step);

  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(n + dot(step, vec3(0, 0, 0))),
                     hash(n + dot(step, vec3(1, 0, 0))), u.x),
                 mix(hash(n + dot(step, vec3(0, 1, 0))),
                     hash(n + dot(step, vec3(1, 1, 0))), u.x),
                 u.y),
             mix(mix(hash(n + dot(step, vec3(0, 0, 1))),
                     hash(n + dot(step, vec3(1, 0, 1))), u.x),
                 mix(hash(n + dot(step, vec3(0, 1, 1))),
                     hash(n + dot(step, vec3(1, 1, 1))), u.x),
                 u.y),
             u.z);
}

// クォータニオンqでベクトルvを回転させる
vec3 mul(vec3 v, vec4 q) {
  return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}
// ベクトルvを指定した回転軸・回転角度で回転させる
void rotate(out vec3 v, vec3 axis, float angle) {
  vec4 q = vec4(axis.x * sin(angle / 2.0), axis.y * sin(angle / 2.0),
                axis.z * sin(angle / 2.0), cos(angle / 2.0));
  v = mul(v, q);
}

float df(vec3 p) {
  rotate(p, normalize(vec3(0.0, 1.0, 1.0)), radians(time * 60.0));
  vec3 center = vec3(0.0, 0.0, 0.0);
  vec3 size = vec3(2., 2.0, 2.);
  return max(
      distance(p.x, center.x) - size.x,
      max(distance(p.y, center.y) - size.y, distance(p.z, center.z) - size.z));
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
  for (int i = 0; i < 300; ++i) {
    now = pos + ray * len;
    min_dist = df(now);
    if (min_dist < 0.01)
      break;
    len += min_dist;
  }
}

void main() {
  vec2 p = (gl_FragCoord.xy * 2. - resolution) / resolution.y;
  vec3 ray = normalize(p.x * side + p.y * up + forward);

  float d, len;
  vec3 now;
  check(pos, ray, d, len, now);

  vec3 N = getNormal(now);
  rotate(now, normalize(vec3(0.0, .0, 1.0)), radians(time * 60.));
  float grid = max(step(mod(now.x, GRID_SCALE), LINE_SIZE),
                   step(mod(now.z, GRID_SCALE), LINE_SIZE));

  float ns = noise(now * 64.0);
  float s = 1.;
  float gloss = 44.0 + ns * 30.0;
  vec3 R = reflect(-L, N);

  vec3 V = -ray;
  vec3 H = normalize(V + L);
  float specular = ns * dot(L, N) + s * pow(clamp(dot(R, V), 0.0, 1.0), gloss);
  specular = clamp(specular, 0., 1.);
  gl_FragColor =
      vec4(mix(vec3(0.2, 0.2, 0.2), vec3(grid + specular), 1. - d), 1.0);
}