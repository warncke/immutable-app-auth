'use strict'

const ImmutableCoreModel = require('immutable-core-model')

/**
 * @ImmutableCoreModel device
 *
 * columns: id, data, createTime
 *
 * create unique device id based on device properties. device id is not cookie
 * based and tracks devices in a non personally specific way across sessions
 * and accounts.
 */
module.exports = new ImmutableCoreModel({
    // disable default columns
    columns: {
        accountId: false,
        originalId: false,
        parentId: false,
        sessionId: false,
    },
    // calculate id based on data only
    idDataOnly: true,
    name: 'device',
})