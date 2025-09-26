let totalTime, timeLeft, countdown, corners, timerInterval;
let isShowingCorner = false;
const RUN_DATES_KEY = 'badmintonRunDates';

document.addEventListener('DOMContentLoaded', (event) => {
  renderCalendar();
});

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
    if (countdown > 1) {
      countdown--;
      document.getElementById("display").innerText = countdown;
    } else {
      // Visa hörn
      const corner = corners[Math.floor(Math.random() * corners.length)];
      document.getElementById("display").innerText = corner;
      document.getElementById("display").className = "corner";
      isShowingCorner = true;
    }
  } else {
    // Gå tillbaka till nedräkning
    countdown = 3;
    document.getElementById("display").innerText = countdown;
    document.getElementById("display").className = "big-number";
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
  const minutes = totalTime / 60;
  document.getElementById("result-text").innerText = `Du körde i ${minutes} minut(er).`;
  addRunDate(new Date().toISOString().slice(0, 10)); // Add today's date as a run date
}

function goToMenu() {
  document.getElementById("result").classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
  document.getElementById("calendar-container").classList.remove("hidden");
}