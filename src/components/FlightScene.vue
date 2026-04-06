<template>
  <div class="flight-scene" ref="sceneRef" :style="{ backgroundColor: currentBgColor }">
    <!-- Paper Plane -->
    <div 
      class="paper-plane-wrapper"
      :style="{
        transform: `translate3d(${planeState.x}vw, ${planeState.y}vh, 0) rotate(${planeState.rotation}deg) scale(${planeState.scale})`,
        opacity: planeState.opacity
      }"
    >
      <svg class="paper-plane" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        <polygon points="22 2 11 13 11 20 15 16"></polygon>
      </svg>
      <!-- Trail -->
      <div class="trail" :style="{ opacity: planeState.speed > 1 ? 0.8 : 0 }"></div>
    </div>

    <!-- Stops Content -->
    <div class="stops-container">
      <div 
        v-for="(stop, index) in stops" 
        :key="stop.id"
        class="stop-card"
        :style="{
          opacity: cardsState[index].opacity,
          transform: `translateY(${cardsState[index].y}px) scale(${cardsState[index].scale})`,
          pointerEvents: cardsState[index].opacity > 0.5 ? 'auto' : 'none',
          zIndex: currentStopIndex === index ? 10 : 1
        }"
      >
        <div class="card-image-wrapper">
          <img :src="stop.image" :alt="stop.name" class="card-image" />
          <div class="card-overlay"></div>
        </div>
        <div class="card-content">
          <div class="stop-badge">{{ stop.name }}</div>
          <h2 class="headline">{{ stop.headline }}</h2>
          <p class="caption">{{ stop.caption }}</p>
        </div>
      </div>
    </div>
    
    <!-- Next button -->
    <button 
      class="next-btn" 
      :style="{ 
        opacity: uiState.nextBtnOpacity,
        transform: `translateY(${uiState.nextBtnY}px)`,
        pointerEvents: uiState.nextBtnOpacity > 0.5 ? 'auto' : 'none'
      }"
      @click="handleNextAction"
    >
      {{ isLastStop ? '冲向未来' : '继续飞行' }}
    </button>
    <Transition name="fade">
      <PhotoWallScene v-if="showPhotoWall" :images="currentImages" @close="closePhotoWall" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';
import gsap from 'gsap';
import { graduationData } from '../data/config';
import PhotoWallScene from './PhotoWallScene.vue';

const emit = defineEmits(['finish']);
const stops = graduationData.stops;

// Reactive states for Vue to render, GSAP will animate these objects
const planeState = reactive({
  x: -20, // vw
  y: 80,  // vh
  rotation: 45,
  scale: 0.5,
  opacity: 0,
  speed: 0
});

const cardsState = reactive(
  stops.map(() => ({
    opacity: 0,
    y: 50,
    scale: 0.95
  }))
);

const uiState = reactive({
  nextBtnOpacity: 0,
  nextBtnY: 20
});

const currentBgColor = ref(stops[0].ambientColor);
const currentStopIndex = ref(-1);
const showPhotoWall = ref(false);
const currentImages = ref<string[]>([]);
let tl: gsap.core.Timeline | null = null;

const isLastStop = computed(() => currentStopIndex.value === stops.length - 1);

const playCardReveal = (index: number) => {
  currentStopIndex.value = index;
  currentBgColor.value = stops[index].ambientColor;

  gsap.to(cardsState[index], {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 1.5,
    ease: 'power3.out',
  });

  gsap.to(uiState, {
    nextBtnOpacity: 1,
    nextBtnY: 0,
    duration: 1,
    delay: 1,
    ease: 'power2.out'
  });
};

const hideCurrentCard = () => {
  if (currentStopIndex.value >= 0) {
    const idx = currentStopIndex.value;
    gsap.to(cardsState[idx], {
      opacity: 0,
      y: -50,
      scale: 1.05,
      duration: 1,
      ease: 'power2.in'
    });
  }

  gsap.to(uiState, {
    nextBtnOpacity: 0,
    nextBtnY: 20,
    duration: 0.5,
    ease: 'power2.in'
  });
};

