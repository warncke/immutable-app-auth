'use strict'

/* npm modules */
const ImmutableAccessControl = require('immutable-access-control')
const ImmutableCoreModel = require('immutable-core-model')
const _ = require('lodash')

/* exports */
module.exports = initAccessControl

/**
 * @function initAccessControl
 *
 * load access control rules
 *
 * @param {object} config
 *
 * @returns {Promise}
 */
function initAccessControl (config) {
    // load access control rules
    return loadAccessControl()
    // periodically check that access control rules are current
    .then(() => {
        setInterval(loadAccessControl, config.accessCheckInterval*1000)
    })
}

/* private functions */

/**
 * @function loadAccessControl
 *
 * load all access control rules
 *
 * @returns {Promise}
 */
function loadAccessControl () {
    // make sure accessModel exists
    if (!ImmutableCoreModel.hasModel('access')) {
        console.error('access model not found')
        return
    }
    // get access model
    var accessModel = ImmutableCoreModel.model('access')
    // load all access control rules
    return accessModel.database().query(`
        SELECT a.rule, GROUP_CONCAT(r.roleName) AS roles
          FROM access a
     LEFT JOIN access a2 ON a2.accessParentId = a.accessId
          JOIN roleAccess ra ON ra.accessOriginalId = a.accessOriginalId
     LEFT JOIN roleAccess ra2 ON ra2.roleAccessParentId = ra.roleAccessId
          JOIN role r ON ra.roleOriginalId = r.roleOriginalId
     LEFT JOIN role r2 ON r2.roleParentId = r.roleId
         WHERE a2.accessId IS NULL
           AND ra2.roleAccessId IS NULL
           AND r2.roleId IS NULL
           AND a.d = 0
           AND ra.d = 0
           AND r.d = 0
           AND r.access = 1
      GROUP BY a.rule
    `)
    .then(rows => {
        // get access control instance
        var accessControl = new ImmutableAccessControl()
        // covert db result to rules array
        var rules = _.map(rows, row => {
            // start with list of roles
            var rule = row.roles.split(',')
            // add rule to end
            rule.push(row.rule)
            // add rule array to list
            return rule
        })
        // replace existing rules
        try {
            accessControl.replaceRules(rules)
        }
        catch (err) {
            console.error(err)
        }
    })
}