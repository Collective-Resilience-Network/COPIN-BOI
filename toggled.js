document.addEventListener('DOMContentLoaded', function () {
    // Initially hide the filterGroup when the page loads
    document.getElementById('filter-ui').style.display = 'none';
});

document.getElementById('toggle-btn').addEventListener('click', function () {
    var filterGroup = document.getElementById('filter-ui');
    filterGroup.style.display = filterGroup.style.display === 'none' || filterGroup.style.display === '' ? 'block' : 'none';
});

document.getElementById('select-all').addEventListener('change', function () {
    var checkboxes = document.querySelectorAll('.filter-group input[type="checkbox"]:not(#select-all)');
    checkboxes.forEach(function (checkbox) {
        checkbox.checked = document.getElementById('select-all').checked;
    });
});
