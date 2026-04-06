<template>
  <div class="intro-scene" ref="sceneRef">
    <div class="sunset-bg"></div>
    <div class="content">
      <h1 class="title">
        <span class="word">盛夏</span>
        <span class="word">的</span>
        <span class="word">告别</span>
      </h1>
      <p class="subtitle">属于我们的青春纪念册</p>
      <button class="launch-btn" @click="startJourney">放飞这一程</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import gsap from 'gsap';

const emit = defineEmits(['start']);
const sceneRef = ref<HTMLElement | null>(null);

onMounted(() => {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('.sunset-bg', { opacity: 1, duration: 2 })
      .to('.title .word', {
        y: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.2,
      }, '-=1')
      .to('.subtitle', { y: 0, opacity: 1, duration: 1 }, '-=0.5')
      .to('.launch-btn', { y: 0, opacity: 1, scale: 1, duration: 1 }, '-=0.5');
  }, sceneRef.value!);

  return () => ctx.revert(); // cleanup
});

const startJourney = () => {
  // Exit animation
  gsap.to('.content', {
    y: -50,
    opacity: 0,
    duration: 1,
    ease: 'power2.inOut',
    onComplete: () => {
      emit('start');
    }
  });
};
</script>

<style scoped>
.intro-scene {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 20;
}

.sunset-bg {
  position: absolute;
  inset: -10%;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 25%, #ff9a9e 75%, #fecfef 100%);
  background-size: 200% 200%;
  filter: blur(20px);
  opacity: 0; /* Pre-hide */
  z-index: -1;
  animation: bg-drift 20s ease infinite alternate;
}

@keyframes bg-drift {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

.content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  z-index: 10;
}

.title {
  display: flex;
  gap: 0.5rem;
  font-family: 'Noto Serif SC', serif;
  font-size: clamp(40px, 10vw, 90px);
  font-weight: 700;
  color: #fff;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  margin: 0;
  line-height: 1.2;
}

.title .word {
  opacity: 0;
  transform: translateY(30px);
  display: inline-block;
  background: linear-gradient(180deg, #ffffff 0%, #ffd1ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: clamp(16px, 4vw, 24px);
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.2em;
  opacity: 0;
  transform: translateY(20px);
}

.launch-btn {
  margin-top: 2rem;
  padding: 1rem 3rem;
  font-size: clamp(18px, 3vw, 24px);
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  opacity: 0;
  transform: translateY(20px) scale(0.95);
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.1em;
}

.launch-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.6);
  transform: translateY(-2px) !important; /* GSAP sets inline, need important for hover */
  box-shadow: 0 12px 40px rgba(255, 209, 255, 0.3);
}
</style>
