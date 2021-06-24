uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

varying float vElevation;

void main()
{
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color= mix(uDepthColor, uSurfaceColor, mixStrength);
    gl_FragColor = vec4(color, 0.5);
    
}