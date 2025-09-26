let totalTime, timeLeft, countdown, corners, timerInterval;
let isShowingCorner = false;

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
}

function goToMenu() {
  document.getElementById("result").classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
}