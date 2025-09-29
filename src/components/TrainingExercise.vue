<template>
  <div class="training-exercise">
    <h1 v-if="currentCountdown > 0" class="countdown">{{ formattedCurrentCountdown }}</h1>
    <h1 v-else-if="exerciseActive" class="call">{{ currentCall }}</h1>
    <h1 v-else>Training Complete!</h1>
    <div v-if="exerciseActive" class="session-countdown">Time Left: {{ formattedSessionCountdown }}</div>
    <button v-if="!exerciseActive && currentCountdown === 0" @click="goBack">Go Back</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineProps, defineEmits, computed } from 'vue';

const formattedCurrentCountdown = computed(() => {
  const totalMilliseconds = Math.max(0, currentCountdown.value);
  const seconds = Math.floor(totalMilliseconds / 1000);
  const milliseconds = Math.floor((totalMilliseconds % 1000) / 10);
  return `${seconds}.${milliseconds.toString().padStart(2, '0')}`;
});

const props = defineProps({
  duration: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['end-training']);

const currentCountdown = ref(3000); // Countdown before exercise starts and before each call (in milliseconds)
const sessionCountdown = ref(0); // Total milliseconds remaining for the training session
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
  currentCountdown.value = 3000; // Reset to 3 seconds in milliseconds
  countdownInterval = setInterval(() => {
    currentCountdown.value -= 10; // Decrement by 10 milliseconds
    if (currentCountdown.value <= 0) { // Check if less than or equal to 0
      clearInterval(countdownInterval);
      if (callback) callback();
    }
  }, 10); // Update every 10 milliseconds
};

const startExercise = () => {
  sessionCountdown.value = props.duration * 60 * 1000; // Initialize session countdown in milliseconds

  sessionCountdownInterval = setInterval(() => {
    sessionCountdown.value -= 10; // Decrement by 10 milliseconds
    if (sessionCountdown.value <= 0) {
      clearInterval(sessionCountdownInterval);
      clearTimeout(exerciseLoopTimeout);
      exerciseActive.value = false;
      emit('end-training');
    }
  }, 10); // Update every 10 milliseconds

  const exerciseLoop = () => {
    if (sessionCountdown.value <= 0) return;

    startCountdown(() => {
      if (sessionCountdown.value <= 0) return;
      currentCall.value = calls[callIndex];
      callIndex = (callIndex + 1) % calls.length;
      exerciseLoopTimeout = setTimeout(exerciseLoop, 2000); // Display call for 2 seconds (2000 milliseconds)
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
  const totalMilliseconds = Math.max(0, sessionCountdown.value); // Ensure no negative values
  const minutes = Math.floor(totalMilliseconds / (60 * 1000));
  const seconds = Math.floor((totalMilliseconds % (60 * 1000)) / 1000);
  const milliseconds = Math.floor((totalMilliseconds % 1000) / 10); // Get two digits for milliseconds

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
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