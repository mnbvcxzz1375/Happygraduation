<script setup lang="ts">
import { ref } from 'vue';
import FloatingParticles from './components/FloatingParticles.vue';
import IntroScene from './components/IntroScene.vue';
import FlightScene from './components/FlightScene.vue';
import FinalCardScene from './components/FinalCardScene.vue';

const currentStage = ref<'intro' | 'flight' | 'photoWall' | 'final'>('intro');

const handleStart = () => {
  currentStage.value = 'flight';
};

const handleFinish = () => {
  currentStage.value = 'final';
};
</script>

<template>
  <div class="app-container">
    <FloatingParticles />
    
    <Transition name="fade" mode="out-in">
      <IntroScene 
        v-if="currentStage === 'intro'" 
        @start="handleStart" 
      />
      
      <FlightScene 
        v-else-if="currentStage === 'flight'"
        @finish="handleFinish"
      />
      
      <FinalCardScene 
        @replay="currentStage = 'intro'" 
        v-else-if="currentStage === 'final'"
      />
    </Transition>
  </div>
</template>

<style scoped>
.app-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #000; /* Fallback */
}

/* Simple crossfade for Vue Transition if needed */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
