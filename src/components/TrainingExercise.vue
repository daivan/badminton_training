<template>
  <div class="training-exercise">
    <h1 v-if="currentCountdown > 0" class="countdown">{{ currentCountdown }}</h1>
    <h1 v-else-if="showJump" class="call">Jump!</h1>
    <h1 v-else-if="exerciseActive" class="call">{{ currentCall }}</h1>
    <h1 v-else>Training Complete!</h1>
    <div v-if="exerciseActive" class="session-countdown">Time Left: {{ formattedSessionCountdown }}</div>
    <button v-if="!exerciseActive && currentCountdown === 0 && !showJump" @click="goBack">Go Back</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  duration: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['end-training']);

const currentCountdown = ref(3); // Countdown before exercise starts and before each call
const showJump = ref(false); // Controls the display of "Jump!"
const sessionCountdown = ref(0); // Total seconds remaining for the training session
const currentCall = ref('');
const exerciseActive = ref(false);
let countdownInterval = null; // Generic countdown interval
let sessionCountdownInterval = null;
let exerciseLoopTimeout = null; // Timeout for the main exercise loop

const calls = [
  'Short Forehand',
  'Short Backhand',
  'Late Forehand',
  'Late Backhand',
];
let callIndex = 0;

const startCountdown = (callback) => {
  currentCountdown.value = 3;
  showJump.value = false;
  countdownInterval = setInterval(() => {
    currentCountdown.value--;
    if (currentCountdown.value === 0) {
      clearInterval(countdownInterval);
      showJump.value = true;
      setTimeout(() => {
        showJump.value = false;
        if (callback) callback();
      }, 1000); // Display "Jump!" for 1 second
    }
  }, 1000);
};

const startExercise = () => {
  sessionCountdown.value = props.duration * 60; // Initialize session countdown in seconds

  sessionCountdownInterval = setInterval(() => {
    sessionCountdown.value--;
    if (sessionCountdown.value <= 0) {
      clearInterval(sessionCountdownInterval);
      clearTimeout(exerciseLoopTimeout);
      exerciseActive.value = false;
      emit('end-training');
    }
  }, 1000);

  const exerciseLoop = () => {
    if (sessionCountdown.value <= 0) return;

    startCountdown(() => {
      if (sessionCountdown.value <= 0) return;
      currentCall.value = calls[callIndex];
      callIndex = (callIndex + 1) % calls.length;
      exerciseLoopTimeout = setTimeout(exerciseLoop, 2000); // Display call for 2 seconds
    });
  };

  exerciseLoop();
};

const goBack = () => {
  emit('end-training');
};

onMounted(() => {
  startCountdown(() => {
    exerciseActive.value = true;
    startExercise();
  });
});

onUnmounted(() => {
  clearInterval(countdownInterval);
  clearInterval(sessionCountdownInterval);
  clearTimeout(exerciseLoopTimeout);
});
const formattedSessionCountdown = computed(() => {
  const minutes = Math.floor(sessionCountdown.value / 60);
  const seconds = sessionCountdown.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});
</script>

<style scoped>
.training-exercise {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: 'Arial', sans-serif;
  background-color: #282c34;
  color: white;
  text-align: center;
}

h1 {
  font-size: 5em;
  margin-bottom: 50px;
}

.session-countdown {
  font-size: 2em;
  color: #ffc107;
  margin-top: 20px;
}

.countdown {
  color: #ffc107;
}

.call {
  color: #17a2b8;
}

button {
  padding: 12px 25px;
  font-size: 1.3em;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

button:active {
  background-color: #004085;
  transform: translateY(0);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>