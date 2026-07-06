const searchInput = document.getElementById("produce-search");
const searchHint = document.getElementById("search-hint");
const resultsList = document.getElementById("results-list");
const resultsCount = document.getElementById("results-count");
const emptyState = document.getElementById("empty-state");
const detailCard = document.getElementById("detail-card");
const detailName = document.getElementById("detail-name");
const detailType = document.getElementById("detail-type");
const detailBadge = document.getElementById("detail-badge");

const MAX_RESULTS = 50;

function normalize(text) {
  return text.toLowerCase().trim();
}

function getCategoryInfo(category) {
  return COLOR_CATEGORIES[category] || { label: category };
}

function matchesQuery(item) {
  const query = normalize(searchInput.value);
  if (!query) {
    return false;
  }
  return normalize(item.name).includes(query);
}

function createBadge(category, compact = false) {
  const info = getCategoryInfo(category);
  const className = compact
    ? `color-badge color-badge--${category} color-badge--compact`
    : `color-badge color-badge--${category}`;
  return `<span class="${className}">${info.label}</span>`;
}

function setVisible(element, visible, hiddenClass) {
  element.classList.toggle(hiddenClass, !visible);
  if ("hidden" in element) {
    element.hidden = !visible;
  }
}

function showDetail(item) {
  detailName.textContent = item.name;
  detailType.textContent = item.type.charAt(0).toUpperCase() + item.type.slice(1);
  detailBadge.innerHTML = createBadge(item.category);
  setVisible(detailCard, true, "detail-card--hidden");
}

function hideDetail() {
  setVisible(detailCard, false, "detail-card--hidden");
}

function renderResults() {
  const query = normalize(searchInput.value);

  if (!query) {
    setVisible(searchHint, true, "search-hint--hidden");
    setVisible(resultsCount, false, "results-count--hidden");
    setVisible(resultsList, false, "results-list--hidden");
    setVisible(emptyState, false, "empty-state--hidden");
    hideDetail();
    resultsList.innerHTML = "";
    return;
  }

  setVisible(searchHint, false, "search-hint--hidden");

  const matches = PRODUCE_DATABASE.filter(matchesQuery);
  const limited = matches.slice(0, MAX_RESULTS);

  if (matches.length === 0) {
    setVisible(resultsCount, false, "results-count--hidden");
    setVisible(resultsList, false, "results-list--hidden");
    setVisible(emptyState, true, "empty-state--hidden");
    hideDetail();
    resultsList.innerHTML = "";
    return;
  }

  setVisible(emptyState, false, "empty-state--hidden");
  setVisible(resultsCount, true, "results-count--hidden");
  setVisible(resultsList, true, "results-list--hidden");

  resultsCount.textContent =
    matches.length > MAX_RESULTS
      ? `Showing ${MAX_RESULTS} of ${matches.length} matches`
      : `${matches.length} match${matches.length === 1 ? "" : "es"}`;

  resultsList.innerHTML = limited
    .map(
      (item) => `
        <button
          type="button"
          class="result-row"
          data-name="${item.name.replace(/"/g, "&quot;")}"
        >
          <span class="result-row__name">${item.name}</span>
          <span class="result-row__meta">
            <span class="result-row__type">${item.type}</span>
            ${createBadge(item.category, true)}
          </span>
        </button>
      `
    )
    .join("");

  resultsList.querySelectorAll(".result-row").forEach((button) => {
    button.addEventListener("click", () => {
      const item = PRODUCE_DATABASE.find((entry) => entry.name === button.dataset.name);
      if (item) {
        showDetail(item);
      }
    });
  });

  if (matches.length === 1) {
    showDetail(matches[0]);
  } else {
    const exact = matches.find((item) => normalize(item.name) === query);
    if (exact) {
      showDetail(exact);
    } else {
      hideDetail();
    }
  }
}

document.querySelectorAll(".suggestion-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    searchInput.value = chip.dataset.query;
    searchInput.focus();
    renderResults();
  });
});

searchInput.addEventListener("input", renderResults);
renderResults();
