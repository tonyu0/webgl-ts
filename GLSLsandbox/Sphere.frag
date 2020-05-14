#ifdef GL_ES
//precision highp float;
precision lowp float;
#endif

uniform float time;
varying vec2 surfacePosition;
  
#define ptpi 1385.4557313670110891409199368797 //powten(pi)
#define pipi  36.462159607207911770990826022692 //pi pied, pi^pi
#define picu  31.006276680299820175476315067101 //pi cubed, pi^3
#define pepi  23.140692632779269005729086367949 //powe(pi);
#define chpi  11.59195327552152062775175205256  //cosh(pi)
#define shpi  11.548739357257748377977334315388 //sinh(pi)
#define pisq  9.8696044010893586188344909998762 //pi squared, pi^2
#define twpi  6.283185307179586476925286766559  //two pi, 2*pi
#define pi    3.1415926535897932384626433832795 //pi
#define e     2.7182818284590452353602874713526 //eulers number 
#define sqpi  1.7724538509055160272981674833411 //square root of pi
#define phi   1.6180339887498948482045868343656 //golden ratio
#define hfpi  1.5707963267948966192313216916398 //half pi, 1/pi
#define cupi  1.4645918875615232630201425272638 //cube root of pi
#define prpi  1.4396194958475906883364908049738 //pi root of pi
#define lnpi  1.1447298858494001741434273513531 //logn(pi);
#define trpi  1.0471975511965977461542144610932 //one third of pi, pi/3
#define thpi  0.99627207622074994426469058001254//tanh(pi)
#define lgpi  0.4971498726941338543512682882909 //log(pi)      
#define rcpi  0.31830988618379067153776752674503// reciprocal of pi  , 1/pi 
#define rcpipi  0.0274256931232981061195562708591 // reciprocal of pipi  , 1/pipi

float time1 = ((time));
float time2 = (rcpi*(pi+time1/pisq))+pepi;
float time3 = (lgpi*(pi+time1/chpi))+chpi;

vec3 axis1 = normalize(vec3(sin(time2*(prpi)), cos(time3*(cupi)), cos(time3*(hfpi)) ));
vec3 axis2 = normalize(vec3(cos(time3*(-trpi)/pi), sin(time2*(rcpi)/pi), sin(time3*(lgpi)/pi) ));
vec3 axis3 = normalize(vec3(cos(time2*(trpi)), sin(time2*(-rcpi)), sin(time3*(lgpi)) ));
float axissum = (axis1.x+axis1.y+axis1.z+axis2.x+axis2.y+axis2.z+axis3.x+axis3.y+axis3.z);

vec3 camPos = (vec3(0.0, 0.0, -1.0));
vec3 camUp  = (vec3(0.0,1.0,0.0));
float focus = pi;
vec3 camTarget = vec3(0.5)*axis3;

vec3 rotate(vec3 vec, vec3 axis, float ang)
{
    return vec * cos(ang) + cross(axis, vec) * sin(ang) + axis * dot(axis, vec) * (1.0 - cos(ang));
}



vec3 pin(vec3 v)
{
    v.zxy = vec3(sin(v.x),sin(v.y+1.04719),sin(v.z+4.18879))*0.5+0.5;
    return (v);
}

vec3 spin(vec3 v)
{
    for(int i = 1; i <4; i++)
    {
        v=pin(rotate((v),pin(v),pi/float(i)))*e;
    }
    return (v.xyz);
}

vec3 fin(vec3 v){

	vec4 vt = vec4(v,(v.x+v.y+v.z)/pi);
	vec4 vs = vt;
	vt.xyz  += pin(vs.xyz);
	vt.xyz  += pin(vs.yzw);
	vt.xyz  += pin(vs.zwx);
	vt.xyz  += pin(vs.wxy);
	return spin(vt.xyz/pisq);
}


vec3 sfin(vec3 v)
{
    for(int i = 1; i < 4; i++)
    {
        v =(v+fin(v*float(i)));
    }
    return (normalize((pin(v.zxy)))+(spin(v.zxy*rcpi)));
}

float smin( float f1, float f2 )
{
    float h = clamp(0.5+0.5*(f2-f1)*100., 0.0, 1.0);
    return mix(f2, f1, h) - 0.01*h*(1.0-h);
}

float smax( float f1, float f2 )
{
    float h = clamp(0.5+0.5*(f2-f1)*-5., 0.0, 1.0);
    return mix(f2, f1, h) + 0.2*h*(1.0-h);
}

float map(vec3 p)
{
	vec3 v1 = rotate(rotate(log(trpi+pow(p,vec3(sqpi))),axis1,axissum),normalize(p),(p.x+p.y+p.z)*rcpi);

    return abs(smax(-smin( smin(length(v1.xy)-thpi, length(v1.yz)-thpi), length(v1.zx)-thpi), length(v1)-hfpi));
}



vec3 nrm(vec3 p) {
	vec2 q = vec2(0.000001, 0.000005);
	return normalize(vec3( map(p + q.yxx) - map(p - q.yxx),
		     map(p + q.xyx) - map(p - q.xyx),
		     map(p + q.xxy) - map(p - q.xxy) ));
}


void main( void )
{
    vec2 pos = (surfacePosition)*twpi;//(sin(t*pi)+2.0);
    float ang = (sin(time2*lnpi)*pi)+(distance(axis3,axis2)+distance(axis1,axis3)+distance(axis2,axis1));
    camPos = pisq*(camPos * cos(ang) + cross(axis1, camPos) * sin(ang) + axis1 * dot(axis1, camPos) * (1.0 - cos(ang)));
   
    vec3 camDir = normalize(camTarget-camPos);
    camUp = rotate(camUp, camDir, sin(time2*prpi)*pi);
    vec3 camSide = cross(camDir, camUp);
    vec3 sideNorm=normalize(cross(camUp, camDir));
    vec3 upNorm=cross(camDir, sideNorm);
    vec3 worldFacing=(camPos + camDir);
    vec3 rayDir = -normalize((worldFacing+sideNorm*pos.x + upNorm*pos.y - camDir*((focus))));
   
    float show=0.0;
   
    float r = .1;
    float s = 0.9;
    float temp = 0.;
    vec3 vt = vec3(0.0);
    vec3 ht = vec3(0.0);
    vec3 tv = vec3(0.0);
    for(int i = 0 ; i < 200; i++) {
	temp = map((camPos + rayDir * (r)));
    	if(temp < 0.0001) 
    	{
		
		show = 1.;
		tv =vt+sfin(pi*(camPos + rayDir * (r)));
     		vt = (vt+(tv/(float(i)*r))*(e/(e+exp((tv.x+tv.y+tv.z)))))*0.5;
		if( ht==vec3(0.0))
		{
			ht = (camPos + rayDir * (r));
			rayDir =  refract(rayDir, camPos/pisq, phi);
			///break;
		}
     		r += 0.001;
		s*=.98;
		
    	}
    	if(r>pepi){break;} 
    	r += temp;
    	s+=0.03;
    }
    vt=normalize(vt);
    float n=clamp(0.5,0.9,abs(dot(rayDir*2.5,nrm(ht))/((s)))); 
    vec3 clr =show*(vt)*(n);	
    gl_FragColor = vec4(clr, 1.0);
}
