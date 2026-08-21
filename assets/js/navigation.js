/*
  navigation.js
  Builds the sidebar into every page's empty `#sidebar-mount` as a
  two-zone off-canvas drawer: a fixed-width rail (close button + social
  links) and a scrollable panel (search, single-expand accordion nav,
  Platonus link). Also builds the university brand
  lockup (logo + full name) into the topbar's `#topbar-brand-mount`.
  Owns the mobile drawer (open/close/Escape/overlay/scroll-lock) and the
  desktop collapse toggle (rendered in the panel header on desktop).

  Every page only needs:
    <aside class="sidebar" id="sidebar"><div id="sidebar-mount"></div></aside>
    <div class="app-shell__overlay" id="sidebarOverlay"></div>
    <button id="mobileMenuToggle" class="topbar__menu-btn" aria-controls="sidebar" aria-expanded="false">…</button>
    <div id="topbar-brand-mount"></div>
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
        { label: 'Все институты', href: 'institutes.html' }
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

  var SOCIAL_LINKS = [
    {
      label: 'YouTube',
      href: 'https://youtube.com/channel/UCOXrTfFjnVtC5ZaBvjK6rYg',
      icon:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="6" width="19" height="12" rx="3"/><path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" stroke="none"/></svg>'
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/kazatu.official/',
      icon:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>'
    },
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/kazatu.official',
      icon:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M14 8.5h-1.3a1.5 1.5 0 0 0-1.5 1.5v2h2.6l-.4 2.5h-2.2V21"/></svg>'
    },
    {
      label: 'Telegram',
      href: 'https://t.me/KazATIU',
      icon:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 4 3 11l6 2.2M21 4l-3.4 15L9 15m12-11L9 15m0 0-.7 4.8L12 16.6"/></svg>'
    }
  ];

  var ICONS = {
    close:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    collapse:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 6h16M4 12h10M4 18h16"/></svg>',
    search:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>',
    chevron:
      '<svg class="nav-list__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
    accessibility:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="4.5" r="2"/><path d="M5 9.5h14M12 7v13M8 21l4-6 4 6M7 10l5 3 5-3"/></svg>'
  };

  var NAV_ICONS = {
    home:
      '<svg class="nav-list__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z"/></svg>',
    admissions:
      '<svg class="nav-list__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6M8 15l2 2 5-5"/></svg>',
    education:
      '<svg class="nav-list__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m2 9 10-5 10 5-10 5L2 9Z"/><path d="M6 11v5c3.5 2.5 8.5 2.5 12 0v-5M22 9v6"/></svg>',
    institutes:
      '<svg class="nav-list__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-5 9 5M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18"/></svg>',
    science:
      '<svg class="nav-list__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><ellipse cx="12" cy="12" rx="9" ry="3.5"/><ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)"/></svg>',
    students:
      '<svg class="nav-list__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3 21v-2a6 6 0 0 1 12 0v2M16 4a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5v2"/></svg>',
    international:
      '<svg class="nav-list__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.3 2.5 3.5 5.5 3.5 9S14.3 18.5 12 21C9.7 18.5 8.5 15.5 8.5 12S9.7 5.5 12 3Z"/></svg>',
    news:
      '<svg class="nav-list__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h13v15H5a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1Z"/><path d="M17 8h3a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2M7 9h6M7 13h6M7 17h4"/></svg>',
    about:
      '<svg class="nav-list__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></svg>',
    contacts:
      '<svg class="nav-list__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16.5v3a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.3 19.3 0 0 1-6-6A19.7 19.7 0 0 1 1.1 3.8 2 2 0 0 1 3.1 1.6h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L7.1 9.5a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c1 .4 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"/></svg>'
  };

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

    var accordionEntries = [];

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
        '<span class="nav-list__icon" aria-hidden="true">' + NAV_ICONS[item.key] + '</span>' +
        '<span class="nav-list__label">' + item.label + '</span>';
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
          accordionEntries.forEach(function (entry) {
            if (entry.toggle !== toggle) {
              entry.toggle.setAttribute('aria-expanded', 'false');
              entry.submenu.hidden = true;
            }
          });
          toggle.setAttribute('aria-expanded', String(!expanded));
          submenu.hidden = expanded;
        });

        accordionEntries.push({ toggle: toggle, submenu: submenu });
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

  function buildRail() {
    var rail = document.createElement('div');
    rail.className = 'sidebar__rail';

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'sidebar__icon-btn sidebar__rail-close';
    closeBtn.id = 'sidebarCloseBtn';
    closeBtn.setAttribute('aria-label', 'Закрыть меню');
    closeBtn.innerHTML = ICONS.close;
    rail.appendChild(closeBtn);

    var social = document.createElement('ul');
    social.className = 'sidebar__rail-social';
    SOCIAL_LINKS.forEach(function (network) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = network.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', network.label);
      a.innerHTML = network.icon;
      li.appendChild(a);
      social.appendChild(li);
    });
    rail.appendChild(social);

    return rail;
  }

  function buildPanelHeader() {
    var header = document.createElement('div');
    header.className = 'sidebar__panel-header';

    var title = document.createElement('span');
    title.className = 'sidebar__panel-title';
    title.textContent = 'Меню';

    var collapseBtn = document.createElement('button');
    collapseBtn.type = 'button';
    collapseBtn.className = 'sidebar__icon-btn sidebar__collapse-btn';
    collapseBtn.id = 'sidebarCollapseBtn';
    collapseBtn.setAttribute('aria-pressed', 'false');
    collapseBtn.setAttribute('aria-label', 'Свернуть меню');
    collapseBtn.innerHTML = ICONS.collapse;

    header.appendChild(title);
    header.appendChild(collapseBtn);
    return header;
  }

  function buildTopbarBrand() {
    var mount = document.getElementById('topbar-brand-mount');
    if (!mount) {
      return;
    }

    var brand = document.createElement('a');
    brand.className = 'topbar__brand';
    if (currentPageKey() === 'home') {
      brand.classList.add('is-active');
      brand.setAttribute('aria-current', 'page');
    }
    brand.href = 'index.html';
    brand.innerHTML =
      '<img class="topbar__brand-logo" src="assets/icons/logo.svg" alt="" width="64" height="64">' +
      '<span class="topbar__brand-text">' +
      '<span class="topbar__brand-name">Казахский агротехнический исследовательский университет имени С. Сейфуллина</span>' +
      '</span>';

    mount.appendChild(brand);

    var utilities = document.createElement('div');
    utilities.className = 'topbar__utilities';
    utilities.innerHTML =
      '<div class="lang-switch lang-switch--topbar" role="group" aria-label="Выбор языка сайта">' +
        '<button type="button" class="lang-switch__btn" data-lang="kz">KZ</button>' +
        '<button type="button" class="lang-switch__btn" data-lang="ru">RU</button>' +
        '<button type="button" class="lang-switch__btn" data-lang="en">EN</button>' +
      '</div>' +
      '<button type="button" class="topbar__accessibility" id="accessibilityToggle" aria-pressed="false" aria-label="Версия для слабовидящих">' + ICONS.accessibility + '<span class="topbar__accessibility-label">Слабовидящим</span></button>';
    mount.appendChild(utilities);
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

    var platonus = document.createElement('a');
    platonus.className = 'platonus-link';
    platonus.href = 'http://platonus.kazatu.kz/';
    platonus.target = '_blank';
    platonus.rel = 'noopener noreferrer';
    platonus.innerHTML =
      '<span class="platonus-link__icon" aria-hidden="true">P</span>' +
      '<span class="platonus-link__label">Platonus (АИС)</span>' +
      '<span class="visually-hidden">открывается в новой вкладке</span>';

    wrap.appendChild(platonus);
    return wrap;
  }

  function buildSidebar() {
    var mount = document.getElementById('sidebar-mount');
    if (!mount) {
      return;
    }
    mount.className = 'sidebar__body';
    var pageKey = currentPageKey();

    var panel = document.createElement('div');
    panel.className = 'sidebar__panel';
    panel.appendChild(buildPanelHeader());
    panel.appendChild(buildSearch());
    panel.appendChild(buildNavList(pageKey));
    panel.appendChild(buildFooter());

    mount.appendChild(buildRail());
    mount.appendChild(panel);
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

  function initAccessibilityToggle() {
    var toggle = document.getElementById('accessibilityToggle');
    if (!toggle) {
      return;
    }
    var enabled = window.localStorage.getItem('kazatu.accessibility') === 'true';
    document.body.classList.toggle('is-accessible', enabled);
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.addEventListener('click', function () {
      enabled = !enabled;
      document.body.classList.toggle('is-accessible', enabled);
      toggle.setAttribute('aria-pressed', String(enabled));
      window.localStorage.setItem('kazatu.accessibility', String(enabled));
    });
  }

  function init() {
    buildSidebar();
    buildTopbarBrand();
    initDrawer();
    initCollapse();
    initAccessibilityToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.Navigation = { init: init, items: NAV_ITEMS };
})();
