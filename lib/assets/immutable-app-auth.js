(function () {
// if browser does not support geolocation skip
if (!navigator.geolocation) {
    return
}
// keep track of last location so that duplicate data is not sent
var lastLocation
// watch for location with high accuracy
navigator.geolocation.watchPosition(locationSuccess, locationError, {
    enableHighAccuracy: true,
})
// also watch without high accuracy since that may fail or be slow
navigator.geolocation.watchPosition(locationSuccess, locationError)

function locationError (error) {
    console.log(error)
}

function locationSuccess (location) {
    console.log(location.coords)
    // if there is last location check to see if it has changed
    if (lastLocation) {
        // if new location is higher accuracy then use it - accuracy is
        // in meters so lower is better
        if (location.coords.accuracy < lastLocation.coords.accuracy) {
            // coninue and update location
        }
        // only update every 3 seconds
        else if (location.timestamp - lastLocation.timestamp < 3000) {
            return
        }
        // only update if distance moved is over 5 meters
        else if (distance(location.coords.latitude, location.coords.longitude, lastLocation.coords.latitude, lastLocation.coords.longitude) < 5) {
            return
        }
    }
    // build data to send to server
    var data = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
    }
    // set altitudeAccuracy if not null
    if (location.coords.altitudeAccuracy !== null) {
        data.aa = location.coords.altitudeAccuracy
    }
    // set accuracy if not null
    if (location.coords.accuracy !== null) {
        data.ac = location.coords.accuracy
    }
    // set altitude if not null
    if (location.coords.altitude !== null) {
        data.al = location.coords.altitude
    }
    // set heading if not null
    if (location.coords.heading !== null) {
        data.h = location.coords.heading
    }
    // set speed if not null
    if (location.coords.speed !== null) {
        data.s = location.coords.speed
    }
    // set location on server
    $.post('/set-location', {location: data})
    // set last location
    lastLocation = location
}

// http://www.movable-type.co.uk/scripts/latlong.html
function distance (lat1, lon1, lat2, lon2) {
    var R = 6371e3;
    var φ1 = deg2rad(lat1);
    var φ2 = deg2rad(lat2);
    var Δφ = deg2rad(lat2-lat1);
    var Δλ = deg2rad(lon2-lon1);

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;

    return d
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

})()