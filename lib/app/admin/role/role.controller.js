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
                    optionTitleProperty: 'rule',
                    optionValueProperty: 'accessOriginalId',
                },
                inputType: 'select',
                model: 'access',
                query: {
                    raw: true,
                    order: ['rule'],
                },
                type: 'link',
            },
        ],
    },
}