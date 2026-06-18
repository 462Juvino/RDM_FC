// VARIÁVEIS DOM E ÁUDIO
const scoreA_el = document.getElementById('scoreA');
const scoreB_el = document.getElementById('scoreB');
const narrativeText_el = document.getElementById('narrative-text');
const timer_el = document.getElementById('timer');
const crestA_el = document.getElementById('crestA');
const crestB_el = document.getElementById('crestB');
const varContainer = document.getElementById('var-dispute-container');

// ÁUDIO
const audioAmbienceA = document.getElementById('audio-ambience-A');
const audioAmbienceB = document.getElementById('audio-ambience-B');
const audioGoalSound = document.getElementById('audio-goal');
const audioVirada = document.getElementById('audio-virada');
const audioAcredito = document.getElementById('audio-acredito');
let audioEnabled = false;
let masterCrowdVolume = 0.3;

// ESTADO DO JOGO E CONFIG
let gameData = { scoreA: 0, scoreB: 0, nameA: "Time A", nameB: "Time B", isRunning: false, timeLeft: 0 };
let matchMinutes = 5; let varMaxTime = 60; let autoRestartFlag = false; let allowChatCmds = true;
let countdownInterval;

let mappedGifts = { A: {}, B: {} };
let userTeams = {};
let matchScorers = {};
let tourneyScorers = {};
let isNarratingGift = false;

let defenseTimeA = 0; let defenseTimeB = 0; let partialGoalsA = 0; let partialGoalsB = 0;
let isTournamentActive = false; let tourneyMode = "amistoso"; let tourneyQueue = [];
let nextRoundTeams = []; let eliminatedTeams = []; let playedMatches = []; let standings = [];
let championInterval = null;

let isVarActive = false; let varTimer = 0; let varPointsA = 0; let varPointsB = 0; let varCaller = null;
let cardsA = 0; let cardsB = 0;

// ================= MAPEAMENTO DE IMAGENS BLINDADO (SOFASCORE) =================
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
    "https://images.unsplash.com/photo-1508344928928-7137b2f6022e?q=80&w=1280",
    "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=1280"
];

const estadiosNarrador = {
    "Palmeiras": "Allianz Parque", "Atlético Mineiro": "Arena MRV", "Bahia": "Arena Fonte Nova", "Botafogo": "Estádio Nilton Santos", "Flamengo": "Maracanã", "Fluminense": "Maracanã", "Grêmio": "Arena do Grêmio", "Internacional": "Beira-Rio", "São Paulo": "MorumBis", "Santos": "Vila Belmiro", "Atlético Paranaense": "Arena da Baixada", "Vasco": "São Januário", "Vitória": "Barradão", "Cruzeiro": "Mineirão", "Corinthians": "Neo Química Arena", "Coritiba": "Couto Pereira", "Chapecoense": "Arena Condá", "Mirassol": "Campos Maia", "Remo": "Mangueirão"
};

function getMatchPhase() {
    if (!isTournamentActive) return "neste amistoso pegado";
    if (tourneyMode.includes('campeonato')) return "por mais uma rodada do campeonato";
    if (tourneyMode === 'matamata') {
        let totalTeams = (tourneyQueue.length * 2) + 2;
        if (totalTeams === 2) return "pela GRANDE FINAL da Copa";
        if (totalTeams === 4) return "pela grande Semifinal";
        if (totalTeams === 8) return "pelas Quartas de Final";
        return "pelas eliminatórias da Copa";
    }
    return "";
}

const narracoes = {
    kickoff: [ "E rola a bola [FASE] no [ESTADIO]! [TIMEA] parte para cima desde o primeiro segundo!", "Apita o árbitro! Começa o grande duelo [FASE] no [ESTADIO] entre [TIMEA] e [TIMEB]!" ],
    goal: [ "GOL! Que jogada cristalina, finalização perfeita no canto! O estádio vai à loucura! Agora [TIMEA] [SCOREA], [TIMEB] [SCOREB]!", "GOL! Logo após a falha da defesa, domínio e finalização pro fundo da rede! Explode o [ESTADIO]! Placar: [TIMEA] [SCOREA] a [SCOREB] para o [TIMEB]!", "QUE GOLAÇO! O goleiro nem viu a cor da bola! O placar se movimenta: [SCOREA] a [SCOREB]!" ],
    defense_active: [ "O [TEAM] fechou a casinha! Subiu a muralha e agora o adversário vai precisar de força em dobro pra fazer gol neles!", "Defesa ativada pelo [TEAM]! Estacionou o ônibus na zaga, quero ver o adversário furar esse bloqueio de 20% do tempo agora!" ],
    defense_blocked: [ "Vem pro ataque o [TEAM]... mas bate na muralha! A defesa tá ganhando todas! Vai precisar mandar presentes em dobro pra marcar!", "O [TEAM] tenta a finalização... cortou a zaga! A muralha tá impenetrável! O adversário ataca com 1 presente, mas não passa nada!" ],
    var_call: [ "O jogo para! Árbitro chamado no rádio... Lance polêmico na área do [TEAM]. Vamos à disputa do VAR!", "Pênalti ou não? Muita reclamação no [ESTADIO]. O árbitro aponta pro VAR no lance do [TEAM]! Momento decisivo!" ],
    var_cancel: [ "O VAR confirmou e a marcação foi anulada! Segue o jogo! O placar segue [TIMEA] [SCOREA] a [SCOREB] pro [TIMEB]!", "Decisão revertida pelo VAR! Alívio para a torcida no [ESTADIO]!" ],
    var_yellow: [ "VAR rejeitado! O árbitro não gostou da simulação e aplicou cartão amarelo pro [TEAM]! A tensão sobe!", "Nada feito no VAR! O árbitro mantém a decisão e pune o [TEAM] com o amarelo por reclamação." ],
    red_card: [ "Vermelho! Entrada violenta e expulsão no [TEAM]. O jogo vira de cabeça para baixo!", "Expulso! O [TEAM] vai ter que se virar com um a menos no [ESTADIO]! Fim de jogo pra ele!" ],
    random_action: [ "[TIMEA] já pressiona, triangulação rápida pela direita, cruzamento fechado... o goleiro sai e encaixa!", "Rápida saída do [TIMEB], contra-ataque em velocidade! Invade a área, chuta cruzado e... por pouco ao lado!", "Escanteio para o [TIMEA]! A bola viaja na área, bate rebate e a zaga tira no sufoco!", "Jogada perigosa do [TIMEB]: troca de passes veloz no meio, infiltração e um susto com chute que carimba a trave!", "Falta dura no meio de campo! Jogador do [TEAM] fica no chão. O clima esquenta no [ESTADIO]!" ],
    end_win: [ "Final de partida no [ESTADIO]! Vitória espetacular do [TEAM] por [SCOREA] a [SCOREB]! Que jogo cheio de emoções!", "Apita o árbitro! Fim de papo! O [TEAM] consagra a vitória neste duelo inesquecível!" ],
    end_tie: [ "Final de jogo! O duelo no [ESTADIO] termina empatado em [SCOREA] a [SCOREB]. Foi um espetáculo de muito equilíbrio!" ]
};

