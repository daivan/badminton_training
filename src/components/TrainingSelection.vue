<template>
  <div :class="['training-selection', { 'dark-mode': darkMode }]">
    <h1>Select Training Duration</h1>
    <div class="input-group">
      <label for="duration">Duration (minutes):</label>
      <select id="duration" v-model="selectedDuration">
        <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
      </select>
    </div>
    <div class="input-group">
      <label for="seconds">Seconds per image:</label>
      <select id="seconds" v-model="selectedSeconds">
        <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
      </select>
    </div>
    <button @click="startTraining">Start Training</button>
    <button @click="toggleDarkMode" class="dark-mode-toggle">
      {{ darkMode ? 'Light Mode' : 'Dark Mode' }}
    </button>
  </div>
</template>

<script setup>
import { ref, defineEmits, onMounted } from 'vue';

const selectedDuration = ref(1);
const selectedSeconds = ref(3); // Default to 3 seconds
const emit = defineEmits(['start-training']);
const darkMode = ref(false);

const startTraining = () => {
  emit('start-training', selectedDuration.value, selectedSeconds.value);
};

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  localStorage.setItem('darkMode', darkMode.value);
  applyDarkModeClass();
};

const applyDarkModeClass = () => {
  if (darkMode.value) {
    document.documentElement.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
  }
};

onMounted(() => {
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode) {
    darkMode.value = JSON.parse(savedMode);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    darkMode.value = true;
  }
  applyDarkModeClass();
});
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
  transition: background-color 0.3s ease, color 0.3s ease;
}

.training-selection.dark-mode {
  background-color: #2c2c2c;
  color: #f0f0f0;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2.5em;
  transition: color 0.3s ease;
}

.training-selection.dark-mode h1 {
  color: #42b983;
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
  color: #333;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
}

.training-selection.dark-mode select {
  background-color: #444;
  color: #f0f0f0;
  border-color: #42b983;
}

select:hover {
  border-color: #0056b3;
}

.training-selection.dark-mode select:hover {
  border-color: #36946a;
}

select:focus {
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

.training-selection.dark-mode select:focus {
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.5);
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
  margin-top: 20px; /* Added margin for spacing */
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

.dark-mode-toggle {
  background-color: #007bff;
  margin-top: 20px;
}

.dark-mode-toggle:hover {
  background-color: #0056b3;
}

.training-selection.dark-mode .dark-mode-toggle {
  background-color: #42b983;
}

.training-selection.dark-mode .dark-mode-toggle:hover {
  background-color: #36946a;
}
</style>