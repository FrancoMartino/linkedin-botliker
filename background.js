let state = {
    isRunning: false,
    isPaused: false,
    currentTabIndex: 0,
    tabIds: [],
    intervalId: null,
    config: {}
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case "START_SESSION":
            handleStart(message.config);
            break;
        case "PAUSE_SESSION":
            handlePause();
            break;
        case "STOP_SESSION":
            handleStop();
            break;
        case "GET_STATUS":
            sendResponse(state);
            break;
    }
});

async function handleStart(newConfig) {
    if (state.isRunning && !state.isPaused) return;

    if (state.isPaused) {
        console.log("Reanudando sesión...");
        state.isPaused = false;
        state.isRunning = true;
        processNextTab();
        startInterval();
        return;
    }

    state.config = newConfig;
    state.currentTabIndex = 0;

    const tabs = await chrome.tabs.query({ url: "*://*.linkedin.com/*" });

    tabs.sort((a, b) => a.index - b.index);

    const maxTabs = parseInt(state.config.maxTabs) || 100;
    state.tabIds = tabs.slice(0, maxTabs).map(t => t.id);

    if (state.tabIds.length === 0) {
        console.log("No se encontraron pestañas de LinkedIn.");
        return;
    }

    console.log(`Iniciando Botliker en ${state.tabIds.length} pestañas.`);
    state.isRunning = true;
    state.isPaused = false;

    processNextTab();
    startInterval();
}

function handlePause() {
    console.log("Pausando sesión...");
    state.isPaused = true;
    clearInterval(state.intervalId);

    const currentId = state.tabIds[state.currentTabIndex];
    if (currentId) {
        chrome.tabs.sendMessage(currentId, { action: "STOP_SCROLL" }).catch(() => { });
    }
}

function handleStop() {
    console.log("Deteniendo sesión completamente.");
    state.isRunning = false;
    state.isPaused = false;
    state.currentTabIndex = 0;
    clearInterval(state.intervalId);

    state.tabIds.forEach(id => {
        chrome.tabs.sendMessage(id, { action: "STOP_SCROLL" }).catch(() => { });
    });
    state.tabIds = [];
}

function startInterval() {
    if (state.intervalId) clearInterval(state.intervalId);
    const switchMs = (state.config.tabSwitchTime || 10) * 1000;
    state.intervalId = setInterval(processNextTab, switchMs);
}

async function processNextTab() {
    if (!state.isRunning || state.isPaused || state.tabIds.length === 0) return;

    const prevIndex = (state.currentTabIndex - 1 + state.tabIds.length) % state.tabIds.length;
    const prevTabId = state.tabIds[prevIndex];
    if (prevTabId !== state.tabIds[state.currentTabIndex]) {
        chrome.tabs.sendMessage(prevTabId, { action: "STOP_SCROLL" }).catch(() => { });
    }

    const activeTabId = state.tabIds[state.currentTabIndex];

    try {
        await chrome.tabs.update(activeTabId, { active: true });
        setTimeout(() => {
            chrome.tabs.sendMessage(activeTabId, {
                action: "START_SCROLL",
                config: state.config
            }).catch(err => console.log("Error comunicando con tab (quizás recargada):", activeTabId));
        }, 1000);

    } catch (error) {
        console.log("La pestaña ya no existe, saltando...");
    }

    state.currentTabIndex = (state.currentTabIndex + 1) % state.tabIds.length;
}