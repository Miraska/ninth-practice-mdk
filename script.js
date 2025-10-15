// Header dropdown
const dropdownItem = document.querySelector('.nav__dropdown');
const dropdownBtn = document.querySelector('.nav__link--button');
const dropdownMenu = document.querySelector('.dropdown');
if (dropdownItem && dropdownBtn && dropdownMenu) {
  const close = () => {
    dropdownItem.classList.remove('open');
    dropdownBtn.setAttribute('aria-expanded', 'false');
  };
  const open = () => {
    dropdownItem.classList.add('open');
    dropdownBtn.setAttribute('aria-expanded', 'true');
  };
  dropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdownItem.classList.contains('open');
    isOpen ? close() : open();
  });
  document.addEventListener('click', (e) => {
    if (!dropdownItem.contains(e.target)) close();
  });
  dropdownBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

// Simple slider
const sliderEl = document.querySelector('.slider');
if (sliderEl) {
  const slides = Array.from(sliderEl.querySelectorAll('.slide'));
  const prevBtn = sliderEl.querySelector('.slider__btn--prev');
  const nextBtn = sliderEl.querySelector('.slider__btn--next');
  const dotsWrap = sliderEl.querySelector('.slider__dots');
  let current = 0;
  let timerId = null;

  const update = () => {
    slides.forEach((s, i) => {
      const isActive = i === current;
      s.classList.toggle('is-active', isActive);
      s.setAttribute('aria-hidden', String(!isActive));
    });
    dotsWrap.querySelectorAll('.slider__dot').forEach((d, i) => d.classList.toggle('is-active', i === current));
  };
  const goTo = (idx) => {
    current = (idx + slides.length) % slides.length;
    update();
  };
  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);
  const startAuto = () => {
    clearInterval(timerId);
    timerId = setInterval(next, 5000);
  };

  // dots
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.className = 'slider__dot' + (i === 0 ? ' is-active' : '');
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', `Слайд ${i + 1}`);
    b.addEventListener('click', () => { goTo(i); startAuto(); });
    dotsWrap.appendChild(b);
  });

  prevBtn.addEventListener('click', () => { prev(); startAuto(); });
  nextBtn.addEventListener('click', () => { next(); startAuto(); });
  startAuto();
}

// Tabs (services)
const tabs = Array.from(document.querySelectorAll('.tab'));
const panels = Array.from(document.querySelectorAll('.tab-panel'));
if (tabs.length && panels.length) {
  const activate = (name) => {
    tabs.forEach(t => {
      const isActive = t.dataset.tab === name;
      t.classList.toggle('is-active', isActive);
      t.setAttribute('aria-selected', String(isActive));
    });
    panels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === name));
  };
  tabs.forEach(t => t.addEventListener('click', () => activate(t.dataset.tab)));
}

// Accordion (FAQ)
document.querySelectorAll('.accordion__item').forEach(item => {
  const header = item.querySelector('.accordion__header');
  const panel = item.querySelector('.accordion__panel');
  header.addEventListener('click', () => {
    const expanded = header.getAttribute('aria-expanded') === 'true';
    header.setAttribute('aria-expanded', String(!expanded));
    panel.hidden = expanded;
  });
});

// Form validation + modal
const form = document.getElementById('callbackForm');
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modalMessage');
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const showError = (name, message) => {
  const el = document.querySelector(`[data-error-for="${name}"]`);
  if (el) el.textContent = message || '';
};

const validateCyrillic = (value) => /^[А-ЯЁа-яё\-\s]{2,}$/.test(value.trim());
const validatePhone = (value) => /^\+7\s?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/.test(value.trim());

if (form && modal) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fio = form.fio.value;
    const phone = form.phone.value;
    const comment = form.comment.value;
    let valid = true;

    // FIO
    if (!fio.trim()) { showError('fio', 'Заполните ФИО'); valid = false; }
    else if (!validateCyrillic(fio)) { showError('fio', 'Только кириллица, минимум 2 символа'); valid = false; }
    else showError('fio', '');

    // Phone
    if (!phone.trim()) { showError('phone', 'Укажите телефон'); valid = false; }
    else if (!validatePhone(phone)) { showError('phone', 'Формат: +7 (999) 123-45-67'); valid = false; }
    else showError('phone', '');

    // Comment
    if (!comment.trim()) { showError('comment', 'Поле не должно быть пустым'); valid = false; }
    else showError('comment', '');

    if (!valid) return;

    // emulate send
    modal.setAttribute('aria-hidden', 'false');
    modalMessage.textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.';
    setTimeout(() => {
      modal.setAttribute('aria-hidden', 'true');
      form.reset();
    }, 2000);
  });
}

// Back to top
const backToTop = document.getElementById('backToTop');
const banner = document.getElementById('banner');
const computeThreshold = () => (banner ? banner.offsetHeight : 300);
let threshold = computeThreshold();
window.addEventListener('resize', () => { threshold = computeThreshold(); });
window.addEventListener('scroll', () => {
  if (!backToTop) return;
  if (window.scrollY > threshold) backToTop.classList.add('show');
  else backToTop.classList.remove('show');
});
if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


