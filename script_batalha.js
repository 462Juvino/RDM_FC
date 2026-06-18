// =======================================================
// MOTOR EXCLUSIVO: BATALHA BRASILEIRÃO
// =======================================================

// Áudios
const audioAmbience1 = document.getElementById('audio-ambience-1');
const audioAmbience2 = document.getElementById('audio-ambience-2');
const audioHino = document.getElementById('audio-hino');
const audioGoal = document.getElementById('audio-goal');
const toastEl = document.getElementById('narrative-toast');

let audioEnabled = false;
let masterCrowdVolume = 0.5;
let isRunning = false;
let batalhaData = {}; // Guarda { "Flamengo": {g1: "Rosa", g2: "", score: 0}, ... }
let currentTop1 = "";
let currentTop2 = "";
let hinoTimeout = null;
let hinoFade = null;
let toastTimeout = null;

const synth = window.speechSynthesis;

// ================= DICIONÁRIOS (SOFASCORE) =================
const mapEscudos = {
    "Atlético Mineiro": "Atletico mineiro", "Atlético Paranaense": "Atletico paranaense", "Grêmio": "Gremio", "Vitória": "Vitoria",
    "Sport": "https://api.sofascore.app/api/v1/team/1959/image", "Ceará": "https://api.sofascore.app/api/v1/team/1954/image", "Goiás": "https://api.sofascore.app/api/v1/team/1960/image", "Vila Nova": "https://api.sofascore.app/api/v1/team/1982/image", "Novorizontino": "https://api.sofascore.app/api/v1/team/20117/image", "América-MG": "https://api.sofascore.app/api/v1/team/1973/image", "Paysandu": "https://api.sofascore.app/api/v1/team/1984/image", "Avaí": "https://api.sofascore.app/api/v1/team/1963/image",
    "Boca Juniors": "https://api.sofascore.app/api/v1/team/3202/image", "River Plate": "https://api.sofascore.app/api/v1/team/3211/image", "Racing": "https://api.sofascore.app/api/v1/team/3205/image", "Independiente": "https://api.sofascore.app/api/v1/team/3204/image", "San Lorenzo": "https://api.sofascore.app/api/v1/team/3208/image", "Peñarol": "https://api.sofascore.app/api/v1/team/3317/image", "Nacional URU": "https://api.sofascore.app/api/v1/team/3313/image", "Colo-Colo": "https://api.sofascore.app/api/v1/team/3154/image", "Universidad de Chile": "https://api.sofascore.app/api/v1/team/3165/image", "Olimpia": "https://api.sofascore.app/api/v1/team/3267/image", "Cerro Porteño": "https://api.sofascore.app/api/v1/team/3264/image", "LDU": "https://api.sofascore.app/api/v1/team/3242/image", "Independiente del Valle": "https://api.sofascore.app/api/v1/team/44265/image", "Atlético Nacional": "https://api.sofascore.app/api/v1/team/3221/image", "Millonarios": "https://api.sofascore.app/api/v1/team/3226/image", "América de Cali": "https://api.sofascore.app/api/v1/team/3217/image", "Bolívar": "https://api.sofascore.app/api/v1/team/3144/image", "The Strongest": "https://api.sofascore.app/api/v1/team/3148/image", "Inter Miami": "https://api.sofascore.app/api/v1/team/260388/image",
    "Real Madrid": "https://api.sofascore.app/api/v1/team/2829/image", "Barcelona": "https://api.sofascore.app/api/v1/team/2817/image", "Atlético de Madrid": "https://api.sofascore.app/api/v1/team/2836/image", "Manchester City": "https://api.sofascore.app/api/v1/team/17/image", "Arsenal": "https://api.sofascore.app/api/v1/team/42/image", "Liverpool": "https://api.sofascore.app/api/v1/team/44/image", "Manchester United": "https://api.sofascore.app/api/v1/team/35/image", "Chelsea": "https://api.sofascore.app/api/v1/team/38/image", "Bayern de Munique": "https://api.sofascore.app/api/v1/team/2672/image", "Borussia Dortmund": "https://api.sofascore.app/api/v1/team/2673/image", "Bayer Leverkusen": "https://api.sofascore.app/api/v1/team/2681/image", "PSG": "https://api.sofascore.app/api/v1/team/1644/image", "Juventus": "https://api.sofascore.app/api/v1/team/2687/image", "Inter de Milão": "https://api.sofascore.app/api/v1/team/2697/image", "Milan": "https://api.sofascore.app/api/v1/team/2692/image", "Roma": "https://api.sofascore.app/api/v1/team/2702/image", "Porto": "https://api.sofascore.app/api/v1/team/3002/image", "Benfica": "https://api.sofascore.app/api/v1/team/3006/image", "Sporting": "https://api.sofascore.app/api/v1/team/3001/image",
    "Brasil": "https://api.sofascore.app/api/v1/team/4748/image", "Argentina": "https://api.sofascore.app/api/v1/team/4704/image", "Uruguai": "https://api.sofascore.app/api/v1/team/4725/image", "Colômbia": "https://api.sofascore.app/api/v1/team/4714/image", "França": "https://api.sofascore.app/api/v1/team/4719/image", "Inglaterra": "https://api.sofascore.app/api/v1/team/4713/image", "Espanha": "https://api.sofascore.app/api/v1/team/4698/image", "Alemanha": "https://api.sofascore.app/api/v1/team/4711/image", "Portugal": "https://api.sofascore.app/api/v1/team/4708/image", "Itália": "https://api.sofascore.app/api/v1/team/4707/image", "Holanda": "https://api.sofascore.app/api/v1/team/4705/image", "Bélgica": "https://api.sofascore.app/api/v1/team/4717/image"
};

