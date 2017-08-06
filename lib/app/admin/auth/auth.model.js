'use strict'

const ModelViewKeyBy = require('immutable-model-view-key-by')

/**
 * @ImmutableCoreModel auth
 */
module.exports = {
    // add queryable columns for auth provider id and name
    columns: {
        authProviderId: {
            type: 'string',
        },
        authProviderName: {
            type: 'string',
        },
    },
    indexes: [
        {
            columns: ['authProviderName', 'authProviderId'],
        },
    ],
    name: 'auth',
    views: {
        'byAuthProvider': ModelViewKeyBy('authProviderName'),
    },
}