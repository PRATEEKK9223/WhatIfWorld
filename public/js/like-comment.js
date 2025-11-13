// like feature

document.addEventListener("DOMContentLoaded", () => {
  const likeButtons = document.querySelectorAll(".btn-like");

  likeButtons.forEach(button => {
    button.addEventListener("click", async (e) => {
      e.preventDefault();

      const postId = button.getAttribute("data-id");
      const icon = button.querySelector("i");
      const countSpan = button.querySelector("span");

      try {
        const res = await fetch(`/community/like/${postId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (res.status === 401) {
          const data = await res.json();
          window.location.href = data.redirectUrl;
          return;
        }

        const data = await res.json();

        if (data.success) {
          if (data.isLiked) {
            icon.classList.remove("bi-heart");
            icon.classList.add("bi-heart-fill", "text-danger");

            // 💥 Add animation
            icon.classList.add("animate-like");
            setTimeout(() => icon.classList.remove("animate-like"), 300);

          } else {
            icon.classList.remove("bi-heart-fill", "text-danger");
            icon.classList.add("bi-heart");
          }

          countSpan.textContent = data.likeCount;
        } else {
          alert(data.message || "Error updating like");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong. Please try again.");
      }
    });
  });
});



// --------------------------------------------------Comment feature---------------------------------------------------------------------------------
// Comment feature
document.addEventListener("DOMContentLoaded", () => {
  // ✅ Handle comment submission
  document.querySelectorAll(".comment-form").forEach(form => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const postId = form.getAttribute("data-id");
      const input = form.querySelector("input");
      const text = input.value.trim();
      if (!text) return;

      try {
        const res = await fetch(`/community/comment/${postId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest"
          },
          body: JSON.stringify({ text })
        });

        if (res.status === 401) {
          const data = await res.json().catch(() => ({}));
          window.location.href = data.redirectUrl || "/login";
          return;
        }

        const data = await res.json();

        if (data.success) {
          const list = document.querySelector(`#comments-${postId}`);
          const div = document.createElement("div");
          div.className = "comment mb-3 p-3 bg-light rounded-4 shadow-sm position-relative";
          div.id = `comment-${data.comment.id}`;

          // ✅ Get current logged-in user ID from global variable
          const currentUserId = window.CURRENT_USER_ID;

          // ✅ Construct comment HTML
          div.innerHTML = `
            <div class="d-flex align-items-center mb-2">
              <a href="/profile/${data.comment.author._id || currentUserId}">
                <img src="${data.comment.author.photo}" 
                    class="rounded-circle me-3 border border-2 border-white shadow-sm" 
                    width="30" height="30" alt="User">
              </a>
              <div class="d-flex flex-column">
                <span class="fw-semibold">@${data.comment.author.username.toLowerCase()}</span>
                <small class="text-muted">${new Date(data.comment.createdAt).toLocaleString()}</small>
              </div>
            </div>

            <p class="mb-0 ps-5 text-secondary">${data.comment.text}</p>

            ${
              currentUserId === (data.comment.author._id || currentUserId)
                ? `
                <div class="dropdown position-absolute top-0 end-0 mt-2 me-2 comment-menu">
                  <button class="btn btn-sm text-muted" type="button" id="commentMenu-${data.comment.id}" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-three-dots-vertical"></i>
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="commentMenu-${data.comment.id}">
                    <li>
                      <button class="dropdown-item text-danger delete-comment-btn"
                              data-postid="${postId}"
                              data-commentid="${data.comment.id}">
                        <i class="bi bi-trash me-2"></i> Delete
                      </button>
                    </li>
                  </ul>
                </div>
              `
                : ""
            }
          `;

          list.appendChild(div);
          input.value = ""; // clear input

          // ✅ Instantly update comment count
          const countSpan = document.getElementById(`commentsCount-${postId}`);
          if (countSpan) {
            const currentCount = parseInt(countSpan.textContent) || 0;
            countSpan.textContent = currentCount + 1;
          }
        } else {
          alert(data.message || "Error posting comment");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong while posting your comment.");
      }
    });
  });
});


// ✅ Handle delete comment instantly
document.addEventListener("click", async (e) => {
  if (e.target.closest(".delete-comment-btn")) {
    const btn = e.target.closest(".delete-comment-btn");
    const postId = btn.dataset.postid;
    const commentId = btn.dataset.commentid;

    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(`/community/comment/${postId}/${commentId}`, {
        method: "DELETE",
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        }
      });

      const data = await res.json();

      if (data.success) {
        const commentDiv = document.getElementById(`comment-${commentId}`);
        if (commentDiv) commentDiv.remove();

        // ✅ Update the comment count instantly
        const countSpan = document.getElementById(`commentsCount-${postId}`);
        if (countSpan) {
          const currentCount = parseInt(countSpan.textContent) || 0;
          countSpan.textContent = Math.max(currentCount - 1, 0);
        }
      } else {
        alert(data.message || "Error deleting comment");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while deleting the comment.");
    }
  }
});
