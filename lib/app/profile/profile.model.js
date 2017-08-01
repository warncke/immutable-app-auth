'use strict'

/**
 * @ImmutableCoreModel profile
 *
 * extended user information including timezone, language, name, and email.
 * profile is created with session and updated with account.
 */
module.exports = {
    columns: {
        accountId: {
            null: true,
        },
        d: false,
    },
    name: 'profile',
    properties: {
        city: {
            type: 'string',
        },
        country: {
            type: 'string',
        },
        currency: {
            type: 'string',
        },
        email: {
            type: 'string',
        },
        firstName: {
            type: 'string',
        },
        language: {
            type: 'string',
        },
        lastName: {
            type: 'string',
        },
        timezone: {
            type: 'string',
        },
        user: {
            type: 'boolean',
        },
    },
}