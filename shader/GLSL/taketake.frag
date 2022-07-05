#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform float time;

// Rayの繰り返しの距離
#define BOX_SIZE (16.0)

// オブジェクトの大きさ
#define OBJ_SIZE 1.8

// Raymarchingの繰り返し数
#define MARCH_REPEAT 24

// 露光
#define EXPOSURE 1.0

#define PI 3.141592

// random/hash function
float hash(float n) { return fract(cos(n) * 41415.92653); }

// 3d noise function
float noise(in vec3 x) {
  vec3 p = floor(x);
  vec3 f = smoothstep(0.0, 1.0, fract(x));
  float n = p.x + p.y * 57.0 + 113.0 * p.z;

  return mix(mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
                 mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
             mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
                 mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y),
             f.z);
}

// オブジェクトごとの座標空間にへ変換
vec3 toLocalSpace(vec3 p) {
  p.xz = mod(p.xz + BOX_SIZE / 2.0, BOX_SIZE) - BOX_SIZE / 2.0;
  return p;
}

float sdf(vec3 p) {
  p = toLocalSpace(p);
  float wave1 = pow(1.0 - abs(sin(p.y * 0.15)), 4.0);  // 緩やかなカーブ
  float wave2 = pow(1.0 - abs(sin(p.y * 0.15)), 14.0); // とがったカーブ
  return length(p.xz) - OBJ_SIZE * (1.0 + wave1 * 0.2 + wave2 * 0.06);
}

// 範囲[a, b] を 範囲[c, d]へ変換
float remap(float x, float a, float b, float c, float d) {
  return (x - a) / (b - a) * (d - c) + c;
}

// 二つのクォータニオン乗算
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
  // vec3 a = normalize(vec3(-0.5,1,0.3)); // 回転軸
  // float rad = time; // 軸周りの回転の量
  vec4 q1 = vec4(a.x * sin(rad), a.y * sin(rad), a.z * sin(rad), cos(rad));
  vec4 q2 = vec4(-q1.xyz, q1.w);

  return mult_qq(q1, mult_vq(p, q2)).xyz;
}

// レイマーチング
// cPos : カメラ位置
// rd : Rayの向き
// isHit : RayがオブジェクトにHitしたら1.0
// t : Rayが進んだ距離
// rp : 終了時のRay位置
void raymarch(vec3 cPos, vec3 rd, out float isHit, out float t, out vec3 rp) {
  for (int i = 0; i < MARCH_REPEAT; i++) {
    rp = cPos + rd * t;
    float d = sdf(rp);
    if (d < 0.0001) {
      isHit = 1.0;
      break;
    }
    t += d;
  }
}

// オブジェクトの法線
vec3 getNormal(vec3 p) {
  // pを変化させた時のSDFの変化を法線とみなす]
  float d = 0.001; // pの変化量
  return normalize(vec3(sdf(p + vec3(d, 0, 0)) - sdf(p - vec3(d, 0, 0)),
                        sdf(p + vec3(0, d, 0)) - sdf(p - vec3(0, d, 0)),
                        sdf(p + vec3(0, 0, d)) - sdf(p - vec3(0, 0, d))));
}
// The Phase Function(大気散乱)の計算
// https://developer.nvidia.com/gpugems/gpugems2/part-ii-shading-lighting-and-shadows/chapter-16-accurate-atmospheric-scattering
// vDotL : Rayと光線ベクトルの内積(cosΘ)
// g : 散乱の対称性
float phaseEquation(float vDotL, float g) {
  float g2 = g * g;
  return (3.0 * (1.0 - g2) * (1.0 - g) * (1.0 + vDotL * vDotL)) /
         pow(2.0 * (2.0 + g2) * (1.0 + g2 - 2.0 * g * vDotL), 1.5);
}

// The Phase Functionに露光の補正をかけたもの
float phaseEquationExp(float vDotL, float g) {
  return 1.0 - exp(-phaseEquation(vDotL, g) * EXPOSURE);
}

vec3 renderSky(vec3 v, vec3 l) {
#define SKY_COLOR vec3(4, 10, 20) / 255.0

  float vDotL = clamp(dot(v, l), 0.0, 1.0);

  vec3 moonColor =
      +phaseEquation(vDotL, 0.995) * vec3(255, 255, 245) / 255.0 * 0.7 +
      phaseEquationExp(vDotL, 0.85) * vec3(255, 250, 245) / 255.0 * 0.25 +
      phaseEquationExp(vDotL, 0.5) * vec3(255, 250, 245) / 255.0 * 0.2;
  return SKY_COLOR * 0.5 + moonColor;
}

void main() {
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) /
           (max(resolution.x, resolution.y));
  p.x *= 1.2;

  float t0 = time * 2.5;
  float t1 = t0 * PI * 4.0;
  float t2 = t0 * PI / 36.0;

  vec3 cVel = normalize(vec3(0, 0, 1));
  float cDirRad = radians(mix(18.0, 55.0, 0.5 + 0.5 * sin(t0 * PI / 6.0)));
  float cDirY = cos(cDirRad);
  vec3 cDir = normalize(vec3(0, sin(cDirRad), cos(cDirRad))); // カメラ向き
  vec3 cUp = normalize(cross(cDir, vec3(1, 0, 0))); // カメラ上方向ベクトル
  cUp = rotate(cUp, cVel,
               (0.8 * sin(t0) + 0.2 * sin(t0 * 3.1415 / 6.0)) * radians(4.0));
  vec3 cPos = vec3(BOX_SIZE / 2.0, 0, 0) + cVel * t1; // カメラ位置
  vec3 cSide = normalize(cross(cUp, cDir));

  vec3 rd = normalize(p.x * cSide + p.y * cUp + cDir);

  float z = 0.0;
  float isHit = 0.0;
  vec3 rp;
  cPos = toLocalSpace(cPos);
  raymarch(cPos, rd, isHit, z, rp);

  vec3 n = getNormal(rp);
  vec3 l = normalize(vec3(0.0, 1.0, 1.0)); // 光源への向きベクトル
  vec3 r = reflect(l, n);                  // 入射光の反射ベクトル

#define LIGHT_INTENSITY 0.07
#define LIGHT_COLOR vec3(230, 232, 233) / 255.0 * LIGHT_INTENSITY
#define BAMBOO_GREEN vec3(72, 110, 69) / 255.0

  // Phonnの反射モデル
  float ia = 0.0;     // ambientの強度
  float id = 1.0;     // diffuseの強度
  float is = 1.0;     // specularの強度
  float gloss = 50.0; // 光沢度

  float nDotL = clamp(dot(l, n), 0.0, 1.0);
  float vDotR = clamp(dot(rd, r), 0.0, 1.0);
  float vDotL = clamp(dot(rd, l), 0.0, 1.0);

  vec3 ca = LIGHT_COLOR * BAMBOO_GREEN * vec3(1, 1, 1) * ia;    // ambient color
  vec3 cd = LIGHT_COLOR * BAMBOO_GREEN * id * step(nDotL, 0.9); // diffuse color
  vec3 cs =
      LIGHT_COLOR * vec3(1, 1, 1) * is * pow(vDotR, gloss); // specular color
  vec3 c = ca + cd + cs;
  vec3 skyColor = renderSky(rd, l);

  z = 0.03 * z;
  c = mix(skyColor, c, exp(-z * z)); // fog

  gl_FragColor = vec4(c, 1);
}