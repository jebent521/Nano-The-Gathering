// Deck Builder page

let allCards = [];
let browserQuery = { name: '', type: '' };

async function init() {
    setupThemeToggle();
    markActiveNavLink();

    try {
        allCards = await loadCards();
    } catch (e) {
        // deck list still works without card data
    }

    renderDeckList();
    renderActiveDeck();
    renderMiniGrid();
    setupEventListeners();
}

// ── Sidebar deck list ──────────────────────────────────────────────────────

function renderDeckList() {
    const decks  = getDecks();
    const active = getActiveDeck();
    const list   = document.getElementById('deck-list');
    list.innerHTML = '';

    if (decks.length === 0) {
        document.getElementById('deck-editor').classList.add('hidden');
        document.getElementById('deck-empty-state').classList.remove('hidden');
        return;
    }

    document.getElementById('deck-editor').classList.remove('hidden');
    document.getElementById('deck-empty-state').classList.add('hidden');

    decks.forEach(deck => {
        const li = document.createElement('li');
        li.className = 'deck-list-item' + (deck.id === active?.id ? ' active' : '');
        li.dataset.id = deck.id;
        li.innerHTML = `
            <span class="deck-list-name">${deck.name}</span>
            <span class="deck-list-count">${deckCardCount(deck)}</span>
        `;
        li.addEventListener('click', () => {
            setActiveDeckId(deck.id);
            renderDeckList();
            renderActiveDeck();
            renderMiniGrid();
        });
        list.appendChild(li);
    });
}

// ── Active deck editor ─────────────────────────────────────────────────────

function renderActiveDeck() {
    const deck = getActiveDeck();
    if (!deck) return;

    document.getElementById('deck-name-input').value = deck.name;

    const total      = deckCardCount(deck);
    const characters = countByType(deck, 'Character');
    const actions    = countByType(deck, 'Action');
    const treats     = countByType(deck, 'Treat');

    const stats = document.getElementById('deck-stats');
    stats.innerHTML = `
        <div class="deck-stat"><span class="deck-stat-label">Cards</span><span class="deck-stat-value">${total}</span></div>
        <div class="deck-stat"><span class="deck-stat-label">Characters</span><span class="deck-stat-value">${characters}</span></div>
        <div class="deck-stat"><span class="deck-stat-label">Actions</span><span class="deck-stat-value">${actions}</span></div>
        <div class="deck-stat"><span class="deck-stat-label">Treats</span><span class="deck-stat-value">${treats}</span></div>
    `;

    const listEl = document.getElementById('deck-card-list');
    listEl.innerHTML = '';

    const entries = Object.entries(deck.cards);
    if (entries.length === 0) {
        listEl.innerHTML = '<p class="deck-empty-msg">No cards yet — add some below.</p>';
        return;
    }

    entries.forEach(([cardId, qty]) => {
        const card = allCards.find(c => String(c.id) === String(cardId));
        if (!card) return;

        const row = document.createElement('div');
        row.className = 'deck-entry';
        row.innerHTML = `
            <img src="../nano-data/${card.image}" alt="${card.name}" class="deck-entry-img">
            <div class="deck-entry-info">
                <span class="deck-entry-name">${card.name}</span>
                <span class="deck-entry-type">${card.type}</span>
            </div>
            <div class="deck-entry-count">
                <button class="deck-qty-btn" data-card-id="${card.id}" data-action="remove" aria-label="Remove one">−</button>
                <span>${qty}</span>
                <button class="deck-qty-btn" data-card-id="${card.id}" data-action="add"
                    ${qty >= card.cardCount ? 'disabled' : ''} aria-label="Add one">+</button>
                <button class="deck-qty-btn deck-entry-remove" data-card-id="${card.id}" aria-label="Remove all">✕</button>
            </div>
        `;
        listEl.appendChild(row);
    });
}

function countByType(deck, type) {
    return Object.entries(deck.cards).reduce((sum, [id, qty]) => {
        const card = allCards.find(c => String(c.id) === String(id));
        return sum + (card?.type === type ? qty : 0);
    }, 0);
}

// ── Mini card browser ──────────────────────────────────────────────────────

function renderMiniGrid() {
    const grid = document.getElementById('mini-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const filtered = allCards.filter(c => {
        if (browserQuery.name && !c.name.toLowerCase().includes(browserQuery.name)) return false;
        if (browserQuery.type && c.type !== browserQuery.type) return false;
        return true;
    });

    filtered.forEach((card, i) => {
        const el = createCardEl(card, { onAdd: handleAddToDeck });
        el.style.animationDelay = `${Math.min(i * 15, 300)}ms`;
        grid.appendChild(el);
    });
}

