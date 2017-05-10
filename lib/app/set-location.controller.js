'use strict'

/* npm modules */
const countryData = require('country-data')
const defined = require('if-defined')
const whichCountry = require('which-country')

/* controller specification */
module.exports = {
    paths: {
        '/set-location': {
            post: {
                input: {
                    location: 'body.location',
                },
                method: postSetLocation,
                role: 'all',
                template: '',
            },
        },
    },
}

/* controller functions */

/**
 * @function postSetLocation
 *
 * return register form
 */
function postSetLocation (args) {
    // promise for creating/updating location
    var locationPromise
    // if there is no location then create
    if (!defined(args.session.location)) {
        locationPromise = this.model.sessionLocation.create(args.location)
    }
    // if location is already set then check if it needs to be updated
    else if (updateSessionLocation(args.session.location.data, args.location)) {
        locationPromise = this.model.sessionLocation.create(args.location)
    }
    // wait for any create/update to complete
    return Promise.resolve(locationPromise)
    // resolve with success response
    .then(() => {
        return {
            success: true,
        }
    })
}

/* private functions */

/**
 * @function updateSessionLocation
 *
 * return true if session-location should be updated
 *
 * @param {object} oldLocation
 * @param {object} newLocation
 *
 * @returns {boolean}
 */
function updateSessionLocation (oldLocation, newLocation) {
    // if the old location was set from geoip update from client
    if (oldLocation.geoip) {
        return true
    }
    // get accuracy - lower is better
    var oldAcc = parseInt(oldLocation.ac) || 99999
    var newAcc = parseInt(newLocation.ac) || 99999
    // if accuracy has impoved then updated
    if (newAcc < oldAcc) {
        return true
    }
    // update if location has moved 5 meters or more
    if (distance(oldLocation.lat, oldLocation.lng, newLocation.lat, newLocation.lng) >= 5 && newAcc <= oldAcc) {
        return true
    }
    // do not update
    return false
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