'use strict'

const ImmutableCoreModel = require('immutable-core-model')

/**
 * @ImmutableCoreModel access
 *
 * columns: id, resource, allow
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
        allow: {
            null: false,
            type: 'boolean',
        },
        originalId: false,
        parentId: false,
        resource: {
            index: true,
            null: false,
            type: 'string',
        }
    },
    name: 'access',
    properties: {
        resource: {
            type: 'string',
        },
        allow: {
            type: 'boolean',
            default: false,
        }
    },
    required: [
        'resource',
        'allow',
    ],
})