// Initialize the map with custom zoom options
var map = L.map('map', {
    attributionControl: true, // Ensure the attribution control is enabled
    attributionControlOptions: {
        position: 'bottomright' // Change to 'bottomleft', 'topright', or 'topleft'
    },
    zoomAnimation: true, // Enable zoom animation
    zoomSnap: 0.5, // Disable zoom snapping
    zoomDelta: 1, // Smaller delta for smoother zoom
    scrollWheelZoom: false, // disable original zoom function
    smoothWheelZoom: true,  // enable smooth zoom 
    smoothSensitivity: 5,   // zoom speed. default is 1
  }).setView([51.505, 10.09], 4); // Centered over Europe

  map.attributionControl.setPrefix(''); // Remove the default Leaflet link if desired
  map.attributionControl.addAttribution(''); // Add custom text here if needed

// Add a tile layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
    minZoom: 1,
    attribution: ''
}).addTo(map);



let markers = []; // Array to hold current markers

// Define a custom DivIcon
const composerDivIcon = L.divIcon({
    className: 'custom-div-icon', // CSS class for styling
    html: '<div class="marker-pin"></div>', // HTML content for the marker
    iconSize: [20, 20], // Size of the icon
    iconAnchor: [10, 10], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -10] // Point from which the popup should open relative to the iconAnchor
});


let jitteredCoordinates = {}; // Object to store jittered coordinates

// Function to add markers to the map
function addMarkers(data) {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    const jitterAmount = 0.1; // Adjust this value for the desired offset
    const nameVisibleZoomLevel = 5; // Set the zoom level at which names become visible

    data.forEach(function(row) {
        var name = row['Name'];
        var birthYear = parseInt(row['Birth Year']);
        var deathYear = parseInt(row['Death Year']);
        var cityOfBirth = row['City of Birth'];
        var lat = parseFloat(row['Latitude']);
        var lon = parseFloat(row['Longitude']);
        
        if (!isNaN(lat) && !isNaN(lon)) {
            // Check if jittered coordinates already exist
            if (!jitteredCoordinates[name]) {
                // Apply a slight random offset to the coordinates
                var jitteredLat = lat + (Math.random() - 0.5) * jitterAmount;
                var jitteredLon = lon + (Math.random() - 0.5) * jitterAmount;
                jitteredCoordinates[name] = { lat: jitteredLat, lon: jitteredLon };
            }

            var jitteredLat = jitteredCoordinates[name].lat;
            var jitteredLon = jitteredCoordinates[name].lon;

            if (isComposerInTimeSpan(birthYear, deathYear)) {
                var popupContent = `${name}<br>(${birthYear} - ${deathYear})<br>Born in: ${cityOfBirth}`;
                
                // Create a custom DivIcon with the composer's name
                var composerDivIcon = L.divIcon({
                    className: 'custom-div-icon', // CSS class for styling
                    html: `<div class="marker-pin"></div><span class="composer-name">${name}</span>`, // HTML content for the marker
                    iconSize: [30, 20], // Adjust size to fit name
                    iconAnchor: [15, 10], // Adjust anchor to center
                    popupAnchor: [0, -10] // Point from which the popup should open relative to the iconAnchor
                });

                var marker = L.marker([jitteredLat, jitteredLon], { icon: composerDivIcon })
                    .addTo(map)
                    .bindPopup(popupContent);
                markers.push(marker);
            }
        }
    });

    // Update visibility of composer names based on zoom level
    map.on('zoomend', function() {
        var currentZoom = map.getZoom();
        document.querySelectorAll('.composer-name').forEach(function(nameElement) {
            nameElement.style.display = currentZoom >= nameVisibleZoomLevel ? 'inline' : 'none';
        });
    });

    // Trigger the zoomend event to set initial visibility
    map.fire('zoomend');
}

let filterOption = 'alive'; // Default filter option

// Function to check if a composer is within the selected time span based on the filter option
function isComposerInTimeSpan(birthYear, deathYear) {
    const currentYear = new Date().getFullYear(); // Get the current year

    if (filterOption === 'alive') {
        // Treat missing death year as if the composer is still alive
        deathYear = deathYear || currentYear;
        return (birthYear <= endYear && deathYear >= startYear);
    } else if (filterOption === 'death-year') {
        return (deathYear && deathYear >= startYear && deathYear <= endYear);
    } else if (filterOption === 'birth-year') {
        return (birthYear >= startYear && birthYear <= endYear);
    }
    return false;
}

// Event listener for radio buttons
document.querySelectorAll('input[name="filter"]').forEach((radio) => {
    radio.addEventListener('change', (e) => {
        filterOption = e.target.value;
        console.log('Filter Option Changed:', filterOption);
        updateSlider(); // Re-filter and update markers
    });
});

