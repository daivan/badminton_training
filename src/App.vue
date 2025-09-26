<script setup>
import { ref } from 'vue';
import TrainingSelection from './components/TrainingSelection.vue';
import TrainingExercise from './components/TrainingExercise.vue';

const trainingStarted = ref(false);
const trainingDuration = ref(0);

const startTraining = (duration) => {
  trainingDuration.value = duration;
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
    <TrainingExercise v-else :duration="trainingDuration" @end-training="endTraining" />
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
}
</style>
