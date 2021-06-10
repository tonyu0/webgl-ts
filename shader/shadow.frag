precision mediump float;

uniform bool depthBuffer;

varying vec4 vPosition;

vec4 convRGBA(float depth) {
  float r = depth;
  float g = fract(r * 255.0);
  float b = fract(g * 255.0);
  float a = fract(b * 255.0);
  float coef = 1.0 / 255.0;
  r -= g * coef;
  g -= b * coef;
  b -= a * coef;
  return vec4(r, g, b, a);
}

void main(void) {
  vec4 convColor;
  if (depthBuffer) {
    convColor = convRGBA(
        gl_FragCoord.z); // デプスバッファの深度値をそのまま拾ってきてる
  } else {
    // 頂点座標からダイレクトに深度に相当する値を生成してフラグメントに描き込
    float near = 0.1;
    float far = 150.0;
    float linerDepth = 1.0 / (far - near);
    linerDepth *= length(vPosition);
    convColor = convRGBA(linerDepth);
  }
  gl_FragColor = convColor;
}