'use strict'

const ImmutableCoreModel = require('immutable-core-model')

/**
 * @ImmutableCoreModel session
 *
 * columns: id, createTime
 *
 * unique id for session
 */
module.exports = new ImmutableCoreModel({
    // disable default columns
    columns: {
        accountId: false,
        data: false,
        originalId: false,
        parentId: false,
        sessionSessionId: false,
    },
    name: 'session',
})