function getUrlEscudo(nomeDoTime) {
    let mapeado = mapEscudos[nomeDoTime] || nomeDoTime;
    if (mapeado.startsWith("http")) {
        if (mapeado.includes("sofascore")) return mapeado;
        return `https://wsrv.nl/?url=${encodeURIComponent(mapeado)}&w=200&h=200&fit=contain`;
    }
    return `esculdos/${mapeado}.png`; // Removido o /static/
}

const mapEstadiosImg = {
    "Palmeiras": "Allianz Parque (São Paulo)Palmeiras.webp", "Chapecoense": "Arena Condá (Chapecó) Chapecoense.webp",
    "Atlético Paranaense": "Arena da Baixada (Curitiba) Athletico-PR.webp", "Grêmio": "Arena do Grêmio (Porto Alegre) Grêmio.webp",
    "Bahia": "Arena Fonte Nova (Salvador) Bahia.webp", "Atlético Mineiro": "Arena MRV (Belo Horizonte) Atlético-MG.webp",
    "Vitória": "Barradão (Salvador) Vitória.webp", "Internacional": "Beira-Rio (Porto Alegre) Internacional.webp",
    "Mirassol": "Campos Maia (Mirassol) Mirassol.webp", "Coritiba": "Couto Pereira (Curitiba) Coritiba.webp",
    "Botafogo": "Estádio Nilton Santos (Rio de Janeiro) Botafogo.webp", "Flamengo": "Maracanã (Rio de Janeiro) Flamengo.webp",
    "Fluminense": "Maracanã (Rio de Janeiro)Fluminense.webp", "Cruzeiro": "Mineirão (Belo Horizonte) Cruzeiro.webp",
    "São Paulo": "Morumbi (São Paulo) São Paulo.webp", "Corinthians": "Neo Química Arena (São Paulo) Corinthians.webp",
    "Vasco": "São Januário (Rio de Janeiro) Vasco.webp", "Santos": "Vila Belmiro(Santos) Santos.webp",
    "Remo": "Mangueirão (Belém) Remo.webp", "Bragantino": "Nabi Abi Chedid.webp"
};

