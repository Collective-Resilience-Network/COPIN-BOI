let boiHighlightedProgramsData = [];
map.on('load', 'BOI_highlighted_programs', (e) => {
    boiHighlightedProgramsData = e.features;
});


function showHighlightPopup() {
    const highlightPopup = document.getElementById('highlight-popup');
    const itemsContainer = document.getElementById('highlight-items-container');

    // Clear previous items
    itemsContainer.innerHTML = '';

    // Use the stored data
    boiHighlightedProgramsData.forEach(feature => {
        const highlightProgram = feature.properties['ชื่อองค์กรที่ต้องการเข้าร่วม'];
        let onepage = feature.properties.onepage;

        // Extract photo ID from the 'onepage' URL
        let photo = onepage ? onepage.split('/')[5] : null;

        // Create an element for each item
        const itemElement = document.createElement('div');
        itemElement.classList.add('highlight-item');

        // Add text content for the highlight program
        const textElement = document.createElement('p');
        textElement.textContent = highlightProgram;
        itemElement.appendChild(textElement);

        // Add an image if 'onepage' contains a photo ID
        if (photo) {
            const imgURL = `https://lh3.googleusercontent.com/d/${photo}`;
            console.log(imgURL)
            const imgElement = document.createElement('img');
            imgElement.src = imgURL;
            imgElement.alt = 'Program Image';
            imgElement.classList.add('highlight-popup-image');
            itemElement.appendChild(imgElement);

            // Create button container
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('button-container-center');

            // Create the link button
            const linkButton = document.createElement('a');
            const organizationName = encodeURIComponent(highlightProgram); // Ensure the organization's name is URL-friendly
            linkButton.href = `https://docs.google.com/forms/d/e/1FAIpQLSeggJtcjYLbr9_03emHlH9O1SVy2mVjPUGQJ500T-Yg9p0Vig/viewform?usp=pp_url&entry.25230313=${organizationName}`;
            linkButton.target = '_blank';
            linkButton.textContent = 'สนใจสนับสนุน'; // Text to display on the button
            linkButton.classList.add('blue-button');
            buttonContainer.appendChild(linkButton);

            // Append button container to item element
            itemElement.appendChild(buttonContainer);
        }

        // Append item to container
        itemsContainer.appendChild(itemElement);
    });

    // Show popup
    highlightPopup.style.display = 'block';
}

// Attach event listener to the show highlights button
document.getElementById('yellow-button').addEventListener('click', showHighlightPopup);

// Handle closing the popup
document.querySelector('.highlight-close-btn').addEventListener('click', () => {
    document.getElementById('highlight-popup').style.display = 'none';
});