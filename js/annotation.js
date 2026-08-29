/**
 * annotation.js — 页内词条注解系统
 * 正文中的 [[术语]] 渲染为可点击链接，点击后在右侧推挤面板显示补充说明
 * 注解数据由 extract_doc.js 从正文 [[术语]]{json} 格式自动提取，写入 annotations.json
 * 图片注解放 images/annotations/ 文件夹，文件名对应 pic 字段
 */
window.Chronicle = window.Chronicle || {};
Chronicle.Annotation = {

  data: null,
  panel: null,
  content: null,
  contentEl: null,
  lightbox: null,
  lightboxImg: null,

  init(annotationsData) {
    this.data = annotationsData || {};
    this.panel = document.getElementById('anno-panel');
    this.content = document.getElementById('anno-content');
    this.contentEl = document.getElementById('content');
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImg = document.getElementById('lightbox-img');

    // 事件委托：点击注链 / 图片放大 / 面板外部关闭 / lightbox关闭
    document.addEventListener('click', (e) => {
      // 点击注解图片 → lightbox
      if (e.target.classList.contains('anno-img')) {
        this._openLightbox(e.target.src);
        return;
      }
      // 点击 lightbox → 关闭
      if (this.lightbox && this.lightbox.contains(e.target)) {
        this._closeLightbox();
        return;
      }
      // 点击注链
      const link = e.target.closest('.anno-link');
      if (link) {
        e.preventDefault();
        this.show(link.dataset.key);
        return;
      }
      // 点击面板外部关闭
      if (this.panel && this.panel.classList.contains('open')) {
        if (!this.panel.contains(e.target)) {
          this.hide();
        }
      }
    });

    // Esc 关闭面板或 lightbox
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (this.lightbox && this.lightbox.classList.contains('open')) {
        this._closeLightbox();
      } else if (this.panel && this.panel.classList.contains('open')) {
        this.hide();
      }
    });

    // 清理无效注链（annotations.json 里没有的 key 退化为普通文字）
    document.querySelectorAll('.anno-link').forEach(link => {
      if (!this.data[link.dataset.key]) {
        link.classList.remove('anno-link');
      }
    });
  },

  show(key) {
    const anno = this.data[key];
    if (!anno || !this.panel || !this.content) return;

    let html = `<div class="anno-title">${this._escape(anno.term || key)}</div>`;

    if (anno.text) {
      const parts = anno.text.split(/\[\[br\]\]/i);
      const textHtml = parts.map(p => `<p>${this._escape(p.trim())}</p>`).join('');
      html += `<div class="anno-text">${textHtml}</div>`;
    }

    if (anno.pic) {
      const src = `images/annotations/${anno.pic}`;
      html += `<img class="anno-img" src="${src}" alt="${this._escape(anno.term || key)}" onerror="this.style.display='none'">`;
    }

    if (anno.ref) {
      html += `<div class="anno-ref">
        <div class="anno-ref-label">参考链接</div>
        <a class="anno-ref-url" href="${this._escape(anno.ref)}" target="_blank" rel="noopener noreferrer">${this._escape(anno.ref)}</a>
      </div>`;
    }

    this.content.innerHTML = html;
    this.panel.classList.add('open');
    if (this.contentEl) this.contentEl.classList.add('anno-open');
  },

  hide() {
    if (this.panel) this.panel.classList.remove('open');
    if (this.contentEl) this.contentEl.classList.remove('anno-open');
  },

  _openLightbox(src) {
    if (!this.lightbox || !this.lightboxImg) return;
    this.lightboxImg.src = src;
    this.lightbox.classList.add('open');
  },

  _closeLightbox() {
    if (!this.lightbox) return;
    this.lightbox.classList.remove('open');
    this.lightboxImg.src = '';
  },

  _escape(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },
};
