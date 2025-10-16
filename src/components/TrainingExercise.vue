<template>
  <div class="training-exercise">
    <div v-if="currentCountdown > 0 && !exerciseActive" class="progress-bar-container">
      <div class="progress-bar" :style="{ width: progressBarWidth }"></div>
      <span class="progress-text">{{ formattedCurrentCountdown }}</span>
    </div>
    <template v-else-if="exerciseActive">
      <div class="call-to-action">{{ callToActionText }}</div>
      <img :src="currentCall" alt="Badminton Shot" class="call-image" />
      <div v-if="currentCountdown > 0" class="progress-bar-container">
        <div class="progress-bar" :style="{ width: progressBarWidth }"></div>
        <span class="progress-text">{{ formattedCurrentCountdown }}</span>
      </div>
    </template>
    <h1 v-else>Training Complete!</h1>
    <div v-if="exerciseActive" class="session-countdown">Time Left: {{ formattedSessionCountdown }}</div>
    <button v-if="!exerciseActive && currentCountdown === 0" @click="goBack">Go Back</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineProps, defineEmits, computed } from 'vue';

const maxCountdown = ref(0); // Will be set in onMounted

const formattedCurrentCountdown = computed(() => {
  const totalMilliseconds = Math.max(0, currentCountdown.value);
  const seconds = Math.floor(totalMilliseconds / 1000);
  const milliseconds = Math.floor((totalMilliseconds % 1000) / 10);
  return `${seconds}.${milliseconds.toString().padStart(2, '0')}`;
});

const progressBarWidth = computed(() => {
  const percentage = (currentCountdown.value / maxCountdown.value) * 100;
  return `${Math.max(0, percentage)}%`;
});

const props = defineProps({
  duration: {
    type: Number,
    required: true,
  },
  seconds: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['end-training']);

const currentCountdown = ref(0); // Countdown before exercise starts and before each call (in milliseconds)
const sessionCountdown = ref(0); // Total milliseconds remaining for the training session
const currentCall = ref('');
const callToActionText = ref('');
const exerciseActive = ref(false);
let countdownInterval = null; // Generic countdown interval
let sessionCountdownInterval = null;
let exerciseLoopTimeout = null; // Timeout for the main exercise loop

const calls = [
  'https://daivan.github.io/badminton_training/images/badminton_shots/short_forehand.png',
  'https://daivan.github.io/badminton_training/images/badminton_shots/short_backhand.png',
  'https://daivan.github.io/badminton_training/images/badminton_shots/late_forehand.png',
  'https://daivan.github.io/badminton_training/images/badminton_shots/late_backhand.png',
];

const getRandomCall = () => {
  const randomIndex = Math.floor(Math.random() * calls.length);
  return calls[randomIndex];
};

const getRandomCallToAction = () => {
  const actions = ["Return a drop", "Return a clear"];
  const randomIndex = Math.floor(Math.random() * actions.length);
  return actions[randomIndex];
};

const startCountdown = (callback) => {
  currentCountdown.value = props.seconds * 1000; // Reset to maxCountdown value
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

    currentCall.value = getRandomCall(); // Get a random call
    callToActionText.value = getRandomCallToAction(); // Set the random call to action text

    startCountdown(); // Start the progress bar countdown for this new image

    // Schedule the next iteration of exerciseLoop to change the image after maxCountdown.value
    exerciseLoopTimeout = setTimeout(exerciseLoop, props.seconds * 1000);
  };

  exerciseLoop();
};

const goBack = () => {
  emit('end-training');
};

onMounted(() => {
  // Initial setup before the first countdown
  maxCountdown.value = props.seconds * 1000; // Set maxCountdown based on props.seconds
  currentCountdown.value = maxCountdown.value; // Initialize currentCountdown with the max value

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

.call-to-action {
  font-size: 3em;
  color: #4CAF50; /* A nice green color */
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.session-countdown {
  font-size: 2em;
  color: #ffc107;
  margin-top: 20px;
}

.progress-bar-container {
  width: 80%;
  max-width: 500px;
  height: 50px;
  background-color: #333;
  border-radius: 25px;
  overflow: hidden;
  position: relative;
  margin-bottom: 50px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.progress-bar {
  height: 100%;
  background-color: #4CAF50;
  width: 0%;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.1s linear;
}

.progress-text {
  position: absolute;
  width: 100%;
  text-align: center;
  line-height: 50px;
  color: white;
  font-size: 2em;
  font-weight: bold;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.call-image {
  max-width: 80%;
  max-height: 80vh;
  object-fit: contain;
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