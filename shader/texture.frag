// テクスチャ貼り方勉強用シェーダー
precision mediump float;

uniform sampler2D texture0;
uniform sampler2D texture1;

uniform int useTexture;

varying vec4 vColor;
varying vec2 vTextureCoord;

void main(void) {
  vec4 dest = vec4(0.0);
  if (bool(useTexture)) {
    vec4 smpColor0 = texture2D(texture0, vTextureCoord);
    vec4 smpColor1 = texture2D(texture1, vTextureCoord);
    dest = vColor * smpColor0 * smpColor1;
  } else {
    dest = vColor;
  }
  // ここにわたってくるCoordって、頂点と同じだよね？
  // 頂点-ピクセルは多分1対多
  // ここにvaryingを使う理由が隠れている？
  // ラスタライザでうまく補完するため、とか。
  gl_FragColor = dest;
}