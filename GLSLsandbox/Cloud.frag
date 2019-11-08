/*
	2D Cloud operation

	Made by: IVY

	you can check out how it looks on minecraft

	https://www.minecraftforum.net/forums/mapping-and-modding-java-edition/minecraft-mods/wip-mods/2953753-new-shader-pack-development
*/

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

float rand(float n) 
{ 
    return fract(sin(n)*43758.5453); 
}

float generateNoise(vec2 coord, float noiseResolution)
{
    coord /= noiseResolution;
    
    vec2 p = floor(coord);
    vec2 f = fract(coord);
    
    f = smoothstep(vec2(0.0), vec2(1.0), f);
    
    float n = p.x + p.y * noiseResolution;
    
    float p1 = mix(rand(n-1.0), rand(n), f.x);
    float p2 = mix(rand(n+(noiseResolution-1.0)), rand(n+noiseResolution), f.x);
    
    return mix(p1, p2, f.y);
}

void main( void ) 
{
	float cover = 0.5;
	float height = 1.5;
	
	// Noise resolution must be at least 64.0 or higher
	float noiseResolution = 64.0;
	
	float noise = 0.0;
	float frequency = 1.0;
	float amplify = 1.0;
	
	float speed = (time * noiseResolution) * 0.4;
	
	vec2 position = (gl_FragCoord.xy * height) + speed;
	
	for (int i = 0; i < 8; i++) 
	{
		noise += generateNoise((position * frequency) - speed, noiseResolution) * amplify; 
		frequency *= 2.0;
		amplify *= 0.5;
	}	  
	noise = noise - cover;
	
	gl_FragColor = vec4(noise);
}
