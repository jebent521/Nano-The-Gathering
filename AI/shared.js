// shared.js — utilities used on every page

const RARITY_SYM  = { Common: '●', Uncommon: '◆', Rare: '★' };
const CARD_PRICES = { Common: 0.99, Uncommon: 2.49, Rare: 4.99 };
const DECK_KEY    = 'nano-decks';
const ACTIVE_KEY  = 'nano-active-deck';
const CART_KEY    = 'nano-cart';
const THEME_KEY   = 'theme';

// ── Theme ──────────────────────────────────────────────────────────────────

function applyTheme(theme) {
    document.body.classList.toggle('chocolate', theme === 'chocolate');
    const icon  = document.getElementById('theme-icon');
    const label = document.getElementById('theme-label');
    if (icon)  icon.textContent  = theme === 'chocolate' ? '☀️' : '🌑';
    if (label) label.textContent = theme === 'chocolate' ? 'Cheese' : 'Chocolate';
}

function setupThemeToggle() {
    applyTheme(localStorage.getItem(THEME_KEY) || 'chocolate');
    document.getElementById('btn-theme')?.addEventListener('click', () => {
        const next = document.body.classList.contains('chocolate') ? 'cheese' : 'chocolate';
        applyTheme(next);
        localStorage.setItem(THEME_KEY, next);
    });
}

// ── Cards ──────────────────────────────────────────────────────────────────

let _cards = null;

async function loadCards() {
    if (_cards) return _cards;
    const res = await fetch('nano-data/cards.json');
    _cards = await res.json();
    return _cards;
}

// ── Deck CRUD ──────────────────────────────────────────────────────────────

function getDecks() {
    try { return JSON.parse(localStorage.getItem(DECK_KEY)) || []; } catch { return []; }
}
function saveDecks(decks) { localStorage.setItem(DECK_KEY, JSON.stringify(decks)); }

function getActiveDeckId() { return localStorage.getItem(ACTIVE_KEY) || null; }
function setActiveDeckId(id) { localStorage.setItem(ACTIVE_KEY, id); }

function getActiveDeck() {
    const decks = getDecks();
    return decks.find(d => d.id === getActiveDeckId()) || decks[0] || null;
}

function createDeck(name) {
    const decks = getDecks();
    const deck  = { id: `deck-${Date.now()}`, name: name || 'New Deck', cards: {} };
    decks.push(deck);
    saveDecks(decks);
    setActiveDeckId(deck.id);
    return deck;
}

function deleteDeck(id) {
    const decks = getDecks().filter(d => d.id !== id);
    saveDecks(decks);
    if (getActiveDeckId() === id) setActiveDeckId(decks[0]?.id || null);
}

function renameDeck(id, name) {
    const decks = getDecks();
    const deck  = decks.find(d => d.id === id);
    if (deck) { deck.name = name.trim() || deck.name; saveDecks(decks); }
}

function addCardToDeck(deckId, card) {
    const decks = getDecks();
    const deck  = decks.find(d => d.id === deckId);
    if (!deck) return false;
    const cur = deck.cards[card.id] || 0;
    if (cur >= card.cardCount) return false;
    deck.cards[card.id] = cur + 1;
    saveDecks(decks);
    return true;
}

function removeCardFromDeck(deckId, cardId) {
    const decks = getDecks();
    const deck  = decks.find(d => d.id === deckId);
    if (!deck || !deck.cards[cardId]) return;
    deck.cards[cardId]--;
    if (deck.cards[cardId] <= 0) delete deck.cards[cardId];
    saveDecks(decks);
}

function deckCardCount(deck) {
    return Object.values(deck?.cards || {}).reduce((s, n) => s + n, 0);
}

// ── Cart ───────────────────────────────────────────────────────────────────

function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
}
function addCartItem(item) {
    const cart = getCart();
    cart.push(item);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateNavCart();
}
function clearCart() {
    localStorage.setItem(CART_KEY, '[]');
    updateNavCart();
}

function updateNavCart() {
    const el = document.getElementById('cart-count');
    if (el) el.textContent = getCart().length;
}

// ── Toast ──────────────────────────────────────────────────────────────────

function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('toast-show')));
    setTimeout(() => {
        t.classList.remove('toast-show');
        setTimeout(() => t.remove(), 300);
    }, 2500);
}

// ── Card tilt ──────────────────────────────────────────────────────────────

