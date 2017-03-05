'use strict'

module.exports = {
    read: {
        forms: [
            {
                input: {
                    optionTitleProperty: 'roleName',
                    optionValueProperty: 'roleId',
                },
                inputType: 'select',
                model: 'role',
                query: {
                    raw: true,
                    select: ['roleId', 'roleName'],
                },
                type: 'link',
            }
        ],
    },
}