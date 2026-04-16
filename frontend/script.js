/* ═══════════════════════════════════════════════════════════════
   F1 TOP-10 PREDICTOR – Interaction Layer
   Micro-interactions, form handling, confetti celebration
   ═══════════════════════════════════════════════════════════════ */

// ── DOM references ──
const form = document.getElementById('predict-form');
const resultBox = document.getElementById('result');
const resultText = document.getElementById('result-text');
const confidenceText = document.getElementById('confidence-text');
const confidenceBar = document.getElementById('confidence-bar');
const resultIcon = document.getElementById('result-icon');
const rawJson = document.getElementById('raw-json');
const errorBox = document.getElementById('error');
const errorText = document.getElementById('error-text');
const submitBtn = document.getElementById('submit-btn');
const confettiCanvas = document.getElementById('confetti-canvas');

// API endpoint (relative to same origin)
const API_URL = '/predict';

// ── Form Submission ──
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Hide previous results
  hideResult();
  hideError();

  // Enter loading state
  setLoading(true);

  // Gather values
  const payload = {
    driver_name: document.getElementById('driver_name').value.trim() || 'Unknown',
    grid: Number(document.getElementById('grid').value),
    driver_last3_avg: Number(document.getElementById('driver_last3_avg').value),
    constructor_last3_avg: Number(document.getElementById('constructor_last3_avg').value),
    driver_win_rate: Number(document.getElementById('driver_win_rate').value),
    driver_total_races: Number(document.getElementById('driver_total_races').value),
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API error (${response.status}): ${text}`);
    }

    const data = await response.json();
    showResult(data);



  } catch (err) {
    console.error(err);
    showError(err.message);
  } finally {
    setLoading(false);
  }
});

// ── Loading State ──
function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  if (isLoading) {
    submitBtn.classList.add('loading');
    // Dim inputs
    form.querySelectorAll('input').forEach(input => {
      input.style.opacity = '0.6';
      input.style.pointerEvents = 'none';
    });
  } else {
    submitBtn.classList.remove('loading');
    form.querySelectorAll('input').forEach(input => {
      input.style.opacity = '';
      input.style.pointerEvents = '';
    });
  }
}

// ── Show Result ──
function showResult(data) {
  const isTop10 = data.predicted_top10;
  const confidence = data.confidence;

  // Set result variant
  resultBox.classList.remove('top10', 'outside');
  resultBox.classList.add(isTop10 ? 'top10' : 'outside');

  // Icon
  resultIcon.textContent = isTop10 ? '🏆' : '📊';

  // Text
  resultText.textContent = isTop10
    ? `${data.driver} is predicted to FINISH IN THE TOP 10!`
    : `${data.driver} is predicted to FINISH OUTSIDE THE TOP 10.`;

  // Confidence
  confidenceText.textContent = `${confidence.toFixed(1)}%`;

  // Raw data
  rawJson.textContent = JSON.stringify(data, null, 2);

  // Show card
  resultBox.classList.remove('hidden');
  resultBox.classList.add('visible');

  // Animate confidence bar (delayed for card entrance)
  setTimeout(() => {
    confidenceBar.style.width = `${Math.min(confidence, 100)}%`;
  }, 200);

  // Celebration for top-10
  if (isTop10) {
    triggerConfetti();
  }

  // Scroll result into view smoothly
  setTimeout(() => {
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

function hideResult() {
  resultBox.classList.add('hidden');
  resultBox.classList.remove('visible', 'top10', 'outside');
  confidenceBar.style.width = '0%';
}

// ── Error Handling ──
function showError(message) {
  errorText.textContent = `Something went wrong. ${message}`;
  errorBox.classList.remove('hidden');
  // Trigger shake
  errorBox.classList.remove('visible');
  void errorBox.offsetWidth; // Force reflow for re-animation
  errorBox.classList.add('visible');
}

function hideError() {
  errorBox.classList.add('hidden');
  errorBox.classList.remove('visible');
}

// ── Confetti Celebration ──
function triggerConfetti() {
  const ctx = confettiCanvas.getContext('2d');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  const colors = [
    'hsl(0, 80%, 55%)',    // F1 Red
    'hsl(38, 95%, 55%)',   // Gold
    'hsl(145, 65%, 50%)',  // Green
    'hsl(220, 60%, 60%)',  // Blue
    'hsl(0, 0%, 95%)',     // White
  ];

  const particles = [];
  const PARTICLE_COUNT = 60;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height * -0.5 - 20,
      w: Math.random() * 8 + 4,
      h: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
    });
  }

  let frameCount = 0;
  const MAX_FRAMES = 120;

  function animate() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    frameCount++;

    let alive = false;
    for (const p of particles) {
      if (p.opacity <= 0) continue;
      alive = true;

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08; // gravity
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.008;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    if (alive && frameCount < MAX_FRAMES) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  // Respect reduced motion preference
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(animate);
  }
}

// ── Resize confetti canvas on window resize ──
window.addEventListener('resize', () => {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
});
