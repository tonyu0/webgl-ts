#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash11(float p) { return fract(cos(p) * 41415.92653); }
float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(27.609, 57.583))) * 43758.5453);
}

// 3d noise function
float noise(in vec3 x) {
  vec3 p = floor(x);
  vec3 f = smoothstep(0.0, 1.0, fract(x));
  float n = p.x + p.y * 0.0 + 113.0 * p.z;

  return mix(mix(mix(hash11(n + 0.0), hash11(n + 1.0), f.x),
                 mix(hash11(n + 57.0), hash11(n + 58.0), f.x), f.y),
             mix(mix(hash11(n + 113.0), hash11(n + 114.0), f.x),
                 mix(hash11(n + 170.0), hash11(n + 171.0), f.x), f.y),
             f.z);
}

float sdf(vec3 p) {
  float speed = 3.141592 / 2.0;
  float wave = 12.0;
  float waveHeight = 1.0;

  for (int i = 0; i < 4; i++) {
    p.xz *= mat2(1.6, -1.2, 1.2, 1.6);
    // 2倍スケール + 回転行列;
    // cos60degree = 0.8くらい、sin60degree = 0.5くらいなので？
    wave += p.y - waveHeight * sin(p.x * 0.07 + p.z * 0.21 - time * speed);
    waveHeight *= 0.7;
  }
  return wave;
}

vec3 getNormal(vec3 p) {
  float diff = 0.01;
  return normalize(vec3(sdf(p + vec3(diff, 0, 0)) - sdf(p - vec3(diff, 0, 0)),
                        sdf(p + vec3(0, diff, 0)) - sdf(p - vec3(0, diff, 0)),
                        sdf(p + vec3(0, 0, diff)) - sdf(p - vec3(0, 0, diff))));
}

void march(in vec3 cPos, in vec3 rd, out float isHit, out vec3 hitPos) {
  if (rd.y > 0.0)
    return; // Rayが上向きの場合、海にヒットしないのでRaymarchを行わない
  float t = 0.0;
  float st = 0.03;
  for (int i = 0; i < 1000; i++) {
    // if (t > 10.0) st = 0.5;

    if (sdf(cPos + t * rd) < 0.1) {
      isHit = 1.0;
      hitPos = cPos + t * rd;
      break;
    }
    t += st;
  }
}

#define SKY_COLOR vec3(86, 167, 200) / 255.0
#define SKY_COLOR2 vec3(87, 145, 201) / 255.0
#define SUN_COLOR vec3(245, 240, 232) / 255.0
//
#define SUN_COLOR_1 vec3(246, 254, 207) / 255.0
#define SUN_COLOR_2 vec3(182, 149, 95) / 255.0
#define SUN_COLOR_SCALE 24.0
//
#define WATER_COLOR vec3(38, 65, 139) / 255.0
#define SPEC_COLOR vec3(245, 240, 232) / 255.0
//
#define SKY_COLOR_HORIZON_1 vec3(96, 57, 28) / 255.0
#define SKY_COLOR_HORIZON_2 vec3(105, 54, 25) / 255.0
//

void sky(vec2 p, vec3 rd, vec3 light, out vec3 skycolor) {
  float sundot = clamp(abs(dot(rd, light)), 0.0, 1.0);
  sundot = pow(sundot, 350.0) * 1.2 + pow(sundot, 2.0) * 0.6;
  skycolor = mix(SKY_COLOR, SKY_COLOR2, p.y);
  skycolor = mix(skycolor, SUN_COLOR, sundot);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy * 2.0 - 1.0;
  uv.x *= resolution.x / resolution.y;
  vec3 cPos = vec3(0, 1.2, 0); // camera pos
  vec3 cForward = vec3(0, -0.1, 1);
  vec3 cUp = vec3(0, 1, 0); // camera up
  vec3 cSide = cross(cForward, cUp);

  // Rayの進行方向
  vec3 rd = normalize(uv.x * cSide + uv.y * cUp + cForward);

  // 光源へ向かうベクトル
  // vec3 l = normalize(vec3(0.7 * cos(time * 3.), 0.5 + 0.2 * sin(time * 4.),
  // 1));
  // vec3 l = normalize(vec3(0.7, 0.5, 1));

  // 太陽
  // float sundot = dot(rd, l);
  // sundot = pow(sundot, 350.0);

  // vec3 skyColor;
  // sky(uv, rd, l, skyColor);

  // レイマーチング
  float isHit = 0.0;       // RayがオブジェクトにHitしたかどうか
  vec3 hitPos = vec3(0.0); // Rayとオブジェクトの接触位置
  march(cPos, rd, isHit, hitPos); // レイマーチング

  // Light vector
  vec3 l = normalize(vec3(0, 0.2, 1.0)); // 光源への向きベクトル
  // Render Sky
  float sundot = clamp(dot(rd, l), 0.0, 1.0);
  float skyGrad = pow(sundot, 800.0) * 1.0 + pow(sundot, 10.0) * 0.18 +
                  pow(sundot, 0.5) * 0.05;
  float skyGradY1 =
      smoothstep(-1.2, 0.5, uv.y + pow(abs(uv.x), 2.0) * 0.3 - 0.5);
  float skyGradY2 = smoothstep(-0.3, 0.2, uv.y + abs(uv.x) * 0.2);
  vec3 skyBgColor = mix(SKY_COLOR_HORIZON_1, SKY_COLOR, skyGradY1);
  skyBgColor = mix(SKY_COLOR_HORIZON_2, skyBgColor, skyGradY2);

  vec3 sun = SUN_COLOR_2 * pow(sundot, 20.0) * SUN_COLOR_SCALE;
  vec3 skyColor = mix(skyBgColor, sun, skyGrad);

  // // // シェーディング // // //
  vec3 n = getNormal(hitPos); // オブジェクト表面の法線
  vec3 r = reflect(l, n);     // 反射した光が進むベクトル
  float alpha = 100.0;        // 光沢度
  float kd = 0.5;             // 拡散反射係数
  float ks = 1.0;             // 鏡面反射係数
  float ka = 0.1;             // 環境光反射係数

  // Phongの反射モデル
  float spec = ka + kd * dot(l, n) + ks * pow(dot(r, rd), alpha);
  spec = clamp(spec, 0.0, 1.0);

  vec3 specColor = spec * SPEC_COLOR;
  vec3 waterColor = WATER_COLOR + specColor;
  waterColor = mix(skyColor, waterColor, isHit);

  gl_FragColor = vec4(mix(skyColor, waterColor, isHit), 1.0);
}