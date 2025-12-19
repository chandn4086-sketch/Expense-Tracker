const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const loginError = document.getElementById("loginError");

// Define allowed credentials
const VALID_EMAIL = "admin@test.com";
const VALID_PASSWORD = "admin123";

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Reset errors
  emailError.textContent = "";
  passwordError.textContent = "";
  loginError.textContent = "";

  let isValid = true;

  if (!emailInput.value.trim()) {
    emailError.textContent = "Email is required";
    isValid = false;
  }

  if (!passwordInput.value.trim()) {
    passwordError.textContent = "Password is required";
    isValid = false;
  }

  if (!isValid) return;

  // Check credentials
  if (
    emailInput.value.trim() === VALID_EMAIL &&
    passwordInput.value === VALID_PASSWORD
  ) {
    // Successful login → store session
    localStorage.setItem(
      "session",
      JSON.stringify({ email: emailInput.value.trim() })
    );
    window.location.href = "dashboard.html";
  } else {
    loginError.textContent = "Invalid email or password";
  }
});
