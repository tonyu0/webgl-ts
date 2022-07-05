#define f fract
#define s(a) sin(1e3 * a + sin(3e2 * a)) * pow(f(mod(-a * 8., 8.) / 3.), 4.)
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 u = (fragCoord / iResolution.xy - .5) * iTime * .1;
  fragColor = vec4(0, .7, 1., 1.) * (.02 / length(u) * f(-iTime * 2.) +
                                     30. * s(iTime) * s(u.x * u.y));
}

// FM音源, クロスディレイ(ステレオ), ユークリッドリズム