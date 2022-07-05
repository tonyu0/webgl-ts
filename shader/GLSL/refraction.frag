precision highp float;
uniform vec2 resolution;
uniform float time;

#define SPHERE_SIZE 1.6
#define SPHERE_CENTER vec3(0, SPHERE_SIZE * 2.0, 4.0)

float sdf_sphere(vec3 p) { return length(p - SPHERE_CENTER) - SPHERE_SIZE; }

float sdf_plane(vec3 p) { return p.y; }

float xor (float a, float b) { return abs(a - b); }

    vec3 getNormalSphere(vec3 p) {
  float d = 0.01;
  return normalize(
      vec3(sdf_sphere(p + vec3(d, 0, 0)) - sdf_sphere(p - vec3(d, 0, 0)),
           sdf_sphere(p + vec3(0, d, 0)) - sdf_sphere(p - vec3(0, d, 0)),
           sdf_sphere(p + vec3(0, 0, d)) - sdf_sphere(p - vec3(0, 0, d))));
}

// 球へのレイマーチング
// r0 : Rayの開始位置
// rd : Rayの向き
// isHit : Rayがオブジェクトにぶつかったかどうか
void raymarch_sphere(vec3 r0, vec3 rd, out float isHit, out float t) {
  isHit = 0.0;
  t = 0.0;
  for (int i = 0; i < 32; i++) {
    vec3 rp = r0 + t * rd;
    float d = sdf_sphere(rp);
    if (d < 0.01) {
      isHit = 1.0;
      break;
    }
    t += d;
  }
}

// 地面へのレイマーチング
// r0 : Rayの開始位置
// rd : Rayの向き
// isHit : Rayがオブジェクトにぶつかったかどうか
void raymarch_plane(vec3 r0, vec3 rd, out float isHit, out float t) {
  isHit = 0.0;
  t = 0.0;
  for (int i = 0; i < 32; i++) {
    vec3 rp = r0 + t * rd;
    float d = sdf_plane(rp);
    if (d < 0.01) {
      isHit = 1.0;
      break;
    }
    t += d;
  }
}

#define PI 3.1415926535
#define RED vec3(1, 0, 0)
#define BLUE vec3(0, 0, 1)
#define SPHERE_ALPHA 1.0

void main() {
  float t0 = time * PI / 3.0;
  vec2 p =
      (2.0 * gl_FragCoord.xy - resolution.xy) / min(resolution.x, resolution.y);

  vec3 cPos = vec3(cos(t0) * 6.0, 4.0 + 1.0 * sin(t0), 0.0);
  vec3 cDir = normalize(SPHERE_CENTER - cPos);
  vec3 cUp = normalize(cross(cDir, vec3(1, 0, 0)));
  vec3 cSide = normalize(cross(cUp, cDir));
  vec3 rd = normalize(p.x * cSide + p.y * cUp + cDir); // ray direction

  float t = 0.0;
  float isHitSphere, isHitPlane;

  vec3 r0 = cPos; // ray origin
  raymarch_sphere(r0, rd, isHitSphere, t);

  vec3 p_sphere = r0 + t * rd;
  vec3 n_sphere = clamp(getNormalSphere(p_sphere), vec3(0), vec3(1));

  vec3 sphere_col = vec3(0.0);
  if (isHitSphere > 0.0) {
    float a = 1.0;     // 環境光反射 強度
    float d = 0.2;     // 拡散反射 強度
    float s = 1.5;     // 鏡面反射 強度
    float gloss = 8.0; // 光沢度
    vec3 l = normalize(vec3(0, 1.0, -0.5));
    vec3 r = reflect(-l, n_sphere);
    sphere_col = +vec3(0.0, 0.1, 0.2) * a +
                 vec3(1, 0, 0.2) * d * clamp(dot(l, n_sphere), 0.0, 1.0) +
                 vec3(1, 0, 0.2) * s * pow(clamp(dot(rd, r), 0.0, 1.0), gloss);

    // float eta = 0.85; // 屈折率
    float eta = 0.91; // 屈折率
    r0 = p_sphere;
    rd = refract(rd, n_sphere, eta);
  }

  raymarch_plane(r0, rd, isHitPlane, t);
  vec3 p_plane = r0 + t * rd;
  float fade = smoothstep(14.0, 2.0, length(p_plane.xz));

  p_plane = step(fract(p_plane * 0.8), vec3(0.5));
  float gridPlane = xor(p_plane.x, p_plane.z);
  vec3 planeColor = mix(vec3(0), vec3(gridPlane), isHitPlane);

  gl_FragColor =
      vec4(sphere_col * isHitSphere + planeColor * isHitPlane * fade, 1);
}