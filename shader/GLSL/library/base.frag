#ifdef GL_ES
precision mediump float;
#endif

// これをコピペして始める
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 forward = vec3(0., 0., -1.);
vec3 up = vec3(0., 1., 0.);
vec3 pos = vec3(0.0, 0.0, 3.0);
vec3 side = cross(forward, up);
vec3 L = vec3(-0.5 + cos(time * 0.5), 0.7, 0.3 + sin(time));

float df(vec3 p) { return length(p) - 1.; }

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
  float move = 0.1;
  for (int i = 0; i < 200; ++i) {
    now = pos + ray * len;
    min_dist = df(now);
    if (min_dist < 0.01)
      break;
    len += move;
  }
}

void main() {
  vec2 p = (gl_FragCoord.xy * 2. - resolution) / resolution.y;
  vec3 ray = normalize(p.x * side + p.y * up + forward);

  float d, len;
  vec3 now;
  check(pos, ray, d, len, now);
  if (d < 0.01) {
    vec3 N = getNormal(now);
    gl_FragColor = vec4(vec3(dot(N, L)), 1.0);
  }
}