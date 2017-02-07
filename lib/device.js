'use strict'

/* npm modules */
const requireValidOptionalObject = require('immutable-require-valid-optional-object')

/* app modules */
var deviceModel = require('./app/device/device.model.js')

/* exports */
module.exports = {
    deviceFromRequest: deviceFromRequest,
    deviceMiddleware: deviceMiddleware,
    init: init,
}

/**
 * @function init
 *
 * initialize deviceId
 *
 * @param {object} config
 *
 * @throws {Error}
 */
function init (app, config) {
    // require config to be object
    config = requireValidOptionalObject(config)
    // add device tracking middleware
    app.use(deviceMiddleware)
}

/**
 * @function deviceFromRequest
 *
 * get device data from express request
 *
 * @param {object} req
 *
 * @retunrs {object}
 */
function deviceFromRequest (req) {
    // build device data object
    var device = {
        ipAddress: req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
    }
    // return device data
    return device
}

/**
 * @function deviceMiddleware
 *
 * express middleware to track device
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
function deviceMiddleware (req, res, next) {
    // get device data from request
    var device = deviceFromRequest(req)
    console.log(device)
    
    next()
}