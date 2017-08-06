'use strict'

module.exports = {
    read: {
        forms: [
            {
                input: {
                    optionTitleProperty: 'roleName',
                    optionValueProperty: 'roleOriginalId',
                },
                inputType: 'select',
                model: 'role',
                query: {
                    raw: true,
                },
                type: 'link',
            }
        ],
    },
}