/*
  news.js
  Real news + notices sourced from kazatu.edu.kz (headlines, dates and
  images verified against the live site's /ru/news and homepage markup;
  see project summary for sourcing notes). Powers the filtered/paginated
  list on news.html and the detail + related + share view on
  news-detail.html. No backend — everything runs from the arrays below.
*/

(function () {
  'use strict';

  var CATEGORY_LABELS = { news: 'Новости', notice: 'Объявления' };
  var PAGE_SIZE = 4;

  var NEWS_ITEMS = [
    {
      id: 'forum-rektorov',
      category: 'news',
      title: 'Делегация КазАТУ им. С. Сейфуллина приняла участие в V Форуме ректоров сельскохозяйственных университетов стран ШОС',
      date: '2026-07-10',
      image: 'assets/images/news-1-forum-rektorov.jpg',
      excerpt: '5-й Форум ректоров сельскохозяйственных университетов стран ШОС и 11-я конференция Альянса сельскохозяйственного образования и научных инноваций Шёлкового пути, Сиань (Китай), 6–9 июля 2026 года.',
      tags: ['agriculture', 'international'],
      href: null
    },
    {
      id: 'diplom-tvorcheskaya',
      category: 'news',
      title: 'Диплом и творческая специальность: семь выпускников университета завершили курс творческой подготовки',
      date: '2026-07-08',
      image: 'assets/images/news-2-diplom.jpg',
      excerpt: '',
      tags: ['humanities'],
      href: null
    },
    {
      id: 'konstitucia',
      category: 'news',
      title: 'В КАТИУ обсудили значение Конституции как основы правового государства и общественного согласия',
      date: '2026-07-02',
      image: 'assets/images/news-3-konstitucia.jpg',
      excerpt: '',
      tags: ['humanities'],
      href: null
    },
    {
      id: 'istoricheskaya-galerea',
      category: 'news',
      title: 'Историческая память на карте: представители КАТИУ приняли участие в открытии уникальной галереи',
      date: '2026-07-02',
      image: 'assets/images/news-4-istoriceskaa-galerea.jpg',
      excerpt: '',
      tags: ['humanities'],
      href: null
    },
    {
      id: 'erasmus-hwca',
      category: 'news',
      title: 'Предфинальный семинар проекта Erasmus+ HWCA (2023–2026) по устойчивости водного сектора Центральной Азии',
      date: '2026-07-02',
      image: 'assets/images/news-5-erasmus-hwca.jpg',
      excerpt: '',
      tags: ['land-architecture', 'agriculture', 'international'],
      href: null
    },
    {
      id: 'china-agriculture-lab',
      category: 'news',
      title: 'Совместная лаборатория и новые исследования: встреча КАТИУ с партнёрами из КНР',
      date: '2026-02-04',
      image: null,
      excerpt: 'Сотрудничество в области пастбищного сельского хозяйства и научных исследований.',
      tags: ['agriculture', 'international'],
      href: 'https://kazatu.edu.kz/ru/news/kazatzu-da-lan-czou-universitetini-khr-delegaciasymen-zmys-kezdesui-tti'
    },
    {
      id: 'grants-info',
      category: 'notice',
      title: 'Сведения об имеющихся вакантных образовательных грантах (01.01.2026–30.06.2026)',
      date: '2026-07-03',
      image: null,
      excerpt: '',
      href: 'https://kazatu.edu.kz/ru/notice/svedenia-ob-imeusihsa-vakantnyh-obrazovatel-nyh-grantah-01-01-2026g-30-06-2026g'
    },
    {
      id: 'umo-meeting',
      category: 'notice',
      title: 'Расширенное выездное заседание Учебно-методического объединения «Педагогические науки» при РУМС КазНПУ им. Абая и РУМС КАТИУ им. С. Сейфуллина',
      date: '2026-06-16',
      image: null,
      excerpt: '',
      href: 'https://kazatu.edu.kz/ru/notice/rassirennoe-vyezdnoe-zasedanie-ucebno-metodiceskogo-ob-edinenia-v-oblasti-pedagogiceskie-nauki-pri-rums-kaznpu-imeni-abaa-i-ucebno-metodiceskogo-ob-edinenia-po-napravleniu-professional-noe-obucenie-po-profilu-pri-rums-katiu-imeni-s-sejfullina'
    },
    {
      id: 'investors-search',
      category: 'notice',
      title: 'О поиске партнёров и инвесторов для реализации инвестиционного проекта',
      date: '2026-06-11',
      image: null,
      excerpt: '',
      href: 'https://kazatu.edu.kz/ru/notice/o-poiske-partnerov-i-investorov-dla-realizacii-investicionnogo-proekta'
    }
  ];

  window.KAZATU_NEWS_ITEMS = NEWS_ITEMS;

  function formatDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function years() {
    return Array.from(new Set(NEWS_ITEMS.map(function (n) { return n.date.slice(0, 4); }))).sort().reverse();
  }

  function renderCard(item) {
    var link = item.href || ('news-detail.html?id=' + item.id);
    var target = item.href ? ' target="_blank" rel="noopener noreferrer"' : '';
    var media = item.image
      ? '<div class="card__media"><img src="' + item.image + '" alt="" loading="lazy" width="640" height="480"></div>'
      : '';
    return (
      '<article class="card">' +
      media +
      '<p class="card__meta"><span class="badge badge--accent">' + CATEGORY_LABELS[item.category] + '</span> <time datetime="' + item.date + '">' + formatDate(item.date) + '</time></p>' +
      '<h3 class="card__title"><a href="' + link + '"' + target + '>' + item.title + '</a></h3>' +
      (item.excerpt ? '<p class="card__body">' + item.excerpt + '</p>' : '') +
      '</article>'
    );
  }

  function initList() {
    var grid = document.getElementById('newsResults');
    var searchInput = document.getElementById('newsSearch');
    var categorySelect = document.getElementById('newsCategory');
    var yearSelect = document.getElementById('newsYear');
    var resetBtn = document.getElementById('newsFilterReset');
    var countEl = document.getElementById('newsResultsCount');
    var emptyState = document.getElementById('newsEmptyState');
    var pagination = document.getElementById('newsPagination');
    if (!grid) {
      return;
    }

    if (yearSelect) {
      var opts = ['<option value="all">Все годы</option>'];
      years().forEach(function (y) {
        opts.push('<option value="' + y + '">' + y + '</option>');
      });
      yearSelect.innerHTML = opts.join('');
    }

    var page = 1;

    function filtered() {
      var query = (searchInput && searchInput.value || '').toLowerCase().trim();
      var category = categorySelect ? categorySelect.value : 'all';
      var year = yearSelect ? yearSelect.value : 'all';

      return NEWS_ITEMS.filter(function (item) {
        var matchesCategory = category === 'all' || item.category === category;
        var matchesYear = year === 'all' || item.date.slice(0, 4) === year;
        var matchesQuery = !query || item.title.toLowerCase().indexOf(query) !== -1 ||
          (item.excerpt && item.excerpt.toLowerCase().indexOf(query) !== -1);
        return matchesCategory && matchesYear && matchesQuery;
      });
    }

    function render() {
      var results = filtered();
      var totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
      page = Math.min(page, totalPages);
      var start = (page - 1) * PAGE_SIZE;
      var pageItems = results.slice(start, start + PAGE_SIZE);

      grid.innerHTML = pageItems.map(renderCard).join('');

      if (emptyState) {
        emptyState.hidden = results.length !== 0;
      }
      if (countEl) {
        countEl.textContent = 'Найдено материалов: ' + results.length + ' из ' + NEWS_ITEMS.length;
      }

      if (pagination) {
        if (totalPages <= 1) {
          pagination.innerHTML = '';
        } else {
          var buttons = [];
          for (var i = 1; i <= totalPages; i++) {
            buttons.push(
              '<button type="button" data-page="' + i + '"' +
              (i === page ? ' aria-current="page"' : '') +
              '>' + i + '</button>'
            );
          }
          pagination.innerHTML = buttons.join('');
        }
      }
    }

    [searchInput].forEach(function (control) {
      if (control) {
        control.addEventListener('input', function () { page = 1; render(); });
      }
    });
    [categorySelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('change', function () { page = 1; render(); });
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (searchInput) searchInput.value = '';
        if (categorySelect) categorySelect.value = 'all';
        if (yearSelect) yearSelect.value = 'all';
        page = 1;
        render();
      });
    }

    if (pagination) {
      pagination.addEventListener('click', function (event) {
        var btn = event.target.closest('button[data-page]');
        if (!btn) {
          return;
        }
        page = Number(btn.getAttribute('data-page'));
        render();
        grid.scrollIntoView({ block: 'start', behavior: 'smooth' });
      });
    }

    render();
  }

  function initShare(item) {
    var host = document.getElementById('newsShare');
    if (!host) {
      return;
    }
    var url = window.location.href;
    var text = item.title;

    var telegramUrl = 'https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text);
    var whatsappUrl = 'https://wa.me/?text=' + encodeURIComponent(text + ' ' + url);

    host.innerHTML =
      '<a class="share-buttons__btn" href="' + telegramUrl + '" target="_blank" rel="noopener noreferrer">Telegram</a>' +
      '<a class="share-buttons__btn" href="' + whatsappUrl + '" target="_blank" rel="noopener noreferrer">WhatsApp</a>' +
      '<button type="button" class="share-buttons__btn" id="newsCopyLink">Скопировать ссылку</button>';

    var copyBtn = document.getElementById('newsCopyLink');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var done = function () {
          copyBtn.textContent = 'Ссылка скопирована';
          setTimeout(function () { copyBtn.textContent = 'Скопировать ссылку'; }, 2000);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(done).catch(function () {});
        } else {
          var temp = document.createElement('input');
          temp.value = url;
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          document.body.removeChild(temp);
          done();
        }
      });
    }

    if (navigator.share) {
      var nativeBtn = document.createElement('button');
      nativeBtn.type = 'button';
      nativeBtn.className = 'share-buttons__btn';
      nativeBtn.textContent = 'Поделиться…';
      nativeBtn.addEventListener('click', function () {
        navigator.share({ title: text, url: url }).catch(function () {});
      });
      host.insertBefore(nativeBtn, host.firstChild);
    }
  }

  function initDetail() {
    var root = document.getElementById('newsDetail');
    if (!root) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    var item = NEWS_ITEMS.filter(function (n) { return n.id === id; })[0] || NEWS_ITEMS[0];

    document.title = item.title + ' — Новости КазАТУ';

    document.querySelectorAll('[data-field="title"]').forEach(function (el) { el.textContent = item.title; });
    document.querySelectorAll('[data-field="category"]').forEach(function (el) { el.textContent = CATEGORY_LABELS[item.category]; });
    document.querySelectorAll('[data-field="date"]').forEach(function (el) {
      el.textContent = formatDate(item.date);
      el.setAttribute('datetime', item.date);
    });

    var media = document.getElementById('newsDetailMedia');
    if (media) {
      if (item.image) {
        media.innerHTML = '<img src="' + item.image + '" alt="" width="1200" height="675">';
        media.hidden = false;
      } else {
        media.hidden = true;
      }
    }

    var body = document.getElementById('newsDetailBody');
    if (body) {
      var paragraphs = [];
      if (item.excerpt) {
        paragraphs.push('<p>' + item.excerpt + '</p>');
      }
      if (item.href) {
        paragraphs.push('<p>Полный текст объявления опубликован на официальном сайте университета.</p>');
        paragraphs.push('<p><a class="btn btn-outline" href="' + item.href + '" target="_blank" rel="noopener noreferrer">Читать на kazatu.edu.kz</a></p>');
      }
      body.innerHTML = paragraphs.join('');
    }

    var breadcrumbTitle = document.getElementById('newsBreadcrumbTitle');
    if (breadcrumbTitle) {
      breadcrumbTitle.textContent = item.title.length > 60 ? item.title.slice(0, 57) + '…' : item.title;
    }

    var related = document.getElementById('newsRelated');
    if (related) {
      var others = NEWS_ITEMS.filter(function (n) {
        return n.id !== item.id && n.category === item.category;
      }).slice(0, 3);
      related.innerHTML = others.map(renderCard).join('');
      var relatedSection = document.getElementById('newsRelatedSection');
      if (relatedSection) {
        relatedSection.hidden = others.length === 0;
      }
    }

    initShare(item);
  }

  function init() {
    initList();
    initDetail();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
