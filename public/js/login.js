// login.js

// Password visibility toggle
function togglePassword(id, element) {
  const input = document.getElementById(id);
  const icon = element.querySelector("i");

  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("bi-eye-slash");
    icon.classList.add("bi-eye");
  } else {
    input.type = "password";
    icon.classList.remove("bi-eye");
    icon.classList.add("bi-eye-slash");
  }
}

// Bootstrap form validation (client side)
(() => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", function (event) {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }

    form.classList.add("was-validated");
  });
})();
