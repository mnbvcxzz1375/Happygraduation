<template>
  <canvas ref="canvasRef" class="floating-particles"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const canvasRef = ref<HTMLCanvasElement | null>(null);

let animationFrameId: number;
let ctx: CanvasRenderingContext2D | null = null;
const particles: Particle[] = [];
let width = 0;
let height = 0;

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  life: number;
  maxLife: number;
}

const createParticle = (): Particle => {
  return {
    x: Math.random() * width,
    y: height + Math.random() * 20, // start slightly below screen
    size: Math.random() * 2 + 0.5,
    speedX: (Math.random() - 0.5) * 0.3,
    speedY: -(Math.random() * 0.5 + 0.2), // move upwards slowly
    opacity: 0,
    life: 0,
    maxLife: Math.random() * 300 + 200,
  };
};

const init = () => {
  if (!canvasRef.value) return;
  const canvas = canvasRef.value;
  ctx = canvas.getContext('2d');
  
  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  };
  
  window.addEventListener('resize', resize);
  resize();

  // Initial particles
  for (let i = 0; i < 150; i++) {
    const p = createParticle();
    p.y = Math.random() * height; // Distribute initially
    p.opacity = Math.random() * 0.5;
    particles.push(p);
  }

  animate();
  
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resize);
    cancelAnimationFrame(animationFrameId);
  });
};

const animate = () => {
  if (!ctx || !canvasRef.value) return;
  
  ctx.clearRect(0, 0, width, height);
  
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    
    p.x += p.speedX;
    p.y += p.speedY;
    p.life++;
    
    // Fade in and out based on life
    const progress = p.life / p.maxLife;
    if (progress < 0.2) {
      p.opacity = progress * 2.5; // max 0.5
    } else if (progress > 0.8) {
      p.opacity = (1 - progress) * 2.5;
    }
    
    // Drift slightly
    p.speedX += (Math.random() - 0.5) * 0.01;
    
    // Reset if dead or off screen
    if (p.life >= p.maxLife || p.y < -10) {
      particles[i] = createParticle();
    }
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 230, 200, ${p.opacity * 0.6})`; // Golden/white warm dust
    ctx.fill();
    
    // Glow effect
    ctx.shadowBlur = p.size * 2;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
  }
  
  animationFrameId = requestAnimationFrame(animate);
};

onMounted(() => {
  init();
});
</script>

<style scoped>
.floating-particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 10;
  mix-blend-mode: screen;
}
</style>
