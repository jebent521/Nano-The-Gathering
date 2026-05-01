// Catalog page

let allCards = [];
let advancedOpen = false;

async function init() {
    setupThemeToggle();
    markActiveNavLink();
    updateNavDeck();
    updateActiveDeckLabel();

    try {
        allCards = await loadCards();
    } catch (e) {
        document.getElementById('card-grid').innerHTML =
            '<p class="no-results">Serve from an HTTP server to load cards.</p>';
        return;
    }

    filterCards();
    setupEventListeners();
}

// ── Active deck label in nav ──────────────────────────────────────────────

function updateActiveDeckLabel() {
    const deck = getActiveDeck();
    const btn  = document.getElementById('btn-active-deck');
    if (!btn) return;
    const name  = deck ? deck.name : '—';
    const count = deck ? deckCardCount(deck) : 0;
    btn.innerHTML = `Active Deck: <strong>${name}</strong> (<span id="deck-count">${count}</span>)`;
}

// ── Filters ───────────────────────────────────────────────────────────────

function getFilters() {
    return {
        name:    document.getElementById('filter-name').value.trim().toLowerCase(),
        type:    document.getElementById('filter-type').value,
        rarity:  document.getElementById('filter-rarity').value,
        costMin: document.getElementById('f-cost-min').value,
        costMax: document.getElementById('f-cost-max').value,
        atkMin:  document.getElementById('f-atk-min').value,
        atkMax:  document.getElementById('f-atk-max').value,
        defMin:  document.getElementById('f-def-min').value,
        defMax:  document.getElementById('f-def-max').value,
    };
}

function filterCards() {
    const f = getFilters();
    const filtered = allCards.filter(c => {
        if (f.name   && !c.name.toLowerCase().includes(f.name)) return false;
        if (f.type   && c.type !== f.type) return false;
        if (f.rarity && c.rarity !== f.rarity) return false;
        if (f.costMin !== '' && c.treatCost < +f.costMin) return false;
        if (f.costMax !== '' && c.treatCost > +f.costMax) return false;
        if (f.atkMin !== '' && (c.attack === null || c.attack < +f.atkMin)) return false;
        if (f.atkMax !== '' && (c.attack === null || c.attack > +f.atkMax)) return false;
        if (f.defMin !== '' && (c.defense === null || c.defense < +f.defMin)) return false;
        if (f.defMax !== '' && (c.defense === null || c.defense > +f.defMax)) return false;
        return true;
    });
    renderGrid(filtered);
    document.getElementById('result-count').textContent =
        `${filtered.length} of ${allCards.length} cards`;
    document.getElementById('no-results').classList.toggle('hidden', filtered.length > 0);
}

function clearFilters() {
    ['filter-name','filter-type','filter-rarity','f-cost-min','f-cost-max',
     'f-atk-min','f-atk-max','f-def-min','f-def-max']
        .forEach(id => { document.getElementById(id).value = ''; });
    filterCards();
}

// ── Card grid ─────────────────────────────────────────────────────────────

function renderGrid(cards) {
    const grid = document.getElementById('card-grid');
    grid.innerHTML = '';
    cards.forEach((card, i) => {
        const el = createCardEl(card, { onAdd: handleAddToDeck });
        el.style.animationDelay = `${Math.min(i * 20, 400)}ms`;
        grid.appendChild(el);
    });
}

function handleAddToDeck(card, btn) {
    let deck = getActiveDeck();
    if (!deck) {
        deck = createDeck('My Deck');
        showToast('Created "My Deck"');
    }
    const added = addCardToDeck(deck.id, card);
    if (added) {
        showToast(`Added "${card.name}" to ${deck.name}`);
        if (btn) animateFly(btn);
        updateActiveDeckLabel();
    } else {
        showToast(`Max copies of "${card.name}" already in deck`);
    }
}

function animateFly(btn) {
    const deckBtn = document.getElementById('btn-active-deck');
    if (!deckBtn) return;
    const bRect = btn.getBoundingClientRect();
    const dRect = deckBtn.getBoundingClientRect();

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

// ── Event listeners ───────────────────────────────────────────────────────

function setupEventListeners() {
    ['filter-name','filter-type','filter-rarity','f-cost-min','f-cost-max',
     'f-atk-min','f-atk-max','f-def-min','f-def-max']
        .forEach(id => document.getElementById(id).addEventListener('input', filterCards));

    document.getElementById('btn-advanced').addEventListener('click', () => {
        advancedOpen = !advancedOpen;
        document.getElementById('advanced-filters').classList.toggle('hidden', !advancedOpen);
        document.getElementById('btn-advanced').textContent = advancedOpen ? 'Advanced ▴' : 'Advanced ▾';
    });

    document.getElementById('btn-clear-filters').addEventListener('click', clearFilters);

    document.getElementById('btn-active-deck').addEventListener('click', () => {
        location.href = 'deck.html';
    });
}

init();
