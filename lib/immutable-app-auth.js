'use strct'

/* native modules */
const util = require('util')

/* npm modules */
const _ = require('lodash')
const immutableApp = require('immutable-app')
const mergeArgs = require('merge-args')()
const requireValidOptionalObject = require('immutable-require-valid-optional-object')

/* application modules */
const device = require('./device')
const facebook = require('./auth/facebook')
const google = require('./auth/google')
const session = require('./session')

/* exports */
module.exports = {
    config: config,
}

/* constants */
const defaultConfig = {
    device: {
        cookie: {
            domain: '',
            expires: new Date(2147483647000),
            name: 'deviceId',
        },
    },
    facebook: {
        callbackHost: '',
        callbackPath: '/auth/facebook/callback',
        clientId: '',
        clientSecret: '',
        loginPath: '/auth/facebook/login',
        profileFields: ['id', 'emails', 'name', 'gender', 'picture.type(large)'],
        scope: ['email'],
    },
    google: {
        callbackHost: '',
        callbackPath: '/auth/google/callback',
        clientId: '',
        clientSecret: '',
        loginPath: '/auth/google/login',
        scope: ['email'],
    },
    session: {
        cookie: {
            domain: '',
            expires: 0,
            name: 'sessionId',
        },
    },
}

// create immutable-app module
const app = immutableApp('immutable-app-auth')

/**
 * @function config
 *
 * initializes auth from configuration
 *
 * @param {object} args
 *
 * @throws {Error}
 */
function config (args) {
    // create new config based on default
    var config = _.cloneDeep(defaultConfig)
    // merge args over default config
    _.merge(config, args)
    // initialize session
    session.init(app, config.session)
    // initialize device tracking
    device.init(app, config.device)
    // initialize google if client id is set
    if (config.google.clientId.length) {
        google.init(app, config.google)
    }
    // initialize facebook if client id is set
    if (config.facebook.clientId.length) {
        facebook.init(app, config.facebook)
    }
}

