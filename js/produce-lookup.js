const searchInput = document.getElementById("produce-search");
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

function showDetail(item) {
  detailName.textContent = item.name;
  detailType.textContent = item.type.charAt(0).toUpperCase() + item.type.slice(1);
  detailBadge.innerHTML = createBadge(item.category);
  detailCard.classList.remove("detail-card--hidden");
}

function renderResults() {
  const query = normalize(searchInput.value);

  if (!query) {
    resultsCount.textContent = "Start typing to search";
    resultsList.innerHTML = "";
    emptyState.classList.add("empty-state--hidden");
    detailCard.classList.add("detail-card--hidden");
    return;
  }

  const matches = PRODUCE_DATABASE.filter(matchesQuery);
  const limited = matches.slice(0, MAX_RESULTS);

  resultsCount.textContent =
    matches.length === 0
      ? "No matches"
      : matches.length > MAX_RESULTS
        ? `Showing ${MAX_RESULTS} of ${matches.length} matches`
        : `${matches.length} match${matches.length === 1 ? "" : "es"}`;

  if (matches.length === 0) {
    resultsList.innerHTML = "";
    emptyState.classList.remove("empty-state--hidden");
    detailCard.classList.add("detail-card--hidden");
    return;
  }

  emptyState.classList.add("empty-state--hidden");

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
    }
  }
}

searchInput.addEventListener("input", renderResults);
renderResults();
