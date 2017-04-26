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
    actions: {
        delete: false,
    },
    columns: {
        accountId: false,
        originalId: false,
        parentId: false,
        rule: {
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