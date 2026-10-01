'use strict';
(() => {
  const pages = [
    { file:'capa', title:'A capa', alt:'Capa da edição premium do ebook Mente Canina' },
    { file:'indice', title:'O percurso', alt:'Índice do ebook, com cinco capítulos e páginas de apoio' },
    { file:'exercicio', title:'Um exercício completo', alt:'Exercício Qual das mãos?, com quatro passos, materiais, adaptações e orientações de segurança' },
    { file:'desafio', title:'O desafio de 30 dias', alt:'Primeira página do plano de 30 dias com os exercícios dos dias 1 a 15' }
  ];
  const dialog = document.getElementById('sample-dialog');
  const image = document.getElementById('large-page');
  const label = document.getElementById('large-page-label');
  const previous = document.getElementById('large-previous');
  const next = document.getElementById('large-next');
  const radios = Array.from(document.querySelectorAll('input[name="sample-page"]'));
  let index = 0;
  function selectPage(value) {
    index = Math.max(0, Math.min(pages.length - 1, Number(value) || 0));
    const page = pages[index];
    radios[index].checked = true;
    image.src = `assets/${page.file}.webp`;
    image.alt = page.alt;
    label.textContent = `${page.title} · ${index + 1} de ${pages.length}`;
    previous.disabled = index === 0;
    next.disabled = index === pages.length - 1;
    dialog.querySelector('.sample-dialog-body').scrollTop = 0;
  }
  function open(value = index) {
    selectPage(value);
    if(typeof dialog.showModal !== 'function') {
      window.open(image.src, '_blank', 'noopener');
      return;
    }
    if(!dialog.open) dialog.showModal();
    document.body.classList.add('dialog-open');
  }
  radios.forEach(radio => radio.addEventListener('change', () => { if(radio.checked) selectPage(radio.value); }));
  document.querySelectorAll('[data-sample-open]').forEach(button => button.addEventListener('click', () => open(button.getAttribute('data-sample-open'))));
  document.getElementById('open-sample').addEventListener('click', () => open(radios.findIndex(radio => radio.checked)));
  previous.addEventListener('click', () => selectPage(index - 1));
  next.addEventListener('click', () => selectPage(index + 1));
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { if(!document.querySelector('dialog[open]')) document.body.classList.remove('dialog-open'); });
  dialog.addEventListener('keydown', event => {
    if(event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); selectPage(index + (event.key === 'ArrowRight' ? 1 : -1)); }
  });
  dialog.addEventListener('click', event => {
    if(event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  selectPage(0);
  window.MENTE_CANINA_SAMPLE = Object.freeze({ open });
})();
