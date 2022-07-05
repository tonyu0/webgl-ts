#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec3 Hue_(float hue){
	vec3 rgb = fract(hue + vec3(0.0, 2.0/3.0, 1.0/3.0));
	rgb = abs(rgb*2.0 - 1.0);
	return clamp(rgb*3.0-1.0, 0.0, 1.0);
}
vec3 HSVtoRGB(vec3 hsv){
	return ((Hue_(hsv.x)-1.0)*hsv.y + 1.0) * hsv.z;
}
vec2 zoom(vec2 p, vec2 center, float zoom){
	return (p - center) / zoom + center;
}

void main( void ) {
	const int max_iter = 600;
	vec2 c = ( gl_FragCoord.xy / resolution.xy ) * 4. - 2.;
	vec2 z = vec2(0.);
	//c = zoom(c, vec2( -.10881, 0.901), pow(0.1 * 200., 2.5));
	c = zoom(c, vec2( -.10881, 0.901), pow(abs(sin(time/8.)) * 100., 2.));
	float iterations = float(max_iter);
	for(int i=0; i<max_iter; i++) {
		float x = (pow(z.x, 2.0) - pow(z.y, 2.)) + c.x;
		
		float y = 2. * z.y * z.x + c.y;
		
		if((x * x + y * y) > 4.0) {
			iterations = float(i);
			break;
		}
		
		z.x = x;
		z.y = y;
	}
	gl_FragColor = vec4(HSVtoRGB(vec3(iterations/float(max_iter), 1.0, 0.6)), 1.0 );

}