const estadiosGenericos = [
    "https://images.unsplash.com/photo-1518605368461-1ee7e53f0f7f?q=80&w=1280",
    "https://images.unsplash.com/photo-1508344928928-7137b2f6022e?q=80&w=1280"
];

// ================= FUNÇÕES BÁSICAS =================

function unlockAudio() {
    audioEnabled = true;
    document.getElementById('audio-unlock-overlay').style.display = 'none';
    if(isRunning) {
        audioAmbience1.play().catch(()=>{});
        audioAmbience2.play().catch(()=>{});
    }
}

function padronizarTexto(texto) {
    if(!texto) return "";
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "").toUpperCase();
}

function showToast(txt) {
    toastEl.innerText = txt;
    toastEl.style.opacity = 1;
    if(toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => { toastEl.style.opacity = 0; }, 3000);
}

function narrate(text, force = false) {
    showToast(text);
    if (!synth) return;
    if (force) synth.cancel(); else if (synth.speaking) return;
    let voice = synth.getVoices().find(v => v.lang.includes('pt')) || synth.getVoices()[0];
    let utter = new SpeechSynthesisUtterance(text);
    utter.voice = voice; utter.rate = 1.1; synth.speak(utter);
}

// ==========================================
// 📡 FASE 2: RELÓGIO FISCAL E ANTENA HÍBRIDA
// ==========================================

// 1. Relógio Fiscal
setInterval(() => {
    if (window.rdmPerfil === "gratuito" || window.rdmPerfil === "plus premium") {
        let horaAtual = Date.now();
        if (!window.rdmSessaoIniciada) window.rdmSessaoIniciada = horaAtual;
        if ((horaAtual - window.rdmSessaoIniciada) >= ((window.rdmPerfil === "gratuito") ? 7200000 : 151200000)) {
            isRunning = false; audioAmbience1.pause(); audioAmbience2.pause();
            let bs = document.getElementById('rdm-block-screen');
            if (!bs) {
                bs = document.createElement('div'); bs.id = 'rdm-block-screen';
                bs.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.95); z-index:999999; display:flex; flex-direction:column; justify-content:center; align-items:center;';
                bs.innerHTML = `<h1 style='color:#facc15; font-size:40px; text-shadow:0 0 20px #facc15;'>⏱️ TEMPO ESGOTADO!</h1><p style='color:white; font-size:20px;'>A carga de horas do seu plano atual chegou ao fim.</p>`;
                document.body.appendChild(bs); if (wsNuvemB) wsNuvemB.close(); if (wsTikfinityB) wsTikfinityB.close();
            }
            return;
        }
    }
}, 1000);

// 2. Processador Unificado da Batalha
function processarEventoDaAPIBatalha(d) {
    if (!isRunning) return;
    let evento = d.event; let dados = d.data;
    if (!dados) return;

    let nickname = (dados.nickname || dados.uniqueId || dados.userId || "").trim();
    if (!nickname || nickname.toLowerCase() === "none") return;

    if (evento === "gift") {
        let giftName = padronizarTexto(dados.giftName);
        for (let team in batalhaData) {
            if (giftName === batalhaData[team].g1 || giftName === batalhaData[team].g2) {
                batalhaData[team].score += 1;
                triggerBatalhaGoal(team, nickname);
                updateBatalhaGrid();
                break;
            }
        }
    }
}

// 3. A Antena Híbrida Inteligente
let conexaoNuvemEstabelecidaB = false; let wsNuvemB = null; let wsTikfinityB = null; let lastTiktokUserB = "";

