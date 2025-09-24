document.addEventListener('DOMContentLoaded', ()=>{
  const root = document.getElementById('amenagements-root');
  root.innerHTML = '<p>Choisis où t’asseoir en classe :</p>';
  const choices = ['Près du tableau', 'Près de la fenêtre', 'Au fond de la classe'];
  const wrap = document.createElement('div'); wrap.style.display='flex'; wrap.style.gap='0.6rem';
  choices.forEach(c=>{
    const b = document.createElement('button'); b.className='option'; b.textContent=c; b.addEventListener('click', ()=>{
      showPositive('Bravo Léna !');
    }); wrap.appendChild(b);
  });
  root.appendChild(wrap);

  // simple hidden-objects mini game
  const secret = document.createElement('div'); secret.innerHTML='<h3>Trouve 3 objets cachés</h3>';
  const objs = ['✏️','📎','⭐️'];
  const objWrap = document.createElement('div'); objWrap.style.display='flex'; objWrap.style.gap='0.6rem';
  objs.forEach((o,i)=>{ const d=document.createElement('div'); d.className='hidden-obj'; d.textContent=o; d.style.fontSize='2rem'; d.tabIndex=0; d.addEventListener('click', ()=>{ d.style.opacity=0.3; showPositive('Oui !'); }); objWrap.appendChild(d); });
  secret.appendChild(objWrap); root.appendChild(secret);

  function showPositive(msg){ const d=document.createElement('div'); d.className='positive'; d.textContent=msg; document.body.appendChild(d); setTimeout(()=>d.remove(),1000); }
});
