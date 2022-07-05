
// wgld わからないやつ

// flower
//
float u = sin((atan(p.y, p.x) + time * 0.5) * 6.0);
float t = 0.01 / abs(u - length(p));

// wave ring
float u = sin((atan(p.y, p.x) * 20. + time * 10.)) * 0.01;
float t = 0.01 / abs(0.5 + u - length(p));

// flower
float u = abs(sin((atan(p.y, p.x) * 20. + time * 10.))) * 0.5;
float t = 0.01 / abs(0.25 + u - length(p));

// fan
float u = abs(sin((atan(p.y, p.x) * 10. - length(p) + time * 10.)) * 0.5) + 0.2;
float t = 0.01 / abs(u - length(p));

// ノイズ
// アルゴリズムがよくわからん。
// irndで、rndで生成した乱数をinterpolateで補間。
const int oct = 8;
const float per = 0.5;
const float PI = 3.1415926;
const float cCorners = 1.0 / 16.0;
const float cSides = 1.0 / 8.0;
const float cCenter = 1.0 / 4.0;

// 補間関数
float interpolate(float a, float b, float x) {
  float f = (1.0 - cos(x * PI)) * 0.5;
  return a * (1.0 - f) + b * f;
}

// 乱数生成
float rnd(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// 補間乱数
float irnd(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec4 v = vec4(rnd(vec2(i.x, i.y)), rnd(vec2(i.x + 1.0, i.y)),
                rnd(vec2(i.x, i.y + 1.0)), rnd(vec2(i.x + 1.0, i.y + 1.0)));
  return interpolate(interpolate(v.x, v.y, f.x), interpolate(v.z, v.w, f.x),
                     f.y);
}

// ノイズ生成
float noise(vec2 p) {
  float t = 0.0;
  for (int i = 0; i < oct; i++) {
    float freq = pow(2.0, float(i));
    float amp = pow(per, float(oct - i));
    t += irnd(vec2(p.x / freq, p.y / freq)) * amp;
  }
  return t;
}

// シームレスノイズ生成
float snoise(vec2 p, vec2 q, vec2 r) {
  return noise(vec2(p.x, p.y)) * q.x * q.y +
         noise(vec2(p.x, p.y + r.y)) * q.x * (1.0 - q.y) +
         noise(vec2(p.x + r.x, p.y)) * (1.0 - q.x) * q.y +
         noise(vec2(p.x + r.x, p.y + r.y)) * (1.0 - q.x) * (1.0 - q.y);
}
// 実行の仕方
void main() {
  // noise
  vec2 t = gl_FragCoord.xy + vec2(time * 10.0);
  float n = noise(t);

  // seamless noise シームレスなタイル状にする
  //	const float map = 256.0;
  //	vec2 t = mod(gl_FragCoord.xy + vec2(time * 10.0), map);
  //	float n = snoise(t, t / map, vec2(map));

  gl_FragColor = vec4(vec3(n), 1.0);
}
// 例とオブジェクトの交点のざひょうをとる
// そのまま行列で書けそう？
vec3 getNormal(vec3 p) {
  float d = 0.01;
  vec3 dx = vec3(d, .0, .0);
  vec3 dy = vec3(.0, d, .0);
  vec3 dz = vec3(.0, .0, d);
  return normalize(vec3(df(p + dx) - df(p - dx), df(p + dy) - df(p - dy),
                        df(p + dz) - df(p - dz)));
}

const float PI = 3.14159265;
const float angle = 90.0;
const float fov = angle * 0.5 * PI / 180.;
vec3 ray = normalize(vec3(p.x * sin(fov), p.y *sin(fov), -cos(fov)));

// distfunc1の結果とdistfunc2の結果をkで補間　kがデカいほどシャープに
// オブジェクトを合成するmin maxの代わりにこれを使ってレイを進めていくと、補間。
float smoothMin(float d1, float d2, float k) {
  float h = exp(-k * d1) + exp(-k * d2);
  return -log(h) / k;
}

// box distance function
// ざっくりとした考え方としてはレイの座標が一定以下の数値になるとき、
// max関数の効果で負の数値が 0.0 に丸められるため、distance function
// から返される値が 0.0 かそれに非常に近い数値になるということです。
float distFuncBox(vec3 p) {
  vec2 q = abs(p); //
  return length(max(q - vec3(2.0, 0.1, 0.5), 0.0)) - 0.1;
  //-0.1は角丸
  // 減産された幅分だけオブジェクトが膨らんだのと同じことになり、結果的に角が丸くなる。
  // 球の距離関数と同じ。
}

// torus distance function
float distFuncTorus(vec3 p) {
  vec2 t = vec2(1.5, 0.25); // t.x = 中心の半径、t.y = パイプの半径
  vec2 r = vec2(length(p.xy) - t.x, p.z); // p.xy -> p.xzで軸が変わる
  return length(r) - t.y;
}

// floor distance function
float distFuncFloor(vec3 p) {
  // この内積は、x, zに9をかけてフィルタしてるようなもの
  return dot(p, vec3(0.0, 1.0, 0.0)) + 1.0;
}

float distFuncCylinder(vec3 p, vec2 r) {
  vec2 d = abs(vec2(length(p.xy), p.z)) - r;
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - 0.1;
}

// transした立方体と、中央の球体でand演算してサッカーボールみたいなの角。

vec3 b = vec3(step(fract(rp.x), 0.5), step(fract(rp.y), 0.5),
              step(fract(rp.z), 0.5));
float grid = xor(xor(b.r, b.g), b.b);

vec3 twist(vec3 p, float power) {
  float s = sin(power * p.y);
  float c = cos(power * p.y);
  mat3 m = mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
  return m * p;
}

// light offset
vec3 light = normalize(lightDir + vec3(sin(time), 0.0, 0.0));
// ライトベクトルを操作して、ライトが動いているようにする
// 平行高原の場合。
// スポットライトとかは、ライトのベクトルだけでなく、ライトの場所、円錐とかもいる。
// このあと、ライトベクトルと交点の座標を使って影を判定

// hit check
vec3 color;
float shadow = 1.0;
if (abs(dist) < 0.001) {
  // generate normal
  vec3 normal = genNormal(dPos);

  // light
  vec3 halfLE = normalize(light - ray);
  float diff = clamp(dot(light, normal), 0.1, 1.0);
  float spec = pow(clamp(dot(halfLE, normal), 0.0, 1.0), 50.0);

  // generate shadow
  shadow = genShadow(dPos + normal * 0.001, light);
  // 微妙に法線方向にずらすのは、レイがめり込んでると
  // 自分自身を影判定してしまうから
  // でも複雑でない限り、レイの進め方的にめり込むことはなさそうだが・・・

  // generate tile pattern
  float u = 1.0 - floor(mod(dPos.x, 2.0));
  float v = 1.0 - floor(mod(dPos.z, 2.0));
  if ((u == 1.0 && v < 1.0) || (u < 1.0 && v == 1.0)) {
    diff *= 0.7;
  }
  float u = 1.0 - floor(mod(now.x, 2.0));
  float v = 1.0 - floor(mod(now.z, 2.0));
  if ((u == 1.0 && v == 0.) || (u == .0 && v == 1.0))
    NdotL *= 0.5;

  color = vec3(1.0, 1.0, 1.0) * diff + vec3(spec);
}
// ro = 交点, rd = ライトベクトル
// 平行高原ならいいけど、
// ポイントライトとかの場合、ライトより先にあるイブジェクトで
// 影を作らないように注意(無限に飛ばさない)
float genShadow(vec3 ro, vec3 rd) {
  float h = 0.0;
  float c = 0.001;
  float r = 1.0;
  float shadowCoef = 0.5;
  for (float t = 0.0; t < 50.0; t++) {
    h = distFunc(ro + rd * c);
    if (h < 0.001) {
      return shadowCoef;
    }
    // 距離に応じて影のかかり具合をぼかす
    // 16はぼかし具合の係数 デカいほど濃い
    r = min(r, h * 16.0 / c);
    c += h;
  }
  // soft shadow
  return 1.0 - shadowCoef + r * shadowCoef;
}

// かもそば氏のわからないやつ
// lenは最終的に伸ばしたレイの長さ、奥に向かってフェードアウトする。

// 空の色を作る？
#define SKY_COLOR vec3(86, 167, 200) / 255.0
#define SKY_COLOR2 vec3(87, 145, 201) / 255.0
#define SUN_COLOR vec3(245, 240, 232) / 255.0
#define WATER_COLOR vec3(38, 65, 139) / 255.0
#define SKY_HORIZON (SKY_COLOR + 0.15)

// 夕日？ 作り方の基準がわからん。
#define SKY_COLOR vec3(19, 27, 44) / 255.0
#define SUN_COLOR_1 vec3(246, 254, 207) / 255.0
#define SUN_COLOR_2 vec3(182, 149, 95) / 255.0
// #define SUN_COLOR_3 vec3(96, 57, 28) / 255.0
#define SUN_COLOR_3 vec3(105, 54, 25) / 255.0
#define SUN_COLOR_SCALE 4.0
#define SKY_COLOR_HORIZON_1 vec3(96, 57, 28) / 255.0
#define SKY_COLOR_HORIZON_2 vec3(105, 54, 25) / 255.0

#define WATER_BASE_COLOR vec3(15, 21, 21)
vec3 l = normalize(vec3(0, 0.25, 1.0)); // 光源への向きベクトル
void sky(vec2 p, vec3 rd, out vec3 skycolor) {
  vec3 light = normalize(vec3(0, -0.5, -1.0));
  float sundot = clamp(abs(dot(rd, light)), 0.0, 1.0);
  sundot = pow(sundot, 350.0) * 1.2 + pow(sundot, 2.0) * 0.6;
  skycolor = mix(SKY_COLOR, SKY_COLOR2, p.y);
  skycolor = mix(skycolor, SUN_COLOR, sundot);
}

vec3 renderSky(vec3 rd, vec3 l) {
  float sundot = clamp(dot(rd, l), 0.0, 1.0);

  vec3 sunGrad1 = pow(sundot, 350.0) * SUN_COLOR_1;
  vec3 sunGrad2 = pow(sundot, 15.0) * SUN_COLOR_2 * 0.7;
  vec3 sunGrad3 = pow(sundot, 4.0) * SUN_COLOR_3 * 0.7;

  return sunGrad1 + sunGrad2 + sunGrad3 + SKY_COLOR;
}
vec3 skyColor = renderSky(rd, l);
vec3 waterColor = +SKY_COLOR * a + SKY_COLOR * d * nDotL +
                  SUN_COLOR_2 * s * pow(nDotH, 50.0)   // Bling-Phonn
                  + SKY_COLOR_HORIZON_1 * nDotV * 4.0; // Specular (Phonn)
waterColor = mix(waterColor, skyColor, 0.45);

// smoothstep(4.0, 8.0, len) * smoothstep(20.0, 8.0, len);
// 距離に応じてfadeする？
float distance_fade =
    smoothstep(2.0, 80.0, t) +
    smoothstep(10.0, 5.0, t) * (0.2 + 0.04 * sin(time * 3.141592 / 2.0));
gl_FragColor = vec4(mix(waterColor, skycolor, distance_fade), 1);

float sdf_wave(vec3 p) {
  mat2 m2 = mat2(1.6, -1.2, 1.2, 1.6); // 2倍スケール + 回転行列
  float speed = 3.141592 / 2.0;
  float waveHeight = .5;

  float wave;
  for (int i = 0; i < 4; i++) {
    p.xz *= m2;
    wave += p.y - waveHeight * sin(p.x * 0.07 + p.z * 0.21 - time * speed);
    waveHeight *= 0.6;
  }
  // wave += 12.0;
  wave += noise(p) * 0.03;
  return wave;
}
// レイって勝手に透視投影になってる？
// が角はどう結びつく？
// 3次元空間でレイを飛ばしてるから、勝手に透視投影みたいになるね
// カメラとが角はどうなってる？
// カメラ位置　ピクセルから飛ばす方向を算出。
// カメラは画面の大きさを持った物体だとかんがえられる　？

// mandelbrot
// z_{n+1} = z_{n}^2 + C
// z_0 = 0

// マンデル風呂集合を平面に書いて回転させてみる。
// 平面: 距離関数? 平面のuv座標-> 取れればマンデル風呂集合をかく。
// 回転: クオータニオンの積？

float tri(float x) { return min(fract(x), 1. - fract(x)) * 4. - 1.; }

void main(void) {
  vec2 pos =
      (2. * gl_FragCoord.xy - resolution.xy) / min(resolution.x, resolution.y) +
      vec2(.0, .3);

  col = vec4(0.0);

  float x = tri(time * .1) * 2.6;
  vec2 s = 2. * pos - vec2(x, 1.5 * abs(sin(time * 2.0)));

  if (length(s) < .85) {
    col = vec4(1.0, .0, 0., .0);
    s = s * mat2(.96, -.28, .28, .96) / sqrt(1.65 - length(s.yx) * 1.5) +
        vec2(1. * x, 0.);
    if (fract(s.x * 1.2) < .5 ^ ^fract(s.y * 1.2) < 0.5)
      col += 1.1;
  }
  // gl_FragColor = col;
}

// 変態講師シェーダー？
float i, v;
vec3 c, p, q, s, u = ((FC.xy * 2. - r) / r.y).xyy;
s.z = 3.14;
p = s.xzx;
for (u.z = 1.; ++i < 80.; c += hsv(p.y, .2, 1. - v))
  p += u * (v = length(cross(q = cos(p + s * t), q.yzx))) * .4;
o = c.xyzz / i;

float i, l, d = 6.28;
vec3 p, v = vec3(0, 3, fract(t) * d);
for (; ++i < 99. && d > .01; l += d * .4)
  d = length(cross(
          p = cos(vec3(l * (FC.xy * 2. - r) / r.y, l) * rotate3D(2., v.xyx) +
                  v),
          p.zxy)) -
      .1;
v.z = cos(l);
p = ceil(sin(p * 20.)) / l;
o = (.05 + v.zxxx / i) * l + p.x + p.y - p.z;
o.b -= .1;

#define CAMERA_POS vec3(BOX_SIZE / 2.0, 0, 0)
#define CAMERA_SPEED 4.0
#define PI 3.141592
// フォグのZスケール
#define FOG_Z_SCALE 0.035
// Raymarchingの繰り返し数
#define MARCH_REPEAT 24
// 座標のリピート感覚
#define BOX_SIZE (32.0)
#define OBJ_SIZE 4.0
float sdf(vec3 p) {
  p.xy = mod(p.xy + BOX_SIZE / 2.0, BOX_SIZE) - BOX_SIZE / 2.0;
  float wave1 = pow(1.0 - abs(sin(p.z * 0.15)), 4.0);  // 緩やかなカーブ
  float wave2 = pow(1.0 - abs(sin(p.z * 0.15)), 14.0); // とがったカーブ
  return length(p.xy) - OBJ_SIZE * (1.0 + wave1 * 0.2 + wave2 * 0.06);
}
vec4 mult_qq(vec4 a, vec4 b) {
  return vec4(a.x * b.x - a.y * b.y - a.z * b.z - a.w * b.w,
              a.x * b.y + a.y * b.x + a.z * b.w - a.w * b.z,
              a.x * b.z - a.y * b.w + a.z * b.x + a.w * b.y,
              a.x * b.w + a.y * b.z - a.z * b.y + a.w * b.x);
}

// ベクトルとクォータニオンの積を計算
vec4 mult_vq(vec3 v, vec4 q) { return mult_qq(vec4(v, 1), q); }

// 軸aの周りで回転
vec3 rotate(vec3 p, vec3 a, float rad) {
  // 軸aの周りで回転するクォータニオン
  vec4 q1 = vec4(a.x * sin(rad), a.y * sin(rad), a.z * sin(rad), cos(rad));

  // 共役クォータニオン
  vec4 q2 = vec4(-q1.xyz, q1.w);

  return mult_qq(q1, mult_vq(p, q2)).xyz;
}

void main() {
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) /
           (max(resolution.x, resolution.y));
  p.x *= 1.2;

  float t1 = time * PI * 4.0;
  float t2 = time * PI / 24.0;

  vec3 cVel = normalize(vec3(1, 1, 1));
  vec3 cDir = normalize(vec3(1, 1, 1));             // カメラ向き
  vec3 cUp = normalize(cross(cDir, vec3(1, 0, 0))); // カメラ上方向ベクトル
  cUp = rotate(cUp, cVel, t2);

  vec3 cPos = CAMERA_POS + cVel * t1; // カメラ位置
  vec3 cSide = normalize(cross(cUp, cDir));
  vec3 rd = normalize(p.x * cSide + p.y * cUp + cDir);
  float t = 0.0;
  float isHit = 0.0;

  // raymarching
  for (int i = 0; i < MARCH_REPEAT; i++) {
    vec3 rp = cPos + rd * t;
    float d = sdf(rp);
    if (d < 0.0001) {
      isHit = 1.0;
      break;
    }
    t += d;
  }

  t = FOG_Z_SCALE * t;
  vec3 fogC = vec3(4, 45, 107) / 255.0 * 0.3; // fog color
  vec3 c = mix(fogC, vec3(1), exp(-t));       // bleng fog
  gl_FragColor = vec4(c, 1);
}