function conectarNuvemBatalha() {
    let targetUser = window.rdmUser;
    if (!targetUser) return;
    if (conexaoNuvemEstabelecidaB && lastTiktokUserB === targetUser) return;

    // ⚠️ A CORREÇÃO DE LOOP: Impede que o jogo cancele a conexão enquanto a torre acorda!
    if (wsNuvemB && wsNuvemB.readyState === WebSocket.CONNECTING) return;

    if (wsNuvemB) wsNuvemB.close();

    lastTiktokUserB = targetUser;
    console.log(`☁️ Tentando Nuvem Batalha para: @${targetUser}...`);

    wsNuvemB = new WebSocket("wss://torre-de-controle-rdm.onrender.com:443/");

    wsNuvemB.onopen = () => {
        conexaoNuvemEstabelecidaB = true;
        console.log(`✅ NUVEM BATALHA CONECTADA! Escutando: @${targetUser}`);

        // 🪄 A LINHA MÁGICA: Avisa a Torre qual Live espelhar agora!
        wsNuvemB.send(JSON.stringify({ action: "connect", tiktok_user: targetUser }));

        // ⚠️ A PROVA VISUAL NO MODO BATALHA (Usa o Toast de Narração)
        showToast(`☁️ NUVEM RDM LIGADA! (@${targetUser})`);
    };

    wsNuvemB.onmessage = (event) => { try { processarEventoDaAPIBatalha(JSON.parse(event.data)); } catch(e) {} };
    wsNuvemB.onclose = () => { conexaoNuvemEstabelecidaB = false; wsNuvemB = null; };
}

function verificarEConectarBatalha() {
    if (!wsTikfinityB || wsTikfinityB.readyState === WebSocket.CLOSED) {
        wsTikfinityB = new WebSocket("ws://127.0.0.1:21213/");
        wsTikfinityB.onopen = () => {
            console.log("✅ TikFinity Local Conectado!");
            if (wsNuvemB) { wsNuvemB.close(); wsNuvemB = null; conexaoNuvemEstabelecidaB = false; }
        };
        wsTikfinityB.onmessage = (event) => { try { processarEventoDaAPIBatalha(JSON.parse(event.data)); } catch(e) {} };
        wsTikfinityB.onerror = () => { conectarNuvemBatalha(); };
        wsTikfinityB.onclose = () => { wsTikfinityB = null; };
    } else if (wsTikfinityB.readyState === WebSocket.OPEN) {
        if (wsNuvemB) { wsNuvemB.close(); wsNuvemB = null; conexaoNuvemEstabelecidaB = false; }
    }
}
setInterval(verificarEConectarBatalha, 2000);

// ================= COMANDOS DO PAINEL =================
const hostChannel = new BroadcastChannel('game_control');
hostChannel.onmessage = (event) => {
    const data = event.data;

    if (data.command === 'CHANGE_ROUTE') {
        window.location.href = data.route;
        return;
    }

    // RESPONDE AO PAINEL
    if (data.command === 'ASK_MODE') { hostChannel.postMessage({ command: 'REPLY_MODE', mode: 'batalha' }); return; }

    if (data.command === 'SET_VOLUME') {
        masterCrowdVolume = data.crowd;
        audioAmbience1.volume = masterCrowdVolume * 0.65;
        audioAmbience2.volume = masterCrowdVolume * 0.35;
    }

    if (data.command === 'START_BATALHA_MODO') {
        batalhaData = data.teamsConfig;
        isRunning = true;
        initBatalhaGrid();

        if (!audioEnabled) {
            document.getElementById('audio-unlock-overlay').style.background = 'rgba(231, 76, 60, 0.95)';
            document.getElementById('unlock-h1').innerText = "CLIQUE AQUI PRIMEIRO!";
            document.getElementById('unlock-p').innerText = "O jogo já iniciou, liberte o áudio para começar a narração!";
        } else {
            narrate("O Brasileirão 2026 começou! Enviem os presentes para colocar o seu time no topo da tabela!", true);
        }
    }

    if (data.command === 'UPDATE_BATALHA_MODO') {
        for (let team in data.teamsConfig) {
            if (batalhaData[team]) {
                batalhaData[team].g1 = data.teamsConfig[team].g1;
                batalhaData[team].g2 = data.teamsConfig[team].g2;
            }
        }
        updateBatalhaGrid();
    }

    if (data.command === 'END_BATALHA_MODO') {
        endGame();
    }
};

