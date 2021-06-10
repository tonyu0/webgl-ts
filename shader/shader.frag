precision mediump float;

uniform sampler2D texture;
uniform vec4 ambientLight;
uniform vec3 pointLightPosition;
uniform bool outline;
uniform bool useLight;
uniform bool useTexture;
uniform float hScale;

varying vec4 vColor;
varying vec2 vTexCoord;
varying vec3 N;
varying vec3 L;
varying vec3 V;

void main() {
  if (useLight) {
    // 視差マップ(今はやらない、ずらすというアイデアだけ)
    // float hScale = texture2D(texture1, vTextureCoord).r * height
    // vec2 hTexCoord = vTexCoord - hScale * V.xy; //
    // V.xyだけでよくみえるのあまりわかってない
    vec3 mN = (texture2D(texture, vTexCoord) * 2.0 - 1.0).rgb;
    // 視差を考慮してずらす
    // これで、普通の法線みたいにライティング計算できる

    vec3 H = normalize(L + V);
    float NdotL = clamp(dot(mN, L), 0.1, 1.0);
    float NdotH = clamp(dot(mN, H), 0.1, 1.0);
    float specular = pow(clamp(NdotH, 0.0, 1.0), 50.0);
    gl_FragColor = vColor * NdotL + vec4(vec3(specular), 1.0) +
                   vec4(vec3(ambientLight), 1.0);

    // point light shading
    vec3 pL = pointLightPosition - (-V);
    H = normalize(pL + V);
    NdotL = clamp(dot(mN, pL), 0.1, 1.0);
    NdotH = clamp(dot(mN, H), 0.1, 1.0);
    specular = pow(clamp(NdotH, 0.0, 1.0), 50.0);
    gl_FragColor += vColor * NdotL + vec4(vec3(specular), 1.0);
  } else {
    vec4 texColor = texture2D(texture, vTexCoord);
    gl_FragColor = vColor * texColor;
  }
}