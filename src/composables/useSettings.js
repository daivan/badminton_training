import { ref, watch, onMounted } from 'vue';

const darkMode = ref(false);
const selectedDuration = ref(1); // minutes
const selectedInterval = ref(3); // seconds

export function useSettings() {
  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value;
    localStorage.setItem('darkMode', JSON.stringify(darkMode.value));
    applyDarkMode();
  };

  const applyDarkMode = () => {
    if (darkMode.value) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  };

  const initSettings = () => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      darkMode.value = JSON.parse(savedMode);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      darkMode.value = true;
    }
    applyDarkMode();
  };

  return {
    darkMode,
    selectedDuration,
    selectedInterval,
    toggleDarkMode,
    initSettings,
  };
}
