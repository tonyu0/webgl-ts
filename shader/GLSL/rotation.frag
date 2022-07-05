precision highp float;

uniform float time;
uniform vec2 resolution;

#define BG_COLOR vec3(0.0, 0.0, 0.2)
#define WHITE vec3(1, 1, 1)
#define BLACK vec3(0.1, 0.1, 0.1)

mat2 matrixR2(float theta) {
  return mat2(cos(theta), -sin(theta), sin(theta), cos(theta));
}

vec3 rotate(vec3 p, vec3 eulerAngle) {
  p.xy *= matrixR2(eulerAngle.z);
  p.yz *= matrixR2(eulerAngle.x);
  p.zx *= matrixR2(eulerAngle.y);
  return p;
}

float sdf(vec3 p) {
  vec3 center = vec3(0.0, 0.0, 0.0); // 箱の位置
  vec3 size = vec3(2, 1.0, 2);       // 箱のサイズ
  return max(
      distance(p.x, center.x) - size.x,
      max(distance(p.y, center.y) - size.y, distance(p.z, center.z) - size.z));
}

float xor (float a, float b) { return abs(a - b); } 

void main() {
  vec2 r = resolution;
  vec2 p = (gl_FragCoord.xy * 2.0 - r) / min(r.x, r.y);

  vec3 cPos = vec3(0, 0.5, -5);
  vec3 cDir = normalize(vec3(0, 0, 1)); // camera direction
  vec3 cUp = normalize(cross(cDir, vec3(1, 0, 0)));
  vec3 cSide = cross(cDir, cUp);

  float isHit = 0.0;
  float t = 0.0;
  vec3 rd = normalize(cDir + cSide * p.x + cUp * p.y); // ray direction
  vec3 rp;                                             // ray position
  for (int i = 0; i < 500; i++) {
    rp = cPos + rd * t; // ray position
    rp = rotate(rp, time * vec3(1, 2, 3));

    float d = sdf(rp);
    if (d < 0.01) {
      isHit = 1.0;
      break;
    }
    t += d;
  }

  vec3 b = vec3(step(fract(rp.x), 0.5), step(fract(rp.y), 0.5),
                step(fract(rp.z), 0.5));
  float grid = xor(xor(b.r, b.g), b.b);
  gl_FragColor = vec4(mix(BG_COLOR, vec3(grid), isHit), 1);
}