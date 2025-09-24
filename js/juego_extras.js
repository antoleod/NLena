// Minimal interactive behaviors for the three new categories
console.log('juego_extras.js loaded');
function createDialog(html) {
  const overlay = document.createElement('div');
  overlay.className = 'dialog-overlay';
  const dialog = document.createElement('div');
  dialog.className = 'dialog';
  dialog.innerHTML = html;
  overlay.appendChild(dialog);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
  return { overlay, dialog };
}

function openSoundsCategory(){
  // simple draggable images -> drop on sound circles
  const sounds = [
    { key:'AN', items:['montagne 🏔','lapin 🐰','pain 🍞','main ✋'] },
    { key:'OU', items:['mouton 🐑','hibou 🦉','roue 🛞','poule 🐔'] },
    { key:'GN', items:['champignon 🍄','peigne 💇','agneau 🐑'] }
  ];
  const itemsHtml = sounds.map(s=>`<div class="sound-column"><h4>${s.key}</h4><div class="sound-drop" data-sound="${s.key}"></div></div>`).join('');
  const draggables = sounds.flatMap(s=>s.items).map((it,i)=>`<div class="sound-tile" draggable="true" data-item="${it}">${it}</div>`).join('');
  const { overlay, dialog } = createDialog(`<h2>Les Sons Rigolos</h2><div style="display:flex;gap:6px;flex-wrap:wrap">${itemsHtml}</div><div style="margin-top:12px">${draggables}</div><div style="margin-top:12px"><button id="close-sounds" class="btn-secondary">Fermer</button></div>`);

  dialog.querySelectorAll('.sound-tile').forEach(tile=>{
    tile.addEventListener('dragstart', (e)=>{ e.dataTransfer.setData('text/plain', tile.dataset.item); });
  });
  dialog.querySelectorAll('.sound-drop').forEach(drop=>{
    drop.addEventListener('dragover', (e)=>e.preventDefault());
    drop.addEventListener('drop', (e)=>{
      e.preventDefault();
      const item = e.dataTransfer.getData('text/plain');
      drop.textContent = item;
      // simple success check: look for substring
      const soundKey = drop.dataset.sound;
      if(item.toUpperCase().includes(soundKey)){
        drop.classList.add('correct');
        setTimeout(()=>{ drop.classList.remove('correct'); }, 800);
      } else {
        drop.classList.add('wrong');
        setTimeout(()=>{ drop.classList.remove('wrong'); }, 800);
      }
    });
  });

  dialog.querySelector('#close-sounds').addEventListener('click', ()=> overlay.remove());
}

function openAmenagements(){
  const html = `
    <h2>Mes Aménagements Raisonnables</h2>
    <p>Place la chaise près du bureau.</p>
    <div style="display:flex;gap:10px;align-items:center;justify-content:center;margin-top:8px">
      <div id="desk" style="width:220px;height:120px;background:#f3f3ff;border-radius:8px;display:flex;align-items:center;justify-content:center">Bureau</div>
      <div id="floor" style="width:120px;height:120px;background:#fff;border-radius:8px;display:flex;align-items:center;justify-content:center">Sol</div>
    </div>
    <div style="margin-top:10px"><div id="chair" draggable="true" style="width:70px;height:70px;border-radius:8px;background:#fff4d6;display:flex;align-items:center;justify-content:center;cursor:grab">🪑</div></div>
    <div style="margin-top:10px"><button id="close-am" class="btn-secondary">Fermer</button></div>
  `;
  const { overlay, dialog } = createDialog(html);
  const chair = dialog.querySelector('#chair');
  const desk = dialog.querySelector('#desk');
  const floor = dialog.querySelector('#floor');

  chair.addEventListener('dragstart',(e)=> e.dataTransfer.setData('text/plain','chair'));
  [desk,floor].forEach(target=>{
    target.addEventListener('dragover', e=>e.preventDefault());
    target.addEventListener('drop', e=>{
      e.preventDefault();
      const data = e.dataTransfer.getData('text/plain');
      if(data==='chair'){
        target.appendChild(chair);
        // success if placed inside desk
        if(target === desk){
          const success = document.createElement('div');
          success.style.marginTop='8px';
          success.textContent = '✨ Bravo Léna !';
          dialog.appendChild(success);
          setTimeout(()=>{ overlay.remove(); }, 1200);
        }
      }
    });
  });

  dialog.querySelector('#close-am').addEventListener('click', ()=> overlay.remove());
}

// Wire buttons created in juego.html
window.addEventListener('DOMContentLoaded', ()=>{
  const bSons = document.getElementById('cat-sons');
  const bAm = document.getElementById('cat-amenagements');
  if(bSons) bSons.addEventListener('click', openSoundsCategory);
  if(bAm) bAm.addEventListener('click', openAmenagements);
});

// UI helpers -------------------------------------------------
function flashPulse(el){
  if(!el) return;
  el.classList.add('pulse');
  setTimeout(()=> el.classList.remove('pulse'), 520);
}

function rainStarsAt(el){
  if(!el) return;
  const n = 12;
  for(let i=0;i<n;i++){
    const s = document.createElement('div');
    s.className='stars-rain';
    s.style.left = (10 + Math.random()*80) + '%';
    s.style.top = '-8px';
    s.style.fontSize = `${10+Math.random()*14}px`;
    s.textContent = '✨';
    el.appendChild(s);
    setTimeout(()=> s.remove(), 1100 + Math.random()*400);
  }
}

function shakeElement(el){ if(!el) return; el.classList.add('shake'); setTimeout(()=> el.classList.remove('shake'), 420); }

function screenZoomIn(el){ if(!el) return; el.classList.add('screen-zoom-in'); setTimeout(()=> el.classList.remove('screen-zoom-in'), 520); }
function screenSlideOut(el){ if(!el) return; el.classList.add('screen-slide-out'); setTimeout(()=> el.classList.remove('screen-slide-out'), 520); }

// expose helpers globally for juego.js use
window.uiHelpers = { flashPulse, rainStarsAt, shakeElement, screenZoomIn, screenSlideOut };

// attach small feedback to topic buttons when they are clicked anywhere
document.addEventListener('click', (e)=>{
  const t = e.target.closest('.topic-btn');
  if(t){
    flashPulse(t);
    // simulate correct/incorrect feedback randomly for demo (replace with real check)
    // remove the demo random behavior in production
    const demoCorrect = Math.random() > 0.25;
    if(demoCorrect){ rainStarsAt(t); } else { shakeElement(t); const hint = document.createElement('div'); hint.className='small-help'; hint.textContent='Essaie encore !'; t.appendChild(hint); setTimeout(()=> hint.remove(),900); }
  }
});