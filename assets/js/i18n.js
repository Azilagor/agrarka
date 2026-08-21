/*
  i18n.js
  Stage-1 scaffold for KZ / RU / EN. Translates selected chrome strings
  (search placeholder, footer headings, skip link) via
  [data-i18n] / [data-i18n-placeholder] attributes. Page article content
  is authored in Russian for now and is intentionally out of scope until
  the full content pass — see README note in the final summary.
*/

(function () {
  'use strict';

  var STORAGE_KEY = 'kazatu.lang';
  var DEFAULT_LANG = 'ru';

  var DICTIONARY = {
    'nav.home': { kz: 'Басты бет', ru: 'Главная', en: 'Home' },
    'nav.admissions': { kz: 'Түсу', ru: 'Поступление', en: 'Admissions' },
    'nav.education': { kz: 'Білім беру', ru: 'Образование', en: 'Education' },
    'nav.institutes': { kz: 'Институттар', ru: 'Институты', en: 'Institutes' },
    'nav.science': { kz: 'Ғылым', ru: 'Наука', en: 'Science' },
    'nav.students': { kz: 'Студенттерге', ru: 'Студентам', en: 'Students' },
    'nav.international': {
      kz: 'Халықаралық ынтымақтастық',
      ru: 'Международное сотрудничество',
      en: 'International Cooperation'
    },
    'nav.news': { kz: 'Жаңалықтар', ru: 'Новости', en: 'News' },
    'nav.about': { kz: 'Университет туралы', ru: 'Об университете', en: 'About the University' },
    'nav.contacts': { kz: 'Байланыс', ru: 'Контакты', en: 'Contacts' },
    'search.placeholder': {
      kz: 'Сайттан іздеу…',
      ru: 'Поиск по сайту…',
      en: 'Search the site…'
    },
    'skip.link': { kz: 'Мазмұнға өту', ru: 'Перейти к содержимому', en: 'Skip to content' },
    'platonus.label': { kz: 'Platonus (АЖО)', ru: 'Platonus (АИС)', en: 'Platonus (LMS)' }
  };

  function getLang() {
    return window.localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }

  function applyLang(lang) {
    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var entry = DICTIONARY[key];
      if (entry && entry[lang]) {
        el.textContent = entry[lang];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      var entry = DICTIONARY[key];
      if (entry && entry[lang]) {
        el.setAttribute('placeholder', entry[lang]);
      }
    });

    document.querySelectorAll('.lang-switch__btn').forEach(function (btn) {
      var isActive = btn.getAttribute('data-lang') === lang;
      btn.setAttribute('aria-pressed', String(isActive));
    });
  }

  function wireLangSwitch() {
    document.querySelectorAll('.lang-switch__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = btn.getAttribute('data-lang');
        window.localStorage.setItem(STORAGE_KEY, lang);
        applyLang(lang);
      });
    });
  }

  function decorateSearchInput() {
    var input = document.getElementById('globalSearch');
    if (input && !input.hasAttribute('data-i18n-placeholder')) {
      input.setAttribute('data-i18n-placeholder', 'search.placeholder');
    }
  }

  function init() {
    decorateSearchInput();
    wireLangSwitch();
    applyLang(getLang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.I18n = { init: init, applyLang: applyLang, getLang: getLang };
})();
