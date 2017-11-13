'use strict'

const ModelViewKeyBy = require('immutable-model-view-key-by')

/**
 * @ImmutableCoreModel auth
 */
module.exports = {
    // add queryable columns for auth provider id and name
    columns: {
        authProviderId: {
            index: true,
            null: false,
            type: 'string',
        },
        authProviderName: {
            index: true,
            null: false,
            type: 'string',
        },
    },
    name: 'auth',
    views: {
        'byAuthProvider': ModelViewKeyBy('authProviderName'),
    },
}