#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uState;
uniform vec2 uMouse;
uniform vec2 uMouseDir;
uniform float uRadius;
uniform vec2 uTexelSize;

void main() {
    vec2 uvL = vUv + vec2(-uTexelSize.x, 0.0);
    vec2 uvR = vUv + vec2(uTexelSize.x, 0.0);
    vec2 uvD = vUv + vec2(0.0, -uTexelSize.y);
    vec2 uvU = vUv + vec2(0.0, uTexelSize.y);

    vec4 dataL = texture(uState, uvL);
    vec4 dataR = texture(uState, uvR);
    vec4 dataD = texture(uState, uvD);
    vec4 dataU = texture(uState, uvU);
    vec4 dataC = texture(uState, vUv);

    vec2 velC = (dataC.xy - 0.5) * 2.0;
    
    float densL = dataL.z;
    float densR = dataR.z;
    float densD = dataD.z;
    float densU = dataU.z;

    vec4 advectedData = texture(uState, vUv - velC * uTexelSize * 1.8);
    vec2 velAdvected = (advectedData.xy - 0.5) * 2.0;
    float densAdvected = advectedData.z;

    vec2 pressure = vec2(densR - densL, densU - densD) * 0.15;

    vec2 velL = (dataL.xy - 0.5) * 2.0;
    vec2 velR = (dataR.xy - 0.5) * 2.0;
    vec2 velD = (dataD.xy - 0.5) * 2.0;
    vec2 velU = (dataU.xy - 0.5) * 2.0;
    vec2 velDiffused = (velL + velR + velD + velU) * 0.25;
    float densDiffused = (densL + densR + densD + densU) * 0.25;

    vec2 nextVel = mix(velAdvected, velDiffused, 0.12) - pressure;
    float nextDens = mix(densAdvected, densDiffused, 0.06);

    float dist = distance(vUv, uMouse);
    if (dist < uRadius) {
        float force = 1.0 - (dist / uRadius);
        force = smoothstep(0.0, 1.0, force);
        nextVel += uMouseDir * force * 0.4;
        nextDens += force * 0.6;
    }

    nextVel *= 0.965;
    nextDens *= 0.985;

    fragColor = vec4(nextVel * 0.5 + 0.5, clamp(nextDens, 0.0, 1.0), 1.0);
}