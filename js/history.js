/* -------------------------
   Route Protection
-------------------------- */
if (!localStorage.getItem("session")) {
  window.location.href = "index.html";
}

/* -------------------------
   Storage Keys
-------------------------- */
const CATEGORY_KEY = "expense_categories";

/* -------------------------
   DOM Elements
-------------------------- */
const listEl = document.getElementById("list");
const emptyStateEl = document.getElementById("emptyState");

const categoryFilter = document.getElementById("categoryFilter");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");

/* Modal Elements */
const modal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");

const editTitle = document.getElementById("editTitle");
const editAmount = document.getElementById("editAmount");
const editCategory = document.getElementById("editCategory");
const editDate = document.getElementById("editDate");
const editTypeInputs = document.querySelectorAll('input[name="editType"]');
const cancelEditBtn = document.getElementById("cancelEdit");

/* -------------------------
   App State
-------------------------- */
let state = getState();
let currentEditId = null;

/* -------------------------
   Initial Setup
-------------------------- */
loadCategoryFilters();
loadEditCategories();
render(state.transactions);

/* -------------------------
   Filters
-------------------------- */
categoryFilter.addEventListener("change", applyFilters);
startDateInput.addEventListener("change", applyFilters);
endDateInput.addEventListener("change", applyFilters);

/* -------------------------
   Load Categories (Enabled Only)
-------------------------- */
function loadCategoryFilters() {
  const raw = localStorage.getItem(CATEGORY_KEY);
  const categories = raw ? JSON.parse(raw) : [];

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories
    .filter(cat => cat.enabled !== false)
    .forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.name;
      option.textContent = cat.name;
      categoryFilter.appendChild(option);
    });
}

function loadEditCategories() {
  const raw = localStorage.getItem(CATEGORY_KEY);
  const categories = raw ? JSON.parse(raw) : [];

  editCategory.innerHTML = "";

  categories
    .filter(cat => cat.enabled !== false)
    .forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.name;
      option.textContent = cat.name;
      editCategory.appendChild(option);
    });
}

/* -------------------------
   Apply Filters
-------------------------- */
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

/* -------------------------
   Render List
-------------------------- */
function render(transactions) {
  listEl.innerHTML = "";
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
  editBtn.addEventListener("click", () => openEditModal(id));

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => deleteTxn(id));

  container.appendChild(editBtn);
  container.appendChild(deleteBtn);

  return container;
}

/* -------------------------
   Delete Transaction
-------------------------- */
function deleteTxn(id) {
  state.transactions = state.transactions.filter(txn => txn.id !== id);
  setState(state);
  applyFilters();
}

/* -------------------------
   Edit Modal Logic
-------------------------- */
function openEditModal(id) {
  const txn = state.transactions.find(t => t.id === id);
  if (!txn) return;

  currentEditId = id;

  editTitle.value = txn.title;
  editAmount.value = txn.amount;
  editDate.value = txn.date;

  // Reload categories in case they changed
  loadEditCategories();
  editCategory.value = txn.category;

  editTypeInputs.forEach(radio => {
    radio.checked = radio.value === txn.type;
  });

  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
  currentEditId = null;
}

cancelEditBtn.addEventListener("click", closeModal);

/* -------------------------
   Submit Edit
-------------------------- */
editForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!currentEditId) return;

  const updated = {
    title: editTitle.value.trim(),
    amount: Number(editAmount.value),
    category: editCategory.value,
    date: editDate.value,
    type: document.querySelector('input[name="editType"]:checked').value,
  };

  const index = state.transactions.findIndex(t => t.id === currentEditId);
  if (index === -1) return;

  state.transactions[index] = {
    ...state.transactions[index],
    ...updated,
  };

  setState(state);
  closeModal();
  applyFilters();
});