let composerData = [];
Papa.parse('composers_with_coordinates.csv', {
    download: true,
    header: true,
    delimiter: ";",
    complete: function(results) {
        composerData = results.data;
        addMarkers(composerData);
    },
    error: function(error) {
        console.error("Error loading CSV file:", error);
    }
});

const outerSlider = document.getElementById('outer-slider');
const innerSlider = document.getElementById('inner-slider');
const startHandle = document.getElementById('start-handle');
const endHandle = document.getElementById('end-handle');
const startYearInput = document.getElementById('start-year');
const endYearInput = document.getElementById('end-year');

const minYear = 1600;
const maxYear = 2024;

// Set initial start and end years
let startYear = 1750; // Initial start year
let endYear = 1874;   // Initial end year

// Set initial values for the input fields
startYearInput.value = startYear;
endYearInput.value = endYear;

function updateSlider() {
    const totalYears = maxYear - minYear;
    const startPercent = ((startYear - minYear) / totalYears) * 100;
    const endPercent = ((endYear - minYear) / totalYears) * 100;

    innerSlider.style.left = startPercent + '%';
    innerSlider.style.width = (endPercent - startPercent) + '%';

    addMarkers(composerData);
}

function updateYearsFromSlider(startPercent, endPercent) {
    const totalYears = maxYear - minYear;
    startYear = Math.round(minYear + (startPercent / 100) * totalYears);
    endYear = Math.round(minYear + (endPercent / 100) * totalYears);

    startYearInput.value = startYear;
    endYearInput.value = endYear;
}

let initialMouseX = 0;
let initialStartPercent = 0;
let initialEndPercent = 0;

function onMouseDown(e, handle) {
    e.stopPropagation();
    currentHandle = handle;
    initialMouseX = e.clientX;

    if (currentHandle === innerSlider) {
        const rect = outerSlider.getBoundingClientRect();
        const totalWidth = rect.width;
        const totalYears = maxYear - minYear;

        initialStartPercent = ((startYear - minYear) / totalYears) * 100;
        initialEndPercent = ((endYear - minYear) / totalYears) * 100;
    }

    console.log('Mouse Down:', { currentHandle });
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

function onMouseMove(e) {
    const rect = outerSlider.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const totalWidth = rect.width;
    const totalYears = maxYear - minYear;

    console.log('Mouse Move:', { offsetX, currentHandle });

    if (currentHandle === startHandle) {
        const startPercent = (offsetX / totalWidth) * 100;
        if (startPercent >= 0 && startPercent < ((endYear - minYear) / totalYears) * 100) {
            startYear = Math.round(minYear + (startPercent / 100) * totalYears);
            startYearInput.value = startYear;
            updateSlider();
        }
    } else if (currentHandle === endHandle) {
        const endPercent = (offsetX / totalWidth) * 100;
        if (endPercent <= 100 && endPercent > ((startYear - minYear) / totalYears) * 100) {
            endYear = Math.round(minYear + (endPercent / 100) * totalYears);
            endYearInput.value = endYear;
            updateSlider();
        }
    } else if (currentHandle === innerSlider) {
        const mouseDeltaX = e.clientX - initialMouseX;
        const deltaPercent = (mouseDeltaX / totalWidth) * 100;

        const newStartPercent = initialStartPercent + deltaPercent;
        const newEndPercent = initialEndPercent + deltaPercent;

        if (newStartPercent >= 0 && newEndPercent <= 100) {
            updateYearsFromSlider(newStartPercent, newEndPercent);
            updateSlider();
        }
    }
}

function onMouseUp() {
    console.log('Mouse Up:', { currentHandle });
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    currentHandle = null;
}

let currentHandle = null;

startHandle.addEventListener('mousedown', (e) => onMouseDown(e, startHandle));
endHandle.addEventListener('mousedown', (e) => onMouseDown(e, endHandle));
innerSlider.addEventListener('mousedown', (e) => onMouseDown(e, innerSlider));

startYearInput.addEventListener('input', (e) => {
    startYear = Math.max(minYear, Math.min(parseInt(e.target.value), endYear - 1));
    console.log('Start Year Input:', startYear);
    updateSlider();
});

endYearInput.addEventListener('input', (e) => {
    endYear = Math.min(maxYear, Math.max(parseInt(e.target.value), startYear + 1));
    console.log('End Year Input:', endYear);
    updateSlider();
});

updateSlider();


document.querySelectorAll('#filter-options input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function() {
        document.querySelectorAll('#filter-options label').forEach(label => {
            label.classList.remove('checked-label');
        });
        if (this.checked) {
            this.parentElement.classList.add('checked-label');
        }
    });
});