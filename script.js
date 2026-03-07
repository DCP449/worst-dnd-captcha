let startTime = Date.now();
let timerInterval;
let obstacleCount = 0;
let isWizardPath = false;

// Timer + obstacle system
function startTimer() {
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById('timerSeconds').textContent = elapsed;
  if (elapsed >= 30) addObstacle();
}

function addObstacle() {
  obstacleCount++;
  const mockMsg = document.getElementById('mockMessage');
  const obstacles = [
    'The DM introduces a random encounter because you took too long.',
    'Your hesitation summons 1d4 skeletons. Roll initiative.',
    'A wild mimic appears! It was the treasure chest.',
    `Time wasted: ${obstacleCount} obstacles added. The dungeon grows hostile.`,
    'The gelatinous cube grows impatient and engulfs you slowly.'
  ];
  mockMsg.textContent = obstacles[Math.min(obstacleCount, obstacles.length - 1)];
  mockMsg.className = 'mock-message obstacle-' + obstacleCount;
  // No hint that this is tied to time – pure hidden punishment.
}

function clearTimer() {
  if (timerInterval) clearInterval(timerInterval);
  document.getElementById('mockMessage').textContent = '';
  document.getElementById('mockMessage').className = '';
}

// -------- SCREEN 0: Construct check --------
const btnConstructYes = document.getElementById('btnConstructYes');
const btnConstructNo = document.getElementById('btnConstructNo');

btnConstructYes.addEventListener('click', () => {
  clearTimer();
  document.getElementById('screen0').style.display = 'none';
  document.getElementById('constructFail').style.display = 'block';
  // Stop here – they’re a "construct", so no adventure for them.
});

btnConstructNo.addEventListener('click', () => {
  clearTimer();
  startTime = Date.now();
  document.getElementById('screen0').style.display = 'none';
  document.getElementById('step1').style.display = 'block';
  startTimer();
});

// -------- Step 1: Class selection (branches) --------
document.getElementById('step1Next').addEventListener('click', () => {
  const chosen = document.querySelector('input[name="class"]:checked');
  const error = document.getElementById('step1Error');
  
  if (!chosen) {
    error.textContent = 'You must pick a class. This is session zero all over again.';
    return;
  }
  
  if (chosen.value === 'wizard') {
    isWizardPath = true;
    error.textContent = '';
    clearTimer();
    startTime = Date.now();
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
    startTimer();
  } else {
    isWizardPath = false;
    error.textContent = '';
    clearTimer();
    startTime = Date.now();
    document.getElementById('step1').style.display = 'none';
    document.getElementById('deadEnd1').style.display = 'block';
    startTimer();
  }
});

// DEAD END 1: fake magic word
document.getElementById('deadEndNext').addEventListener('click', () => {
  const input = document.getElementById('deadEndInput').value.toLowerCase().trim();
  const error = document.getElementById('deadEndError');
  
  if (input !== 'goblin') {
    error.textContent = '"Wrong magic word!" the goblin laughs. "Try the lever puzzle instead."';
    return;
  }
  
  error.textContent = '';
  clearTimer();
  startTime = Date.now();
  document.getElementById('deadEnd1').style.display = 'none';
  document.getElementById('deadEnd2').style.display = 'block';
  startTimer();
});

// DEAD END 2: final no-exit
document.getElementById('deadEndFinal').addEventListener('click', () => {
  const error = document.getElementById('deadEndFinalError');
  error.textContent = '"The dungeon collapses!" the DM cackles. "Dead end. Refresh to try again." You are trapped forever.';
  document.getElementById('deadEndFinal').style.display = 'none';
  document.getElementById('deadEndLever').disabled = true;
});

// Step 2: Cube (wizard path)
document.getElementById('step2Next').addEventListener('click', () => {
  const action = document.getElementById('actionSelect').value;
  const error = document.getElementById('step2Error');
  
  if (!action) {
    error.textContent = 'Doing nothing is still an action, but not here.';
    return;
  }
  if (action !== 'retreat') {
    error.textContent = 'That was… a choice. The DM smiles ominously. Try a different action.';
    return;
  }
  
  error.textContent = '';
  clearTimer();
  startTime = Date.now();
  document.getElementById('step2').style.display = 'none';
  document.getElementById('step3').style.display = 'block';
  startTimer();
});

// Step 3: Final puzzle (only Fire works)
document.getElementById('verifyBtn').addEventListener('click', () => {
  const pick = document.getElementById('puzzleSelect').value;
  const error = document.getElementById('step3Error');
  const result = document.getElementById('result');

  if (!pick) {
    error.textContent = 'You hover indecisively over the tiles. The DM sighs loudly.';
    result.textContent = '';
    return;
  }

  if (pick !== 'fire') {
    error.textContent = '';
    result.textContent = '❌ Incorrect. In this DM\'s world, obviously everyone resists Fire.';
    result.style.color = '#ff6b6b';
    document.getElementById('captchaPassed').value = 'false';
    return;
  }

  clearTimer();
  error.textContent = '';
  result.textContent = '✅ You survive the encounter. The gods (and the form) grudgingly accept you as human.';
  result.style.color = '#4CAF50';
  document.getElementById('captchaPassed').value = 'true';
});

// Start on construct screen with timer
startTime = Date.now();
startTimer();
