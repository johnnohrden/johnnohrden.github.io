/* ═══════════════════════════════════════════
   JOHN NOHRDEN — Portfolio Script
   Static site. The only behaviour is the theme toggle.
══════════════════════════════════════════ */

function initTheme() {
  const btn  = document.getElementById('themeBtn');
  const html = document.documentElement;

  try {
    const stored = localStorage.getItem('jn-theme');
    if (stored) html.dataset.theme = stored;
  } catch (e) {}

  if (!btn) return;

  btn.addEventListener('click', () => {
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    html.dataset.theme = next;
    try { localStorage.setItem('jn-theme', next); } catch (e) {}
  });
}

document.addEventListener('DOMContentLoaded', initTheme);
