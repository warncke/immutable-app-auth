'use strict'

/* npm modules */
const randomUniqueId = require('random-unique-id')
const requireValidOptionalObject = require('immutable-require-valid-optional-object')

/* app modules */
var sessionAccountModel = require('./app/session-account/session-account.model.js')
var sessionModel = require('./app/session/session.model.js')

/* exports */
module.exports = {
    sessionMiddleware: sessionMiddleware,
    init: init,
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
    }
    // get session id from cookie if it exists
    var sessionId = req.cookies[config.cookie.name]
    // either create or load session
    var promise = sessionId
        ? loadSession(config, req, res, sessionId)
        : createSession(config, req, res)
    // wait for promise to resolve
    promise.then(() => next()).catch(next)
}

/* private functions */

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
    // get random unique id for session
    var unique = randomUniqueId()
    // add session id to session
    session.sessionId = unique.id
    // create session entry
    return sessionModel.createMeta({
        id: unique.id,
        session: session,
    })
    // set cookie
    .then(() => {
        setSessionCoookie(config, res, session.sessionId)
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
    // add validated sessionId to session
    req.session.sessionId = sessionId
    // attempt to load session
    var sessionPromise = sessionModel.query({
        limit: 1,
        session: req.session,
        where: { id: sessionId },
    })
    // attempt to load sessionAccount
    var sessionAccountPromise = sessionAccountModel.query({
        limit: 1,
        session: req.session,
        where: { sessionId: sessionId },
    })
    return Promise.all([
        sessionPromise,
        sessionAccountPromise,
    ])
    // check if session exists
    .then(all => {
        var session = all[0]
        var sessionAccount = all[1]
        // if session was not found then create new
        if (!session) {
            return createSession(config, req, res)
        }
        // if account exists load account
        if (sessionAccount) {
            // add accountId to session
            req.session.accountId = sessionAccount.accountId
            // load account and auth data
            return loadAccount(config, req, res)
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