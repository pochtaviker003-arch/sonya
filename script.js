(() => {
  'use strict';

  const compliments = [
    'Твоя улыбка — моё любимое освещение в этом мире.',
    'В тебе удивительным образом сочетаются нежность, сила и красота.',
    'Ты красивая не только внешне — у тебя очень красивый внутренний мир.',
    'Даже обычный день становится особенным, когда я могу поговорить с тобой.',
    'Твои глаза — место, в котором хочется задержаться подольше.',
    'Мне нравится, как ты смеёшься. Я готов слушать этот смех бесконечно.',
    'Ты умеешь делать мир вокруг чуточку добрее и теплее.',
    'Ты не должна быть идеальной. Для меня ты прекрасна настоящей.',
    'В тебе есть что-то такое, чего не найти больше ни в ком.',
    'Я горжусь тобой — даже за те маленькие победы, о которых ты никому не рассказываешь.',
    'Твоя нежность — это отдельный вид волшебства.',
    'С тобой хочется строить планы, мечтать и не бояться будущего.',
    'Ты заслуживаешь цветов без повода, объятий без причины и любви без условий.',
    'Мне повезло узнать тебя. И ещё больше повезло — быть рядом.',
    'Ты — моё любимое уведомление, самая приятная мысль и самая тёплая причина улыбнуться.',
    'Я люблю в тебе и большие мечты, и маленькие странности.',
    'Когда ты счастлива, мне хочется, чтобы этот момент длился целую вечность.',
    'Ты прекрасна даже в те дни, когда сама этого совсем не замечаешь.',
    'Твоя доброта делает тебя ещё красивее.',
    'Среди всех случайностей моей жизни встреча с тобой — самая любимая.',
    'Ты — не просто красивая глава. Ты целая любимая история.',
    'Я хочу быть человеком, рядом с которым тебе спокойно и тепло.',
    'У тебя талант превращать простые моменты в самые дорогие воспоминания.',
    'Если бы мне снова пришлось выбирать, я бы снова захотел узнать именно тебя.'
  ];

  // Фото лежат в папке «фото» под номерами 1–6; поддерживаются JPG, PNG и WEBP.
  const photoNumbers = [1, 2, 3, 4, 5, 6];
  const photoFallback = (n) => `<div class="card-fallback">${['♡', '✿', '✧', '♥', '♡', '✦'][n - 1]}</div>`;

  // Загружаем фото с поддержкой JPG, JPEG, PNG и WEBP.
  // Если файл не найден, оставляем аккуратную заглушку вместо сломанной картинки.
  function loadPhoto(img, photoNumber, onMissing) {
    const extensions = ['jpg', 'jpeg', 'png', 'webp'];
    let extensionIndex = 0;
    img.removeAttribute('src');
    img.addEventListener('error', () => {
      if (extensionIndex < extensions.length) {
        img.src = `фото/${photoNumber}.${extensions[extensionIndex++]}`;
      } else {
        if (typeof onMissing === 'function') onMissing();
      }
    });
    img.addEventListener('load', () => img.classList.add('photo-loaded'), { once: true });
    img.src = `фото/${photoNumber}.${extensions[extensionIndex++]}`;
  }

  document.querySelectorAll('.photo-frame, .gallery-item').forEach((frame) => {
    const img = frame.querySelector('img');
    const photoNumber = Number(frame.dataset.photo);
    if (!img || !photoNumber) return;
    loadPhoto(img, photoNumber, () => frame.classList.add('image-missing'));
  });

  // Музыка включается только после нажатия — так работают ограничения браузеров.
  const audio = document.getElementById('backgroundMusic');
  const musicButton = document.getElementById('musicButton');
  const musicButtonText = document.getElementById('musicButtonText');
  musicButton.addEventListener('click', async () => {
    if (audio.paused) {
      try {
        await audio.play();
        musicButton.classList.add('playing');
        musicButtonText.textContent = 'Выключить музыку';
        musicButton.setAttribute('aria-label', 'Выключить музыку');
      } catch (error) {
        alert('Добавь свой аудиофайл с названием music.mp3 в папку сайта, а затем нажми сюда ещё раз ♡');
      }
    } else {
      audio.pause();
      musicButton.classList.remove('playing');
      musicButtonText.textContent = 'Включить музыку';
      musicButton.setAttribute('aria-label', 'Включить музыку');
    }
  });

  // Комплименты меняются по нажатию.
  const complimentText = document.getElementById('complimentText');
  let complimentIndex = 0;
  document.getElementById('complimentButton').addEventListener('click', () => {
    complimentIndex = (complimentIndex + 1) % compliments.length;
    complimentText.classList.remove('compliment-pop');
    complimentText.classList.add('compliment-leave');
    window.setTimeout(() => {
      complimentText.textContent = compliments[complimentIndex];
      complimentText.classList.remove('compliment-leave');
      complimentText.classList.add('compliment-pop');
    }, 160);
  });

  // Маленький дождь из сердечек.
  const heartsLayer = document.getElementById('heartsLayer');
  function burstHearts(amount = 18) {
    for (let i = 0; i < amount; i++) {
      const heart = document.createElement('span');
      heart.className = 'floating-heart';
      heart.textContent = Math.random() > .25 ? '♥' : '♡';
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.animationDelay = `${Math.random() * .8}s`;
      heart.style.fontSize = `${13 + Math.random() * 19}px`;
      heartsLayer.appendChild(heart);
      window.setTimeout(() => heart.remove(), 4300);
    }
  }
  document.getElementById('heartButton').addEventListener('click', () => burstHearts(24));
  document.getElementById('finalHeartButton').addEventListener('click', () => burstHearts(45));

  // Появление блоков при прокрутке.
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // Игра «Найди пару»: шесть фото, каждое встречается дважды.
  const grid = document.getElementById('memoryGrid');
  const movesEl = document.getElementById('movesCount');
  const pairsEl = document.getElementById('pairsCount');
  const progressFill = document.getElementById('progressFill');
  const gameMessage = document.getElementById('gameMessage');
  let firstCard = null;
  let secondCard = null;
  let locked = false;
  let moves = 0;
  let pairs = 0;
  let mismatchTimer = null;

  function makeDeck() {
    const deck = [...photoNumbers, ...photoNumbers].map((id, index) => ({ id, key: `${index}-${Math.random()}` }));
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  function updateStats() {
    movesEl.textContent = moves;
    pairsEl.textContent = `${pairs} / 6`;
    progressFill.style.width = `${(pairs / 6) * 100}%`;
  }

  function flipDown(card) {
    card.classList.remove('flipped');
    card.setAttribute('aria-label', 'Закрытая карточка');
  }

  function chooseCard(card) {
    if (locked || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    card.classList.add('flipped');
    card.setAttribute('aria-label', `Открыта фотография ${card.dataset.photo}`);
    if (!firstCard) {
      firstCard = card;
      return;
    }
    secondCard = card;
    locked = true;
    moves++;
    updateStats();
    if (firstCard.dataset.photo === secondCard.dataset.photo) {
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      firstCard.setAttribute('aria-label', 'Пара найдена');
      secondCard.setAttribute('aria-label', 'Пара найдена');
      pairs++;
      firstCard = null;
      secondCard = null;
      locked = false;
      updateStats();
      gameMessage.textContent = pairs === 6 ? `Ура! Все пары найдены за ${moves} ходов. Вы с Соней — идеальная пара! ♥` : 'Есть пара! У тебя отлично получается ♡';
      if (pairs === 6) burstHearts(30);
    } else {
      gameMessage.textContent = 'Почти! Запомни эти фотографии и попробуй ещё раз.';
      mismatchTimer = window.setTimeout(() => {
        flipDown(firstCard);
        flipDown(secondCard);
        firstCard = null;
        secondCard = null;
        locked = false;
        gameMessage.textContent = 'Найди все шесть пар. У тебя получится, любимая!';
      }, 950);
    }
  }

  function startGame() {
    if (mismatchTimer) window.clearTimeout(mismatchTimer);
    firstCard = null;
    secondCard = null;
    locked = false;
    moves = 0;
    pairs = 0;
    updateStats();
    gameMessage.textContent = 'Найди все шесть пар. У тебя получится, любимая!';
    grid.innerHTML = '';
    makeDeck().forEach((item, index) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'memory-card';
      card.dataset.photo = item.id;
      card.style.setProperty('--card-index', index);
      card.setAttribute('aria-label', `Закрытая карточка ${index + 1}`);

      const face = document.createElement('span');
      face.className = 'card-face';
      face.setAttribute('aria-hidden', 'true');
      face.innerHTML = '<span class="card-heart">♡</span><small>наша память</small>';

      const back = document.createElement('span');
      back.className = 'card-back';
      back.innerHTML = photoFallback(item.id);
      const image = new Image();
      image.alt = `Фотография ${item.id}`;
      image.draggable = false;
      back.appendChild(image);
      loadPhoto(image, item.id, () => image.remove());

      card.append(face, back);
      card.addEventListener('click', () => chooseCard(card));
      grid.appendChild(card);
    });
  }
  document.getElementById('resetGame').addEventListener('click', startGame);
  startGame();
})();
