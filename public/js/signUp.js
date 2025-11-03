
    // Toggle Password Visibility
    function togglePassword(id, element) {
      const input = document.getElementById(id);
      const icon = element.querySelector("i");

      if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("bi-eye-slash", "bi-eye");
      } else {
        input.type = "password";
        icon.classList.replace("bi-eye", "bi-eye-slash");
      }
    }

    // Form Validation
    document.getElementById("signupForm").addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("username");
      const email = document.getElementById("email");
      const password = document.getElementById("password");
      const confirmPassword = document.getElementById("confirmPassword");

      let valid = true;

      [username, email, password, confirmPassword].forEach((field) => {
        field.classList.remove("is-invalid");
        if (!field.value.trim()) {
          field.classList.add("is-invalid");
          valid = false;
        }
      });

      if (password.value !== confirmPassword.value) {
        confirmPassword.classList.add("is-invalid");
        valid = false;
      }

      if (valid) {
        this.submit(); // Submit the form if validation passes
      }
    });