// ================= LÓGICA DE RANKING E ÁUDIO (SEM LAG) =================

// Cria os blocos HTML no início (Executa só 1 vez)
function initBatalhaGrid() {
    const grid = document.getElementById('batalha-grid');
    grid.innerHTML = '';

    let teamsArray = Object.keys(batalhaData).map(key => { return { name: key, ...batalhaData[key] }; });

    // ORDEM ALFABÉTICA INICIAL (JÁ QUE TODOS TEM 0)
    teamsArray.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.name.localeCompare(b.name);
    });

    teamsArray.forEach((teamObj, index) => {
        let rankClass = index === 0 ? 'rank-1' : (index === 1 ? 'rank-2' : (index === 2 ? 'rank-3' : 'rank-rest'));
        let presentsTxt = teamObj.g1; if(teamObj.g2) presentsTxt += ` ou ${teamObj.g2}`;
        let safeName = teamObj.name.replace(/\s+/g, '-');

        let card = document.createElement('div');
        card.className = `batalha-card ${rankClass}`;
        card.id = `bat-card-${safeName}`;
        card.innerHTML = `
            <div class="rank-pos" id="bat-pos-${safeName}">${index + 1}º</div>
            <img src="${getUrlEscudo(teamObj.name)}">
            <h2>${teamObj.name} <span class="presents-hint" id="bat-hint-${safeName}">🎁 ${presentsTxt}</span></h2>
            <div class="batalha-score" id="bat-score-${safeName}">${teamObj.score}</div>
        `;
        grid.appendChild(card);
    });

    updateBatalhaCrowd(teamsArray);
}

// Atualiza posições e gols sem apagar divs (Ultra-rápido)
function updateBatalhaGrid() {
    const grid = document.getElementById('batalha-grid');
    let teamsArray = Object.keys(batalhaData).map(key => { return { name: key, ...batalhaData[key] }; });

    teamsArray.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.name.localeCompare(b.name); // Desempate alfabético
    });

    teamsArray.forEach((teamObj, index) => {
        let rankClass = index === 0 ? 'rank-1' : (index === 1 ? 'rank-2' : (index === 2 ? 'rank-3' : 'rank-rest'));
        let safeName = teamObj.name.replace(/\s+/g, '-');
        let card = document.getElementById(`bat-card-${safeName}`);

        let presentsTxt = teamObj.g1; if(teamObj.g2) presentsTxt += ` ou ${teamObj.g2}`;

        if (card) {
            card.className = `batalha-card ${rankClass}`;
            document.getElementById(`bat-pos-${safeName}`).innerText = `${index + 1}º`;
            document.getElementById(`bat-score-${safeName}`).innerText = teamObj.score;
            document.getElementById(`bat-hint-${safeName}`).innerText = `🎁 ${presentsTxt}`;
            grid.appendChild(card); // Reordena o elemento nativamente
        }
    });

    updateBatalhaCrowd(teamsArray);
}

function updateBatalhaCrowd(teamsArray) {
    if (teamsArray.length === 0) return;
    let top1 = teamsArray[0].name;
    let top2 = teamsArray.length > 1 ? teamsArray[1].name : top1;

    // ESTÁDIO DO LÍDER NO FUNDO
    let bgFilename = mapEstadiosImg[top1];
    let stadiumEl = document.getElementById('stadium-bg');
    if (bgFilename) {
        stadiumEl.style.backgroundImage = `url('estadios/${bgFilename}')`;
    } else {
        stadiumEl.style.backgroundImage = `url('${estadiosGenericos[0]}')`;
    }

    if (top1 !== currentTop1) {
        currentTop1 = top1;
        audioAmbience1.src = `sounds/${top1} torcida.mp3`;
        if (audioEnabled) audioAmbience1.play().catch(()=>{});
    }
    if (top2 !== currentTop2) {
        currentTop2 = top2;
        audioAmbience2.src = `sounds/${top2} torcida.mp3`;
        if (audioEnabled) audioAmbience2.play().catch(()=>{});
    }

    audioAmbience1.volume = masterCrowdVolume * 0.7;
    audioAmbience2.volume = masterCrowdVolume * 0.4;
}