// 解説:
// 丸自体はどこかでみた。
// Aを増やすと波のまとまりの数が増える。
#define r resolution
#define t time
float R(float o) {
  vec2 p = (gl_FragCoord.xy - .5 * r) / r.y;
  float P = 4. * atan(1.), t = 2. * P * mod(t, 4.), A = 2. * atan(p.y, p.x);
  return .003 / abs(length(p) - .4 +
                    .03 * sin(-4. * A + t + o) *
                        (1. + cos(clamp(mod(A + P + t, 4. * P) - P, -P, P))));
}
void main() { gl_FragColor = vec4(R(0.), R(2.1), R(4.2), 1.); }

float x(float t) {
  vec2 p = 4. * (gl_FragCoord.xy - .5 * r) / min(r.x, r.y);
  float A = 1.25, a = mod(atan(p.y, p.x) + sin(3.14 * t), A), s = sin(a),
        c = cos(a), S = sin(A), C = cos(A),
        d = (S - C + 1.) / (c * S - s * C + s), z = length(p);
  return step(.95 * d, z) * (1. - step(d, z));
  // -> step(z,d)
}
void main() { o = vec4(x(t), x(t + .1), x(t + .2), 1); }

#define L(t) .45 * step(.5, fsnoise(Q + fsnoise(vec2(mod(floor(t), 4.)))))
vec2 q = gl_FragCoord.xy / vec2(32), Q = floor(q);
float t = 2. * t, T = fract(t);
gl_FragColor =
    vec4(step(length(fract(q) - vec2(.5)), mix(L(t), L(t + 1.), T *T)));

// https://twitter.com/catzpaw/status/1330578353997246465
float i, s = sin(t * .2);
vec2 p = (2. * FC.xy - r) / r.y * s;
for (; ++i < 9.; p.x = fract(p.x) - .5)
  p = p.yx * s / dot(p, p);
o -= p.y - .25;
o.x += p.x;