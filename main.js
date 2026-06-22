/* ═══════════════════════════════════════════════════
   PORTFOLIO — main.js
   Efeito de scroll da imagem pelo movimento do mouse
   dentro da viewport do projeto.
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /**
   * Para cada viewport de projeto, o movimento vertical do mouse
   * dentro da janela controla a posição Y da imagem longa.
   * mouseY 0%   → imagem no topo
   * mouseY 100% → imagem no fundo
   */
  function initViewports() {
    const viewports = document.querySelectorAll('.project-viewport');

    viewports.forEach(function (viewport) {
      const inner      = viewport.querySelector('[data-viewport]');
      const screenshot = viewport.querySelector('[data-screenshot]');
      const cursor     = createCursor(viewport);

      let rafId        = null;
      let targetY      = 0;
      let currentY     = 0;
      let isInside     = false;

      // ── Aguarda a imagem carregar para saber a altura real ──
      function getScrollRange() {
        const viewH  = viewport.clientHeight;
        const imgH   = screenshot.naturalHeight
                       ? (screenshot.naturalWidth > 0
                          ? (screenshot.naturalHeight / screenshot.naturalWidth) * viewport.clientWidth
                          : inner.scrollHeight)
                       : inner.scrollHeight;
        return Math.max(0, imgH - viewH);
      }

      // ── Mouse entra na viewport ──
      viewport.addEventListener('mouseenter', function () {
        isInside = true;
        viewport.classList.add('active');
        startLoop();
      });

      // ── Mouse sai da viewport ──
      viewport.addEventListener('mouseleave', function () {
        isInside = false;
        viewport.classList.remove('active');
        // suaviza o retorno ao topo
        targetY = 0;
      });

      // ── Posição do mouse dentro da viewport ──
      viewport.addEventListener('mousemove', function (e) {
        const rect     = viewport.getBoundingClientRect();
        const relY     = e.clientY - rect.top;
        const ratio    = Math.max(0, Math.min(1, relY / rect.height));
        const range    = getScrollRange();

        targetY = ratio * range;

        // mover cursor personalizado
        cursor.style.left = (e.clientX - rect.left) + 'px';
        cursor.style.top  = (e.clientY - rect.top)  + 'px';
      });

      // ── Loop de animação suave (lerp) ──
      function startLoop() {
        if (rafId) return;
        rafId = requestAnimationFrame(tick);
      }

      function tick() {
        // interpolação suave entre posição atual e alvo
        currentY += (targetY - currentY) * 0.1;

        inner.style.transform = 'translateY(' + (-currentY).toFixed(2) + 'px)';

        // continua o loop se ainda está dentro ou ainda a animar
        if (isInside || Math.abs(targetY - currentY) > 0.5) {
          rafId = requestAnimationFrame(tick);
        } else {
          // garante posição final exacta
          inner.style.transform = 'translateY(' + (-targetY).toFixed(2) + 'px)';
          rafId = null;
        }
      }
    });
  }

  /**
   * Cria o cursor circular que segue o rato dentro da viewport.
   */
  function createCursor(viewport) {
    const el = document.createElement('div');
    el.className = 'viewport-cursor';
    viewport.appendChild(el);
    return el;
  }

  // ── Inicializar quando o DOM estiver pronto ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initViewports);
  } else {
    initViewports();
  }

})();
