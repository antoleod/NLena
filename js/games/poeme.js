const POEME = {
  titre: "Saison mystère",
  strophes: [
    {
      texte: [
        "Les feuilles craquent sous mes pas,",
        "Elles volent partout, doucement, tout bas."
      ],
      illustration: "🍂",
      couleur: "#fff5e6"
    },
    {
      texte: [
        "Le vent souffle dans mes cheveux,",
        "Le ciel est souvent nuageux."
      ],
      illustration: "☁️",
      couleur: "#e6f3ff"
    },
    {
      texte: [
        "Je mets mon pull, il fait plus frais,",
        "L'arbre retire son manteau épais."
      ],
      illustration: "🧥",
      couleur: "#f5e6ff"
    },
    {
      texte: [
        "D'un coup le ciel peut s'obscurcir,",
        "La pluie vient parfois sans prévenir."
      ],
      illustration: "🌧️",
      couleur: "#e6ffe6"
    },
    {
      texte: [
        "Le soleil brille mais moins longtemps,",
        "Il est déjà loin le printemps."
      ],
      illustration: "☀️",
      couleur: "#fff9e6"
    },
    {
      texte: [
        "Chaque jour diminue la lumière,",
        "Quelle est donc cette saison mystère ?"
      ],
      illustration: "❓",
      couleur: "#ffe6e6"
    }
  ]
};

let modeActuel = 'decouverte';
let stropheActuelle = 0;
let progression = 0;
let etoilesGagnees = 0;
const nombreMaxEtoiles = POEME.strophes.length;