const handleNextAction = () => {
  if (currentStopIndex.value >= 0 && stops[currentStopIndex.value].images?.length) {
    currentImages.value = stops[currentStopIndex.value].images;
    showPhotoWall.value = true;
  } else {
    flyToNext();
  }
};

const closePhotoWall = () => {
  showPhotoWall.value = false;
  flyToNext();
};

const flyToNext = () => {
  hideCurrentCard();
  
  const nextIndex = currentStopIndex.value + 1;
  
  if (nextIndex >= stops.length) {
    // Finish flight
    tl = gsap.timeline({
      onComplete: () => emit('finish')
    });
    
    tl.to(planeState, {
      x: 120,
      y: -20,
      rotation: -15,
      scale: 1.5,
      speed: 2,
      duration: 2,
      ease: 'power2.in'
    }).to(planeState, {
      opacity: 0,
      duration: 0.5
    }, '-=0.5');
    
    return;
  }

  // Calculate generic flight path (zig-zag upward)
  const isEven = nextIndex % 2 === 0;
  const targetX = isEven ? 70 : 30; // vw
  const targetY = 70 - (nextIndex * 15); // Move up screen
  const targetRotation = isEven ? -15 : 15;

  tl = gsap.timeline({
    onComplete: () => playCardReveal(nextIndex)
  });

  // Boost phase
  tl.to(planeState, { speed: 2, duration: 0.2 })
    // Fly to position
    .to(planeState, {
      x: targetX,
      y: targetY,
      rotation: targetRotation,
      scale: 1,
      duration: 2.5,
      ease: 'sine.inOut'
    })
    // Settle down
    .to(planeState, { speed: 0, duration: 0.5 }, '-=0.5');
};

const initIntro = () => {
  // Initial spawn
  tl = gsap.timeline({
    onComplete: () => {
      flyToNext();
    }
  });

  tl.to(planeState, {
    opacity: 1,
    duration: 1
  }).to(planeState, {
    x: 50,
    y: 75,
    rotation: 0,
    duration: 2,
    ease: 'power2.out'
  });
};

onMounted(() => {
  initIntro();
});

onBeforeUnmount(() => {
  if (tl) tl.kill();
  gsap.killTweensOf([planeState, uiState, ...cardsState]);
});
</script>

<style scoped>
.flight-scene {
  position: absolute;
  inset: 0;
  overflow: hidden;
  transition: background-color 2s ease;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.paper-plane-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 48px;
  height: 48px;
  z-index: 30;
  will-change: transform;
  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.8));
}

.paper-plane {
  width: 100%;
  height: 100%;
  animation: float 3s ease-in-out infinite;
}

.trail {
  position: absolute;
  top: 50%;
  right: 100%;
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 100%);
  transform: translateY(-50%);
  transition: opacity 0.3s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
}

.stops-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  height: 70vh;
  perspective: 1000px;
}

.stop-card {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -30vh;
  margin-left: -45%;
  width: 90%;
  height: 60vh;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  will-change: transform, opacity;
}

.card-image-wrapper {
  position: relative;
  height: 50%;
  width: 100%;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 10s ease;
}

.stop-card:hover .card-image {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%);
}

.card-content {
  padding: 2rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.stop-badge {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #fff;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}

.headline {
  font-family: 'Noto Serif SC', serif;
  font-size: clamp(24px, 5vw, 40px);
  color: #fff;
  margin: 0 0 1rem 0;
  line-height: 1.3;
}

.caption {
  font-size: clamp(14px, 3vw, 18px);
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0;
}

.photo-wall {
  width: 100%;
  margin-top: 1.5rem;
  overflow: hidden;
}
.next-btn {
  position: absolute;
  bottom: 8%;
  left: 50%;
  margin-left: -80px;
  width: 160px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 30px;
  color: #fff;
  font-size: 1.1rem;
  letter-spacing: 0.1em;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: background 0.3s;
  z-index: 20;
}

.next-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
