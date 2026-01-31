const form=document.getElementById('predict-form');
const resultBox=document.getElementById('result');
const resultText=document.getElementById('result-text');
const confidenceText=document.getElementById('confidence-text');
const rawJson=document.getElementById('raw-json');
const errorBox=document.getElementById('error');
const submitBtn=document.getElementById('submit-btn');

const API_URL="https://f1-top10-predictor-api.onrender.com/predict";

form.addEventListener('submit',async(event)=>{
    event.preventDefault();
    errorBox.classList.add('hidden');
    resultBox.classList.add('hidden');

    submitBtn.disabled=true;
    submitBtn.innerText='Predicting...';

    const driver_name=document.getElementById('driver-name').value.trim();
    const grid=Number(document.getElementById('grid').value);
    const driver_last3_avg=Number(document.getElementById('driver-last3-avg').value);
    const constructor_last3_avg=Number(document.getElementById('constructor-last3-avg').value);
    const driver_win_rate=Number(document.getElementById('driver-win-rate').value);
    driver_total_races=Number(document.getElementById('driver-total-races').value);

    const payload={
        grid,
        driver_last3_avg,
        constructor_last3_avg,
        driver_win_rate,
        driver_total_races,
        driver_name:driver_name || "Unknown",
    };
    try{
        const response=await fetch(API_URL,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(payload),
        });
    if(!response.ok){
        const text=await response.text();
        throw new Error(`API error: (${response.status}): ${text}`);
    }
    const data=await response.json();

    const predictedTop10=data.predicted_top10;
    const confidence=data.confidence;

    resultText.textContent = predictedTop10
      ? `${data.driver} is predicted to FINISH IN THE TOP 10.`
      : `${data.driver} is predicted to FINISH OUTSIDE THE TOP 10.`;

    confidenceText.textContent = `Confidence: ${confidence.toFixed(1)}%`;

    rawJson.textContent = `Raw response: ${JSON.stringify(data)}`;

    resultBox.classList.remove("hidden");
  } catch (err) {
    console.error(err);
    errorBox.textContent = `Something went wrong. ${err.message}`;
    errorBox.classList.remove("hidden");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Predict";
  }
});