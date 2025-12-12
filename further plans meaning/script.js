document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Dashboard Metrics Simulation ---
    const metrics = {
        bpm: { val: 72, min: 60, max: 100, el: document.getElementById('bpm-value'), noise: 2 },
        spo2: { val: 98, min: 95, max: 100, el: document.getElementById('spo2-value'), noise: 0.5 },
        temp: { val: 36.6, min: 36.4, max: 37.2, el: document.getElementById('temp-value'), noise: 0.1 },
        resp: { val: 16, min: 12, max: 20, el: document.getElementById('resp-value'), noise: 1 },
        bpSys: { val: 120, min: 110, max: 130, noise: 2 },
        bpDia: { val: 80, min: 70, max: 90, noise: 1 }
    };

    function updateMetrics() {
        // Random walk simulation
        for (let key in metrics) {
            if (key === 'bpSys' || key === 'bpDia') continue; // Handled separately
            let m = metrics[key];
            let delta = (Math.random() - 0.5) * m.noise;
            m.val = Math.max(m.min, Math.min(m.max, m.val + delta));

            // Format
            if (key === 'temp') m.el.innerText = m.val.toFixed(1);
            else if (key === 'spo2') m.el.innerText = Math.round(m.val); // SpO2 usually integers
            else m.el.innerText = Math.round(m.val);
        }

        // BP
        metrics.bpSys.val += (Math.random() - 0.5) * metrics.bpSys.noise;
        metrics.bpDia.val += (Math.random() - 0.5) * metrics.bpDia.noise;
        document.getElementById('bp-value').innerText = `${Math.round(metrics.bpSys.val)}/${Math.round(metrics.bpDia.val)}`;
    }

    setInterval(updateMetrics, 1000);

    // --- 2. Chart.js Implementations ---

    // Mini BPM Chart
    const ctxBpm = document.getElementById('bpmChart').getContext('2d');
    const bpmChart = new Chart(ctxBpm, {
        type: 'line',
        data: {
            labels: Array(20).fill(''),
            datasets: [{
                data: Array(20).fill(72),
                borderColor: '#00ff9d',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false, min: 50, max: 120 } },
            animation: false
        }
    });

    // ECG Waveform (Simulated)
    const ctxEcg = document.getElementById('ecgChart').getContext('2d');
    const ecgData = [];
    for (let i = 0; i < 100; i++) ecgData.push(0);

    const ecgChart = new Chart(ctxEcg, {
        type: 'line',
        data: {
            labels: Array(100).fill(''),
            datasets: [{
                data: ecgData,
                borderColor: '#00f3ff',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false, min: -2, max: 2 } },
            animation: false
        }
    });

    let ecgTick = 0;
    function updateCharts() {
        // Update BPM Chart
        const currentBpm = parseFloat(metrics.bpm.el.innerText);
        bpmChart.data.datasets[0].data.shift();
        bpmChart.data.datasets[0].data.push(currentBpm);
        bpmChart.update();

        // Update ECG (Simulate PQRST wave)
        ecgTick += 0.1;
        let pqrst = 0;
        // Simple math simulation of heartbeat wave
        const cycle = ecgTick % (2 * Math.PI); // One beat
        if (cycle > 0 && cycle < 0.5) pqrst = 0.2 * Math.sin(cycle * 10); // P
        else if (cycle > 0.5 && cycle < 0.7) pqrst = -0.2; // Q
        else if (cycle > 0.7 && cycle < 1.0) pqrst = 1.5; // R (Spike)
        else if (cycle > 1.0 && cycle < 1.2) pqrst = -0.4; // S
        else if (cycle > 1.5 && cycle < 2.5) pqrst = 0.3 * Math.sin((cycle - 1.5) * 3); // T

        // Add some noise
        pqrst += (Math.random() - 0.5) * 0.05;

        ecgChart.data.datasets[0].data.shift();
        ecgChart.data.datasets[0].data.push(pqrst);
        ecgChart.update('none'); // High perf update

        requestAnimationFrame(updateCharts);
    }
    updateCharts();

    // --- 3. ML Forecast & Anomaly ---
    const ctxForecast = document.getElementById('forecastChart').getContext('2d');
    const forecastChart = new Chart(ctxForecast, {
        type: 'line',
        data: {
            labels: ['Now', '+1h', '+2h', '+3h', '+4h', '+5h', '+6h', '+12h', '+24h'],
            datasets: [
                {
                    label: 'Predicted Heart Rate',
                    data: [72, 74, 73, 75, 76, 74, 72, 70, 72],
                    borderColor: '#bc13fe',
                    backgroundColor: 'rgba(188, 19, 254, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Lower Bound',
                    data: [68, 70, 69, 71, 72, 70, 68, 66, 68],
                    borderColor: 'transparent',
                    fill: false,
                    pointRadius: 0
                },
                {
                    label: 'Upper Bound',
                    data: [76, 78, 77, 79, 80, 78, 76, 74, 76],
                    borderColor: 'transparent',
                    fill: '-1', // Fill to lower bound
                    backgroundColor: 'rgba(188, 19, 254, 0.05)',
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            plugins: { legend: { labels: { color: '#a0a0ba' } } },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a0a0ba' } },
                x: { grid: { display: false }, ticks: { color: '#a0a0ba' } }
            }
        }
    });

    // Toggle Edge/Cloud Mode
    const cloudToggle = document.getElementById('cloud-toggle');
    cloudToggle.addEventListener('change', (e) => {
        const mode = e.target.checked ? "Cloud Inference" : "Local TF.js Edge";
        alert(`Switched to ${mode} Model.`);
    });

    // Random Anomaly Generator
    function checkAnomalies() {
        const rand = Math.random();
        const statusEl = document.getElementById('anomaly-status');
        const fillEl = document.querySelector('.meter-fill');
        const labelEl = document.querySelector('.risk-label');
        const factorsList = document.getElementById('risk-factors-list');

        const factors = [
            "Sleep Quality (Variable)", "Hydration (Analysis Needed)",
            "Stress Level (Elevated)", "Radiation (Nominal)",
            "CO2 Exposure (Low)", "Muscle Fatigue (Detected)"
        ];

        if (rand > 0.8) { // Increased frequency for demo
            // Trigger Warning
            statusEl.className = 'anomaly-indicator alert';
            statusEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> <span id="anomaly-text">Warning: Arrhythmia Risk Detected</span>';
            fillEl.style.width = '85%';
            fillEl.className = 'meter-fill high';
            labelEl.className = 'risk-label warning-text';
            labelEl.innerText = 'High';

            // Random factors
            factorsList.innerHTML = `
                <li>${factors[Math.floor(Math.random() * factors.length)]}</li>
                <li>${factors[Math.floor(Math.random() * factors.length)]}</li>
            `;
        } else {
            // Calm
            statusEl.className = 'anomaly-indicator safe';
            statusEl.innerHTML = '<i class="fa-solid fa-shield-halved"></i> <span id="anomaly-text">No Anomalies Detected</span>';
            fillEl.style.width = '15%';
            fillEl.className = 'meter-fill';
            labelEl.className = 'risk-label success-text';
            labelEl.innerText = 'Low';

            factorsList.innerHTML = `
                <li>Sleep Quality (Stable)</li>
                <li>Hydration (Optimal)</li>
            `;
        }
    }

    // Check for anomalies every 10 seconds
    setInterval(checkAnomalies, 10000);

    // --- 4. Floating AI ---
    const aiBtn = document.getElementById('ai-assistant-btn');
    // Simple alert for now, in a real app would toggle the modal
    aiBtn.addEventListener('click', () => {
        alert("AstroAI: All systems are optimal. I am analyzing the environmental data.");
    });
});
