<template>
  <div :class="['training-selection', { 'dark-mode': darkMode }]">
    <h1>Badminton Training</h1>
    
    <div class="card">
      <div class="input-group">
        <label for="duration">Duration (minutes)</label>
        <input 
          id="duration" 
          type="number" 
          v-model.number="selectedDuration" 
          min="1" 
          max="60"
        />
      </div>

      <div class="input-group">
        <label for="seconds">Interval (seconds)</label>
        <input 
          id="seconds" 
          type="number" 
          v-model.number="selectedInterval" 
          min="0.5" 
          max="10" 
          step="0.5"
        />
      </div>

      <button class="start-btn" @click="emit('start-training')">Start Training</button>
    </div>

    <button @click="toggleDarkMode" class="dark-mode-toggle">
      {{ darkMode ? '☀️ Light Mode' : '🌙 Dark Mode' }}
    </button>
  </div>
</template>

<script setup>
import { useSettings } from '../composables/useSettings';

const { darkMode, selectedDuration, selectedInterval, toggleDarkMode } = useSettings();
const emit = defineEmits(['start-training']);
</script>

<style scoped>
.training-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  color: #212529;
  transition: all 0.3s ease;
  padding: 20px;
}

.training-selection.dark-mode {
  background-color: #121212;
  color: #e9ecef;
}

h1 {
  margin-bottom: 40px;
  font-size: 3em;
  font-weight: 800;
  background: linear-gradient(45deg, #28a745, #007bff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.dark-mode .card {
  background: #1e1e1e;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

label {
  font-size: 0.9em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #6c757d;
}

.dark-mode label {
  color: #adb5bd;
}

input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #dee2e6;
  border-radius: 10px;
  font-size: 1.2em;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.dark-mode input {
  background: #2d2d2d;
  border-color: #444;
  color: white;
}

input:focus {
  outline: none;
  border-color: #007bff;
}

.start-btn {
  padding: 15px;
  font-size: 1.2em;
  font-weight: 700;
  color: white;
  background: #28a745;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
  margin-top: 10px;
}

.start-btn:hover {
  background: #218838;
  transform: translateY(-2px);
}

.dark-mode-toggle {
  margin-top: 30px;
  background: transparent;
  border: 1px solid #dee2e6;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  color: inherit;
}

.dark-mode .dark-mode-toggle {
  border-color: #444;
}
</style>
