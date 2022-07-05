#ifdef GL_ES
precision mediump float;
#endif

#define time time
#define mouse mouse
#define resolution resolution

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {
  vec2 pos = gl_FragCoord.xy / resolution.y;
  // resolution-independent position relative to lower-left screen corner
  // vec2 pos = (gl_FragCoord.xy - 0.5*resolution) / resolution.y;
  // resolution-independent position relative to screen center
  // vec2 pos = (gl_FragCoord.xy - mouse*resolution) / resolution.y;
  // resolution-independent position relative to mouse position
  // vec2 pos = gl_FragCoord.xy / resolution.y - 0.2*vec2(time, sin(time));
  // resolution-independent position relative to moving center

  float freq = 16.0;
  vec2 tile = floor(pos * freq); // convert position into tile coordinates

  vec3 rgb = vec3(mod(tile.x + tile.y, 2.0));
  // x = 2.0, xごとに黒くなる
  // 左上原点で考えてる
  // black-and-white chessboard
  // float steps = 5.0; vec3 rgb = vec3(mod(tile.x + tile.y, steps) /
  // (steps- 1.0)); multi-level chessboard vec3 rgb = vec3(min(min(tile.x,
  // tile.y),min(freq-tile.x, freq-tile.y)) * 2.0 / freq); concentric squares

  gl_FragColor = vec4(rgb, 1.0); // set fragment color
  // これで巡回群とか掛けないかな？
}

// BELLEND
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

mat2 rotate(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, s, -s, c);
}
#define MAX_ITER 3.0

void main(void) {

  vec2 p = surfacePosition * 5.0;
  vec2 i = p;
  float c = 0.0;
  float inten = 0.15;
  float r = length(p + vec2(sin(time), sin(time * 0.233 + 2.)) * 1.5);
  float d = length(p);

  for (float n = 0.0; n < MAX_ITER; n++) {
    p *= rotate(d + time + p.x * .5) * -0.15;
    float t = r - time * (.5 - (2.9 / (n + 1.)));
    t = r - time / (n + 1.5);
    i -= p +
         vec2(cos(t - i.x - r) + sin(t + i.y), sin(t - i.y) + cos(t + i.x) + r);
    c += 1.0 / length(vec2((sin(i.x + t) / inten), (cos(i.y + t) / inten)));
  }
  c /= float(MAX_ITER);
  gl_FragColor = vec4(vec3(c, c, c) * vec3(.3, 1.8, 3.2) * 1.0 - 0.15, .1);
}

// 円が乱舞するやつ
float radius = 0.1;
float dist = 0.5;
for (float i = 0.0; i < 50.0; i++) {
  float si = sin(time + i * dist) / 0.5;
  float co = cos(time + i * dist) * 0.5;
  col += 0.01 / abs(length(uv + vec2(si, co * si)) - radius);
}

// sin cos テクニック
// sin(2x + sin(x + p) - p)
// p = 4.5
#define F(x) sin(2. * x + sin(x + time * 2.) - time * 2.)
void main() {
  vec2 uv = (gl_FragCoord.xy - resolution * .5) / resolution.y * 3.;
  uv.y -= F(uv.x);
  float e = 0.01, g = (F(uv.x + e) - F(uv.x - e)) / (2. * e);
  uv.y *= cos(atan(g));
  gl_FragColor.xyz += smoothstep(abs(uv.y), .0, .05);