function getRandomPhrase(category, teamFocus = null) {
    let list = narracoes[category];
    let phrase = list[Math.floor(Math.random() * list.length)];
    let estadioLocal = estadiosNarrador[gameData.nameA] || "Estádio Principal";
    phrase = phrase.replace(/\[FASE\]/g, getMatchPhase());
    phrase = phrase.replace(/\[TIMEA\]/g, gameData.nameA);
    phrase = phrase.replace(/\[TIMEB\]/g, gameData.nameB);
    phrase = phrase.replace(/\[ESTADIO\]/g, estadioLocal);
    phrase = phrase.replace(/\[SCOREA\]/g, gameData.scoreA);
    phrase = phrase.replace(/\[SCOREB\]/g, gameData.scoreB);
    if (teamFocus) {
        let teamName = teamFocus === 'A' ? gameData.nameA : gameData.nameB;
        phrase = phrase.replace(/\[TEAM\]/g, teamName);
    }
    return phrase;
}

const synth = window.speechSynthesis;
function narrate(text, isDynamic = false, category = null, teamFocus = null, force = false) {
    let finalSpeech = text;
    if (isDynamic && category) { finalSpeech = getRandomPhrase(category, teamFocus); }
    narrativeText_el.innerText = finalSpeech;

    if (!synth) return;
    if (force) synth.cancel(); else if (synth.speaking) return;

    let voice = synth.getVoices().find(v => v.lang.includes('pt')) || synth.getVoices()[0];
    let utter = new SpeechSynthesisUtterance(finalSpeech);
    utter.voice = voice; utter.rate = 1.1; synth.speak(utter);
}

function unlockAudio() {
    audioEnabled = true;
    document.getElementById('audio-unlock-overlay').style.display = 'none';
    audioAmbienceA.play().then(() => audioAmbienceA.pause()).catch(()=>{});
}

function updateCrowdVolume() {
    if (!gameData.isRunning) return;
    let volA = masterCrowdVolume; let volB = masterCrowdVolume;
    if (gameData.scoreA > gameData.scoreB) { volA = Math.min(1, masterCrowdVolume * 1.5); volB = masterCrowdVolume * 0.3; }
    else if (gameData.scoreB > gameData.scoreA) { volB = Math.min(1, masterCrowdVolume * 1.5); volA = masterCrowdVolume * 0.3; }
    else { volA = Math.min(1, masterCrowdVolume * 1.2); volB = masterCrowdVolume * 0.8; }
    audioAmbienceA.volume = volA; audioAmbienceB.volume = volB;
}

function playSpecialAudio(audioElement) {
    audioAmbienceA.volume = masterCrowdVolume * 0.1; audioAmbienceB.volume = masterCrowdVolume * 0.1;
    audioElement.currentTime = 0; audioElement.volume = 1.0; audioElement.play();
    audioElement.onended = () => updateCrowdVolume();
}

function setAudioWithFallback(audioElement, primarySrc, fallbackSrc) {
    audioElement.onerror = function() {
        if (!audioElement.src.includes(fallbackSrc)) {
            audioElement.src = fallbackSrc;
        }
    };
    audioElement.src = primarySrc;
}

function padronizarTexto(texto) { return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z0-9]/ig, "").toUpperCase(); }

