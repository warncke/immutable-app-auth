'use strict'

/* npm modules */
const ImmutableCoreModel = require('immutable-core-model')
const Promise = require('bluebird')
const _ = require('lodash')
const changeCase = require('change-case')
const countryData = require('country-data')
const defined = require('if-defined')
const geoip2 = require('geoip2')
const moment = require('moment')
const randomUniqueId = require('random-unique-id')
const requireValidOptionalObject = require('immutable-require-valid-optional-object')

/* exports */
module.exports = {
    auth: auth,
    sessionMiddleware: sessionMiddleware,
    init: init,
}

/**
 * @function auth
 *
 * attempt to authenticate session
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @param {object} data
 *
 * @returns {Promise}
 */
function auth (req, res, next, data) {
    // get models
    var accountModel = ImmutableCoreModel.model('account')
    var authModel = ImmutableCoreModel.model('auth')
    var sessionAccountModel = ImmutableCoreModel.model('sessionAccount')
    // flag set to true if auth needs to be created
    var createAuth = false
    // look for existing auth record that matches either the id or email
    return authModel.query({
        allow: true,
        current: true,
        limit: 1,
        order: ['createTime', 'DESC'],
        session: req.session,
        where: { authProviderId: data.authProviderId }
    })
    // create auth record
    .then(auth => {
        // if auth record was found then use accountId from auth record
        if (auth) {
            return auth.accountId
        }
        // auth needs to be created
        createAuth = true
        // get unique id for account
        var accountId = randomUniqueId().id
        // create new account
        return accountModel.createMeta({
            allow: true,
            id: accountId,
            responseIdOnly: true,
            session: req.session,
        })
    })
    .then(accountId => {
        // create auth record if needed
        if (createAuth) {
            var authPromise = authModel.createMeta({
                allow: true,
                accountId: accountId,
                data: data,
                session: req.session,
            })
        }
        // create session-account
        var sessionAccountPromise = sessionAccountModel.createMeta({
            allow: true,
            accountId: accountId,
            session: req.session,
        })
        // wait for models to be created
        return Promise.all([
            authPromise,
            sessionAccountPromise,
        ])
    })
    // redirect
    .then(() => res.redirect('/'))
    // catch errors
    .catch(next)
}

/**
 * @function init
 *
 * initialize session
 *
 * @param {object} config
 *
 * @throws {Error}
 */
function init (app, config) {
    // require config to be object
    config = requireValidOptionalObject(config)
    // intialize geoip with file or use default
    geoip2.init(config.geoip)
    // add device tracking middleware
    app.use(function (req, res, next) {
        return sessionMiddleware(config, req, res, next)
    })
}

/**
 * @function sessionMiddleware
 *
 * load existing session if session cookie set, otherwise create new session
 *
 * @param {object} config
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
function sessionMiddleware (config, req, res, next) {
    // add session to req
    req.session = {
        requestCreateTime: req.requestCreateTime,
        requestId: req.requestId,
        roles: ['all'],
    }
    // get session id
    var sessionId
    // use sessionId from query params if set
    if (defined(req.query.sessionId)) {
        sessionId = req.query.sessionId
    }
    // otherwise try to get from cookie
    else if (defined(req.cookies[config.cookie.name])) {
        sessionId = req.cookies[config.cookie.name]
    }
    // either create or load session
    var sessionPromise = sessionId
        ? loadSession(config, req, res, sessionId)
        : createSession(config, req, res)
    // get ip address
    req.ipAddress = req.headers['x-real-ip']
        || req.headers['x-forwarded-for']
        || req.connection.remoteAddress
    // lookup ip
    geoip2.lookupSimple(req.ipAddress, (error, geoip) => {
        // add geoip info to request
        if (geoip) {
            req.geoip = geoip
        }
        // create profile and location records
        sessionPromise.then(() => {
            return Promise.all([
                createProfile(config, req, res),
                createSessionLocation(config, req, res),
            ])
        })
        .then(() => {
            // console.log(req.session)
        })
        .then(() => next()).catch(next)
    })
}

/* private functions */

/**
 * @function createProfile
 *
 * create profile record if not already created
 *
 * @param {object} config
 * @param {object} req
 * @param {object} res
 */
