// Route protection
if (!localStorage.getItem("session")) {
  window.location.href = "index.html";
}

const listEl = document.getElementById("list");
const emptyStateEl = document.getElementById("emptyState");

const categoryFilter = document.getElementById("categoryFilter");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");

let state = getState();

// Initial render
render(state.transactions);

// Filters
categoryFilter.addEventListener("change", applyFilters);
startDateInput.addEventListener("change", applyFilters);
endDateInput.addEventListener("change", applyFilters);

function applyFilters() {
  let filtered = [...state.transactions];

  const category = categoryFilter.value;
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  if (category !== "all") {
    filtered = filtered.filter(txn => txn.category === category);
  }

  if (startDate) {
    filtered = filtered.filter(txn => txn.date >= startDate);
  }

  if (endDate) {
    filtered = filtered.filter(txn => txn.date <= endDate);
  }

  render(filtered);
}

function render(transactions) {
  listEl.innerHTML = ""; // clearing container is safe
  emptyStateEl.style.display = transactions.length ? "none" : "block";

  transactions.forEach(txn => {
    const row = createRow(txn);
    listEl.appendChild(row);
  });
}

/* -------------------------
   Row Creation
-------------------------- */

function createRow(txn) {
  const row = document.createElement("div");
  row.className = "list-item";

  row.appendChild(createCell(txn.title));
  row.appendChild(createCell(txn.category));
  row.appendChild(createCell(txn.date));
  row.appendChild(createAmountCell(txn));
  row.appendChild(createActionsCell(txn.id));

  return row;
}

function createCell(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div;
}

function createAmountCell(txn) {
  const div = document.createElement("div");
  div.className = txn.type;

  const sign = txn.type === "expense" ? "-" : "+";
  div.textContent = `${sign}₹${txn.amount.toFixed(2)}`;

  return div;
}

function createActionsCell(id) {
  const container = document.createElement("div");
  container.className = "actions";

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => editTxn(id));

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => deleteTxn(id));

  container.appendChild(editBtn);
  container.appendChild(deleteBtn);

  return container;
}


