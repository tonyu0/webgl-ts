attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 invMatrix;
uniform vec3 lightDirection;
uniform vec3 eyeDirection;
uniform vec4 ambientColor;
varying vec4 vColor;

void main(void) {
  vec3 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vec3 L = normalize(invMatrix * vec4(lightDirection, 0.0)).xyz;
  vec3 V = -mvPosition.xyz;
  vec3 H = normalize(L + V);
  float diffuse = clamp(dot(normal, L), 0.0, 1.0);
  float specular = pow(clamp(dot(normal, H), 0.0, 1.0), 50.0);
  vec4 amb = color * ambientColor;
  vColor = amb * vec4(vec3(diffuse), 1.0) + vec4(vec3(specular), 1.0);
  gl_Position = projectionMatrix * vec4(mvPosition, 1.0);
}