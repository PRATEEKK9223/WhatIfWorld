
document.querySelectorAll(".view-full-btn").forEach(btn => {
  btn.addEventListener("click", function () {
    
    const postId = this.getAttribute("data-id");

    fetch(`/community/view/${postId}`, { method: "POST" })
      .then(res => res.json())
      .then(data => console.log("View updated:", data.views));
  });
});
