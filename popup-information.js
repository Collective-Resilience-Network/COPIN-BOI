
    document.addEventListener('DOMContentLoaded', function() {
    // Get the hamburger button and the popup element
    var hamburger = document.getElementById('hamburger');
    var popup = document.getElementById('popup');

    // Function to toggle popup visibility
    function togglePopup() {
      if (popup.style.display === 'none' || popup.style.display === '') {
        popup.style.display = 'block';
      } else {
        popup.style.display = 'none';
      }
    }


        window.closePopup = function () {
            popup.style.display = 'none';
        }


    // Event listener for the hamburger button
    hamburger.addEventListener('click', togglePopup);
  });

