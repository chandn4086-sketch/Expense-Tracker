// Check if user is logged in
if (!localStorage.getItem("session")) {
  window.location.href = "index.html"; // Redirect if not logged in
}

// Logout button
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", function () {
  localStorage.removeItem("session");
  window.location.href = "index.html";
});

// Elements
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");
const warningEl = document.getElementById("warning");

// Load state from localStorage
const state = JSON.parse(localStorage.getItem("expense_tracker")) || { transactions: [] };

// Calculate summary
let totalIncome = 0;
let totalExpense = 0;

state.transactions.forEach(txn => {
  if (txn.type === "income") {
    totalIncome += txn.amount;
  } else if (txn.type === "expense") {
    totalExpense += txn.amount;
  }
});

const balance = totalIncome - totalExpense;

// Render values
incomeEl.textContent = totalIncome.toFixed(2);
expenseEl.textContent = totalExpense.toFixed(2);
balanceEl.textContent = balance.toFixed(2);

// Show warning if expense > income
if (totalExpense > totalIncome) {
  warningEl.textContent = "Warning: Expenses exceed income!";
} else {
  warningEl.textContent = "";
}
