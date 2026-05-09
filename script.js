// Nav — absolute at bottom of hero, sticky once scrolled past
const nav  = document.getElementById('nav');
const hero = document.getElementById('home');

function updateNavSticky() {
  const heroBottom = hero.getBoundingClientRect().bottom;
  nav.classList.toggle('sticky', heroBottom <= 0);
}

window.addEventListener('scroll', updateNavSticky, { passive: true });
updateNavSticky();

// Mobile nav
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
const navClose  = document.getElementById('nav-close');

hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navClose.addEventListener('click', closeMenu);
mobileNav.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMenu));

function closeMenu() {
  mobileNav.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

// Nav dropdown
const dropdownItem    = document.querySelector('.nav-dropdown');
const dropdownTrigger = dropdownItem?.querySelector('.nav-dropdown-trigger');

dropdownTrigger?.addEventListener('click', () => {
  const isOpen = dropdownItem.classList.toggle('open');
  dropdownTrigger.setAttribute('aria-expanded', String(isOpen));
});

document.addEventListener('click', e => {
  if (dropdownItem && !dropdownItem.contains(e.target)) {
    dropdownItem.classList.remove('open');
    dropdownTrigger?.setAttribute('aria-expanded', 'false');
  }
});

dropdownItem?.querySelectorAll('a').forEach(l => {
  l.addEventListener('click', () => {
    dropdownItem.classList.remove('open');
    dropdownTrigger?.setAttribute('aria-expanded', 'false');
  });
});

// Scroll fade-in
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Parallax scroll — .parallax-img shifts Y independent of .prlx Ken Burns animation
const parallaxTargets = Array.from(document.querySelectorAll('.parallax-img')).map(img => {
  const wrap = img.closest('.hero-photo-panel, .philosophy-photo, .about-photo, .testimonials-bg');
  const isPhilosophy = !!img.closest('.philosophy-photo');
  return { wrap, img, speed: isPhilosophy ? 0.135 : 0.18 };
});

function applyParallax() {
  parallaxTargets.forEach(({ wrap, img, speed }) => {
    if (!wrap) return;
    const rect   = wrap.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const center = rect.top + rect.height / 2 - window.innerHeight / 2;
    img.style.transform = `translateY(${center * speed}px)`;
  });
}

window.addEventListener('scroll', applyParallax, { passive: true });
applyParallax();

// Specialty accordions
document.querySelectorAll('.specialty-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const body = btn.nextElementSibling;

    document.querySelectorAll('.specialty-btn').forEach(other => {
      if (other !== btn) {
        other.setAttribute('aria-expanded', 'false');
        other.nextElementSibling.style.maxHeight = null;
      }
    });

    btn.setAttribute('aria-expanded', String(!expanded));
    body.style.maxHeight = expanded ? null : body.scrollHeight + 'px';
  });
});

// FAQ accordions
document.querySelectorAll('.faq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const body = btn.nextElementSibling;

    document.querySelectorAll('.faq-btn').forEach(other => {
      if (other !== btn) {
        other.setAttribute('aria-expanded', 'false');
        other.nextElementSibling.style.maxHeight = null;
      }
    });

    btn.setAttribute('aria-expanded', String(!expanded));
    body.style.maxHeight = expanded ? null : body.scrollHeight + 'px';
  });
});

// Testimonials carousel
const testimonials = document.querySelectorAll('.testimonial');
const dots         = document.querySelectorAll('.dot');
let current = 0, autoTimer;

function goTo(idx) {
  testimonials[current].classList.remove('active');
  dots[current].classList.remove('active');
  dots[current].setAttribute('aria-selected', 'false');
  current = idx;
  testimonials[current].classList.add('active');
  dots[current].classList.add('active');
  dots[current].setAttribute('aria-selected', 'true');
}

function startAuto() {
  autoTimer = setInterval(() => goTo((current + 1) % testimonials.length), 5500);
}

dots.forEach((dot, idx) => {
  dot.addEventListener('click', () => { clearInterval(autoTimer); goTo(idx); startAuto(); });
});

if (testimonials.length) startAuto();

// Contact form
const form = document.querySelector('.contact-form');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Message sent — thank you.';
  btn.disabled = true;
  btn.style.opacity = '0.7';
  form.reset();
});
