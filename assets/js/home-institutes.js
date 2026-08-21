(function () {
  'use strict';

  var filters = document.querySelectorAll('[data-institute-filter]');
  var cards = document.querySelectorAll('[data-institute-category]');

  if (!filters.length || !cards.length) {
    return;
  }

  var icons = [
    '<svg viewBox="0 0 24 24"><path d="M12 21V10M12 14C8 14 5 11 5 7c4 0 7 3 7 7ZM12 10c0-4 3-7 7-7 0 4-3 7-7 7Z"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M7 9c-1.5-3-4-3-4-1 0 1.5 1 3 2.5 4M17 9c1.5-3 4-3 4-1 0 1.5-1 3-2.5 4M8 12c0-3 1.5-5 4-5s4 2 4 5c0 3-1 6-4 6s-4-3-4-6Z"/></svg>',
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="m19 12 2-1.5-2-3-2 1-2-1V5h-4v2.5l-2 1-2-1-2 3L7 12l-2 1.5 2 3 2-1 2 1V19h4v-2.5l2-1 2 1 2-3-2-1.5Z"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="m13 2-7 12h6l-1 8 7-12h-6l1-8Z"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M4 21V9l8-6 8 6v12M9 21v-7h6v7M2 21h20"/></svg>',
    '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4M7 8h.01M10 8h4"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M4 5.5A3.5 3.5 0 0 1 7.5 4H12v15H7.5A3.5 3.5 0 0 0 4 20.5v-15ZM20 5.5A3.5 3.5 0 0 0 16.5 4H12v15h4.5a3.5 3.5 0 0 1 3.5 1.5v-15Z"/></svg>'
  ];

  cards.forEach(function (card, index) {
    var content = card.querySelector('.institute-showcase-card__content');
    if (content && icons[index]) {
      content.insertAdjacentHTML('afterbegin', '<span class="institute-showcase-card__icon" aria-hidden="true">' + icons[index] + '</span>');
    }
  });

  filters.forEach(function (filter) {
    filter.addEventListener('click', function () {
      var category = filter.getAttribute('data-institute-filter');

      filters.forEach(function (button) {
        var isSelected = button === filter;
        button.classList.toggle('is-active', isSelected);
        button.setAttribute('aria-pressed', String(isSelected));
      });

      cards.forEach(function (card) {
        var matches = category === 'all' || card.getAttribute('data-institute-category') === category || card.getAttribute('data-institute-category') === 'all';
        card.classList.toggle('is-filtered-out', !matches);
      });
    });
  });
}());
