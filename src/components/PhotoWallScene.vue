<template>
  <div class="photo-wall-scene">
    <div class="instruction">
      <h2 class="title">时光碎片</h2>
      <p class="subtitle">触碰这些散落的记忆</p>
    </div>
    
    <div 
      v-for="photo in photos" 
      :key="photo.id"
      class="photo-card"
      :style="{
        transform: `translate(${photo.x}vw, ${photo.y}vh) rotate(${photo.rotation}deg) scale(${photo.scale})`,
        opacity: photo.opacity,
        zIndex: photo.zIndex
      }"
      @mouseenter="handleHover(photo)"
      @click="handleClick(photo)"
    >
      <div class="photo-inner">
        <img :src="photo.src" alt="memory" draggable="false" />
      </div>
    </div>
    
    <button class="btn btn-primary continue-btn" @click="$emit('close')">
      继续飞行
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';

const props = defineProps<{
  images: string[];
}>();

const emit = defineEmits(['close']);

const photos = ref<Array<{
  id: number;
  src: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  speedX: number;
  speedY: number;
  opacity: number;
  zIndex: number;
}>>([]);

let animationFrameId: number;

function initPhotos() {
  // We want to generate floating photos based on the passed images.
  // If there are too few, we can duplicate them to make the screen look full, or just use what we have.
  const displayImages = [...props.images];
  if (displayImages.length < 6) {
    // duplicate to make it look dense enough
    displayImages.push(...props.images);
  }

  photos.value = displayImages.map((src, i) => {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 0.05 + 0.03; // minimum speed 0.03 vw/vh per frame, max 0.08 (slow elegant drift)
    return {
      id: i,
      src,
      x: Math.random() * 80, // vw
      y: Math.random() * 80, // vh
      rotation: Math.random() * 40 - 20,
      scale: Math.random() * 0.4 + 0.6,
      speedX: Math.cos(angle) * speed,
      speedY: Math.sin(angle) * speed,
      opacity: 0, // start invisible
      zIndex: 10
    };
  });

  // Fade in
  photos.value.forEach((p, i) => {
    gsap.to(p, { opacity: 1, duration: 1, delay: i * 0.1 });
  });
}

function animatePhotos() {
  photos.value.forEach(photo => {
    photo.x += photo.speedX;
    photo.y += photo.speedY;
    
    // Bounce off edges (vw/vh)
    if (photo.x < -10 || photo.x > 90) {
      photo.speedX *= -1;
    }
    if (photo.y < -10 || photo.y > 90) {
      photo.speedY *= -1;
    }
  });
  animationFrameId = requestAnimationFrame(animatePhotos);
}

function handleHover(photo: any) {
  gsap.to(photo, { scale: 1.2, zIndex: 50, duration: 0.3 });
}

function handleClick(photo: any) {
  gsap.to(photo, {
    rotation: 0,
    scale: 1.5,
    zIndex: 100,
    duration: 0.5,
    ease: 'back.out(1.7)',
    onComplete: () => {
      setTimeout(() => {
        gsap.to(photo, {
          scale: Math.random() * 0.4 + 0.6,
          zIndex: 10,
          duration: 0.5
        });
      }, 1000);
    }
  });
}

onMounted(() => {
  initPhotos();
  animatePhotos();
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
});
</script>

<style scoped>
.photo-wall-scene {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  z-index: 100;
  overflow: hidden;
}

.instruction {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 100;
  color: #fff;
  pointer-events: none;
}

.title {
  font-size: clamp(32px, 5vw, 48px);
  margin-bottom: 0.5rem;
  font-family: 'Noto Serif SC', serif;
  background: linear-gradient(135deg, #ff7171, #ff9a9e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  letter-spacing: 0.1em;
}

.photo-card {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 10px 30px 10px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  border-radius: 4px;
  cursor: pointer;
  transform-origin: center center;
  will-change: transform;
}

.photo-card:hover {
  box-shadow: 0 15px 40px rgba(255, 105, 180, 0.6);
}

.photo-inner {
  width: clamp(150px, 20vw, 250px);
  aspect-ratio: 4/3;
  overflow: hidden;
  border-radius: 2px;
}

.photo-inner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.continue-btn {
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  padding: 1rem 3rem;
  font-size: 1.1rem;
}
</style>
