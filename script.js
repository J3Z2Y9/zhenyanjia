import { profile } from './profile.js';
import { translations } from './translations.js';
import { createNetwork } from './network.js';

const $ = (selector) => document.querySelector(selector);
const all = (selector) => document.querySelectorAll(selector);
const readPreference = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
const savePreference = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Preferences are optional. */ } };
let language = readPreference('zj-language') === 'en' ? 'en' : 'zh';
const t = (key) => translations[language][key] ?? translations.zh[key] ?? key;
const localize = (value) => typeof value === 'string' ? value : (value?.[language] ?? value?.zh ?? value?.en ?? '');

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// Profile text is never interpreted as HTML.
function safeLink(url, label, className = 'text-link', allowMail = false) {
  if (typeof url !== 'string' || !url.trim()) return null;
  try {
    const parsed = new URL(url, window.location.href);
    if (!['https:', 'http:', ...(allowMail ? ['mailto:'] : [])].includes(parsed.protocol)) return null;
    const link = element('a', className, label);
    link.href = parsed.href;
    if (parsed.protocol !== 'mailto:') { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    return link;
  } catch { return null; }
}

function appendLinks(parent, links = []) {
  const row = element('div', 'item-links');
  for (const item of links) {
    const link = safeLink(item.url, localize(item.label));
    if (link) row.append(link);
  }
  if (row.childElementCount) parent.append(row);
}

function renderResearch() {
  const root = $('#research-list');
  root.replaceChildren();
  const entries = profile.research.length ? profile.research : [1, 2, 3].map(() => ({ placeholder: true }));
  entries.forEach((item, index) => {
    const card = element('article', 'research-card');
    card.append(element('span', 'research-card-number', String(index + 1).padStart(2, '0') + ' /'), element('h3', '', item.placeholder ? t('researchEmpty') : localize(item.title)), element('p', '', item.placeholder ? t('researchPlaceholder' + (index + 1)) : localize(item.description)));
    if (item.placeholder) card.append(element('span', 'card-status', t('pendingLabel')));
    root.append(card);
  });
}

function renderPublications() {
  const root = $('#publication-list');
  root.replaceChildren();
  if (!profile.publications.length) {
    const card = element('div', 'empty-publication');
    const content = element('div');
    content.append(element('h3', '', t('publicationsEmpty')), element('p', '', t('publicationPlaceholder')));
    card.append(element('span', 'publication-index', '—'), content, element('span', 'outline-badge', t('pendingShort')));
    root.append(card);
    return;
  }
  profile.publications.forEach((item) => {
    const card = element('article', 'publication');
    const body = element('div');
    body.append(element('h3', '', localize(item.title)), element('p', '', localize(item.authors)), element('p', 'venue', localize(item.venue)));
    appendLinks(body, item.links);
    card.append(element('span', 'publication-year', item.year ?? ''), body);
    root.append(card);
  });
}

function renderProjects() {
  const root = $('#project-list');
  root.replaceChildren();
  const entries = profile.projects.length ? profile.projects : [1, 2].map(() => ({ placeholder: true }));
  entries.forEach((item, index) => {
    const card = element('article', 'project-card');
    card.append(element('span', 'project-index', t('projectLabel') + ' / ' + String(index + 1).padStart(2, '0')), element('h3', '', item.placeholder ? t('projectsEmpty') : localize(item.title)), element('p', '', item.placeholder ? t('projectPlaceholder') : localize(item.description)));
    if (item.placeholder) card.append(element('span', 'card-status', t('pendingLabel')));
    else {
      if (item.tags?.length) card.append(element('p', 'card-status', item.tags.join(' · ')));
      appendLinks(card, item.links);
    }
    root.append(card);
  });
}

function renderExperience() {
  const root = $('#experience-list');
  root.replaceChildren();
  profile.experience.forEach((item) => {
    const card = element('article', 'timeline-item');
    const content = element('div');
    content.append(element('h3', '', localize(item.institution)), element('p', 'muted', localize(item.description)));
    card.append(element('span', 'timeline-date', localize(item.period)), content);
    root.append(card);
  });
}

function renderContact() {
  const root = $('#contact-links');
  root.replaceChildren();
  for (const item of profile.contacts) {
    const link = safeLink(item.url, '', 'contact-link', true);
    if (!link) continue;
    const text = element('span', '', localize(item.label));
    if (item.detail) text.append(element('small', '', item.detail));
    const arrow = element('span', '', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    link.append(text, arrow);
    root.append(link);
  }
  if (!profile.contacts.some((item) => item.url?.startsWith('mailto:'))) root.append(element('p', 'contact-pending', t('emailPending')));
}

function updateThemeLabel() {
  $('#theme-toggle').setAttribute('aria-label', t(document.documentElement.dataset.theme === 'dark' ? 'lightTheme' : 'darkTheme'));
  $('meta[name="theme-color"]').content = document.documentElement.dataset.theme === 'dark' ? '#11191c' : '#f7f8fa';
}

function setLanguage(next) {
  language = next;
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  for (const node of all('[data-i18n]')) node.textContent = t(node.getAttribute('data-i18n'));
  for (const node of all('[data-i18n-aria]')) node.setAttribute('aria-label', t(node.getAttribute('data-i18n-aria')));
  for (const node of all('[data-profile]')) node.textContent = localize(profile[node.getAttribute('data-profile')]);
  $('#name-primary').textContent = localize(profile.name);
  $('#name-secondary').replaceChildren(document.createTextNode(language === 'zh' ? profile.name.en : profile.name.zh), element('span', 'name-period', '.'));
  $('#language-label').textContent = language === 'zh' ? 'EN' : '中';
  $('#language-current').textContent = language === 'zh' ? '中' : 'EN';
  $('#language-toggle').setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换为中文');
  document.title = localize(profile.name) + ' | ' + localize(profile.institution);
  $('meta[name="description"]').content = localize(profile.name) + ' — ' + localize(profile.institution) + '. ' + t('metaDescription');
  $('meta[property="og:title"]').content = document.title;
  $('meta[property="og:description"]').content = $('meta[name="description"]').content;
  renderResearch(); renderPublications(); renderProjects(); renderExperience(); renderContact();
  $('#menu-toggle').setAttribute('aria-label', t($('#mobile-nav').hidden ? 'openMenu' : 'closeMenu'));
  const frame = $('#pdf-container iframe');
  if (frame) frame.title = t('dialogTitle');
  updateThemeLabel();
}

$('#language-toggle').hidden = false;
$('#theme-toggle').hidden = false;
$('#menu-toggle').hidden = false;
$('#language-toggle').addEventListener('click', () => { setLanguage(language === 'zh' ? 'en' : 'zh'); savePreference('zj-language', language); });
$('#theme-toggle').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  savePreference('zj-theme', next);
  updateThemeLabel();
});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
  if (readPreference('zj-theme')) return;
  document.documentElement.dataset.theme = event.matches ? 'dark' : 'light';
  updateThemeLabel();
});

