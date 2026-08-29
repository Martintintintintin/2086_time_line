/**
 * data-loader.js — 数据加载模块
 * fetch content.json + images.json
 */
window.Chronicle = window.Chronicle || {};
Chronicle.DataLoader = {

  async load() {
    const [contentRes, imagesRes, annoRes] = await Promise.all([
      fetch('content.json'),
      fetch('images.json'),
      fetch('annotations.json'),
    ]);

    if (!contentRes.ok) throw new Error(`content.json load failed: ${contentRes.status}`);

    const content = await contentRes.json();

    let images = {};
    try { images = await imagesRes.json(); } catch (e) { /* images.json empty or invalid, skip */ }

    let annotations = {};
    try { annotations = await annoRes.json(); } catch (e) { /* annotations.json not found or invalid, skip */ }

    return { content, images, annotations };
  },
};
