
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const body = document.body;

  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    themeIcon.classList.replace("bi-moon", "bi-sun");
  }

  // Toggle theme on click
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    const isDark = body.classList.contains("dark-mode");

    // Switch icons
    if (isDark) {
      themeIcon.classList.replace("bi-moon", "bi-sun");
      localStorage.setItem("theme", "dark");
    } else {
      themeIcon.classList.replace("bi-sun", "bi-moon");
      localStorage.setItem("theme", "light");
    }
  });


