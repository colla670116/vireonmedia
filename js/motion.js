/* One finite flow demonstration; everything remains readable without motion. */
(() => {
  if (!window.matchMedia || !Element.prototype.animate) return;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const running = new Set();
  const flowRuns = new Set();
  const easing = 'cubic-bezier(0.22, 1, 0.36, 1)';
  let panelRun;

  function animate(element, frames, options = {}, group) {
    if (!element || preference.matches || document.hidden) return;
    const animation = element.animate(frames, { duration: 520, easing, ...options });
    running.add(animation);
    group?.add(animation);
    animation.finished.catch(() => {}).finally(() => {
      running.delete(animation);
      group?.delete(animation);
    });
    return animation;
  }
  const rise = [
    { opacity: 0.45, transform: 'translateY(12px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ];
  const hero = document.querySelector('.hero-visual');
  const replay = document.querySelector('.flow-replay');
  function playFlow() {
    flowRuns.forEach(animation => animation.cancel());
    flowRuns.clear();
    if (preference.matches) return;
    hero.querySelectorAll('.channel-item').forEach((row, index) => {
      animate(row, [
        { opacity: 0.5, transform: 'translateX(-8px)' },
        { opacity: 1, transform: 'translateX(0)' }
      ], { duration: 440, delay: index * 80, fill: 'backwards' }, flowRuns);
    });
    hero.querySelectorAll('.decision-path > *').forEach((step, index) => {
      animate(step, rise, { duration: 440, delay: 400 + index * 160, fill: 'backwards' }, flowRuns);
    });
    animate(hero.querySelector('.quality-note'), [
      { opacity: 0.5, transform: 'translateY(8px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 640, delay: 1240, fill: 'backwards' }, flowRuns);
  }

  window.vireonMotion = {
    animatePanel(panel) {
      panelRun?.cancel();
      panelRun = animate(panel, [
        { opacity: 0.5, transform: 'translateY(6px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 240 });
    }
  };

  function syncPreference() {
    replay.hidden = preference.matches;
    if (preference.matches) running.forEach(animation => animation.cancel());
  }
  syncPreference();
  preference.addEventListener('change', syncPreference);
  replay.addEventListener('click', playFlow);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) running.forEach(animation => animation.cancel());
  });

  document.querySelectorAll('.hero-line').forEach((line, index) => {
    animate(line, rise, { duration: 600, delay: index * 100, fill: 'backwards' });
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (entry.target === hero) playFlow();
        else animate(entry.target, rise, { duration: 480 });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.18 });
    observer.observe(hero);
    // Two moments, rather than repeating an entrance on every section.
    document.querySelectorAll('.process-intro, .team-copy h2').forEach(node => observer.observe(node));
  } else {
    playFlow();
  }
})();
