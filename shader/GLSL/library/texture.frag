

// チェッカー
// 衝突地点の色を返す
vec3 b = vec3(step(fract(now.x), 0.5), step(fract(now.y), 0.5),
              step(fract(now.z), 0.5));
float grid = xor(xor(b.r, b.g), b.b);