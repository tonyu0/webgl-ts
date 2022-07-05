float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(27.609, 57.583))) * 43758.5453);
}

// 3d noise function
float noise(in vec3 x) {
  vec3 p = floor(x);
  vec3 f = smoothstep(0.0, 1.0, fract(x));
  float n = p.x + p.y * 0.0 + 113.0 * p.z;

  return mix(mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
                 mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
             mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
                 mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y),
             f.z);
}

#define r2(a) mat2(cos(a), sin(a), -sin(a), cos(a))
#define hue(a) .45 + .45 * cos(PI2 *a *vec3(.25, .15, 1.));

//
vec3 hsv(float h, float s, float v) {
  vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
  return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

// 範囲[a, b]を[c, d]へ変換
float remap(float a, float b, float c, float d, float x) {
  return (x - a) / (b - a) * (d - c) + c;
}