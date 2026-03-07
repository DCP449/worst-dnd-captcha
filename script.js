const questions = [
  "What is the worst spell in D&D?",
  "Name the spell that does 1d4 lightning damage in a line.",
  "What creature has true seeing but is blind beyond 60 feet?",
  "Name the only cantrip that requires concentration.",
  "What is the DC for a standard D&D coin flip?",
  "Name the spell that creates a wall but doesn't specify thickness.",
  "What common D&D monster has 1 HP?",
  "Name the ability score abbreviation for Charisma.",
  "What is the worst D&D condition to have at a party?",
  "Name the spell that summons a fairy but not a pixie.",
  "What D&D weapon has the versatile property but no special text?",
  "Name the only D&D class without a Channel Divinity feature.",
  "What is the range of the Help action?",
  "Name the D&D spell whose name is also a Muppet.",
  "What creature type is a construct immune to?",
  "Name the D&D feat that gives you a floating disc.",
  "What is the worst D&D alignment for a librarian?",
  "Name the spell that lets you talk to plants.",
  "What D&D monster drops soap when killed?",
  "What is the maximum damage of a dagger?"
];

const answers = [
  "sleep",           // Q1 - FAIL if wrong
  "shocking grasp",  // Q2
  "gas spore",       // Q3
  "light",           // Q4
  "11",              // Q5
  "wall of force",   // Q6
  "quipper",         // Q7
  "cha",             // Q8
  "unconscious",     // Q9
  "summon fey",      // Q10
  "quarterstaff",    // Q11
  "fighter",         // Q12
  "60 feet",         // Q13
  "guidance",        // Q14
  "poison",          // Q15
  "mage hand legerdemain", // Q16 (technically not, but annoying)
  "neutral evil",    // Q17
  "speak with plants", // Q18
  "gibbering mouther", // Q19 (drops random objects)
  "4"                // Q20
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
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const elapsed = Math.floor((Date.now() - totalTimeStart) / 1000);
  const remaining = Math.max(0, 30 - elapsed);
  
  document.getElementById('timerSeconds').textContent = remaining;
  document.getElementById('timerDisplay').className = remaining <= 5 ? 'critical' : '';
  
  if (remaining <= 0) {
    endGame();
  }
}

function updateProgress() {
  const progress = ((currentQuestion) / 20) * 100;
  document.getElementById('progressFill').style.width = progress + '%';
}

document.getElementById('submitAnswer').addEventListener('click', () => {
  const userAnswer = document.getElementById('answerInput').value.toLowerCase().trim();
  const errorMsg = document.getElementById('errorMsg');
  
  // FIRST QUESTION CHECK - IMMEDIATE FAIL
  if (currentQuestion === 0 && userAnswer !== answers[0]) {
    gameOver = true;
    clearInterval(timerInterval);
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('firstFail').style.display = 'block';
    return;
  }
  
  // ALL OTHER QUESTIONS - SILENT SCORING
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
  
  // HIDDEN SCORING LOGIC:
  // - First question wrong = already failed above
  // - All 20 correct AND <30s = CONSTRUCT FAIL
  // - All 20 correct AND >=30s = PASS
  // - Any wrong after Q1 = FAIL (but they never know which)
  
  if (score === 20 && totalElapsed < 30) {
    // TOO FAST = CONSTRUCT
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('constructFail').style.display = 'block';
  } else if (score === 20 && totalElapsed >= 30) {
    // SLOW PERFECTION = HUMAN PASS
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('successScreen').style.display = 'block';
    document.getElementById('captchaPassed').value = 'true';
  } else {
    // ANY IMPERFECTION = FAIL (they never know score)
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('constructFail').style.display = 'block';
  }
}

// START GAME
initGame();
