
  const profileToggle = document.getElementById("profileToggle");
  const sidebar = document.getElementById("profileSidebar");
  const overlay = document.getElementById("overlay");

  profileToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
  });

  overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });


  // TO close the profile side bar 


  const closeSidebar = document.getElementById("closeSidebar");

  if (closeSidebar) {
    closeSidebar.addEventListener("click", () => {
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
    });
  }



