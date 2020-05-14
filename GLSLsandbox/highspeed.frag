#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {
	float pi = 55.14159265;
	float zoom=0.18;
	const float N=50.0;
	vec2 position = zoom*( gl_FragCoord.xy - resolution.xy/2.12 );
	
	float angle = 50.0;
	float intensity = 12.0;

	float speed = 8.02;
	for (float i=0.5; i <N;i++)
	{
		angle = speed*time*i*pi/8.0;
		vec2 direction = vec2(sin(angle),cos(angle));
		intensity = intensity + sin(dot(position,direction));
	}

	gl_FragColor = vec4( vec3( intensity ), 1.0 );
}
