#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int steps = 300;
const float rSteps = 1.0 / float(steps);

const vec2 circlePos = vec2(0.5, 0.5);

float distField(vec2 p){
	float dist = (p.y - (cos(p.x * 20.0) * 0.5 + 0.5) * 0.1) - 0.3;
	
	return dist;
}

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;
	     position = position *2.0 - 1.0;
	     position.y *= resolution.y / resolution.x;
	     position = position * 0.5 + 0.5;

	vec3 color = vec3(0.0);
	vec2 p = position;
	vec2 dir = normalize(vec2(1.0, mouse.y * 2.0- 1.0));
	vec2 originalDir = dir; 
	
	float t = 0.0;
	vec2 originPoint = vec2(0.2, 0.5);
	
	bool hit = false;
	float d = 0.0;
	
	for (int i = 0; i < steps; ++i){
		float m = distField(originPoint);
		d += m;
		if (m < 0.001 || d > 2.0) break;
		
		float distpos = distance(position, originPoint);
		
		color = max(color, 
			    max(step(abs(distpos - m), 0.001) * vec3(1.0, 0.0, 0.0),
			    step(distance(originPoint, position), 0.005)* vec3(0.0, 0.0, 1.0)));
		
		originPoint += dir * 0.5 * m;
	}
	

	
	color = distField(position) < 0.001 ? vec3(1.0, 1.0, 1.0) : color;

	gl_FragColor = vec4(color, 1.0 );


}
