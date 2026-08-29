/**
 * config.js — 全局配置变量
 * 所有可调参数集中在此，方便微调阶段修改
 */
window.Chronicle = window.Chronicle || {};
Chronicle.Config = {

  // ========== 雨丝参数 ==========
  rain: {
    // 远景细线
    farMinW: 3,
    farMaxW: 6,
    farMinH: 150,
    farMaxH: 250,
    farMinSpeed: 1.2,
    farMaxSpeed: 2.8,
    farCreateGap: 1000,        // ms 生成间隔
    farColor: 'rgba(255, 255, 255, 0.35)',

    // 近景粗线
    nearMinW: 10,
    nearMaxW: 14,
    nearMinH: 250,
    nearMaxH: 300,
    nearMinSpeed: 6,
    nearMaxSpeed: 8,
    nearCreateGap: 2500,
    nearColor: 'rgba(255, 255, 255, 0.12)',
  },

  // ========== 视差参数 ==========
  parallax: {
    bg: 0.02,           // 底层背景位移系数
    farLine: 0.06,      // 远景雨丝位移系数
    nearLine: 0.15,     // 近景雨丝位移系数
  },

  // ========== 时间轴参数 ==========
  timeline: {
    itemSpacing: 200,          // 年份条目间距 (px)
    numberFontSize: '1.125rem',
    numberColor: 'rgba(255, 255, 255, 0.35)',
    numberHoverColor: 'rgba(255, 255, 255, 0.7)',
    numberFocusColor: '#ffffff',
    numberFocusShadow: '0 0 12px rgba(255, 255, 255, 0.4)',
    lineColor: 'rgba(255, 255, 255, 0.12)',
    lineWidth: '1px',
    width: '15vw',            // 时间轴占窗口宽度
    // 浮动动画参数（移植自 2.1时间轴本轴.html）
    floatAmpMin: 5,            // 浮动振幅最小值 (px)
    floatAmpMax: 12,           // 浮动振幅最大值 (px)
    floatFreqMin: 0.15,       // 浮动频率最小值 (弧度/秒)
    floatFreqMax: 0.45,       // 浮动频率最大值 (弧度/秒)
  },

  // ========== 背景参数 ==========
  background: {
    transitionDuration: 1000,   // ms 旧图淡出时长
    crossfadeDelay: 600,      // ms 新图淡入时长（旧图在此期间保持显示，之后开始淡出）
    glassBlur: 6,              // px 毛玻璃模糊
    glassBg: 'rgba(0, 0, 0, 0.5)',  // 暗色调遮罩，确保浅色背景图上文字可见
    defaultBgColor: 'linear-gradient(135deg, #0a0a0a, #1a1a2e)',
  },

  // ========== 正文参数 ==========
  text: {
    contentWidth: '70vw',       // 正文区域宽度 (.content)
    fontSize: '16px',            // 正文字号
    lineHeight: 1.85,            // 正文行高
    paragraphSpacing: '1.2rem',  // 段间距
    entrySpacing: '12rem',          // 年与年之间的间距 (.entry-block)
    eventSpacing: '5rem',          // 事件之间的间距 (.event-block)

    // 大标题 (entry-title, h2)
    headingFontSize: '3rem',
    headingColor: '#ffffff',
    headingShadow: '0 1px 4px rgba(0, 0, 0, 0.7)',
    headingStroke: 'none',           // 描边, 例: '1px rgba(0,0,0,0.5)' 或 'none'

    // 事件标题 (event-title, h3)
    eventTitleFontSize: '1.75rem',
    eventTitleColor: '#ffffff',
    eventTitleShadow: '0 1px 4px rgba(0, 0, 0, 0.7)',
    eventTitleStroke: 'none',

    // 正文文字 (event-text)
    bodyColor: '#ffffff',
    bodyShadow: '1 1px 5px rgb(15, 222, 36)',
    bodyStroke: 'none',

    // 次要文字
    mutedColor: 'rgba(255, 255, 255, 0.4)',

    // 文字底衬（每行文字背后的半透明色块，增强对比度）
    highlightEnabled: true,          // 是否启用底衬
    highlightBg: 'rgba(0, 0, 0, 0.35)',   // 底衬背景色（含透明度）
    highlightPadding: '2px 10px',    // 底衬内边距（上下 左右）
    highlightRadius: '4px',          // 底衬圆角

    // 排版细节
    preserveSpaces: true,            // 保留行首/行内多空格（行首转全角空格）
    brTag: '[[br]]',                 // 手动额外空行标记

    // 引用段落（blockquote）
    blockquote: {
      borderColor: 'rgba(255, 255, 255, 0.3)',  // 左边框颜色
      highlightBg: 'rgba(0, 0, 0, 0.25)',       // 文字底衬（比正文淡一点）
      italic: true,                              // 是否斜体
      opacity: 0.9,                              // 整体透明度
      leftPad: '1.5rem',                         // 左侧缩进
    },
  },

  // ========== 焦点参数 ==========
  focus: {
    rootMarginTop: '-40%',     // 视口上边距缩进
    rootMarginBottom: '-40%',  // 视口下边距缩进
    debounceMs: 150,           // 滚动防抖时间
  },

  // ========== 注解参数 ==========
  annotation: {
    panelWidth: 'clamp(300px, 25vw, 500px)',  // 面板宽度
    panelMaxHeight: '80vh',                     // 面板最大高度
    panelBg: 'rgba(255, 255, 255, 0.3',       // 面板背景色（含透明度）
    panelBlur: 10,                              // 面板毛玻璃模糊 px
    panelMarginRight: '2rem',                   // 面板距右边缘
    panelTitleColor: '#1a1a1a',                 // 面板标题文字色
    panelTextColor: '#000000',                  // 面板正文文字色
    panelTextShadow: 'none', // 面板文字白色阴影（防鲜艳背景图）
    cornerColor: 'rgba(255, 255, 255, 0.58)',   // 四角虚线颜色
    cornerSize: 20,                             // 四角线段长度 px
    cornerInset: 8,                             // 四角距面板边缘 px
    linkColor: '#4dabf7',                       // 注链颜色
    linkHoverColor: '#74c0fc',                  // 注链悬浮高亮色
  },
};
