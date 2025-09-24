document.addEventListener('DOMContentLoaded', ()=>{
  const topics = [
    { id:'an_in', label:'AN / IN', emoji:'🏔️', words:['montagne','lapin','pain','main'] },
    { id:'ou', label:'OU', emoji:'🐑', words:['mouton','hibou','roue','poule'] },
    { id:'gn', label:'GN', emoji:'🍄', words:['champignon','peigne','agneau'] },
    { id:'in', label:'IN', emoji:'🌲', words:['sapin','moulin','main'] },
    { id:'eu', label:'EU', emoji:'🌸', words:['fleur','coeur','feu','cheveux'] },
    { id:'on', label:'ON', emoji:'🐷', words:['cochon','bonbon','ballon'] }
  ];
  const container = document.getElementById('sounds-topics');
  topics.forEach(t=>{
    const b = document.createElement('button');
    b.className='option';
    b.innerHTML = `<div class="option-icon">${t.emoji}</div><div class="option-text">${t.label}</div>`;
    b.addEventListener('click', ()=>openTopic(t));
    container.appendChild(b);
  });

  function openTopic(t){
    // small game: show 3 words and drag to correct circle
    const overlay = document.createElement('div'); overlay.className='dialog-overlay';
    const dialog = document.createElement('div'); dialog.className='dialog';
    const title = document.createElement('h2'); title.textContent = t.label; dialog.appendChild(title);
    const area = document.createElement('div'); area.style.display='flex'; area.style.gap='1rem'; area.style.flexWrap='wrap';
    // circles where to drop
    const circle = document.createElement('div'); circle.style.width='220px'; circle.style.height='220px'; circle.style.borderRadius='50%'; circle.style.background='#fff'; circle.style.display='flex'; circle.style.alignItems='center'; circle.style.justifyContent='center'; circle.style.boxShadow='0 8px 22px rgba(0,0,0,0.08)'; circle.textContent = t.emoji;
    area.appendChild(circle);
    // draggable words
    const words = t.words.slice(0,3);
    const list = document.createElement('div'); list.style.display='flex'; list.style.flexDirection='column'; list.style.gap='0.6rem';
    words.forEach(w=>{
      const wbtn = document.createElement('button'); wbtn.className='btn'; wbtn.textContent = w; wbtn.draggable = true;
      wbtn.addEventListener('dragstart', (e)=>{ e.dataTransfer.setData('text/plain', w); });
      list.appendChild(wbtn);
    });
    circle.addEventListener('dragover', (e)=>e.preventDefault());
    circle.addEventListener('drop', (e)=>{
      e.preventDefault(); const word = e.dataTransfer.getData('text/plain');
      if (words.includes(word)) { dialog.remove(); document.body.removeChild(overlay); showPositive('Bravo !'); }
      else showTryAgain();
    });
    dialog.appendChild(area); dialog.appendChild(list);
    overlay.appendChild(dialog); document.body.appendChild(overlay);
    overlay.addEventListener('click', (e)=>{ if (e.target===overlay){ overlay.remove(); } });
  }

  function showPositive(msg){
    const d = document.createElement('div'); d.textContent=msg+' ✨'; d.className='positive'; document.body.appendChild(d); setTimeout(()=>d.remove(),1400);
  }
  function showTryAgain(){
    const d = document.createElement('div'); d.textContent='Oups ! Essaie encore 🤖'; d.className='negative'; document.body.appendChild(d); setTimeout(()=>d.remove(),1400);
  }
});
