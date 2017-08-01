'use strict'

/**
 * @ImmutableCoreModel sessionAccount
 *
 * columns: createTime, sessionId, accountId
 *
 * link session to account
 */
module.exports = {
    // disable default columns
    columns: {
        n: false,
        c: false,
        d: false,
        data: false,
        id: false,
        originalId: false,
        parentId: false,
    },
    name: 'sessionAccount',
}