
attribute vec3 position;
attribute vec4 color;
attribute vec3 normal;
attribute vec2 texCoord;

varying vec4 C;
varying vec3 N;
varying vec3 V;
varying vec2 vTexCoord;

varying vec3 tNormal;
varying vec3 tTangent;
varying vec3 tBinormal;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void main() {

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  C = color;
  N = (modelMatrix * vec4(normal, 0.0)).xyz;
  V = -mvPosition.xyz;
  vTexCoord = texCoord;
  // 例ではfragにてvPosition - vEyeposとやっているが、
  // view空間ではeyeが原点なので、

  tNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
  // 大きさ1同士のベクトルの外積ベクトルの大きさは1にならない？, crossは可換？
  tTangent = normalize(cross(tNormal, vec3(0.0, 1.0, 0.0)));
  tBinormal = normalize(cross(tNormal, tTangent));

  // ワールド空間へ、でもこれだとscaleがあるとおかしくなるよ！法線なので
  gl_Position = projectionMatrix * mvPosition;
}