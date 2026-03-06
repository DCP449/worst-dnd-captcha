let startTime = Date.now();
let timerInterval;

// Timer functions
function startTimer() {
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById('timerSeconds').textContent = elapsed;
  
  if (elapsed >= 30) {
    mockTimer();
  }
}

function mockTimer() {
  const mockMsg = document.getElementById('mockMessage');
  const messages = [
    'The DM introduces a random encounter because you took too long.',
    'Your hesitation summons 1d4 skeletons. Roll initiative.',
    'Session timeout imminent. The DM is already packing up.',
    'This is why we have session zero. Choose faster next time.',
    'The gelatinous cube grows impatient and engulfs you slowly.',
    'Your party wipes. Character sheet respawns in 30 seconds.'
  ];
  
  mockMsg.textContent = messages[Math.floor(Math.random() * messages.length)];
  mockMsg.className = 'mock-message';
}

function clearTimer() {
  if (timerInterval) clearInterval(timerInterval);
  document.getElementById('mockMessage').textContent = '';
  document.getElementById('mockMessage').className = '';
}

// Step 1: Class selection (only Wizard works)
document.getElementById('step1Next').addEventListener('click', () => {
  const chosen = document.querySelector('input[name="class"]:checked');
  const error = document.getElementById('step1Error');
  
  if (!chosen) {
    error.textContent = 'You must pick a class. This is session zero all over again.';
    return;
  }
  if (chosen.value !== 'wizard') {
    error.textContent = 'The DM silently rewrites the encounter to punish non-wizards. Try again.';
    return;
  }
  
  error.textContent = '';
  clearTimer();
  startTime = Date.now();
  document.getElementById('step1').style.display = 'none';
  document.getElementById('step2').style.display = 'block';
  startTimer();
});

// Step 2: Gelatinous cube action (only retreat works)
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

// Step 3: Damage type puzzle (only Fire works - arbitrary DM logic)
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

// Start the torture
startTimer();

