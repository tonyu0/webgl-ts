#define f fract
#define s(a, b)                                                                \
  sin(1e3 * a + sin(3e2 * a)) * pow(f(mod(-a * 8., 8.) / 3.), 6. - 3. * b)
#define d(a) +exp(-3. * a) * vec2(s(8. * t + a * .3, a), s(8. * t + a * .5, a))
vec2 mainSound(float t) {
  return .3 * vec2(3. * sin(3e2 * t) * pow(f(-t * 2.), 4.) +
                   .5 * sin(4e5 * t) * f(-t * 2. + .5) d(0.) d(.5) d(1.) d(2.));
}