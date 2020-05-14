#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = acos(-1.0);
const float rPI = 1.0 / PI;

vec3 hsv2rgb(vec3 c) {
	const vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;
	float h = atan(position.x - 0.5, position.y - 0.5) * rPI * 0.5 + 0.5;
	float s = 1.0 - exp2(-distance(position, vec2(0.5)) * 16.0);

	vec3 color = vec3(0.0);
	     color = hsv2rgb(vec3(h,s,float(s < 0.99)));

	gl_FragColor = vec4(color, 1.0 );

}

