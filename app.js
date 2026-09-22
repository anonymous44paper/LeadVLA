(async () => {
  'use strict';
  const content = window.LEADVLA_CONTENT;
  const playButtons = new Map();
  const videoIcon = '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="5" y="10" width="28" height="28" rx="6" stroke="currentColor" stroke-width="1.5"/><path d="m33 20 10-6v20l-10-6M16 18l10 6-10 6Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';

  function publicAsset(path, version) {
    if (typeof path !== 'string' || !/^(assets|media)\/[a-zA-Z0-9_./-]+$/.test(path) || path.includes('..')) throw new Error('Media must use a local public asset path.');
    return version ? `${path}?v=${encodeURIComponent(version)}` : path;
  }

  let available = [];
  try {
    const response = await fetch('media/available.json', { cache: 'no-store' });
    if (response.ok) available = (await response.json()).files;
  } catch { /* Keep placeholders if the optional media manifest is unavailable. */ }

  document.querySelectorAll('[data-media-slot]').forEach(slot => {
    const item = content.media[slot.dataset.mediaSlot];
    if (!item.src || !available.includes(item.src)) {
      if (slot.dataset.mediaSlot === 'teaser') return;
      const placeholder = document.createElement('div');
      placeholder.className = 'empty-media';
      placeholder.innerHTML = videoIcon;
      const title = document.createElement('p');
      title.className = 'empty-title';
      title.textContent = 'Video coming soon';
      const subtitle = document.createElement('p');
      subtitle.className = 'empty-subtitle';
      subtitle.textContent = item.note;
      placeholder.append(title);
      if (item.note) placeholder.append(subtitle);
      slot.append(placeholder);
      return;
    }
    const surface = document.createElement('div');
    surface.className = 'video-surface';
    const video = document.createElement('video');
    video.controls = true;
    video.setAttribute('controlsList', 'nodownload');
    video.muted = item.muted !== false;
    video.playsInline = true;
    video.preload = slot.dataset.mediaSlot === 'teaser' ? 'metadata' : 'none';
    video.src = publicAsset(item.src, item.version);
    if (item.aspectRatio) video.style.aspectRatio = item.aspectRatio;
    video.setAttribute('aria-label', item.title);
    if (item.poster) video.poster = publicAsset(item.poster, item.version);
    const error = document.createElement('p');
    error.className = 'media-error';
    error.hidden = true;
    error.textContent = 'This clip could not be loaded. Please try again later.';
    surface.append(video, error);
    slot.replaceChildren(surface);
  });

  let activeCategory = 'motion';
  const lastCase = Object.fromEntries(Object.entries(content.cases).map(([category, cases]) => [category, cases[0].id]));
  lastCase.motion = 'stop_recover';
  const video = document.querySelector('#simulation-video');
  const options = document.querySelector('#case-options');
  const panel = document.querySelector('#simulation-panel');
  const tabs = [...document.querySelectorAll('[data-category]')];

  function selectCase(item, category) {
    lastCase[category] = item.id;
    options.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.case === item.id)));
    video.pause();
    const asset = item.asset || `${category}-${item.id}`;
    video.poster = publicAsset(`assets/images/${asset}.webp`);
    video.src = publicAsset(`assets/videos/${asset}.mp4`);
    video.style.aspectRatio = item.aspectRatio || '4 / 3';
    video.loop = Boolean(item.loop);
    video.setAttribute('aria-label', `LeadInfra: ${item.title}`);
    video.parentElement.querySelector('.media-error').hidden = true;
    video.load();
    playButtons.get(video)?.syncPlayButton();
    document.querySelector('#case-title').textContent = item.title;
    document.querySelector('#case-description').textContent = item.description;
    document.querySelector('#case-observation').textContent = item.observation;
  }

  function selectCategory(category) {
    activeCategory = category;
    tabs.forEach(tab => {
      const selected = tab.dataset.category === category;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', `tab-${category}`);
    options.replaceChildren();
    options.hidden = content.cases[category].length === 1;
    content.cases[category].forEach(item => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = item.title;
      button.dataset.case = item.id;
      button.addEventListener('click', () => selectCase(item, category));
      options.append(button);
    });
    selectCase(content.cases[category].find(item => item.id === lastCase[category]), category);
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectCategory(tab.dataset.category));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[next].focus();
      selectCategory(tabs[next].dataset.category);
    });
  });
  selectCategory(activeCategory);

  const taskPlayer = document.querySelector('#real-task-video');
  const taskPanel = document.querySelector('#real-task-panel');
  const taskTabs = [...document.querySelectorAll('[data-real-demo]')];
  function selectTask(tab) {
    const item = content.realTasks.find(item => item.id === tab.dataset.realDemo);
    taskTabs.forEach(button => {
      const selected = button === tab;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    taskPanel.setAttribute('aria-labelledby', tab.id);
    taskPlayer.pause();
    taskPlayer.poster = publicAsset(item.poster);
    taskPlayer.setAttribute('aria-label', item.title);
    const missing = !available.includes(item.src);
    taskPanel.querySelector('.media-error').hidden = !missing;
    if (missing) taskPlayer.removeAttribute('src');
    else taskPlayer.src = publicAsset(item.src);
    taskPlayer.load();
    playButtons.get(taskPlayer)?.syncPlayButton();
  }
  taskTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTask(tab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? taskTabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + taskTabs.length) % taskTabs.length;
      taskTabs[next].focus();
      selectTask(taskTabs[next]);
    });
  });
  selectTask(taskTabs[0]);

  document.querySelectorAll('video').forEach(player => {
    player.setAttribute('controlsList', 'nodownload');
    const narrated = Boolean(player.closest('#teaser'));
    const playButton = document.createElement('button');
    playButton.type = 'button';
    playButton.className = 'video-play-button';
    playButton.innerHTML = '<span class="video-play-icon" aria-hidden="true"><svg viewBox="0 0 32 32" fill="currentColor"><path d="M11 6 27 16 11 26Z"/></svg></span><span class="video-play-label"></span>';
    player.parentElement.append(playButton);
    const syncPlayButton = () => {
      const label = player.ended ? (narrated ? 'Replay with sound' : 'Replay video') : (narrated ? 'Play with sound' : 'Play video');
      playButton.querySelector('.video-play-label').textContent = label;
      playButton.setAttribute('aria-label', `${label}: ${player.getAttribute('aria-label') || 'demo'}`);
      playButton.hidden = Boolean(player.error) || !player.getAttribute('src') || (!player.paused && !player.ended);
    };
    const startPlayback = async () => {
      if (narrated) {
        player.defaultMuted = false;
        player.removeAttribute('muted');
        player.muted = false;
        player.volume = 1;
      }
      try {
        await player.play();
      } catch {
        // A rejected autoplay attempt leaves an explicit, keyboard-accessible play button.
        // Keep narration audible: never fall back to muted autoplay.
      }
      syncPlayButton();
    };
    playButton.addEventListener('click', () => { void startPlayback(); });
    for (const event of ['play', 'playing', 'pause', 'ended', 'emptied', 'loadstart', 'error']) {
      player.addEventListener(event, syncPlayButton);
    }
    syncPlayButton();
    playButtons.set(player, { startPlayback, syncPlayButton });
    player.addEventListener('play', () => document.querySelectorAll('video').forEach(other => { if (other !== player) other.pause(); }));
    player.addEventListener('error', () => { const error = player.parentElement.querySelector('.media-error'); if (error) error.hidden = false; });
    const source = player.querySelector('source');
    if (source) source.addEventListener('error', () => { const error = player.parentElement.querySelector('.media-error'); if (error) error.hidden = false; });
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) document.querySelectorAll('video').forEach(player => player.pause()); });

  const teaser = document.querySelector('#teaser video');
  if (teaser && content.media.teaser.autoplay) {
    // Request audible autoplay, but respect browser policy and the viewer's later choices.
    teaser.autoplay = true;
    void playButtons.get(teaser).startPlayback();
  }

  const dialog = document.querySelector('#figure-dialog');
  const expanded = document.querySelector('#expanded-figure');
  document.querySelectorAll('[data-zoom]').forEach(button => button.addEventListener('click', () => {
    expanded.src = publicAsset(button.dataset.zoom);
    expanded.alt = button.querySelector('img').alt;
    dialog.showModal();
  }));
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
})();
