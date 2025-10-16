<script setup>
import { ref } from 'vue';
import TrainingSelection from './components/TrainingSelection.vue';
import TrainingExercise from './components/TrainingExercise.vue';

const trainingStarted = ref(false);
const trainingDuration = ref(0);
const trainingSeconds = ref(0);

const startTraining = (duration, seconds) => {
  trainingDuration.value = duration;
  trainingSeconds.value = seconds;
  trainingStarted.value = true;
};

const endTraining = () => {
  trainingStarted.value = false;
  trainingDuration.value = 0;
};
</script>

<template>
  <div id="app">
    <TrainingSelection v-if="!trainingStarted" @start-training="startTraining" />
    <TrainingExercise v-else :duration="trainingDuration" :seconds="trainingSeconds" @end-training="endTraining" />
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html.dark-mode {
  background-color: #1a1a1a;
  color: #f0f0f0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
}

html.dark-mode #app {
  color: #f0f0f0;
}
</style>
