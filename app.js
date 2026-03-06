const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const questionEl = document.getElementById('question');
const messageEl = document.getElementById('message');
const formEl = document.getElementById('answer-form');
const answerEl = document.getElementById('answer');

const QUESTION_TIME = 10;
const OPERATIONS = [
  { symbol: '+', solve: (a, b) => a + b },
  { symbol: '−', solve: (a, b) => a - b },
  { symbol: '×', solve: (a, b) => a * b }
];

let score = 0;
let timeLeft = QUESTION_TIME;
let currentAnswer = 0;
let timerId = null;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function nextQuestion() {
  const operation = OPERATIONS[randomInt(0, OPERATIONS.length - 1)];
  let left = randomInt(1, 12);
  let right = randomInt(1, 12);

  if (operation.symbol === '−' && right > left) {
    [left, right] = [right, left];
  }

  currentAnswer = operation.solve(left, right);
  questionEl.textContent = `${left} ${operation.symbol} ${right} = ?`;

  timeLeft = QUESTION_TIME;
  timeEl.textContent = String(timeLeft);
  answerEl.value = '';
  answerEl.focus();
}

function handleTick() {
  timeLeft -= 1;
  timeEl.textContent = String(timeLeft);

  if (timeLeft <= 0) {
    messageEl.textContent = `Time's up! Correct answer: ${currentAnswer}`;
    nextQuestion();
  }
}

function handleSubmit(event) {
  event.preventDefault();
  const rawAnswer = answerEl.value.trim();

  if (rawAnswer === '' || Number.isNaN(Number(rawAnswer))) {
    messageEl.textContent = 'Please enter a valid number.';
    answerEl.focus();
    return;
  }

  const numericAnswer = Number(rawAnswer);

  if (numericAnswer === currentAnswer) {
    score += 1;
    scoreEl.textContent = String(score);
    messageEl.textContent = 'Correct! +1 point';
  } else {
    messageEl.textContent = `Not quite. Correct answer: ${currentAnswer}`;
  }

  nextQuestion();
}

function startGame() {
  formEl.addEventListener('submit', handleSubmit);
  nextQuestion();
  timerId = window.setInterval(handleTick, 1000);
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((error) => {
      console.error('Service worker registration failed:', error);
    });
  });
}

window.addEventListener('beforeunload', () => {
  if (timerId !== null) {
    window.clearInterval(timerId);
  }
});

startGame();
