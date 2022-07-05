#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

// 図形のくりぬきと影、波。波がバグってる

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 up = vec3(0.0, 1.0, 0.0);
vec3 dir = vec3(0.0, -.5, -1.0);
vec3 pos = vec3(0.0, 1.0, 2.0);
vec3 side = cross(dir, up);
vec3 L = vec3(-0.5 + cos(time * 0.5), 0.7, 0.3 + sin(time));

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

vec3 rotate(vec3 p, float angle, vec3 axis) {
  vec3 a = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  mat3 rotX = mat3(1., 0., 0., 0., c, -s, 0., s, c);
  mat3 rotY = mat3(c, 0., s, 0., 1., 0., -s, 0., c);
  mat3 rotZ = mat3(c, -s, 0., s, c, 0., 0., 0., 1.);

  return rotX * rotY * rotZ * p;
}

vec3 twist(vec3 p, float power) {
  float s = sin(power * p.y);
  float c = cos(power * p.y);
  mat3 m = mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
  return m * p;
}

float cube(vec3 p) {
  vec3 q = abs(p);
  return length(max(q - vec3(0.5, 0.5, 0.5), 0.0)) - 0.1;
}

float torus(vec3 p) {
  vec2 t = vec2(.8, 0.25);
  vec2 r = vec2(length(p.xy) - t.x, p.z);
  return length(r) - t.y;
}

float flo(vec3 p) {
  // wave
  float wave;
  float waveHeight = 2.0;
  float speed = 3.141592 / 2.0;

  for (int i = 0; i < 4; i++) {
    p.xz *= mat2(1.6, -1.2, 1.2, 1.6); // 2倍スケール + 回転行列
    wave += p.y - waveHeight * sin(p.x * 0.07 + p.z * 0.21 - time * speed);
    waveHeight *= 0.7;
  }
  wave += 12.0;

  return wave;
}

float df(vec3 p) {
  vec3 q = rotate(p, radians(time * 10.0), vec3(2.0, 1.0, 0.0));
  vec3 r = rotate(p, radians(time * 100.0), vec3(2.0, 1.0, 0.0));
  q = twist(q, 3.0);
  float d1 = cube(q);
  float d2 = torus(r);
  float d3 = flo(p);
  return min(d3, max(d1, -d2));
}

void check(in vec3 pos, in vec3 ray, out float min_dist, out float len,
           out vec3 now) {
  now = pos;
  min_dist = df(now);
  len = 0.0;
  for (int i = 0; i < 128; ++i) {
    now = pos + ray * len;
    min_dist = df(now);
    if (min_dist < 0.01)
      break;
    len += min_dist;
  }
}

vec3 getNormal(vec3 p) {
  float d = 0.01;
  vec3 dx = vec3(d, .0, .0);
  vec3 dy = vec3(.0, d, .0);
  vec3 dz = vec3(.0, .0, d);
  return normalize(vec3(df(p + dx) - df(p - dx), df(p + dy) - df(p - dy),
                        df(p + dz) - df(p - dz)));
}

float genShadow(vec3 ro, vec3 rd) {
  float h = 0.0;
  float c = 0.001;
  float r = 1.0;
  float shadowCoef = 0.5;
  for (float t = 0.0; t < 64.0; t++) {
    h = df(ro + rd * c);
    if (h < 0.001) {
      return shadowCoef;
    }
    r = min(r, h * 16.0 / c);
    c += h;
  }
  return 1.0 - shadowCoef + r * shadowCoef;
}

float lighting(vec3 N, vec3 L, vec3 V) {
  float gloss = 50.0;
  float d = 1.0;
  float s = 0.5;
  float a = 0.1;

  vec3 H = normalize(L + V);
  float NdotL = clamp(dot(N, L), 0., 1.);
  float NdotH = clamp(dot(N, H), 0., 1.);
  float result = a + d * NdotL + s * pow(NdotH, gloss);
  return result;
}

void main(void) {
  vec2 p = (gl_FragCoord.xy * 2. - resolution) / resolution.y;
  vec3 ray = normalize(up * p.y + side * p.x + dir);

  float d, len;
  vec3 now;
  check(pos, ray, d, len, now);
  if (d < 0.01) {

    vec3 N = getNormal(now);
    float res = lighting(N, L, -ray);
    vec3 col = vec3(.4, cos(noise(now)), sin(noise(now)));
    float u = 1.0 - floor(mod(now.x, 2.0));
    float v = 1.0 - floor(mod(now.z, 2.0));
    float tex = 1.0;
    if ((u == 1.0 && v < 1.0) || (u < 1.0 && v == 1.0)) {
      tex *= 0.6;
    }

    float shadow = genShadow(now + N * 0.01, L);

    gl_FragColor = vec4(vec3(col * res), 1.0) * shadow * tex;
  } else
    gl_FragColor = vec4(0.0);
}