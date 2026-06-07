"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function ShaderPlane() {
  const mat = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (mat.current) {
      mat.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        uniforms={{
          uTime: { value: 0 },
        }}
        vertexShader={`
          void main() {
            gl_Position = vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;

          float line(vec2 uv, vec2 a, vec2 b, float width) {
            vec2 pa = uv - a;
            vec2 ba = b - a;
            float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
            return smoothstep(width, 0.0, length(pa - ba * h));
          }

          void main() {
            vec2 uv = gl_FragCoord.xy / vec2(430.0, 896.0);
            uv.x *= 430.0 / 896.0;

            vec3 color = vec3(0.005, 0.02, 0.055);

            float scan = sin(gl_FragCoord.y * 1.7) * 0.025;
            color += scan;

            float left = smoothstep(0.018, 0.0, abs(uv.x - 0.035));
            float right = smoothstep(0.018, 0.0, abs(uv.x - 0.445));
            float top = smoothstep(0.018, 0.0, abs(uv.y - 0.965));
            float bottom = smoothstep(0.018, 0.0, abs(uv.y - 0.035));

            float border = max(max(left, right), max(top, bottom));
            color += vec3(0.0, 0.35, 1.0) * border * 1.8;

            float innerLeft = smoothstep(0.006, 0.0, abs(uv.x - 0.065));
            float innerRight = smoothstep(0.006, 0.0, abs(uv.x - 0.415));
            float innerTop = smoothstep(0.006, 0.0, abs(uv.y - 0.935));
            float innerBottom = smoothstep(0.006, 0.0, abs(uv.y - 0.065));

            float inner = max(max(innerLeft, innerRight), max(innerTop, innerBottom));
            color += vec3(0.0, 0.55, 1.0) * inner;

            float scratches = 0.0;
            scratches += line(uv, vec2(0.08,0.78), vec2(0.36,0.54), 0.0015);
            scratches += line(uv, vec2(0.12,0.42), vec2(0.38,0.21), 0.0013);
            scratches += line(uv, vec2(0.36,0.76), vec2(0.42,0.61), 0.0012);
            scratches += line(uv, vec2(0.10,0.18), vec2(0.36,0.08), 0.0012);
            scratches += line(uv, vec2(0.19,0.60), vec2(0.41,0.43), 0.0011);
            scratches += line(uv, vec2(0.32,0.89), vec2(0.44,0.76), 0.0010);

            color += vec3(0.0, 0.45, 1.0) * scratches * 1.7;

            float pulse = 0.75 + sin(uTime * 2.4) * 0.25;
            color += vec3(0.0, 0.6, 1.0) * border * pulse;

            float centerOpen = smoothstep(0.0, 1.0, uTime / 1.5);
            float mask = smoothstep(0.0, 0.5, abs(uv.x - 0.24) + centerOpen * 0.5);

            color *= mask;

            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}

export default function CyberBackground() {
  return (
    <div className="cyber-bg">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ShaderPlane />
      </Canvas>
    </div>
  );
}