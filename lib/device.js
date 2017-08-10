'use strict'

/* npm modules */
const ImmutableCoreModel = require('immutable-core-model')
const requireValidOptionalObject = require('immutable-require-valid-optional-object')

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
    app.use(function (req, res, next) {
        return deviceMiddleware(config, req, res, next)
    })
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
 * @param {object} config
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
function deviceMiddleware (config, req, res, next) {
    // get models
    var deviceModel = ImmutableCoreModel.model('device')
    var deviceSessionModel = ImmutableCoreModel.model('deviceSession')
    // if deviceId cookie is already set then do nothing
    if (req.cookies[config.cookie.name]) {
        // continue
        return next()
    }
    // get device data from request
    var device = deviceFromRequest(req)
    // get device id without waiting for insert to complete
    deviceModel.createMeta({
        allow: true,
        data: device,
        responseIdOnly: true,
        session: req.session,
        wait: false,
    })
    .then(deviceId => {
        // create device session entry
        deviceSessionModel.createMeta({
            allow: true,
            deviceId: deviceId,
            response: false,
            session: req.session,
            wait: false,
        })
        // set cookie with device id
        setDeviceCoookie(config, res, deviceId)
        // continue
        next()
    })
}

/* private functions */

/**
 * @function setDeviceCoookie
 *
 * set new device cookie with options from config
 *
 * @param {object} config
 * @param {object} res
 * @param {string} deviceId
 */
function setDeviceCoookie (config, res, deviceId) {
    // set cookie
    res.cookie(config.cookie.name, deviceId, config.cookie)
}