"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Create scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 25;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Particle settings
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 800 : 2500;
    
    // Geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const initialPositions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    // Distribute particles in a grid / wave plane
    const columns = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / columns);
    const spacing = 1.8;

    let index = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        if (index >= count) break;
        
        // Grid coordinates centered
        const x = (c - columns / 2) * spacing;
        const z = (r - rows / 2) * spacing;
        const y = 0; // Will be animated

        positions[index * 3] = x;
        positions[index * 3 + 1] = y;
        positions[index * 3 + 2] = z;

        initialPositions[index * 3] = x;
        initialPositions[index * 3 + 1] = y;
        initialPositions[index * 3 + 2] = z;

        sizes[index] = Math.random() * 2 + 1;
        index++;
      }
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    // Particle Texture (draw a clean circle programmatically)
    const createCircleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.arc(8, 8, 7, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }
      return new THREE.CanvasTexture(canvas);
    };

    // Material - Klein Blue styled particles
    const material = new THREE.PointsMaterial({
      color: 0x1f3fbf, // Klein Blue
      size: 0.28,
      transparent: true,
      opacity: 0.45,
      map: createCircleTexture(),
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Rotate particles slightly to give perspective
    particles.rotation.x = Math.PI * 0.28;
    particles.rotation.z = Math.PI * 0.05;

    // Mouse coordinates (normalized)
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.targetX = (event.clientX / window.innerWidth - 0.5) * 6;
      mouse.targetY = (event.clientY / window.innerHeight - 0.5) * 6;
    };

    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // Scroll coordinates
    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Animation variables
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      if (prefersReducedMotion) {
        renderer.render(scene, camera);
        return;
      }

      animationFrameId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      const positionsArr = particles.geometry.attributes.position.array as Float32Array;

      // Animating the particles into a double-sine wave
      const timeFactor = elapsed * 0.85;
      for (let i = 0; i < count; i++) {
        const x = initialPositions[i * 3];
        const z = initialPositions[i * 3 + 2];

        // Complex wave function for natural motion
        const wave1 = Math.sin(x * 0.15 + timeFactor) * 2.2;
        const wave2 = Math.cos(z * 0.18 + timeFactor * 1.2) * 1.8;
        const wave3 = Math.sin((x + z) * 0.08 + timeFactor * 0.5) * 1.2;

        positionsArr[i * 3 + 1] = wave1 + wave2 + wave3;
      }

      particles.geometry.attributes.position.needsUpdate = true;

      // Smooth mouse follow (lerp)
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Adjust particles rotation/position on mouse & scroll
      particles.rotation.y = mouse.x * 0.08;
      particles.rotation.x = Math.PI * 0.28 + mouse.y * 0.06;
      
      // Move scene vertically slightly based on scroll
      particles.position.y = -scrollY * 0.012;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (rendererRef.current && containerRef.current) {
        try {
          containerRef.current.removeChild(renderer.domElement);
        } catch (e) {
          // ignore already removed
        }
      }
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[0] overflow-hidden"
      style={{
        maskImage: "radial-gradient(circle at 60% 40%, black, transparent 80%)",
        WebkitMaskImage: "radial-gradient(circle at 60% 40%, black, transparent 80%)",
      }}
    />
  );
}
