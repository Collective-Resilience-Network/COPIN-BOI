
document.addEventListener('DOMContentLoaded', function () {
    // Elements
    var hamburger = document.getElementById('hamburger');
    var yellowButton = document.getElementById('yellow-button');
    var searchBar = document.querySelector('.search-container');
    var toggleBtn = document.getElementById('toggle-btn');
    var popup = document.getElementById('information-popup');
    var highlightPopup = document.getElementById('highlight-popup');
    var closeBtn = popup.querySelector('.close-btn');
    var closeBtnHighlight = highlightPopup.querySelector('.highlight-close-btn');
    var yellowButton = document.getElementById('yellow-button')

    // Function to hide all popups
    function hideAllPopups() {
        [popup, highlightPopup].forEach(function (popupElement) {
            popupElement.style.display = 'none';
        });
    }

    // Function to show a popup and hide others
    function showPopup(popupElement) {
        hideAllPopups(); // Hide all popups first
        popupElement.style.display = 'block'; // Then show the requested popup
        searchBar.classList.add('hidden'); // Hide the search bar
        toggleBtn.classList.add('hidden'); // Hide the toggle button
        yellowButton.classList.add('hidden');
    }

    // Function to close the popup and show the searchBar and toggleBtn
    function closePopup() {
        hideAllPopups(); // Hide all popups
        searchBar.classList.remove('hidden'); // Show the search bar
        toggleBtn.classList.remove('hidden'); // Show the toggle button
        yellowButton.classList.remove('hidden');
    }

    // Attach event listeners for opening popups
    hamburger.addEventListener('click', function () {
        showPopup(popup);
    });

    yellowButton.addEventListener('click', function () {
        showPopup(highlightPopup);
    });

    // Attach event listeners for closing popups
    closeBtn.addEventListener('click', closePopup);
    closeBtnHighlight.addEventListener('click', closePopup);

    // Event listener to close popups when clicking outside
    document.addEventListener('click', function (e) {
        if (!popup.contains(e.target) && !hamburger.contains(e.target) &&
            !highlightPopup.contains(e.target) && !yellowButton.contains(e.target)) {
            closePopup();
        }
    });
});
