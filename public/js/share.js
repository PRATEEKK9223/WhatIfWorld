
let currentShareUrl = "";
let currentShareTitle = "";

// Open modal
document.querySelectorAll(".open-share-modal").forEach(btn => {
  btn.addEventListener("click", () => {
    currentShareUrl = btn.dataset.url;
    currentShareTitle = btn.dataset.title;
    document.getElementById("shareModal").classList.remove("d-none");
  });
});

// Close modal
document.getElementById("closeShareModal").addEventListener("click", () => {
  document.getElementById("shareModal").classList.add("d-none");
});

// WhatsApp
document.getElementById("shareWhatsApp").onclick = () => {
  window.open(`https://wa.me/?text=${encodeURIComponent(currentShareTitle + "\n" + currentShareUrl)}`);
};

// Facebook
document.getElementById("shareFacebook").onclick = () => {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentShareUrl)}`);
};

// X (Twitter)
document.getElementById("shareTwitter").onclick = () => {
  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentShareUrl)}&text=${encodeURIComponent(currentShareTitle)}`);
};

// Email
document.getElementById("shareEmail").onclick = () => {
  const subject = encodeURIComponent(currentShareTitle);
  const body = encodeURIComponent(`Check this out:\n${currentShareUrl}`);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
};

// Copy link
document.getElementById("shareCopy").onclick = async () => {
  await navigator.clipboard.writeText(currentShareUrl);
  document.getElementById("shareCopy").innerHTML = "✔ Copied!";
  setTimeout(() => {
    document.getElementById("shareCopy").innerHTML = `<i class="bi bi-clipboard"></i> Copy Link`;
  }, 1500);
};

