<template>
  <div class="final-scene" ref="sceneRef">
    <div class="sky-bg"></div>
    <div class="card-container">
      <div class="certificate-card">
        <h1 class="headline">{{ finalData.headline }}</h1>
        <div class="message-body">
          <p v-for="(line, idx) in finalData.message" :key="idx" class="message-line">
            {{ line }}
          </p>
        </div>
        <div class="actions">
          <button class="btn btn-primary" @click="$emit('replay')">再看一遍</button>
        </div>
        <div class="footer">
          <span class="footer-text">{{ finalData.footer }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import gsap from 'gsap';
import { graduationData } from '../data/config';

const finalData = graduationData.finalCard;
const emit = defineEmits(['replay']);
const sceneRef = ref<HTMLElement | null>(null);

onMounted(() => {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline();

    tl.to('.sky-bg', { opacity: 1, duration: 2, ease: 'power2.inOut' })
      .to('.certificate-card', {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 1.5,
        ease: 'back.out(1.7)'
      }, '-=1')
      .to('.headline', { opacity: 1, y: 0, duration: 1 }, '-=0.5')
      .to('.message-line', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.3,
        ease: 'power2.out'
      }, '-=0.5')
      .to('.footer', { opacity: 1, duration: 1 }, '-=0.2').to('.actions', { opacity: 1, y: 0, duration: 1 }, '-=0.5');
  }, sceneRef.value!);

  return () => ctx.revert();
});
</script>

<style scoped>
.final-scene {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  overflow: hidden;
}

.sky-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, #ffd1ff 0%, #a1c4fd 50%, #2a5298 100%);
  opacity: 0;
  z-index: -1;
  animation: pulse-bg 10s infinite alternate;
}

@keyframes pulse-bg {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}

.card-container {
  perspective: 1000px;
  width: 90%;
  max-width: 800px;
}

.certificate-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  padding: 4rem 3rem;
  text-align: center;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  opacity: 0;
  transform: translateY(100px) rotateX(20deg);
  will-change: transform, opacity;
}

.headline {
  font-family: 'Noto Serif SC', serif;
  font-size: clamp(36px, 8vw, 64px);
  color: #fff;
  margin: 0 0 3rem 0;
  letter-spacing: 0.15em;
  opacity: 0;
  transform: translateY(20px);
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.message-body {
  margin-bottom: 4rem;
}

.message-line {
  font-size: clamp(16px, 4vw, 24px);
  color: rgba(255, 255, 255, 0.9);
  line-height: 2.2;
  margin: 0.5rem 0;
  letter-spacing: 0.05em;
  opacity: 0;
  transform: translateY(20px);
}

.footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  opacity: 0;
}

.footer-text {
  font-size: clamp(14px, 3vw, 18px);
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.2em;
}
</style>

<style scoped>
.actions {
  margin-top: 2rem;
  opacity: 0;
  transform: translateY(20px);
}
</style>