function closeMenu() {
  $('#mobile-nav').hidden = true;
  $('#menu-toggle').setAttribute('aria-expanded', 'false');
  $('#menu-toggle').setAttribute('aria-label', t('openMenu'));
}
$('#menu-toggle').addEventListener('click', () => {
  const menu = $('#mobile-nav');
  menu.hidden = !menu.hidden;
  $('#menu-toggle').setAttribute('aria-expanded', String(!menu.hidden));
  $('#menu-toggle').setAttribute('aria-label', t(menu.hidden ? 'openMenu' : 'closeMenu'));
});
$('#mobile-nav').addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('click', (event) => { if (!event.target.closest('.site-header')) closeMenu(); });
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !$('#mobile-nav').hidden) { closeMenu(); $('#menu-toggle').focus(); }
});
matchMedia('(min-width: 851px)').addEventListener('change', (event) => { if (event.matches) closeMenu(); });

for (const link of all('.cv-link')) link.href = profile.cv;
const dialog = $('#cv-dialog');
$('#cv-preview').addEventListener('click', (event) => {
  if (!dialog.showModal || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (!$('#pdf-container iframe')) {
    const frame = document.createElement('iframe');
    frame.src = profile.cv + '#view=FitH';
    frame.title = t('dialogTitle');
    $('#pdf-container').append(frame);
  }
  dialog.showModal();
  $('#close-dialog').focus();
});
$('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => $('#cv-preview').focus());

if ('IntersectionObserver' in window) {
  const visible = new Set();
  const sections = [...all('section[id]')];
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) { if (entry.isIntersecting) visible.add(entry.target.id); else visible.delete(entry.target.id); }
    const first = sections.find((section) => visible.has(section.id));
    for (const link of all('.desktop-nav a')) {
      if (first && link.hash === '#' + first.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }, { rootMargin: '-18% 0px -55% 0px', threshold: 0 });
  sections.forEach((section) => observer.observe(section));
}

$('#current-year').textContent = new Date().getFullYear();
setLanguage(language);
createNetwork($('#network-canvas'));
