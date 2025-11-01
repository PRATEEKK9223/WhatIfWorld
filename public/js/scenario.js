const buttons = document.querySelectorAll('.category-btn');
    const domainInput = document.getElementById('selectedDomain');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        domainInput.value = btn.getAttribute('data-value');
      });
    });