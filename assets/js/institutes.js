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
      focus: 'Агрономия, растениеводство, лесное хозяйство и защита растений.'
    },
    {
      id: 'animal-vet',
      name: 'Институт науки о животных и ветеринарии',
      short: 'ИНЖВ',
      focus: 'Ветеринарная медицина, животноводство и технологии производства продукции животноводства.'
    },
    {
      id: 'engineering-food',
      name: 'Институт инжиниринга и пищевых технологий',
      short: 'ИИПТ',
      focus: 'Технологические машины и оборудование, пищевые технологии, стандартизация и сертификация.'
    },
    {
      id: 'energy',
      name: 'Институт энергетики',
      short: 'ИЭ',
      focus: 'Электро- и теплоэнергетика, энергосистемы и возобновляемые источники энергии.'
    },
    {
      id: 'land-architecture',
      name: 'Институт земельных ресурсов и архитектуры',
      short: 'ИЗРА',
      focus: 'Землеустройство, кадастр, архитектура и водные ресурсы.'
    },
    {
      id: 'business-digital',
      name: 'Институт бизнеса и цифровых технологий',
      short: 'ИБЦТ',
      focus: 'Информационные системы, экономика, учёт и цифровое управление.'
    },
    {
      id: 'humanities',
      name: 'Институт гуманитарных и педагогических наук',
      short: 'ИГПН',
      focus: 'Педагогика, психология и иностранные языки.'
    }
  ];

  window.KAZATU_INSTITUTES = INSTITUTES;

  function renderList() {
    var list = document.getElementById('instituteList');
    if (!list) {
      return;
    }
    list.innerHTML = INSTITUTES.map(function (inst, index) {
      var num = String(index + 1).padStart(2, '0');
      return (
        '<div class="institute-row">' +
        '<span class="institute-row__num" aria-hidden="true">' + num + '</span>' +
        '<span class="institute-row__title"><a href="institute.html?id=' + inst.id + '">' + inst.name + '</a></span>' +
        '</div>'
      );
    }).join('');
  }

  function renderPrograms(instituteName) {
    var host = document.getElementById('instituteProgramsList');
    var countEl = document.getElementById('instituteProgramsCount');
    if (!host) {
      return;
    }
    var programs = (window.KAZATU_PLACEHOLDER_PROGRAMS || []).filter(function (p) {
      return p.institute === instituteName;
    });
    var levelLabels = window.KAZATU_LEVEL_LABELS || {};
    var levelOrder = ['bachelor', 'master', 'doctorate'];

    if (countEl) {
      countEl.textContent = programs.length
        ? 'Образовательных программ в демонстрационном каталоге: ' + programs.length
        : 'В демонстрационном каталоге пока нет программ этого института.';
    }

    host.innerHTML = levelOrder.map(function (level) {
      var group = programs.filter(function (p) { return p.level === level; });
      if (!group.length) {
        return '';
      }
      var cards = group.map(function (p) {
        return (
          '<article class="card">' +
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
    });
    document.querySelectorAll('[data-field="short"]').forEach(function (el) {
      el.textContent = institute.short;
    });
    document.querySelectorAll('[data-field="focus"]').forEach(function (el) {
      el.textContent = institute.focus;
    });

    renderPrograms(institute.name);
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
