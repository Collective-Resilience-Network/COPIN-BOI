mapboxgl.accessToken =
"pk.eyJ1IjoiYXNiYXJ2ZSIsImEiOiI4c2ZpNzhVIn0.A1lSinnWsqr7oCUo0UMT7w";
const map = new mapboxgl.Map({
  container: "map", // Container ID
  style: "mapbox://styles/asbarve/clp6zwd1i00go01qx4vi064wp", // Map style to use
  attributionControl: false, //Hide Mapbox Bottom Right Message
  center: [101, 13.07], // Starting position [lng, lat]
  zoom: 6, // Starting zoom level
  projection: "globe",
});



// Function to update the filter



// // Initialize the search engine
// const geocoder = new MapboxGeocoder({
//     accessToken: mapboxgl.accessToken, // Set the access token
//     mapboxgl: mapboxgl, // Set the mapbox-gl instance
//     placeholder: "Search by Name", //placeholder text for the search bar
//   });


// map.addControl(geocoder);

map.on('load', function () {
  // Debug: Log to ensure the map is loaded
  console.log('Map loaded');
  document.getElementById('searchBar').addEventListener('input', function (e) {
    searchOrganizations(e.target.value.trim());
  });


  document.getElementById('select-all').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default link behavior

    const developmentNeedsCheckboxes = document.querySelectorAll('input[name="development-needs"]');

    // Find out if we should check or uncheck all boxes
    const allChecked = Array.from(developmentNeedsCheckboxes).every(cb => cb.checked);

    // Toggle state of other checkboxes 
    developmentNeedsCheckboxes.forEach(checkbox => {
      checkbox.checked = allChecked;
    });

    applyFilters(); // Refresh the filter
  });


  function searchOrganizations(query) {
    if (!query) {
      // If query is empty, reset the filter or adjust according to your needs
      map.setFilter('Nov23_BOI Community Survey', null); // Example of resetting the filter
      map.setFilter('BOI_highlighted_programs', null)
      return;
    }

    // Adjust the filter to search for a word within the organization names
    // This creates a case-insensitive filter that looks for the query within the organization name field
    const searchFilter = ['any',
      ['case',
        ['in', ['downcase', query], ['downcase', ['get', 'ชื่อองค์กรที่ต้องการเข้าร่วม']]],
        true,
        false]];

    // Apply the filter to the layer
    try {
      map.setFilter('Nov23_BOI Community Survey', searchFilter);
      map.setFilter('BOI_highlighted_programs', searchFilter);
    } catch (error) {
      console.error('Error applying search filter:', error);
    }
  }

  

  // Example: Add a source and layer here if needed
  // This code assumes the layer and its data are already added to the map through the style or programmatically

  // Apply filters based on checkbox changes
  document.querySelectorAll('input[name="development-needs"]').forEach(input => {
    input.addEventListener('change', function () {
      applyFilters();
    });
  });

  function applyFilters() {
    const checkboxes = document.querySelectorAll('input[name="development-needs"]:checked');
    const values = Array.from(checkboxes).map(cb => cb.value);

    // Debug: Log the current filter values
    console.log('Filtering for:', values);

    let filter = ['in', 'ความต้องการสนับสนุนการพัฒนาองค์กรของท่าน']; // Basic structure of an 'in' expression

    // Adjust the filter based on selected values
    if (values.length) {
      filter = ['any'];
      values.forEach(value => {
        filter.push(['==', ['get', 'ความต้องการสนับสนุนการพัฒนาองค์กรของท่าน'], value]);
      });
    }

    // Apply the filter to the layer, or reset if no filter is selected
    try {
      map.setFilter('Nov23_BOI Community Survey', filter.length > 1 ? filter : null);
      map.setFilter('BOI_highlighted_programs', filter.length > 1 ? filter : null);
    } catch (error) {
      console.error('Error applying filter:', error);
    }
  }
});


