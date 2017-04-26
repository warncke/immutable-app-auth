'use strict'

/**
 * @ImmutableCoreModel deviceSession
 *
 * columns: createTime, sessionId, deviceId
 *
 * link device to session
 */
module.exports = {
    // disable default columns
    columns: {
        accountId: false,
        data: false,
        deviceId: {
            index: true,
            null: false,
            type: 'id',
        },
        id: false,
        originalId: false,
        parentId: false,
    },
    name: 'deviceSession',
}