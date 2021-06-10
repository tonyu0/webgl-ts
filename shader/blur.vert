attribute vec3 position;
attribute vec4 color;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
varying vec4 vColor;

void main() {
  vColor = color;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}