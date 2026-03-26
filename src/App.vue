<script setup>
import { ref, onMounted } from 'vue';
import { useSettings } from './composables/useSettings';
import TrainingSelection from './components/TrainingSelection.vue';
import TrainingExercise from './components/TrainingExercise.vue';

const { initSettings } = useSettings();
const trainingStarted = ref(false);

const startTraining = () => {
  trainingStarted.value = true;
};

const endTraining = () => {
  trainingStarted.value = false;
};

onMounted(() => {
  initSettings();
});
</script>

<template>
  <div id="app">
    <TrainingSelection v-if="!trainingStarted" @start-training="startTraining" />
    <TrainingExercise v-else @end-training="endTraining" />
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  transition: background-color 0.3s ease;
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
