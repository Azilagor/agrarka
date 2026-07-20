/*
  search.js
  Client-side search over the site's navigation index, and — where those
  scripts have also been loaded on the page — the program catalog and
  news/notices. No backend. Powers live suggestions in the sidebar search
  box and the grouped, highlighted results on search.html.
*/

(function () {
  'use strict';

  function buildIndex() {
    var index = [];

    (window.KAZATU_NAV_ITEMS || []).forEach(function (item) {
      index.push({ title: item.label, href: item.href, section: 'Разделы сайта' });
      (item.children || []).forEach(function (child) {
        index.push({ title: child.label, href: child.href, section: 'Разделы сайта' });
      });
    });

    if (window.KAZATU_PLACEHOLDER_PROGRAMS) {
      var levelLabels = window.KAZATU_LEVEL_LABELS || {};
      window.KAZATU_PLACEHOLDER_PROGRAMS.forEach(function (p) {
        index.push({
          title: p.title + ' (' + (levelLabels[p.level] || p.level) + ')',
          href: 'program.html?id=' + p.id,
          section: 'Образовательные программы'
        });
      });
    }

    if (window.KAZATU_NEWS_ITEMS) {
      window.KAZATU_NEWS_ITEMS.forEach(function (n) {
        index.push({
          title: n.title,
          href: n.href || ('news-detail.html?id=' + n.id),
          section: 'Новости и объявления'
        });
      });
    }

    if (window.KAZATU_INSTITUTES) {
      window.KAZATU_INSTITUTES.forEach(function (inst) {
        index.push({ title: inst.name, href: 'institute.html?id=' + inst.id, section: 'Институты' });
      });
    }

    return index;
  }

  function normalize(str) {
    return str.toLowerCase().replace(/ё/g, 'е').trim();
  }

  function search(query, index) {
    var q = normalize(query);
    if (!q) {
      return [];
    }
    return index.filter(function (entry) {
      return normalize(entry.title).indexOf(q) !== -1 || normalize(entry.section).indexOf(q) !== -1;
    });
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function highlight(text, query) {
    var q = normalize(query);
    var normalizedText = normalize(text);
    var idx = q ? normalizedText.indexOf(q) : -1;
    if (idx === -1) {
      return escapeHtml(text);
    }
    var before = escapeHtml(text.slice(0, idx));
    var match = escapeHtml(text.slice(idx, idx + q.length));
    var after = escapeHtml(text.slice(idx + q.length));
    return before + '<mark class="search-hit">' + match + '</mark>' + after;
  }

  /* ---------------------------------------------------------------- */
  /* Sidebar live suggestions                                          */
  /* ---------------------------------------------------------------- */

  function initSuggestions(index) {
    var input = document.getElementById('globalSearch');
    var list = document.getElementById('searchSuggestions');
    if (!input || !list) {
      return;
    }

    function render(results) {
      list.innerHTML = '';
      if (!results.length) {
        list.hidden = true;
        return;
      }
      results.slice(0, 6).forEach(function (entry) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = entry.href;
        a.innerHTML = highlight(entry.title, input.value) + ' <span class="text-muted">— ' + entry.section + '</span>';
        li.appendChild(a);
        list.appendChild(li);
      });
      list.hidden = false;
    }

    input.addEventListener('input', function () {
      render(search(input.value, index));
    });

    input.addEventListener('focus', function () {
      if (input.value) {
        render(search(input.value, index));
      }
    });

    document.addEventListener('click', function (event) {
      if (!event.target.closest('.sidebar__search')) {
        list.hidden = true;
      }
    });

    input.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        list.hidden = true;
        input.blur();
      }
    });
  }

  /* ---------------------------------------------------------------- */
  /* search.html results page — grouped by category, matches highlighted */
  /* ---------------------------------------------------------------- */

  function initResultsPage(index) {
    var resultsRoot = document.getElementById('searchResults');
    var summary = document.getElementById('searchSummary');
    var form = document.getElementById('searchPageForm');
    if (!resultsRoot) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';

    var pageInput = document.getElementById('searchPageInput');
    if (pageInput) {
      pageInput.value = query;
    }

    function groupBySection(results) {
      var groups = {};
      var order = [];
      results.forEach(function (entry) {
        if (!groups[entry.section]) {
          groups[entry.section] = [];
          order.push(entry.section);
        }
        groups[entry.section].push(entry);
      });
      return order.map(function (section) {
        return { section: section, items: groups[section] };
      });
    }

    function render() {
      var results = search(query, index);
      resultsRoot.innerHTML = '';

      if (!query) {
        summary.textContent = 'Введите запрос, чтобы найти раздел, программу, институт или новость.';
      } else if (!results.length) {
        summary.textContent = 'По запросу «' + query + '» ничего не найдено. Проверьте написание или попробуйте другой запрос.';
      } else {
        summary.textContent = 'Результатов по запросу «' + query + '»: ' + results.length + '.';
      }

      groupBySection(results).forEach(function (group) {
        var wrap = document.createElement('div');
        wrap.className = 'result-group';

        var heading = document.createElement('h2');
        heading.className = 'result-group__heading';
        heading.textContent = group.section + ' (' + group.items.length + ')';
        wrap.appendChild(heading);

        var grid = document.createElement('div');
        grid.className = 'card-grid';
        group.items.forEach(function (entry) {
          var card = document.createElement('article');
          card.className = 'card';
          card.innerHTML = '<h3 class="card__title"><a href="' + entry.href + '">' + highlight(entry.title, query) + '</a></h3>';
          grid.appendChild(card);
        });
        wrap.appendChild(grid);

        resultsRoot.appendChild(wrap);
      });
    }

    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        query = pageInput.value;
        var url = new URL(window.location.href);
        url.searchParams.set('q', query);
        window.history.replaceState({}, '', url);
        render();
      });
    }

    render();
  }

  function init() {
    var index = buildIndex();
    initSuggestions(index);
    initResultsPage(index);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
