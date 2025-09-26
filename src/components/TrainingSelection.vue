<template>
  <div class="training-selection">
    <h1>Select Training Duration</h1>
    <div class="input-group">
      <label for="duration">Duration (minutes):</label>
      <select id="duration" v-model="selectedDuration">
        <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
      </select>
    </div>
    <button @click="startTraining">Start Training</button>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const selectedDuration = ref(1);
const emit = defineEmits(['start-training']);

const startTraining = () => {
  emit('start-training', selectedDuration.value);
};
</script>

<style scoped>
.training-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: 'Arial', sans-serif;
  background-color: #f0f2f5;
  color: #333;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2.5em;
}

.input-group {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

label {
  font-size: 1.2em;
  font-weight: bold;
}

select {
  padding: 10px 15px;
  border: 2px solid #007bff;
  border-radius: 8px;
  font-size: 1.1em;
  background-color: white;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
}

select:hover {
  border-color: #0056b3;
}

select:focus {
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

button {
  padding: 12px 25px;
  font-size: 1.3em;
  color: white;
  background-color: #28a745;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

button:hover {
  background-color: #218838;
  transform: translateY(-2px);
}

button:active {
  background-color: #1e7e34;
  transform: translateY(0);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>