function processGiftGoal(team, nickname, avatar, isSuper) {
    let defenseActive = (team === 'A') ? defenseTimeB > 0 : defenseTimeA > 0;
    let points = isSuper ? 3 : 1;

    if (defenseActive) {
        if (team === 'A') {
            partialGoalsA += points;
            if (partialGoalsA < 2) { narrate("", true, 'defense_blocked', 'A', true); return; }
            points = Math.floor(partialGoalsA / 2); partialGoalsA = partialGoalsA % 2;
        } else {
            partialGoalsB += points;
            if (partialGoalsB < 2) { narrate("", true, 'defense_blocked', 'B', true); return; }
            points = Math.floor(partialGoalsB / 2); partialGoalsB = partialGoalsB % 2;
        }
    }

    if (!isNarratingGift && points > 0) {
        isNarratingGift = true;
        let teamName = team === 'A' ? gameData.nameA : gameData.nameB;
        let hypePhrase = (points > 1) ? `Atenção! ${nickname} quebrou a defesa e vai mandar chumbo grosso do ${teamName}!` : `Olha o ${nickname} furando o bloqueio! Prepara o grito que lá vem gol do ${teamName}!`;
        narrate(hypePhrase, false, null, null, true);

        setTimeout(() => {
            for (let i = 0; i < points; i++) { setTimeout(() => addGoal(team, nickname, avatar), i * 1000); }
            isNarratingGift = false;
        }, 3500);
    } else {
        for (let i = 0; i < points; i++) { setTimeout(() => addGoal(team, nickname, avatar), i * 1000); }
    }
}

// ==========================================
// 📡 FASE 2: RELÓGIO FISCAL E ANTENA HÍBRIDA
// ==========================================

// 1. Relógio Fiscal (Trava de Plano Gratuito)
setInterval(() => {
    if (window.rdmPerfil === "gratuito" || window.rdmPerfil === "plus premium") {
        let horaAtual = Date.now();
        if (!window.rdmSessaoIniciada) window.rdmSessaoIniciada = horaAtual;
        if ((horaAtual - window.rdmSessaoIniciada) >= ((window.rdmPerfil === "gratuito") ? 7200000 : 151200000)) {
            gameData.isRunning = false; audioAmbienceA.pause(); audioAmbienceB.pause();
            let bs = document.getElementById('rdm-block-screen');
            if (!bs) {
                bs = document.createElement('div'); bs.id = 'rdm-block-screen';
                bs.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.95); z-index:999999; display:flex; flex-direction:column; justify-content:center; align-items:center;';
                bs.innerHTML = `<h1 style='color:#facc15; font-size:40px; text-shadow:0 0 20px #facc15;'>⏱️ TEMPO ESGOTADO!</h1><p style='color:white; font-size:20px;'>A carga de horas do seu plano atual chegou ao fim.</p>`;
                document.body.appendChild(bs); if (wsNuvem) wsNuvem.close(); if (wsTikfinity) wsTikfinity.close();
            }
            return;
        }
    }
}, 1000);

// 🇷🇺 API Russa - Fotos de Perfil
let avatar_cache = {};
async function obterAvatarRusso(nick, urlRecebida) {
    if (avatar_cache[nick] && !avatar_cache[nick].includes("ui-avatars")) return avatar_cache[nick];
    if (urlRecebida && !urlRecebida.includes("ui-avatars")) { avatar_cache[nick] = urlRecebida; return urlRecebida; }
    try {
        let res = await fetch(`https://www.tikwm.com/api/user/info?unique_id=${nick}`);
        let json = await res.json();
        if (json && json.data && json.data.user && json.data.user.avatarLarger) {
            avatar_cache[nick] = json.data.user.avatarLarger; return avatar_cache[nick];
        }
    } catch(e) {}
    let fallback = `https://ui-avatars.com/api/?name=${nick}&background=random`;
    avatar_cache[nick] = fallback; return fallback;
}

// 2. Processador Unificado
async function processarEventoDaAPI(d) {
    if (!gameData.isRunning) return;
    let evento = d.event; let dados = d.data;
    if (!dados) return;

    let nick = (dados.nickname || dados.uniqueId || dados.userId || "").trim();
    if (!nick || nick.toLowerCase() === "none") return;

    let raw_avatar = dados.profilePictureUrl || dados.avatar || dados.profilePicture;
    let avatar_url = await obterAvatarRusso(nick, raw_avatar);

    if (evento === "chat" && allowChatCmds) {
        let txt = padronizarTexto(dados.comment);
        let nameA = padronizarTexto(gameData.nameA);
        let nameB = padronizarTexto(gameData.nameB);

        if (txt.includes(nameA) || txt === "GOLA" || txt === "VARA") userTeams[nick] = 'A';
        else if (txt.includes(nameB) || txt === "GOLB" || txt === "VARB") userTeams[nick] = 'B';

        let userTeam = userTeams[nick];
        if (userTeam) {
            if (txt.includes('GOL')) processGiftGoal(userTeam, nick, avatar_url, false);
            else if (txt.includes('VAR') && !isVarActive) triggerVAR(userTeam);
        }
    }

    if (evento === "gift") {
        let giftName = padronizarTexto(dados.giftName);
        let userTeam = null; let action = null;

        if (giftName === mappedGifts.A.goal) { userTeam = 'A'; action = 'goal'; }
        else if (giftName === mappedGifts.B.goal) { userTeam = 'B'; action = 'goal'; }
        else if (giftName === mappedGifts.A.defesa) { userTeam = 'A'; action = 'defesa'; }
        else if (giftName === mappedGifts.B.defesa) { userTeam = 'B'; action = 'defesa'; }
        else if (giftName === mappedGifts.A.super) { userTeam = 'A'; action = 'super'; }
        else if (giftName === mappedGifts.B.super) { userTeam = 'B'; action = 'super'; }
        else if (giftName === mappedGifts.A.var) { userTeam = 'A'; action = 'var'; }
        else if (giftName === mappedGifts.B.var) { userTeam = 'B'; action = 'var'; }

        if (!userTeam) return;

        if (isVarActive) {
            let pts = 10;
            if (action === 'goal') pts = 10; if (action === 'defesa') pts = 20;
            if (action === 'super') pts = 50; if (action === 'var') pts = 100;
            if (userTeam === 'A') varPointsA += pts; else varPointsB += pts;
            updateVarBar();
        } else {
            if (action === 'goal') { processGiftGoal(userTeam, nick, avatar_url, false); }
            else if (action === 'super') { processGiftGoal(userTeam, nick, avatar_url, true); }
            else if (action === 'defesa') {
                let duration = Math.max(10, Math.floor(gameData.timeLeft * 0.20));
                if (userTeam === 'A') {
                    defenseTimeA = duration;
                    document.getElementById('defense-badge-a').innerText = `🛡️ MURALHA: ${duration}s`;
                    document.getElementById('defense-badge-a').style.display = 'inline-block';
                } else {
                    defenseTimeB = duration;
                    document.getElementById('defense-badge-b').innerText = `🛡️ MURALHA: ${duration}s`;
                    document.getElementById('defense-badge-b').style.display = 'inline-block';
                }
                narrate("", true, 'defense_active', userTeam, true);
            }
            else if (action === 'var' && !isVarActive) { triggerVAR(userTeam); }
        }
    }
}

