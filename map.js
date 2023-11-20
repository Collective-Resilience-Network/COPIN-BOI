mapboxgl.accessToken =
"pk.eyJ1IjoiYXNiYXJ2ZSIsImEiOiI4c2ZpNzhVIn0.A1lSinnWsqr7oCUo0UMT7w";
const map = new mapboxgl.Map({
  container: "map", // Container ID
  style: "mapbox://styles/asbarve/clp6zwd1i00go01qx4vi064wp", // Map style to use
  attributionControl: false, //Hide Mapbox Bottom Right Message
  center: [101, 13.07], // Starting position [lng, lat]
  zoom: 5, // Starting zoom level
  projection: "globe",
});

// Initialize the search engine
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken, // Set the access token
    mapboxgl: mapboxgl, // Set the mapbox-gl instance
    placeholder: "Search Location", //placeholder text for the search bar
  });

// Add the search engine to the map
map.addControl(geocoder);

map.on("load", () => {
  console.log(map.getStyle());
});



// add a popup for the basemap
map.on('click', 'Nov23_BOI Community Survey', (e) => {
    // Copy coordinates array.
    const coordinates = e.features[0].geometry.coordinates.slice();

    const Organization = e.features[0].properties.ชื่อองค์กรที่ต้องการเข้าร่วม;
    const OrganizationType = e.features[0].properties.องค์กรท่านเป็นรูปแบบใด;
    const DevelopmentNeeds = e.features[0].properties.ความต้องการสนับสนุนการพัฒนาองค์กรของท่าน;
    const TechnologicalNeeds = e.features[0].properties.ความต้องการด้านเทคโนโลยีดิจิทัล;
    const InnovationNeeds = e.features[0].properties.ความต้องการด้านนวัตกรรม;
     
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    
     
    new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(
        ('<h3>'+ Organization + '</h3>') + ('<h4> รูปแบบองค์กร: </h4>') + OrganizationType +
        ('<h4> ความต้องการ: </h4>') + ('&#x2022; ' + DevelopmentNeeds )  + "<br />" +  ('&#x2022; ' + TechnologicalNeeds) + "<br />" + ('&#x2022; ' + InnovationNeeds)
        )
    .addTo(map);
    });

   

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'Nov23_BOI Community Survey', () => {
    map.getCanvas().style.cursor = 'pointer';
    });
     
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'Nov23_BOI Community Survey', () => {
    map.getCanvas().style.cursor = '';
    });


/* // instantiate a popup for the basemap
const basemapPopup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });
  

map.on("click", "Nov23_BOI Community Survey", (e) => {
    console.log(e.features[0].properties.ความต้องการสนับสนุนการพัฒนาองค์กรของท่าน);
    // string together a number of methods to create a popup
      basemapPopup
      .setLngLat(e.lngLat)
      .setHTML(`${e.features[0].properties.ความต้องการสนับสนุนการพัฒนาองค์กรของท่าน}`)
      .addTo(map);
      
  }); */


/* map.on("mouseleave", "Nov23_BOI Community Survey", () => {
  basemapPopup.remove();
}); */


  