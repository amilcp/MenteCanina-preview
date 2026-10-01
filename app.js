'use strict';
(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const config = window.MENTE_CANINA_CONFIG || { checkoutUrl: '' };
  $('#year').textContent = String(new Date().getFullYear());

  const menu = $('.menu-toggle'), mobileNav = $('#mobile-nav');
  function closeMenu() { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menu'); mobileNav.hidden = true; }
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); mobileNav.hidden = !open; });
  mobileNav.addEventListener('click', e => { if(e.target.closest('a')) closeMenu(); });
  document.addEventListener('click', e => { if(!e.target.closest('.site-header')) closeMenu(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menu.focus(); } });
  const menuMedia = window.matchMedia('(min-width: 721px)');
  const onMenuMediaChange = event => { if(event.matches) closeMenu(); };
  if(menuMedia.addEventListener) menuMedia.addEventListener('change', onMenuMediaChange);
  else if(menuMedia.addListener) menuMedia.addListener(onMenuMediaChange);

  const chapters = [
    { category:'Olfato e exploração', title:'Deixe o nariz guiar.', description:'Transforme recompensas, brinquedos e pessoas familiares em pistas para procurar. Um ponto de partida simples para despertar a curiosidade.', image:'olfato', alt:'Um cão a procurar pequenas recompensas pela casa', range:'01—10', examples:['Caça aos biscoitos','A toalha surpresa','Qual das mãos?'] },
    { category:'Raciocínio e resolução', title:'Pequenos problemas. Novas soluções.', description:'Caixas, copos e objetos do dia a dia tornam-se desafios acessíveis. Dê-lhe tempo para experimentar e descobrir como chegar ao objetivo.', image:'raciocinio', alt:'Um cão a explorar uma caixa num exercício de resolução de problemas', range:'11—20', examples:['Caixa dentro da caixa','Tabuleiro de formas','Tampa deslizante'] },
    { category:'Atenção e cooperação', title:'Aprender a escutar-se.', description:'Crie sinais claros, pausas breves e trocas justas. Propostas para praticar a atenção e a comunicação, sempre através de uma experiência positiva.', image:'atencao', alt:'Um cão atento à sua tutora durante um exercício de cooperação', range:'21—30', examples:['Olha para mim','Toca na mão','Vai para o tapete'] },
    { category:'Coordenação e confiança', title:'Descobrir o próprio corpo.', description:'Movimentos lentos, superfícies estáveis e percursos simples. Explore a coordenação e adapte cada atividade ao conforto e à mobilidade do seu cão.', image:'coordenacao', alt:'Um cão a colocar as patas da frente numa plataforma baixa com a tutora', range:'31—40', examples:['Contorna o cone','Caminho de texturas','Mini circuito corporal'] },
    { category:'Memória e aprendizagem', title:'Uma descoberta leva a outra.', description:'Associe nomes a brinquedos e combine ações já conhecidas. Aprenda uma etapa de cada vez antes de avançar para pequenas sequências.', image:'memoria', alt:'Um cão a aprender com a sua tutora usando um brinquedo', range:'41—50', examples:['Distingue dois brinquedos','Guarda os brinquedos','O grande circuito mental'] }
  ];
  const tabs = $$('.chapter-tab');
  function showChapter(index, focus = false) {
    const c = chapters[index];
    tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    $('#chapter-panel').setAttribute('aria-labelledby', `tab-${index}`);
    $('#chapter-image').src = `assets/${c.image}.webp`; $('#chapter-image').alt = c.alt;
    $('#chapter-category').textContent = c.category.toLocaleUpperCase('pt-PT');
    $('#chapter-title').textContent = c.title; $('#chapter-description').textContent = c.description;
    $('#chapter-range').textContent = `EXERCÍCIOS ${c.range}`;
    $('#chapter-examples').replaceChildren(...c.examples.map(example => { const li = document.createElement('li'); li.textContent = example; return li; }));
    if(focus) tabs[index].focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => showChapter(index));
    tab.addEventListener('keydown', e => {
      let next;
      if(['ArrowDown', 'ArrowRight'].includes(e.key)) next = (index + 1) % tabs.length;
      if(['ArrowUp', 'ArrowLeft'].includes(e.key)) next = (index + tabs.length - 1) % tabs.length;
      if(e.key === 'Home') next = 0;
      if(e.key === 'End') next = tabs.length - 1;
      if(next !== undefined) { e.preventDefault(); showChapter(next, true); }
    });
  });
  function updateTabOrientation() { $('.chapter-tabs').setAttribute('aria-orientation', window.innerWidth <= 720 ? 'horizontal' : 'vertical'); }
  updateTabOrientation(); window.addEventListener('resize', updateTabOrientation, { passive:true });

  function openDialog(dialog) { closeMenu(); dialog.showModal(); document.body.classList.add('dialog-open'); }
  function closeDialog(dialog) { dialog.close(); }
  $$('dialog:not(#sample-dialog)').forEach(dialog => {
    dialog.addEventListener('close', () => { if(!document.querySelector('dialog[open]')) document.body.classList.remove('dialog-open'); });
    dialog.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => closeDialog(dialog)));
    dialog.addEventListener('click', event => { if(event.target === dialog) { const rect = dialog.getBoundingClientRect(); if(event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog(dialog); } });
  });
  $$('[data-checkout]').forEach(button => button.addEventListener('click', () => {
    let checkout = null;
    try { const candidate = new URL(config.checkoutUrl); if(candidate.protocol === 'https:' && !candidate.username && !candidate.password) checkout = candidate.href; } catch { /* A missing checkout opens the truthful availability state. */ }
    if(checkout) window.location.assign(checkout); else openDialog($('#checkout-dialog'));
  }));
  $('#checkout-to-sample').addEventListener('click', () => { closeDialog($('#checkout-dialog')); window.MENTE_CANINA_SAMPLE.open(2); });
  $('#privacy-button').addEventListener('click', () => openDialog($('#privacy-dialog')));
  if('IntersectionObserver' in window) {
    let heroVisible = true, purchaseVisible = false, footerVisible = false;
    const update = () => $('#mobile-purchase').classList.toggle('visible', !heroVisible && !purchaseVisible && !footerVisible);
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if(entry.target.id === 'inicio') heroVisible = entry.isIntersecting; if(entry.target.id === 'comprar') purchaseVisible = entry.isIntersecting; if(entry.target.classList.contains('site-footer')) footerVisible = entry.isIntersecting; }); update(); }, { threshold:0 });
    observer.observe($('#inicio')); observer.observe($('#comprar')); observer.observe($('.site-footer'));
  }
})();