// 3. A Antena Híbrida Inteligente
let conexaoNuvemEstabelecida = false; let wsNuvem = null; let wsTikfinity = null; let lastTiktokUser = "";

function conectarNuvem() {
    let targetUser = window.rdmUser;
    if (!targetUser) return;
    if (conexaoNuvemEstabelecida && lastTiktokUser === targetUser) return;

    // ⚠️ A CORREÇÃO DE LOOP: Impede que o jogo cancele a conexão enquanto a torre acorda!
    if (wsNuvem && wsNuvem.readyState === WebSocket.CONNECTING) return;

    if (wsNuvem) wsNuvem.close();

    lastTiktokUser = targetUser;
    console.log(`☁️ Tentando Nuvem para: @${targetUser}... (Aguardando resposta)`);

    wsNuvem = new WebSocket("wss://torre-de-controle-rdm.onrender.com:443/");

    wsNuvem.onopen = () => {
        conexaoNuvemEstabelecida = true;
        console.log(`✅ NUVEM CONECTADA! Escutando: @${targetUser}`);

        // 🪄 A LINHA MÁGICA: Avisa a Torre qual Live espelhar agora!
        wsNuvem.send(JSON.stringify({ action: "connect", tiktok_user: targetUser }));

        // ⚠️ A PROVA VISUAL (Usa a barra de narração)
        narrate(`☁️ NUVEM RDM LIGADA! (@${targetUser})`);
        document.querySelector('.narration-bar').style.border = "2px solid #2ecc71";
        setTimeout(() => { document.querySelector('.narration-bar').style.border = "2px solid #34495e"; }, 4000);
    };

    wsNuvem.onmessage = (event) => { try { processarEventoDaAPI(JSON.parse(event.data)); } catch(e) {} };
    wsNuvem.onclose = () => { conexaoNuvemEstabelecida = false; wsNuvem = null; };
}

function verificarEConectar() {
    if (!wsTikfinity || wsTikfinity.readyState === WebSocket.CLOSED) {
        wsTikfinity = new WebSocket("ws://127.0.0.1:21213/");
        wsTikfinity.onopen = () => {
            console.log("✅ TikFinity Local Conectado!");
            if (wsNuvem) { wsNuvem.close(); wsNuvem = null; conexaoNuvemEstabelecida = false; }
        };
        wsTikfinity.onmessage = (event) => { try { processarEventoDaAPI(JSON.parse(event.data)); } catch(e) {} };
        wsTikfinity.onerror = () => { conectarNuvem(); };
        wsTikfinity.onclose = () => { wsTikfinity = null; };
    } else if (wsTikfinity.readyState === WebSocket.OPEN) {
        if (wsNuvem) { wsNuvem.close(); wsNuvem = null; conexaoNuvemEstabelecida = false; }
    }
}
setInterval(verificarEConectar, 2000);

