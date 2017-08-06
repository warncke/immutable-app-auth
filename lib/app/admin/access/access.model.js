'use strict'

/**
 * @ImmutableCoreModel access
 *
 * columns: id, rule
 *
 * list of resource access rules.
 *
 */
module.exports = {
    columns: {
        accountId: false,
        rule: {
            immutable: true,
            index: true,
            null: false,
            type: 'string',
        }
    },
    name: 'access',
    properties: {
        rule: {
            type: 'string',
        },
    },
    required: [
        'rule',
    ],
}