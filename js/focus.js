/**
 * focus.js — 焦点状态管理
 * IntersectionObserver 监听正文区域，滚动时自动更新焦点
 * 焦点变更联动：时间轴高亮 + 背景图切换 + popup 更新
 */
window.Chronicle = window.Chronicle || {};
Chronicle.Focus = {

  observer: null,
  content: null,
  currentEntry: 0,
  currentEvent: null,
  debounceTimer: null,
  paused: false,

  init(content) {
    this.content = content;
    const cfg = Chronicle.Config.focus;

    // Use IntersectionObserver to detect which event is in view
    this.observer = new IntersectionObserver((entries) => {
      if (this.paused) return;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const ei = parseInt(entry.target.dataset.entryIndex);
          const vi = parseInt(entry.target.dataset.eventIndex);
          this._debounceFocus(ei, vi);
        }
      });
    }, {
      rootMargin: `${cfg.rootMarginTop} 0px ${cfg.rootMarginBottom} 0px`,
      threshold: 0,
    });

    // Observe all event blocks
    const events = Chronicle.TextRenderer.getEventElements();
    events.forEach(el => this.observer.observe(el));

    // Set initial focus to first event
    if (events.length > 0) {
      const first = events[0];
      this._setFocus(
        parseInt(first.dataset.entryIndex),
        parseInt(first.dataset.eventIndex)
      );
    }
  },

  /** Find the event element closest to the top of the viewport */
  getTopEventElement() {
    const events = Chronicle.TextRenderer.getEventElements();
    let best = null;
    let bestTop = Infinity;
    for (const el of events) {
      const rect = el.getBoundingClientRect();
      if (rect.top >= 0 && rect.top < bestTop) {
        bestTop = rect.top;
        best = el;
      }
    }
    // If nothing is below the viewport top, fall back to the last element above
    if (!best && events.length > 0) {
      for (let i = events.length - 1; i >= 0; i--) {
        const rect = events[i].getBoundingClientRect();
        if (rect.top < 0) { best = events[i]; break; }
      }
    }
    return best;
  },

  _debounceFocus(ei, vi) {
    const cfg = Chronicle.Config.focus;
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this._setFocus(ei, vi);
    }, cfg.debounceMs);
  },

  _setFocus(ei, vi) {
    if (this.currentEntry === ei && this.currentEvent === vi) return;
    this.currentEntry = ei;
    this.currentEvent = vi;

    // Get entry title
    const entry = this.content.entries[ei];
    if (!entry) return;
    const entryTitle = entry.title;
    const eventTitle = (entry.events && entry.events[vi]) ? entry.events[vi].title : null;

    // Update timeline
    Chronicle.Timeline.updateFocus(ei, vi);

    // Update background
    Chronicle.Background.onFocusChange(entryTitle, eventTitle);
  },
};