const hostChannel = new BroadcastChannel('game_control');
hostChannel.onmessage = (event) => {
    const data = event.data;

    // ROTA PARA MODO BATALHA
    if (data.command === 'CHANGE_ROUTE') {
        window.location.href = data.route;
        return;
    }
    // RESPONDE AO PAINEL
    if (data.command === 'ASK_MODE') { hostChannel.postMessage({ command: 'REPLY_MODE', mode: 'classic' }); return; }

    if (data.command === 'SAVE_CONFIG') {
        matchMinutes = parseInt(data.minutes) || 5; varMaxTime = parseInt(data.varTime) || 60;
        autoRestartFlag = data.autoRestart; allowChatCmds = data.allowChat; mappedGifts = data.gifts;
    }
    if (data.command === 'SET_VOLUME') { masterCrowdVolume = data.crowd; updateCrowdVolume(); }
    if (data.command === 'ADD_CUSTOM_TEAM') { mapEscudos[data.name] = data.url; }
    if (data.command === 'START_MANUAL') { isTournamentActive = false; stopChampionScreen(); prepareMatch(data.teamA, data.teamB); startGame(); }
    if (data.command === 'GENERATE_TOURNEY') {
        isTournamentActive = true; stopChampionScreen();
        tourneyMode = data.mode; standings = []; tourneyQueue = []; nextRoundTeams = []; eliminatedTeams = []; playedMatches = []; tourneyScorers = {};
        if (tourneyMode.includes('campeonato')) {
            data.teams.forEach(team => standings.push({ team: team, pts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0 }));
            for(let i=0; i<data.teams.length; i++) { for(let j=i+1; j<data.teams.length; j++) { tourneyQueue.push({a: data.teams[i], b: data.teams[j]}); } }
            tourneyQueue.sort(() => 0.5 - Math.random());
        } else if (tourneyMode === 'matamata') {
            let shuffled = data.teams.sort(() => 0.5 - Math.random());
            for(let i=0; i < shuffled.length; i+=2) { if(shuffled[i+1]) tourneyQueue.push({a: shuffled[i], b: shuffled[i+1]}); else nextRoundTeams.push(shuffled[i]); }
        }
        loadNextMatchFromQueue(); document.getElementById('tournament-overlay').style.display = 'flex'; renderTablesAndBrackets(); startGame();
    }
    if (data.command === 'TOGGLE_TABLE') {
        let el = document.getElementById('tournament-overlay'); el.style.display = (el.style.display === 'none' || el.style.display === '') ? 'flex' : 'none'; renderTablesAndBrackets();
    }
};

function loadNextMatchFromQueue() {
    if (tourneyQueue.length === 0) {
        if (tourneyMode === 'matamata' && nextRoundTeams.length > 1) {
            let newQueue = [];
            for(let i=0; i<nextRoundTeams.length; i+=2) {
                if(nextRoundTeams[i+1]) newQueue.push({a: nextRoundTeams[i], b: nextRoundTeams[i+1]});
                else newQueue.push({a: nextRoundTeams[i], b: "BYE"});
            }
            tourneyQueue = newQueue; nextRoundTeams = [];
            renderTablesAndBrackets();
        } else { isTournamentActive = false; return false; }
    }
    let nextMatch = tourneyQueue.shift();
    if (nextMatch.b === "BYE") { nextRoundTeams.push(nextMatch.a); return loadNextMatchFromQueue(); }
    prepareMatch(nextMatch.a, nextMatch.b);
    return true;
}

function prepareMatch(teamA, teamB) {
    gameData.nameA = teamA; gameData.nameB = teamB;
    document.getElementById('nameA').innerText = teamA; document.getElementById('nameB').innerText = teamB;

    let bgEl = document.getElementById('stadium-bg');
    let bgFilename = mapEstadiosImg[teamA];
    if (bgFilename) {
        bgEl.style.backgroundImage = `url('estadios/${bgFilename}')`;
    } else {
        let randomBg = estadiosGenericos[Math.floor(Math.random() * estadiosGenericos.length)];
        bgEl.style.backgroundImage = `url('${randomBg}')`;
    }

    crestA_el.src = getUrlEscudo(teamA); crestB_el.src = getUrlEscudo(teamB);

    setAudioWithFallback(audioAmbienceA, `sounds/${teamA} torcida.mp3`, `sounds/torcida_generica.mp3`);
    setAudioWithFallback(audioAmbienceB, `sounds/${teamB} torcida.mp3`, `sounds/torcida_generica.mp3`);
    let hinoA = document.getElementById('audio-hino-A'); setAudioWithFallback(hinoA, `sounds/${teamA} Hino.mp3`, `sounds/gol_generico.mp3`);
    let hinoB = document.getElementById('audio-hino-B'); setAudioWithFallback(hinoB, `sounds/${teamB} Hino.mp3`, `sounds/gol_generico.mp3`);

    gameData.scoreA = 0; gameData.scoreB = 0; scoreA_el.innerText = 0; scoreB_el.innerText = 0;
    cardsA = 0; cardsB = 0; document.querySelectorAll('.slot').forEach(s => s.classList.remove('card-yellow'));

    defenseTimeA = 0; defenseTimeB = 0; partialGoalsA = 0; partialGoalsB = 0;
    document.getElementById('defense-badge-a').style.display = 'none';
    document.getElementById('defense-badge-b').style.display = 'none';

    userTeams = {}; matchScorers = {};
    hostChannel.postMessage({ command: 'SYNC_TEAMS', teamA: teamA, teamB: teamB });
}

