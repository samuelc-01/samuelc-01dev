/**
 * Samuel Cristian — Portfolio
 * main.js
 *
 * Responsável por:
 *  1. Efeito de "digitação" no terminal do hero
 *  2. Reveal de elementos ao rolar a página (IntersectionObserver)
 *  3. Navegação lateral (section-dock) com destaque da seção ativa
 *  4. Barra de progresso de rolagem
 *  5. Tradução PT/EN (i18n)
 *
 * Todos os comportamentos respeitam prefers-reduced-motion.
 */

const TERMINAL_LINES = {
  pt: [
    { cmd: 'whoami', out: '<b>Samuel Cristian dos Santos</b> — Full Stack Developer' },
    { cmd: 'cat foco.txt', out: 'Software limpo, escalável e aprendizado contínuo.' },
    { cmd: 'ls stack/', out: 'react  next  node  typescript  postgresql  docker' },
    { cmd: 'echo $DIFERENCIAL', out: 'dev + infra de TI + eletrônica aplicada' }
  ],
  en: [
    { cmd: 'whoami', out: '<b>Samuel Cristian dos Santos</b> — Full Stack Developer' },
    { cmd: 'cat focus.txt', out: 'Clean, scalable software and continuous learning.' },
    { cmd: 'ls stack/', out: 'react  next  node  typescript  postgresql  docker' },
    { cmd: 'echo $DIFFERENTIAL', out: 'dev + IT infra + applied electronics' }
  ]
};

const TYPE_SPEED_MS = 32;
const LINE_PAUSE_MS = 260;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Renderiza todas as linhas do terminal de uma vez (sem animação). */
function renderTerminalInstant(container, lines) {
  container.innerHTML = lines.map(line =>
    `<div class="ln"><span class="prompt">$</span> ${line.cmd}<span class="out">${line.out}</span></div>`
  ).join('');
}

