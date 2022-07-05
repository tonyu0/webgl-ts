
// ライティングとかの参考に
// http://www.slis.tsukuba.ac.jp/~fujisawa.makoto.fu/cgi-bin/wiki/index.php?GLSL%A4%CB%A4%E8%A4%EB%A5%D5%A5%A9%A5%F3%A5%B7%A5%A7%A1%BC%A5%C7%A5%A3%A5%F3%A5%B0

// 頂点変換系
// take angle(radian) and return rotate matrix(2x2)
mat2 rotate(float angle) {
  float s = sin(angle), c = cos(angle);
  return mat2(c, -s, s, c);
}

vec3 getNormal(vec3 p) {
  float d = 0.001;
  vec3 dx = vec3(d, .0, .0);
  vec3 dy = vec3(.0, d, .0);
  vec3 dz = vec3(.0, .0, d);
  return normalize(vec3(df(p + dx) - df(p - dx), df(p + dy) - df(p - dy),
                        df(p + dz) - df(p - dz)));
}

void check(in vec3 pos, in vec3 ray, out float min_dist, out float len,
           out vec3 now) {
  now = pos;
  min_dist = df(now);
  len = 0.0;
  // float move = 0.1; // 可変にすると、細かい当たり判定ができるかも
  // 今回は200で届く。100だと波のピークだけ、みたいな表現。幾何で計算できる？
  for (int i = 0; i < 200; ++i) {
    now = pos + ray * len;
    min_dist = df(now);
    if (min_dist < 0.01)
      break;
    len += min_dist;
  }
}
