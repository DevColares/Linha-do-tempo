import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CosmicCanvasProps {
  intensity?: number;
}

// Gera uma textura radial com decaimento suave (efeito Bokeh / desfoque gaussiano suave)
function createSoftGlowTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(240, 245, 255, 0.75)');
  gradient.addColorStop(0.5, 'rgba(160, 200, 255, 0.25)');
  gradient.addColorStop(0.8, 'rgba(100, 150, 255, 0.08)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export const CosmicCanvas: React.FC<CosmicCanvasProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Cena, Câmera e Renderizador
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const glowTexture = createSoftGlowTexture();

    const isMobile = window.innerWidth < 768;

    // 1. Camada de Poeira Cósmica Muito Desfocada e Difusa (Bokeh de Fundo)
    const deepParticleCount = isMobile ? 350 : 900;
    const deepGeo = new THREE.BufferGeometry();
    const deepPositions = new Float32Array(deepParticleCount * 3);
    const deepColors = new Float32Array(deepParticleCount * 3);

    const softDeepColors = [
      new THREE.Color('#3b82f6'), // Azul cósmico
      new THREE.Color('#8b5cf6'), // Violeta
      new THREE.Color('#ec4899'), // Magenta etéreo
      new THREE.Color('#06b6d4'), // Ciano profundo
    ];

    for (let i = 0; i < deepParticleCount; i++) {
      const radius = THREE.MathUtils.randFloat(15, 80);
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloatSpread(Math.PI * 0.8);

      deepPositions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      deepPositions[i * 3 + 1] = radius * Math.sin(phi);
      deepPositions[i * 3 + 2] = THREE.MathUtils.randFloat(-70, -10);

      const color = softDeepColors[Math.floor(Math.random() * softDeepColors.length)];
      deepColors[i * 3] = color.r;
      deepColors[i * 3 + 1] = color.g;
      deepColors[i * 3 + 2] = color.b;
    }

    deepGeo.setAttribute('position', new THREE.BufferAttribute(deepPositions, 3));
    deepGeo.setAttribute('color', new THREE.BufferAttribute(deepColors, 3));

    const deepMaterial = new THREE.PointsMaterial({
      size: 1.6,
      map: glowTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const deepParticles = new THREE.Points(deepGeo, deepMaterial);
    scene.add(deepParticles);

    // 2. Camada Principal de Estrelas Desfocadas com Gradiente Suave
    const starCount = isMobile ? 450 : 1200;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const starPalette = [
      new THREE.Color('#f8fafc'),
      new THREE.Color('#93c5fd'),
      new THREE.Color('#c084fc'),
      new THREE.Color('#67e8f9'),
      new THREE.Color('#fed7aa'),
    ];

    for (let i = 0; i < starCount; i++) {
      const radius = THREE.MathUtils.randFloat(5, 70);
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloatSpread(Math.PI * 0.7);

      starPositions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      starPositions[i * 3 + 1] = radius * Math.sin(phi);
      starPositions[i * 3 + 2] = THREE.MathUtils.randFloat(-45, 15);

      const color = starPalette[Math.floor(Math.random() * starPalette.length)];
      starColors[i * 3] = color.r;
      starColors[i * 3 + 1] = color.g;
      starColors[i * 3 + 2] = color.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.85, // Pontos maiores e suavizados pelo mapa de gradiente
      map: glowTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const starParticles = new THREE.Points(starGeo, starMaterial);
    scene.add(starParticles);

    // Interação sutil com o mouse
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseX = (e.clientX - halfW) * 0.0005;
      mouseY = (e.clientY - halfH) * 0.0005;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Loop de Animação
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotação suave em velocidades diferentes para dar sensação de profundidade de campo
      starParticles.rotation.y = elapsedTime * 0.015;
      starParticles.rotation.x = elapsedTime * 0.006;

      deepParticles.rotation.y = elapsedTime * 0.008;
      deepParticles.rotation.z = -elapsedTime * 0.004;

      // Efeito de pulsação suave no brilho
      starMaterial.opacity = 0.65 + Math.sin(elapsedTime * 1.2) * 0.12;

      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;
      camera.position.x = targetX * 10;
      camera.position.y = -targetY * 10;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      deepGeo.dispose();
      deepMaterial.dispose();
      starGeo.dispose();
      starMaterial.dispose();
      glowTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
};
