/**
 * main.js — 主入口
 * 加载数据 → 渲染各模块 → 启动动效
 */
window.Chronicle = window.Chronicle || {};
Chronicle.Main = {

  // 将 config.js 中的值注入为 CSS 自定义属性，供 style.css 引用
  applyConfig() {
    const root = document.documentElement;
    const cfg = Chronicle.Config;
    const t = cfg.text;
    const tl = cfg.timeline;
    const bg = cfg.background;

    // 正文文字
    root.style.setProperty('--content-width', t.contentWidth);
    root.style.setProperty('--body-font-size', t.fontSize);
    root.style.setProperty('--body-line-height', t.lineHeight);
    root.style.setProperty('--paragraph-spacing', t.paragraphSpacing);
    root.style.setProperty('--entry-spacing', t.entrySpacing);
    root.style.setProperty('--event-spacing', t.eventSpacing);
    root.style.setProperty('--heading-font-size', t.headingFontSize);
    root.style.setProperty('--heading-color', t.headingColor);
    root.style.setProperty('--heading-shadow', t.headingShadow);
    root.style.setProperty('--heading-stroke', t.headingStroke);
    root.style.setProperty('--event-title-font-size', t.eventTitleFontSize);
    root.style.setProperty('--event-title-color', t.eventTitleColor);
    root.style.setProperty('--event-title-shadow', t.eventTitleShadow);
    root.style.setProperty('--event-title-stroke', t.eventTitleStroke);
    root.style.setProperty('--body-color', t.bodyColor);
    root.style.setProperty('--body-shadow', t.bodyShadow);
    root.style.setProperty('--body-stroke', t.bodyStroke);
    root.style.setProperty('--muted-color', t.mutedColor);
    root.style.setProperty('--highlight-bg', t.highlightBg);
    root.style.setProperty('--highlight-padding', t.highlightPadding);
    root.style.setProperty('--highlight-radius', t.highlightRadius);

    // blockquote
    const bq = t.blockquote || {};
    root.style.setProperty('--blockquote-border', bq.borderColor);
    root.style.setProperty('--blockquote-highlight', bq.highlightBg);
    root.style.setProperty('--blockquote-left-pad', bq.leftPad);
    root.style.setProperty('--blockquote-opacity', bq.opacity);
    root.style.setProperty('--blockquote-font-style', bq.italic ? 'italic' : 'normal');

    // 背景
    root.style.setProperty('--glass-blur', bg.glassBlur + 'px');
    root.style.setProperty('--glass-bg', bg.glassBg);
    root.style.setProperty('--bg-transition-duration', (bg.transitionDuration / 1000) + 's');
    root.style.setProperty('--bg-default-color', bg.defaultBgColor);

    // 时间轴
    root.style.setProperty('--timeline-width', tl.width);
    root.style.setProperty('--timeline-item-height', tl.itemSpacing + 'px');
    root.style.setProperty('--timeline-number-font-size', tl.numberFontSize);
    root.style.setProperty('--timeline-number-color', tl.numberColor);
    root.style.setProperty('--timeline-number-hover-color', tl.numberHoverColor);
    root.style.setProperty('--timeline-number-focus-color', tl.numberFocusColor);
    root.style.setProperty('--timeline-number-focus-shadow', tl.numberFocusShadow);
    root.style.setProperty('--timeline-line-color', tl.lineColor);
    root.style.setProperty('--timeline-line-width', tl.lineWidth);

    // 注解
    const an = cfg.annotation;
    root.style.setProperty('--anno-panel-width', an.panelWidth);
    root.style.setProperty('--anno-panel-max-height', an.panelMaxHeight);
    root.style.setProperty('--anno-panel-bg', an.panelBg);
    root.style.setProperty('--anno-panel-blur', an.panelBlur + 'px');
    root.style.setProperty('--anno-panel-margin-right', an.panelMarginRight);
    root.style.setProperty('--anno-panel-title-color', an.panelTitleColor);
    root.style.setProperty('--anno-panel-text-color', an.panelTextColor);
    root.style.setProperty('--anno-panel-text-shadow', an.panelTextShadow);
    root.style.setProperty('--anno-corner-color', an.cornerColor);
    root.style.setProperty('--anno-corner-size', an.cornerSize + 'px');
    root.style.setProperty('--anno-corner-inset', an.cornerInset + 'px');
    root.style.setProperty('--anno-link-color', an.linkColor);
    root.style.setProperty('--anno-link-hover-color', an.linkHoverColor);
  },

  async init() {
    try {
      // 先注入配置，确保首次渲染就有正确的样式
      this.applyConfig();

      const { content, images, annotations } = await Chronicle.DataLoader.load();

      // Render content (must happen before timeline & focus)
      Chronicle.TextRenderer.render(content);

      // Render timeline
      Chronicle.Timeline.render(content);

      // Init background with image manifest
      Chronicle.Background.init(images);

      // Init annotation system (after content is rendered)
      Chronicle.Annotation.init(annotations);

      // Init rain particle system
      Chronicle.Rain.init();
      Chronicle.Rain.start();

      // Init focus system (last — depends on rendered DOM)
      Chronicle.Focus.init(content);

      // Hide loading screen
      const loader = document.getElementById('loading-screen');
      if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 600);
      }

    } catch (err) {
      console.error('Chronicle init failed:', err);
      const loader = document.getElementById('loading-screen');
      if (loader) {
        loader.innerHTML = `<div class="loading-text" style="color:#ff6b6b;">Load failed: ${err.message}<br>Please ensure content.json exists.</div>`;
      }
    }
  },
};

document.addEventListener('DOMContentLoaded', () => {
  Chronicle.Main.init();
});
