precision mediump float;
attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;
attribute vec2 texCoord;

uniform mat4 modelViewMatrix;
uniform mat4 invMatrix;
uniform vec3 lightDirection;
uniform mat4 projectionMatrix;
uniform bool outline;

varying vec4 vColor;
varying vec2 vTexCoord;
varying vec3 N;
varying vec3 L;
varying vec3 V;

void main(void) {
  vec3 pos = position;
  if (outline) {
    pos += normal * 0.1;
  }
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vTexCoord = texCoord;
  vColor = color;

  // 法線マップのための法線計算をする
  vec3 lightVec = normalize(invMatrix * vec4(lightDirection, 0.0)).xyz;
  vec3 viewVec = -mvPosition.xyz;

  N = normalize(normal);
  vec3 tangent = normalize(cross(N, vec3(0.0, 1.0, 0.0)));
  vec3 binormal = normalize(cross(N, tangent));

  L.x = dot(tangent, viewVec);
  L.y = dot(binormal, viewVec);
  L.z = dot(N, viewVec);
  normalize(L);
  V.x = dot(tangent, viewVec);
  V.y = dot(binormal, viewVec);
  V.z = dot(N, viewVec);
  normalize(V);

  // グーローシェーディングにお別れ
  // vColor = color * vec4(vec3(NdotL), 1.0) + specular;

  gl_Position = projectionMatrix * mvPosition;
}