'use strict'

const ImmutableCoreModel = require('immutable-core-model')

/**
 * @ImmutableCoreModel roleAccount
 *
 * columns: id, roleId, accountId
 *
 * link roles to accounts
 */
module.exports = new ImmutableCoreModel({
    actions: {
        delete: false,
    },
    columns: {
        accountId: {
            index: true,
            null: false,
            type: 'id',
        },
        data: false,
        originalId: false,
        parentId: false,
        roleId: {
            index: true,
            null: false,
            type: 'id',
        }
    },
    name: 'roleAccount',
    relations: {
        role: {},
    }
})