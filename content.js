let isRunning = false;
let config = {
    scrollSpeed: 50,
    minScrollInterval: 100,
    maxScrollInterval: 200,
    minPreClickDelay: 500,
    maxPreClickDelay: 1000,
};
let excludedBars = new Set();
const SELECTOR = '.feed-shared-social-action-bar';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "START_SCROLL") {
        console.log("🟢 Botliker: Recibida señal de inicio/actualización. Config:", request.config);
        config = { ...config, ...request.config };

        if (!isRunning) {
            isRunning = true;
            excludedBars = new Set();
            processFeed();
        }
    } else if (request.action === "STOP_SCROLL") {
        console.log("🔴 Botliker: Deteniendo.");
        isRunning = false;
    }
});

async function processFeed() {
    if (!isRunning) return;

    const visibleBars = Array.from(document.querySelectorAll(SELECTOR))
        .filter(bar => !excludedBars.has(bar) && isElementInViewport(bar));

    if (visibleBars.length > 0) {
        await clickButtonFromActionBars(visibleBars);
    }

    if (isRunning) {
        smoothScroll();
    }
}

async function clickButtonFromActionBars(actionBars) {
    for (const bar of actionBars) {
        if (!isRunning) break;
        if (!excludedBars.has(bar)) {
            const likeButton = bar.querySelector('button[aria-pressed="false"]');

            if (likeButton) {
                likeButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await new Promise(r => setTimeout(r, randomDelay(config.minPreClickDelay, config.maxPreClickDelay)));

                likeButton.click();
                console.log('👍 Like ejecutado.');
            } else {
                console.log('⏩ Publicación ya tiene like o no es likeable, saltando.');
            }

            excludedBars.add(bar);
        }
    }
}

function smoothScroll() {
    if (!isRunning) return;

    window.scrollBy({ top: config.scrollSpeed, behavior: 'smooth' });

    setTimeout(() => {
        processFeed();
    }, randomDelay(config.minScrollInterval, config.maxScrollInterval));
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function randomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}