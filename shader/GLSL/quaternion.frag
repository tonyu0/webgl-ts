#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

precision highp float;
uniform float time;
uniform vec2 resolution;

#define BG_COLOR vec3(0.06)
#define WHITE vec3(1, 1, 1)
#define BLACK vec3(0.1, 0.1, 0.1)
#define PI 3.1415926535

// 二つのクォータニオン乗算
vec4 mult_qq(vec4 a, vec4 b) {
  return vec4(a.x * b.x - a.y * b.y - a.z * b.z - a.w * b.w,
              a.x * b.y + a.y * b.x + a.z * b.w - a.w * b.z,
              a.x * b.z - a.y * b.w + a.z * b.x + a.w * b.y,
              a.x * b.w + a.y * b.z - a.z * b.y + a.w * b.x);
}

// ベクトルとクォータニオンの積を計算
vec4 mult_vq(vec3 v, vec4 q) { return mult_qq(vec4(v, 1), q); }

vec3 rotate(vec3 p) {
  // 軸aの周りで回転するクォータニオン
  vec3 a = normalize(vec3(1, 0.25, 0.15)); // 回転軸
  // vec3 a = normalize(vec3(.5,0.2,1.3)); // 回転軸
  float rad = time * PI / 12.0; // 軸周りの回転の量
  // float rad = 12.3; // 軸周りの回転の量
  vec4 q1 = vec4(a.x * sin(rad), a.y * sin(rad), a.z * sin(rad), cos(rad));
  vec4 q2 = vec4(-q1.xyz, q1.w); // 共役クォータニオン
  p = mult_qq(q1, mult_vq(p, q2)).xyz;

  return p;
}

float sdf(vec3 p) {
  // 箱のSDF
  p = rotate(p);
  vec3 center = vec3(0.0, 0.0, 0.0); // 箱の位置
  vec3 size = vec3(2, 2.0, 2);       // 箱のサイズ
  return max(
      distance(p.x, center.x) - size.x,
      max(distance(p.y, center.y) - size.y, distance(p.z, center.z) - size.z));
}

float xor (float a, float b) { return abs(a - b); }


float getLightness(vec3 v, vec3 n, vec3 l) {
  vec3 r = reflect(v, n);
  float gloss = 1.0; // 光沢度
  float d = 1.0;     // 拡散反射の強度
  float s = 0.0;     // 鏡面反射の強度
  float a = 0.1;     // 環境光の反射強度

  // Phonnシェーディング
  float lightness = a + d * clamp(dot(l, n), 0.0, 1.0) +
                    s * pow(clamp(dot(v, r), 0.0, 1.0), gloss);
  return clamp(lightness, 0., 1.);
}

float renderLightness(vec2 p) {
  vec3 cPos = vec3(0, 1, -7);
  vec3 cDir = normalize(vec3(0, 0, 1)); // camera direction
  vec3 cUp = normalize(cross(cDir, vec3(1, 0, 0)));
  vec3 cSide = cross(cDir, cUp);
  vec3 l = normalize(vec3(0, 1, 0.1)); // 光源の向きベクトル

  float isHit = 0.0;
  float t = 0.0;
  vec3 rd = normalize(cDir + cSide * p.x + cUp * p.y); // ray direction
  vec3 rp;                                             // ray position
  raymarch(cPos, rd, isHit, rp);

  vec3 n = getNormal(rp);

  return getLightness(rd, n, l) * isHit;
}

void renderOne(vec3 cPos, vec3 rd, out vec3 boxColor, out float isHit) {
  vec3 l = normalize(vec3(0, 1, 0.1)); // 光源の向きベクトル
  vec3 rp;                             // ray hit position
  raymarch(cPos, rd, isHit, rp);

  vec3 n = getNormal(rp);
  rp = rotate(rp);

  vec3 b = vec3(step(fract(rp.x), 0.5), step(fract(rp.y), 0.5),
                step(fract(rp.z), 0.5));
  float grid = xor(xor(b.r, b.g), b.b);
  boxColor = vec3(grid);

  float lightness = getLightness(rd, n, l);
  boxColor = boxColor * lightness;
}

void main() {
  vec2 p =
      (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  vec3 cPos = vec3(0, 1, -7);
  vec3 cDir = normalize(vec3(0, 0, 1)); // camera direction
  vec3 cUp = normalize(cross(cDir, vec3(1, 0, 0)));
  vec3 cSide = cross(cDir, cUp);

  vec3 rd = normalize(cDir + cSide * p.x + cUp * p.y); // ray direction

  vec3 isHit;
  vec3 r, g, b;
  float diff = 0.04 * (0.5 + 0.5 * sin(time * PI));
  renderOne(cPos, normalize(rd + vec3(0, 0, 0)), r, isHit.r);
  renderOne(cPos, normalize(rd - vec3(diff, 0, 0)), g, isHit.g);
  renderOne(cPos, normalize(rd + vec3(diff, 0, 0)), b, isHit.b);
  vec3 col = vec3(r.r, g.g, b.b) * isHit;
  col.rgb = col.grb;

  gl_FragColor = vec4(col, 1);
}