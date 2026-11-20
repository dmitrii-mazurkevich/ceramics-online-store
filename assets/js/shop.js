/* ==========================================================================
   Kettle & Kiln - shop logic. Vanilla JS, no dependencies.
   Cart lives in localStorage (survives a reload), every page re-renders its
   dynamic parts when the language changes.
   ========================================================================== */

(function () {
  'use strict';

  var D = window.SHOP_DATA;
  var root = document.documentElement;
  var page = document.body.getAttribute('data-page');

  var FREE_SHIP_FROM = 100;
  var SHIPPING = { courier: 8, pickup: 4 };
  var PROMOS = {
    KILN10: { type: 'percent', value: 10 },
    FREESHIP: { type: 'ship' }
  };

  /* ---------- strings that only exist in JS ------------------------------ */

  var STR = {
    en: {
      add: 'Add to cart', added: 'Added', choose: 'Choose', soldOut: 'Sold out',
      best: 'Bestseller', isNew: 'New', low: 'Only {n} left', inStock: 'In stock',
      outStock: 'Out of stock, back after the next firing', from: 'from',
      reviews: '{n} reviews', results: '{n} products', noResults: 'Nothing matches these filters.',
      reset: 'Reset filters', category: 'Category', glaze: 'Glaze', price: 'Max price',
      stockOnly: 'In stock only', any: 'Any', filters: 'Filters',
      glazeLabel: 'Glaze', sizeLabel: 'Size', qty: 'Quantity', related: 'Goes well with',
      notFound: 'This product does not exist or was removed.', backToShop: 'Back to the shop',
      cartEmpty: 'Your cart is empty.', startShopping: 'Go to the shop', remove: 'Remove',
      subtotal: 'Subtotal', discount: 'Discount', shipping: 'Shipping', total: 'Total',
      free: 'Free', shipCalc: 'calculated at checkout', toFree: 'Add {n} more for free delivery',
      freeReached: 'Free delivery unlocked', promoOk: 'Code applied', promoBad: 'This code does not work',
      promoRemove: 'remove', items: 'items', item: 'item', viewCart: 'View cart', checkout: 'Checkout',
      cartTitle: 'Your cart', close: 'Close', each: 'each',
      required: 'Please fill this in.', terms: 'Please accept the terms to continue.', email: 'Please enter a valid email.',
      orderNo: 'Order', homeCrumb: 'Shop'
    },
    ru: {
      add: 'В корзину', added: 'Добавлено', choose: 'Выбрать', soldOut: 'Нет в наличии',
      best: 'Хит', isNew: 'Новинка', low: 'Осталось {n}', inStock: 'В наличии',
      outStock: 'Нет в наличии, появится после следующего обжига', from: 'от',
      reviews: 'отзывов: {n}', results: 'Товаров: {n}', noResults: 'По этим фильтрам ничего нет.',
      reset: 'Сбросить фильтры', category: 'Категория', glaze: 'Глазурь', price: 'Цена до',
      stockOnly: 'Только в наличии', any: 'Любая', filters: 'Фильтры',
      glazeLabel: 'Глазурь', sizeLabel: 'Размер', qty: 'Количество', related: 'С этим берут',
      notFound: 'Такого товара нет или его убрали из каталога.', backToShop: 'Вернуться в магазин',
      cartEmpty: 'В корзине пока пусто.', startShopping: 'Перейти в каталог', remove: 'Удалить',
      subtotal: 'Товары', discount: 'Скидка', shipping: 'Доставка', total: 'Итого',
      free: 'Бесплатно', shipCalc: 'рассчитаем при оформлении', toFree: 'Ещё {n} до бесплатной доставки',
      freeReached: 'Доставка будет бесплатной', promoOk: 'Промокод применён', promoBad: 'Такой промокод не работает',
      promoRemove: 'убрать', items: 'товаров', item: 'товар', viewCart: 'Открыть корзину', checkout: 'Оформить заказ',
      cartTitle: 'Корзина', close: 'Закрыть', each: 'за шт.',
      required: 'Заполните это поле.', terms: 'Нужно согласие с условиями.', email: 'Введите корректный email.',
      orderNo: 'Заказ', homeCrumb: 'Магазин'
    }
  };

  function lang() { return root.getAttribute('data-lang') === 'ru' ? 'ru' : 'en'; }
  function s(key, n) { var v = (STR[lang()] || STR.en)[key] || STR.en[key] || key; return n !== undefined ? v.replace('{n}', n) : v; }
  function L(obj) { return obj[lang()] || obj.en; }
  function countWord(n) {
    if (lang() !== 'ru') return n === 1 ? 'item' : 'items';
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return 'товар';
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'товара';
    return 'товаров';
  }
  function money(n) { var v = Math.round(n * 100) / 100; return '$' + (v % 1 ? v.toFixed(2) : String(v)); }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function byId(id) { for (var i = 0; i < D.products.length; i++) if (D.products[i].id === id) return D.products[i]; return null; }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------- storage (never trusted to exist) --------------------------- */

  function load(key, fallback) {
    try { var v = JSON.parse(localStorage.getItem(key)); return v === null ? fallback : v; } catch (e) { return fallback; }
  }
  function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

  /* ---------- cart -------------------------------------------------------- */

  var cart = load('kk-cart', []);
  if (!Array.isArray(cart)) cart = [];
  cart = cart.filter(function (l) { return l && byId(l.id) && l.qty > 0; });
  var promo = load('kk-promo', null);
  if (promo && !PROMOS[promo]) promo = null;

  function unitPrice(p, sizeId) {
    var add = 0;
    (p.sizes || []).forEach(function (z) { if (z.id === sizeId) add = z.add; });
    return p.price + add;
  }
  function lineKey(l) { return l.id + '|' + (l.glaze || '') + '|' + (l.size || ''); }

  function addToCart(id, glaze, size, qty) {
    var p = byId(id);
    if (!p || p.stock < 1) return;
    var key = lineKey({ id: id, glaze: glaze, size: size });
    var line = cart.filter(function (l) { return lineKey(l) === key; })[0];
    if (line) line.qty = Math.min(line.qty + qty, p.stock);
    else cart.push({ id: id, glaze: glaze || '', size: size || '', qty: Math.min(qty, p.stock) });
    commit();
  }
  function setQty(key, qty) {
    cart.forEach(function (l) {
      if (lineKey(l) === key) l.qty = Math.max(1, Math.min(qty, byId(l.id).stock));
    });
    commit();
  }
  function removeLine(key) { cart = cart.filter(function (l) { return lineKey(l) !== key; }); commit(); }
  function clearCart() { cart = []; promo = null; save('kk-promo', null); commit(); }

  function totals(method) {
    var sub = 0, count = 0;
    cart.forEach(function (l) { sub += unitPrice(byId(l.id), l.size) * l.qty; count += l.qty; });
    var disc = 0, freeShip = false;
    if (promo && PROMOS[promo]) {
      if (PROMOS[promo].type === 'percent') disc = Math.round(sub * PROMOS[promo].value) / 100;
      if (PROMOS[promo].type === 'ship') freeShip = true;
    }
    var after = sub - disc;
    var ship = null;
    if (method) {
      ship = SHIPPING[method];
      if (freeShip || (method === 'courier' && after >= FREE_SHIP_FROM)) ship = 0;
    }
    return { sub: sub, disc: disc, ship: ship, total: after + (ship || 0), count: count, after: after, freeShip: freeShip };
  }

  function commit() {
    save('kk-cart', cart);
    renderBadge();
    renderDrawer();
    if (page === 'cart') renderCartPage();
    if (page === 'checkout') renderSummary();
  }

  /* ---------- header badge and drawer ---------------------------------- */

  function renderBadge() {
    var n = totals().count;
    $$('[data-cart-count]').forEach(function (el) { el.textContent = String(n); el.hidden = n === 0; });
  }

  var drawer = $('#cart-drawer');
  var lastFocus = null;

  function lineHtml(l, compact) {
    var p = byId(l.id), key = lineKey(l), price = unitPrice(p, l.size);
    var meta = [];
    if (l.glaze && D.glazes[l.glaze]) meta.push(L(D.glazes[l.glaze]));
    (p.sizes || []).forEach(function (z) { if (z.id === l.size) meta.push(L(z)); });
    return '<li class="line" data-key="' + esc(key) + '">' +
      '<a class="line__img" href="product.html?id=' + p.id + '" tabindex="-1" aria-hidden="true">' + D.art(p, l.glaze || p.glazes[0], 0) + '</a>' +
      '<div class="line__body">' +
        '<a class="line__name" href="product.html?id=' + p.id + '">' + esc(L(p).name) + '</a>' +
        (meta.length ? '<span class="line__meta">' + esc(meta.join(' · ')) + '</span>' : '') +
        '<div class="line__row">' +
          '<div class="stepper stepper--sm" role="group" aria-label="' + s('qty') + '">' +
            '<button type="button" data-step="-1" aria-label="-1"' + (l.qty <= 1 ? ' disabled' : '') + '>−</button>' +
            '<span aria-live="polite">' + l.qty + '</span>' +
            '<button type="button" data-step="1" aria-label="+1"' + (l.qty >= p.stock ? ' disabled' : '') + '>+</button>' +
          '</div>' +
          '<button type="button" class="line__remove" data-remove>' + s('remove') + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="line__price">' + money(price * l.qty) + (l.qty > 1 && !compact ? '<span>' + money(price) + ' ' + s('each') + '</span>' : '') + '</div>' +
    '</li>';
  }

  function bindLines(container) {
    container.addEventListener('click', function (e) {
      var li = e.target.closest('.line');
      if (!li) return;
      var key = li.getAttribute('data-key');
      var line = cart.filter(function (l) { return lineKey(l) === key; })[0];
      if (!line) return;
      var step = e.target.closest('[data-step]');
      if (step) { setQty(key, line.qty + parseInt(step.getAttribute('data-step'), 10)); focusAfter(container, key, step.getAttribute('data-step')); }
      if (e.target.closest('[data-remove]')) removeLine(key);
    });
  }
  function focusAfter(container, key, step) {
    var li = $$('.line', container).filter(function (x) { return x.getAttribute('data-key') === key; })[0];
    var btn = li && li.querySelector('[data-step="' + step + '"]');
    if (btn && !btn.disabled) btn.focus();
  }

  function shipHint(t) {
    if (t.freeShip || t.after >= FREE_SHIP_FROM) return '<p class="ship-hint is-done">' + s('freeReached') + '</p>';
    var pct = Math.min(100, Math.round(t.after / FREE_SHIP_FROM * 100));
    return '<p class="ship-hint">' + s('toFree', money(FREE_SHIP_FROM - t.after)) + '</p>' +
      '<div class="ship-bar" aria-hidden="true"><span style="width:' + pct + '%"></span></div>';
  }

  function renderDrawer() {
    if (!drawer) return;
    var body = $('.drawer__body', drawer), foot = $('.drawer__foot', drawer);
    var t = totals();
    $('.drawer__title', drawer).textContent = s('cartTitle') + (t.count ? ' (' + t.count + ')' : '');
    if (!cart.length) {
      body.innerHTML = '<p class="empty">' + s('cartEmpty') + '</p>';
      foot.innerHTML = '<a class="btn btn--block" href="catalog.html">' + s('startShopping') + '</a>';
      return;
    }
    body.innerHTML = '<ul class="lines lines--compact">' + cart.map(function (l) { return lineHtml(l, true); }).join('') + '</ul>';
    foot.innerHTML = shipHint(t) +
      '<div class="sum-row"><span>' + s('subtotal') + '</span><b>' + money(t.sub) + '</b></div>' +
      '<a class="btn btn--block" href="checkout.html">' + s('checkout') + '</a>' +
      '<a class="btn btn--ghost btn--block" href="cart.html">' + s('viewCart') + '</a>';
  }

  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.hidden = false;
    requestAnimationFrame(function () { drawer.classList.add('is-open'); });
    document.body.style.overflow = 'hidden';
    var c = $('.drawer__close', drawer); if (c) c.focus();
  }
  function closeDrawer() {
    if (!drawer || drawer.hidden) return;
    drawer.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function () { drawer.hidden = true; }, 220);
    if (lastFocus) lastFocus.focus();
  }

  if (drawer) {
    bindLines($('.drawer__body', drawer));
    drawer.addEventListener('click', function (e) { if (e.target === drawer || e.target.closest('.drawer__close')) closeDrawer(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer();
      if (e.key === 'Tab' && !drawer.hidden) {
        var f = $$('a, button:not([disabled]), input', $('.drawer__panel', drawer));
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
  }
  $$('[data-open-cart]').forEach(function (b) {
    b.addEventListener('click', function (e) { if (page !== 'cart') { e.preventDefault(); openDrawer(); } });
  });

  /* ---------- product card ------------------------------------------------ */

  function badges(p) {
    var b = [];
    if (p.stock < 1) b.push('<span class="tag tag--muted">' + s('soldOut') + '</span>');
    else if (p.stock <= 3) b.push('<span class="tag tag--warn">' + s('low', p.stock) + '</span>');
    if (p.tags.indexOf('best') > -1) b.push('<span class="tag">' + s('best') + '</span>');
    if (p.tags.indexOf('new') > -1) b.push('<span class="tag tag--new">' + s('isNew') + '</span>');
    return b.length ? '<div class="tags">' + b.join('') + '</div>' : '';
  }
  function swatches(p, active) {
    if (!p.glazes.length) return '';
    return '<ul class="swatches" aria-label="' + s('glaze') + '">' + p.glazes.map(function (g) {
      return '<li><span class="swatch' + (g === active ? ' is-active' : '') + '" style="--sw:' + D.glazes[g].hex + '" title="' + esc(L(D.glazes[g])) + '"></span></li>';
    }).join('') + '</ul>';
  }

  function card(p) {
    var hasOptions = (p.sizes && p.sizes.length) || p.glazes.length > 1;
    var btn = p.stock < 1
      ? '<button class="btn btn--ghost btn--sm" type="button" disabled>' + s('soldOut') + '</button>'
      : hasOptions
        ? '<a class="btn btn--ghost btn--sm" href="product.html?id=' + p.id + '">' + s('choose') + '</a>'
        : '<button class="btn btn--sm" type="button" data-quick-add="' + p.id + '">' + s('add') + '</button>';
    return '<article class="pcard">' +
      '<a class="pcard__img" href="product.html?id=' + p.id + '" aria-label="' + esc(L(p).name) + '">' + D.art(p, p.glazes[0], 0) + badges(p) + '</a>' +
      '<div class="pcard__body">' +
        '<h3 class="pcard__name"><a href="product.html?id=' + p.id + '">' + esc(L(p).name) + '</a></h3>' +
        '<p class="pcard__short">' + esc(L(p).short) + '</p>' +
        '<div class="pcard__row">' +
          '<span class="pcard__price">' + (p.sizes ? '<small>' + s('from') + '</small> ' : '') + money(p.price) + '</span>' +
          swatches(p, p.glazes[0]) +
        '</div>' +
        btn +
      '</div>' +
    '</article>';
  }

  document.addEventListener('click', function (e) {
    var q = e.target.closest('[data-quick-add]');
    if (!q) return;
    var p = byId(q.getAttribute('data-quick-add'));
    addToCart(p.id, p.glazes[0] || '', p.sizes ? p.sizes[0].id : '', 1);
    q.textContent = s('added');
    setTimeout(function () { q.textContent = s('add'); }, 1200);
    openDrawer();
  });

  /* ---------- home ------------------------------------------------------- */

  function renderHome() {
    var grid = $('[data-grid="best"]');
    if (grid) grid.innerHTML = D.products.filter(function (p) { return p.tags.indexOf('best') > -1; }).slice(0, 4).map(card).join('');
    var cats = $('[data-cats]');
    if (cats) {
      cats.innerHTML = Object.keys(D.categories).map(function (c) {
        var first = D.products.filter(function (p) { return p.cat === c; })[0];
        var n = D.products.filter(function (p) { return p.cat === c; }).length;
        return '<a class="catcard" href="catalog.html?cat=' + c + '">' + D.art(first, first.glazes[1] || first.glazes[0], 1) +
          '<span class="catcard__name">' + esc(L(D.categories[c])) + '<small>' + n + '</small></span></a>';
      }).join('');
    }
  }

  /* ---------- catalogue -------------------------------------------------- */

  var MAX_PRICE = Math.max.apply(null, D.products.map(function (p) { return p.price; }));
  var state = { cat: [], glaze: [], max: MAX_PRICE, stock: false, sort: 'featured', q: '' };

  function readUrl() {
    var u = new URLSearchParams(location.search);
    state.cat = (u.get('cat') || '').split(',').filter(function (c) { return D.categories[c]; });
    state.glaze = (u.get('glaze') || '').split(',').filter(function (g) { return D.glazes[g]; });
    var m = parseInt(u.get('max'), 10); state.max = m > 0 ? Math.min(m, MAX_PRICE) : MAX_PRICE;
    state.stock = u.get('stock') === '1';
    state.sort = u.get('sort') || 'featured';
    state.q = (u.get('q') || '').slice(0, 60);
  }
  function writeUrl() {
    var u = new URLSearchParams(location.search);
    var set = function (k, v) { if (v) u.set(k, v); else u.delete(k); };
    set('cat', state.cat.join(',')); set('glaze', state.glaze.join(','));
    set('max', state.max < MAX_PRICE ? String(state.max) : ''); set('stock', state.stock ? '1' : '');
    set('sort', state.sort !== 'featured' ? state.sort : ''); set('q', state.q);
    var qs = u.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }

  function filtered() {
    var q = state.q.trim().toLowerCase();
    var list = D.products.filter(function (p) {
      if (state.cat.length && state.cat.indexOf(p.cat) === -1) return false;
      if (state.glaze.length && !p.glazes.some(function (g) { return state.glaze.indexOf(g) > -1; })) return false;
      if (p.price > state.max) return false;
      if (state.stock && p.stock < 1) return false;
      if (q && (p.en.name + ' ' + p.ru.name + ' ' + p.en.short + ' ' + p.ru.short).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
    var sorters = {
      'price-asc': function (a, b) { return a.price - b.price; },
      'price-desc': function (a, b) { return b.price - a.price; },
      'new': function (a, b) { return a.date < b.date ? 1 : -1; },
      'rating': function (a, b) { return b.rating - a.rating; }
    };
    if (sorters[state.sort]) list.sort(sorters[state.sort]);
    return list;
  }

  function renderFilters() {
    var box = $('[data-filters]');
    if (!box) return;
    var catHtml = Object.keys(D.categories).map(function (c) {
      return '<label class="check"><input type="checkbox" name="cat" value="' + c + '"' + (state.cat.indexOf(c) > -1 ? ' checked' : '') + '><span>' + esc(L(D.categories[c])) + '</span></label>';
    }).join('');
    var glazeHtml = Object.keys(D.glazes).map(function (g) {
      return '<label class="swatch-check"><input type="checkbox" name="glaze" value="' + g + '"' + (state.glaze.indexOf(g) > -1 ? ' checked' : '') + '>' +
        '<span class="swatch" style="--sw:' + D.glazes[g].hex + '"></span><span>' + esc(L(D.glazes[g])) + '</span></label>';
    }).join('');
    box.innerHTML =
      '<fieldset><legend>' + s('category') + '</legend>' + catHtml + '</fieldset>' +
      '<fieldset><legend>' + s('glaze') + '</legend><div class="swatch-grid">' + glazeHtml + '</div></fieldset>' +
      '<fieldset><legend><label for="f-max">' + s('price') + ': <output id="f-max-out">' + money(state.max) + '</output></label></legend>' +
        '<input type="range" id="f-max" name="max" min="15" max="' + MAX_PRICE + '" step="1" value="' + state.max + '"></fieldset>' +
      '<fieldset><label class="check"><input type="checkbox" name="stock"' + (state.stock ? ' checked' : '') + '><span>' + s('stockOnly') + '</span></label></fieldset>' +
      '<button type="button" class="btn btn--ghost btn--block" data-reset>' + s('reset') + '</button>';
  }

  function renderGrid() {
    var grid = $('[data-grid="catalog"]');
    if (!grid) return;
    var list = filtered();
    $('[data-results]').textContent = s('results', list.length);
    grid.innerHTML = list.length ? list.map(card).join('')
      : '<div class="empty-state"><p>' + s('noResults') + '</p><button type="button" class="btn" data-reset>' + s('reset') + '</button></div>';
    var active = state.cat.length + state.glaze.length + (state.stock ? 1 : 0) + (state.max < MAX_PRICE ? 1 : 0);
    $$('[data-filter-count]').forEach(function (el) { el.textContent = active ? '(' + active + ')' : ''; });
  }

  function initCatalog() {
    readUrl();
    var sort = $('#sort'), search = $('#search');
    if (sort) sort.value = state.sort;
    if (search) search.value = state.q;
    renderFilters(); renderGrid();

    var box = $('[data-filters]');
    box.addEventListener('change', function (e) {
      var t = e.target;
      if (t.name === 'cat' || t.name === 'glaze') {
        state[t.name] = $$('input[name="' + t.name + '"]:checked', box).map(function (x) { return x.value; });
      }
      if (t.name === 'stock') state.stock = t.checked;
      if (t.name === 'max') state.max = parseInt(t.value, 10);
      writeUrl(); renderGrid();
    });
    box.addEventListener('input', function (e) {
      if (e.target.name !== 'max') return;
      state.max = parseInt(e.target.value, 10);
      $('#f-max-out').textContent = money(state.max);
      writeUrl(); renderGrid();
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('[data-reset]')) return;
      state = { cat: [], glaze: [], max: MAX_PRICE, stock: false, sort: state.sort, q: '' };
      if (search) search.value = '';
      writeUrl(); renderFilters(); renderGrid();
    });
    if (sort) sort.addEventListener('change', function () { state.sort = sort.value; writeUrl(); renderGrid(); });
    if (search) search.addEventListener('input', function () { state.q = search.value; writeUrl(); renderGrid(); });

    var toggle = $('[data-filters-toggle]'), panel = $('.filters-panel');
    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        var open = toggle.getAttribute('aria-expanded') !== 'true';
        toggle.setAttribute('aria-expanded', String(open));
        panel.classList.toggle('is-open', open);
      });
    }
  }

  /* ---------- product page ------------------------------------------------ */

  var pstate = null;

  function renderProduct() {
    var box = $('[data-product]');
    if (!box) return;
    var id = new URLSearchParams(location.search).get('id');
    var p = byId(id);
    if (!p) {
      box.innerHTML = '<div class="empty-state"><p>' + s('notFound') + '</p><a class="btn" href="catalog.html">' + s('backToShop') + '</a></div>';
      return;
    }
    if (!pstate || pstate.id !== p.id) pstate = { id: p.id, glaze: p.glazes[0] || '', size: p.sizes ? p.sizes[0].id : '', qty: 1, view: 0 };
    var price = unitPrice(p, pstate.size);
    var t = L(p);
    document.title = t.name + ' | Kettle & Kiln';

    var thumbs = [0, 1, 2].map(function (v) {
      return '<button type="button" class="thumb' + (v === pstate.view ? ' is-active' : '') + '" data-view="' + v + '" aria-label="' + (v + 1) + '/3" aria-pressed="' + (v === pstate.view) + '">' + D.art(p, pstate.glaze, v) + '</button>';
    }).join('');

    var glazeOpts = p.glazes.length ? '<fieldset class="opt"><legend>' + s('glazeLabel') + ': <b>' + esc(L(D.glazes[pstate.glaze])) + '</b></legend><div class="opt__row">' +
      p.glazes.map(function (g) {
        return '<label class="swatch-radio"><input type="radio" name="glaze" value="' + g + '"' + (g === pstate.glaze ? ' checked' : '') + '>' +
          '<span class="swatch swatch--lg" style="--sw:' + D.glazes[g].hex + '"></span><span class="visually-hidden">' + esc(L(D.glazes[g])) + '</span></label>';
      }).join('') + '</div></fieldset>' : '';

    var sizeOpts = p.sizes ? '<fieldset class="opt"><legend>' + s('sizeLabel') + '</legend><div class="opt__row">' +
      p.sizes.map(function (z) {
        return '<label class="pill"><input type="radio" name="size" value="' + z.id + '"' + (z.id === pstate.size ? ' checked' : '') + '><span>' + esc(L(z)) + (z.add ? ' +' + money(z.add) : '') + '</span></label>';
      }).join('') + '</div></fieldset>' : '';

    var stockLine = p.stock < 1 ? '<p class="stock stock--out">' + s('outStock') + '</p>'
      : p.stock <= 3 ? '<p class="stock stock--low">' + s('low', p.stock) + '</p>'
      : '<p class="stock">' + s('inStock') + '</p>';

    var related = D.products.filter(function (x) { return x.id !== p.id && (x.cat === p.cat || (p.cat === 'teapots' && x.cat === 'tea') || (p.cat === 'tea' && x.cat === 'teapots')); }).slice(0, 4);

    box.innerHTML =
      '<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">' + s('homeCrumb') + '</a><span aria-hidden="true">/</span>' +
        '<a href="catalog.html?cat=' + p.cat + '">' + esc(L(D.categories[p.cat])) + '</a><span aria-hidden="true">/</span><span>' + esc(t.name) + '</span></nav>' +
      '<div class="product">' +
        '<div class="gallery"><div class="gallery__main">' + D.art(p, pstate.glaze, pstate.view) + badges(p) + '</div><div class="gallery__thumbs">' + thumbs + '</div></div>' +
        '<div class="buybox">' +
          '<h1 class="buybox__name">' + esc(t.name) + '</h1>' +
          '<p class="buybox__rating"><span aria-hidden="true">★</span> ' + p.rating.toFixed(1) + ' · ' + s('reviews', p.reviews) + '</p>' +
          '<p class="buybox__price" aria-live="polite">' + money(price) + '</p>' +
          '<p class="buybox__short">' + esc(t.short) + '</p>' +
          '<form class="buyform" data-buy novalidate>' + glazeOpts + sizeOpts +
            '<div class="buyform__row">' +
              '<div class="stepper" role="group" aria-label="' + s('qty') + '"><button type="button" data-q="-1" aria-label="-1"' + (pstate.qty <= 1 ? ' disabled' : '') + '>−</button>' +
                '<span aria-live="polite">' + pstate.qty + '</span><button type="button" data-q="1" aria-label="+1"' + (pstate.qty >= p.stock ? ' disabled' : '') + '>+</button></div>' +
              '<button class="btn btn--grow" type="submit"' + (p.stock < 1 ? ' disabled' : '') + '>' + (p.stock < 1 ? s('soldOut') : s('add') + ' · ' + money(price * pstate.qty)) + '</button>' +
            '</div>' + stockLine +
          '</form>' +
          '<div class="buybox__desc"><p>' + esc(t.desc) + '</p></div>' +
          '<details class="acc"><summary data-i18n-static>' + (lang() === 'ru' ? 'Уход' : 'Care') + '</summary><p>' +
            (lang() === 'ru' ? 'Можно в посудомоечную машину и микроволновку. Не ставьте на открытый огонь и не переносите из холода сразу в кипяток.' : 'Dishwasher and microwave safe. Not for open flame, and avoid going straight from cold to boiling water.') + '</p></details>' +
          '<details class="acc"><summary>' + (lang() === 'ru' ? 'Доставка и возврат' : 'Delivery and returns') + '</summary><p>' +
            (lang() === 'ru' ? 'Курьер - $8, бесплатно от $100. Пункт выдачи - $4. Разбилось в пути - заменим бесплатно, нужно только фото. Вернуть целый товар можно в течение 14 дней.' : 'Courier $8, free from $100. Pickup point $4. Broken in transit - we replace it for free, just send a photo. Unused items can be returned within 14 days.') + '</p></details>' +
        '</div>' +
      '</div>' +
      (related.length ? '<section class="related"><h2 class="h2">' + s('related') + '</h2><div class="grid grid--4">' + related.map(card).join('') + '</div></section>' : '');

    // Structured data so search engines can show price and stock.
    var ld = $('#ld-product');
    if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ld-product'; document.head.appendChild(ld); }
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: t.name, description: t.short, sku: p.id,
      brand: { '@type': 'Brand', name: 'Kettle & Kiln' },
      aggregateRating: { '@type': 'AggregateRating', ratingValue: p.rating, reviewCount: p.reviews },
      offers: { '@type': 'Offer', priceCurrency: 'USD', price: price, availability: 'https://schema.org/' + (p.stock > 0 ? 'InStock' : 'OutOfStock') }
    });
  }

  function initProduct() {
    renderProduct();
    var box = $('[data-product]');
    box.addEventListener('change', function (e) {
      if (!pstate) return;
      if (e.target.name === 'glaze') pstate.glaze = e.target.value;
      if (e.target.name === 'size') pstate.size = e.target.value;
      var name = e.target.name, val = e.target.value;
      renderProduct();
      var again = $('input[name="' + name + '"][value="' + val + '"]', box); if (again) again.focus();
    });
    box.addEventListener('click', function (e) {
      if (!pstate) return;
      var v = e.target.closest('[data-view]');
      if (v) { pstate.view = parseInt(v.getAttribute('data-view'), 10); renderProduct(); var b = $('[data-view="' + pstate.view + '"]', box); if (b) b.focus(); }
      var q = e.target.closest('[data-q]');
      if (q) {
        var p = byId(pstate.id);
        pstate.qty = Math.max(1, Math.min(p.stock, pstate.qty + parseInt(q.getAttribute('data-q'), 10)));
        var dir = q.getAttribute('data-q');
        renderProduct();
        var nb = $('[data-q="' + dir + '"]', box); if (nb && !nb.disabled) nb.focus();
      }
    });
    box.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!pstate) return;
      addToCart(pstate.id, pstate.glaze, pstate.size, pstate.qty);
      pstate.qty = 1;
      renderProduct();
      openDrawer();
    });
  }

  /* ---------- cart page ---------------------------------------------------- */

  function summaryHtml(method, showPromo) {
    var t = totals(method);
    var shipCell = method ? (t.ship === 0 ? s('free') : money(t.ship)) : (t.freeShip || t.after >= FREE_SHIP_FROM ? s('free') : s('shipCalc'));
    return '<div class="sum-row"><span>' + s('subtotal') + ' · ' + t.count + ' ' + countWord(t.count) + '</span><b>' + money(t.sub) + '</b></div>' +
      (t.disc ? '<div class="sum-row sum-row--disc"><span>' + s('discount') + ' (' + promo + ')</span><b>−' + money(t.disc) + '</b></div>' : '') +
      '<div class="sum-row"><span>' + s('shipping') + '</span><b>' + shipCell + '</b></div>' +
      '<div class="sum-row sum-row--total"><span>' + s('total') + '</span><b>' + money(t.total) + '</b></div>' +
      (showPromo ? promoHtml() : '');
  }
  function promoHtml() {
    if (promo) return '<p class="promo-ok">' + s('promoOk') + ': <b>' + promo + '</b> <button type="button" class="linkbtn" data-promo-remove>' + s('promoRemove') + '</button></p>';
    return '<form class="promo" data-promo novalidate><label class="visually-hidden" for="promo">Promo</label>' +
      '<input id="promo" name="promo" autocomplete="off" placeholder="' + (lang() === 'ru' ? 'Промокод' : 'Promo code') + '">' +
      '<button class="btn btn--ghost btn--sm" type="submit">OK</button><p class="promo-msg" role="status"></p></form>';
  }
  function bindPromo(container, rerender) {
    container.addEventListener('submit', function (e) {
      if (!e.target.matches('[data-promo]')) return;
      e.preventDefault();
      var code = e.target.promo.value.trim().toUpperCase();
      if (PROMOS[code]) { promo = code; save('kk-promo', promo); rerender(); }
      else { $('.promo-msg', e.target).textContent = s('promoBad'); }
    });
    container.addEventListener('click', function (e) {
      if (!e.target.closest('[data-promo-remove]')) return;
      promo = null; save('kk-promo', null); rerender();
    });
  }

  function renderCartPage() {
    var box = $('[data-cart]');
    if (!box) return;
    if (!cart.length) {
      box.innerHTML = '<div class="empty-state"><p>' + s('cartEmpty') + '</p><a class="btn" href="catalog.html">' + s('startShopping') + '</a></div>';
      return;
    }
    box.innerHTML = '<div class="cart-layout"><ul class="lines">' + cart.map(function (l) { return lineHtml(l, false); }).join('') + '</ul>' +
      '<aside class="summary">' + shipHint(totals()) + summaryHtml(null, true) +
      '<a class="btn btn--block" href="checkout.html">' + s('checkout') + '</a></aside></div>';
  }

  /* ---------- checkout ------------------------------------------------------ */

  var co = { step: 1, method: 'courier' };

  function renderSummary() {
    var box = $('[data-summary]');
    if (!box) return;
    if (!cart.length && co.step < 4) {
      var form = $('[data-checkout]'); if (form) form.hidden = true;
      box.innerHTML = '<div class="empty-state"><p>' + s('cartEmpty') + '</p><a class="btn" href="catalog.html">' + s('startShopping') + '</a></div>';
      return;
    }
    box.innerHTML = '<ul class="lines lines--compact lines--static">' + cart.map(function (l) {
      var p = byId(l.id);
      return '<li class="line"><span class="line__img">' + D.art(p, l.glaze || p.glazes[0], 0) + '<i>' + l.qty + '</i></span>' +
        '<div class="line__body"><span class="line__name">' + esc(L(p).name) + '</span>' +
        (l.glaze ? '<span class="line__meta">' + esc(L(D.glazes[l.glaze])) + '</span>' : '') + '</div>' +
        '<div class="line__price">' + money(unitPrice(p, l.size) * l.qty) + '</div></li>';
    }).join('') + '</ul>' + summaryHtml(co.step >= 2 ? co.method : null, co.step < 4);
  }

  function showStep(n) {
    co.step = n;
    $$('[data-step-panel]').forEach(function (el) { el.hidden = parseInt(el.getAttribute('data-step-panel'), 10) !== n; });
    $$('.steps li').forEach(function (li, i) {
      li.classList.toggle('is-done', i + 1 < n);
      if (i + 1 === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    renderSummary();
    var panel = $('[data-step-panel="' + n + '"]');
    var h = panel && panel.querySelector('h2');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    var top = $('.steps'); if (top && window.scrollY > top.offsetTop) top.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function validate(panel) {
    var ok = true, first = null;
    $$('input[required], select[required]', panel).forEach(function (f) {
      if (f.closest('[hidden]')) return;
      var v = f.type === 'checkbox' ? (f.checked ? '1' : '') : f.value.trim(), msg = '';
      if (!v) msg = f.type === 'checkbox' ? s('terms') : s('required');
      else if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = s('email');
      var wrap = f.closest('.field') || (f.closest('.check') && f.closest('.check').nextElementSibling);
      var err = wrap && wrap.querySelector('.error');
      if (err) err.textContent = msg;
      f.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (msg) { ok = false; if (!first) first = f; }
    });
    if (first) first.focus();
    return ok;
  }

  function initCheckout() {
    var form = $('[data-checkout]');
    if (!form) return;
    renderSummary();
    bindPromo($('[data-summary]'), renderSummary);

    form.addEventListener('click', function (e) {
      var next = e.target.closest('[data-next]'), back = e.target.closest('[data-back]');
      if (next) {
        var panel = $('[data-step-panel="' + co.step + '"]');
        if (validate(panel)) showStep(co.step + 1);
      }
      if (back) showStep(co.step - 1);
    });
    form.addEventListener('change', function (e) {
      if (e.target.name === 'method') {
        co.method = e.target.value;
        $$('[data-for-method]', form).forEach(function (el) { el.hidden = el.getAttribute('data-for-method') !== co.method; });
        renderSummary();
      }
    });
    form.addEventListener('input', function (e) {
      var wrap = e.target.closest('.field') || (e.target.closest('.check') && e.target.closest('.check').nextElementSibling);
      if (wrap && e.target.getAttribute('aria-invalid') === 'true') { var err = wrap.querySelector('.error'); if (err) err.textContent = ''; e.target.setAttribute('aria-invalid', 'false'); }
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (co.step !== 3 || !validate($('[data-step-panel="3"]'))) return;
      var t = totals(co.method);
      var no = 'KK-' + String(Math.floor(1000 + Math.random() * 9000));
      var email = form.email.value.trim();
      var done = $('[data-done]');
      $('[data-order-no]', done).textContent = no;
      $('[data-order-total]', done).textContent = money(t.total);
      $('[data-order-email]', done).textContent = email;
      try { sessionStorage.setItem('kk-last-order', JSON.stringify({ no: no, total: t.total, lines: cart })); } catch (err) {}
      co.step = 4;
      form.hidden = true;
      $('.steps').hidden = true;
      done.hidden = false;
      clearCart();
      $('[data-summary]').innerHTML = '';
      var h = $('h2', done); h.setAttribute('tabindex', '-1'); h.focus();
    });
  }

  /* ---------- boot ----------------------------------------------------------- */

  function renderAll() {
    renderBadge(); renderDrawer();
    if (page === 'home') renderHome();
    if (page === 'catalog') { renderFilters(); renderGrid(); }
    if (page === 'product') renderProduct();
    if (page === 'cart') renderCartPage();
    if (page === 'checkout') renderSummary();
  }

  if (page === 'catalog') initCatalog();
  if (page === 'product') initProduct();
  if (page === 'cart') { renderCartPage(); bindLines($('[data-cart]')); bindPromo($('[data-cart]'), renderCartPage); }
  if (page === 'checkout') initCheckout();
  renderAll();
  document.addEventListener('languagechange', renderAll);

  // Keep several tabs in sync.
  window.addEventListener('storage', function (e) {
    if (e.key === 'kk-cart') { cart = load('kk-cart', []); renderAll(); }
  });
})();
