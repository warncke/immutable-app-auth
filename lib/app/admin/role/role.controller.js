'use strict'

/* exports */
module.exports = {
    form: {
        fields: [
            'roleName',
            'access',
            'assign',
            'revoke',
        ],
    },
    read: {
        forms: [
            {
                input: {
                    optionTitleProperty: 'resource',
                    optionValueProperty: 'accessId',
                },
                inputType: 'select',
                model: 'access',
                query: {
                    raw: true,
                    order: ['resource'],
                    select: ['accessId', 'resource'],
                },
                type: 'link',
            },
        ],
    },
}