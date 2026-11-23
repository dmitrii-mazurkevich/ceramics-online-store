/* ==========================================================================
   i18n - EN in the markup, RU in the dictionary below.
   Same engine as the portfolio hub (sites/01-portfolio-hub/assets/js/i18n.js).
   ========================================================================== */

(function () {
  'use strict';

  var LANGS = ['en', 'ru'];
  var DEFAULT = 'en';

  var DICT = {
    ru: {
      'nav.skip': 'Перейти к содержимому',
      'nav.all': 'Весь каталог',
      'nav.teaware': 'Для чая',
      'nav.table': 'Посуда',
      'nav.tea': 'Чай',
      'nav.delivery': 'Доставка',
      'nav.menu': 'Меню',
      'nav.cart': 'Корзина',
      'nav.close': 'Закрыть',
      'demo.text': ' Заказы не создаются, оплата не списывается.',
      'demo.link': 'Вернуться в портфолио',
      'top.text': 'Бесплатная доставка от <b>$100</b> · Разбилось в пути? Заменим бесплатно',
      'foot.about': 'Керамика небольшими партиями и листовой чай. Делаем, глазуруем и обжигаем в своей мастерской, упаковываем теми же руками.',
      'foot.shop': 'Магазин',
      'foot.help': 'Помощь',
      'foot.cart': 'Корзина',
      'foot.concept': 'Сайт сделал <a href="https://dmitriiwebcraft.com">Дмитрий Мазуркевич</a>.',

      'home.metaTitle': 'Kettle & Kiln - керамика ручной работы и листовой чай',
      'home.metaDesc': 'Кружки, чайники и миски небольшими партиями из нашей мастерской и листовой чай к ним. Бесплатная доставка от $100, разбитое заменим бесплатно.',
      'home.eyebrow': 'Весенний обжиг уже в продаже',
      'home.title': 'Керамика для <em>неспешного чая</em>',
      'home.heroAlt': 'Руки мастера формуют чашу на гончарном круге',
      'home.lede': 'Кружки, чайники и миски, которые мы делаем небольшими партиями в своей мастерской, и листовой чай к ним. Каждая вещь немного отличается от другой, и в этом весь смысл.',
      'home.cta1': 'Смотреть коллекцию',
      'home.cta2': 'Выбрать чай',
      'home.uspAria': 'Почему у нас',
      'home.u1t': 'Ручная работа',
      'home.u1d': 'делаем и глазуруем в своей мастерской',
      'home.u2t': 'Бесплатная доставка',
      'home.u2d': 'для заказов от $100',
      'home.u3t': 'Бой за наш счёт',
      'home.u3d': 'заменим бесплатно, нужно только фото',
      'home.u4t': 'Возврат 14 дней',
      'home.u4d': 'для всего, чем не пользовались',
      'home.catTitle': 'Категории',
      'home.all': 'Все товары',
      'home.bestTitle': 'Любимое покупателями',
      'home.bestAll': 'Все по рейтингу',
      'home.storyEyebrow': 'Из мастерской',
      'home.storyTitle': 'Три обжига и одни руки',
      'home.storyText': 'Каждую вещь мы формуем на круге, неделю сушим, делаем первый обжиг, глазуруем окунанием и обжигаем ещё раз при 1240 °C. Партии маленькие, поэтому глазурь может закончиться и вернуться через месяц в чуть другом оттенке.',
      'home.s1t': 'Формовка и обточка',
      'home.s1d': 'на круге, вручную',
      'home.s2t': 'Первый обжиг',
      'home.s2d': 'чтобы глина стала прочной',
      'home.s3t': 'Глазурь и обжиг',
      'home.s3d': 'при 1240 °C, безопасно для еды',
      'home.delTitle': 'Доставка и возврат',
      'home.d1t': 'Курьер',
      'home.d1d': '$8, бесплатно от $100. От двух до четырёх рабочих дней.',
      'home.d2t': 'Пункт выдачи',
      'home.d2d': '$4. Пункт выбираете при оформлении, код пришлём, когда заказ приедет.',
      'home.d3t': 'Если что-то разбилось',
      'home.d3d': 'Пришлите фото в течение 48 часов, и мы отправим замену. Осколки возвращать не нужно.',
      'home.d4t': 'Возврат',
      'home.d4d': 'Неиспользованные вещи - в течение 14 дней. Чай можно вернуть, если пачка не вскрыта.',

      'cat.metaTitle': 'Каталог - Kettle & Kiln',
      'cat.metaDesc': 'Кружки, чайники, миски, тарелки и вазы ручной работы и листовой чай. Фильтр по категории, глазури и цене.',
      'cat.title': 'Каталог',
      'cat.search': 'Поиск',
      'cat.searchPh': 'Поиск: кружка, чайник, сенча',
      'cat.sort': 'Сортировка',
      'cat.sFeatured': 'Рекомендуем',
      'cat.sRating': 'По рейтингу',
      'cat.sNew': 'Сначала новые',
      'cat.sAsc': 'Сначала дешевле',
      'cat.sDesc': 'Сначала дороже',
      'cat.filters': 'Фильтры',

      'prod.metaTitle': 'Товар - Kettle & Kiln',
      'prod.metaDesc': 'Керамика ручной работы Kettle & Kiln: глазурь и размер на выбор, уход и доставка.',

      'cart.metaTitle': 'Корзина - Kettle & Kiln',
      'cart.metaDesc': 'Ваша корзина в Kettle & Kiln.',
      'cart.title': 'Корзина',
      'cart.hint': 'Попробуйте промокоды <code>KILN10</code> (скидка 10%) и <code>FREESHIP</code>.',

      'co.metaTitle': 'Оформление заказа - Kettle & Kiln',
      'co.metaDesc': 'Оформление заказа в Kettle & Kiln.',
      'co.title': 'Оформление заказа',
      'co.stepsAria': 'Шаги оформления',
      'co.s1': 'Контакты',
      'co.s2': 'Доставка',
      'co.s3': 'Оплата',
      'co.s1h': 'Как с вами связаться?',
      'co.email': 'Email',
      'co.fname': 'Имя',
      'co.lname': 'Фамилия',
      'co.phone': 'Телефон',
      'co.optional': '(необязательно, для курьера)',
      'co.backCart': 'Вернуться в корзину',
      'co.next': 'Дальше',
      'co.back': 'Назад',
      'co.s2h': 'Куда отправить?',
      'co.method': 'Способ доставки',
      'co.m1': 'Курьер до двери',
      'co.m1d': '2-4 рабочих дня · $8, бесплатно от $100',
      'co.m2': 'Пункт выдачи',
      'co.m2d': '3-5 рабочих дней · $4',
      'co.address': 'Улица и дом',
      'co.city': 'Город',
      'co.zip': 'Индекс',
      'co.point': 'Пункт выдачи',
      'co.pointChoose': 'Выберите пункт',
      'co.p1': 'Центральный рынок, Вокзальная, 12',
      'co.p2': 'ТЦ «Набережная», 1 этаж',
      'co.p3': 'Северный парк, Вязовая, 4',
      'co.s3h': 'Оплата',
      'co.payment': 'Способ оплаты',
      'co.pay1': 'Картой онлайн',
      'co.pay1d': 'На настоящем сайте здесь откроется защищённая страница платёжного сервиса',
      'co.pay2': 'При получении',
      'co.pay2d': 'Картой или наличными курьеру',
      'co.terms': 'Согласен с условиями доставки и возврата',
      'co.demoNote': 'Оплата только после подтверждения заказа.',
      'co.place': 'Оформить заказ',
      'co.doneT': 'Спасибо, заказ принят',
      'co.doneNo': 'Номер заказа',
      'co.doneTotal': 'сумма',
      'co.doneMail': 'В настоящем магазине подтверждение пришло бы на',
      'co.doneBack': 'Вернуться в магазин',
      'co.summary': 'Состав заказа'
    }
  };

  /* ---------- engine --------------------------------------------------- */

  var root = document.documentElement;
  var originals = null;

  function selectorNodes() {
    return document.querySelectorAll('[data-i18n], [data-i18n-html], [data-i18n-attr]');
  }

  function cacheOriginals() {
    if (originals) return;
    originals = [];
    Array.prototype.forEach.call(selectorNodes(), function (el) {
      var rec = { el: el };
      if (el.hasAttribute('data-i18n')) rec.text = el.textContent;
      if (el.hasAttribute('data-i18n-html')) rec.html = el.innerHTML;
      if (el.hasAttribute('data-i18n-attr')) {
        rec.attrs = {};
        el.getAttribute('data-i18n-attr').split('|').forEach(function (pair) {
          var attr = pair.split(':')[0].trim();
          rec.attrs[attr] = el.getAttribute(attr);
        });
      }
      originals.push(rec);
    });
  }

  function restore() {
    originals.forEach(function (rec) {
      if (rec.text !== undefined) rec.el.textContent = rec.text;
      if (rec.html !== undefined) rec.el.innerHTML = rec.html;
      if (rec.attrs) {
        Object.keys(rec.attrs).forEach(function (attr) {
          if (rec.attrs[attr] !== null) rec.el.setAttribute(attr, rec.attrs[attr]);
        });
      }
    });
  }

  function translate(lang) {
    var dict = DICT[lang] || {};
    Array.prototype.forEach.call(selectorNodes(), function (el) {
      var key = el.getAttribute('data-i18n');
      if (key && dict[key] !== undefined) el.textContent = dict[key];

      var htmlKey = el.getAttribute('data-i18n-html');
      if (htmlKey && dict[htmlKey] !== undefined) el.innerHTML = dict[htmlKey];

      var attrSpec = el.getAttribute('data-i18n-attr');
      if (attrSpec) {
        attrSpec.split('|').forEach(function (pair) {
          var parts = pair.split(':');
          var attr = parts[0].trim(), k = (parts[1] || '').trim();
          if (dict[k] !== undefined) el.setAttribute(attr, dict[k]);
        });
      }
    });
  }

  function apply(lang, persist) {
    if (LANGS.indexOf(lang) === -1) lang = DEFAULT;
    cacheOriginals();
    restore();
    if (lang !== DEFAULT) translate(lang);

    root.setAttribute('lang', lang);
    root.setAttribute('data-lang', lang);
    root.classList.remove('i18n-pending');

    document.querySelectorAll('.lang button[data-lang]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === lang));
    });

    if (persist) { try { localStorage.setItem('kk-lang', lang); } catch (e) {} }

    // Keep the URL honest so a shared link opens in the same language.
    if (window.history && history.replaceState) {
      var url = new URL(location.href);
      if (lang === DEFAULT) { url.searchParams.delete('lang'); }
      else { url.searchParams.set('lang', lang); }
      history.replaceState(null, '', url.toString());
    }

    document.dispatchEvent(new CustomEvent('languagechange', { detail: { lang: lang } }));
  }

  function current() {
    return root.getAttribute('data-lang') || DEFAULT;
  }

  // Initial application — the inline head script already picked the language.
  apply(current(), false);

  document.querySelectorAll('.lang button[data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      apply(btn.getAttribute('data-lang'), true);
    });
  });

  window.I18N = { apply: apply, current: current, langs: LANGS, dict: DICT };
})();
