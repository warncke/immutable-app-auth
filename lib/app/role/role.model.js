'use strict'

const ImmutableCoreModel = require('immutable-core-model')

/**
 * @ImmutableCoreModel role
 *
 * columns: default, roleName
 *
 * roles indexed by unique roleName. roleName cannot be changed once created.
 *
 * role has data properties: access, assign, and revoke.
 *
 * if the role has access privileges only then sessions with the role can
 * access any of the resources assigned to the role.
 *
 * if the role has assign/revoke privileges then sessions with the role can
 * assign/revoke access to any of the resources that the role has access to.
 *
 * it is possible to have access to resources without being able to assign
 * access and to be able to assign access to resources without actually having
 * access to those resources.
 *
 * unique id for session
 */
module.exports = new ImmutableCoreModel({
    actions: {
        delete: false,
    },
    columns: {
        roleName: {
            immutable: true,
            null: false,
            type: 'string',
            unique: true,
        },
    },
    name: 'role',
})