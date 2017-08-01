'use strict'

/**
 * @ImmutableCoreModel session
 *
 * columns: id, createTime
 *
 * unique id for session
 */
module.exports = {
    // disable default columns
    columns: {
        n: false,
        c: false,
        d: false,
        accountId: false,
        data: false,
        originalId: false,
        parentId: false,
        sessionSessionId: false,
    },
    name: 'session',
}