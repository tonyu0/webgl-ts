#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// 学び:
// 1. 屈折のさせ方
// 2. 色の作り方(各パーツ2色ずつ、mixで色を自然に変化させる)
// 3. xz平面上のsmoothstepでフェードアウトを表現
// 4.
// gridみたいなのの表現(今回はxz平面を衝突した立体に投影する感じ。)。modやfract
// + stepでグリッドを作る。
// 5. 複数dfを用いて屈折や反射の準備

#define PI 3.141592
const float LINE_SIZE = 0.03;
const float GRID_SCALE = 2.;
vec3 forward = normalize(vec3(0.0, sin(radians(-75.)), cos(radians(-75.))));
vec3 up = cross(vec3(-1., 0., 0.), forward);
vec3 pos = vec3(0.0, 20., 0.0);
vec3 side = cross(forward, up);
vec3 L = vec3(-0.5 + cos(time * 0.5), 0.7, 0.3 + sin(time));

float df_plane(vec3 p) { return p.y + 8.; }

float df(vec3 p) {
  float speed = 3.141592 / 2.0;
  float waveHeight = 1.;
  // ↓これを入れると円形っぽい波が消えてきれいに
  p.xz *= 0.5;

  float wave;
  for (int i = 0; i < 7; i++) {
    p.xz *= mat2(1.6, -1.2, 1.2, 1.6);
    wave += p.y - waveHeight * sin(p.x * 0.07 + p.z * 0.21 - time * speed);
    waveHeight *= 0.6;
  }
  wave += 12.0;
  // wave += noise(p) * 0.03;
  return wave;
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
  float move = 0.1; // 可変
  // 今回は200で届く。100だと波のピークだけ、みたいな表現。幾何で計算できる？
  for (int i = 0; i < 1000; ++i) {
    now = pos + ray * len;
    min_dist = df(now);
    if (min_dist < 0.01)
      break;
    len += move;
  }
}
void check2(in vec3 pos, in vec3 ray, out float min_dist, out float len,
            out vec3 now) {
  now = pos;
  min_dist = df_plane(now);
  len = 0.0;
  float move = .1; // 可変
  // 今回は200で届く。100だと波のピークだけ、みたいな表現。幾何で計算できる？
  for (int i = 0; i < 100; ++i) {
    now = pos + ray * len;
    min_dist = df_plane(now);
    if (min_dist < 0.01)
      break;
    len += move;
  }
}

#define WATER_COLOR_1 vec3(86, 181, 223) / 255.0
#define WATER_COLOR_2 vec3(3, 48, 149) / 255.0
#define PLANE_COLOR_1 vec3(65, 177, 192) / 255.0
#define PLANE_COLOR_2 vec3(3, 121, 163) / 255.0

void main() {
  vec2 p = (gl_FragCoord.xy * 2. - resolution) / resolution.y;

  vec3 ray = normalize(p.x * side + p.y * up + forward); // Rayの進行方向
  float d, len1, len2;
  vec3 now;
  check(pos, ray, d, len1, now);
  vec3 N = getNormal(now);
  float NdotL = dot(N, L);
  ray = refract(ray, N, .9);
  check2(now, ray, d, len2, now);
  float grid = max(step(mod(now.x, GRID_SCALE), LINE_SIZE),
                   step(mod(now.z, GRID_SCALE), LINE_SIZE));
  vec3 plane_color = mix(PLANE_COLOR_2, PLANE_COLOR_1, grid);
  vec3 surface = smoothstep(10.0, 30.0, len1) * WATER_COLOR_1 * 0.2;
  vec3 base = smoothstep(50.0, 20.0, length(now.xz)) * plane_color;
  gl_FragColor = vec4(surface + base, 1.0);
}