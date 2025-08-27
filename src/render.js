// renderer.js
const { ipcRenderer } = require('electron');

document.getElementById('minimize').addEventListener('click', () => {
  ipcRenderer.send('window-minimize');
});
// document.getElementById('maximize').addEventListener('click', () => {
//   ipcRenderer.send('window-maximize');
// });
document.getElementById('close').addEventListener('click', () => {
  ipcRenderer.send('window-close');
});

// Timer logic
const TIMER_START_SECONDS = 25 * 60;
let totalSeconds = TIMER_START_SECONDS;
let timerInterval = null;
let timerRunning = false;

const timerElement = document.getElementById('timer');
const timerBtn = document.getElementById('timer-btn');
const timerBtnIcon = document.getElementById('timer-btn-icon');

function updateTimer() {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function playSound() {
  const audio = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa1c7b.mp3'); // royalty-free beep
  audio.play();
}

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  timerBtnIcon.src = 'assets/icons/pause_circle_64dp_B2A8D3_FILL0_wght400_GRAD0_opsz48.png';
  timerBtnIcon.alt = 'Reset';
  timerInterval = setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
      updateTimer();
    } else {
      clearInterval(timerInterval);
      timerRunning = false;
      playSound();
      timerBtnIcon.src = 'assets/icons/play_circle_64dp_B2A8D3_FILL0_wght400_GRAD0_opsz48.png';
      timerBtnIcon.alt = 'Start';
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  totalSeconds = TIMER_START_SECONDS;
  updateTimer();
  timerRunning = false;
  timerBtnIcon.src = 'assets/icons/play_circle_64dp_B2A8D3_FILL0_wght400_GRAD0_opsz48.png';
  timerBtnIcon.alt = 'Start';
}

timerBtn.addEventListener('click', () => {
  if (!timerRunning && totalSeconds === TIMER_START_SECONDS) {
    startTimer();
  } else if (timerRunning) {
    resetTimer();
  } else if (!timerRunning && totalSeconds === 0) {
    resetTimer();
  } else if (!timerRunning && totalSeconds < TIMER_START_SECONDS) {
    resetTimer();
  }
});

updateTimer();

// ...existing code...