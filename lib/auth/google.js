'use strict'

/* npm modules */
const _ = require('lodash')
const express = require('express')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

/* application modules */
const session = require('../session')

/* exports */
module.exports = {
    init: init,
}

/**
 * @function init
 *
 * add google passport auth config to app
 *
 * @param {object} config
 *
 * @throws {Error}
 */
function init (app, config) {
    // add google strategy to passport
    passport.use(
        new GoogleStrategy({
            clientID: config.clientId,
            clientSecret: config.clientSecret,
            callbackURL: config.callbackHost + config.callbackPath,
            accessType: 'offline'
        }, function (accessToken, refreshToken, profile, callback) {
            return googleCallback(config, accessToken, refreshToken, profile, callback)
        })
    )
    // create router
    var router = express.Router()
    // add express route to redirect to google login
    router.get(config.loginPath, passport.authenticate('google', {
        scope: config.scope,
    }))
    // add express route to handle callback
    router.get(config.callbackPath, function (req, res, next) {
        // do custom handling because we are not using express session
        passport.authenticate('google', function (err, user, info) {
            // handle errors
            if (err) {
                next(err)
            }

            console.log(user)
            
            // redirect to home page
            res.redirect('/')
        })(req, res, next)
    })
    // add router to list of middleware to load
    app.use(router)
}


function googleCallback (config, accessToken, refreshToken, profile, callback) {
    callback(null, {
        accessToken: accessToken,
        authProvider: 'google',
        authProviderId: profile.id,
        authProviderEmail: _.get(profile, 'emails[0].value'),
        profile: {
            firstName: _.get(profile, 'name.givenName'),
            lastName: _.get(profile, 'name.familyName'),
            photo: _.get(profile, 'photos[0].value'),
        },
        refreshToken, refreshToken,
        scope: config.scope,
    })
}