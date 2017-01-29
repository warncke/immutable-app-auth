'use strict'

const ImmutableCoreModel = require('immutable-core-model')

/**
 * @ImmutableCoreModel account
 *
 * columns: id, createTime
 *
 * account records accountId and createTime. account does not have any data
 * directly associated with it and is initially anonymous. only after creating
 * an associated auth record is it possible to log in to the account
 */
module.exports = new ImmutableCoreModel({
    // disable default columns
    columns: {
        accountAccountId: false,
        data: false,
        originalId: false,
        parentId: false,
        sessionId: false,
    },
    name: 'account',
})