// 🔥 SOM DE GOL, NARRAÇÃO E HINO (7 SEGUNDOS, CORTA SE SAIR OUTRO)
function triggerBatalhaGoal(teamName, nickname) {
    audioGoal.currentTime=0; audioGoal.volume=1.0; audioGoal.play().catch(()=>{});

    let safeName = teamName.replace(/\s+/g, '-');
    let card = document.getElementById(`bat-card-${safeName}`);
    if (card) {
        card.classList.remove('batalha-anim-goal');
        void card.offsetWidth; // Força reinício da animação css
        card.classList.add('batalha-anim-goal');
    }

    narrate(`Golaço! ${nickname} mandou presente e marcou para o ${teamName}!`, true);

    // Reseta timers do hino anterior
    if(hinoTimeout) clearTimeout(hinoTimeout);
    if(hinoFade) clearInterval(hinoFade);

    audioHino.src = `sounds/${teamName} Hino.mp3`;
    audioHino.onerror = () => { audioHino.src = `sounds/gol_generico.mp3`; audioHino.play().catch(()=>{}); };

    audioHino.currentTime = 0;
    audioHino.volume = 1.0;
    if (audioEnabled) audioHino.play().catch(()=>{});

    // Fade out em 7 segundos exatos
    hinoTimeout = setTimeout(() => {
        hinoFade = setInterval(() => {
            if (audioHino.volume > 0.1) audioHino.volume -= 0.1;
            else {
                clearInterval(hinoFade);
                audioHino.pause();
            }
        }, 100);
    }, 10000);
}

// ================= FIM DE JOGO =================
function endGame() {
    isRunning = false;

    let teamsArray = Object.keys(batalhaData).map(key => { return { name: key, ...batalhaData[key] }; });
    teamsArray.sort((a, b) => b.score - a.score);
    let champion = teamsArray[0];

    narrate(`Fim da Batalha! O grande campeão do Brasileirão foi o ${champion.name} com incríveis ${champion.score} gols!`, true);

    document.getElementById('batalha-wrapper').style.display = 'none';
    document.getElementById('tc-crest').src = getUrlEscudo(champion.name);
    document.getElementById('tc-name').innerText = champion.name;
    document.getElementById('tournament-champion-overlay').style.display = 'flex';

    audioAmbience1.pause();
    audioAmbience2.pause();

    audioHino.src = `sounds/${champion.name} Hino.mp3`;
    audioHino.onerror = () => { audioHino.src = `sounds/gol_generico.mp3`; audioHino.play().catch(()=>{}); };
    audioHino.currentTime = 0; audioHino.volume = 1.0; audioHino.loop = true;
    audioHino.play().catch(()=>{});

    audioAmbience1.src = `sounds/${champion.name} torcida.mp3`;
    audioAmbience1.currentTime = 0; audioAmbience1.volume = masterCrowdVolume; audioAmbience1.loop = true;
    audioAmbience1.play().catch(()=>{});

    championInterval = setInterval(spawnConfetti, 800);
}

function spawnConfetti() {
    for(let i=0; i<15; i++){
        let c = document.createElement('div');
        c.className = 'confetti';
        c.style.left = Math.random() * 100 + 'vw';
        c.style.backgroundColor = `hsl(${Math.random()*360}, 100%, 50%)`;
        c.style.animationDuration = (Math.random() * 2 + 2) + 's';
        document.body.appendChild(c);
        setTimeout(()=>c.remove(), 4000);
    }
}

// Assim que o script liga, avisa o painel (caso ele já esteja à escuta)
hostChannel.postMessage({ command: 'REPLY_MODE', mode: 'batalha' });