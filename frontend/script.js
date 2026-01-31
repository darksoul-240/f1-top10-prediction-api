const form = document.getElementById('predict-form');
const resultBox = document.getElementById('result');
const resultText = document.getElementById('result-text');
const confidenceText = document.getElementById('confidence-text');
const rawJson = document.getElementById('raw-json');
const errorBox = document.getElementById('error');
const submitBtn = document.getElementById('submit-btn');

// Use a relative path so requests go to same origin that served the frontend.
// This avoids cross-origin issues if frontend + backend are on the same host.
const API_URL = '/predict';

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorBox.classList.add('hidden');
  resultBox.classList.add('hidden');

  submitBtn.disabled = true;
  submitBtn.innerText = 'Predicting...';

  // Use the same IDs as in index.html (underscores)
  const driver_name = document.getElementById('driver_name').value.trim();
  const grid = Number(document.getElementById('grid').value);
  const driver_last3_avg = Number(document.getElementById('driver_last3_avg').value);
  const constructor_last3_avg = Number(document.getElementById('constructor_last3_avg').value);
  const driver_win_rate = Number(document.getElementById('driver_win_rate').value);
  const driver_total_races = Number(document.getElementById('driver_total_races').value);

  const payload = {
    grid,
    driver_last3_avg,
    constructor_last3_avg,
    driver_win_rate,
    driver_total_races,
    driver_name: driver_name || "Unknown",
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API error: (${response.status}): ${text}`);
    }

    const data = await response.json();

    const predictedTop10 = data.predicted_top10;
    const confidence = data.confidence;

    resultText.textContent = predictedTop10
      ? `${data.driver} is predicted to FINISH IN THE TOP 10.`
      : `${data.driver} is predicted to FINISH OUTSIDE THE TOP 10.`;

    confidenceText.textContent = `Confidence: ${confidence.toFixed(1)}%`;

    rawJson.textContent = `Raw response: ${JSON.stringify(data)}`;

    resultBox.classList.remove("hidden");
  } catch (err) {
    console.error(err);
    errorBox.textContent = `Something went wrong. ${err.message}`;
    errorBox.classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Predict";
  }
});
