'use strict'

/**
 * @ImmutableCoreModel roleAccount
 *
 * columns: id, roleId, accountId
 *
 * link roles to accounts
 */
module.exports = {
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
}