document.addEventListener('DOMContentLoaded', () => {
  const modeButtons = document.querySelectorAll('.mode-btn');
  const contentContainer = document.getElementById('poeme-content');
  const prevStropheBtn = document.getElementById('prev-strophe');
  const nextStropheBtn = document.getElementById('next-strophe');
  const progressBar = document.querySelector('.progression');

  modeButtons.forEach(button => {
    button.addEventListener('click', () => {
      modeActuel = button.dataset.mode;
      stropheActuelle = 0;
      modeButtons.forEach(btn => btn.classList.remove('actif'));
      button.classList.add('actif');
      chargerMode();
    });
  });

  prevStropheBtn.addEventListener('click', () => changerStrophe(-1));
  nextStropheBtn.addEventListener('click', () => changerStrophe(1));

  function chargerMode() {
    contentContainer.innerHTML = '';
    updateProgressBar();
    switch (modeActuel) {
      case 'decouverte':
        chargerDecouverte();
        break;
      case 'cache-cache':
        chargerCacheCache();
        break;
      case 'puzzle':
        chargerPuzzle();
        break;
      case 'recitation':
        chargerRecitation();
        break;
      case 'defi':
        chargerDefi();
        break;
    }
    updateNavButtons();
  }

  function changerStrophe(direction) {
    const nouvelleStrophe = stropheActuelle + direction;
    if (nouvelleStrophe >= 0 && nouvelleStrophe < POEME.strophes.length) {
      stropheActuelle = nouvelleStrophe;
      chargerMode();
    }
  }

  function updateNavButtons() {
    prevStropheBtn.disabled = stropheActuelle === 0;
    nextStropheBtn.disabled = stropheActuelle === POEME.strophes.length - 1;
  }

  function updateProgressBar() {
    const totalEtapes = POEME.strophes.length;
    progression = (stropheActuelle + 1) / totalEtapes * 100;
    progressBar.style.width = `${progression}%`;
  }

  function creerAnimationFeuilles() {
    for (let i = 0; i < 5; i++) {
      const feuille = document.createElement('div');
      feuille.textContent = '🍂';
      feuille.className = 'feuille';
      feuille.style.left = `${Math.random() * 100}vw`;
      feuille.style.animationDuration = `${2 + Math.random() * 3}s`;
      feuille.style.setProperty('--final-x', `${Math.random() * 200 - 100}px`);
      document.body.appendChild(feuille);
      setTimeout(() => feuille.remove(), 5000);
    }
  }

  // --- MODES ---

  function chargerDecouverte() {
    const strophe = POEME.strophes[stropheActuelle];
    const stropheDiv = document.createElement('div');
    stropheDiv.className = `strophe strophe-${stropheActuelle + 1}`;
    stropheDiv.style.backgroundColor = strophe.couleur;

    const texteHtml = strophe.texte.map(vers => 
      `<p>${vers.split(' ').map(mot => `<span class="mot">${mot}</span>`).join(' ')}</p>`
    ).join('');
    stropheDiv.innerHTML = texteHtml;

    const boutonAudio = document.createElement('button');
    boutonAudio.textContent = '🔊';
    boutonAudio.className = 'bouton-audio';
    boutonAudio.onclick = () => lireStrophe(strophe.texte.join(' '), stropheDiv);
    stropheDiv.appendChild(boutonAudio);

    contentContainer.appendChild(stropheDiv);
    creerAnimationFeuilles();
  }

  function lireStrophe(texte, container) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(texte);
      utterance.lang = 'fr-FR';
      const mots = container.querySelectorAll('.mot');
      let motIndex = 0;

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          mots.forEach(m => m.classList.remove('actif'));
          if (motIndex < mots.length) {
            mots[motIndex].classList.add('actif');
            motIndex++;
          }
        }
      };
      utterance.onend = () => {
        mots.forEach(m => m.classList.remove('actif'));
      };
      speechSynthesis.speak(utterance);
    } else {
      alert("La synthèse vocale n'est pas supportée par votre navigateur.");
    }
  }

  function chargerCacheCache() {
    const strophe = POEME.strophes[stropheActuelle];
    // Choose a few words to hide (short words and punctuation excluded)
    const words = strophe.texte.join(' ').split(/\s+/).filter(Boolean);
    const candidates = words.filter(w => w.length > 3).slice(0, Math.max(1, Math.floor(words.length/6)));
    const hidden = new Set();
    while(hidden.size < Math.min(3, candidates.length)){
      const pick = candidates[Math.floor(Math.random()*candidates.length)];
      hidden.add(pick.replace(/[.,!?;'"]+$/,''));
    }

    const bank = [];
    const html = strophe.texte.map(vers => {
      const tokens = vers.split(/(\s+)/).map(tok => {
        const word = tok.replace(/[.,!?;'"]+$/,'');
        if(!tok.trim()) return tok;
        if(hidden.has(word)){
          bank.push(word);
          return `<span class="blank" data-word="${word}">______</span>`;
        }
        return `<span class="mot">${tok}</span>`;
      }).join('');
      return `<p>${tokens}</p>`;
    }).join('');

    const container = document.createElement('div');
    container.className = 'cache-cache-mode';
    container.innerHTML = `
      <div class="strophe-block">${html}</div>
      <div class="bank"><strong>Mots à replacer :</strong><div class="bank-items"></div></div>
      <div style="margin-top:10px"><button class="btn-main" id="check-cache">Vérifier</button></div>
    `;

    contentContainer.appendChild(container);

    // populate bank shuffled
    const bankItems = container.querySelector('.bank-items');
    const shuffled = bank.sort ? bank.sort(() => Math.random()-0.5) : bank;
    shuffled.forEach(w => {
      const d = document.createElement('div'); d.className='draggable-word'; d.draggable = true; d.textContent = w; d.dataset.word = w;
      bankItems.appendChild(d);
    });

    // drag/drop handlers
    container.querySelectorAll('.draggable-word').forEach(dw=>{
      dw.addEventListener('dragstart', e=> e.dataTransfer.setData('text/plain', dw.dataset.word));
    });
    container.querySelectorAll('.blank').forEach(blank=>{
      blank.addEventListener('dragover', e=> e.preventDefault());
      blank.addEventListener('drop', e=>{
        e.preventDefault();
        const w = e.dataTransfer.getData('text/plain');
        blank.textContent = w;
        blank.dataset.filled = w;
      });
    });

    container.querySelector('#check-cache').addEventListener('click', ()=>{
      let allFilled = true; let correct = 0; const blanks = container.querySelectorAll('.blank');
      blanks.forEach(b=>{
        const expect = b.dataset.word;
        const got = (b.dataset.filled || '').replace(/[.,!?;'"]+$/,'');
        if(!got) allFilled = false;
        if(got && got === expect){ b.classList.add('correct'); correct++; } else { b.classList.add('wrong'); }
      });
      if(!allFilled){ const fb = document.getElementById('poeme-feedback'); fb.textContent = 'Place tous les mots, puis vérifie.'; return; }
      if(correct === blanks.length){ winOneStar('cache-cache'); } else { const fb = document.getElementById('poeme-feedback'); fb.textContent = `Presque ! ${correct}/${blanks.length} corrects.`; }
    });
  }

  function chargerPuzzle() {
    const strophe = POEME.strophes[stropheActuelle];
    const lines = strophe.texte.slice();
    const shuffled = lines.map((l,i)=> ({l,i})).sort(()=>Math.random()-0.5);

    const container = document.createElement('div');
    container.className = 'puzzle-mode';
    container.innerHTML = `
      <p>Remets les vers dans le bon ordre :</p>
      <div class="puzzle-bank"></div>
      <div style="margin-top:10px"><button class="btn-main" id="check-puzzle">Vérifier</button></div>
    `;
    contentContainer.appendChild(container);

    const bank = container.querySelector('.puzzle-bank');
    shuffled.forEach(item=>{
      const tile = document.createElement('div'); tile.className='puzzle-tile'; tile.draggable = true; tile.dataset.index = item.i; tile.textContent = item.l;
      bank.appendChild(tile);
    });

    let dragSrc = null;
    bank.addEventListener('dragstart', e=>{ const t = e.target.closest('.puzzle-tile'); if(t) { dragSrc = t; e.dataTransfer.effectAllowed='move'; } });
    bank.addEventListener('dragover', e=>{ e.preventDefault(); const t = e.target.closest('.puzzle-tile'); if(t && t !== dragSrc) t.classList.add('over'); });
    bank.addEventListener('dragleave', e=>{ const t = e.target.closest('.puzzle-tile'); if(t) t.classList.remove('over'); });
    bank.addEventListener('drop', e=>{
      e.preventDefault(); const t = e.target.closest('.puzzle-tile'); if(!t || !dragSrc || t === dragSrc) return; t.classList.remove('over');
      // swap nodes
      const a = dragSrc, b = t;
      const as = a.cloneNode(true), bs = b.cloneNode(true);
      a.parentNode.replaceChild(bs, a);
      b.parentNode.replaceChild(as, b);
    });

    container.querySelector('#check-puzzle').addEventListener('click', ()=>{
      const tiles = Array.from(container.querySelectorAll('.puzzle-tile'));
      const correct = tiles.every((tile, idx) => Number(tile.dataset.index) === idx);
      if(correct) winOneStar('puzzle'); else { const fb = document.getElementById('poeme-feedback'); fb.textContent = 'Pas encore — essaie encore !'; }
    });
  }

  function chargerRecitation() {
    const strophe = POEME.strophes[stropheActuelle];
    const masked = strophe.texte.map(vers => vers.split(' ').map(w => {
      const core = w.replace(/[.,!?;'"]+$/,'');
      if(core.length <= 2) return w;
      return core[0] + ' ' + '_'.repeat(Math.min(3, core.length-1)) + (w.endsWith('.')?'.':'');
    }).join(' ')).join('<br>');

    const container = document.createElement('div'); container.className='recitation-mode';
    container.innerHTML = `
      <div class="strophe-card">${masked}</div>
      <div style="margin-top:8px"><button class="btn-main" id="start-rec">🔴 Enregistrer</button>
      <button class="btn-secondary" id="play-rec" disabled>▶️ Écouter</button>
      <button class="btn-main" id="validate-rec">Valider ma récitation</button></div>
      <audio id="rec-audio" controls style="display:block;margin-top:8px"></audio>
    `;
    contentContainer.appendChild(container);

    const startBtn = container.querySelector('#start-rec');
    const playBtn = container.querySelector('#play-rec');
    const validateBtn = container.querySelector('#validate-rec');
    const audioEl = container.querySelector('#rec-audio');

    let mediaRecorder, chunks = [];
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
      startBtn.addEventListener('click', async ()=>{
        if(startBtn.dataset.recording === '1'){
          // stop
          mediaRecorder.stop();
          startBtn.textContent = '🔴 Enregistrer'; startBtn.dataset.recording = '0';
          return;
        }
        try{
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorder = new MediaRecorder(stream);
          chunks = [];
          mediaRecorder.ondataavailable = e=> chunks.push(e.data);
          mediaRecorder.onstop = ()=>{
            const blob = new Blob(chunks, { type: 'audio/webm' });
            audioEl.src = URL.createObjectURL(blob);
            audioEl.style.display = 'block';
            playBtn.disabled = false;
            // stop all tracks
            stream.getTracks().forEach(t=>t.stop());
          };
          mediaRecorder.start();
          startBtn.textContent = '◼️ Stop'; startBtn.dataset.recording = '1';
        } catch(err){ alert('Impossible d\'accéder au micro : ' + err.message); }
      });
    } else {
      startBtn.disabled = true; startBtn.title = 'Enregistrement non supporté';
    }

    playBtn.addEventListener('click', ()=> { if(audioEl.src) audioEl.play(); });

    validateBtn.addEventListener('click', ()=>{
      // simple validation: require that user recorded something
      if(!audioEl.src){ const fb = document.getElementById('poeme-feedback'); fb.textContent = 'Enregistre ta récitation avant de valider.'; return; }
      winOneStar('recitation');
    });
  }

  function chargerDefi() {
    const container = document.createElement('div'); container.className='defi-mode';
    container.innerHTML = `
      <h3>Défi final</h3>
      <p>Récite le poème entier. Quand tu es prête, enregistre puis demande ton diplôme.</p>
      <div style="margin-top:8px"><button class="btn-main" id="start-defi">🔴 Enregistrer le défi</button>
      <button class="btn-main" id="diploma" style="margin-left:8px">Générer le diplôme</button></div>
      <audio id="defi-audio" controls style="display:block;margin-top:8px"></audio>
    `;
    contentContainer.appendChild(container);

    const startBtn = container.querySelector('#start-defi');
    const diplomaBtn = container.querySelector('#diploma');
    const audioEl = container.querySelector('#defi-audio');
    let mediaRecorder, chunks = [];

    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
      startBtn.addEventListener('click', async ()=>{
        if(startBtn.dataset.recording === '1'){ mediaRecorder.stop(); startBtn.textContent='🔴 Enregistrer le défi'; startBtn.dataset.recording='0'; return; }
        try{
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorder = new MediaRecorder(stream); chunks = [];
          mediaRecorder.ondataavailable = e=> chunks.push(e.data);
          mediaRecorder.onstop = ()=>{
            const blob = new Blob(chunks, { type: 'audio/webm' }); audioEl.src = URL.createObjectURL(blob); audioEl.style.display='block';
            stream.getTracks().forEach(t=>t.stop());
            // award a star for attempting full poem
            winOneStar('defi');
          };
          mediaRecorder.start(); startBtn.textContent='◼️ Stop'; startBtn.dataset.recording='1';
        } catch(err){ alert('Impossible d\'accéder au micro : ' + err.message); }
      });
    } else { startBtn.disabled = true; startBtn.title='Micro non supporté'; }

    diplomaBtn.addEventListener('click', ()=>{
      const name = prompt('Prénom pour le diplôme :', 'Léna') || 'Léna';
      const stars = localStorage.getItem('poeme_etoiles') || etoilesGagnees || 0;
      const html = `
        <html><head><title>Diplôme</title><style>body{font-family:Arial,Helvetica,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh} .diploma{border:6px solid #f0c; padding:30px; text-align:center; background:linear-gradient(135deg,#fff,#ffe);}</style></head>
        <body><div class="diploma"><h1>Bravo ${name} !</h1><p>Tu as gagné ${stars} étoile(s) ⭐</p><p>Poème : ${POEME.titre}</p><p>Continue comme ça !</p></div></body></html>`;
      const w = window.open('about:blank','_blank'); w.document.write(html); w.document.close();
    });
  }

  // helper to award a star and persist
  function winOneStar(mode){
    etoilesGagnees = Number(localStorage.getItem('poeme_etoiles')||0) + 1;
    localStorage.setItem('poeme_etoiles', etoilesGagnees);
    const fb = document.getElementById('poeme-feedback'); fb.textContent = `Bravo ! Tu as gagné une étoile ⭐. Total : ${etoilesGagnees}`;
    creerAnimationFeuilles();
  }

  // Init
  chargerMode();
});