function createProfile (config, req, res) {
    // if profile exists do not create
    if (defined(req.session.profile)) {
        return
    }
    // profile data
    var data = {}
    // if geoip data exists use it for location info
    if (defined(req.geoip)) {
        // get country data
        var res = countryData.lookup.countries({
            alpha2: req.geoip.country
        })
        // if country found use data
        if (defined(res) && res.length) {
            res = res[0]
            // get currency
            var currency = res.currencies[0]
            // use currency if supported by app
            if (defined(config.currencies[currency])) {
                data.currency = currency
            }
            // get language
            var language = res.languages[0]
            // use language if supported by app
            if (defined(config.languages[language])) {
                data.language = language
            }
            // set city
            data.city = req.geoip.city
            // set country
            data.country = res.alpha3
        }
        // set timezone
        if (defined(req.geoip.location)) {
            data.timezone = req.geoip.location.time_zone
        }
    }
    // set defaults
    if (!defined(data.currency)) {
        data.currency = config.defaultCurrency
    }
    if (!defined(data.language)) {
        data.language = config.defaultLanguage
    }
    if (!defined(data.timezone)) {
        data.timezone = config.defaultTimezone
    }
    // get profile model
    var profileModel = ImmutableCoreModel.model('profile')
    // create profile
    return profileModel.createMeta({
        allow: true,
        data: data,
        session: req.session,
    })
    // set profile on session
    .then(profile => {
        req.session.profile = profile
    })
}

/**
 * @function createSession
 *
 * create a new session
 *
 * @param {object} config
 * @param {object} req
 * @param {object} res
 */
function createSession (config, req, res) {
    var session = req.session
    // get models
    var sessionModel = ImmutableCoreModel.model('session')
    // get random unique id for session
    var unique = randomUniqueId()
    // add session id to session
    session.sessionId = unique.id
    // if session is being created then not authenticated so gets anonymous
    // pseudo role
    session.roles.push('anonymous')
    // create session entry
    return sessionModel.createMeta({
        allow: true,
        id: unique.id,
        session: session,
    })
    // set cookie
    .then(() => {
        setSessionCoookie(config, res, session.sessionId)
    })
}

/**
 * @function createSessionLocation
 *
 * create session-location record if location updated
 *
 * @param {object} config
 * @param {object} req
 * @param {object} res
 */
function createSessionLocation (config, req, res) {
    // cannot set location without geoip
    if (!defined(req.geoip) || !defined(req.geoip.location)) {
        return
    }
    // get lat and lng
    var lat = parseFloat(req.geoip.location.latitude)
    var lng = parseFloat(req.geoip.location.longitude)
    // if lat or lng not valid then do not set
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return
    }
    // get current location
    var location = req.session.location
    // evaluate whether or not to update location
    if (defined(location)) {
        // if current location is same as geoip location do not update
        if (location.data.lat.toFixed(5) === lat.toFixed(5) && location.data.lng.toFixed(5) === lng.toFixed(5)) {
            return
        }
        // if location set by client and less than hour hold do not replace
        // with less accurate geoip based location
        if (!location.geoip && moment.utc(location.sessionLocationCreateTime).isAfter(moment.utc().subtract(1, 'hour'))) {
            return
        }
    }
    // get session-location model
    var sessionLocationModel = ImmutableCoreModel.model('sessionLocation')
    // create session-location
    return sessionLocationModel.createMeta({
        allow: true,
        data: {
            geoip: true,
            lat: lat,
            lng: lng,
        },
        session: req.session,
    })
}

/**
 * @function loadAccount
 *
 * load account and auth info
 *
 * @param {object} config
 * @param {object} req
 * @param {object} res
 */
