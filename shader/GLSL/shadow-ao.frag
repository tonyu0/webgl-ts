#define PI 3.14159265359

mat2 rotate(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, s, -s, c);
}

mat3 lookat(in vec3 eye, in vec3 target) {
  vec3 w = normalize(target - eye);
  vec3 u = normalize(cross(w, vec3(0.0, 1.0, 0.0)));
  vec3 v = normalize(cross(u, w));
  return mat3(u, v, w);
}

float smin(float a, float b, float k) {
  return -(log(exp(k * -a) + exp(k * -b)) / k);
}

float lengthN(in vec2 p, in float n) {
  p = pow(abs(p), vec2(n));
  return pow(p.x + p.y, 1.0 / n);
}

float func(in float x) {
  // inspired https://twitter.com/Astarisk6446229/status/1319478131539890176
  // rewrote 2020/10/24
  float t = iTime * 3.;
  return sin(2. * x + sin(x + t) - t) * .5;

  // float t = iTime *1.5;
  // return 0.15*sin(x*5.0+t)+0.2*sin(x*3.0+t);
}

float deCurve(in vec3 p) {
  // transform
  p.y -= 0.5;
  p.xy *= rotate(0.3);
  // de
  p.y -= func(p.x);
  float e = 0.01;
  float g = (func(p.x + e) - func(p.x - e)) / (2.0 * e);

  // https://www.iquilezles.org/www/articles/distance/distance.htm
  // https://socratic.org/questions/how-do-you-simplify-cos-arctan-x
  // cos(atan(g)) == 1.0/sqrt(g*g+1.0)
  p.y *= cos(atan(g));
  // p.y *= 1.0/sqrt(g*g+1.0);

  float de = 0.6 * (abs(lengthN(p.yz, 5.0) - 0.1) - 0.01);
  return max(abs(p.x) - 2.0, de);
}

float deGroud(in vec3 p) { return p.y; }

float map(in vec3 p) { return smin(deCurve(p), deGroud(p), 50.0); }

vec3 doColor(in vec3 p) {
  float e = 0.01;
  if (deGroud(p) < e) {
    return mix(0.6 * texture(iChannel0, p.xz * 0.2).xxx, vec3(0.3, 0.4, 0.5),
               0.5);
  }
  return vec3(0.6, 1.0, 0.7);
  /*
float d1 = deCurve(p);
float d2 = deGroud(p);
if (d1 < d2){
  return vec3(0.35, 0.6, 0.4);
} else {
  return mix(0.6*texture(iChannel0, p.xz*0.2).xxx,
          vec3(0.3,0.4,0.5), 0.5);
}
  */
}

vec3 calcNormal(in vec3 pos) {
  vec2 e = vec2(1.0, -1.0) * 0.002;
  return normalize(e.xyy * map(pos + e.xyy) + e.yyx * map(pos + e.yyx) +
                   e.yxy * map(pos + e.yxy) + e.xxx * map(pos + e.xxx));
}

float softshadow(in vec3 ro, in vec3 rd) {
  float res = 1.0;
  float t = 0.05;
  for (int i = 0; i < 32; i++) {
    float h = map(ro + rd * t);
    res = min(res, 8.0 * h / t);
    t += clamp(h, 0.02, 0.1);
    if (h < 0.001 || t > 1.5)
      break;
  }
  return clamp(res, 0.0, 1.0);
}

float calcAO(in vec3 pos, in vec3 nor) {
  float occ = 0.0;
  float sca = 1.0;
  for (int i = 0; i < 5; i++) {
    float hr = 0.01 + 0.12 * float(i) / 4.0;
    vec3 aopos = nor * hr + pos;
    float dd = map(aopos);
    occ += -(dd - hr) * sca;
    sca *= 0.95;
  }
  return clamp(1.0 - 3.0 * occ, 0.0, 1.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 p = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  vec3 col = vec3(0.4 * p.y * p.y);
  vec3 ro = vec3(0.0, 1.5, 2.5);
  vec3 rd = normalize(vec3(p, 2.0));
  ro.xz *= rotate(iTime * 0.1);
  rd = lookat(ro, vec3(0.0, 0.5, 0.0)) * rd;
  float maxd = 20.0;
  float t = 0.0, h;
  for (int i = 0; i < 128; i++) {
    t += h = map(ro + rd * t);
    if (h < 0.001 || t > maxd)
      break;
  }
  if (t < maxd) {
    vec3 pos = ro + t * rd;
    vec3 nor = calcNormal(pos);
    col = doColor(pos);
    float occ = calcAO(pos, nor);
    vec3 li = normalize(vec3(2.0, 2.0, 3.0));
    float dif = clamp(dot(nor, li), 0.0, 1.0);
    dif *= softshadow(pos, li);
    col *= max(dif, 0.3);
    col *= max(0.5 + 0.5 * nor.y, 0.0) * occ;
    col = pow(col, vec3(0.5));
  }
  fragColor = vec4(col, 1.0);
}
