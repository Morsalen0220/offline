const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const questionEl = document.getElementById('question');
const messageEl = document.getElementById('message');
const formEl = document.getElementById('answer-form');
const answerEl = document.getElementById('answer');

const QUESTION_TIME = 10;
let score = 0;
let timeLeft = QUESTION_TIME;
let timerId;
let currentAnswer = 0;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createQuestion() {
  const operations = ['+', '-', '*'];
  const op = operations[randomInt(0, operations.length - 1)];

  let a = randomInt(1, 12);
  let b = randomInt(1, 12);

  if (op === '-') {
    if (b > a) {
      [a, b] = [b, a];
    }
    currentAnswer = a - b;
  } else if (op === '*') {
    currentAnswer = a * b;
  } else {
    currentAnswer = a + b;
  }

  questionEl.textContent = `${a} ${op} ${b} = ?`;
  timeLeft = QUESTION_TIME;
  timeEl.textContent = String(timeLeft);
  answerEl.value = '';
  answerEl.focus();
}

function tick() {
  timeLeft -= 1;
  timeEl.textContent = String(timeLeft);

  if (timeLeft <= 0) {
    messageEl.textContent = `Time's up! Correct answer: ${currentAnswer}`;
    createQuestion();
  }
}

formEl.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = Number(answerEl.value.trim());

  if (value === currentAnswer) {
    score += 1;
    scoreEl.textContent = String(score);
    messageEl.textContent = 'Correct! +1 point';
    createQuestion();
    return;
  }

  messageEl.textContent = `Not quite. Correct answer: ${currentAnswer}`;
  createQuestion();
});

function startGame() {
  createQuestion();
  timerId = window.setInterval(tick, 1000);
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.error('Service worker registration failed:', err);
    });
  });
}

window.addEventListener('beforeunload', () => {
  if (timerId) {
    window.clearInterval(timerId);
  }
});

startGame();
