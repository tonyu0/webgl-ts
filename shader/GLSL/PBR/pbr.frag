precision highp float;
uniform vec2 resolution;
uniform float time;

#define PI acos(-1.0)

// Camera
#define CAMERA_TIME (time)
#define CAMERA_POSITION vec3(0, 2, -4)
#define CAMERA_LOOK vec3(0, 0, 0)
#define CAMERA_DIR normalize(CAMERA_LOOK - CAMERA_POSITION)
#define CAMERA_FAR_CLIP 100.0

// Box
#define BOX_TIME (time * PI / 3.0)
#define BOX_AXIS normalize(vec3(2, 3, 1.5))
#define BOX_POSITION vec3(0, 0, 0)
#define BOX_SIZE vec3(1)

struct Data {
  // input
  vec3 rayDir;    // Ray向き
  vec3 rayOrigin; // Ray開始位置

  // output
  bool isHit;
  float rayDist;
  vec3 rayEnd; // Ray終了位置
  vec3 normal;
};

// 二つのクォータニオン乗算
vec4 mult_qq(vec4 a, vec4 b) {
  return vec4(a.x * b.x - a.y * b.y - a.z * b.z - a.w * b.w,
              a.x * b.y + a.y * b.x + a.z * b.w - a.w * b.z,
              a.x * b.z - a.y * b.w + a.z * b.x + a.w * b.y,
              a.x * b.w + a.y * b.z - a.z * b.y + a.w * b.x);
}

// ベクトルとクォータニオンの積を計算
vec4 mult_vq(vec3 v, vec4 q) { return mult_qq(vec4(v, 1), q); }

// 軸aの周りで回転するクォータニオン
vec3 rotate(vec3 p, vec3 a, float rad) {
  vec4 q1 = vec4(a.x * sin(rad), a.y * sin(rad), a.z * sin(rad), cos(rad));
  vec4 q2 = vec4(-q1.xyz, q1.w); // 共役クォータニオン
  p = mult_qq(q1, mult_vq(p, q2)).xyz;

  return p;
}

mat2 getRot(float radian) {
  return mat2(cos(radian), -sin(radian), sin(radian), cos(radian));
}

// 距離関数(箱)
float sdBox(vec3 p) {
  p = rotate(p, BOX_AXIS, BOX_TIME);
  vec3 d = abs(p) - BOX_SIZE;
  return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

vec3 getNormalBox(vec3 p) {
  vec2 d = vec2(0.001, 0);
  return normalize(vec3(sdBox(p + d.xyy) - sdBox(p - d.xyy),
                        sdBox(p + d.yxy) - sdBox(p - d.yxy),
                        sdBox(p + d.yyx) - sdBox(p - d.yyx)));
}

void traceBox(inout Data data) {
  for (int i = 0; i < 32; i++) {
    data.rayEnd = data.rayOrigin + data.rayDist * data.rayDir;
    float d = sdBox(data.rayEnd - BOX_POSITION);
    if (d < 0.01) {
      data.isHit = true;
      data.normal = getNormalBox(data.rayEnd);
      break;
    }
    data.rayDist += d;
  }
}

vec3 renderSky(vec3 rd) { return vec3(0.1); }

// 箱の描画
vec3 renderBox(Data data) {
  vec3 n = data.normal;                     // 面の法線
  vec3 v = -data.rayDir;                    // 視線方向ベクトル
  float vDotN = clamp(dot(n, v), 0.0, 1.0); // cos
  float I = 4.0;                            // 放射強度
  float S = 10.0;                           // 面積
  float L = I / (S * vDotN);                // 視線方向の放射輝度

  return vec3(L);
}

void main() {
  vec3 cPos = CAMERA_POSITION;
  vec3 cDir = CAMERA_DIR;
  vec3 cSide = normalize(vec3(1, 0, 0));
  vec3 cUp = normalize(cross(cDir, cSide));

  vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / resolution.y;

  float focus = 1.7;
  vec3 rayDir = normalize(p.x * cSide + p.y * cUp + cDir * focus);

  Data boxData;
  boxData.rayOrigin = cPos;
  boxData.rayDir = rayDir;
  traceBox(boxData);

  // render Color
  vec3 boxColor = renderBox(boxData);
  vec3 skyColor = renderSky(rayDir);

  // blend Color
  vec3 col = boxData.isHit ? boxColor : skyColor;

  gl_FragColor = vec4(col, 1);
}