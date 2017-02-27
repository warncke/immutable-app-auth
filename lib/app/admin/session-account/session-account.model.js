'use strict'

const ImmutableCoreModel = require('immutable-core-model')

/**
 * @ImmutableCoreModel sessionAccount
 *
 * columns: createTime, sessionId, accountId
 *
 * link session to account
 */
module.exports = new ImmutableCoreModel({
    // disable default columns
    columns: {
        data: false,
        id: false,
        originalId: false,
        parentId: false,
    },
    name: 'sessionAccount',
})