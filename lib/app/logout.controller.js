'use strict'

/* npm modules */
const httpRedirect = require('immutable-app-http-redirect')

/* application modules */
const ImmutableAppAuth = require('../immutable-app-auth')

/* controller specification */
module.exports = {
    paths: {
        '/logout': {
            get: {
                method: getLogout,
                role: 'authenticated',
            },
        },
    },
}

/* controller functions */

/**
 * @function getLogout
 *
 * clear session cookie
 */
function getLogout (args) {
    // get session cookie name from config
    var sessionCookie = ImmutableAppAuth.global().session.cookie
    console.log(sessionCookie)
    // create cookies object to return
    var cookies = {}
    // set session cookie to false to clear
    cookies[sessionCookie.name] = {
        domain: sessionCookie.domain,
        value: 0,
        expires: new Date(0),
    }
    // return http redirect with cleared cookie
    return httpRedirect('/', 302, cookies)
}