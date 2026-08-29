/**
 * Samuel Cristian — Portfolio
 * main.js
 *
 * Responsável por dois comportamentos de UI:
 *  1. Efeito de "digitação" no terminal do hero
 *  2. Reveal de elementos ao rolar a página (IntersectionObserver)
 *
 * Ambos respeitam prefers-reduced-motion.
 */

const TERMINAL_LINES = [
  { cmd: 'whoami', out: '<b>Samuel Cristian dos Santos</b> — Full Stack Developer' },
  { cmd: 'cat foco.txt', out: 'Software limpo, escalável e aprendizado contínuo.' },
  { cmd: 'ls stack/', out: 'react  next  node  typescript  postgresql  docker' },
  { cmd: 'echo $DIFERENCIAL', out: 'dev + infra de TI + eletrônica aplicada' }
];

const TYPE_SPEED_MS = 32;
const LINE_PAUSE_MS = 260;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Renderiza todas as linhas do terminal de uma vez (sem animação). */
function renderTerminalInstant(container) {
  container.innerHTML = TERMINAL_LINES.map(line =>
    `<div class="ln"><span class="prompt">$</span> ${line.cmd}<span class="out">${line.out}</span></div>`
  ).join('');
}

/** Digita as linhas do terminal uma a uma, com cursor piscando. */
function typeTerminalLines(container) {
  let lineIndex = 0;

  function typeNextLine() {
    if (lineIndex >= TERMINAL_LINES.length) return;

    const { cmd, out } = TERMINAL_LINES[lineIndex];

    const lineEl = document.createElement('div');
    lineEl.className = 'ln';

    const promptEl = document.createElement('span');
    promptEl.className = 'prompt';
    promptEl.textContent = '$ ';
    lineEl.appendChild(promptEl);

    const cmdEl = document.createElement('span');
    lineEl.appendChild(cmdEl);

    const caretEl = document.createElement('span');
    caretEl.className = 'caret';
    lineEl.appendChild(caretEl);

    container.appendChild(lineEl);

    let charIndex = 0;
    const typer = setInterval(() => {
      cmdEl.textContent = cmd.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex >= cmd.length) {
        clearInterval(typer);
        caretEl.remove();

        const outEl = document.createElement('span');
        outEl.className = 'out';
        outEl.innerHTML = out;
        lineEl.appendChild(outEl);

        lineIndex++;
        setTimeout(typeNextLine, LINE_PAUSE_MS);
      }
    }, TYPE_SPEED_MS);
  }

  typeNextLine();
}

function initTerminal() {
  const container = document.getElementById('termBody');
  if (!container) return;

  if (prefersReducedMotion()) {
    renderTerminalInstant(container);
  } else {
    typeTerminalLines(container);
  }
}

/** Adiciona a classe `.in` aos elementos `.reveal` conforme entram na viewport. */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  if (prefersReducedMotion()) {
    revealEls.forEach(el => el.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => observer.observe(el));
}

function init() {
  initTerminal();
  initScrollReveal();
}

document.addEventListener('DOMContentLoaded', init);
