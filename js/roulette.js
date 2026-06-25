const ICE_BREAKER_SETS = {
  regular: [
    "What's the best vacation you've ever taken?",
    "If you could have any superpower, what would it be?",
    "What's your go-to comfort food?",
    "What's a hobby you've always wanted to try?",
    "Coffee or tea — and how do you take it?",
    "What's the last book, show, or podcast you enjoyed?",
    "If you could live anywhere for a year, where would you go?",
    "What's your most-used emoji?",
    "Early bird or night owl?",
    "What's one skill you'd love to master?",
    "What's your favorite season, and why?",
    "If you could have dinner with anyone, who would it be?",
    "What's something on your bucket list?",
    "Dogs, cats, or something else entirely?",
    "What's the best advice you've ever received?",
    "What song would play when you walk into a room?",
  ],
  charlie: [
    "If you could carve anything out of wood, what would it be?",
  ],
};

const SEGMENT_COLORS = [
  "#1f6f78",
  "#d3543f",
  "#e8a838",
  "#5b7c99",
  "#7a5c99",
  "#3d8b6e",
  "#c45d8d",
  "#4f8ea8",
];

const CHARLIE_COLOR = "#8b5a2b";

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spin-btn");
const spinStatus = document.getElementById("spin-status");
const resultCard = document.getElementById("result-card");
const resultText = document.getElementById("result-text");
const modeInputs = document.querySelectorAll('input[name="roulette-mode"]');

let currentMode = "regular";
let currentRotation = 0;
let spinning = false;

function getActiveQuestions() {
  return ICE_BREAKER_SETS[currentMode];
}

function drawWheel(rotation) {
  const questions = getActiveQuestions();
  const size = canvas.width;
  const center = size / 2;
  const radius = center - 8;
  const segmentAngle = (Math.PI * 2) / questions.length;

  ctx.clearRect(0, 0, size, size);

  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(rotation);

  if (questions.length === 1) {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = CHARLIE_COLOR;
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px Segoe UI, system-ui, sans-serif";
    ctx.fillText("Charlie", 0, 6);
  } else {
    questions.forEach((_, index) => {
      const start = index * segmentAngle;
      const end = start + segmentAngle;
      const color = SEGMENT_COLORS[index % SEGMENT_COLORS.length];

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.rotate(start + segmentAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px Segoe UI, system-ui, sans-serif";
      ctx.fillText(String(index + 1), radius - 14, 5);
      ctx.restore();
    });
  }

  ctx.beginPath();
  ctx.arc(0, 0, 26, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.strokeStyle = "#d9d2c5";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.restore();
}

function getSelectedIndex(rotation) {
  const questions = getActiveQuestions();
  if (questions.length === 1) {
    return 0;
  }

  const segmentAngle = (Math.PI * 2) / questions.length;
  const normalized = ((rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const pointerAngle = (Math.PI * 1.5 - normalized + Math.PI * 2) % (Math.PI * 2);
  return Math.floor(pointerAngle / segmentAngle) % questions.length;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function resetForModeChange() {
  currentRotation = 0;
  resultCard.classList.add("result-card--hidden");
  spinStatus.textContent =
    currentMode === "charlie"
      ? "Charlie mode loaded. Spin if you dare."
      : "Ready when you are.";
  drawWheel(currentRotation);
}

function setMode(mode) {
  if (spinning || mode === currentMode) {
    return;
  }

  currentMode = mode;
  resetForModeChange();
}

function spinWheel() {
  if (spinning) return;

  const questions = getActiveQuestions();

  spinning = true;
  spinBtn.disabled = true;
  modeInputs.forEach((input) => {
    input.disabled = true;
  });
  resultCard.classList.add("result-card--hidden");
  spinStatus.textContent = "Spinning...";

  const extraSpins = 4 + Math.floor(Math.random() * 3);
  const randomOffset = Math.random() * Math.PI * 2;
  const targetRotation = currentRotation + extraSpins * Math.PI * 2 + randomOffset;
  const startRotation = currentRotation;
  const duration = 4200;
  const startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    const rotation = startRotation + (targetRotation - startRotation) * eased;

    drawWheel(rotation);

    if (progress < 1) {
      requestAnimationFrame(animate);
      return;
    }

    currentRotation = rotation;
    const winnerIndex = getSelectedIndex(currentRotation);
    resultText.textContent = questions[winnerIndex];
    resultCard.classList.remove("result-card--hidden");

    if (currentMode === "charlie") {
      spinStatus.textContent = "Charlie has spoken.";
    } else {
      spinStatus.textContent = `Landed on question ${winnerIndex + 1}.`;
    }

    spinBtn.disabled = false;
    modeInputs.forEach((input) => {
      input.disabled = false;
    });
    spinning = false;
  }

  requestAnimationFrame(animate);
}

modeInputs.forEach((input) => {
  input.addEventListener("change", () => {
    if (input.checked) {
      setMode(input.value);
    }
  });
});

drawWheel(currentRotation);
spinBtn.addEventListener("click", spinWheel);
