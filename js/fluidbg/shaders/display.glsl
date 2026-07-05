#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uState;
uniform vec2 uTexelSize;

void main() {
    vec4 dataC = texture(uState, vUv);
    vec2 vel = (dataC.xy - 0.5) * 2.0;
    float density = dataC.z;

    float l = texture(uState, vUv + vec2(-uTexelSize.x, 0.0)).z;
    float r = texture(uState, vUv + vec2(uTexelSize.x, 0.0)).z;
    float d = texture(uState, vUv + vec2(0.0, -uTexelSize.y)).z;
    float u = texture(uState, vUv + vec2(0.0, uTexelSize.y)).z;

    vec3 normal = normalize(vec3((r - l), (u - d), 0.12));
    vec3 lightDir = normalize(vec3(0.2, 0.4, 0.9));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(lightDir + viewDir);
    
    float spec = pow(max(dot(normal, halfDir), 0.0), 28.0);

    vec3 bgColor = vec3(0.071, 0.071, 0.071);       // #121212
    vec3 fluidColor = vec3(0.122, 0.122, 0.122);    // #1f1f1f
    vec3 primaryAccent = vec3(0.545, 0.000, 0.000); // #8b0000
    vec3 color = mix(bgColor, fluidColor, smoothstep(0.01, 0.4, density));
    
    float speed = length(vel);
    color += primaryAccent * density * 0.22;
    color += primaryAccent * speed * 0.14;

    color += vec3(spec * 0.38) * (density + 0.05);
    fragColor = vec4(color, 1.0);
}