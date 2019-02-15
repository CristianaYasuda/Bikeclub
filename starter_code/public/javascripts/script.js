let map;
const markers = [];

window.onload = () => {
  const ironhackBCN = {
    lng: -46.634818,
    lat: -23.55274
  };

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: ironhackBCN
  });

  const center = {
    lat: undefined,
    lng: undefined
  };

  getEvent();
};

const url = window.location.href;
const index = url.lastIndexOf('/');
const id = url.slice(index + 1);

function placeEvents(event) {
  console.log(event);
  // event.forEach((event) => {
  const center = {
    lat: event.location.coordinates[1],
    lng: event.location.coordinates[0]
  };
  const pin = new google.maps.Marker({
    position: center,
    map,
    title: event.name
  });
  markers.push(pin);
  // });
}

function getEvent() {
  axios
    .get(`/api/${id}`)
    .then((response) => {
      placeEvents(response.data.event);
    })
    .catch((error) => {
      console.log(error);
    });
}

const geocoder = new google.maps.Geocoder();
// document.getElementById('getLatLng').addEventListener('click', () => {
//   geocodeAddress(geocoder);
// });

document.getElementById('formCreate').addEventListener('submit', (e) => {
  if( document.getElementById(
    "latitude"
  ).value === '' && document.getElementById(
    "longitude"
  ).value ===''){
    e.preventDefault()
    geocodeAddress(geocoder)
  }
});

function geocodeAddress(geocoder, resultsMap) {
  const address = document.getElementById('address').value;
  geocoder.geocode({ address }, (results, status) => {
    if (status === "OK") {
      /*
   resultsMap.setCenter(results[0].geometry.location);
   let marker = new google.maps.Marker({
    map: resultsMap,
    position: results[0].geometry.location
   });
   */
      document.getElementById(
        "latitude"
      ).value = results[0].geometry.location.lat();
      document.getElementById(
        "longitude"
      ).value = results[0].geometry.location.lng();
      document.getElementById('formCreate').submit();
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}
