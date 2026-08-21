/*
  institutes.js
  Data for the seven real KazATU institutes + rendering for institutes.html
  (list) and institute.html (detail, via ?id=). Leadership, department and
  teacher rosters are not publicly confirmed yet, so those sections render
  an honest "official data pending" notice instead of invented names.
*/

(function () {
  'use strict';

  var INSTITUTES = [
    {
      id: 'agro-forestry',
      name: 'Институт сельского и лесного хозяйства',
      short: 'ИСЛХ',
      focus: 'Агрономия, растениеводство, лесное хозяйство и защита растений.',
      newsTag: 'agriculture',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V10M12 14C8 14 5 11 5 7c4 0 7 3 7 7ZM12 10c0-4 3-7 7-7 0 4-3 7-7 7Z"/></svg>'
    },
    {
      id: 'animal-vet',
      name: 'Институт науки о животных и ветеринарии',
      short: 'ИНЖВ',
      focus: 'Ветеринарная медицина, животноводство и технологии производства продукции животноводства.',
      newsTag: 'animal-vet',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><path d="M7 9c-1.5-3-4-3-4-1 0 1.5 1 3 2.5 4M17 9c1.5-3 4-3 4-1 0 1.5-1 3-2.5 4M8 12c0-3 1.5-5 4-5s4 2 4 5c0 3-1 6-4 6s-4-3-4-6ZM12 18v3M9 21h6"/></svg>'
    },
    {
      id: 'engineering-food',
      name: 'Институт инжиниринга и пищевых технологий',
      short: 'ИИПТ',
      focus: 'Технологические машины и оборудование, пищевые технологии, стандартизация и сертификация.',
      newsTag: 'engineering-food',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="m19 12 2-1.5-2-3-2 1-2-1V5h-4v2.5l-2 1-2-1-2 3L7 12l-2 1.5 2 3 2-1 2 1V19h4v-2.5l2-1 2 1 2-3-2-1.5Z"/></svg>'
    },
    {
      id: 'energy',
      name: 'Институт энергетики',
      short: 'ИЭ',
      focus: 'Электро- и теплоэнергетика, энергосистемы и возобновляемые источники энергии.',
      newsTag: 'energy',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><path d="m13 2-7 12h6l-1 8 7-12h-6l1-8Z"/></svg>'
    },
    {
      id: 'land-architecture',
      name: 'Институт земельных ресурсов и архитектуры',
      short: 'ИЗРА',
      focus: 'Землеустройство, кадастр, архитектура и водные ресурсы.',
      newsTag: 'land-architecture',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V9l8-6 8 6v12M9 21v-7h6v7M2 21h20M8 9h.01M12 9h.01M16 9h.01"/></svg>'
    },
    {
      id: 'business-digital',
      name: 'Институт бизнеса и цифровых технологий',
      short: 'ИБЦТ',
      focus: 'Информационные системы, экономика, учёт и цифровое управление.',
      newsTag: 'business-digital',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4M7 8h.01M10 8h4M7 12h7"/></svg>'
    },
    {
      id: 'humanities',
      name: 'Институт гуманитарных и педагогических наук',
      short: 'ИГПН',
      focus: 'Педагогика, психология и иностранные языки.',
      newsTag: 'humanities',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A3.5 3.5 0 0 1 7.5 4H12v15H7.5A3.5 3.5 0 0 0 4 20.5v-15ZM20 5.5A3.5 3.5 0 0 0 16.5 4H12v15h4.5a3.5 3.5 0 0 1 3.5 1.5v-15Z"/></svg>'
    }
  ];

  window.KAZATU_INSTITUTES = INSTITUTES;

  var NEWS_TAG_LABELS = {
    agriculture: 'Сельское хозяйство',
    international: 'Международное сотрудничество',
    'land-architecture': 'Водные ресурсы',
    humanities: 'Гуманитарные науки',
    'animal-vet': 'Ветеринария',
    'engineering-food': 'Инжиниринг и технологии',
    energy: 'Энергетика',
    'business-digital': 'Цифровые технологии'
  };

  function renderList() {
    var list = document.getElementById('instituteList');
    if (!list) {
      return;
    }
    list.className = 'institute-directory';
    list.innerHTML = INSTITUTES.map(function (inst) {
      return (
        '<article class="institute-directory__card">' +
        '<span class="institute-directory__icon" aria-hidden="true">' + inst.icon + '</span>' +
        '<h2 class="institute-directory__title"><a href="institute.html?id=' + inst.id + '">' + inst.name + '</a></h2>' +
        '<p class="institute-directory__focus">' + inst.focus + '</p>' +
        '<a class="institute-directory__link" href="institute.html?id=' + inst.id + '">Страница института</a>' +
        '</article>'
      );
    }).join('');
  }

  function renderPrograms(institute) {
    var host = document.getElementById('instituteProgramsList');
    var countEl = document.getElementById('instituteProgramsCount');
    if (!host) {
      return;
    }
    var programs = (window.KAZATU_PLACEHOLDER_PROGRAMS || []).filter(function (p) {
      return p.institute === institute.name;
    });
    var levelLabels = window.KAZATU_LEVEL_LABELS || {};
    var levelOrder = ['bachelor', 'master', 'doctorate'];

    if (countEl) {
      countEl.textContent = programs.length
        ? 'Образовательных программ: ' + programs.length
        : 'Образовательные программы не найдены.';
    }

    host.innerHTML = levelOrder.map(function (level) {
      var group = programs.filter(function (p) { return p.level === level; });
      if (!group.length) {
        return '';
      }
      var cards = group.map(function (p) {
        return (
          '<article class="card institute-program-card">' +
          '<span class="institute-program-card__icon" aria-hidden="true">' + institute.icon + '</span>' +
          '<p class="card__eyebrow">' + p.field + '</p>' +
          '<h3 class="card__title"><a href="program.html?id=' + p.id + '">' + p.title + '</a></h3>' +
          '<p class="card__body">Код: ' + p.code + '</p>' +
          '</article>'
        );
      }).join('');
      return (
        '<div class="result-group">' +
        '<h3 class="result-group__heading">' + (levelLabels[level] || level) + '</h3>' +
        '<div class="card-grid">' + cards + '</div>' +
        '</div>'
      );
    }).join('');
  }

  function formatNewsDate(iso) {
    return new Date(iso + 'T00:00:00').toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  function renderInstituteNews(institute) {
    var host = document.getElementById('instituteNewsList');
    var intro = document.getElementById('instituteNewsIntro');
    if (!host) return;
    var items = (window.KAZATU_NEWS_ITEMS || []).filter(function (item) {
      return item.tags && item.tags.indexOf(institute.newsTag) !== -1;
    }).slice(0, 3);
    if (intro) {
      intro.textContent = items.length
        ? 'Материалы из общей ленты, отмеченные тематикой «' + institute.focus.split(',')[0].toLowerCase() + '».'
        : 'Новые материалы по тематике института появятся здесь после публикации в общей ленте новостей.';
    }
    host.innerHTML = items.map(function (item) {
      var link = item.href || ('news-detail.html?id=' + item.id);
      var target = item.href ? ' target="_blank" rel="noopener noreferrer"' : '';
      var media = item.image ? '<div class="card__media"><img src="' + item.image + '" alt="" loading="lazy" width="640" height="480"></div>' : '';
      var tags = (item.tags || []).map(function (tag) {
        return '<span class="news-tag">' + (NEWS_TAG_LABELS[tag] || tag) + '</span>';
      }).join('');
      return '<article class="card institute-news-card">' + media +
        '<div class="news-tags">' + tags + '</div>' +
        '<p class="card__meta"><time datetime="' + item.date + '">' + formatNewsDate(item.date) + '</time></p>' +
        '<h3 class="card__title"><a href="' + link + '"' + target + '>' + item.title + '</a></h3></article>';
    }).join('');
  }

  function renderDetail() {
    var root = document.getElementById('instituteDetail');
    if (!root) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    var institute = INSTITUTES.filter(function (i) {
      return i.id === id;
    })[0] || INSTITUTES[0];

    document.title = institute.name + ' — институт КазАТУ';

    document.querySelectorAll('[data-field="name"]').forEach(function (el) {
      el.textContent = institute.name;
      if (el.getAttribute('aria-current') === 'page') {
        el.title = institute.name;
      }
    });
    document.querySelectorAll('[data-field="short"]').forEach(function (el) {
      el.textContent = institute.short;
    });
    document.querySelectorAll('[data-field="focus"]').forEach(function (el) {
      el.textContent = institute.focus;
    });
    document.querySelectorAll('[data-field="icon"]').forEach(function (el) {
      el.innerHTML = institute.icon;
    });

    renderPrograms(institute);
    renderInstituteNews(institute);
  }

  function init() {
    renderList();
    renderDetail();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
