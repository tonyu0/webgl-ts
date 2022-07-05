

#define SPHERE_SIZE 2.0
#define SPHERE_CENTER vec3(0, 0, 0)
float sdf_sphere(vec3 p) { return length(p - SPHERE_CENTER) - SPHERE_SIZE; }

#define ROOM_SIZE vec3(8, 4, 8)
float sdf_plane(vec3 p) {
  vec3 center = vec3(0.0, 0.0, 0.0); // 箱の位置
  vec3 size = ROOM_SIZE;             // 箱のサイズ
  return -max(
      distance(p.x, center.x) - size.x,
      max(distance(p.y, center.y) - size.y, distance(p.z, center.z) - size.z));
}

float sdf_box(vec3 p) {
  vec3 center = vec3(0.0, 0.0, 0.0); // 箱の位置
  vec3 size = vec3(2, 1.0, 2);       // 箱のサイズ
  return max(
      distance(p.x, center.x) - size.x,
      max(distance(p.y, center.y) - size.y, distance(p.z, center.z) - size.z));
}

float sdf_wave(vec3 p) {
  mat2 m2 = mat2(1.6, -1.2, 1.2, 1.6); // 2倍スケール + 回転行列
  float speed = 3.141592 / 2.0;
  float waveHeight = .5;

  float wave;
  for (int i = 0; i < 4; i++) {
    p.xz *= m2;
    wave += p.y - waveHeight * sin(p.x * 0.07 + p.z * 0.21 - time * speed);
    waveHeight *= 0.6;
  }
  // wave += 12.0;
  wave += noise(p) * 0.03;
  return wave;
}