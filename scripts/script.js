(function () {
  var hamburger = document.querySelector('.hamburger-menu');
  var navMenu = document.querySelector('.nav-menu');
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    
    // 780px以下のとき（モバイル用 active）
    if (window.innerWidth <= 780) {
      navMenu.classList.toggle('active');
    } 
    // 781px以上のとき（PCフルスクリーン用 closed）
    else {
      navMenu.classList.toggle('closed');
    }
  });
})();



document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');

  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      console.log(`Card ${index + 1} clicked!`); // デバッグ用ログ
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });
});



/*YouTubeカルーセル*/
document.addEventListener('DOMContentLoaded', () => {
  const musicCarousel = document.getElementById('musicCarousel');
  const musicTrack = document.getElementById('musicTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('dotsContainer');

  if (!musicCarousel || !musicTrack || !prevBtn || !nextBtn || !dotsContainer) return;

  const originalSlides = Array.from(musicTrack.children);
  const dots = Array.from(dotsContainer.children);
  const slideCount = originalSlides.length;

  // 1. 最初と最後のスライドの複製（クローン）を作成
  const firstClone = originalSlides[0].cloneNode(true);
  const lastClone = originalSlides[slideCount - 1].cloneNode(true);

  // チラつき防止：クローン内の iframe の再読み込みを防ぐ処理
  // （クローン側の iframe を軽量なダミー枠に差し替えるか、読み込みを遅延）
  [firstClone, lastClone].forEach(clone => {
    const iframes = clone.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      // 画面遷移時のバチバチ感を消すため、クローン側は pointer-events を無効化
      iframe.style.pointerEvents = 'none';
      // 遅延読み込み属性を付与
      iframe.setAttribute('loading', 'lazy');
    });
  });

  musicTrack.appendChild(firstClone);
  musicTrack.insertBefore(lastClone, originalSlides[0]);

  let currentIndex = 1;
  let isTransitioning = false;

  // 初期位置設定
  musicTrack.style.transition = 'none';
  musicTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
  updateTheme(0);

  function updateCarousel(index, animate = true) {
    if (animate) {
      musicTrack.style.transition = 'transform 0.4s ease-in-out';
    } else {
      musicTrack.style.transition = 'none';
    }
    
    musicTrack.style.transform = `translateX(-${index * 100}%)`;
    currentIndex = index;

    let realIndex = (index - 1 + slideCount) % slideCount;
    updateTheme(realIndex);
  }

  function updateTheme(realIndex) {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === realIndex);
    });

    const currentSlide = originalSlides[realIndex];
    const bgColor = currentSlide.getAttribute('data-bg');
    if (bgColor) {
      musicCarousel.style.backgroundColor = bgColor;
    }
  }

  musicTrack.addEventListener('transitionend', () => {
    isTransitioning = false;

    // 紫 → 白（クローンから本物の1番目へ一瞬で切替）
    if (currentIndex === slideCount + 1) {
      musicTrack.style.transition = 'none';
      currentIndex = 1;
      musicTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    // 白 → 紫（クローンから本物の最後へ一瞬で切替）
    if (currentIndex === 0) {
      musicTrack.style.transition = 'none';
      currentIndex = slideCount;
      musicTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  });

  nextBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    isTransitioning = true;
    updateCarousel(currentIndex + 1);
  });

  prevBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    isTransitioning = true;
    updateCarousel(currentIndex - 1);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (isTransitioning) return;
      isTransitioning = true;
      updateCarousel(index + 1);
    });
  });
});












/*お問い合わせフォーム*/
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');

  form.addEventListener('submit', (e) => {
    let isValid = true;

    // 要素の取得
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    const tel = document.getElementById('tel');
    const email = document.getElementById('email');
    const agree = document.getElementById('agree');

    // エラーメッセージと赤枠のリセット
    resetErrors();

    // 1. ご用件のバリデーション (必須)
    if (!subject.value) {
      showError(subject, 'subjectError');
      isValid = false;
    }

    // 2. お問い合わせ内容のバリデーション (必須)
    if (!message.value.trim()) {
      showError(message, 'messageError');
      isValid = false;
    }

    // 3. 電話番号のバリデーション (任意入力・半角数字チェック)
    if (tel.value.trim() !== '') {
      const telPattern = /^[0-9\-]+$/; // 半角数字とハイフンのみ許可
      if (!telPattern.test(tel.value.trim())) {
        showError(tel, 'telError');
        isValid = false;
      }
    }

    // 4. メールアドレスのバリデーション (任意入力・形式チェック)
    if (email.value.trim() !== '') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) {
        showError(email, 'emailError');
        isValid = false;
      }
    }

    // 5. プライバシーポリシー同意チェック (必須)
    if (!agree.checked) {
      document.getElementById('agreeError').style.display = 'block';
      isValid = false;
    }

    // バリデーション失敗時は送信をキャンセル
    if (!isValid) {
      e.preventDefault();
    } else {
      alert('送信処理を実行します（※デモ用）');
    }
  });

  // エラー非表示・リセット処理
  function resetErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.style.display = 'none');

    const inputs = document.querySelectorAll('.input-error');
    inputs.forEach(input => input.classList.remove('input-error'));
  }

  // エラー表示処理
  function showError(element, errorId) {
    if (element) {
      element.classList.add('input-error');
    }
    const errorEl = document.getElementById(errorId);
    if (errorEl) {
      errorEl.style.display = 'block';
    }
  }
});