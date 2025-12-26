// ------------------------------
// Auth protection
// ------------------------------
if (!localStorage.getItem("session")) {
  window.location.href = "index.html";
}

// ------------------------------
// DOM Elements
// ------------------------------
const form = document.getElementById("transactionForm");

const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

const errors = {
  title: document.getElementById("titleError"),
  amount: document.getElementById("amountError"),
  category: document.getElementById("categoryError"),
  date: document.getElementById("dateError"),
};

// ------------------------------
// Category Storage Key
// ------------------------------
const CATEGORY_KEY = "expense_categories";

// ------------------------------
// Load ONLY enabled categories
// ------------------------------
function loadEnabledCategories() {
  const raw = localStorage.getItem(CATEGORY_KEY);
  const categories = raw ? JSON.parse(raw) : [];

  categoryInput.innerHTML = `<option value="">Select category</option>`;

  categories
    .filter(cat => cat.enabled !== false) // enabled by default
    .forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.name;
      option.textContent = cat.name;
      categoryInput.appendChild(option);
    });
}

// Load categories on page load
loadEnabledCategories();

// ------------------------------
// Form Submit
// ------------------------------
form.addEventListener("submit", function (e) {
  e.preventDefault();
  clearErrors();

  const title = titleInput.value.trim();
  const amount = Number(amountInput.value);
  const category = categoryInput.value;
  const date = dateInput.value;
  const type = document.querySelector('input[name="type"]:checked')?.value;

  let valid = true;

  // ------------------------------
  // Validation
  // ------------------------------
  if (!title) {
    errors.title.textContent = "Title is required";
    valid = false;
  }

  if (!amount || amount <= 0) {
    errors.amount.textContent = "Enter a valid amount";
    valid = false;
  }

  if (!category) {
    errors.category.textContent = "Select a category";
    valid = false;
  }

  if (!date || new Date(date) > new Date()) {
    errors.date.textContent = "Invalid date";
    valid = false;
  }

  if (!type) {
    alert("Please select income or expense");
    valid = false;
  }

  if (!valid) return;

  // ------------------------------
  // Safety check:
  // Prevent saving disabled category
  // ------------------------------
  const raw = localStorage.getItem(CATEGORY_KEY);
  const categories = raw ? JSON.parse(raw) : [];

  const categoryValid = categories.some(
    cat => cat.name === category && cat.enabled !== false
  );

  if (!categoryValid) {
    errors.category.textContent =
      "This category is disabled. Please choose another.";
    return;
  }

  // ------------------------------
  // Save Transaction
  // ------------------------------
  const state = getState();

  state.transactions.push({
    id: Date.now(),
    title,
    amount,
    category,
    date,
    type,
  });

  setState(state);

  // Redirect after save
  window.location.href = "dashboard.html";
});

// ------------------------------
// Helpers
// ------------------------------
function clearErrors() {
  Object.values(errors).forEach(el => (el.textContent = ""));
}
