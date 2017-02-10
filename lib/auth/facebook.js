'use strict'

/* npm modules */
const FacebookStrategy = require('passport-facebook').Strategy
const _ = require('lodash')
const express = require('express')
const passport = require('passport')

/* application modules */
const session = require('../session')

/* exports */
module.exports = {
    init: init,
}

/**
 * @function init
 *
 * add facebook passport auth config to app
 *
 * @param {object} app
 * @param {object} config
 *
 * @throws {Error}
 */
function init (app, config) {
    // config for facebook strategy
    var strategy = {
        clientID: config.clientId,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackHost+config.callbackPath,
        enableProof: true,
    }
    // add specific profile fields if set
    if (config.profileFields.length) {
        strategy.profileFields = config.profileFields
    }
    // add facebook strategy to passport
    passport.use(
        new FacebookStrategy(strategy, function (accessToken, refreshToken, profile, callback) {
            return facebookCallback(config, accessToken, refreshToken, profile, callback)
        })
    )
    // create router
    var router = express.Router()
    // add express route to redirect to google login
    router.get(config.loginPath, passport.authenticate('facebook', {
        scope: config.scope,
    }))
    // add express route to handle callback
    router.get(config.callbackPath, function (req, res, next) {
        // if session is already logged in redirect to home page
        if (req.session.accountId) {
            return res.redirect('/')
        }
        // do custom handling because we are not using express session
        passport.authenticate('facebook', function (err, user, info) {
            // handle errors
            if (err) {
                return next(err)
            }
            // attempt to login with facebook
            session.auth(req, res, next, user)
        })(req, res, next)
    })
    // add router to list of middleware to load
    app.use(router)
}

/* private functions */

function facebookCallback (config, accessToken, refreshToken, profile, callback) {
    callback(null, {
        accessToken: accessToken,
        facebookId: profile.id,
        authProviderId: _.get(profile, 'emails[0].value'),
        authProviderName: 'facebook',
        email: _.get(profile, 'emails[0].value'),
        firstName: _.get(profile, 'name.givenName'),
        gender: profile.gender,
        lastName: _.get(profile, 'name.familyName'),
        photo: _.get(profile, 'photos[0].value'),
        refreshToken, refreshToken,
        scope: config.scope,
    })
}