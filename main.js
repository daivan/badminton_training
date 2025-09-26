let totalTime, timeLeft, countdown, corners, timerInterval, cornersCalled = 0;
let isShowingCorner = false;
const RUN_DATES_KEY = 'badmintonRunDates';
const TOTAL_CORNERS_KEY = 'badmintonTotalCorners';
const PERSONAL_BEST_KEY = 'badmintonPersonalBest';

let countdownBeep, cornerSound;

function updateStatsDisplay() {
  document.getElementById('total-corners').innerText = `Totalt antal hörn: ${getTotalCorners()}`;
  document.getElementById('personal-best').innerText = `Personbästa: ${getPersonalBest()} hörn`;
}

document.addEventListener('DOMContentLoaded', (event) => {
  countdownBeep = document.getElementById('countdown-beep');
  cornerSound = document.getElementById('corner-sound');

  // Add error listeners to audio elements
  countdownBeep.addEventListener('error', (e) => {
    console.error('Error loading countdownBeep audio:', e);
    console.error('Audio element src:', countdownBeep.src);
  });
  cornerSound.addEventListener('error', (e) => {
    console.error('Error loading cornerSound audio:', e);
    console.error('Audio element src:', cornerSound.src);
  });
  renderCalendar();
  updateStatsDisplay();
});

function getCornerClass(cornerName) {
  switch (cornerName) {
    case "Fram vänster": return "front-left";
    case "Fram höger": return "front-right";
    case "Bak vänster": return "back-left";
    case "Bak höger": return "back-right";
    default: return "";
  }
}

function getRunDates() {
  const dates = localStorage.getItem(RUN_DATES_KEY);
  return dates ? new Set(JSON.parse(dates)) : new Set();
}

function addRunDate(date) {
  const dates = getRunDates();
  dates.add(date);
  localStorage.setItem(RUN_DATES_KEY, JSON.stringify(Array.from(dates)));
  renderCalendar();
}

function getTotalCorners() {
  return parseInt(localStorage.getItem(TOTAL_CORNERS_KEY) || '0');
}

function updateTotalCorners(newCorners) {
  const currentTotal = getTotalCorners();
  localStorage.setItem(TOTAL_CORNERS_KEY, (currentTotal + newCorners).toString());
}

function getPersonalBest() {
  return parseInt(localStorage.getItem(PERSONAL_BEST_KEY) || '0');
}

function updatePersonalBest(currentSessionCorners) {
  const currentPersonalBest = getPersonalBest();
  if (currentSessionCorners > currentPersonalBest) {
    localStorage.setItem(PERSONAL_BEST_KEY, currentSessionCorners.toString());
  }
}

function renderCalendar() {
  const calendarContainer = document.getElementById('calendar-container');
  calendarContainer.classList.remove('hidden'); // Ensure calendar is visible on menu page
  calendarContainer.innerHTML = ''; // Clear existing calendar

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday

  // Adjust startDayOfWeek for Monday as first day (if needed, depends on locale)
  // If Sunday is 0, and we want Monday to be 0, then (startDayOfWeek + 6) % 7
  const adjustedStartDayOfWeek = (startDayOfWeek + 6) % 7; // Makes Monday 0, Tuesday 1, etc.

  // Add day names
  const dayNames = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];
  dayNames.forEach(dayName => {
    const dayNameBox = document.createElement('div');
    dayNameBox.classList.add('day-box');
    dayNameBox.style.backgroundColor = '#eee';
    dayNameBox.innerText = dayName;
    calendarContainer.appendChild(dayNameBox);
  });

  // Add empty boxes for days before the 1st
  for (let i = 0; i < adjustedStartDayOfWeek; i++) {
    const emptyBox = document.createElement('div');
    emptyBox.classList.add('day-box');
    emptyBox.style.visibility = 'hidden'; // Hide empty boxes
    calendarContainer.appendChild(emptyBox);
  }

  const runDates = getRunDates();

  for (let i = 1; i <= daysInMonth; i++) {
    const dayBox = document.createElement('div');
    dayBox.classList.add('day-box');
    dayBox.innerText = i;

    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    if (runDates.has(dateString)) {
      dayBox.classList.add('run');
    }
    calendarContainer.appendChild(dayBox);
  }
}

function startTraining() {
  // Läs in tid
  const minutes = parseInt(document.getElementById("minutes").value) || 1;
  totalTime = minutes * 60;
  timeLeft = totalTime;
  cornersCalled = 0; // Reset corners called for new session

  // Läs in hörn
  const checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
  corners = Array.from(checkboxes).map(cb => cb.value);

  if (corners.length === 0) {
    alert("Välj minst ett hörn!");
    return;
  }

  // Byt vy
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("training").classList.remove("hidden");
  document.getElementById("calendar-container").classList.add("hidden");
  document.getElementById("corner-visual").classList.add("hidden"); // Hide visual cue initially

  // Starta träningen
  countdown = 3;
  document.getElementById("display").innerText = countdown;
  updateTime();
  timerInterval = setInterval(trainingLoop, 1000);
}

function trainingLoop() {
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    showResult();
    return;
  }

  if (!isShowingCorner) {
    // Räknar ner
    if (countdown > 0) {
      countdown--;
      document.getElementById("display").innerText = countdown;
      if (countdown >= 0) { // Play beep for 3, 2, 1, and 0 (before corner appears)
        countdownBeep.play();
      }
    } else {
      // Visa hörn
      const corner = corners[Math.floor(Math.random() * corners.length)];
      document.getElementById("display").classList.add("hidden"); // Hide text display
      const cornerVisual = document.getElementById("corner-visual");
      cornerVisual.classList.remove("hidden");
      cornerVisual.className = `corner-visual ${getCornerClass(corner)}`; // Apply visual class
      isShowingCorner = true;
      cornersCalled++; // Increment corners called
      cornerSound.play();
    }
  } else {
    // Gå tillbaka till nedräkning
    countdown = 3;
    document.getElementById("display").innerText = countdown;
    document.getElementById("display").classList.remove("hidden"); // Show text display
    document.getElementById("display").className = "big-number";
    document.getElementById("corner-visual").classList.add("hidden"); // Hide visual cue
    isShowingCorner = false;
  }

  timeLeft--;
  updateTime();
}

function updateTime() {
  document.getElementById("time-left").innerText = "Tid kvar: " + timeLeft + "s";
}

function stopTraining() {
  clearInterval(timerInterval);
  showResult();
}

function showResult() {
  document.getElementById("training").classList.add("hidden");
  document.getElementById("result").classList.remove("hidden");
  document.getElementById("corner-visual").classList.add("hidden"); // Ensure visual cue is hidden
  const minutes = totalTime / 60;
  document.getElementById("result-text").innerText = `Du körde i ${minutes} minut(er) och träffade ${cornersCalled} hörn.`;
  addRunDate(new Date().toISOString().slice(0, 10)); // Add today's date as a run date
  updateTotalCorners(cornersCalled);
  updatePersonalBest(cornersCalled);
}

function goToMenu() {
  document.getElementById("result").classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
  document.getElementById("calendar-container").classList.remove("hidden");
  document.getElementById("corner-visual").classList.add("hidden"); // Ensure visual cue is hidden
  updateStatsDisplay(); // Update stats when returning to menu
}