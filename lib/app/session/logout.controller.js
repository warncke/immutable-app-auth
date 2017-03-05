'use strict'

/* npm modules */
const _ = require('lodash')

/* application modules */
var immutableAppAuth = require('../../immutable-app-auth')

module.exports = {
    paths: {
        '/logout': {
            get: {
                method: function (args) {
                    // get copy of session cookie config
                    var sessionCookie = _.cloneDeep(immutableAppAuth.global().session.cookie)
                    // set expired expiration time
                    sessionCookie.expires = new Date(1)
                    // return 302 redirect and delete session cookie to logout
                    var error = new Error();
                    error.code = 302
                    error.cookies = {
                        sessionId: sessionCookie,
                    },
                    error.url = '/'
                    throw error
                },
                methodName: 'logout',
            },
        },
    },
}