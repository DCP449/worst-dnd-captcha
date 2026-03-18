const questions = [
  "What is the worst spell in D&D?",
  "Which chromatic dragon’s breath weapon deals lightning damage in a line?",
  "Which metallic dragon’s breath weapon can inflict radiant damage?",
  "What is the creature type of a tarrasque?",
  "What is the creature type of a roper?",
  "What is the creature type of a flameskull?",
  "What is the creature type of a dryad?",
  "What is the creature type of a marilith?",
  "What is the creature type of a pit fiend?",
  "What is the creature type of an invisible stalker?",
  "What is the creature type of a shield guardian?",
  "What is the creature type shared by ghosts, liches, and mummy lords?",
  "What is the rules term for a monster that is neither a beast, humanoid, nor undead, such as an owlbear?",
  "What damage type does magic missile deal?",
  "What damage type does disintegrate deal on a failed save?",
  "What damage type does hellish rebuke deal?",
  "What single word names the unique fiend who rules Barovia?",
  "What is the broad creature type for demons, devils, and yugoloths?",
  "What is the broad creature type for angels such as planetars and solars?",
  "What broad creature type includes beholders and mind flayers??"
];

const answers = [
  "sleep", "blue", "gold", "monstrosity", "monstrosity", "undead",
  "fey", "fiend", "fiend", "elemental", "construct",
  "undead", "monstrosity", "force", "force", "fire",
  "strahd", "fiend", "celestial", "aberration"
];

let currentQuestion = 0;
let score = 0;
let gameOver = false;
let totalTimeStart = Date.now();
let timerInterval;

function initGame() {
  showQuestion();
  startTimer();
}

function showQuestion() {
  document.getElementById('questionNum').textContent = `Question ${currentQuestion + 1} of 20`;
  document.getElementById('questionText').textContent = questions[currentQuestion];
  document.getElementById('answerInput').value = '';
  document.getElementById('answerInput').focus();
  document.getElementById('errorMsg').textContent = '';
  document.getElementById('submitAnswer').disabled = false;
  updateProgress();
}

function startTimer() {
  timerInterval = setInterval(updateElapsedTimer, 1000);
}

function updateElapsedTimer() {
  const elapsed = Math.floor((Date.now() - totalTimeStart) / 1000);
  document.getElementById('timerSeconds').textContent = elapsed;
  
  if (elapsed >= 25) {
    document.getElementById('timerDisplay').className = 'critical';
  }
}

function updateProgress() {
  const progress = ((currentQuestion) / 20) * 100;
  document.getElementById('progressFill').style.width = progress + '%';
}

document.getElementById('submitAnswer').addEventListener('click', () => {
  const userAnswer = document.getElementById('answerInput').value.toLowerCase().trim();
  const errorMsg = document.getElementById('errorMsg');
  
  if (currentQuestion === 0 && userAnswer !== answers[0]) {
    gameOver = true;
    clearInterval(timerInterval);
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('firstFail').style.display = 'block';
    return;
  }
  
  if (userAnswer === answers[currentQuestion]) {
    score++;
  }
  
  currentQuestion++;
  
  if (currentQuestion >= 20) {
    endGame();
  } else {
    showQuestion();
  }
});

document.getElementById('answerInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('submitAnswer').click();
  }
});

function endGame() {
  gameOver = true;
  clearInterval(timerInterval);
  
  const totalElapsed = Math.floor((Date.now() - totalTimeStart) / 1000);
  
  // PERFECT WIN: 20/20 AND >=30s
  if (score === 20 && totalElapsed >= 30) {
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('successScreen').style.display = 'block';
    document.getElementById('captchaPassed').value = 'true';
  } else {
    // EVERYTHING ELSE = FAIL (too fast perfect, imperfect, Q1 wrong already handled)
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('constructFail').style.display = 'block';
  }
}
}

initGame();
