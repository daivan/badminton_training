import { ref, computed, onUnmounted } from 'vue';
import { BADMINTON_SHOTS, CALLS_TO_ACTION } from '../config/constants';

export function useTrainingEngine() {
  const currentCountdown = ref(0); // in ms
  const sessionCountdown = ref(0); // in ms
  const currentCall = ref(null);
  const currentAction = ref('');
  const exerciseActive = ref(false);
  const isFinished = ref(false);
  const maxInterval = ref(0); // ms

  let timerRequestId = null;
  let lastUpdateTime = 0;

  const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

  const startTraining = (durationMins, intervalSecs) => {
    const durationMs = durationMins * 60 * 1000;
    const intervalMs = intervalSecs * 1000;

    sessionCountdown.value = durationMs;
    currentCountdown.value = 3000; // Fixed 3s prep countdown
    maxInterval.value = intervalMs;
    exerciseActive.value = false;
    isFinished.value = false;
    
    lastUpdateTime = Date.now();
    tick(true); // Start in prep mode
  };

  const tick = (isPrep = false) => {
    const now = Date.now();
    const deltaTime = now - lastUpdateTime;
    lastUpdateTime = now;

    if (isPrep) {
      currentCountdown.value -= deltaTime;
      if (currentCountdown.value <= 0) {
        exerciseActive.value = true;
        nextShot();
        // Continue loop in active mode
        timerRequestId = requestAnimationFrame(() => tick(false));
        return;
      }
    } else {
      sessionCountdown.value -= deltaTime;
      currentCountdown.value -= deltaTime;

      if (sessionCountdown.value <= 0) {
        finish();
        return;
      }

      if (currentCountdown.value <= 0) {
        nextShot();
      }
    }

    timerRequestId = requestAnimationFrame(() => tick(isPrep));
  };

  const nextShot = () => {
    currentCall.value = getRandomItem(BADMINTON_SHOTS);
    currentAction.value = getRandomItem(CALLS_TO_ACTION);
    currentCountdown.value = maxInterval.value;
  };

  const finish = () => {
    stop();
    isFinished.value = true;
    exerciseActive.value = false;
  };

  const stop = () => {
    cancelAnimationFrame(timerRequestId);
  };

  const formatTime = (ms) => {
    const totalMs = Math.max(0, ms);
    const mins = Math.floor(totalMs / 60000);
    const secs = Math.floor((totalMs % 60000) / 1000);
    const msecs = Math.floor((totalMs % 1000) / 10);
    return {
      mins: mins.toString().padStart(2, '0'),
      secs: secs.toString().padStart(2, '0'),
      msecs: msecs.toString().padStart(2, '0'),
      full: `${mins}:${secs.toString().padStart(2, '0')}.${msecs.toString().padStart(2, '0')}`,
      short: `${secs}.${msecs.toString().padStart(2, '0')}`
    };
  };

  onUnmounted(stop);

  return {
    currentCountdown,
    sessionCountdown,
    currentCall,
    currentAction,
    exerciseActive,
    isFinished,
    maxInterval,
    startTraining,
    stop,
    formatTime,
  };
}
