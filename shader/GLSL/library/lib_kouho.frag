const float PI = 3.1415926535;
// ガウス関数の標準偏差
#define STDEV (1.0)
// ガウスぼかしのサンプル数
#define BLUR_SAMPLE_N 8
// Bloomをかける範囲(ピクセル数)
#define BLUR_RANGE 64.0
#define GLOW_INTENSITY (3.0 + 0.25 * sin(time * PI * 2.0))
// 3点を結ぶ三角形の描画
// p : UV座標
// p1, p2, p3 : 三角形の各頂点
float triangle(vec2 p, vec2 p1, vec2 p2, vec2 p3) {
  float c1 = step((p.y - p1.y) * (p2.x - p1.x), (p2.y - p1.y) * (p.x - p1.x));
  float c2 = step((p.y - p2.y) * (p3.x - p2.x), (p3.y - p2.y) * (p.x - p2.x));
  float c3 = step((p.y - p3.y) * (p1.x - p3.x), (p1.y - p3.y) * (p.x - p3.x));
  return 1.0 - max(max(c1, c2), c3);
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
      total += gaussianFunction(d) *
               triangle(p + d, vec2(0.2, 0.2), vec2(0.8, 0.5), vec2(0.5, 0.8));
    }
  }
  return total / float(BLUR_SAMPLE_N * BLUR_SAMPLE_N);
}
// void main() {
//   vec2 p = (gl_FragCoord.xy * 2. - resolution) / resolution.y;
//   gl_FragColor =
//       vec4(triangle(p, vec2(0.2, 0.2), vec2(0.8, 0.5), vec2(0.5, 0.8)) +
//            gaussianBlur(p) * GLOW_INTENSITY);
// }

// https://www.shadertoy.com/view/MtS3DD
// テクスチャマッピングとか反射もあるよ
vec2 map(vec3 p) {
  float dist = 0.;

  if (g.x < m.x)
    dist = length(max(abs(p) - vec3(0.5), 0.0)); // cube
  else
    dist = length(p) - 1.; // sphere

  vec2 res = vec2(dist, 1);

  return res;
}

vec3 nor(in vec3 p, float prec) {
  vec2 e = vec2(prec, 0.);
  vec3 n = vec3(map(p + e.xyy).x - map(p - e.xyy).x,
                map(p + e.yxy).x - map(p - e.yxy).x,
                map(p + e.yyx).x - map(p - e.yyx).x);
  return normalize(n);
}

// from iq
float ao(in vec3 pos, in vec3 nor) {
  float occ = 0.0;
  float sca = 1.0;
  for (int i = 0; i < 5; i++) {
    float hr = 0.01 + 0.12 * float(i) / 4.0;
    vec3 aopos = nor * hr + pos;
    float dd = map(aopos).x;
    occ += -(dd - hr) * sca;
    sca *= 0.95;
  }
  return clamp(1.0 - 3.0 * occ, 0.0, 1.0);
}

// cube?
float df(vec3 p) {
  rotate(p, normalize(vec3(0.0, 1.0, 1.0)), radians(time * 60.0));
  vec3 center = vec3(0.0, 0.0, 0.0);
  vec3 size = vec3(2., 2.0, 2.);
  return max(
      distance(p.x, center.x) - size.x,
      max(distance(p.y, center.y) - size.y, distance(p.z, center.z) - size.z));
}

// https://www.shadertoy.com/view/wtjGWy
// https://gamedevelopment.tutsplus.com/articles/use-tri-planar-texture-mapping-for-better-terrain--gamedev-13821
// 3次元にテクスチャを貼る、triplanar texture mapping
float tex3D(vec3 p, vec3 n) {
  vec3 blending = abs(n);
  blending = normalize(max(blending, 0.00001));

  // normalized total value to 1.0
  float b = (blending.x + blending.y + blending.z);
  blending /= b;

  float xaxis = mandelbrot(p.yz);
  float yaxis = mandelbrot(p.xz);
  float zaxis = mandelbrot(p.xy);

  // blend the results of the 3 planar projections.
  return xaxis * blending.x + yaxis * blending.y + zaxis * blending.z;
}

float mandelbrot(vec2 p) {
  float cnt = 0.0;
  vec2 z = vec2(.0, .0);

  for (int i = 0; i < 100; ++i) {
    cnt += 1.0;
    if (length(z) > 2.0)
      return 0.0;
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + p;
  }
  return cnt / 100.0;
}