/** Digita as linhas do terminal uma a uma, com cursor piscando. */
function typeTerminalLines(container, lines) {
  let lineIndex = 0;

  function typeNextLine() {
    if (lineIndex >= lines.length) return;

    const { cmd, out } = lines[lineIndex];

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
    renderTerminalInstant(container, TERMINAL_LINES[currentLang]);
  } else {
    typeTerminalLines(container, TERMINAL_LINES[currentLang]);
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

/** Destaca o link do dock correspondente à seção visível na tela. */
function initSectionNavigation() {
  const sections = [...document.querySelectorAll('main section[id]')];
  const dockLinks = [...document.querySelectorAll('.dock-link[data-section]')];
  if (!sections.length || !dockLinks.length) return;

  const setActiveSection = (sectionId) => {
    dockLinks.forEach(link => {
      const isActive = link.dataset.section === sectionId;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver((entries) => {
    const visibleEntry = entries
      .filter(entry => entry.isIntersecting)
      .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

    if (visibleEntry) setActiveSection(visibleEntry.target.id);
  }, { rootMargin: '-30% 0px -55%', threshold: [0.05, 0.25, 0.5] });

  sections.forEach(section => observer.observe(section));
}

/** Atualiza a barra de progresso de rolagem do topo. */
function initScrollProgress() {
  const updateProgress = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    document.documentElement.style.setProperty('--scroll-progress', `${Math.min(progress, 100)}%`);
  };

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
}

/* ===================== i18n — PT / EN ===================== */

const I18N = {
  pt: {
    langCode: 'pt-BR',
    next: 'en',
    flag: '🇬🇧',
    aria: 'Switch to English',
    metaTitle: 'Samuel Cristian — Full Stack Developer & IoT',
    metaDescription: 'Samuel Cristian dos Santos — Desenvolvedor Full Stack (Node.js, React, TypeScript) com formação em eletrônica e automação. Divinópolis, MG.',
    dockAbout: 'sobre',
    dockStack: 'stack',
    dockExperience: 'experiência',
    dockProjects: 'projetos',
    dockContact: 'contato',
    navAbout: '~/sobre',
    navStack: '~/stack',
    navProjects: '~/projetos',
    navExperience: '~/experiência',
    navCta: 'Vamos conversar',
    heroBadge: 'Divinópolis, BR · Disponível para novos projetos',
    heroIntro: 'Olá, eu sou <strong>Samuel Cristian dos Santos</strong>.',
    heroTitle: 'Construindo entre <span>software</span> e mundo físico.',
    heroRole: 'Full Stack Developer — <b>Node.js · React · TypeScript</b> — com formação técnica em eletrônica',
    heroText: 'Desenvolvo aplicações web de ponta a ponta e automatizo processos corporativos, unindo experiência de infraestrutura de TI com uma formação técnica em eletrônica. Gosto de projetos onde software encontra hardware.',
    heroViewProjects: 'Ver projetos',
    heroContact: 'Entrar em contato',
    statYearsLabel: 'anos criando soluções',
    statAreasLabel: 'áreas conectadas',
    statCuriosityLabel: 'curiosidade técnica',
    aboutEyebrow: 'about.md',
    aboutTitle: 'Software limpo, escalável e aprendizado contínuo',
    aboutP1: 'Sou desenvolvedor full stack com experiência prática em Node.js, React e TypeScript, atuando também com infraestrutura de TI — Active Directory, Windows Server — e automação de processos com VBA.',
    aboutP2: 'Minha formação técnica em eletrônica trouxe uma base sólida em microcontroladores, PLC e automação, que hoje aplico em projetos que conectam sensores, dados e interfaces web — como um sistema de monitoramento de vazamentos de água construído do zero.',
    factLocation: 'Localização',
    factLocationV: 'Divinópolis, MG — Brasil',
    factRole: 'Atuação',
    factRoleV: 'Freelance Full Stack Developer',
    factDifferential: 'Diferencial',
    factDifferentialV: 'Desenvolvimento + infraestrutura + eletrônica',
    factLanguages: 'Idiomas',
    factLanguagesV: 'Inglês profissional · Espanhol básico',
    factEducation: 'Formação',
    factEducationV: 'Rocketseat Ignite · Técnico em Eletrônica (Senai)',
    stackEyebrow: 'skills.json',
    stackTitle: 'Ferramentas do dia a dia',
    stackFrontend: 'Frontend',
    stackBackend: 'Backend',
    stackData: 'Dados',
    stackDevOps: 'DevOps',
    stackInfra: 'Infra & Automação',
    stackElectronics: 'Eletrônica',
    expEyebrow: 'git log --career',
    expTitle: 'Trajetória profissional',
    expRole1: 'Full Stack Developer',
    expPlace1a: 'Freelance',
    expRemote: 'Remoto',
    expDesc1: 'Interfaces com React.js/Next.js e APIs com Node.js, gerenciando dados em SQL, além de automação de relatórios corporativos com VBA.',
    expRole2: 'Analista de TI',
    expDesc2: 'Suporte a usuários e gerenciamento de servidores e Active Directory, além de responsável pelos marketplaces da empresa e por novas soluções tecnológicas.',
    expRole3: 'Full Stack Developer',
    expDesc3: 'Aplicações web com React.js, Next.js e Node.js; APIs REST/GraphQL com autenticação JWT e foco em escalabilidade e boas práticas (SOLID).',
    expRole4: 'Estágio em Desenvolvimento',
    expDesc4: 'Apoio ao desenvolvedor sênior em Flutter, evoluindo de tarefas simples a implementações mais complexas.',
    projEyebrow: 'ls -la ~/projects',
    projTitle: 'Trabalhos recentes',
    repoFeatured: 'PUBLIC · FEATURED',
    repoFirmware: 'PUBLIC · FIRMWARE',
    repoWebApp: 'PUBLIC · WEB APP',
    repoApi: 'PUBLIC · API',
    projDesc1: 'API em Node.js que processa dados de sensores de vazão de água e os exibe em dashboards configuráveis — projeto que une eletrônica e desenvolvimento web.',
    projDesc2: 'Firmware em C++ para leitura de sensores de vazão em microcontrolador, responsável por capturar e enviar os dados usados no dashboard.',
    projDesc3: 'Aplicação para acompanhar assinaturas e gastos recorrentes, com foco em uma interface simples e objetiva.',
    projDesc4: 'API construída em TypeScript com foco em boas práticas de autenticação e segurança de dados.',
    projTagDashboard: 'Dashboard',
    projTagSensors: 'Sensores',
    projTagWebApp: 'Web App',
    projTagAuth: 'Auth',
    contactCommand: './contact.exe <span>--channel=direct</span>',
    contactTitle: 'Vamos construir algo juntos?',
    contactText: 'Estou disponível para novos projetos freelance e oportunidades full stack. Envie uma mensagem ou me chame nas redes.',
    formName: 'Nome',
    formNamePh: 'Seu nome',
    formEmail: 'Email',
    formEmailPh: 'voce@email.com',
    formEmailTitle: 'Digite um email válido (ex.: nome@dominio.com)',
    formInvalidEmail: 'Por favor, insira um email válido.',
    formSubject: 'Assunto',
    formSubjectPlaceholder: 'Escolha um assunto...',
    optLearning: 'Aprendizado',
    optCareer: 'Carreira',
    optService: 'Serviço / Projeto',
    optContact: 'Contato',
    optOther: 'Outro',
    formMsg: 'Mensagem',
    formMsgPh: 'Escreva sua mensagem...',
    formSend: 'Enviar mensagem',
    formStatusError: 'Não foi possível enviar. Verifique os campos e tente novamente.',
    formStatusSuccess: 'Mensagem enviada! Obrigado pelo contato, retorno em breve.',
    footerLine: '© 2026 Samuel Cristian',
    mobileDockAbout: 'sobre',
    mobileDockStack: 'stack',
    mobileDockProjects: 'projetos',
    mobileDockContact: 'contato'
  },
  en: {
    langCode: 'en',
    next: 'pt',
    flag: '🇧🇷',
    aria: 'Mudar para português',
    metaTitle: 'Samuel Cristian — Full Stack Developer & IoT',
    metaDescription: 'Samuel Cristian dos Santos — Full Stack Developer (Node.js, React, TypeScript) with a background in electronics and automation. Divinópolis, MG.',
    dockAbout: 'about',
    dockStack: 'stack',
    dockExperience: 'experience',
    dockProjects: 'projects',
    dockContact: 'contact',
    navAbout: '~/about',
    navStack: '~/stack',
    navProjects: '~/projects',
    navExperience: '~/experience',
    navCta: 'Let\'s talk',
    heroBadge: 'Divinópolis, BR · Available for new projects',
    heroIntro: 'Hello, I\'m <strong>Samuel Cristian dos Santos</strong>.',
    heroTitle: 'Building between <span>software</span> and the physical world.',
    heroRole: 'Full Stack Developer — <b>Node.js · React · TypeScript</b> — with technical training in electronics',
    heroText: 'I build end-to-end web applications and automate business processes, combining IT infrastructure experience with a technical background in electronics. I love projects where software meets hardware.',
    heroViewProjects: 'View projects',
    heroContact: 'Get in touch',
    statYearsLabel: 'years building solutions',
    statAreasLabel: 'connected areas',
    statCuriosityLabel: 'technical curiosity',
    aboutEyebrow: 'about.md',
    aboutTitle: 'Clean, scalable software and continuous learning',
    aboutP1: 'I\'m a full stack developer with hands-on experience in Node.js, React and TypeScript, also working with IT infrastructure — Active Directory, Windows Server — and process automation with VBA.',
    aboutP2: 'My technical background in electronics gave me a solid foundation in microcontrollers, PLCs and automation, which I now apply in projects connecting sensors, data and web interfaces — like a water leak monitoring system built from scratch.',
    factLocation: 'Location',
    factLocationV: 'Divinópolis, MG — Brazil',
    factRole: 'Role',
    factRoleV: 'Freelance Full Stack Developer',
    factDifferential: 'Differentiator',
    factDifferentialV: 'Development + infrastructure + electronics',
    factLanguages: 'Languages',
    factLanguagesV: 'Professional English · Basic Spanish',
    factEducation: 'Education',
    factEducationV: 'Rocketseat Ignite · Electronics Technician (Senai)',
    stackEyebrow: 'skills.json',
    stackTitle: 'Daily tools',
    stackFrontend: 'Frontend',
    stackBackend: 'Backend',
    stackData: 'Data',
    stackDevOps: 'DevOps',
    stackInfra: 'Infra & Automation',
    stackElectronics: 'Electronics',
    expEyebrow: 'git log --career',
    expTitle: 'Professional journey',
    expRole1: 'Full Stack Developer',
    expPlace1a: 'Freelance',
    expRemote: 'Remote',
    expDesc1: 'Interfaces with React.js/Next.js and APIs with Node.js, managing data in SQL, plus automation of corporate reports with VBA.',
    expRole2: 'IT Analyst',
    expDesc2: 'User support and management of servers and Active Directory, also responsible for the company\'s marketplaces and new technology solutions.',
    expRole3: 'Full Stack Developer',
    expDesc3: 'Web applications with React.js, Next.js and Node.js; REST/GraphQL APIs with JWT authentication and a focus on scalability and best practices (SOLID).',
    expRole4: 'Development Intern',
    expDesc4: 'Supporting the senior developer in Flutter, evolving from simple tasks to more complex implementations.',
    projEyebrow: 'ls -la ~/projects',
    projTitle: 'Recent work',
    repoFeatured: 'PUBLIC · FEATURED',
    repoFirmware: 'PUBLIC · FIRMWARE',
    repoWebApp: 'PUBLIC · WEB APP',
    repoApi: 'PUBLIC · API',
    projDesc1: 'Node.js API that processes water flow sensor data and displays it in configurable dashboards — a project that combines electronics and web development.',
    projDesc2: 'C++ firmware for reading flow sensors on a microcontroller, responsible for capturing and sending the data used in the dashboard.',
    projDesc3: 'An app to track subscriptions and recurring expenses, focused on a simple and objective interface.',
    projDesc4: 'API built in TypeScript focused on good authentication and data security practices.',
    projTagDashboard: 'Dashboard',
    projTagSensors: 'Sensors',
    projTagWebApp: 'Web App',
    projTagAuth: 'Auth',
    contactCommand: './contact.exe <span>--channel=direct</span>',
    contactTitle: 'Let\'s build something together?',
    contactText: 'I\'m available for new freelance projects and full stack opportunities. Send me a message or reach out on social media.',
    formName: 'Name',
    formNamePh: 'Your name',
    formEmail: 'Email',
    formEmailPh: 'you@email.com',
    formEmailTitle: 'Enter a valid email (e.g. name@domain.com)',
    formInvalidEmail: 'Please enter a valid email.',
    formSubject: 'Subject',
    formSubjectPlaceholder: 'Choose a subject...',
    optLearning: 'Learning',
    optCareer: 'Career',
    optService: 'Service / Project',
    optContact: 'Contact',
    optOther: 'Other',
    formMsg: 'Message',
    formMsgPh: 'Write your message...',
    formSend: 'Send message',
    formStatusError: 'Could not send. Please try again or reach me by email.',
    formStatusSuccess: 'Message sent! Thanks for reaching out, I\'ll get back to you soon.',
    footerLine: '© 2026 Samuel Cristian',
    mobileDockAbout: 'about',
    mobileDockStack: 'stack',
    mobileDockProjects: 'projects',
    mobileDockContact: 'contact'
  }
};

const LANG_STORAGE_KEY = 'samuel-portfolio-lang';
let currentLang = localStorage.getItem(LANG_STORAGE_KEY) || 'pt';
if (!I18N[currentLang]) currentLang = 'pt';

/** Aplica o idioma escolhido a todo o conteúdo da página. */
function applyLanguage(lang) {
  currentLang = lang;
  const dict = I18N[lang];

  document.documentElement.lang = dict.langCode;
  document.title = dict.metaTitle;

  document.querySelectorAll('meta[data-i18n]').forEach(meta => {
    meta.setAttribute('content', dict[meta.getAttribute('data-i18n')]);
  });

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = dict[key];
    if (value != null && el.textContent !== value) el.textContent = value;
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    const value = dict[key];
    if (value != null && el.innerHTML !== value) el.innerHTML = value;
  });

  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    const value = dict[key];
    if (value != null && el.placeholder !== value) el.placeholder = value;
  });

  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const value = dict[key];
    if (value != null && el.title !== value) el.title = value;
  });

  const toggle = document.querySelector('.lang-toggle');
  if (toggle) {
    toggle.textContent = dict.flag;
    toggle.setAttribute('data-lang', dict.next);
    toggle.setAttribute('aria-label', dict.aria);
  }

  localStorage.setItem(LANG_STORAGE_KEY, lang);
}

