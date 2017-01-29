'use strict'

const ImmutableCoreModel = require('immutable-core-model')

/**
 * @ImmutableCoreModel deviceSession
 *
 * columns: createTime, sessionId, deviceId
 *
 * link device to session
 */
module.exports = new ImmutableCoreModel({
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
})