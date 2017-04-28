'use strict'

/* npm modules */
const _ = require('lodash')
const defined = require('if-defined')
const httpRedirect = require('immutable-app-http-redirect')

/* application modules */
const ImmutableAppAuth = require('../immutable-app-auth')

/* controller specification */
module.exports = {
    paths: {
        '/set-access': {
            get: {
                input: {
                    accessId: 'query.accessId',
                    referrer: 'headers.referer',
                },
                method: setAccess,
                role: 'authenticated',
            },
        },
    },
}

/* controller functions */

/**
 * @function setAccess
 *
 * set accessId cookie and redirect to referrer
 */
function setAccess (args) {
    // get auth config
    var config = ImmutableAppAuth.global().session.access
    // set cookie if access model is configured
    if (defined(config) && defined(config.model) && defined(config.cookie)) {
        // get clone of cookie configuration
        var accessCookie = _.cloneDeep(config.cookie)
        // create cookies object to set
        var cookies = {}
        // add access cookie
        cookies[accessCookie.name] = accessCookie
        // set value to accessId from args - this will be validated when read
        accessCookie.value = args.accessId
    }
    // redirect to referrer setting cookie
    httpRedirect(args.referrer, 302, cookies)
}