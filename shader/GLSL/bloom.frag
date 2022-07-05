#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform float time;

#define PI 3.141592

// ガウス関数の標準偏差
#define STDEV (1.0)

// ガウスぼかしのサンプル数
#define BLUR_SAMPLE_N 8

// Bloomをかける範囲(ピクセル数)
#define BLUR_RANGE 64.0

// 発光強度
// #define GLOW_INTENSITY 1.0
#define GLOW_INTENSITY (1.0 + 0.25 * sin(time * PI * 2.0))

// 3点を結ぶ三角形の描画
// p : UV座標
// p1, p2, p3 : 三角形の各頂点
float triangle(vec2 p, vec2 p1, vec2 p2, vec2 p3) {
  float c1 = step((p.y - p1.y) * (p2.x - p1.x), (p2.y - p1.y) * (p.x - p1.x));
  float c2 = step((p.y - p2.y) * (p3.x - p2.x), (p3.y - p2.y) * (p.x - p2.x));
  float c3 = step((p.y - p3.y) * (p1.x - p3.x), (p1.y - p3.y) * (p.x - p3.x));
  return 1.0 - max(max(c1, c2), c3);
}

// 三角形のレンダリング
float renderTriangle(vec2 p) {
  return triangle(p, vec2(0.2, 0.2), vec2(0.8, 0.5), vec2(0.5, 0.8));
}

// ガウス関数の計算
float gaussianFunction(vec2 p) {
  return exp(-dot(p, p) / (2.0 * STDEV)) / (sqrt(2.0 * PI * STDEV));
}

// ガウスぼかし
// p : UV座標(0~1)
// center : ガウスぼかしの中心
float gaussianBlur(vec2 p) {
  vec2 delta =
      vec2(BLUR_RANGE / float(BLUR_SAMPLE_N)) / min(resolution.x, resolution.y);
  float total;
  // p = p - center;
  for (int i = -BLUR_SAMPLE_N / 2; i <= BLUR_SAMPLE_N / 2; i++) {
    for (int j = -BLUR_SAMPLE_N / 2; j <= BLUR_SAMPLE_N / 2; j++) {
      vec2 d = delta * vec2(i, j);
      total += gaussianFunction(d) * renderTriangle(p + d);
    }
  }
  return total / float(BLUR_SAMPLE_N * BLUR_SAMPLE_N);
}

void main() {
  vec2 p = gl_FragCoord.xy / min(resolution.x, resolution.y) - vec2(0.5, 0.0);

  // ガウスぼかしを利用したBloom効果
  float c = renderTriangle(p) + GLOW_INTENSITY * gaussianBlur(p);

  gl_FragColor = vec4(c);
}