"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

/*
 * Domain-warped ridged noise, mapped through a pastel palette and laid over
 * the page background. Veins drift slowly and stir around the cursor.
 */
const FRAG = `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uStrength;
uniform float uSeed;

const vec3 BG = vec3(0.949, 0.953, 0.945);
const vec3 C1 = vec3(0.941, 0.835, 0.745);
const vec3 C2 = vec3(0.910, 0.745, 0.859);
const vec3 C3 = vec3(0.765, 0.745, 0.949);

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p = rot * p * 2.04;
    a *= 0.5;
  }
  return v;
}

vec3 palette(float t) {
  if (t < 0.33) return mix(BG, C1, t / 0.33);
  if (t < 0.66) return mix(C1, C2, (t - 0.33) / 0.33);
  return mix(C2, C3, (t - 0.66) / 0.34);
}

void main() {
  float aspect = uRes.x / uRes.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0) * 3.2 + uSeed;
  float t = uTime * 0.05;

  // Smooth swirl around the cursor: rotate noise space about the pointer,
  // strongest at the centre and fading to nothing at the edge.
  vec2 pm = (uMouse - 0.5) * vec2(aspect, 1.0) * 3.2 + uSeed;
  float dist = length((vUv - uMouse) * vec2(aspect, 1.0));
  float near = smoothstep(0.28, 0.0, dist);
  float angle = near * near * uStrength * 1.1;
  float ca = cos(angle);
  float sa = sin(angle);
  vec2 d = p - pm;
  p = pm + vec2(ca * d.x - sa * d.y, sa * d.x + ca * d.y);

  vec2 q = vec2(fbm(p + t), fbm(p + vec2(3.1, 8.7) - t));
  vec2 r = vec2(fbm(p + 1.8 * q + vec2(1.7, 9.2) + t * 0.6), fbm(p + 1.8 * q + vec2(8.3, 2.8) - t * 0.8));
  float n = fbm(p + 2.0 * r);

  float vein = 1.0 - abs(n * 2.0 - 1.0);
  vein = pow(clamp(vein, 0.0, 1.0), 6.0);

  float cluster = smoothstep(0.42, 0.72, fbm(p * 0.45 - t * 0.4 + 11.0));
  float v = vein * cluster;

  vec3 col = mix(BG, palette(clamp(v * 1.4, 0.0, 1.0)), smoothstep(0.0, 0.6, v));
  gl_FragColor = vec4(col, 1.0);
}
`;

const RENDER_SCALE = 0.4;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Fixed, full-viewport animated background, ported unchanged from the
 * ReverseAI marketing site. Falls back to the flat page colour without WebGL.
 */
export default function NoiseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, depth: false });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.bindAttribLocation(program, 0, "aPos");
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uMouse = gl.getUniformLocation(program, "uMouse");
    const uStrength = gl.getUniformLocation(program, "uStrength");
    gl.uniform1f(gl.getUniformLocation(program, "uSeed"), Math.random() * 50);

    // Eased pointer position plus a swirl strength that builds while the
    // pointer moves and relaxes when it stops.
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, strength: 0, energy: 0 };
    const resize = () => {
      canvas.width = Math.max(2, Math.round(window.innerWidth * RENDER_SCALE));
      canvas.height = Math.max(2, Math.round(window.innerHeight * RENDER_SCALE));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth;
      const ny = 1 - e.clientY / window.innerHeight;
      mouse.energy = Math.min(1, mouse.energy + Math.hypot(nx - mouse.tx, ny - mouse.ty) * 6);
      mouse.tx = nx;
      mouse.ty = ny;
    };

    let lastTime = 0;
    const draw = (time: number) => {
      const dt = lastTime ? Math.min(0.1, (time - lastTime) / 1000) : 0.016;
      lastTime = time;
      // Frame-rate independent easing.
      const follow = 1 - Math.exp(-dt * 5);
      mouse.x += (mouse.tx - mouse.x) * follow;
      mouse.y += (mouse.ty - mouse.y) * follow;
      mouse.energy *= Math.exp(-dt * 1.2);
      mouse.strength += (mouse.energy - mouse.strength) * (1 - Math.exp(-dt * 3));

      gl.uniform1f(uTime, time / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uStrength, mouse.strength);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    resize();
    window.addEventListener("resize", resize);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      draw(0);
      return () => window.removeEventListener("resize", resize);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    let raf = 0;
    const loop = (time: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      draw(time);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <div aria-hidden data-noise-bg className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="block h-full w-full bg-[#f2f3f1]"
        style={{ filter: "blur(6px)", transform: "scale(1.04)" }}
      />
    </div>
  );
}
