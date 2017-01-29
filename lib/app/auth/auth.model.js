'use strict'

const ImmutableCoreModel = require('immutable-core-model')

/**
 * @ImmutableCoreModel auth
 *
 * columns: all defaults, authProviderId, authProviderName
 *
 * authProviderName identifies the authentication provider which can be local,
 * facebook, google, etc.
 *
 * authProviderId is the unique identification string that identifies the
 * account with the auth provider such as email address, username, or api
 * token.
 */
module.exports = new ImmutableCoreModel({
    // allow auth records to be deleted but not un-deleted
    actions: {
        delete: false,
    },
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
})