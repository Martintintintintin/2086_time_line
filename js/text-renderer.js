/**
 * text-renderer.js — 正文渲染模块
 * 遍历 content.json entries，生成 HTML 结构
 * 支持：文字底衬、空格保留、[[br]] 手动空行、[[术语]]注解链接
 */
window.Chronicle = window.Chronicle || {};
Chronicle.TextRenderer = {

  render(content) {
    const container = document.getElementById('content');
    if (!container) return;
    container.innerHTML = '';

    const cfg = Chronicle.Config.text;
    const entries = content.entries || [];
    entries.forEach((entry, ei) => {
      const entryEl = document.createElement('div');
      entryEl.className = 'entry-block';
      entryEl.id = `entry-${ei}`;
      entryEl.dataset.entryIndex = ei;

      const title = document.createElement('h2');
      title.className = 'entry-title';
      title.textContent = entry.title;
      entryEl.appendChild(title);

      const events = entry.events || [];
      events.forEach((event, vi) => {
        const eventEl = document.createElement('section');
        eventEl.className = 'event-block';
        eventEl.id = `event-${ei}-${vi}`;
        eventEl.dataset.entryIndex = ei;
        eventEl.dataset.eventIndex = vi;

        const h3 = document.createElement('h3');
        h3.className = 'event-title';
        h3.textContent = event.title;
        eventEl.appendChild(h3);

        const textDiv = document.createElement('div');
        textDiv.className = 'event-text';
        const lines = (event.text || '').split('\n');

        // 逐行扫描，识别 blockquote 段落（连续的 > 开头行）
        let inBlockquote = false;
        let blockquoteEl = null;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const isQuote = /^>\s?/.test(line);

          // [[br]] 手动空行标记
          if (line.trim() === cfg.brTag) {
            // 如果在 blockquote 里，先关闭
            if (inBlockquote && blockquoteEl) {
              textDiv.appendChild(blockquoteEl);
              blockquoteEl = null;
              inBlockquote = false;
            }
            const brEl = document.createElement('span');
            brEl.className = 'br-line';
            textDiv.appendChild(brEl);
            continue;
          }

          // 空行
          if (line.trim() === '') {
            if (inBlockquote) {
              // blockquote 内部的空行：作为间距
              const gap = document.createElement('div');
              gap.className = 'bq-gap';
              blockquoteEl.appendChild(gap);
            }
            // 非 blockquote 的空行直接跳过
            continue;
          }

          if (isQuote) {
            // 进入或继续 blockquote
            if (!inBlockquote) {
              blockquoteEl = document.createElement('blockquote');
              blockquoteEl.className = 'event-blockquote';
              inBlockquote = true;
            }
            const content = line.replace(/^>\s?/, ''); // 去掉 > 前缀
            if (content.trim() === '') {
              // 空的引用行也作为间距
              const gap = document.createElement('div');
              gap.className = 'bq-gap';
              blockquoteEl.appendChild(gap);
            } else {
              const pEl = document.createElement('p');
              const lineSpan = document.createElement('span');
              lineSpan.className = 'p-line bq-line';
              if (content.includes('[[')) {
                lineSpan.innerHTML = this._renderLineContent(content, ei, vi, cfg.preserveSpaces);
              } else {
                if (cfg.preserveSpaces) {
                  lineSpan.innerHTML = this._preserveSpaces(this._escapeHtml(content));
                } else {
                  lineSpan.textContent = content;
                }
              }
              pEl.appendChild(lineSpan);
              blockquoteEl.appendChild(pEl);
            }
          } else {
            // 普通行
            if (inBlockquote && blockquoteEl) {
              // 关闭 blockquote
              textDiv.appendChild(blockquoteEl);
              blockquoteEl = null;
              inBlockquote = false;
            }
            const pEl = document.createElement('p');
            const lineSpan = document.createElement('span');
            lineSpan.className = 'p-line';
            if (line.includes('[[')) {
              lineSpan.innerHTML = this._renderLineContent(line, ei, vi, cfg.preserveSpaces);
            } else {
              if (cfg.preserveSpaces) {
                lineSpan.innerHTML = this._preserveSpaces(this._escapeHtml(line));
              } else {
                lineSpan.textContent = line;
              }
            }
            pEl.appendChild(lineSpan);
            textDiv.appendChild(pEl);
          }
        }

        // 收尾：如果最后一行是 blockquote
        if (inBlockquote && blockquoteEl) {
          textDiv.appendChild(blockquoteEl);
        }

        eventEl.appendChild(textDiv);
        entryEl.appendChild(eventEl);
      });

      container.appendChild(entryEl);
    });
  },

  // Get all event elements for IntersectionObserver
  getEventElements() {
    return document.querySelectorAll('.event-block');
  },

  // 渲染一行内容：处理空格保留 + 注解链接
  _renderLineContent(text, entryIndex, eventIndex, preserveSpaces) {
    let escaped = this._escapeHtml(text);
    if (preserveSpaces) {
      escaped = this._preserveSpaces(escaped);
    }
    return escaped.replace(/\[\[(.+?)\]\]/g, (match, term) => {
      const key = `${entryIndex}-${eventIndex}-${term}`;
      return `<span class="anno-link" data-key="${key}">${term}</span>`;
    });
  },

  // HTML 转义
  _escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // 保留空格：行首空格转全角 &emsp;，行内连续空格转 &nbsp;
  _preserveSpaces(escapedHtml) {
    // 行首空格：匹配开头连续空格，每两个空格转一个 &emsp;（一个汉字宽）
    // 先处理行首
    let result = escapedHtml.replace(/^(\s+)/, (match, spaces) => {
      // 用 &emsp; 近似全角缩进，每 2 个空格 = 1 个全角
      const count = Math.floor(spaces.length / 2);
      const remainder = spaces.length % 2;
      return '&emsp;'.repeat(count) + '&nbsp;'.repeat(remainder);
    });
    // 行内连续空格（2个及以上）转 &nbsp;
    result = result.replace(/  +/g, (match) => {
      return '&nbsp;'.repeat(match.length);
    });
    return result;
  },

  // Scroll to a specific event
  scrollToEvent(entryIndex, eventIndex) {
    const el = document.getElementById(`event-${entryIndex}-${eventIndex}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  // Scroll to first event of an entry
  scrollToEntry(entryIndex) {
    const el = document.getElementById(`entry-${entryIndex}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },
};
