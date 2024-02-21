document.addEventListener('DOMContentLoaded', function() {
  const checkboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');
  const selectAllLink = document.getElementById('select-all');

  selectAllLink.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior

    for (const checkbox of checkboxes) {
      checkbox.checked = true;
    }
  });
});
