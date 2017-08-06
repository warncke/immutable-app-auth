'use strict'

/**
 * @ImmutableCoreModel role
 */
module.exports = {
    columns: {
        roleName: {
            immutable: true,
            type: 'string',
        },
        access: {
            type: 'boolean'
        },
        assign: {
            type: 'boolean',
        },
        revoke: {
            type: 'boolean',
        },
    },
    name: 'role',
    properties: {
        access: {
            default: false,
            description: 'Actors can access resources that role has permissions for',
            title: 'Access',
            type: 'boolean',
        },
        assign: {
            default: false,
            description: 'Actors can assign role permissions to other accounts',
            title: 'Assign',
            type: 'boolean',
        },
        revoke: {
            default: false,
            description: 'Actors can revoke role permissions from other accounts',
            title: 'Revoke',
            type: 'boolean',
        },
        roleName: {
            title: 'Role Name',
            type: 'string',
            minLength: 3,
        },
    },
    required: [
        'access',
        'assign',
        'revoke',
        'roleName',
    ],
    relations: {
        access: {via: 'roleAccess'},
    },
}