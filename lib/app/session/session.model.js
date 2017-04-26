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
        accountId: false,
        data: false,
        originalId: false,
        parentId: false,
        sessionSessionId: false,
    },
    name: 'session',
}