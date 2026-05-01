// Homepage: carousel + shop + cart

const SLIDES_VISIBLE = () => window.innerWidth < 600 ? 1 : window.innerWidth < 1000 ? 2 : 3;

let featuredCards = [];
let carouselIndex = 0;

async function init() {
    setupThemeToggle();
    markActiveNavLink();
    renderCartBar();

    try {
        const cards = await loadCards();
        // Feature: all Rares first, then Uncommons, take 10
        const rares      = cards.filter(c => c.rarity === 'Rare');
        const uncommons  = cards.filter(c => c.rarity === 'Uncommon');
        featuredCards    = [...rares, ...uncommons].slice(0, 10);
        buildCarousel();
    } catch (e) {
        document.getElementById('carousel-track').innerHTML =
            '<p class="carousel-error">Serve from an HTTP server to load cards.</p>';
    }

    setupEventListeners();
}

// ── Carousel ──────────────────────────────────────────────────────────────

function buildCarousel() {
    const track = document.getElementById('carousel-track');
    const dots  = document.getElementById('carousel-dots');
    track.innerHTML = '';
    dots.innerHTML  = '';

    featuredCards.forEach((card, i) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.appendChild(createCardEl(card));
        track.appendChild(slide);

        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', `Go to card ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dots.appendChild(dot);
    });

    goToSlide(0);
}

function goToSlide(index) {
    const maxIndex = featuredCards.length - SLIDES_VISIBLE();
    carouselIndex  = Math.max(0, Math.min(index, maxIndex));

    const track   = document.getElementById('carousel-track');
    const slides  = track.querySelectorAll('.carousel-slide');
    const slideW  = slides[0]?.getBoundingClientRect().width || 0;
    const gap     = 20;
    track.style.transform = `translateX(-${carouselIndex * (slideW + gap)}px)`;

    document.getElementById('carousel-prev').disabled = carouselIndex === 0;
    document.getElementById('carousel-next').disabled = carouselIndex >= maxIndex;

    document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i >= carouselIndex && i < carouselIndex + SLIDES_VISIBLE());
    });
}

// ── Shop & Cart ───────────────────────────────────────────────────────────

function renderCartBar() {
    const cart = getCart();
    const bar  = document.getElementById('cart-bar');
    bar.classList.toggle('hidden', cart.length === 0);
    if (cart.length === 0) return;

    document.getElementById('cart-label').textContent =
        `${cart.length} item${cart.length !== 1 ? 's' : ''} in cart`;

    const total = cart.reduce((s, i) => s + i.price, 0);
    const list  = document.getElementById('cart-items-list');
    list.innerHTML = cart.map(item => `
        <div class="cart-line">
            <span class="cart-line-name">${item.name}</span>
            <span class="cart-line-price">$${item.price.toFixed(2)}</span>
        </div>
    `).join('') + `
        <div class="cart-line cart-line-total">
            <span class="cart-line-name">Total</span>
            <span class="cart-line-price">$${total.toFixed(2)}</span>
        </div>
    `;
}

// ── Info modal content ────────────────────────────────────────────────────

function howToPlayHTML() {
    return `
        <h2>How to Play</h2>
        <a href="nano-data/Nano_The_Gathering_Rulebook.pdf" download class="btn btn-secondary btn-sm">Download Printable Rules PDF</a>
        <h3>Setup</h3>
        <p>Each player builds a deck of at least 30 cards, respecting the card count limits on each card. Shuffle your deck and draw 5 cards as your opening hand. Each player starts with 20 life points and 0 Treats.</p>
        <h3>Turn Structure</h3>
        <ol>
            <li><strong>Draw Phase</strong> — Draw one card from the top of your deck.</li>
            <li><strong>Treat Phase</strong> — Play any number of Treat cards from your hand to gain Treats for this turn. Treats do not carry over between turns.</li>
            <li><strong>Main Phase</strong> — Spend Treats to play Character and Action cards. Characters enter exhausted and cannot attack on their first turn.</li>
            <li><strong>Combat Phase</strong> — Declare attackers. Your opponent declares blockers. Unblocked damage hits the opponent's life total. Characters that take damage equal to or greater than their Defense are destroyed.</li>
            <li><strong>End Phase</strong> — Discard down to 7 cards if over the limit. Ready all your Characters.</li>
        </ol>
        <h3>Winning</h3>
        <p>Reduce your opponent to 0 life to win. If a player cannot draw a card at the start of their turn, they lose.</p>
        <h3>Key Terms</h3>
        <ul>
            <li><strong>Exhausted</strong> — Cannot attack or block.</li>
            <li><strong>First Sniff</strong> — Attacks before Characters without First Sniff.</li>
            <li><strong>Frozen</strong> — Skips its next attack phase.</li>
            <li><strong>Treats</strong> — Resources used to play cards, generated by Treat cards and some abilities.</li>
        </ul>
        <h3>Beginner Tips</h3>
        <p>Include 8–10 Treat cards in a 30-card deck. The Nap synergy (Couch Nap + Deep Sleep + Sneaker Nap Nano) is beginner-friendly and surprisingly powerful.</p>
    `;
}

// ── Event listeners ───────────────────────────────────────────────────────

function setupEventListeners() {
    document.getElementById('carousel-prev').addEventListener('click', () => goToSlide(carouselIndex - 1));
    document.getElementById('carousel-next').addEventListener('click', () => goToSlide(carouselIndex + 1));

    window.addEventListener('resize', () => goToSlide(carouselIndex));

    document.getElementById('btn-how-to-play').addEventListener('click', () => {
        document.getElementById('modal-info-body').innerHTML = howToPlayHTML();
        const modal = document.getElementById('modal-info');
        modal.setAttribute('aria-hidden', 'false');
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    });
    document.getElementById('modal-info-close').addEventListener('click', closeInfoModal);
    document.getElementById('modal-info-backdrop').addEventListener('click', closeInfoModal);

    document.querySelectorAll('#shop .btn-primary[data-product]').forEach(btn => {
        btn.addEventListener('click', () => {
            addCartItem({ type: 'shop', name: btn.dataset.product, price: +btn.dataset.price });
            renderCartBar();
            showToast(`Added "${btn.dataset.product}" to cart`);
            const orig = btn.textContent;
            btn.textContent = 'Added!';
            setTimeout(() => { btn.textContent = orig; }, 1500);
        });
    });

    document.getElementById('btn-checkout').addEventListener('click', () =>
        alert('Thank you! (This is a demo — no real purchases are made.)'));
    document.getElementById('btn-clear-cart').addEventListener('click', () => {
        clearCart();
        renderCartBar();
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeInfoModal();
    });
}

function closeInfoModal() {
    const modal = document.getElementById('modal-info');
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

init();
