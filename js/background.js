/**
 * background.js — 三层背景管理器
 * 底层固定背景 + 年份背景 + 章节背景
 * 新图在上层淡入，旧图延迟淡出，实现交叉过渡
 */
window.Chronicle = window.Chronicle || {};
Chronicle.Background = {

  images: null,
  layers: null,

  init(imagesData) {
    this.images = imagesData || {};
    this.layers = {
      year: {
        main: document.getElementById('bg-year'),
        next: document.getElementById('bg-year-next'),
        current: null,
        fadeTimer: null,
        swapTimer: null,
      },
      chapter: {
        main: document.getElementById('bg-chapter'),
        next: document.getElementById('bg-chapter-next'),
        current: null,
        fadeTimer: null,
        swapTimer: null,
      },
    };

    if (this.images.default) {
      const defaultEl = document.querySelector('.bg-default');
      if (defaultEl) defaultEl.style.backgroundImage = `url('${this.images.default}')`;
    }
  },

  // 查表：year 按 entryTitle，chapter 按 "entryTitle_eventTitle"
  _lookup(type, key) {
    const map = type === 'year' ? this.images.years : this.images.chapters;
    return (map || {})[key];
  },

  // 通用交叉淡入淡出
  _setLayer(type, key) {
    const s = this.layers[type];
    if (!s.main) return;
    const url = this._lookup(type, key);

    if (s.fadeTimer) { clearTimeout(s.fadeTimer); s.fadeTimer = null; }
    if (s.swapTimer) { clearTimeout(s.swapTimer); s.swapTimer = null; }

    if (url && url !== s.current) {
      if (!s.next) {
        s.main.style.backgroundImage = `url('${url}')`;
        s.main.style.opacity = '1';
        s.current = url;
        return;
      }

      const delay = Chronicle.Config.background.crossfadeDelay;
      const fadeMs = Chronicle.Config.background.transitionDuration;

      // 新图放上层，从 0 淡入到 1
      s.next.style.transition = 'none';
      s.next.style.opacity = '0';
      s.next.style.backgroundImage = `url('${url}')`;
      s.next.offsetHeight; // 强制 reflow 确保 opacity:0 生效
      s.next.style.transition = `opacity ${delay}ms ease-in-out`;
      s.next.style.opacity = '1';

      // delay 后旧图开始淡出
      s.fadeTimer = setTimeout(() => {
        s.main.style.transition = `opacity ${fadeMs}ms ease-in-out`;
        s.main.style.opacity = '0';
        s.fadeTimer = null;

        // 旧图淡出完毕后，把新图挪到主层，重置上层
        s.swapTimer = setTimeout(() => {
          s.main.style.transition = 'none';
          s.main.style.backgroundImage = `url('${url}')`;
          s.main.style.opacity = '1';
          s.next.style.transition = 'none';
          s.next.style.opacity = '0';
          s.next.style.backgroundImage = '';
          s.swapTimer = null;
        }, fadeMs);
      }, delay);

      s.current = url;
    } else if (!url && s.current) {
      this._clearLayer(type);
    }
  },

  _clearLayer(type) {
    const s = this.layers[type];
    if (s.fadeTimer) { clearTimeout(s.fadeTimer); s.fadeTimer = null; }
    if (s.swapTimer) { clearTimeout(s.swapTimer); s.swapTimer = null; }
    if (!s.main) return;
    const fadeMs = Chronicle.Config.background.transitionDuration;
    s.main.style.transition = `opacity ${fadeMs}ms ease-in-out`;
    s.main.style.opacity = '0';
    if (s.next) {
      s.next.style.transition = `opacity ${fadeMs}ms ease-in-out`;
      s.next.style.opacity = '0';
    }
    s.current = null;
  },

  setYearBg(entryTitle) { this._setLayer('year', entryTitle); },
  clearYearBg() { this._clearLayer('year'); },
  setChapterBg(key) { this._setLayer('chapter', key); },
  clearChapterBg() { this._clearLayer('chapter'); },

  onFocusChange(entryTitle, eventTitle) {
    this.setYearBg(entryTitle);
    if (eventTitle) {
      this.setChapterBg(`${entryTitle}_${eventTitle}`);
    } else {
      this.clearChapterBg();
    }
  },
};
