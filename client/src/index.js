import {
  DEFAULT_LOCATION,
  WAIT_SEC,
  NEARBY_RADIUS,
  DEFAULT_ZOOM,
  SEARCH_ZOOM,
  HOST_FORMAT,
  MARKER_PATH,
  LIBRARIES,
  CALLBACK, 
  MARKER_BOUNCES,
  MARKER_BOUNCE_DURATION,
  SUBMIT_KEY
} from './config/settings.js';

import {
  GOOGLE_API_KEY
} from './config/keys.js';

import {
  renderDefaults, 
  debounce, 
  reverseLookup,
  CoordinatePair
} from './utils/helpers.js';

let //globals
  map, 
  places, 
  infoWindow,
  markers = [],
  autocomplete;

const 
  dropMarker = i => {markers[i].setMap(map)},

  clearMarkers = () => {
    markers.forEach((marker, i) => {
      if(marker) {
        markers[i].setMap(null)
        clearTimeout(markers[i].animationStartTimer)
        clearTimeout(markers[i].animationStopTimer)
      }
    });
    markers = [];
  }, 

  //append individual result to results table
  addResult = (result, i) => {
    const
      results = document.querySelector('#results'),
      markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26)),
      markerIcon = MARKER_PATH + markerLetter + '.png',
      tr = document.createElement('tr'),
      iconTd = document.createElement('td'),
      typeIconTd = document.createElement('td'),
      nameTd = document.createElement('td'),
      icon = document.createElement('img'),
      typeIcon = document.createElement('img'),
      name = document.createTextNode(result.name);;

    tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
    tr.addEventListener('click', () => google.maps.event.trigger(markers[i], 'click'));
    nameTd.setAttribute('class', 'resultName');
    icon.src = markerIcon;
    icon.setAttribute('class', 'placeIcon');
    typeIcon.src = result.icon;
    typeIcon.setAttribute('class', 'typeIcon');
    iconTd.appendChild(icon);
    typeIconTd.appendChild(typeIcon);
    nameTd.appendChild(name);
    tr.appendChild(iconTd);
    tr.appendChild(typeIconTd);
    tr.appendChild(nameTd);
    results.appendChild(tr);
  },

  clearResults = () => document.querySelector('#results').innerHTML = '',

  showInfoWindow = function() {
    const marker = this;
    places.getDetails({placeId: marker.placeResult.place_id},
      (place, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          return;
        }
        infoWindow.open(map, marker);
        buildIWContent(place);
      });
  },

  // Load the place information into the HTML elements used by the info window.
  buildIWContent = place => {
    document.querySelector('#iw-icon').innerHTML = 
      `<img class="iwIcon" src="${place.icon}"/>`;
    document.querySelector('#iw-url').innerHTML = 
      `<b><a href="${place.url}">${place.name}</a></b>`;
    document.querySelector('#iw-address').textContent = 
      place.vicinity;

    if (place.formatted_phone_number) {
      document.querySelector('#iw-phone-row').style.display = 
        '';
      document.querySelector('#iw-phone').textContent =
        place.formatted_phone_number;
    } else {
      document.querySelector('#iw-phone-row').style.display = 
        'none';
    }

    if (place.rating) {
      let ratingHtml = '';
      for (let i = 0; i < 5; i++) {
        if (place.rating < (i + 0.5)) {
          ratingHtml += '&#10025;'; //white star
        } else {
          ratingHtml += '&#10029;'; //black star
        }
        document.querySelector('#iw-rating-row').style.display = 
          '';
        document.querySelector('#iw-rating').innerHTML = 
          ratingHtml;
      }
    } else {
      document.querySelector('#iw-rating-row').style.display = 
        'none';
    }

    // The regexp isolates the first part of the URL (domain plus subdomain)
    // to give a short URL for displaying in the info window.
    if (place.website) {
      let 
        fullUrl = place.website,
        website = HOST_FORMAT.exec(fullUrl);
      if (website === null) {
        website = `http://${place.website}/`;
        fullUrl = website;
      }
      document.querySelector('#iw-website-row').style.display = 
        '';
      document.querySelector('#iw-website').innerHTML = `<a href="${website}">${website}</a>`;
    } else {
      document.querySelector('#iw-website-row').style.display = 'none';
    }
  },
  search = debounce(e => {
    const 
      typeList = Array.from((e ? 
          e.target
          : document.querySelector('#type')
        ).selectedOptions)
        .map(option => option.value),
      searchParams = {
        bounds: map.getBounds(),
        types: typeList
      };
    places.nearbySearch(searchParams, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        clearResults();
        clearMarkers();
        const
          tr = document.createElement('tr'),
          iconTd = document.createElement('td'),
          nameTd = document.createElement('td');

        tr.style.backgroundColor = ('#F0F0F0');
        let name = document.createTextNode('No results to display.');
        nameTd.appendChild(name);
        tr.appendChild(nameTd);
        document.querySelector('#results').appendChild(tr);
      }
      else if (status === google.maps.places.PlacesServiceStatus.OK) {
        clearResults();
        clearMarkers();
        results.forEach((result,i) => {
          const 
            markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26)),
            markerIcon = MARKER_PATH + markerLetter + '.png';
          markers[i] = new google.maps.Marker({
            position: result.geometry.location,
            animation: google.maps.Animation.BOUNCE,
            icon: markerIcon
          });
          markers[i].placeResult = result;
          google.maps.event.addListener(markers[i], 'click', showInfoWindow);
          markers[i].animationStartTimer = setTimeout(()=>{
            const n = i; 
            if(markers[n] !== undefined) {
              dropMarker(n);
              markers[n].animationStopTimer = setTimeout(()=>{
                if(markers[n] !== undefined) 
                  markers[n].setAnimation(null);
              }, MARKER_BOUNCE_DURATION * MARKER_BOUNCES);
            }
          }, i * 100);
          addResult(result, i);
        });
      }
    });
  }),

  //generate search when a submit event occurs
  onSubmit = () => {
    console.log(map.getCenter())
    const 
      place = autocomplete.getPlace(),
      input = document.querySelector('#autocomplete').value;
    if (input !== '' && place && place.geometry) {
      map.panTo(place.geometry.location);
      map.setZoom(SEARCH_ZOOM);
      search();
    } else {
      search();
      document.querySelector('#autocomplete').value = '';
    }
  },

  //initialize map after receiving starting coordinates
  initMap = startCoordinates => {
    startCoordinates = new CoordinatePair(startCoordinates.latitude, startCoordinates.longitude);
    map = new google.maps.Map(document.querySelector('#map'), {
      zoom: DEFAULT_ZOOM,
      center: startCoordinates
    });
    google.maps.event.addListener(map, 'tilesloaded', () => {
      search();
      google.maps.event.clearListeners(map, 'tilesloaded');
    });

    infoWindow = new google.maps.InfoWindow({
      content: document.querySelector('#info-content')
    });
    autocomplete = new google.maps.places.Autocomplete(
            document.querySelector('#autocomplete'));
    places = new google.maps.places.PlacesService(map);

    document.querySelector('#searchButton').addEventListener('click', onSubmit);
    document.addEventListener('keydown', e => {
      if(e.keyCode === SUBMIT_KEY) {
        document.querySelector('#type').blur();
        document.querySelector('#autocomplete').blur();
        onSubmit();
      }
    });
    document.querySelectorAll('.typeOption')
    .forEach(option => option.addEventListener('dblclick', () => {
      document.querySelector('#type').blur();
      document.querySelector('#autocomplete').blur();
      onSubmit();
    }));
    google.maps.event.addListener(map, "idle", function(){
        google.maps.event.trigger(map, 'resize'); 
    });
  },

  //google places script element
  googlePlaces = document.createElement('SCRIPT');

googlePlaces.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=${LIBRARIES}&callback=${CALLBACK}`;
googlePlaces.async = true;
googlePlaces.defer = true;

//initial callback function -- query user geolocation or supply a default location if user responds negatively or query times out
window.initialize = () => {
  renderDefaults();
  let locationResolved = false;
  const resolveGeo = (data = false) => {
    if(locationResolved) return;
    locationResolved = true;
    data === false ? 
      initMap(DEFAULT_LOCATION)
      : initMap(data.coords);
  }
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(resolveGeo, () => resolveGeo());
    setTimeout(() => resolveGeo, WAIT_SEC * 1000);
    return;
  }
  resolveGeo();
};

//appends google places to initialize program
document.addEventListener('DOMContentLoaded', () => document.body.appendChild(googlePlaces));