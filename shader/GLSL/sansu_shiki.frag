precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// テクスチャ座標取得、

#define linearstep(edge0, edge1, x)                                            \
  min(max((x - edge0) / (edge1 - edge0), 0.0), 1.0)

float circularIn(float t) { return 1.0 - sqrt(1.0 - t * t); }

void main(void) {
  vec2 st = gl_FragCoord.xy / resolution;
  st.y = st.y * 1.2 - 0.1;

  // smoothstep
  float v = smoothstep(0.2, 0.8, st.x);

  // linearstep
  // float v = linearstep(0.2, 0.8, st.x);

  // arbity interpolation using linearstep
  // float v = circularIn(linearstep(0.2, 0.8, st.x));

  vec3 c = vec3(1.0) * (1.0 - smoothstep(0.0, 0.005, abs(v - st.y)));
  gl_FragColor = vec4(c, 1.0);
}