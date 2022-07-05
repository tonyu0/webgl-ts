#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform float time;

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
  // aは正規化されている必要があります。
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