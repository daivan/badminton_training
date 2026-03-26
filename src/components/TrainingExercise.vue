<template>
  <div class="training-exercise">
    <!-- Prep Phase -->
    <div v-if="!exerciseActive && !isFinished" class="prep-phase">
      <h2>Get Ready!</h2>
      <div class="large-countdown">{{ formatTime(currentCountdown).short }}</div>
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: progressBarWidth }"></div>
      </div>
    </div>

    <!-- Active Phase -->
    <template v-else-if="exerciseActive">
      <div class="shot-info">
        <div class="action-text">{{ currentAction }}</div>
        <img v-if="currentCall" :src="currentCall.src" :alt="currentCall.label" class="call-image" />
        <div class="shot-label">{{ currentCall?.label }}</div>
      </div>

      <div class="timers">
        <div class="timer-card">
          <label>Next Shot</label>
          <div class="time">{{ formatTime(currentCountdown).short }}</div>
          <div class="mini-progress">
            <div class="bar" :style="{ width: progressBarWidth }"></div>
          </div>
        </div>
        <div class="timer-card">
          <label>Remaining</label>
          <div class="time">{{ formatTime(sessionCountdown).full }}</div>
        </div>
      </div>
    </template>

    <!-- Finished Phase -->
    <div v-else-if="isFinished" class="finish-phase">
      <h1>Well Done!</h1>
      <p>Training session completed.</p>
      <button class="back-btn" @click="emit('end-training')">Return to Menu</button>
    </div>

    <button v-if="exerciseActive" class="stop-btn" @click="emit('end-training')">Stop</button>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useTrainingEngine } from '../composables/useTrainingEngine';
import { useSettings } from '../composables/useSettings';

const emit = defineEmits(['end-training']);
const { selectedDuration, selectedInterval } = useSettings();
const {
  currentCountdown,
  sessionCountdown,
  currentCall,
  currentAction,
  exerciseActive,
  isFinished,
  maxInterval,
  startTraining,
  formatTime,
} = useTrainingEngine();

const progressBarWidth = computed(() => {
  const total = exerciseActive.value ? maxInterval.value : 3000; // 3s prep
  const percentage = (currentCountdown.value / total) * 100;
  return `${Math.max(0, percentage)}%`;
});

onMounted(() => {
  startTraining(selectedDuration.value, selectedInterval.value);
});
</script>

<style scoped>
.training-exercise {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #1a1a1a;
  color: white;
  padding: 20px;
  text-align: center;
}

.prep-phase h2 {
  font-size: 3em;
  color: #ffc107;
  margin-bottom: 20px;
}

.large-countdown {
  font-size: 8em;
  font-weight: 800;
  font-family: monospace;
}

.shot-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
}

.action-text {
  font-size: 3.5em;
  font-weight: 800;
  color: #4CAF50;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 4px 10px rgba(0,0,0,0.5);
}

.call-image {
  max-width: 90%;
  max-height: 50vh;
  object-fit: contain;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}

.shot-label {
  font-size: 1.5em;
  opacity: 0.8;
}

.timers {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  width: 100%;
  max-width: 600px;
}

.timer-card {
  flex: 1;
  background: rgba(255,255,255,0.1);
  padding: 15px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.timer-card label {
  font-size: 0.8em;
  text-transform: uppercase;
  color: #adb5bd;
}

.timer-card .time {
  font-size: 2.5em;
  font-weight: 700;
  font-family: monospace;
}

.mini-progress {
  height: 4px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  margin-top: 10px;
  overflow: hidden;
}

.mini-progress .bar {
  height: 100%;
  background: #4CAF50;
  transition: width 0.05s linear;
}

.progress-bar-container {
  width: 300px;
  height: 10px;
  background: #333;
  border-radius: 5px;
  margin-top: 20px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #ffc107;
  transition: width 0.05s linear;
}

.finish-phase h1 {
  font-size: 4em;
  color: #4CAF50;
}

.back-btn, .stop-btn {
  padding: 12px 30px;
  font-size: 1.2em;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.back-btn { background: #007bff; color: white; }
.stop-btn { 
  background: rgba(255,255,255,0.1); 
  color: #ff4d4d; 
  margin-top: 20px;
}

.stop-btn:hover { background: rgba(255,77,77,0.2); }
</style>
