/*
  programs.js
  Data + filtering UX for programs.html (search, level, institute, language,
  field/direction, results count, reset) and the detail lookup for
  program.html. PLACEHOLDER_PROGRAMS is a sample catalog covering all seven
  real KazATU institutes — TODO: replace with the official program catalog
  once it is provided (see README.md). Discipline/career text is composed
  generically per field of study and explicitly labeled as illustrative.
*/

(function () {
  'use strict';

  var LEVEL_LABELS = { bachelor: 'Бакалавриат', master: 'Магистратура', doctorate: 'Докторантура' };
  var LEVEL_DURATION = {
    bachelor: '4 года (очная форма, ГОСО РК)',
    master: '1–2 года (ГОСО РК, в зависимости от вида программы)',
    doctorate: '3 года (ГОСО РК)'
  };
  var LANGUAGE_LABELS = { kz: 'қазақша', ru: 'русский', en: 'English' };

  var PLACEHOLDER_PROGRAMS = [
    { id: 'agronomy-b', title: 'Агрономия', level: 'bachelor', institute: 'Институт сельского и лесного хозяйства', code: '6B08101', language: 'ru', field: 'Сельское и лесное хозяйство' },
    { id: 'forestry-b', title: 'Лесные ресурсы и лесоустройство', level: 'bachelor', institute: 'Институт сельского и лесного хозяйства', code: '6B08102', language: 'kz', field: 'Сельское и лесное хозяйство' },
    { id: 'agronomy-m', title: 'Агрономия', level: 'master', institute: 'Институт сельского и лесного хозяйства', code: '7M08101', language: 'ru', field: 'Сельское и лесное хозяйство' },

    { id: 'vet-b', title: 'Ветеринарная медицина', level: 'bachelor', institute: 'Институт науки о животных и ветеринарии', code: '6B10101', language: 'ru', field: 'Ветеринария и животноводство' },
    { id: 'animal-tech-b', title: 'Технология производства продуктов животноводства', level: 'bachelor', institute: 'Институт науки о животных и ветеринарии', code: '6B08103', language: 'kz', field: 'Ветеринария и животноводство' },
    { id: 'vet-sanit-m', title: 'Ветеринарная санитария', level: 'master', institute: 'Институт науки о животных и ветеринарии', code: '7M10101', language: 'ru', field: 'Ветеринария и животноводство' },

    { id: 'tech-machines-b', title: 'Технологические машины и оборудование', level: 'bachelor', institute: 'Институт инжиниринга и пищевых технологий', code: '6B07101', language: 'ru', field: 'Инжиниринг и пищевые технологии' },
    { id: 'food-tech-b', title: 'Технология продовольственных продуктов', level: 'bachelor', institute: 'Институт инжиниринга и пищевых технологий', code: '6B07102', language: 'kz', field: 'Инжиниринг и пищевые технологии' },
    { id: 'standardization-m', title: 'Стандартизация и сертификация', level: 'master', institute: 'Институт инжиниринга и пищевых технологий', code: '7M07101', language: 'ru', field: 'Инжиниринг и пищевые технологии' },

    { id: 'electro-b', title: 'Электроэнергетика', level: 'bachelor', institute: 'Институт энергетики', code: '6B07103', language: 'ru', field: 'Энергетика' },
    { id: 'thermal-b', title: 'Теплоэнергетика', level: 'bachelor', institute: 'Институт энергетики', code: '6B07104', language: 'kz', field: 'Энергетика' },
    { id: 'energy-d', title: 'Энергетика', level: 'doctorate', institute: 'Институт энергетики', code: '8D07101', language: 'ru', field: 'Энергетика' },

    { id: 'land-b', title: 'Землеустройство', level: 'bachelor', institute: 'Институт земельных ресурсов и архитектуры', code: '6B07105', language: 'ru', field: 'Земельные ресурсы и архитектура' },
    { id: 'architecture-b', title: 'Архитектура', level: 'bachelor', institute: 'Институт земельных ресурсов и архитектуры', code: '6B04201', language: 'ru', field: 'Земельные ресурсы и архитектура' },
    { id: 'water-m', title: 'Водные ресурсы и водопользование', level: 'master', institute: 'Институт земельных ресурсов и архитектуры', code: '7M08102', language: 'ru', field: 'Земельные ресурсы и архитектура' },

    { id: 'is-b', title: 'Информационные системы', level: 'bachelor', institute: 'Институт бизнеса и цифровых технологий', code: '6B06101', language: 'ru', field: 'Бизнес и цифровые технологии' },
    { id: 'economics-b', title: 'Экономика', level: 'bachelor', institute: 'Институт бизнеса и цифровых технологий', code: '6B04101', language: 'kz', field: 'Бизнес и цифровые технологии' },
    { id: 'accounting-b', title: 'Учёт и аудит', level: 'bachelor', institute: 'Институт бизнеса и цифровых технологий', code: '6B04102', language: 'en', field: 'Бизнес и цифровые технологии' },
    { id: 'is-m', title: 'Информационные системы', level: 'master', institute: 'Институт бизнеса и цифровых технологий', code: '7M06101', language: 'ru', field: 'Бизнес и цифровые технологии' },
    { id: 'is-d', title: 'Информационные системы', level: 'doctorate', institute: 'Институт бизнеса и цифровых технологий', code: '8D06101', language: 'ru', field: 'Бизнес и цифровые технологии' },

    { id: 'languages-b', title: 'Иностранный язык: два иностранных языка', level: 'bachelor', institute: 'Институт гуманитарных и педагогических наук', code: '6B01701', language: 'en', field: 'Гуманитарные и педагогические науки' },
    { id: 'pedagogy-b', title: 'Педагогика и психология', level: 'bachelor', institute: 'Институт гуманитарных и педагогических наук', code: '6B01101', language: 'kz', field: 'Гуманитарные и педагогические науки' },
    { id: 'vocational-m', title: 'Профессиональное обучение', level: 'master', institute: 'Институт гуманитарных и педагогических наук', code: '7M01101', language: 'ru', field: 'Гуманитарные и педагогические науки' }
  ];

  var FIELD_DISCIPLINES = {
    'Сельское и лесное хозяйство': ['Почвоведение', 'Растениеводство', 'Земледелие и мелиорация', 'Лесоводство', 'Защита растений'],
    'Ветеринария и животноводство': ['Анатомия животных', 'Физиология сельскохозяйственных животных', 'Ветеринарная фармакология', 'Кормление животных', 'Эпизоотология'],
    'Инжиниринг и пищевые технологии': ['Процессы и аппараты пищевых производств', 'Технологическое оборудование', 'Стандартизация и метрология', 'Микробиология', 'Управление качеством'],
    'Энергетика': ['Электротехника', 'Теплотехника', 'Электрические станции и сети', 'Возобновляемые источники энергии', 'Автоматизация энергосистем'],
    'Земельные ресурсы и архитектура': ['Геодезия', 'Кадастр и мониторинг земель', 'Архитектурное проектирование', 'Градостроительство', 'ГИС-технологии'],
    'Бизнес и цифровые технологии': ['Базы данных', 'Программная инженерия', 'Экономическая теория', 'Финансовый учёт', 'Бизнес-аналитика'],
    'Гуманитарные и педагогические науки': ['Педагогика', 'Психология', 'Практический иностранный язык', 'Методика преподавания', 'Межкультурная коммуникация']
  };

  var FIELD_CAREERS = {
    'Сельское и лесное хозяйство': 'Агрономические и лесохозяйственные предприятия, фермерские хозяйства, научно-исследовательские институты, органы АПК.',
    'Ветеринария и животноводство': 'Ветеринарные клиники и лаборатории, животноводческие комплексы, органы ветеринарного контроля.',
    'Инжиниринг и пищевые технологии': 'Пищевые и перерабатывающие предприятия, инжиниринговые компании, лаборатории контроля качества.',
    'Энергетика': 'Энергетические компании, электростанции и сети, промышленные предприятия, проектные организации.',
    'Земельные ресурсы и архитектура': 'Кадастровые и геодезические организации, архитектурные бюро, органы земельных отношений.',
    'Бизнес и цифровые технологии': 'IT-компании, финансовые и консалтинговые организации, государственные и цифровые сервисы.',
    'Гуманитарные и педагогические науки': 'Образовательные организации, языковые центры, переводческая и методическая работа.'
  };

  window.KAZATU_PLACEHOLDER_PROGRAMS = PLACEHOLDER_PROGRAMS;
  window.KAZATU_LEVEL_LABELS = LEVEL_LABELS;

  function renderCard(program) {
    var card = document.createElement('article');
    card.className = 'card';
    card.innerHTML =
      '<p class="card__eyebrow">' + program.institute + '</p>' +
      '<h3 class="card__title"><a href="program.html?id=' + program.id + '">' + program.title + '</a></h3>' +
      '<p class="card__body">Код: ' + program.code + ' · Направление: ' + program.field + '</p>' +
      '<p class="card__meta">' +
      '<span class="badge badge--accent">' + LEVEL_LABELS[program.level] + '</span>' +
      '<span class="badge">' + LANGUAGE_LABELS[program.language] + '</span>' +
      '</p>';
    return card;
  }

  function populateSelect(select, values, allLabel) {
    if (!select) {
      return;
    }
    var options = ['<option value="all">' + allLabel + '</option>'];
    values.forEach(function (value) {
      var label = LANGUAGE_LABELS[value] || value;
      options.push('<option value="' + value + '">' + label + '</option>');
    });
    select.innerHTML = options.join('');
  }

  function initFilters() {
    var grid = document.getElementById('programResults');
    var tabs = document.getElementById('programFilterTabs');
    var searchInput = document.getElementById('programSearch');
    var instituteSelect = document.getElementById('programInstitute');
    var languageSelect = document.getElementById('programLanguage');
    var fieldSelect = document.getElementById('programField');
    var resetBtn = document.getElementById('programFilterReset');
    var emptyState = document.getElementById('programEmptyState');
    var countEl = document.getElementById('programResultsCount');
    if (!grid || !tabs) {
      return;
    }

    var institutes = Array.from(new Set(PLACEHOLDER_PROGRAMS.map(function (p) { return p.institute; }))).sort();
    var fields = Array.from(new Set(PLACEHOLDER_PROGRAMS.map(function (p) { return p.field; }))).sort();
    var languages = Array.from(new Set(PLACEHOLDER_PROGRAMS.map(function (p) { return p.language; })));

    if (instituteSelect) {
      var instOptions = ['<option value="all">Все институты</option>'];
      institutes.forEach(function (inst) {
        instOptions.push('<option value="' + inst + '">' + inst + '</option>');
      });
      instituteSelect.innerHTML = instOptions.join('');
    }
    populateSelect(languageSelect, languages, 'Любой язык');
    if (fieldSelect) {
      var fieldOptions = ['<option value="all">Все направления</option>'];
      fields.forEach(function (field) {
        fieldOptions.push('<option value="' + field + '">' + field + '</option>');
      });
      fieldSelect.innerHTML = fieldOptions.join('');
    }

    var activeLevel = 'all';

    function apply() {
      var query = (searchInput && searchInput.value || '').toLowerCase().trim();
      var institute = instituteSelect ? instituteSelect.value : 'all';
      var language = languageSelect ? languageSelect.value : 'all';
      var field = fieldSelect ? fieldSelect.value : 'all';

      var results = PLACEHOLDER_PROGRAMS.filter(function (program) {
        var matchesLevel = activeLevel === 'all' || program.level === activeLevel;
        var matchesInstitute = institute === 'all' || program.institute === institute;
        var matchesLanguage = language === 'all' || program.language === language;
        var matchesField = field === 'all' || program.field === field;
        var matchesQuery = !query ||
          program.title.toLowerCase().indexOf(query) !== -1 ||
          program.institute.toLowerCase().indexOf(query) !== -1 ||
          program.field.toLowerCase().indexOf(query) !== -1 ||
          program.code.toLowerCase().indexOf(query) !== -1;
        return matchesLevel && matchesInstitute && matchesLanguage && matchesField && matchesQuery;
      });

      grid.innerHTML = '';
      results.forEach(function (program) {
        grid.appendChild(renderCard(program));
      });

      if (emptyState) {
        emptyState.hidden = results.length !== 0;
      }
      if (countEl) {
        countEl.textContent = 'Найдено программ: ' + results.length + ' из ' + PLACEHOLDER_PROGRAMS.length;
      }
    }

    tabs.addEventListener('click', function (event) {
      var btn = event.target.closest('.filter-tabs__btn');
      if (!btn) {
        return;
      }
      tabs.querySelectorAll('.filter-tabs__btn').forEach(function (b) {
        b.setAttribute('aria-pressed', 'false');
      });
      btn.setAttribute('aria-pressed', 'true');
      activeLevel = btn.getAttribute('data-level');
      apply();
    });

    [searchInput, instituteSelect, languageSelect, fieldSelect].forEach(function (control) {
      if (!control) {
        return;
      }
      var evt = control.tagName === 'SELECT' ? 'change' : 'input';
      control.addEventListener(evt, apply);
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        activeLevel = 'all';
        tabs.querySelectorAll('.filter-tabs__btn').forEach(function (b) {
          b.setAttribute('aria-pressed', b.getAttribute('data-level') === 'all' ? 'true' : 'false');
        });
        if (searchInput) searchInput.value = '';
        if (instituteSelect) instituteSelect.value = 'all';
        if (languageSelect) languageSelect.value = 'all';
        if (fieldSelect) fieldSelect.value = 'all';
        apply();
      });
    }

    apply();
  }

  function initDetail() {
    var root = document.getElementById('programDetail');
    if (!root) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    var program = PLACEHOLDER_PROGRAMS.filter(function (p) {
      return p.id === id;
    })[0];

    if (!program) {
      var notFound = document.getElementById('programNotFound');
      if (notFound) {
        notFound.hidden = false;
      }
      root.hidden = true;
      return;
    }

    document.title = program.title + ' — образовательная программа — КазАТУ';

    var setField = function (name, value) {
      document.querySelectorAll('[data-field="' + name + '"]').forEach(function (el) {
        el.textContent = value;
      });
    };

    setField('title', program.title);
    setField('institute', program.institute);
    setField('level', LEVEL_LABELS[program.level]);
    setField('code', program.code);
    setField('language', LANGUAGE_LABELS[program.language]);
    setField('field', program.field);
    setField('duration', LEVEL_DURATION[program.level]);
    setField('description',
      'Программа «' + program.title + '» реализуется на уровне «' + LEVEL_LABELS[program.level] + '» ' +
      'институтом «' + program.institute + '» по направлению «' + program.field + '». ' +
      'Обучение ведётся на языке: ' + LANGUAGE_LABELS[program.language] + '.');

    var instituteLink = document.getElementById('programInstituteLink');
    if (instituteLink) {
      instituteLink.textContent = program.institute;
      var instituteMatch = (window.KAZATU_INSTITUTES || []).filter(function (i) { return i.name === program.institute; })[0];
      if (instituteMatch && instituteLink.tagName === 'A') {
        instituteLink.setAttribute('href', 'institute.html?id=' + instituteMatch.id);
      }
    }

    var disciplinesEl = document.getElementById('programDisciplines');
    if (disciplinesEl) {
      var disciplines = FIELD_DISCIPLINES[program.field] || [];
      disciplinesEl.innerHTML = disciplines.map(function (d) {
        return '<li>' + d + '</li>';
      }).join('');
    }

    var careerEl = document.getElementById('programCareer');
    if (careerEl) {
      careerEl.textContent = FIELD_CAREERS[program.field] || '';
    }
  }

  function init() {
    initFilters();
    initDetail();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
