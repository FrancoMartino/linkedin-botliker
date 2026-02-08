document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const statusText = document.getElementById('statusText');

    const inputs = {
        maxTabs: document.getElementById('maxTabs'),
        tabSwitchTime: document.getElementById('tabSwitchTime'),
        scrollSpeed: document.getElementById('scrollSpeed'),
        minScrollInterval: document.getElementById('minScrollInterval'),
        maxScrollInterval: document.getElementById('maxScrollInterval'),
        minPreClickDelay: document.getElementById('minPreClickDelay'),
        maxPreClickDelay: document.getElementById('maxPreClickDelay'),
    };

    chrome.storage.local.get(Object.keys(inputs), (result) => {
        for (const key in inputs) {
            if (result[key]) inputs[key].value = result[key];
        }
    });

    chrome.runtime.sendMessage({ action: "GET_STATUS" }, (state) => {
        updateUI(state);
    });

    startBtn.addEventListener('click', () => {
        const config = {};
        for (const key in inputs) {
            config[key] = parseInt(inputs[key].value);
            chrome.storage.local.set({ [key]: config[key] });
        }

        chrome.runtime.sendMessage({ action: "START_SESSION", config });
        updateUI({ isRunning: true, isPaused: false });
    });

    pauseBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: "PAUSE_SESSION" });
        updateUI({ isRunning: true, isPaused: true });
    });

    stopBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: "STOP_SESSION" });
        updateUI({ isRunning: false, isPaused: false });
    });

    function updateUI(state) {
        if (!state) return;

        if (state.isRunning && !state.isPaused) {
            startBtn.style.display = 'none';
            pauseBtn.style.display = 'inline-block';
            pauseBtn.innerText = "PAUSAR";
            stopBtn.style.display = 'inline-block';
            statusText.innerText = "Estado: EJECUTANDO";
            statusText.style.color = "green";
        } else if (state.isRunning && state.isPaused) {
            startBtn.style.display = 'inline-block';
            startBtn.innerText = "REANUDAR";
            pauseBtn.style.display = 'none';
            stopBtn.style.display = 'inline-block';
            statusText.innerText = "Estado: PAUSADO";
            statusText.style.color = "orange";
        } else {
            startBtn.style.display = 'block';
            startBtn.innerText = "INICIAR";
            pauseBtn.style.display = 'none';
            stopBtn.style.display = 'none';
            statusText.innerText = "Estado: INACTIVO";
            statusText.style.color = "#666";
        }
    }
});