var map;
var markers = [];
var infoWindow;

function initMap() {
  var losAngeles = { lat: 34.06338, lng: -118.35808 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: losAngeles,
    zoom: 11,
    mapTypeId: "roadmap",
  });
  infoWindow = new google.maps.InfoWindow();

  searchStores();
}

function searchStores() {
  let foundStores = [];
  let zipCode = document.getElementById("zip-code-input").value;
  if (zipCode) {
    for (let store of stores) {
      if (store.address.postalCode.includes(zipCode)) {
        foundStores.push(store);
      }
    }
  } else {
    foundStores = stores;
  }
  clearLocations();
  displayStores(foundStores);
  showStoresMarkers(foundStores);
  setOnClickListener();
}

function clearLocations() {
  infoWindow.close();
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

function setOnClickListener() {
  var storeElements = document.querySelectorAll(".store-container");
  storeElements.forEach(function (elem, index) {
    elem.addEventListener("click", function () {
      new google.maps.event.trigger(markers[index], "click");
    });
  });
}

function displayStores(foundStores) {
  let storesHtml = "";
  for (let [index, store] of foundStores.entries()) {
    storesHtml += `
    <div class="store-container">
      <div class="store-container-background">
        <div class="store-info-container">
            <div class="store-address">
                <strong><span>${store.name}</span></strong>
                <span>${store.addressLines[0]}</span>
                <span>${store.addressLines[1]}</span>
            </div>
            <div class="store-phone-number">${store.phoneNumber}</div>
        </div>
        <div class="store-number-container">
            <div class="store-number">${index + 1}</div>
        </div>
      </div>
    </div>
    `;
  }
  document.querySelector(".stores-list").innerHTML = storesHtml;
}

function showStoresMarkers(stores) {
  var bounds = new google.maps.LatLngBounds();
  for (var [index, store] of stores.entries()) {
    var latlng = new google.maps.LatLng(
      store.coordinates.latitude,
      store.coordinates.longitude
    );
    var name = store.name;
    var address = store.addressLines[0];
    var openStatusText = store.openStatusText;
    var phoneNumber = store.phoneNumber;
    bounds.extend(latlng);
    createMarker(latlng, name, address, openStatusText, phoneNumber, index + 1);
  }
  map.fitBounds(bounds);
}

function createMarker(
  latlng,
  name,
  address,
  openStatusText,
  phoneNumber,
  index
) {
  var html = `
      <div class="store-info-window">
          <div class="store-info-name">
              <strong>${name}</strong>
          </div>
          <div class="store-info-status">
              ${openStatusText}
          </div>
          <div class="store-info-address">
              <div class="circle">
                  <i class="fas fa-location-arrow"></i>
              </div>
              ${address}
          </div>
          <div class="store-info-phone">
              <div class="circle">
                  <i class="fas fa-phone-alt"></i>
              </div>
              ${phoneNumber}
          </div>
      </div>
  `;
  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label: index.toString(),
  });
  google.maps.event.addListener(marker, "click", function () {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}
