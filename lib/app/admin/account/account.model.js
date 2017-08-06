'use strict'

/**
 * @ImmutableCoreModel account
 */
module.exports = {
    columns: {
        n: false,
        c: false,
        d: false,
        accountAccountId: false,
        data: false,
        originalId: false,
        parentId: false,
        sessionId: false,
    },
    name: 'account',
    relations: {
        auth: {},
        role: {via: 'roleAccount'},
    },
}