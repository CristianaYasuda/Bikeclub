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
