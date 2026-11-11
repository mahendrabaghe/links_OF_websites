/* =========================================================
   script.js — renders the page from config.js
   You should not need to edit this file.
   ========================================================= */
(function () {
  'use strict';

  var CFG = window.SITE_CONFIG || {};
  var THEME_KEY = 'ph-theme';

  /* ---------- helpers ---------- */

  var $ = function (sel, root) { return (root || document).querySelector(sel); };

  /**
   * A value is treated as "not filled in yet" when it is empty or still one of
   * the shipped placeholders. Placeholder links render as disabled cards so the
   * page never exposes a dead URL.
   */
  function isPlaceholder(value) {
    if (typeof value !== 'string') return true;
    var v = value.trim();
    if (!v) return true;
    if (/YOUR[-_ ]?/i.test(v)) return true;
    if (/\bYOUR\b/.test(v)) return true;
    if (/^your@/i.test(v)) return true;
    if (/example\.com|localhost|changeme|xxxxx/i.test(v)) return true;
    if (/^\+?1?234567890$/.test(v.replace(/[^\d]/g, ''))) return true;
    return false;
  }

  function initials(name) {
    var parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '??';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function digits(value) {
    return String(value || '').replace(/[^\d]/g, '');
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || '').trim());
  }

  /** Turns a config entry into a real, working URL — or null if not set up. */
  function resolveHref(raw) {
    if (typeof raw !== 'string') return null;
    var v = raw.trim();
    if (!v) return null;

    if (v === 'mailto' || v === 'email') {
      return isValidEmail(CFG.email) && !isPlaceholder(CFG.email) ? 'mailto:' + CFG.email.trim() : null;
    }
    if (v === 'wa.me' || v === 'whatsapp') {
      if (isPlaceholder(CFG.whatsapp)) return null;
      var n = digits(CFG.whatsapp);
      return n.length >= 8 ? 'https://wa.me/' + n : null;
    }
    if (v === 'tel') {
      var t = digits(CFG.phone || CFG.whatsapp);
      return t.length >= 7 ? 'tel:+' + t : null;
    }
    if (isPlaceholder(v)) return null;
    return v;
  }

  function resolveWebsiteUrl(raw) {
    if (typeof raw !== 'string' || !raw.trim()) return null;
    try {
      var url = new URL(raw.trim());
      if ((url.protocol !== 'http:' && url.protocol !== 'https:') ||
          !url.hostname || url.username || url.password) return null;
      return url.href;
    } catch (e) {
      return null;
    }
  }

  function svgIcon(id, cls) {
    return '<svg class="icon' + (cls ? ' ' + cls : '') + '" aria-hidden="true" focusable="false">' +
      '<use href="#i-' + id + '"></use></svg>';
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- theme ---------- */

  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function storedTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }

  function desiredTheme() {
    var pref = CFG.theme && CFG.theme.default;
    var saved = storedTheme();
    if (saved === 'dark' || saved === 'light') return saved;
    if (pref === 'dark' || pref === 'light') return pref;
    return media && media.matches ? 'dark' : 'light';
  }

  function applyTheme(theme, persist) {
    document.documentElement.setAttribute('data-theme', theme);
    if (persist && CFG.theme && CFG.theme.persist !== false) {
      try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* private mode */ }
    }
    var btn = $('#theme-toggle');
    if (btn) {
      var next = theme === 'dark' ? 'light' : 'dark';
      btn.setAttribute('aria-pressed', String(theme === 'light'));
      btn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
    }
    var tag = document.head.querySelector('meta[name="theme-color"]');
    if (tag) tag.setAttribute('content', theme === 'dark' ? '#070910' : '#eef1f8');
  }

  function initTheme() {
    applyTheme(desiredTheme(), false);
    var btn = $('#theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next, true);
    });
    // Follow the OS only while the visitor has not made an explicit choice.
    if (media && media.addEventListener) {
      media.addEventListener('change', function (e) {
        if (!storedTheme()) applyTheme(e.matches ? 'dark' : 'light', false);
      });
    }
  }

  /* ---------- SEO ---------- */

  function upsertMeta(key, value, content) {
    if (!content) return;
    var el = document.head.querySelector('meta[' + key + '="' + value + '"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(key, value);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function upsertLink(rel, href) {
    if (!href) return;
    var el = document.head.querySelector('link[rel="' + rel + '"]');
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
  }

  function absolute(url, base) {
    if (!url) return '';
    return /^https?:|^data:/.test(url) ? url : base + '/' + url.replace(/^\.\//, '').replace(/^\/+/, '');
  }

  function initSeo() {
    var seo = CFG.seo || {};
    var hasName = CFG.name && !isPlaceholder(CFG.name);
    var name = hasName ? CFG.name : 'Link Hub';

    if (seo.title) document.title = seo.title;
    else if (hasName && CFG.title) document.title = name + ' | ' + CFG.title;

    var description = seo.description || CFG.bio || '';
    var base = seo.url && !isPlaceholder(seo.url) ? seo.url.replace(/\/$/, '') : '';
    var image = absolute(seo.ogImage, base);

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'author', name);
    upsertMeta('property', 'og:type', 'profile');
    upsertMeta('property', 'og:site_name', name);
    upsertMeta('property', 'og:title', seo.title || document.title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', base ? base + '/' : '');
    upsertMeta('property', 'og:image', image);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', seo.title || document.title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image);
    if (seo.twitterHandle && !isPlaceholder(seo.twitterHandle)) {
      upsertMeta('name', 'twitter:site', seo.twitterHandle);
    }
    if (base) upsertLink('canonical', base + '/');

    // Favicon monogram kept in sync with the configured name.
    var link = $('link[rel="icon"]');
    if (link) {
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
        '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#22d3ee"/>' +
        '</linearGradient></defs>' +
        '<rect width="64" height="64" rx="16" fill="url(#g)"/>' +
        '<text x="32" y="43" font-family="Segoe UI,Arial,sans-serif" font-size="30" font-weight="700" ' +
        'fill="#ffffff" text-anchor="middle">' + initials(name) + '</text></svg>';
      link.setAttribute('href', 'data:image/svg+xml,' + encodeURIComponent(svg));
    }
  }

  /* ---------- profile ---------- */

  function initProfile() {
    var name = isPlaceholder(CFG.name) ? 'Your Name' : CFG.name;

    var nameEl = $('#profile-name');
    if (nameEl) nameEl.textContent = name;

    var titleEl = $('#profile-title');
    if (titleEl) {
      if (CFG.title) titleEl.textContent = CFG.title;
      else titleEl.hidden = true;
    }

    var bioEl = $('#profile-bio');
    if (bioEl) {
      if (CFG.bio) bioEl.textContent = CFG.bio;
      else bioEl.hidden = true;
    }

    var locEl = $('#profile-location');
    if (locEl) {
      if (CFG.location && !isPlaceholder(CFG.location)) {
        $('span', locEl).textContent = CFG.location;
        locEl.hidden = false;
      } else {
        locEl.hidden = true;
      }
    }

    var avail = CFG.availability || {};
    var availEl = $('#availability');
    if (availEl) {
      if (avail.show && avail.text) {
        $('#availability-text').textContent = avail.text;
        availEl.hidden = false;
      } else {
        availEl.hidden = true;
      }
    }

    // brand mark in the topbar
    var mark = $('#topbar-mark');
    if (mark) mark.textContent = initials(name);

    // photo, with monogram fallback so a missing file never looks broken
    var img = $('#avatar-img');
    var mono = $('#avatar-mono');
    if (img && mono) {
      mono.textContent = initials(name);
      var showMono = function () {
        img.hidden = true;
        mono.hidden = false;
      };
      if (CFG.profileImage && !isPlaceholder(CFG.profileImage)) {
        img.addEventListener('error', showMono, { once: true });
        img.src = CFG.profileImage;
        img.alt = name;
      } else {
        showMono();
      }
    }
  }

  /* ---------- link cards ---------- */

  function initCards() {
    var list = $('#card-list');
    if (!list) return;

    var cards = Array.isArray(CFG.cards) ? CFG.cards : [];
    var html = '';
    var index = 0;

    cards.forEach(function (card) {
      if (!card || !card.label) return;

      var href = resolveHref(card.href);
      var tone = card.tone ? ' tone-' + card.tone : ' tone-violet';
      var icon = card.icon || 'globe';
      var download = href && card.action === 'download';
      var external = href && !/^(mailto:|tel:|#)/.test(href);
      var style = '--i:' + index++;

      var attrs = [];
      if (href) {
        attrs.push('href="' + escapeHtml(href) + '"');
        if (external) {
          attrs.push('target="_blank"');
          attrs.push('rel="noopener noreferrer"');
        }
        if (download) attrs.push('download');
      } else {
        attrs.push('aria-disabled="true"');
        attrs.push('tabindex="-1"');
      }

      var desc = href
        ? (card.description || '')
        : 'Not set — add it in config.js';
      var cta = href
        ? svgIcon(download ? 'download' : 'arrow', 'card-arrow')
        : svgIcon('plus', 'card-arrow');

      html +=
        '<li class="card-item' + (card.wide ? ' is-wide' : '') + '" style="' + style + '">' +
          '<' + (href ? 'a' : 'div') + ' class="card' + tone + (href ? '' : ' is-disabled') + '" ' + attrs.join(' ') + '>' +
            '<span class="card-icon">' + svgIcon(icon) + '</span>' +
            '<span class="card-body">' +
              '<span class="card-label">' + escapeHtml(card.label) + '</span>' +
              '<span class="card-desc">' + escapeHtml(desc) + '</span>' +
            '</span>' +
            '<span class="card-cta">' + cta + '</span>' +
          '</' + (href ? 'a' : 'div') + '>' +
        '</li>';
    });

    list.innerHTML = html;

    // blocked clicks on unset cards
    list.addEventListener('click', function (e) {
      var disabled = e.target.closest ? e.target.closest('.card.is-disabled') : null;
      if (disabled) e.preventDefault();

      var websitesLink = e.target.closest ? e.target.closest('.card[href="#websites"]') : null;
      if (websitesLink) {
        e.preventDefault();
        if (window.location.hash === '#websites') renderRoute();
        else window.location.hash = 'websites';
      }
    });
  }

  /* ---------- website showcase ---------- */

  function initWebsites() {
    var list = $('#project-list');
    var empty = $('#websites-empty');
    if (!list || !empty) return;

    var websites = Array.isArray(CFG.websites) ? CFG.websites : [];
    var html = '';
    var index = 0;

    websites.forEach(function (site) {
      if (!site || typeof site.name !== 'string' || !site.name.trim()) return;
      var href = resolveWebsiteUrl(site.url);
      if (!href) return;

      var image = typeof site.image === 'string' ? site.image.trim() : '';
      if (/^(?:javascript|data|vbscript):/i.test(image)) image = '';
      var style = '--i:' + index++;

      html +=
        '<li class="project-item" style="' + style + '">' +
          '<a class="project-card" href="' + escapeHtml(href) + '" target="_blank" rel="noopener noreferrer">' +
            '<span class="project-thumb' + (image ? '' : ' has-fallback') + '">' +
              (image
                ? '<img class="project-image" src="' + escapeHtml(image) + '" alt="' + escapeHtml(site.name.trim()) + ' preview" loading="lazy">'
                : '') +
              '<span class="project-thumb-fallback" aria-hidden="true">' + svgIcon('globe') + '</span>' +
            '</span>' +
            '<span class="project-content">' +
              '<span class="project-title-row">' +
                '<span class="project-title">' + escapeHtml(site.name.trim()) + '</span>' +
                svgIcon('arrow', 'project-external') +
              '</span>' +
              '<span class="project-description">' + escapeHtml(site.description || '') + '</span>' +
              '<span class="project-live">Live Website ' + svgIcon('arrow') + '</span>' +
            '</span>' +
          '</a>' +
        '</li>';
    });

    list.innerHTML = html;
    empty.hidden = Boolean(html);
    list.hidden = !html;

    Array.prototype.forEach.call(list.querySelectorAll('.project-image'), function (img) {
      img.addEventListener('error', function () {
        img.hidden = true;
        img.parentNode.classList.add('has-fallback');
      }, { once: true });
    });
  }

  function renderRoute() {
    var showWebsites = window.location.hash === '#websites';
    var profile = $('#profile');
    var links = $('#links');
    var socials = $('#socials');
    var websites = $('#websites');

    if (profile) profile.hidden = showWebsites;
    if (links) links.hidden = showWebsites;
    if (socials) socials.hidden = showWebsites;
    if (websites) websites.hidden = !showWebsites;
    document.body.classList.toggle('is-websites', showWebsites);
    if (showWebsites) window.scrollTo(0, 0);
  }

  /* ---------- social icons ---------- */

  function initSocials() {
    var wrap = $('#socials');
    var list = $('#social-list');
    if (!wrap || !list) return;

    var socials = Array.isArray(CFG.socials) ? CFG.socials : [];
    var html = '';

    socials.forEach(function (s) {
      if (!s || !s.icon) return;
      var href = resolveHref(s.href);
      if (!href) return; // unset profiles simply do not appear

      var external = !/^(mailto:|tel:)/.test(href);
      html +=
        '<li>' +
          '<a class="social-link" href="' + escapeHtml(href) + '"' +
            (external ? ' target="_blank" rel="noopener noreferrer"' : '') +
            ' aria-label="' + escapeHtml(s.label || s.icon) + '"' +
            ' title="' + escapeHtml(s.label || s.icon) + '">' +
            svgIcon(s.icon) +
          '</a>' +
        '</li>';
    });

    if (!html) {
      wrap.hidden = true;
      return;
    }
    list.innerHTML = html;
    wrap.hidden = false;
  }

  /* ---------- footer ---------- */

  function initFooter() {
    var el = $('#footer');
    if (!el) return;

    var f = CFG.footer || {};
    var year = f.year && f.year !== 'auto' ? f.year : String(new Date().getFullYear());
    var name = isPlaceholder(CFG.name) ? 'Your Name' : CFG.name;

    var html = '<p>&copy; ' + escapeHtml(year) + ' ' + escapeHtml(name) + '. All rights reserved.</p>';
    if (f.madeWithLove !== false) {
      html += '<p>Made with <span class="heart" aria-hidden="true">&#10084;</span>' +
        '<span class="sr-only"> love</span></p>';
    }
    el.innerHTML = html;
  }

  /* ---------- boot ---------- */

  function init() {
    initTheme();
    initSeo();
    initProfile();
    initCards();
    initWebsites();
    initSocials();
    initFooter();
    window.addEventListener('hashchange', renderRoute);
    renderRoute();
    document.body.classList.add('is-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
