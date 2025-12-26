// ------------------------------
// Auth protection
// ------------------------------
if (!localStorage.getItem("session")) {
  window.location.href = "index.html";
}

// ------------------------------
// Constants
// ------------------------------
const CATEGORY_KEY = "expense_categories";

// ------------------------------
// DOM Elements
// ------------------------------
const form = document.getElementById("categoryForm");
const nameInput = document.getElementById("categoryName");
const errorEl = document.getElementById("categoryError");
const listEl = document.getElementById("categoryList");

/* Modal elements */
const editModal = document.getElementById("editModal");
const editInput = document.getElementById("editCategoryInput");
const editError = document.getElementById("editCategoryError");
const cancelEditBtn = document.getElementById("cancelEdit");
const confirmEditBtn = document.getElementById("confirmEdit");

let editCategoryId = null;

// ------------------------------
// Helpers
// ------------------------------
function getCategories() {
  try {
    const raw = localStorage.getItem(CATEGORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCategories(categories) {
  localStorage.setItem(CATEGORY_KEY, JSON.stringify(categories));
}

// ------------------------------
// Render Categories
// ------------------------------
function render() {
  const categories = getCategories();
  listEl.innerHTML = "";

  if (!categories.length) {
    const empty = document.createElement("p");
    empty.textContent = "No categories added";
    listEl.appendChild(empty);
    return;
  }

  categories.forEach(cat => {
    const row = document.createElement("div");
    row.className = "category-item";

    const name = document.createElement("div");
    name.className = "category-name";
    name.textContent = cat.name;

    const actions = document.createElement("div");
    actions.className = "category-actions";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => openEditModal(cat.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteCategory(cat.id));

    actions.append(editBtn, deleteBtn);
    row.append(name, actions);
    listEl.appendChild(row);
  });
}

// ------------------------------
// Add Category
// ------------------------------
form.addEventListener("submit", e => {
  e.preventDefault();
  errorEl.textContent = "";

  const name = nameInput.value.trim();
  if (!name) {
    errorEl.textContent = "Category name is required";
    return;
  }

  const categories = getCategories();
  if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
    errorEl.textContent = "Category already exists";
    return;
  }

  categories.push({ id: Date.now(), name });
  saveCategories(categories);
  nameInput.value = "";
  render();
});

// ------------------------------
// Edit Category (Modal)
// ------------------------------
function openEditModal(id) {
  const categories = getCategories();
  const category = categories.find(c => c.id === id);
  if (!category) return;

  editCategoryId = id;
  editInput.value = category.name;
  editError.textContent = "";

  editModal.classList.remove("hidden");
}

cancelEditBtn.addEventListener("click", () => {
  editModal.classList.add("hidden");
  editCategoryId = null;
});

confirmEditBtn.addEventListener("click", () => {
  const newName = editInput.value.trim();
  if (!newName) {
    editError.textContent = "Category name required";
    return;
  }

  const categories = getCategories();
  if (
    categories.some(
      c =>
        c.name.toLowerCase() === newName.toLowerCase() &&
        c.id !== editCategoryId
    )
  ) {
    editError.textContent = "Category already exists";
    return;
  }

  const category = categories.find(c => c.id === editCategoryId);
  if (!category) return;

  category.name = newName;
  saveCategories(categories);

  editModal.classList.add("hidden");
  editCategoryId = null;
  render();
});

// ------------------------------
// Delete Category
// ------------------------------
function deleteCategory(id) {
  const categories = getCategories();
  const category = categories.find(c => c.id === id);
  if (!category) return;

  if (!confirm(`Delete category "${category.name}"?`)) return;

  const updated = categories.filter(c => c.id !== id);
  saveCategories(updated);
  render();
}

// ------------------------------
// Initial Load
// ------------------------------
render();
