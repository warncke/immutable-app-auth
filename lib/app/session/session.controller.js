'use strict'

/* controller specification */
module.exports = {
    paths: {
        '/': {
            get: {
                json: true,
                method: getSession,
            },
        },
    },
}

/* controller functions */

/**
 * @function getSession
 *
 * show current session
 */
function getSession (args) {
    return args.session
}