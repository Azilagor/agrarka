/*
  navigation.js
  Builds the entire sidebar (brand, search, accordion nav, language
  switch, Platonus link) once from data and injects it into every page's
  empty `#sidebar-mount`. Also owns the mobile drawer (open/close/Escape/
  overlay/scroll-lock) and the desktop collapse toggle.

  Every page only needs:
    <aside class="sidebar" id="sidebar"><div id="sidebar-mount"></div></aside>
    <div class="app-shell__overlay" id="sidebarOverlay"></div>
    <button id="mobileMenuToggle" class="topbar__menu-btn" aria-controls="sidebar" aria-expanded="false">…</button>
  and sets `data-page="<key>"` on <body> to get the correct active link.
*/

(function () {
  'use strict';

  var NAV_ITEMS = [
    {
      key: 'admissions',
      label: 'Поступление',
      href: 'admissions.html',
      children: [
        { label: 'Бакалавриат', href: 'admissions.html#bachelor' },
        { label: 'Магистратура', href: 'admissions.html#master' },
        { label: 'Докторантура', href: 'admissions.html#doctorate' },
        { label: 'Как поступить', href: 'admissions.html#how-to-apply' }
      ]
    },
    {
      key: 'education',
      label: 'Образование',
      href: 'education.html',
      children: [
        { label: 'Образовательные программы', href: 'programs.html' },
        { label: 'Академическая мобильность', href: 'education.html#mobility' },
        { label: 'Дополнительное образование', href: 'education.html#extra' }
      ]
    },
    {
      key: 'institutes',
      label: 'Институты',
      href: 'institutes.html',
      children: [
        { label: 'Все институты', href: 'institutes.html' },
        { label: 'Кафедры', href: 'institutes.html#departments' }
      ]
    },
    {
      key: 'science',
      label: 'Наука',
      href: 'science.html',
      children: [
        { label: 'Научная деятельность', href: 'science.html#activity' },
        { label: 'Публикации', href: 'science.html#publications' },
        { label: 'Гранты и проекты', href: 'science.html#grants' },
        { label: 'Диссертационные советы', href: 'science.html#councils' }
      ]
    },
    {
      key: 'students',
      label: 'Студентам',
      href: 'students.html',
      children: [
        { label: 'Расписание', href: 'students.html#schedule' },
        { label: 'Общежития', href: 'students.html#dormitory' },
        { label: 'Стипендии', href: 'students.html#scholarships' },
        { label: 'Студенческая жизнь', href: 'students.html#life' }
      ]
    },
    {
      key: 'international',
      label: 'Международное сотрудничество',
      href: 'international.html',
      children: [
        { label: 'Партнёры и соглашения', href: 'international.html#partners' },
        { label: 'Академическая мобильность', href: 'international.html#mobility' }
      ]
    },
    {
      key: 'news',
      label: 'Новости',
      href: 'news.html',
      children: [
        { label: 'Все новости', href: 'news.html' },
        { label: 'Объявления', href: 'news.html#announcements' }
      ]
    },
    {
      key: 'about',
      label: 'Об университете',
      href: 'about.html',
      children: [
        { label: 'Историческая справка', href: 'about.html#history' },
        { label: 'Видение, миссия, стратегия', href: 'about.html#mission' },
        { label: 'Аккредитация', href: 'about.html#accreditation' },
        { label: 'Руководство', href: 'about.html#management' }
      ]
    },
    { key: 'contacts', label: 'Контакты', href: 'contacts.html' }
  ];

  window.KAZATU_NAV_ITEMS = NAV_ITEMS;

  var ICONS = {
    close:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    collapse:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 6h16M4 12h10M4 18h16"/></svg>',
    search:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>',
    chevron:
      '<svg class="nav-list__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>'
  };

  function iconLetters(label) {
    var words = label.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }

  function currentFile() {
    var path = window.location.pathname.split('/').pop();
    return path && path.length ? path : 'index.html';
  }

  function currentPageKey() {
    return document.body.getAttribute('data-page') || '';
  }

  function hrefMatchesCurrent(href, pageKey) {
    var file = href.split('#')[0];
    if (file === currentFile()) {
      return true;
    }
    var itemForFile = NAV_ITEMS.filter(function (item) {
      return item.href.split('#')[0] === file;
    })[0];
    return !!itemForFile && itemForFile.key === pageKey;
  }

  function buildNavList(pageKey) {
    var nav = document.createElement('nav');
    nav.className = 'sidebar__nav';
    nav.setAttribute('aria-label', 'Основная навигация');

    var list = document.createElement('ul');
    list.className = 'nav-list';

    NAV_ITEMS.forEach(function (item) {
      var li = document.createElement('li');
      li.className = 'nav-list__item';

      var isActive = hrefMatchesCurrent(item.href, pageKey);
      var hasChildren = !!(item.children && item.children.length);
      if (hasChildren) {
        li.className += ' nav-list__item--has-children';
      }

      var row = document.createElement('div');
      row.className = 'nav-list__row';

      var link = document.createElement('a');
      link.className = 'nav-list__link';
      link.href = item.href;
      link.setAttribute('data-nav-key', item.key);
      if (isActive) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      }
      link.innerHTML =
        '<span class="nav-list__icon" aria-hidden="true">' + iconLetters(item.label) + '</span>' +
        '<span class="nav-list__label" data-i18n="nav.' + item.key + '">' + item.label + '</span>';
      row.appendChild(link);

      var submenu;
      if (hasChildren) {
        var submenuId = 'submenu-' + item.key;
        var childActive = item.children.some(function (child) {
          return child.href.split('#')[0] === currentFile();
        });

        var toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'nav-list__toggle';
        toggle.setAttribute('aria-expanded', childActive ? 'true' : 'false');
        toggle.setAttribute('aria-controls', submenuId);
        toggle.setAttribute('aria-label', 'Показать подпункты «' + item.label + '»');
        toggle.innerHTML = ICONS.chevron;
        row.appendChild(toggle);

        submenu = document.createElement('ul');
        submenu.className = 'nav-list__submenu';
        submenu.id = submenuId;
        if (!childActive) {
          submenu.hidden = true;
        }

        item.children.forEach(function (child) {
          var childLi = document.createElement('li');
          var childLink = document.createElement('a');
          childLink.href = child.href;
          childLink.textContent = child.label;
          var childParts = child.href.split('#');
          var childFragment = childParts[1] ? '#' + childParts[1] : '';
          if (childParts[0] === currentFile() && childFragment === window.location.hash) {
            childLink.classList.add('is-active');
          }
          childLi.appendChild(childLink);
          submenu.appendChild(childLi);
        });

        toggle.addEventListener('click', function () {
          var expanded = toggle.getAttribute('aria-expanded') === 'true';
          toggle.setAttribute('aria-expanded', String(!expanded));
          submenu.hidden = expanded;
        });
      }

      li.appendChild(row);
      if (submenu) {
        li.appendChild(submenu);
      }
      list.appendChild(li);
    });

    nav.appendChild(list);
    return nav;
  }

  function buildHeader() {
    var header = document.createElement('div');
    header.className = 'sidebar__header';

    var brand = document.createElement('a');
    brand.className = 'sidebar__brand';
    if (currentPageKey() === 'home') {
      brand.classList.add('is-active');
      brand.setAttribute('aria-current', 'page');
    }
    brand.href = 'index.html';
    brand.innerHTML =
      '<img class="sidebar__logo" src="assets/icons/logo.svg" alt="" width="40" height="40">' +
      '<span class="sidebar__brand-text">' +
      '<span class="sidebar__brand-name">Казахский агротехнический исследовательский университет имени С. Сейфуллина</span>' +
      '</span>';

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'sidebar__icon-btn sidebar__close-btn';
    closeBtn.id = 'sidebarCloseBtn';
    closeBtn.setAttribute('aria-label', 'Закрыть меню');
    closeBtn.innerHTML = ICONS.close;

    var collapseBtn = document.createElement('button');
    collapseBtn.type = 'button';
    collapseBtn.className = 'sidebar__icon-btn sidebar__collapse-btn';
    collapseBtn.id = 'sidebarCollapseBtn';
    collapseBtn.setAttribute('aria-pressed', 'false');
    collapseBtn.setAttribute('aria-label', 'Свернуть меню');
    collapseBtn.innerHTML = ICONS.collapse;

    header.appendChild(brand);
    header.appendChild(closeBtn);
    header.appendChild(collapseBtn);
    return header;
  }

  function buildSearch() {
    var form = document.createElement('form');
    form.className = 'sidebar__search';
    form.setAttribute('role', 'search');
    form.action = 'search.html';
    form.method = 'get';
    form.innerHTML =
      '<label class="visually-hidden" for="globalSearch">Поиск по сайту</label>' +
      '<input type="search" id="globalSearch" name="q" placeholder="Поиск по сайту…" autocomplete="off">' +
      '<button type="submit" class="sidebar__search-submit" aria-label="Найти">' + ICONS.search + '</button>' +
      '<ul class="sidebar__search-suggestions" id="searchSuggestions" hidden></ul>';
    return form;
  }

  function buildFooter() {
    var wrap = document.createElement('div');
    wrap.className = 'sidebar__footer';

    var langSwitch = document.createElement('div');
    langSwitch.className = 'lang-switch';
    langSwitch.setAttribute('role', 'group');
    langSwitch.setAttribute('aria-label', 'Выбор языка сайта');
    langSwitch.innerHTML =
      '<button type="button" class="lang-switch__btn" data-lang="kz">KZ</button>' +
      '<button type="button" class="lang-switch__btn" data-lang="ru">RU</button>' +
      '<button type="button" class="lang-switch__btn" data-lang="en">EN</button>';

    var platonus = document.createElement('a');
    platonus.className = 'platonus-link';
    platonus.href = 'http://platonus.kazatu.kz/';
    platonus.target = '_blank';
    platonus.rel = 'noopener noreferrer';
    platonus.innerHTML =
      '<span class="platonus-link__icon" aria-hidden="true">P</span>' +
      '<span class="platonus-link__label">Platonus (АИС)</span>' +
      '<span class="visually-hidden">открывается в новой вкладке</span>';

    wrap.appendChild(langSwitch);
    wrap.appendChild(platonus);
    return wrap;
  }

  function buildSidebar() {
    var mount = document.getElementById('sidebar-mount');
    if (!mount) {
      return;
    }
    var pageKey = currentPageKey();
    var fragment = document.createDocumentFragment();
    fragment.appendChild(buildHeader());
    fragment.appendChild(buildSearch());
    fragment.appendChild(buildNavList(pageKey));
    fragment.appendChild(buildFooter());
    mount.appendChild(fragment);
  }

  /* ---------------------------------------------------------------- */
  /* Mobile drawer                                                     */
  /* ---------------------------------------------------------------- */

  function initDrawer() {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebarOverlay');
    var openBtn = document.getElementById('mobileMenuToggle');
    if (!sidebar || !overlay || !openBtn) {
      return;
    }

    var lastFocused = null;

    function isDesktop() {
      return window.matchMedia('(min-width: 960px)').matches;
    }

    function openDrawer() {
      if (isDesktop()) {
        return;
      }
      lastFocused = document.activeElement;
      sidebar.classList.add('is-open');
      overlay.classList.add('is-open');
      document.body.classList.add('no-scroll');
      openBtn.setAttribute('aria-expanded', 'true');
      var closeBtn = document.getElementById('sidebarCloseBtn');
      if (closeBtn) {
        closeBtn.focus();
      }
      document.addEventListener('keydown', onKeydown);
    }

    function closeDrawer() {
      sidebar.classList.remove('is-open');
      overlay.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      openBtn.setAttribute('aria-expanded', 'false');
      document.removeEventListener('keydown', onKeydown);
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      } else {
        openBtn.focus();
      }
    }

    function onKeydown(event) {
      if (event.key === 'Escape') {
        closeDrawer();
      }
    }

    openBtn.addEventListener('click', function () {
      var isOpen = sidebar.classList.contains('is-open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    overlay.addEventListener('click', closeDrawer);

    document.addEventListener('click', function (event) {
      var target = event.target;
      if (target.id === 'sidebarCloseBtn' || target.closest('#sidebarCloseBtn')) {
        closeDrawer();
      }
    });

    sidebar.addEventListener('click', function (event) {
      var link = event.target.closest('a');
      if (link && !isDesktop()) {
        closeDrawer();
      }
    });

    window.addEventListener('resize', function () {
      if (isDesktop()) {
        sidebar.classList.remove('is-open');
        overlay.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
        openBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------------------------------------------------------------- */
  /* Desktop collapse toggle (persisted)                               */
  /* ---------------------------------------------------------------- */

  function initCollapse() {
    var shell = document.querySelector('.app-shell');
    var collapseBtn = document.getElementById('sidebarCollapseBtn');
    if (!shell || !collapseBtn) {
      return;
    }

    var STORAGE_KEY = 'kazatu.sidebarCollapsed';
    var collapsed = window.localStorage.getItem(STORAGE_KEY) === 'true';
    applyState(collapsed);

    function applyState(state) {
      shell.classList.toggle('app-shell--collapsed', state);
      collapseBtn.setAttribute('aria-pressed', String(state));
      collapseBtn.setAttribute('aria-label', state ? 'Развернуть меню' : 'Свернуть меню');
    }

    collapseBtn.addEventListener('click', function () {
      collapsed = !collapsed;
      applyState(collapsed);
      window.localStorage.setItem(STORAGE_KEY, String(collapsed));
    });
  }

  function init() {
    buildSidebar();
    initDrawer();
    initCollapse();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.Navigation = { init: init, items: NAV_ITEMS };
})();
