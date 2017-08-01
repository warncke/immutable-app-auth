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
        n: false,
        c: false,
        d: false,
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