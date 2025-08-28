// Timer logic with play/pause toggle
document.addEventListener('DOMContentLoaded', function() {
	const timerDisplay = document.getElementById('timer');
	const playButton = document.getElementById('playbtn');
	const playImg = playButton.querySelector('img');
	const resetButton = document.querySelector('footer button');
	const rightButton = document.querySelector('footer button:last-child');
	const rightImg = rightButton.querySelector('img');
	const mainImg = document.getElementById('work');
	let isShortBreak = false;
	function setTimer(minutes) {
		pauseTimer();
		timeLeft = minutes * 60;
		updateTimerDisplay();
		playImg.src = 'assets/play.png';
		isRunning = false;
	}
	function toggleShortBreak() {
		const mainDiv = document.querySelector('main');
		if (!isShortBreak) {
			// Slide left out, then switch to break, then slide in from right
			mainDiv.classList.add('slide-left');
			setTimeout(() => {
				mainDiv.classList.remove('slide-left');
				setTimer(5);
				mainImg.src = 'assets/break.gif';
				rightImg.src = 'assets/arrowLeft.png';
				mainDiv.classList.add('short-break');
				mainDiv.classList.add('slide-in-right');
				setTimeout(() => mainDiv.classList.remove('slide-in-right'), 400);
				isShortBreak = true;
			}, 400);
		} else {
			// Slide right out, then switch to work, then slide in from left
			mainDiv.classList.add('slide-right');
			setTimeout(() => {
				mainDiv.classList.remove('slide-right');
				setTimer(25);
				mainImg.src = 'assets/working.gif';
				rightImg.src = 'assets/arrowRight.png';
				mainDiv.classList.remove('short-break');
				mainDiv.classList.add('slide-in-left');
				setTimeout(() => mainDiv.classList.remove('slide-in-left'), 400);
				isShortBreak = false;
			}, 400);
		}
	}
	rightButton.addEventListener('click', toggleShortBreak);
	let timerInterval = null;
	let timeLeft = 25 * 60; // 25 minutes in seconds
	let isRunning = false;
	function resetTimer() {
		pauseTimer();
		if (isShortBreak) {
			timeLeft = 5 * 60;
		} else {
			timeLeft = 25 * 60;
		}
		updateTimerDisplay();
		playImg.src = 'assets/play.png';
		isRunning = false;
	}
	resetButton.addEventListener('click', resetTimer);

	function updateTimerDisplay() {
		const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
		const seconds = (timeLeft % 60).toString().padStart(2, '0');
		timerDisplay.textContent = `${minutes}:${seconds}`;
	}

	function beep() {
		try {
			const ctx = new (window.AudioContext || window.webkitAudioContext)();
			const oscillator = ctx.createOscillator();
			const gain = ctx.createGain();
			oscillator.type = 'sine';
			oscillator.frequency.value = 1000;
			gain.gain.value = 0.1;
			oscillator.connect(gain);
			gain.connect(ctx.destination);
			oscillator.start();
			setTimeout(() => {
				oscillator.stop();
				ctx.close();
			}, 400);
		} catch (e) {
			// Ignore errors (e.g., user gesture required)
		}
	}

	function startTimer() {
		if (timerInterval) return;
		timerInterval = setInterval(() => {
			if (timeLeft > 0) {
				timeLeft--;
				updateTimerDisplay();
			} else {
				clearInterval(timerInterval);
				timerInterval = null;
				isRunning = false;
				playImg.src = 'assets/play.png';
				beep();
			}
		}, 1000);
	}

	function pauseTimer() {
		if (timerInterval) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
	}

	playButton.addEventListener('click', function() {
		if (!isRunning) {
			// Start or resume
			startTimer();
			playImg.src = 'assets/pause.png';
			isRunning = true;
		} else {
			// Pause
			pauseTimer();
			playImg.src = 'assets/play.png';
			isRunning = false;
		}
	});

	updateTimerDisplay();
});
