////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// GPU Gems2 - Chapter 16. Accurate Atmospheric Scattering -
//
// https://developer.nvidia.com/gpugems/gpugems2/part-ii-shading-lighting-and-shadows/chapter-16-accurate-atmospheric-scattering
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
precision highp float;
uniform vec2 resolution;
uniform float time;

#define LIGHT_DIRECTION normalize(vec3(0, -0.05 + 0.25 * cos(time), 1))
#define R_EARTH 20.0
#define R_ATOMOS (R_EARTH + 5.0)
// 散乱のサンプル点の個数
#define SAMPLE_N 4
// 散乱の非対称因子 g
#define SCATTER_G 0.995
// 散乱定数
#define SCATTER_K 0.9
#define INTENSITY_SUN 0.1
#define EYE_EXPOSURE 2.0

#define PI 3.141592
#define SEA_COLOR vec3(0, 0, 0) / 255.0
#define WHITE vec3(255, 252, 254) / 255.0
#define ORANGE vec3(254, 142, 87) / 255.0
#define YELLOW_STRONG vec3(254, 255, 155) / 255.0
#define BLUE_SKY_2 vec3(53, 62, 101) / 255.0

// 座標pから地球への距離
float sdf_sphere(vec3 p) { return length(p) - R_EARTH; }

// Rayが大気圏を突き抜けるまでの距離を計算
// cPos : カメラ位置
// rd : Rayの方向ベクトル
// R : 地球の半径 + 大気圏の厚み
float calcAtomDistance(vec3 cPos, vec3 rd, float R) {
  float r = length(cPos);
  float a = 1.0;
  float b = 2.0 * dot(cPos, rd);
  float c = r * r - R * R;
  float d = (-b + sqrt(b * b - 4.0 * a * c)) / a / 2.0;
  // Rayが大気圏を突き抜けるまでの距離
  return d;
}

// The Phase Function(大気散乱)の計算]
// https://developer.nvidia.com/gpugems/gpugems2/part-ii-shading-lighting-and-shadows/chapter-16-accurate-atmospheric-scattering
// vDotL : Rayと光線ベクトルの内積(cosΘ)
// g : 散乱の対称性
float phaseFunction(float vDotL, float g) {
  float g2 = g * g;
  float value = (3.0 * (1.0 - g2) * (1.0 - g) * (1.0 + vDotL * vDotL)) /
                (2.0 * (2.0 + g2) * pow(1.0 + g2 - 2.0 * g * vDotL, 1.5));
  return clamp(value, 0.0, 1.0);
}

// The Out-Scattering Equation
// pa : サンプリングの開始点
// pb : サンプリングの終了点
// H : 大気圏の高さ
// r : 地球の半径
float outScatteringEq(vec3 pa, vec3 pb, float r, float H) {
  // 各サンプル点で exp(-h/H)を計算し、その平均値を求める(積分の近似計算)
  float total = 0.0;
  for (int i = 0; i < SAMPLE_N; i++) {
    float t = float(i) / (float(SAMPLE_N) - 1.0);
    vec3 p = mix(pa, pb, t); // サンプル点P
    float h =
        length(p) -
        r; // 地表から見た、サンプル点Pの高さh (地表は原点にあると仮定する)
    total += exp(-h / H);
  }
  total /= float(SAMPLE_N);

  return 4.0 * 3.141592 * SCATTER_K * total;
}

// The In-Scattering Equation
// cPos : カメラ位置
// rd : Rayの進む方向
// l : 太陽光線ベクトル
// pa : サンプリングの開始点
// pb : サンプリングの終了点
// r : 地球の半径
// H : 高さスケール
// g : 散乱の対称性
float inScatteringEq(vec3 cPos, vec3 rd, vec3 l, vec3 pa, vec3 pb, float r,
                     float H, float g) {
  // 各サンプル点で散乱を計算し、その平均値を求める(積分の近似計算)
  float total = 0.0;
  for (int i = 0; i < SAMPLE_N; i++) {
    float t = float(i) / (float(SAMPLE_N) - 1.0);
    vec3 p = mix(pa, pb, t); // サンプル点P
    float h = length(p) - r; // 地表からサンプル点Pまでの高さh
    float tc =
        outScatteringEq(p, cPos, r, H); // サンプル点からカメラへ向かう成分
    float ts =
        outScatteringEq(p, p + l, r, H); // サンプル点から太陽へ向かう成分
    total += exp(-h / H) * exp(tc + ts);
  }
  total /= float(SAMPLE_N);

  float vDotL = dot(rd, l);
  return INTENSITY_SUN * SCATTER_K * phaseFunction(vDotL, g) * total;
}

// The In-Scattering Equationの結果に露光の補正をかける
float inScatteringEqExp(vec3 cPos, vec3 rd, vec3 l, vec3 pa, vec3 pb, float r,
                        float H, float g) {
  return 1.0 -
         exp(-inScatteringEq(cPos, rd, l, pa, pb, r, H, g) * EYE_EXPOSURE);
}

// 地球へレイマーチング
void raymarching(vec3 cPos, vec3 rd, out float isHit) {
  float t = 0.0;
  for (int i = 0; i < 16; i++) {
    vec3 rp = cPos + t * rd; // ray position
    float d = sdf_sphere(rp);
    if (d < 0.1) {
      isHit = 1.0;
      break;
    }
    t += d;
  }
}

void main() {
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / resolution.y;
  vec3 l = normalize(vec3(0, 0.2 * cos(time * PI / 3.0), 1)); // 光源への向き

  float r = R_EARTH;  // 地球の半径
  float R = R_ATOMOS; // 大気圏の半径
  vec3 cPos = vec3(0, r + 0.5, 0);
  vec3 cDir = vec3(0, 0, 1);
  vec3 cUp = vec3(0, 1, 0);
  vec3 cSide = normalize(cross(cUp, cDir));
  vec3 rd = normalize(p.x * cSide + p.y * cUp + cDir);

  float sundot = clamp(dot(l, rd), 0.0, 1.0); // Ray
  float d = calcAtomDistance(cPos, rd, R);
  float isHit = 0.0;
  raymarching(cPos, rd, isHit);

  vec3 pa = cPos;        // サンプリング開始位置
  vec3 pb = pa + rd * d; // サンプリング終了位置
  float H = 0.5;         // 大気の平均密度の位置(0 ~ 1)

  // The In-Scatter Equationで大気散乱を計算する
  float scatter = inScatteringEq(cPos, rd, l, pa, pb, r, H, SCATTER_G);
  // 大気散乱のレンダリング
  vec3 scatterColor =
      +inScatteringEqExp(cPos, rd, LIGHT_DIRECTION, pa, pb, r, H, 0.992) *
          YELLOW_STRONG * 0.3 +
      inScatteringEqExp(cPos, rd, LIGHT_DIRECTION, pa, pb, r, H, 0.975) *
          ORANGE * 0.45 +
      inScatteringEqExp(cPos, rd, LIGHT_DIRECTION, pa, pb, r, H, 0.999) *
          WHITE * 0.35;
  vec3 skyColor = BLUE_SKY_2 + scatterColor;

  // gl_FragColor = vec4(mix(scatter, 0.0, isHit));
  gl_FragColor = vec4(mix(skyColor, SEA_COLOR, isHit), 1.0);
}