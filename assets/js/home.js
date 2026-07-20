/*
  home.js
  Homepage-only interaction: switches between the "Новости" and
  "Объявления" panels. Reuses the same aria-pressed toggle-group pattern
  already established by programs.js's filter tabs, applied to a pair of
  content panels instead of a filtered list.
*/

(function () {
  'use strict';

  function initNewsTabs() {
    var tabs = document.getElementById('newsEventsTabs');
    if (!tabs) {
      return;
    }

    var panels = document.querySelectorAll('[data-tab-panel]');

    function show(target) {
      panels.forEach(function (panel) {
        panel.hidden = panel.getAttribute('data-tab-panel') !== target;
      });
      tabs.querySelectorAll('.filter-tabs__btn').forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(btn.getAttribute('data-tab') === target));
      });
    }

    tabs.addEventListener('click', function (event) {
      var btn = event.target.closest('.filter-tabs__btn');
      if (!btn) {
        return;
      }
      show(btn.getAttribute('data-tab'));
    });
  }

  function init() {
    initNewsTabs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
