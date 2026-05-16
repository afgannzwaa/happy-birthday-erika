// ==========================================================================
// 7. CORE PROGRAM LOGIC & CONTROLLER ENGINE (JAVASCRIPT)
// ==========================================================================

const DISCORD_TARGET_WEBHOOK = "https://discord.com/api/webhooks/1485979048617181297/GNSzTq9ulWI-YgLzXQsoJWcd-3B6cJ7WzbEKgiK2zBmrTG77R4kv5RV3puuXVL4-MxOr";

const URL_PRIZE_1 = "https://afgannzwaa.github.io/Buku/";
const URL_PRIZE_2 = "https://love.tsonit.com/for-erika";

document.addEventListener("DOMContentLoaded", () => {
    verifyButtonStateMemory('btn1');
    verifyButtonStateMemory('btn2');
    verifyButtonStateMemory('btn3');
    verifyButtonStateMemory('btn4');
    verifyButtonStateMemory('prize1');
    verifyButtonStateMemory('prize2');
    
    checkPrizeLockStatus();
    launchParticleVisualEngine();
    transmitTelemetryToDiscord("🌐 [Two Prizes System V4]: Erika / User membuka halaman website utama.");
});

function verifyButtonStateMemory(buttonDomId) {
    try {
        if (localStorage.getItem(buttonDomId) === 'clicked') {
            const targetBtn = document.getElementById(buttonDomId);
            if (targetBtn) {
                targetBtn.classList.add('clicked-memory');
            }
        }
    } catch (e) {
        console.error("Gagal membaca status memori lokal:", e);
    }
}

function registerInteractionToMemory(buttonDomId) {
    try {
        localStorage.setItem(buttonDomId, 'clicked');
        verifyButtonStateMemory(buttonDomId);
        if (buttonDomId === 'prize1') {
            checkPrizeLockStatus();
        }
    } catch (e) {
        console.warn("Penyimpanan local storage tidak didukung:", e);
    }
}

function checkPrizeLockStatus() {
    const prize2Btn = document.getElementById('prize2');
    if (!prize2Btn) return;

    // Jika prize1 belum pernah diklik/dibuka, gembok prize2
    if (localStorage.getItem('prize1') !== 'clicked') {
        prize2Btn.classList.add('locked-prize');
    } else {
        prize2Btn.classList.remove('locked-prize');
    }
}

function executeCardTransition(currentSectionId, targetSectionId) {
    const activeCard = document.getElementById(currentSectionId);
    const nextCard = document.getElementById(targetSectionId);

    if (!activeCard || !nextCard) return;

    activeCard.style.opacity = '0';
    activeCard.style.transform = 'scale(0.94) translateY(-12px)';
    
    setTimeout(() => {
        activeCard.style.display = 'none';
        activeCard.classList.remove('active');
        
        nextCard.style.display = 'block';
        void nextCard.offsetWidth;
        nextCard.classList.add('active');
        
        setTimeout(() => {
            nextCard.style.opacity = '1';
            nextCard.style.transform = 'scale(1) translateY(0)';
        }, 50);
    }, 600);
}

function transmitTelemetryToDiscord(logMessage) {
    const timestampString = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' });
    
    const networkPayload = {
        content: logMessage,
        embeds: [
            {
                title: "📊 Live User Interaction Log",
                description: `Waktu Kejadian (WITA): **${timestampString}**`,
                color: 2195933,
                footer: {
                    text: "Erika Engagement Tracker Two Prizes Console"
                }
            }
        ]
    };

    fetch(DISCORD_TARGET_WEBHOOK, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(networkPayload),
        keepalive: true
    }).catch(err => {});
}

function executeSection1Sequence() {
    const audioDriver = document.getElementById('bgMusic');
    const audioIndicatorHUD = document.getElementById('audioStatus');
    
    audioDriver.play().then(() => {
        audioIndicatorHUD.style.display = 'flex';
    }).catch(e => {});

    registerInteractionToMemory('btn1');
    transmitTelemetryToDiscord("✨ [Interaksi]: Erika menekan tombol **SAY HEY**.");
    executeCardTransition('sec1', 'sec2');
}

