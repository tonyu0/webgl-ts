

float e = 0.0;
for (float i = 3.0; i <= 17.0; i += 1.0) {
  e += 0.1 / ((i / 2.) +
              cos(time / 5. +
                  1.1 * i * (uv.x) * (sin(i / 9.0 + time / 9. - uv.x * 0.2))) +
              1. + 5.5 * uv.y);
}
gl_FragColor = vec4(vec3(0.0 - uv.y * e * 1.4, e / 2.0, e), 1.0);