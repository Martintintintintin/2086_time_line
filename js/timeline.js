/**
 * timeline.js — 时间轴渲染 + sin/cos浮动 + 统一popup
 * 左侧固定栏：垂直线 + 年份数字交替排列 + 统一popup
 */
window.Chronicle = window.Chronicle || {};
Chronicle.Timeline = {

  container: null,
  timeline: null,
  entries: [],
  floatData: [],         // 每个元素的浮动参数
  animId: null,          // requestAnimationFrame ID
  currentEntry: -1,      // 当前焦点 entry index
  currentEvent: null,    // 当前焦点 event index
  hoveredEntry: -1,      // 当前鼠标悬浮的 entry index
  isHovering: false,     // 鼠标是否在时间轴内

  render(content) {
    this.container = document.getElementById('timeline-entries');
    this.timeline = document.getElementById('timeline');
    if (!this.container) return;
    this.container.innerHTML = '';
    this.entries = content.entries || [];
    this.floatData = [];

    const cfg = Chronicle.Config.timeline;

    this.entries.forEach((entry, ei) => {
      const el = document.createElement('div');
      el.className = 'timeline-entry';
      el.dataset.entryIndex = ei;

      // Dot on the line
      const dot = document.createElement('div');
      dot.className = 'timeline-dot';
      el.appendChild(dot);

      // Number/title (position: relative for popup)
      const num = document.createElement('span');
      num.className = 'timeline-number';
      num.textContent = entry.title;
      num.dataset.entryIndex = ei;
      if (entry.type !== 'year') {
        num.classList.add('section-title');
      }
      el.appendChild(num);

      // Unified popup (child of number, floats with it)
      const popup = document.createElement('div');
      popup.className = 'timeline-popup';
      popup.dataset.entryIndex = ei;
      num.appendChild(popup);

      // Click year number → scroll to entry
      num.addEventListener('click', () => {
        Chronicle.TextRenderer.scrollToEntry(ei);
      });

      this.container.appendChild(el);

      // Generate independent random float params (from 2.1 design)
      this.floatData.push({
        el: num,
        freqX: this._rand(cfg.floatFreqMin, cfg.floatFreqMax),
        freqY: this._rand(cfg.floatFreqMin, cfg.floatFreqMax),
        phaseX: this._rand(0, Math.PI * 2),
        phaseY: this._rand(0, Math.PI * 2),
        ampX: this._rand(cfg.floatAmpMin, cfg.floatAmpMax),
        ampY: this._rand(cfg.floatAmpMin, cfg.floatAmpMax),
        offsetX: 0,
        offsetY: 0,
      });
    });

    this._setupInteraction();
    this._startFloatAnim();
  },

  // === Mouse interaction for popup state ===
  _setupInteraction() {
    if (!this.timeline) return;

    // Mouse enters timeline → hover mode
    this.timeline.addEventListener('mouseenter', () => {
      this.isHovering = true;
      this._updateAllPopups();
    });

    // Mouse leaves timeline → exit hover mode
    this.timeline.addEventListener('mouseleave', () => {
      this.isHovering = false;
      this.hoveredEntry = -1;
      this._updateAllPopups();
    });

    // Mouse moves over entries (delegated)
    this.container.addEventListener('mouseover', (e) => {
      const entry = e.target.closest('.timeline-entry');
      if (entry) {
        const ei = parseInt(entry.dataset.entryIndex);
        if (ei !== this.hoveredEntry) {
          this.hoveredEntry = ei;
          this._updateAllPopups();
        }
      }
    });

    // Click delegation for popup items
    this.container.addEventListener('click', (e) => {
      const item = e.target.closest('.popup-item');
      if (item) {
        e.stopPropagation();
        const ei = parseInt(item.closest('.timeline-entry').dataset.entryIndex);
        const vi = parseInt(item.dataset.eventIndex);
        Chronicle.TextRenderer.scrollToEvent(ei, vi);
      }
    });
  },

  // === Unified popup content management ===
  _updateAllPopups() {
    this.entries.forEach((entry, ei) => {
      const popupEl = this.container.querySelector(
        `.timeline-entry[data-entry-index="${ei}"] .timeline-popup`
      );
      if (!popupEl) return;

      const entryEl = popupEl.closest('.timeline-entry');

      if (this.isHovering && ei === this.hoveredEntry) {
        // Hover mode: show all event titles
        const events = entry.events || [];
        if (events.length > 0) {
          popupEl.innerHTML = events.map((ev, vi) =>
            `<div class="popup-item" data-event-index="${vi}">${ev.title}</div>`
          ).join('');
          entryEl.classList.add('popup-active');
        } else {
          entryEl.classList.remove('popup-active');
        }
      } else if (!this.isHovering && ei === this.currentEntry) {
        // Focus mode: show only focused event title
        const events = entry.events || [];
        if (this.currentEvent !== null && this.currentEvent !== undefined && events[this.currentEvent]) {
          popupEl.innerHTML = `<div class="popup-item focused">${events[this.currentEvent].title}</div>`;
          entryEl.classList.add('popup-active');
        } else {
          entryEl.classList.remove('popup-active');
        }
      } else {
        // Empty
        entryEl.classList.remove('popup-active');
        popupEl.innerHTML = '';
      }
    });
  },

  // === sin/cos floating animation (from 2.1时间轴本轴.html) ===
  _startFloatAnim() {
    if (this.animId) cancelAnimationFrame(this.animId);

    const animate = (timestamp) => {
      const t = timestamp * 0.001; // ms → seconds

      this.floatData.forEach(data => {
        const x = Math.sin(t * data.freqX + data.phaseX) * data.ampX;
        const y = Math.cos(t * data.freqY + data.phaseY) * data.ampY;

        // Lerp for smooth movement
        data.offsetX += (x - data.offsetX) * 0.08;
        data.offsetY += (y - data.offsetY) * 0.08;

        data.el.style.transform =
          `translate(${data.offsetX.toFixed(2)}px, ${data.offsetY.toFixed(2)}px)`;
      });

      this.animId = requestAnimationFrame(animate);
    };

    this.animId = requestAnimationFrame(animate);
  },

  // === Called by FocusManager when focus changes ===
  updateFocus(entryIndex, eventIndex) {
    // Clear previous focus
    this.container.querySelectorAll('.timeline-entry.focused').forEach(el => {
      el.classList.remove('focused');
    });

    this.currentEntry = entryIndex;
    this.currentEvent = eventIndex;

    // Set new focus
    const entry = this.container.querySelector(
      `.timeline-entry[data-entry-index="${entryIndex}"]`
    );
    if (entry) {
      entry.classList.add('focused');
      // Auto-scroll timeline to show focused entry
      this._scrollToEntry(entry);
    }

    // Update popups (only in non-hover mode)
    if (!this.isHovering) {
      this._updateAllPopups();
    }
  },

  _scrollToEntry(entryEl) {
    if (!this.timeline || !entryEl) return;
    const containerH = this.timeline.clientHeight;
    const entryTop = entryEl.offsetTop;
    const entryH = entryEl.offsetHeight;
    const scrollTarget = entryTop - containerH / 2 + entryH / 2;
    this.timeline.scrollTo({ top: scrollTarget, behavior: 'smooth' });
  },

  _rand(min, max) {
    return Math.random() * (max - min) + min;
  },
};
