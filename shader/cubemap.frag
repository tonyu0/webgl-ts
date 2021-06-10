
precision mediump float;

uniform samplerCube cubeTexture;
uniform sampler2D normalMap;
uniform bool reflection;
uniform float eta;

varying vec4 C;
varying vec3 N;
varying vec3 V;
varying vec2 vTexCoord;
varying vec3 tNormal;
varying vec3 tTangent;
varying vec3 tBinormal;

void main() {

  mat3 mView = mat3(tTangent, tBinormal, tNormal);
  vec3 mNormal = mView * (texture2D(normalMap, vTexCoord) * 2.0 - 1.0).xyz;

  vec3 ref;
  if (reflection)
    // ref = reflect(-V, mNormal);
    ref = refract(-V, mNormal, eta);
  else
    ref = mNormal;

  vec4 envColor = textureCube(cubeTexture, ref);
  gl_FragColor = C * envColor;
}