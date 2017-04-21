'use strict'

const ImmutableCoreModel = require('immutable-core-model')

/**
 * @ImmutableCoreModel access
 *
 * columns: id, rule
 *
 * list of resource access rules.
 *
 */
module.exports = new ImmutableCoreModel({
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
})