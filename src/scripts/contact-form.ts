import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';

function launchParticles(origin: { x: number; y: number }) {
  const isWarm = document.documentElement.dataset.palette === 'warm';
  const COLORS = isWarm
    ? ['#ff9752', '#eb7f2e', '#d4a574', '#2a1910', '#f0dfc8', '#c97f40']
    : ['#a8a8ff', '#d3fcd5', '#7878cc', '#e6e6f0', '#bcf3de', '#9090e0'];

  const COUNT = 48;
  const container = document.createElement('div');
  container.setAttribute('aria-hidden', 'true');
  container.style.cssText =
    'position:fixed;inset:0;pointer-events:none;z-index:9000;overflow:hidden;';
  document.body.appendChild(container);

  interface Particle {
    el: HTMLSpanElement;
    x: number;
    y: number;
    vx: number;
    vy: number;
    rot: number;
    vrot: number;
    alpha: number;
    decay: number;
  }

  const particles: Particle[] = [];

  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('span');
    const size = 3 + Math.random() * 5;
    const isCircle = Math.random() > 0.4;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    el.style.cssText = [
      'position:absolute',
      'left:0',
      'top:0',
      `width:${size}px`,
      `height:${isCircle ? size : Math.max(2, size * 0.38)}px`,
      `background:${color}`,
      `border-radius:${isCircle ? '50%' : '1px'}`,
      'will-change:transform,opacity',
    ].join(';');
    container.appendChild(el);

    // Fan upward: angle centered at -π/2 (straight up) ± 70°
    const spread = (Math.random() - 0.5) * Math.PI * 1.4;
    const angle = -Math.PI / 2 + spread;
    const speed = 2.5 + Math.random() * 7.5;
    particles.push({
      el,
      x: origin.x,
      y: origin.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rot: Math.random() * 360,
      vrot: (Math.random() - 0.5) * 10,
      alpha: 1,
      decay: 0.007 + Math.random() * 0.011,
    });
  }

  const gravity = 0.22;
  let rafId: number;

  function tick() {
    let alive = false;
    for (const p of particles) {
      if (p.alpha <= 0) continue;
      alive = true;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += gravity;
      p.vx *= 0.982;
      p.rot += p.vrot;
      p.alpha = Math.max(0, p.alpha - p.decay);
      p.el.style.transform = `translate(${p.x}px,${p.y}px) rotate(${p.rot}deg)`;
      p.el.style.opacity = String(p.alpha);
    }
    if (alive) {
      rafId = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(rafId);
      container.remove();
    }
  }

  rafId = requestAnimationFrame(tick);
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
const successPanel = document.querySelector<HTMLElement>('[data-success-panel]');
const errorPanel = document.querySelector<HTMLElement>('[data-error-panel]');
const submitButton = document.querySelector<HTMLButtonElement>('[data-submit-button]');

if (!form || !submitButton) {
  throw new Error('Contact form markup is missing.');
}

const nameInput = form.querySelector<HTMLInputElement>('input[name="name"]');
const emailInput = form.querySelector<HTMLInputElement>('input[name="email"]');
const messageInput = form.querySelector<HTMLTextAreaElement>('textarea[name="additionalInfo"]');

if (!nameInput || !emailInput || !messageInput) {
  throw new Error('Contact form fields are missing.');
}

const firebaseConfig: FirebaseOptions = {
  apiKey: form.dataset.firebaseApiKey || '',
  authDomain: form.dataset.firebaseAuthDomain || '',
  projectId: form.dataset.firebaseProjectId || '',
  storageBucket: form.dataset.firebaseStorageBucket || '',
  messagingSenderId: form.dataset.firebaseMessagingSenderId || '',
  appId: form.dataset.firebaseAppId || '',
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);

const app = hasFirebaseConfig
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

const db = app ? getFirestore(app) : null;

const setSubmitState = (state: SubmitState) => {
  const isLoading = state === 'loading';

  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? 'Sending...' : 'Send';
  form.dataset.state = state;

  if (successPanel) {
    successPanel.hidden = state !== 'success';
  }

  if (errorPanel) {
    errorPanel.hidden = state !== 'error';
  }
};

const setFieldError = (field: HTMLInputElement | HTMLTextAreaElement, message: string) => {
  field.setCustomValidity(message);
  field.reportValidity();
};

const clearFieldErrors = () => {
  [nameInput, emailInput, messageInput].forEach((field) => field.setCustomValidity(''));
};

const validateForm = () => {
  clearFieldErrors();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const additionalInfo = messageInput.value.trim();

  if (!name) {
    setFieldError(nameInput, 'Please enter your name.');
    return null;
  }

  if (!email) {
    setFieldError(emailInput, 'Please enter your email.');
    return null;
  }

  if (!EMAIL_REGEX.test(email)) {
    setFieldError(emailInput, 'Please enter a valid email address.');
    return null;
  }

  if (!additionalInfo) {
    setFieldError(messageInput, 'Please enter your message.');
    return null;
  }

  return {
    name,
    email,
    additionalInfo,
  };
};

const buildContactPayload = (values: { name: string; email: string; additionalInfo: string }) => ({
  name: values.name,
  email: values.email,
  additionalInfo: values.additionalInfo,
  createdAt: serverTimestamp(),
  source: 'ai.isaure-lohest.com',
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const values = validateForm();
  if (!values) return;

  setSubmitState('loading');

  try {
    if (!db) {
      throw new Error('Missing Firebase configuration.');
    }

    await addDoc(collection(db, 'contactMessages'), buildContactPayload(values));

    form.reset();
    clearFieldErrors();
    setSubmitState('success');
    const rect = submitButton.getBoundingClientRect();
    launchParticles({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  } catch (error) {
    console.error('Unable to send contact message', error);
    setSubmitState('error');
  }
});

form.addEventListener('input', () => {
  clearFieldErrors();

  if (form.dataset.state === 'success' || form.dataset.state === 'error') {
    setSubmitState('idle');
  }
});
