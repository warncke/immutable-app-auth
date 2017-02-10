'use strict'

const ImmutableCoreModel = require('immutable-core-model')

/**
 * @ImmutableCoreModel roleAccess
 *
 * columns: id, roleId, resource, allow
 *
 * role access is modeled as a list of (string) resource names and a boolean
 * flag that indicates whether or not access is granted.
 *
 * role access rules can be deleted. if there is more than one entry for the
 * same resource (should not happen) the most recent entry will be used.
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
        data: false,
        originalId: false,
        parentId: false,
        resource: {
            index: true,
            null: false,
            type: 'string',
        },
    },
    name: 'roleAccess',
})