function startGame() {
    if (!audioEnabled) { alert("Libere o áudio clicando na tela do jogo!"); return; }
    document.getElementById('tournament-overlay').style.display = 'none';
    document.getElementById('winner-overlay').style.display = 'none';
    document.getElementById('top-scorer-a').style.display = 'none';
    document.getElementById('top-scorer-b').style.display = 'none';
    stopChampionScreen();

    gameData.isRunning = true; gameData.timeLeft = matchMinutes * 60;

    narrate("", true, 'kickoff', null, true);

    audioAmbienceA.currentTime = 0; audioAmbienceB.currentTime = 0;
    updateCrowdVolume(); audioAmbienceA.play().catch(()=>{}); audioAmbienceB.play().catch(()=>{});
    clearInterval(countdownInterval); countdownInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (isVarActive) return;
    if (gameData.timeLeft <= 0) { clearInterval(countdownInterval); endGame(); return; }
    gameData.timeLeft--;

    if (defenseTimeA > 0) { defenseTimeA--; if (defenseTimeA > 0) document.getElementById('defense-badge-a').innerText = `🛡️ MURALHA: ${defenseTimeA}s`; else document.getElementById('defense-badge-a').style.display = 'none'; }
    if (defenseTimeB > 0) { defenseTimeB--; if (defenseTimeB > 0) document.getElementById('defense-badge-b').innerText = `🛡️ MURALHA: ${defenseTimeB}s`; else document.getElementById('defense-badge-b').style.display = 'none'; }

    let difGols = Math.abs(gameData.scoreA - gameData.scoreB);
    let isFinalMatch = getMatchPhase().includes("FINAL");

    if (gameData.timeLeft <= 60 && gameData.timeLeft % 15 === 0 && gameData.timeLeft > 0) {
        if (difGols === 1 && gameData.scoreA > 0 && gameData.scoreB > 0) { playSpecialAudio(audioVirada); }
        else if (difGols === 2 && isFinalMatch && gameData.scoreA > 0 && gameData.scoreB > 0 && audioAcredito) { playSpecialAudio(audioAcredito); }
    }

    if (gameData.timeLeft % 12 === 0 && gameData.timeLeft > 60 && !isNarratingGift) {
        let teamF = Math.random() > 0.5 ? 'A' : 'B';
        narrate("", true, 'random_action', teamF);
    }

    let m = Math.floor(gameData.timeLeft / 60); let s = gameData.timeLeft % 60;
    timer_el.innerText = `${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
}

function addGoal(team, nickname = null, avatar = null) {
    if (team === 'A') { gameData.scoreA++; scoreA_el.innerText = gameData.scoreA; triggerGoalVisuals(scoreA_el, crestA_el, 'A'); }
    else { gameData.scoreB++; scoreB_el.innerText = gameData.scoreB; triggerGoalVisuals(scoreB_el, crestB_el, 'B'); }
    updateCrowdVolume();
    narrate("", true, 'goal');

    if (nickname) {
        let teamNameReal = team === 'A' ? gameData.nameA : gameData.nameB;
        if (!matchScorers[nickname]) matchScorers[nickname] = { avatar: avatar, goals: 0, team: team, teamName: teamNameReal };
        matchScorers[nickname].goals++;
        if (!tourneyScorers[nickname]) tourneyScorers[nickname] = { avatar: avatar, goals: 0, team: team, teamName: teamNameReal };
        tourneyScorers[nickname].goals++;
        updateMatchTopScorerUI(team);
    }
}

function updateMatchTopScorerUI(team) {
    let bestScorer = null; let maxGoals = 0;
    for (let nick in matchScorers) { if (matchScorers[nick].team === team && matchScorers[nick].goals > maxGoals) { maxGoals = matchScorers[nick].goals; bestScorer = { nickname: nick, ...matchScorers[nick] }; } }
    let badgeId = team === 'A' ? 'top-scorer-a' : 'top-scorer-b'; let badge = document.getElementById(badgeId);
    if (bestScorer && maxGoals > 0) {
        document.getElementById(`ts-avatar-${team.toLowerCase()}`).src = bestScorer.avatar;
        document.getElementById(`ts-name-${team.toLowerCase()}`).innerText = bestScorer.nickname.length > 12 ? bestScorer.nickname.substring(0, 12) + '...' : bestScorer.nickname;
        document.getElementById(`ts-goals-${team.toLowerCase()}`).innerText = bestScorer.goals;
        badge.style.display = 'flex';
    } else { badge.style.display = 'none'; }
}

function endGame() {
    gameData.isRunning = false; clearInterval(countdownInterval);

    let winnerTeam = null; let winnerName = null;
    if (gameData.scoreA > gameData.scoreB) { winnerTeam = 'A'; winnerName = gameData.nameA; }
    else if (gameData.scoreB > gameData.scoreA) { winnerTeam = 'B'; winnerName = gameData.nameB; }
    else {
        if (isTournamentActive && tourneyMode === 'matamata') {
            winnerTeam = Math.random() > 0.5 ? 'A' : 'B';
            winnerName = winnerTeam === 'A' ? gameData.nameA : gameData.nameB;
            let loserName = winnerTeam === 'A' ? gameData.nameB : gameData.nameA;
            narrate(`Fim de jogo empatado! No cara ou coroa do regulamento, o ${winnerName} avança e o ${loserName} está eliminado!`, false, null, null, true);
        } else { narrate("", true, 'end_tie', null, true); }
    }

    processMatchResult(winnerName);

    if (winnerTeam) { narrate("", true, 'end_win', winnerTeam, true); showWinnerCelebration(winnerTeam); }
    else finishEndGame();
}

function showWinnerCelebration(team) {
    let name = team === 'A' ? gameData.nameA : gameData.nameB;
    document.getElementById('winner-crest').src = getUrlEscudo(name);
    document.getElementById('winner-name').innerText = `${name} VENCEU!`;

    let absoluteTopScorer = null; let maxTotal = 0;
    for (let nick in matchScorers) { if (matchScorers[nick].goals > maxTotal) { maxTotal = matchScorers[nick].goals; absoluteTopScorer = { nickname: nick, ...matchScorers[nick] }; } }

    let scorerBox = document.getElementById('winner-scorer-box');
    if (absoluteTopScorer) {
        document.getElementById('ws-avatar').src = absoluteTopScorer.avatar;
        document.getElementById('ws-name').innerText = absoluteTopScorer.nickname;
        document.getElementById('ws-goals').innerText = absoluteTopScorer.goals;
        scorerBox.style.display = 'block';
    } else { scorerBox.style.display = 'none'; }

    document.getElementById('winner-overlay').style.display = 'flex';
    audioAmbienceA.pause(); audioAmbienceB.pause();
    let hino = document.getElementById(`audio-hino-${team}`); let torcida = document.getElementById(`audio-ambience-${team}`);
    hino.currentTime = 0; hino.volume = 1.0; hino.play(); torcida.currentTime = 0; torcida.volume = 0.5; torcida.play();

    setTimeout(() => { hino.pause(); torcida.pause(); document.getElementById('winner-overlay').style.display = 'none'; finishEndGame(); }, 8000);
}

function finishEndGame() {
    if (autoRestartFlag && isTournamentActive) {
        renderTablesAndBrackets(); document.getElementById('tournament-overlay').style.display = 'flex';
        setTimeout(() => {
            let hasNextMatch = loadNextMatchFromQueue();
            if (hasNextMatch) { startGame(); }
            else { document.getElementById('tournament-overlay').style.display = 'none'; showTournamentChampion(); }
        }, 10000);
    }
}

function processMatchResult(winnerName) {
    let loserName = winnerName === gameData.nameA ? gameData.nameB : (winnerName === gameData.nameB ? gameData.nameA : null);
    if (tourneyMode === 'matamata') {
        playedMatches.push({a: gameData.nameA, b: gameData.nameB});
        if (winnerName && loserName) { nextRoundTeams.push(winnerName); eliminatedTeams.push(loserName); }
    }
    if (tourneyMode.includes('campeonato')) {
        let teamA = standings.find(t => t.team === gameData.nameA); let teamB = standings.find(t => t.team === gameData.nameB);
        if (teamA && teamB) {
            teamA.gf += gameData.scoreA; teamA.ga += gameData.scoreB; teamB.gf += gameData.scoreB; teamB.ga += gameData.scoreA;
            teamA.gd = teamA.gf - teamA.ga; teamB.gd = teamB.gf - teamB.ga;
            if (gameData.scoreA > gameData.scoreB) { teamA.pts += 3; teamA.w++; teamB.l++; } else if (gameData.scoreB > gameData.scoreA) { teamB.pts += 3; teamB.w++; teamA.l++; } else { teamA.pts += 1; teamB.pts += 1; teamA.d++; teamB.d++; }
        }
    }
    renderTourneyScorers();
}

function renderTablesAndBrackets() {
    if (tourneyMode.includes('campeonato')) renderTable(); else if (tourneyMode === 'matamata') renderBracket();
    renderTourneyScorers();
    let nmi = document.getElementById('next-match-info');
    if (isTournamentActive && tourneyQueue.length > 0) { document.getElementById('nmi-a').innerText = tourneyQueue[0].a; document.getElementById('nmi-b').innerText = tourneyQueue[0].b; nmi.style.display = 'block'; }
    else { nmi.style.display = 'none'; }
}

function renderTable() {
    document.getElementById('tourney-title').innerText = "Tabela de Classificação";
    document.getElementById('standings-table').style.display = 'table'; document.getElementById('bracket-container').style.display = 'none';
    standings.sort((a, b) => { if (b.pts !== a.pts) return b.pts - a.pts; if (b.w !== a.w) return b.w - a.w; if (b.gd !== a.gd) return b.gd - a.gd; return b.gf - a.gf; });
    let tbody = document.getElementById('standings-body'); tbody.innerHTML = '';
    standings.forEach((t, i) => { tbody.innerHTML += `<tr><td>${i+1}º</td><td class="team-cell"><img src="${getUrlEscudo(t.team)}" class="table-crest"> ${t.team}</td><td style="color:#f1c40f;">${t.pts}</td><td>${t.w}</td><td>${t.d}</td><td>${t.l}</td><td>${t.gf}</td><td>${t.ga}</td><td>${t.gd}</td></tr>`; });
}

function renderBracket() {
    document.getElementById('tourney-title').innerText = "Chaveamento Mata-Mata";
    document.getElementById('standings-table').style.display = 'none';
    let container = document.getElementById('bracket-container'); container.style.display = 'flex'; container.innerHTML = '';
    let allMatches = [...playedMatches]; if (gameData.isRunning) allMatches.push({a: gameData.nameA, b: gameData.nameB}); allMatches = allMatches.concat(tourneyQueue);
    allMatches.forEach(match => {
        let classA = eliminatedTeams.includes(match.a) ? 'team-eliminated' : ''; let classB = eliminatedTeams.includes(match.b) ? 'team-eliminated' : '';
        container.innerHTML += `<div class="bracket-match"><div class="bracket-team ${classA}"><img src="${getUrlEscudo(match.a)}"> <span>${match.a}</span></div><div style="color:#7f8c8d; font-size:1rem;">VS</div><div class="bracket-team ${classB}"><img src="${getUrlEscudo(match.b)}"> <span>${match.b}</span></div></div>`;
    });
}

function renderTourneyScorers() {
    let arr = []; for (let nick in tourneyScorers) { arr.push({ nickname: nick, ...tourneyScorers[nick] }); } arr.sort((a, b) => b.goals - a.goals);
    let list = document.getElementById('tourney-scorers-list'); list.innerHTML = '';
    arr.slice(0, 10).forEach((s, i) => { list.innerHTML += `<div class="scorer-item"><span style="color:#f1c40f; font-weight:bold; width:20px;">${i+1}º</span><img src="${s.avatar}"><div class="scorer-info"><span class="s-name">${s.nickname}</span><span class="s-team">${s.teamName}</span></div><span class="scorer-goals">${s.goals}</span></div>`; });
}

function showTournamentChampion() {
    let championName = "";
    if (tourneyMode.includes('campeonato') && standings.length > 0) championName = standings[0].team;
    else if (tourneyMode === 'matamata' && nextRoundTeams.length > 0) championName = nextRoundTeams[0];
    if (!championName) return;

    document.getElementById('tc-crest').src = getUrlEscudo(championName); document.getElementById('tc-name').innerText = championName;
    let helpers = []; for (let nick in tourneyScorers) { if (tourneyScorers[nick].teamName === championName) helpers.push({ nickname: nick, ...tourneyScorers[nick] }); } helpers.sort((a, b) => b.goals - a.goals);

    let track = document.getElementById('tc-helpers-track'); track.innerHTML = '';
    if (helpers.length === 0) track.innerHTML = `<div class="tc-helper-card">Nenhum artilheiro registrado</div>`;
    else {
        helpers.forEach(h => { track.innerHTML += `<div class="tc-helper-card"><img src="${h.avatar}"> ${h.nickname} (${h.goals} Gols)</div>`; });
        helpers.forEach(h => { track.innerHTML += `<div class="tc-helper-card"><img src="${h.avatar}"> ${h.nickname} (${h.goals} Gols)</div>`; });
    }

    document.getElementById('tournament-champion-overlay').style.display = 'flex';
    narrate(`O grande campeão do torneio é o ${championName}! Parabéns a todos os craques que ajudaram nessa campanha histórica!`, false, null, null, true);

    audioAmbienceA.pause(); audioAmbienceB.pause();
    let hino = document.getElementById('audio-hino-A');
    hino.src = `sounds/${championName} Hino.mp3`; hino.currentTime = 0; hino.volume = 1.0; hino.loop = true; hino.play().catch(()=>{});
    championInterval = setInterval(spawnConfetti, 800);
}

function stopChampionScreen() {
    document.getElementById('tournament-champion-overlay').style.display = 'none'; clearInterval(championInterval);
    let hino = document.getElementById('audio-hino-A'); hino.loop = false; hino.pause();
}

function spawnConfetti() {
    for(let i=0; i<15; i++){ let c = document.createElement('div'); c.className = 'confetti'; c.style.left = Math.random() * 100 + 'vw'; c.style.backgroundColor = `hsl(${Math.random()*360}, 100%, 50%)`; c.style.animationDuration = (Math.random() * 2 + 2) + 's'; document.body.appendChild(c); setTimeout(()=>c.remove(), 4000); }
}

function triggerGoalVisuals(el, cEl, team) {
    audioGoalSound.currentTime=0; audioGoalSound.volume=1.0; audioGoalSound.play();
    audioAmbienceA.volume = 0.1; audioAmbienceB.volume = 0.1;
    let audioHino = document.getElementById(`audio-hino-${team}`); audioHino.currentTime = 0; audioHino.volume = 1.0; audioHino.play();
    cEl.classList.remove('crest-animation'); setTimeout(()=>cEl.classList.add('crest-animation'),10);
    document.getElementById('goal-flash-overlay').classList.add('active'); setTimeout(() => document.getElementById('goal-flash-overlay').classList.remove('active'), 1000);
    setTimeout(() => { let fadeOut = setInterval(() => { if (audioHino.volume > 0.1) audioHino.volume -= 0.1; else { clearInterval(fadeOut); audioHino.pause(); updateCrowdVolume(); } }, 100); }, 5000);
}

function triggerVAR(team) {
    isVarActive = true; varCaller = team; varPointsA = 10; varPointsB = 10;
    varContainer.style.display = 'block'; updateVarBar(); varTimer = varMaxTime;
    narrate("", true, 'var_call', team, true);
    let varInterval = setInterval(() => { varTimer--; timer_el.innerText = `VAR: ${varTimer}s`; if(varTimer <= 0) { clearInterval(varInterval); varContainer.style.display = 'none'; resolveVAR(); } }, 1000);
}

function updateVarBar() { let t = varPointsA + varPointsB; document.getElementById('var-bar-a').style.width = (varPointsA/t*100)+'%'; document.getElementById('var-bar-b').style.width = (varPointsB/t*100)+'%'; }

function resolveVAR() {
    isVarActive = false; let winner = varPointsA >= varPointsB ? 'A' : 'B';
    if (winner === varCaller) {
        if (varCaller === 'A' && gameData.scoreB > 0) { gameData.scoreB--; scoreB_el.innerText = gameData.scoreB; }
        if (varCaller === 'B' && gameData.scoreA > 0) { gameData.scoreA--; scoreA_el.innerText = gameData.scoreA; }
        narrate("", true, 'var_cancel', winner, true); narrativeText_el.innerText = "📺 GOL ANULADO!";
    } else {
        narrate("", true, 'var_yellow', varCaller, true); narrativeText_el.innerText = "📺 CARTÃO AMARELO!";
        if (varCaller === 'A') { cardsA++; applyCard('A', cardsA); } else { cardsB++; applyCard('B', cardsB); }
    }
    updateCrowdVolume();
}

function applyCard(team, count) {
    let slots = document.getElementById(`cards${team}-container`).querySelectorAll('.slot');
    if (slots[count - 1]) slots[count - 1].classList.add('card-yellow');
    if (count >= 3) { narrate("", true, 'red_card', team, true); gameData.timeLeft = 1; }
}

hostChannel.postMessage({ command: 'REPLY_MODE', mode: 'classic' });