function setupTilt(el) {
    el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width  - 0.5) * 14;
        const y = ((e.clientY - r.top)  / r.height - 0.5) * 14;
        el.style.transform = `perspective(700px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-6px) scale(1.04)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
}

// ── Card DOM element ───────────────────────────────────────────────────────

function createCardEl(card, { onAdd } = {}) {
    const sym      = RARITY_SYM[card.rarity] || '';
    const statsHTML = card.attack !== null
        ? `<div class="card-stats"><span>⚔ ${card.attack}</span><span>${card.defense} 🛡</span></div>`
        : '';
    const div = document.createElement('div');
    div.className = 'card card-appear';
    div.dataset.id   = card.id;
    div.dataset.type = card.type;
    div.innerHTML = `
        <div class="card-frame">
            <div class="card-top-bar">
                <span class="card-name-small">${card.name}</span>
                <span class="card-cost-badge">${card.treatCost}</span>
            </div>
            <div class="card-img-wrap">
                <img src="nano-data/${card.image}" alt="${card.name}" class="card-img" loading="lazy">
            </div>
            <div class="card-type-bar">
                <span class="card-type-text">${card.type}</span>
                <span class="card-rarity-sym ${card.rarity.toLowerCase()}">${sym}</span>
            </div>
            <div class="card-rules-preview">${card.rulesText}</div>
            ${statsHTML}
        </div>
        ${onAdd ? `<button class="card-add-btn" title="Add to active deck" aria-label="Add ${card.name} to deck">+</button>` : ''}
    `;
    const cardImg = div.querySelector('.card-img');
    cardImg.onerror = () => { cardImg.src = 'nano-data/media/placeholder.png'; cardImg.onerror = null; };

    div.querySelector('.card-frame').addEventListener('click', () => openCardModal(card, onAdd));
    div.querySelector('.card-add-btn')?.addEventListener('click', e => {
        e.stopPropagation();
        if (onAdd) onAdd(card, e.currentTarget);
    });
    setupTilt(div);
    return div;
}

// ── Card modal (created dynamically) ──────────────────────────────────────

function openCardModal(card, onAdd) {
    document.getElementById('dyn-card-modal')?.remove();

    const inDeck  = (getActiveDeck()?.cards?.[card.id] || 0);
    const atMax   = inDeck >= card.cardCount;
    const sym     = RARITY_SYM[card.rarity] || '';
    const price   = CARD_PRICES[card.rarity];

    const statsHTML   = card.attack !== null
        ? `<div class="detail-statsbar"><span class="detail-stat">⚔ ${card.attack}</span><span class="detail-stat">${card.defense} 🛡</span></div>` : '';
    const flavorHTML  = card.flavorText ? `<p class="detail-flavor">${card.flavorText}</p>` : '';
    const detailsHTML = card.details    ? `<p class="detail-details">${card.details}</p>`   : '';
    const copiesHTML  = inDeck > 0      ? `<span class="deck-copies">${inDeck}/${card.cardCount} in active deck</span>` : '';

    const modal = document.createElement('div');
    modal.id        = 'dyn-card-modal';
    modal.className = 'modal';
    modal.setAttribute('aria-hidden', 'false');
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-box modal-box-card" role="dialog" aria-modal="true">
            <button class="modal-close" aria-label="Close">✕</button>
            <div class="detail-card" data-type="${card.type}">
                <div class="detail-header">
                    <span class="detail-name">${card.name}</span>
                    <span class="detail-cost">${card.treatCost}</span>
                </div>
                <div class="detail-img-wrap">
                    <img src="nano-data/${card.image}" alt="${card.name}" class="detail-img" id="detail-img-el">
                </div>
                <div class="detail-typeline">
                    <span class="detail-type">${card.type}${card.role ? ` — ${card.role}` : ''}</span>
                    <span class="detail-rarity ${card.rarity.toLowerCase()}">${sym} ${card.rarity}</span>
                </div>
                <div class="detail-textbox">
                    <p class="detail-rules">${card.rulesText}</p>
                    ${flavorHTML}
                </div>
                ${statsHTML}
                ${detailsHTML}
                <div class="detail-actions">
                    ${onAdd ? `<button class="btn btn-primary" id="modal-add-btn" ${atMax ? 'disabled' : ''}>
                        ${atMax ? `Max copies (${card.cardCount})` : 'Add to Deck'}
                    </button>` : ''}
                    <button class="btn btn-secondary" id="modal-buy-btn">Buy $${price.toFixed(2)}</button>
                    ${copiesHTML}
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const detailImg = modal.querySelector('#detail-img-el');
    detailImg.onerror = () => { detailImg.src = 'nano-data/media/placeholder.png'; detailImg.onerror = null; };

    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('active')));

    const close = () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 200);
    };
    modal.querySelector('.modal-backdrop').addEventListener('click', close);
    modal.querySelector('.modal-close').addEventListener('click', close);
    modal.querySelector('#modal-add-btn')?.addEventListener('click', () => {
        if (onAdd) {
            onAdd(card, modal.querySelector('#modal-add-btn'));
            close();
        }
    });
    modal.querySelector('#modal-buy-btn').addEventListener('click', () => {
        addCartItem({ type: 'card', id: card.id, name: card.name, rarity: card.rarity, price });
        showToast(`Added "${card.name}" to cart ($${price.toFixed(2)})`);
        close();
    });

    document.addEventListener('keydown', function handler(e) {
        if (e.key === 'Escape') { close(); document.removeEventListener('keydown', handler); }
    });
}

// ── Nav helpers ────────────────────────────────────────────────────────────

function updateNavDeck() {
    const deck  = getActiveDeck();
    const count = deck ? deckCardCount(deck) : 0;
    const el    = document.getElementById('deck-count');
    if (el) el.textContent = count;
}

function markActiveNavLink() {
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link[data-page]').forEach(a => {
        a.classList.toggle('nav-active', a.dataset.page === path);
    });
}
