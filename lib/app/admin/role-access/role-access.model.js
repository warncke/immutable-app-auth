'use strict'

/**
 * @ImmutableCoreModel roleAccess
 */
module.exports = {
    columns: {
        accessOriginalId: {
            index: true,
            null: false,
            type: 'id',
        },
        accountId: false,
        data: false,
        roleOriginalId: {
            index: true,
            null: false,
            type: 'id',
        },
    },
    name: 'roleAccess',
}