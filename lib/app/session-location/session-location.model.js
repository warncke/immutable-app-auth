'use strict'

/**
 * @ImmutableCoreModel sessionLocation
 *
 * track location of session
 *
 */
module.exports = {
    columns: {
        d: false,
        accountId: false,
        createTime: {
            index: false,
        },
        originalId: false,
        parentId: false,
    },
    name: 'sessionLocation',
    properties: {
        geoip: {
            type: 'boolean',
        },
        lat: {
            type: 'number',
        },
        lng: {
            type: 'number',
        },
        aa: {
            type: 'number',
        },
        ac: {
            type: 'number',
        },
        al: {
            type: 'number',
        },
        h: {
            type: 'number',
        },
        s: {
            type: 'number',
        },
    },
    required: [
        'lat',
        'lng',
    ],
    transform: {
        lat: val => {
            val = parseFloat(val)
            return Number.isNaN(val) ? undefined : parseFloat(val.toFixed(5))
        },
        lng: val => {
            val = parseFloat(val)
            return Number.isNaN(val) ? undefined : parseFloat(val.toFixed(5))
        },
    },
}