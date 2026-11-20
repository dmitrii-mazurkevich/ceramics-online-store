/* ==========================================================================
   Kettle & Kiln - catalogue data and product illustrations.
   In a WooCommerce build this array is what the REST API / product loop
   returns. Here it is static so the demo runs without a backend.
   ========================================================================== */

(function () {
  'use strict';

  var GLAZES = {
    oat:     { hex: '#E4D8C2', shade: '#C9BBA1', en: 'Oat',     ru: 'Овёс' },
    moss:    { hex: '#6E7856', shade: '#56603F', en: 'Moss',    ru: 'Мох' },
    slate:   { hex: '#4A535D', shade: '#363E47', en: 'Slate',   ru: 'Сланец' },
    celadon: { hex: '#A8BFAF', shade: '#89A392', en: 'Celadon', ru: 'Селадон' },
    clay:    { hex: '#A97457', shade: '#8C5C43', en: 'Raw clay', ru: 'Глина' }
  };

  var CATEGORIES = {
    mugs:    { en: 'Mugs & cups', ru: 'Кружки и чашки' },
    teapots: { en: 'Teapots',     ru: 'Чайники' },
    bowls:   { en: 'Bowls',       ru: 'Пиалы и миски' },
    plates:  { en: 'Plates',      ru: 'Тарелки' },
    vases:   { en: 'Vases',       ru: 'Вазы' },
    tea:     { en: 'Tea',         ru: 'Чай' }
  };

  var P = [
    { id: 'field-mug', type: 'mug', cat: 'mugs', price: 28, glazes: ['oat', 'moss', 'slate'],
      sizes: [{ id: '300', en: '300 ml', ru: '300 мл', add: 0 }, { id: '400', en: '400 ml', ru: '400 мл', add: 4 }],
      stock: 14, rating: 4.9, reviews: 112, tags: ['best'], date: '2026-03-02',
      en: { name: 'Field mug', short: 'Everyday mug with a thumb rest and a satin glaze.',
            desc: 'Thrown on the wheel, trimmed by hand and glazed in two dips, so every mug has a slightly different line where the colours meet. The handle fits three fingers and the base stays cool.' },
      ru: { name: 'Кружка «Поле»', short: 'Кружка на каждый день с упором для пальца и сатиновой глазурью.',
            desc: 'Сделана на гончарном круге, обточена вручную и покрыта глазурью в два окунания, поэтому у каждой кружки своя граница цветов. Ручка под три пальца, дно не нагревается.' } },

    { id: 'low-cup', type: 'cup', cat: 'mugs', price: 22, glazes: ['oat', 'clay'],
      stock: 20, rating: 4.8, reviews: 64, tags: [], date: '2026-01-18',
      en: { name: 'Low tea cup', short: 'A small handleless cup for green and oolong teas.',
            desc: 'A 120 ml cup that sits comfortably in the palm. The unglazed foot shows the clay body, the inside is fully glazed and easy to clean.' },
      ru: { name: 'Низкая чашка', short: 'Небольшая чашка без ручки для зелёного чая и улуна.',
            desc: 'Чашка на 120 мл удобно лежит в ладони. Ножка без глазури показывает глину, внутри всё покрыто глазурью и легко моется.' } },

    { id: 'round-teapot', type: 'teapot', cat: 'teapots', price: 86, glazes: ['slate', 'celadon'],
      stock: 6, rating: 5.0, reviews: 38, tags: ['best'], date: '2026-02-10',
      en: { name: 'Round teapot, 600 ml', short: 'A teapot that pours without dripping, with a built-in strainer.',
            desc: 'The spout is cut at an angle and tested with water before glazing, so it pours cleanly. A ceramic strainer is built into the body, the lid has a locking tab.' },
      ru: { name: 'Круглый чайник, 600 мл', short: 'Чайник, который не капает, со встроенным ситом.',
            desc: 'Носик срезан под углом и проверен водой до глазурования, поэтому льёт чисто. Керамическое сито встроено в корпус, у крышки есть фиксатор.' } },

    { id: 'side-kyusu', type: 'kyusu', cat: 'teapots', price: 72, glazes: ['clay', 'oat'],
      stock: 4, rating: 4.9, reviews: 21, tags: [], date: '2025-12-04',
      en: { name: 'Side-handle teapot', short: 'A Japanese-style kyusu for one or two people.',
            desc: 'A 300 ml kyusu with a side handle, made for short green tea steeps. The fine mesh strainer keeps even small leaves out of the cup.' },
      ru: { name: 'Чайник с боковой ручкой', short: 'Кюсю в японском стиле на одного-двух человек.',
            desc: 'Кюсю на 300 мл с боковой ручкой для коротких заварок зелёного чая. Мелкое сито не пропускает в чашку даже маленькие чаинки.' } },

    { id: 'breakfast-bowl', type: 'bowl', cat: 'bowls', price: 26, glazes: ['oat', 'celadon', 'slate'],
      sizes: [{ id: 's', en: 'Small, 14 cm', ru: 'Малая, 14 см', add: 0 }, { id: 'm', en: 'Medium, 17 cm', ru: 'Средняя, 17 см', add: 6 }],
      stock: 18, rating: 4.7, reviews: 85, tags: ['best'], date: '2026-02-21',
      en: { name: 'Breakfast bowl', short: 'For porridge, soup and everything in between.',
            desc: 'A deep bowl with straight walls, so a spoon never scrapes the glaze from the side. Microwave and dishwasher safe.' },
      ru: { name: 'Миска для завтрака', short: 'Для каши, супа и всего между ними.',
            desc: 'Глубокая миска с прямыми стенками, ложка не царапает глазурь сбоку. Можно в микроволновку и посудомоечную машину.' } },

    { id: 'serving-bowl', type: 'bowl-wide', cat: 'bowls', price: 54, glazes: ['moss', 'oat'],
      stock: 2, rating: 4.9, reviews: 17, tags: [], date: '2025-11-30',
      en: { name: 'Serving bowl, 26 cm', short: 'A wide bowl for salads and shared plates.',
            desc: 'A low, wide bowl for the middle of the table. Heavy enough to stay put, light enough to pass around.' },
      ru: { name: 'Салатник, 26 см', short: 'Широкая миска для салатов и общих блюд.',
            desc: 'Низкая широкая миска для центра стола. Достаточно тяжёлая, чтобы стоять устойчиво, и достаточно лёгкая, чтобы передавать по кругу.' } },

    { id: 'dinner-plate', type: 'plate', cat: 'plates', price: 32, glazes: ['oat', 'slate'],
      stock: 24, rating: 4.8, reviews: 59, tags: [], date: '2026-01-05',
      en: { name: 'Dinner plate, 27 cm', short: 'A flat plate with a soft raised rim.',
            desc: 'The rim is raised just enough to hold a sauce. Glazed edge to edge, stacks neatly in a cupboard.' },
      ru: { name: 'Обеденная тарелка, 27 см', short: 'Плоская тарелка с мягким бортиком.',
            desc: 'Бортик приподнят ровно настолько, чтобы удержать соус. Глазурь до самого края, тарелки аккуратно ставятся стопкой.' } },

    { id: 'side-plate', type: 'plate-small', cat: 'plates', price: 20, glazes: ['celadon', 'clay'],
      stock: 0, rating: 4.6, reviews: 33, tags: [], date: '2025-10-12',
      en: { name: 'Side plate, 19 cm', short: 'For bread, cake and the small things.',
            desc: 'A small plate for bread, dessert or a saucer under a teapot. Back in stock with the next firing.' },
      ru: { name: 'Десертная тарелка, 19 см', short: 'Для хлеба, десерта и мелочей.',
            desc: 'Небольшая тарелка для хлеба, десерта или как подставка под чайник. Снова появится после следующего обжига.' } },

    { id: 'bud-vase', type: 'vase', cat: 'vases', price: 38, glazes: ['celadon', 'slate'],
      stock: 9, rating: 4.9, reviews: 26, tags: ['new'], date: '2026-04-01',
      en: { name: 'Bud vase', short: 'A narrow-neck vase for one or three stems.',
            desc: 'Holds a single branch or a few dried flowers. Glazed inside, so it is safe for fresh water.' },
      ru: { name: 'Ваза для одного цветка', short: 'Ваза с узким горлом на одну-три веточки.',
            desc: 'Подойдёт для одной ветки или пары сухоцветов. Внутри покрыта глазурью, можно ставить в воду.' } },

    { id: 'sencha', type: 'tea', cat: 'tea', price: 16, glazes: [], tin: '#6E7856',
      sizes: [{ id: '50', en: '50 g', ru: '50 г', add: 0 }, { id: '100', en: '100 g', ru: '100 г', add: 12 }],
      stock: 40, rating: 4.8, reviews: 140, tags: ['best'], date: '2026-03-20',
      en: { name: 'Spring sencha', short: 'Fresh, grassy green tea from the first harvest.',
            desc: 'A first-flush sencha with a sweet, grassy taste. Brew at 70-75 °C for one minute, the leaves give three good steeps.' },
      ru: { name: 'Весенняя сенча', short: 'Свежий травянистый зелёный чай первого сбора.',
            desc: 'Сенча первого сбора со сладким травянистым вкусом. Заваривать при 70-75 °C одну минуту, листа хватает на три заварки.' } },

    { id: 'oolong', type: 'tea', cat: 'tea', price: 19, glazes: [], tin: '#8C5C43',
      sizes: [{ id: '50', en: '50 g', ru: '50 г', add: 0 }, { id: '100', en: '100 g', ru: '100 г', add: 14 }],
      stock: 25, rating: 4.9, reviews: 77, tags: [], date: '2026-02-02',
      en: { name: 'Roasted oolong', short: 'Warm, nutty oolong with a honey finish.',
            desc: 'A charcoal-roasted oolong for cold evenings. Brew at 90-95 °C, short steeps in a small teapot work best.' },
      ru: { name: 'Обжаренный улун', short: 'Тёплый ореховый улун с медовым послевкусием.',
            desc: 'Улун, обжаренный на углях, для холодных вечеров. Заваривать при 90-95 °C, лучше всего короткими проливами в маленьком чайнике.' } },

    { id: 'tea-set', type: 'set', cat: 'teapots', price: 124, glazes: ['oat', 'slate'],
      stock: 5, rating: 5.0, reviews: 12, tags: ['new'], date: '2026-04-10',
      en: { name: 'Tea for two set', short: 'Round teapot and two low cups in one glaze.',
            desc: 'The round teapot and two low cups, matched in glaze and packed in a gift box. Costs less than buying them one by one.' },
      ru: { name: 'Набор «Чай на двоих»', short: 'Круглый чайник и две низкие чашки в одной глазури.',
            desc: 'Круглый чайник и две низкие чашки в одной глазури, в подарочной коробке. Дешевле, чем покупать по отдельности.' } }
  ];

  /* Product photos: three per product (front, angle, detail), stock photos from Unsplash.
     The glaze choice stays in the order, the photo shows the real piece. In WooCommerce
     these are the product gallery images. */
  var PHOTOS = {"field-mug":["mug2","mug4","mug1"],"low-cup":["cup2","cup1","mug3"],"round-teapot":["tp2","tp3","tp1"],"side-kyusu":["ky1","ky2","ky3"],"breakfast-bowl":["bw1","bw2","bw3"],"serving-bowl":["sb3","sb2","sb1"],"dinner-plate":["pl1","pl2","pl3"],"side-plate":["sp2","sp1","sp3"],"bud-vase":["vs1","vs3","vs2"],"sencha":["te1","te3","te2"],"oolong":["oo1","oo2","te2"],"tea-set":["set3","set1","set2"]};
  function art(p, glazeId, view) {
    var list = PHOTOS[p.id] || ['hero2'];
    var n = list[(view || 0) % list.length];
    return '<img class="ph" src="assets/img/' + n + '.webp" alt="" loading="lazy" decoding="async">';
  }

  window.SHOP_DATA = { products: P, glazes: GLAZES, categories: CATEGORIES, art: art };
})();
