/*
  main.js
  Site-wide bootstrap: injects the shared footer (so contact details and
  quick links live in one place, not copy-pasted across 15 pages) and a
  couple of small generic utilities. Page- or feature-specific behavior
  lives in its own file (navigation.js, search.js, programs.js, i18n.js).
*/

(function () {
  'use strict';

  var FOOTER_LINKS = {
    university: {
      heading: 'Университет',
      items: [
        { label: 'Об университете', href: 'about.html' },
        { label: 'Институты', href: 'institutes.html' },
        { label: 'Наука', href: 'science.html' },
        { label: 'Новости', href: 'news.html' },
        { label: 'Контакты', href: 'contacts.html' }
      ]
    },
    admission: {
      heading: 'Абитуриентам и студентам',
      items: [
        { label: 'Поступление', href: 'admissions.html' },
        { label: 'Образовательные программы', href: 'programs.html' },
        { label: 'Студентам', href: 'students.html' },
        { label: 'Международное сотрудничество', href: 'international.html' }
      ]
    },
    portals: {
      heading: 'Полезные ссылки',
      items: [
        { label: 'Platonus (АИС)', href: 'http://platonus.kazatu.kz/', external: true },
        { label: 'Moodle', href: 'http://moodle.kazatu.kz/', external: true },
        { label: 'Национальная платформа MOOK', href: 'http://moocs.kz/', external: true },
        { label: 'Образовательный портал', href: 'http://portal.kazatu.kz/', external: true },
        { label: 'Электронная библиотека', href: 'http://portal.kazatu.kz/e-books', external: true }
      ]
    }
  };

  var CONTACT = {
    address: '010011, Республика Казахстан, г. Астана, пр. Женис, 62',
    phones: [
      { label: '+7 (7172) 31-75-47', href: 'tel:+77172317547', note: 'приёмная ректора' },
      { label: '+7 (7172) 31-75-56', href: 'tel:+77172317556', note: 'приёмная комиссия' }
    ],
    email: 'office@kazatu.edu.kz'
  };

  var SOCIAL = [
    { label: 'YouTube', href: 'https://youtube.com/channel/UCOXrTfFjnVtC5ZaBvjK6rYg', abbr: 'YT' },
    { label: 'Instagram', href: 'https://www.instagram.com/kazatu.official/', abbr: 'IG' },
    { label: 'Facebook', href: 'https://www.facebook.com/kazatu.official', abbr: 'FB' },
    { label: 'Telegram', href: 'https://t.me/KazATIU', abbr: 'TG' }
  ];

  function buildLinkColumn(section) {
    var col = document.createElement('div');
    var heading = document.createElement('h2');
    heading.className = 'site-footer__heading';
    heading.textContent = section.heading;
    var list = document.createElement('ul');
    list.className = 'site-footer__list';

    section.items.forEach(function (item) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      if (item.external) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
      li.appendChild(a);
      list.appendChild(li);
    });

    col.appendChild(heading);
    col.appendChild(list);
    return col;
  }

  function buildContactColumn() {
    var col = document.createElement('div');
    var heading = document.createElement('h2');
    heading.className = 'site-footer__heading';
    heading.textContent = 'Контакты';

    var list = document.createElement('ul');
    list.className = 'site-footer__contact';

    var addressLi = document.createElement('li');
    addressLi.textContent = CONTACT.address;
    list.appendChild(addressLi);

    CONTACT.phones.forEach(function (phone) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = phone.href;
      a.textContent = phone.label + ' (' + phone.note + ')';
      li.appendChild(a);
      list.appendChild(li);
    });

    var emailLi = document.createElement('li');
    var emailLink = document.createElement('a');
    emailLink.href = 'mailto:' + CONTACT.email;
    emailLink.textContent = CONTACT.email;
    emailLi.appendChild(emailLink);
    list.appendChild(emailLi);

    var social = document.createElement('div');
    social.className = 'site-footer__social';
    SOCIAL.forEach(function (network) {
      var a = document.createElement('a');
      a.href = network.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', network.label);
      a.textContent = network.abbr;
      social.appendChild(a);
    });

    col.appendChild(heading);
    col.appendChild(list);
    col.appendChild(social);
    return col;
  }

  function buildFooter() {
    var mount = document.getElementById('footer-mount');
    if (!mount) {
      return;
    }

    var footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.id = 'footer';

    var container = document.createElement('div');
    container.className = 'container';

    var grid = document.createElement('div');
    grid.className = 'site-footer__grid';
    grid.appendChild(buildLinkColumn(FOOTER_LINKS.university));
    grid.appendChild(buildLinkColumn(FOOTER_LINKS.admission));
    grid.appendChild(buildLinkColumn(FOOTER_LINKS.portals));
    grid.appendChild(buildContactColumn());

    var bottom = document.createElement('div');
    bottom.className = 'site-footer__bottom';
    var rights = document.createElement('p');
    rights.textContent =
      '© НАО «Казахский агротехнический исследовательский университет имени С. Сейфуллина», 2001–' +
      new Date().getFullYear() + '.';
    bottom.appendChild(rights);

    container.appendChild(grid);
    container.appendChild(bottom);
    footer.appendChild(container);
    mount.appendChild(footer);
  }

  function init() {
    buildFooter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