function getLogoPath(developmentNeeds) {
  switch (developmentNeeds) {
    case 'พัฒนาด้านการศึกษา สาธารณสุข และสิ่งแวดล้อมชุมชน':
      return 'icon/icon_edu.svg';
    case 'การพัฒนาคุณภาพชีวิตคนทุกช่วงวัย เช่น การพัฒนาเด็กเล็ก การดูแลผู้สูงอายุ':
      return 'icon/icon_product.svg';
    case 'พัฒนาภาคเกษตรและระบบน้ำ':
      return 'icon/icon_farm.svg';
    case 'พัฒนาหรือต่อยอดรูปแบบผลิตภัณฑ์หัตถกรรมท้องถิ่น':
      return 'icon/icon_product.svg';
    case 'พัฒนาการท่องเที่ยวชุมชน':
      return 'icon/icon_tourism.svg';
    case 'สนับสนุนโรงงานแปรรูปสินค้าเกษตรหรือผลผลิตทางการเกษตรของชุมชน':
      return 'icon/icon_factory.svg';
    default:
      return 'icon/default-logo.svg'; // Default logo if none of the cases match
  }
}

// add a popup for the basemap
map.on('click', 'Nov23_BOI Community Survey', (e) => {
  // แยกข้อมูลจาก Feature
  const {
    properties: {
      ชื่อองค์กรที่ต้องการเข้าร่วม: Organization,
      องค์กรท่านเป็นรูปแบบใด: OrganizationType,
      ความต้องการสนับสนุนการพัฒนาองค์กรของท่าน: DevelopmentNeeds,
      ความต้องการด้านเทคโนโลยีดิจิทัล: TechnologicalNeeds,
      ความต้องการด้านนวัตกรรม: InnovationNeeds,
      ตำบล: SubDistrict,
      อำเภอ: District,
      จังหวัด: Province,
      ['re-ลักษณะการดำเนินงานขององค์กรเป็นรูปแบบใด']: OperatingCharacteristics,
    },
    geometry: { coordinates },
  } = e.features[0];

  // ปรับพิกัดให้ตรงกับตำแหน่งที่คลิก
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  // สร้าง Popup
  const popup = new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(
      `<div class="popup-content">
        <h3>${Organization}</h3>
        <p>ต. ${SubDistrict} อ. ${District} จ. ${Province}</p>
        <h4>รูปแบบองค์กร:</h4>
        <p>${OrganizationType}</p>
        <h4>ลักษณะการดำเนินงาน:</h4>
        <p>${OperatingCharacteristics}</p>
        <h4>รูปแบบความต้องการสนับสนุน:</h4>
        <p><img src="${getLogoPath(DevelopmentNeeds)}" style="width:20px;height:20px;margin-right:5px;vertical-align:middle;">${DevelopmentNeeds}</p>
        <h4>ความต้องการด้านเทคโนโลยีดิจิทัล:</h4>
        <p>${TechnologicalNeeds}</p>
        <h4>ความต้องการด้านวัตกรรม:</h4>
        <p>${InnovationNeeds}</p>
        <div class="button-container-center">
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSeggJtcjYLbr9_03emHlH9O1SVy2mVjPUGQJ500T-Yg9p0Vig/viewform?usp=pp_url&entry.25230313=${Organization}" target="_blank" class="blue-button">สนใจสนับสนุน</a>
        </div>
      </div>`
    )
    .addTo(map);
});





    
map.on('click', 'BOI_highlighted_programs', (e) => {

  function generatePopupContent(Organization, SubDistrict, District, Province, DevelopmentNeeds, Projectname, Purpose1, Purpose2, Purpose3, photo, onepage) {

    // Get the logo path (assuming you have this function already)
    const logoPath = getLogoPath(DevelopmentNeeds);

    // Build an array of purposes, making sure to handle nulls 
    const purposes = [Purpose1, Purpose2, Purpose3].filter(purpose => purpose !== null && purpose !== '');

   // Start building your HTML string

    // Start building your HTML string
    let popupContent = `
    <div class="popup-content">
      <h3 style="margin-bottom: 0;">${Organization}</h3>
      <p>ต. ${SubDistrict} อ. ${District} จ. ${Province}</p>
      <h4> รูปแบบความต้องการสนับสนุน : </h4> 
      <p><img src="${logoPath}" style="width:20px;height:20px;margin-right:5px;vertical-align:middle;">${DevelopmentNeeds}</p> 
      <h4> โครงการที่ต้องการสนับสนุน: </h4> 
      <p><img src="icon/icon_highlight.svg" style="width:20px;height:20px;margin-right:5px;vertical-align:middle;">${Projectname}</p> 
      <h4> วัตถุประสงค์โครงการ: </h4> 
  `;

    // Add purposes dynamically
    purposes.forEach((purpose, index) => {
      popupContent += `<p>${index + 1}. ${purpose}</p>`;
    });

    // Continue building the HTML string.
    popupContent += `
      <img src="https://drive.google.com/thumbnail?id=${photo}" class="popup-image"> 
      <div class="button-container-center"> 
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSeggJtcjYLbr9_03emHlH9O1SVy2mVjPUGQJ500T-Yg9p0Vig/viewform?usp=pp_url&entry.25230313=${Organization}" target="_blank" class="blue-button">สนใจสนับสนุน</a> 
        <a href="${onepage}" target="_blank" class="blue-button">Onepage โครงการ</a> 
      </div> 
    </div>
  `;

    return popupContent;
  }

  const coordinates = e.features[0].geometry.coordinates.slice();

  const Organization = e.features[0].properties.ชื่อองค์กรที่ต้องการเข้าร่วม
  const SubDistrict = e.features[0].properties.ตำบล;
  const District = e.features[0].properties.อำเภอ;
  const Province = e.features[0].properties.จังหวัด;
  const Projectname = e.features[0].properties.ชื่อโครงการ;
  const DevelopmentNeeds = e.features[0].properties.ความต้องการสนับสนุนการพัฒนาองค์กรของท่าน;
  const Purpose1 = e.features[0].properties["วัตถุประสงค์โครงการ-1"];
  const Purpose2 = e.features[0].properties["วัตถุประสงค์โครงการ-2"];
  const Purpose3 = e.features[0].properties["วัตถุประสงค์โครงการ-3"]; 
  const photo = e.features[0].properties["photo"].split("/")[5];
  const onepage = e.features[0].properties.onepage;

  const test = e.features[0].properties

  console.log("test", test)

  console.log("onepage", onepage)
  console.log("photo" , photo)


  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  new mapboxgl.Popup()
  .setLngLat(coordinates)
  .setHTML(generatePopupContent(Organization, SubDistrict, District, Province, DevelopmentNeeds, Projectname, Purpose1, Purpose2, Purpose3, photo, onepage))
  .addTo(map);
})

map.on('mouseenter', 'BOI_highlighted_programs', () => {
  map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'BOI_highlighted_programs', () => {
  map.getCanvas().style.cursor = '';
});



    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'Nov23_BOI Community Survey', () => {
    map.getCanvas().style.cursor = 'pointer';
    });
     
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'Nov23_BOI Community Survey', () => {
    map.getCanvas().style.cursor = '';
    });


//  instantiate a popup for the basemap
// const basemapPopup = new mapboxgl.Popup({
//     closeButton: false,
//     closeOnClick: false,
//   });
  

// map.on("click", "Nov23_BOI Community Survey", (e) => {
//     console.log(e.features[0].properties.ความต้องการสนับสนุนการพัฒนาองค์กรของท่าน);
//     // string together a number of methods to create a popup
//       basemapPopup
//       .setLngLat(e.lngLat)
//       .setHTML(`${e.features[0].properties.ความต้องการสนับสนุนการพัฒนาองค์กรของท่าน}`)
//       .addTo(map);
      
//   }); 


/* map.on("mouseleave", "Nov23_BOI Community Survey", () => {
  basemapPopup.remove();
}); */


  