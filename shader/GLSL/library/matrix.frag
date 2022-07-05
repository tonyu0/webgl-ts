// 回転行列による回転
vec3 rotate(vec3 p, vec3 angle) {
  float cosx = cos(angle.x);
  float sinx = sin(angle.x);
  float cosy = cos(angle.y);
  float siny = sin(angle.y);
  float cosz = cos(angle.z);
  float sinz = sin(angle.z);
  mat3 rotX = mat3(1., 0., 0., 0., cosx, -sinx, 0., sinx, cosx);
  mat3 rotY = mat3(cosy, 0., siny, 0., 1., 0., -siny, 0., cosy);
  mat3 rotZ = mat3(cosz, -sinz, 0., sinz, cosz, 0., 0., 0., 1.);
  return rotZ * rotY * rotX * p;
}

// quaternion * quaternion
vec4 mul(vec4 a, vec4 b) {
  return vec4(a.x * b.x - a.y * b.y - a.z * b.z - a.w * b.w,
              a.x * b.y + a.y * b.x + a.z * b.w - a.w * b.z,
              a.x * b.z - a.y * b.w + a.z * b.x + a.w * b.y,
              a.x * b.w + a.y * b.z - a.z * b.y + a.w * b.x);
}
// vector * quaternion
vec4 mul(vec3 v, vec4 q) { return mul(vec4(v, 1), q); }

void rotate(out vec3 pos, vec3 axis, float angle) {
  vec4 q1 = vec4(axis.x * sin(angle), axis.y * sin(angle), axis.z * sin(angle),
                 cos(angle));
  vec4 q2 = vec4(-q1.xyz, q1.w);
  pos = mul(q1, mul(pos, q2)).xyz;
}

// 平行なベクトル方向に回転させる場合がエッジケース
// quaternion * quaternion
vec3 mul(vec3 v, vec4 q) {
  return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}
// ベクトルvを回転軸・回転角度指定で回転させる
void rotate(out vec3 v, vec3 axis, float angle) {
  vec4 q = vec4(axis.x * sin(angle / 2.0), axis.y * sin(angle / 2.0),
                axis.z * sin(angle / 2.0), cos(angle / 2.0));
  v = mul(v, q);
}

//