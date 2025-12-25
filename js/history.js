/* -------------------------
   Route Protection
-------------------------- */
if (!localStorage.getItem("session")) {
  window.location.href = "index.html";
}

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
   Initial Render
-------------------------- */
render(state.transactions);

/* -------------------------
   Filters
-------------------------- */
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

/*
   Delete Transaction
 */
function deleteTxn(id) {
  state.transactions = state.transactions.filter(txn => txn.id !== id);
  setState(state);
  applyFilters();
}

/* 
   Edit Modal Logic
 */
function openEditModal(id) {
  const txn = state.transactions.find(t => t.id === id);
  if (!txn) return;

  currentEditId = id;

  editTitle.value = txn.title;
  editAmount.value = txn.amount;
  editCategory.value = txn.category;
  editDate.value = txn.date;

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

/* 
   Submit Edit
 */
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
