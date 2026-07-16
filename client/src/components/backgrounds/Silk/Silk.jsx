import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { forwardRef, useLayoutEffect, useMemo, useRef } from "react";
import { Color } from "three";

const hexToNormalizedRGB = (hex) => {
  hex = hex.replace("#", "");

  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
  ];
};

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;

  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(position,1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;

uniform float uTime;
uniform vec3 uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord){
    vec2 r = e*sin(e*texCoord);
    return fract(r.x*r.y*(1.0+texCoord.x));
}

vec2 rotateUvs(vec2 uv,float angle){
    float c=cos(angle);
    float s=sin(angle);

    return mat2(c,-s,s,c)*uv;
}

void main(){

    float rnd=noise(gl_FragCoord.xy);

    vec2 uv=rotateUvs(vUv*uScale,uRotation);

    vec2 tex=uv*uScale;

    float t=uSpeed*uTime;

    tex.y+=0.03*sin(8.0*tex.x-t);

    float pattern=
      0.6+
      0.4*sin(
      5.0*(tex.x+tex.y+
      cos(3.0*tex.x+5.0*tex.y)+
      0.02*t)+
      sin(20.0*(tex.x+tex.y-0.1*t))
      );

    vec4 col=
      vec4(uColor,1.0)*
      vec4(pattern);

    col-=rnd/15.0*uNoiseIntensity;

    gl_FragColor=col;
}
`;

const SilkPlane = forwardRef(function SilkPlane({ uniforms }, ref) {
  const { viewport } = useThree();

  useLayoutEffect(() => {
    ref.current.scale.set(viewport.width, viewport.height, 1);
  }, [viewport, ref]);

  useFrame((_, delta) => {
    ref.current.material.uniforms.uTime.value += delta * 0.1;
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
});

function Silk({
  speed = 4,
  scale = 1.1,
  color = "#313131",
  noiseIntensity = 0.8,
  rotation = 0,
}) {
  const meshRef = useRef();

  const uniforms = useMemo(
    () => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uRotation: { value: rotation },
      uColor: { value: new Color(...hexToNormalizedRGB(color)) },
      uTime: { value: 0 },
    }),
    [speed, scale, noiseIntensity, rotation, color]
  );

  return (
    <Canvas
      dpr={[1, 2]}
      frameloop="always"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <SilkPlane ref={meshRef} uniforms={uniforms} />
    </Canvas>
  );
}

export default Silk;