function initLanguage() {
  applyLanguage(currentLang);

  const toggle = document.querySelector('.lang-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => applyLanguage(I18N[currentLang].next));
  }
}

/** Submete o formulário de contato via FormSubmit (entrega no email do dono). */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const status = form.querySelector('.form-status');
  const emailInput = form.querySelector('#cf-email');
  const subjectSelect = form.querySelector('#cf-assunto');
  const subjectField = form.querySelector('#cf-subject');

  const showStatus = (msg, type) => {
    status.textContent = msg;
    status.classList.remove('is-error', 'is-success');
    if (type) status.classList.add(type);
  };

  const isValidEmail = (value) => /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(value);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validação de email no frontend
    const emailValue = emailInput.value.trim();
    if (!emailValue) {
      showStatus(I18N[currentLang].formInvalidEmail, 'is-error');
      emailInput.focus();
      return;
    }
    if (!isValidEmail(emailValue)) {
      showStatus(I18N[currentLang].formInvalidEmail, 'is-error');
      emailInput.focus();
      return;
    }

    const submitBtn = form.querySelector('.form-submit');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = I18N[currentLang].formSend + '...';
    showStatus('');

    // Preenche o _subject a partir da opção escolhida no select
    if (subjectSelect && subjectField) {
      subjectField.value = subjectSelect.options[subjectSelect.selectedIndex]
        ? subjectSelect.options[subjectSelect.selectedIndex].text
        : '';
    }

    // Monta o payload JSON para o endpoint AJAX do FormSubmit
    const payload = {
      name: form.elements['name'] ? form.elements['name'].value.trim() : '',
      email: emailValue,
      subject: subjectSelect ? subjectSelect.options[subjectSelect.selectedIndex].text : '',
      message: form.elements['message'] ? form.elements['message'].value.trim() : '',
      _template: 'table',
      _captcha: 'false'
    };

    try {
      const res = await fetch(form.action.replace(/\/$/, '') + '/ajax', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        form.reset();
        showStatus(I18N[currentLang].formStatusSuccess, 'is-success');
      } else {
        throw new Error('FormSubmit error');
      }
    } catch (err) {
      showStatus(I18N[currentLang].formStatusError, 'is-error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

function init() {
  initLanguage();
  initTerminal();
  initScrollReveal();
  initSectionNavigation();
  initScrollProgress();
  initContactForm();
}

document.addEventListener('DOMContentLoaded', init);
