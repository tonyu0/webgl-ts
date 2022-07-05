precision highp float;
uniform float time;
uniform vec2 resolution;

mat2 m2 = mat2(1.6, -1.2, 1.2, 1.6); // 2倍スケール + 回転行列
float speed = 3.141592 / 2.0;
float sdf_water(vec3 p) {
  // wave
  float wave;
  float waveHeight = 2.0;

  for (int i = 0; i < 4; i++) {
    p.xz *= m2;
    wave += p.y - waveHeight * sin(p.x * 0.07 + p.z * 0.21 - time * speed);
    waveHeight *= 0.7;
  }
  wave += 12.0;
  return wave;
}

float sdf(vec3 p) { return sdf_water(p); }

vec3 getNormal(vec3 p) {
  float diff = 0.01;
  return normalize(vec3(sdf(p + vec3(diff, 0, 0)) - sdf(p - vec3(diff, 0, 0)),
                        sdf(p + vec3(0, diff, 0)) - sdf(p - vec3(0, diff, 0)),
                        sdf(p + vec3(0, 0, diff)) - sdf(p - vec3(0, 0, diff))));
}

void march(in vec3 cPos, in vec3 rd, out float isHit, out float rayDistance) {
  float t = 0.0;
  float st = 0.03;
  for (int i = 0; i < 1000; i++) {
    // if (t > 10.0) st = 0.5;

    vec3 rp = cPos + t * rd;
    if (sdf(rp) < 0.1) {
      isHit = 1.0;
      rayDistance = t;
      break;
    }

    t += st;
  }
}

#define SKY_COLOR vec3(86, 167, 200) / 255.0
#define SKY_COLOR2 vec3(87, 145, 201) / 255.0
#define SUN_COLOR vec3(245, 240, 232) / 255.0
#define WATER_COLOR vec3(38, 65, 139) / 255.0
#define SPEC_COLOR vec3(245, 240, 232) / 255.0
void sky(vec2 p, vec3 rd, vec3 light, out vec3 skycolor) {
  float sundot = clamp(abs(dot(rd, light)), 0.0, 1.0);
  sundot = pow(sundot, 350.0) * 1.2 + pow(sundot, 2.0) * 0.6;
  skycolor = mix(SKY_COLOR, SKY_COLOR2, p.y);
  skycolor = mix(skycolor, SUN_COLOR, sundot);
}

void main() {
  vec2 reso = resolution;
  vec2 p = (gl_FragCoord.xy * 2. - reso) / min(reso.x, reso.y);
  vec3 cPos = vec3(0, 0, 0); // camera pos
  vec3 cForward = vec3(0, -0.1, 1);
  vec3 cUp = vec3(0, 1, 0); // camera up
  vec3 cSide = cross(cForward, cUp);

  // Rayの進行方向
  vec3 rd = normalize(p.x * cSide + p.y * cUp + cForward);

  // 光源へ向かうベクトル
  vec3 l = normalize(vec3(0.7 * cos(time * 3.), 0.5 + 0.2 * sin(time * 4.), 1));

  // 太陽
  float sundot = dot(rd, l);
  sundot = pow(sundot, 350.0);

  vec3 skyColor;
  sky(p, rd, l, skyColor);

  if (rd.y > 0.0) // Rayが上向きなら海にぶつからないのでレイマーチングしない
  {
    gl_FragColor = vec4(skyColor, 1);
  } else // レイマーチング
  {
    float isHit; // RayがオブジェクトにHitしたかどうか
    float t;     // Rayが進んだ距離
    march(cPos, rd, isHit, t); // レイマーチング

    vec3 hitPos = cPos + rd * t; // Rayとオブジェクトの接触位置
    vec3 n = getNormal(hitPos);  // オブジェクト表面の法線
    vec3 r = reflect(l, n);      // 反射した光が進むベクトル

    float alpha = 100.0; // 光沢度
    float kd = 0.5;      // 拡散反射係数
    float ks = 1.0;      // 鏡面反射係数
    float ka = 0.1;      // 環境光反射係数

    // Phongの反射モデル
    float spec = ka + kd * dot(l, n) + ks * pow(dot(r, rd), alpha);
    spec = clamp(spec, 0.0, 1.0);

    vec3 specColor = spec * SPEC_COLOR;
    vec3 waterColor = WATER_COLOR + specColor;
    waterColor = mix(skyColor, waterColor, isHit);

    gl_FragColor = vec4(waterColor, 1);
  }
}