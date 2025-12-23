// Wrapper to safely get/set app state
const STORAGE_KEY = "expense_tracker";

function getState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { transactions: [] };
    return JSON.parse(raw);
  } catch {
    return { transactions: [] }; // Handle corrupted data
  }
}

function setState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
