'use strict'

/**
 * @ImmutableCoreModel roleAccount
 */
module.exports = {
    columns: {
        accountId: {
            index: true,
            null: false,
            type: 'id',
        },
        data: false,
        roleOriginalId: {
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