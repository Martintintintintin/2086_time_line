/**
 * rain.js — 雨丝粒子系统
 * 移植自 1.3背景模块.html，参数改为从 Config 读取
 */
window.Chronicle = window.Chronicle || {};
Chronicle.Rain = {

  farBox: null,
  nearBox: null,
  farTimer: null,
  nearTimer: null,
  mouseHandler: null,

  init() {
    this.farBox = document.getElementById('rain-far');
    this.nearBox = document.getElementById('rain-near');
    if (!this.farBox || !this.nearBox) return;

    const cfg = Chronicle.Config.rain;
    const pcfg = Chronicle.Config.parallax;

    // --- Create far line ---
    this.createFarLine = () => {
      const line = document.createElement('div');
      line.className = 'fall-line';
      const w = this._rand(cfg.farMinW, cfg.farMaxW);
      const h = this._rand(cfg.farMinH, cfg.farMaxH);
      const left = Math.random() * window.innerWidth;
      const speed = this._rand(cfg.farMinSpeed, cfg.farMaxSpeed);
      line.style.setProperty('--line-width', `${w}px`);
      line.style.setProperty('--line-height', `${h}px`);
      line.style.left = `${left}px`;
      line.style.backgroundColor = cfg.farColor;
      this.farBox.appendChild(line);
      this._animate(line, h, speed);
    };

    // --- Create near line ---
    this.createNearLine = () => {
      const line = document.createElement('div');
      line.className = 'fall-line';
      const w = this._rand(cfg.nearMinW, cfg.nearMaxW);
      const h = this._rand(cfg.nearMinH, cfg.nearMaxH);
      const left = Math.random() * window.innerWidth;
      const speed = this._rand(cfg.nearMinSpeed, cfg.nearMaxSpeed);
      line.style.setProperty('--line-width', `${w}px`);
      line.style.setProperty('--line-height', `${h}px`);
      line.style.left = `${left}px`;
      line.style.backgroundColor = cfg.nearColor;
      this.nearBox.appendChild(line);
      this._animate(line, h, speed);
    };

    // --- Parallax on mouse move ---
    const bgWrap = document.querySelector('.bg-wrap');
    this.mouseHandler = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const mx = e.clientX - cx;
      const my = e.clientY - cy;
      if (bgWrap) {
        bgWrap.style.transform = `scale(1.15) translate3d(${mx * pcfg.bg}px, ${my * pcfg.bg}px, 0)`;
      }
      this.farBox.style.transform = `scale(1.15) translate3d(${mx * pcfg.farLine}px, ${my * pcfg.farLine}px, 0)`;
      this.nearBox.style.transform = `scale(1.15) translate3d(${mx * pcfg.nearLine}px, ${my * pcfg.nearLine}px, 0)`;
    };

    // --- Resize cleanup ---
    this.resizeHandler = () => {
      this.farBox.innerHTML = '';
      this.nearBox.innerHTML = '';
    };

    document.addEventListener('mousemove', this.mouseHandler);
    window.addEventListener('resize', this.resizeHandler);
  },

  start() {
    if (!this.farBox || !this.nearBox) return;
    const cfg = Chronicle.Config.rain;
    this.farTimer = setInterval(() => this.createFarLine(), cfg.farCreateGap);
    this.nearTimer = setInterval(() => this.createNearLine(), cfg.nearCreateGap);
  },

  stop() {
    if (this.farTimer) clearInterval(this.farTimer);
    if (this.nearTimer) clearInterval(this.nearTimer);
  },

  _rand(min, max) {
    return Math.random() * (max - min) + min;
  },

  _animate(line, h, speed) {
    let top = -h;
    const step = () => {
      top += speed;
      line.style.top = `${top}px`;
      if (top > window.innerHeight) {
        line.remove();
        return;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },
};
