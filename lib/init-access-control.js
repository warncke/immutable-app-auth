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
    }
    // get access model
    var accessModel = ImmutableCoreModel.model('access')
    // load all access control rules
    return accessModel.database().query(`
        SELECT rule, GROUP_CONCAT(roleName) AS roles
          FROM access a
     LEFT JOIN accessDelete ad ON a.accessId = ad.accessId
          JOIN roleAccess ra ON ra.accessId = a.accessId
          JOIN role r ON ra.roleId = r.roleId
         WHERE ad.accessId IS NULL
      GROUP BY rule
    `)
    .then(rows => {
        // get access control instance
        var accessControl = new ImmutableAccessControl()
        // set rule for each row
        _.each(rows, row => {
            // catch errors
            try {
                // start with list of roles
                var setRuleArgs = row.roles.split(',')
                // add rule to end
                setRuleArgs.push(row.rule)
                // set rules
                accessControl.setRule(setRuleArgs)
            }
            catch (err) {
                console.error(err)
            }
        })
    })
}