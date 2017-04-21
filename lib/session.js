'use strict'

/* npm modules */
const Promise = require('bluebird')
const _ = require('lodash')
const changeCase = require('change-case')
const randomUniqueId = require('random-unique-id')
const requireValidOptionalObject = require('immutable-require-valid-optional-object')

/* app modules */
const accountModel = require('./app/admin/account/account.model')
const authModel = require('./app/admin/auth/auth.model')
const roleModel = require('./app/admin/role/role.model')
const sessionAccountModel = require('./app/admin/session-account/session-account.model')
const sessionModel = require('./app/session/session.model')

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
    // flag set to true if auth needs to be created
    var createAuth = false
    // look for existing auth record that matches either the id or email
    return authModel.query({
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
            id: accountId,
            responseIdOnly: true,
            session: req.session,
        })
    })
    .then(accountId => {
        // create auth record if needed
        if (createAuth) {
            var authPromise = authModel.createMeta({
                accountId: accountId,
                data: data,
                session: req.session,
            })
        }
        // create session-account
        var sessionAccountPromise = sessionAccountModel.createMeta({
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
    // if session is being created then not authenticated so gets anonymous
    // pseudo role
    session.roles.push('anonymous')
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
    var session = req.session
    // load auth records
    var authPromise = authModel.query({
        all: true,
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
        current: true,
        join: ['roleAccount'],
        raw: true,
        select: ['roleName'],
        session: req.session,
        where: {'roleAccount.accountId': req.session.accountId}
    })
    .then(roles => {
        // add roles to session
        _.each(roles, role => session.roles.push(role.roleName))
    })
    // wait for promises to resolve
    return Promise.all([
        authPromise,
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
    // add validated sessionId to session
    req.session.sessionId = sessionId
    // attempt to load session
    var sessionPromise = sessionModel.query({
        allow: true,
        limit: 1,
        session: req.session,
        where: { id: sessionId },
    })
    // attempt to load sessionAccount
    var sessionAccountPromise = sessionAccountModel.query({
        allow: true,
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