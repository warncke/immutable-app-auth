'use strict'

const ImmutableCoreModel = require('immutable-core-model')

/**
 * @ImmutableCoreModel roleAccess
 *
 * columns: id, roleId, accessId
 *
 * link roles to resource access rules
 *
 */
module.exports = new ImmutableCoreModel({
    actions: {
        delete: false,
    },
    columns: {
        accessId: {
            index: true,
            null: false,
            type: 'id',
        },
        accountId: false,
        data: false,
        originalId: false,
        parentId: false,
        roleId: {
            index: true,
            null: false,
            type: 'id',
        },
    },
    name: 'roleAccess',
})