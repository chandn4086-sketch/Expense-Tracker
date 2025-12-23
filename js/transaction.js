// Auth protection
if (!localStorage.getItem("session")) {
  window.location.href = "index.html";
}

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

form.addEventListener("submit", function (e) {
  e.preventDefault();
  clearErrors();

  const title = titleInput.value.trim();
  const amount = Number(amountInput.value);
  const category = categoryInput.value;
  const date = dateInput.value;
  const type = document.querySelector('input[name="type"]:checked').value;

  let valid = true;

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

  if (!valid) return;

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
  window.location.href = "dashboard.html";
});

function clearErrors() {
  Object.values(errors).forEach(el => (el.textContent = ""));
}