function executeSection2Sequence() {
    registerInteractionToMemory('btn2');
    transmitTelemetryToDiscord("✉️ [Interaksi]: Erika menekan tombol **OPEN TEXT**.");
    executeCardTransition('sec2', 'sec3');
}

function executeSection3Sequence() {
    registerInteractionToMemory('btn3');
    transmitTelemetryToDiscord("🎉 [Interaksi]: Erika menekan tombol respons **iyaa**.");
    executeCardTransition('sec3', 'sec4');
}

function executeSection4Sequence() {
    registerInteractionToMemory('btn4');
    transmitTelemetryToDiscord("🔮 [Interaksi]: Erika menekan tombol **go check**.");
    executeCardTransition('sec4', 'sec5');
}

function handlePrize1Click() {
    registerInteractionToMemory('prize1');
    transmitTelemetryToDiscord(`🎁 [HADIAH 1]: Erika mengklik PRIZE BOX 1 -> ${URL_PRIZE_1}`);
    
    setTimeout(() => {
        window.location.href = URL_PRIZE_1;
    }, 450);
}

function handlePrize2Click() {
    // Validasi: Wajib buka hadiah pertama dulu
    if (localStorage.getItem('prize1') !== 'clicked') {
        alert("Eitss, kamu wajib buka PRIZE BOX 1 dulu yaa sebelum buka yang ini! 😉✨");
        transmitTelemetryToDiscord("⚠️ [PERINGATAN]: Erika mencoba klik PRIZE BOX 2 sebelum membuka PRIZE BOX 1 (Akses Ditolak).");
        return;
    }

    registerInteractionToMemory('prize2');
    transmitTelemetryToDiscord(`🎁 [HADIAH 2]: Erika mengklik PRIZE BOX 2 -> ${URL_PRIZE_2}`);
    
    setTimeout(() => {
        window.location.href = URL_PRIZE_2;
    }, 450);
}

function launchParticleVisualEngine() {
    const ambientCanvas = document.getElementById('particles-js');
    if (!ambientCanvas) return;
    
    const canvasContext = ambientCanvas.getContext('2d');
    let particleRegistry = [];
    
    function coordinateCanvasScale() {
        ambientCanvas.width = window.innerWidth;
        ambientCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', coordinateCanvasScale);
    coordinateCanvasScale();

    class AtmosphericGlowParticle {
        constructor() {
            this.resetParticleState(true);
        }
        
        resetParticleState(isInitialLoad) {
            this.x = Math.random() * ambientCanvas.width;
            this.y = isInitialLoad ? (Math.random() * ambientCanvas.height) : (ambientCanvas.height + 10);
            this.radiusSize = Math.random() * 1.8 + 0.8;
            this.driftVelocityX = Math.random() * 0.4 - 0.2;
            this.driftVelocityY = Math.random() * -0.5 - 0.15;
            this.currentOpacity = Math.random() * 0.4 + 0.3;
        }

        refreshMetrics() {
            this.x += this.driftVelocityX;
            this.y += this.driftVelocityY;
            if (this.y < -5 || this.x < -5 || this.x > ambientCanvas.width + 5) {
                this.resetParticleState(false);
            }
        }

        renderVisuals() {
            canvasContext.fillStyle = `rgba(100, 255, 218, ${this.currentOpacity})`;
            canvasContext.beginPath();
            canvasContext.arc(this.x, this.y, this.radiusSize, 0, Math.PI * 2);
            canvasContext.fill();
        }
    }

    function constructParticlePool() {
        for (let i = 0; i < 45; i++) {
            particleRegistry.push(new AtmosphericGlowParticle());
        }
    }

    function executeRenderLoop() {
        canvasContext.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
        for (let i = 0; i < particleRegistry.length; i++) {
            particleRegistry[i].refreshMetrics();
            particleRegistry[i].renderVisuals();
        }
        requestAnimationFrame(executeRenderLoop);
    }

    constructParticlePool();
    executeRenderLoop();
}