function loadAccount (config, req, res) {
    var session = req.session
    // get models
    var accountModel = ImmutableCoreModel.model('account')
    var authModel = ImmutableCoreModel.model('auth')
    var profileModel = ImmutableCoreModel.model('profile')
    var roleModel = ImmutableCoreModel.model('role')
    // if access model is specified then load with account
    if (defined(config.access) && defined(config.access.model)) {
        var accountWithArgs = {}
        accountWithArgs[config.access.model] = {
            raw: true,
        }
        // load account
        var accountPromise = accountModel.query({
            allow: true,
            limit: 1,
            raw: true,
            session: req.session,
            where: {id: req.session.accountId},
            with: accountWithArgs,
        })
        .then(account => {
            // array of access records
            var access = []
            // get access records
            _.each(account._related[config.access.model], record => {
                var accessId = record[config.access.accessId]
                var accessName = record[config.access.accessName]
                var selected = false
                // require data to add
                if (!defined(accessId) || !defined(accessName)) {
                    return
                }
                // if accessId cookie is set then set accessId for sessing
                if (accessId === req.cookies.accessId) {
                    session.accessId = accessId
                    selected = true
                }
                // add access option
                access.push({
                    accessId: accessId,
                    accessName: accessName,
                    selected: selected,
                })
            })
            // if there is only one accessId available then use it
            if (access.length === 1) {
                session.accessId = access[0].accessId
                access[0].selected = true
            }
            // add access options to session
            req.session.access = access
            // set access name if there are access options
            if (access.length > 0) {
                req.session.accessIdName = config.access.accessId
            }
        })
    }
    // if profile does not exist for session load profile for account
    if (!defined(req.session.profile)) {
        var profilePromise = profileModel.query({
            allow: true,
            limit: 1,
            session: req.session,
            where: {accountId: req.session.accountId},
        })
        .then(profile => {
            req.session.profile = profile
        })
    }
    // if profile exists but does not have account id then update
    else if (!defined(req.session.profile.accountId)) {
        var profilePromise = req.session.profile.updateMeta({
            accountId: req.session.accountId,
            allow: true,
            session: session,
        })
    }
    // load auth records
    var authPromise = authModel.query({
        all: true,
        allow: true,
        current: true,
        session: req.session,
        view: 'byAuthProvider',
        where: {accountId: req.session.accountId},
    })
    .then(auth => {
        // add auth to session
        session.auth = auth
    })
    // load roles
    var rolePromise = roleModel.query({
        all: true,
        allow: true,
        current: true,
        join: ['roleAccount'],
        raw: true,
        session: req.session,
        where: {'roleAccount.accountId': req.session.accountId}
    })
    .then(roles => {
        // add roles to session
        _.each(roles, role => session.roles.push(role.roleName))
    })
    // wait for promises to resolve
    return Promise.all([
        accountPromise,
        authPromise,
        profilePromise,
        rolePromise,
    ])
}

/**
 * @function loadSession
 *
 * load existing session by session id
 *
 * @param {object} config
 * @param {object} req
 * @param {object} res
 * @param {string} sessionId
 */
function loadSession (config, req, res, sessionId) {
    // get models
    var profileModel = ImmutableCoreModel.model('profile')
    var sessionAccountModel = ImmutableCoreModel.model('sessionAccount')
    var sessionLocationModel = ImmutableCoreModel.model('sessionLocation')
    var sessionModel = ImmutableCoreModel.model('session')
    // load profile
    var profilePromise = profileModel.query({
        allow: true,
        limit: 1,
        session: req.session,
        where: { sessionId: sessionId },
    })
    // query session-account
    var sessionAccountPromise = sessionAccountModel.query({
        allow: true,
        limit: 1,
        session: req.session,
        where: { sessionId: sessionId },
    })
    // query most recent session-location
    var sessionLocationPromise = sessionLocationModel.query({
        allow: true,
        limit: 1,
        order: ['sessionLocationCreateTime', 'desc'],
        session: req.session,
        where: { sessionId: sessionId },
    })
    // query session
    var sessionPromise = sessionModel.query({
        allow: true,
        limit: 1,
        session: req.session,
        where: { id: sessionId },
    })
    return Promise.all([
        profilePromise,
        sessionAccountPromise,
        sessionLocationPromise,
        sessionPromise,
    ])
    // check if session exists
    .then(all => {
        var profile = all[0]
        var sessionAccount = all[1]
        var sessionLocation = all[2]
        var session = all[3]
        // add validated sessionId to session
        if (defined(session)) {
            // add location to session
            req.session.location = sessionLocation
            // add profile to session
            req.session.profile = profile
            // set validated session id
            req.session.sessionId = sessionId
            // record instances get copies of the session and since these
            // are created before initialization completes they need to be
            // replaced with the global session
            if (defined(req.session.location)) {
                req.session.location.session = req.session
            }
            if (defined(req.session.profile)) {
                req.session.profile.session = req.session
            }
            // if sessionId came from query param and not cookie then set
            // cookie with correct sessionId
            if (defined(req.query.sessionId) && req.query.sessionId !== req.cookies[config.cookie.name]) {
                setSessionCoookie(config, res, session.id)
            }
        }
        // if session not found create new
        else {
            return createSession(config, req, res)
        }
        // if account exists load account
        if (sessionAccount) {
            // add accountId to session
            req.session.accountId = sessionAccount.accountId
            // client is authenticated
            req.session.roles.push('authenticated')
            // load account and auth data
            return loadAccount(config, req, res)
        }
        // session not linked to account
        else {
            // client is not authenticated
            req.session.roles.push('anonymous')
        }
    })
}

/**
 * @function setSessionCoookie
 *
 * set new session cookie with options from config
 *
 * @param {object} config
 * @param {object} res
 * @param {string} sessionId
 */
function setSessionCoookie (config, res, sessionId) {
    // set cookie
    res.cookie(config.cookie.name, sessionId, config.cookie)
}