function handleAddToDeck(card, btn) {
    const deck = getActiveDeck();
    if (!deck) return;
    const added = addCardToDeck(deck.id, card);
    if (added) {
        showToast(`Added "${card.name}" to ${deck.name}`);
        renderActiveDeck();
        renderDeckList();
        if (btn) animateFly(btn);
    } else {
        showToast(`Max copies of "${card.name}" already in deck`);
    }
}

function animateFly(btn) {
    const nameEl = document.getElementById('deck-name-input');
    if (!nameEl) return;
    const bRect = btn.getBoundingClientRect();
    const dRect = nameEl.getBoundingClientRect();

    const fly = document.createElement('div');
    fly.className = 'fly-dot';
    fly.style.left = `${bRect.left + bRect.width  / 2}px`;
    fly.style.top  = `${bRect.top  + bRect.height / 2}px`;
    document.getElementById('fly-container').appendChild(fly);

    const dx = dRect.left + dRect.width  / 2 - (bRect.left + bRect.width  / 2);
    const dy = dRect.top  + dRect.height / 2 - (bRect.top  + bRect.height / 2);

    fly.animate(
        [
            { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.3)`, opacity: 0 },
        ],
        { duration: 450, easing: 'ease-in' }
    ).onfinish = () => fly.remove();
}

// ── Event listeners ────────────────────────────────────────────────────────

function setupEventListeners() {
    document.getElementById('btn-new-deck').addEventListener('click', createNewDeck);
    document.getElementById('btn-new-deck-empty')?.addEventListener('click', createNewDeck);

    document.getElementById('deck-name-input').addEventListener('change', e => {
        const deck = getActiveDeck();
        if (!deck) return;
        renameDeck(deck.id, e.target.value);
        renderDeckList();
    });

    document.getElementById('btn-delete-deck').addEventListener('click', () => {
        const deck = getActiveDeck();
        if (!deck) return;
        if (!confirm(`Delete "${deck.name}"? This cannot be undone.`)) return;
        deleteDeck(deck.id);
        renderDeckList();
        renderActiveDeck();
        renderMiniGrid();
    });

    document.getElementById('btn-export-deck').addEventListener('click', exportDeck);

    document.getElementById('deck-card-list').addEventListener('click', e => {
        const actionBtn = e.target.closest('[data-action]');
        const removeBtn = e.target.closest('.deck-entry-remove');
        const deck = getActiveDeck();
        if (!deck) return;

        if (actionBtn) {
            const cardId = actionBtn.dataset.cardId;
            const card   = allCards.find(c => String(c.id) === String(cardId));
            if (!card) return;
            if (actionBtn.dataset.action === 'add') {
                addCardToDeck(deck.id, card);
            } else {
                removeCardFromDeck(deck.id, cardId);
            }
            renderActiveDeck();
            renderDeckList();
            return;
        }

        if (removeBtn) {
            const cardId = removeBtn.dataset.cardId;
            const decks  = getDecks();
            const d      = decks.find(d => d.id === deck.id);
            if (d) { delete d.cards[cardId]; saveDecks(decks); }
            renderActiveDeck();
            renderDeckList();
        }
    });

    document.getElementById('browser-search').addEventListener('input', e => {
        browserQuery.name = e.target.value.trim().toLowerCase();
        renderMiniGrid();
    });
    document.getElementById('browser-type').addEventListener('change', e => {
        browserQuery.type = e.target.value;
        renderMiniGrid();
    });
}

function createNewDeck() {
    const name = prompt('Deck name:', 'New Deck');
    if (name === null) return;
    createDeck(name.trim() || 'New Deck');
    renderDeckList();
    renderActiveDeck();
    renderMiniGrid();
}

function exportDeck() {
    const deck = getActiveDeck();
    if (!deck) return;

    const lines = [`// ${deck.name}`, `// ${deckCardCount(deck)} cards`, ''];
    const grouped = { Character: [], Action: [], Treat: [] };

    Object.entries(deck.cards).forEach(([id, qty]) => {
        const card = allCards.find(c => String(c.id) === String(id));
        if (card) grouped[card.type]?.push(`${qty}x ${card.name}`);
    });

    ['Character', 'Action', 'Treat'].forEach(type => {
        if (grouped[type].length) {
            lines.push(`// ${type}s`);
            grouped[type].sort().forEach(l => lines.push(l));
            lines.push('');
        }
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = `${deck.name.replace(/[^a-z0-9]/gi, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
}

init();
