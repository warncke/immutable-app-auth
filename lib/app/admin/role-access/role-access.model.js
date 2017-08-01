'use strict'

/**
 * @ImmutableCoreModel roleAccess
 *
 * columns: id, roleId, accessId
 *
 * link roles to resource access rules
 *
 */
module.exports = {
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
}