'use strict'

/* exports */
module.exports = {
    list: {
        fields: [
            {
                meta: true,
                prefix: '/admin/account/',
                property: 'accountId',
                title: 'Account',
                url: true,
            },
            'authProviderId',
            'authProviderName',
            'createTime',
            'actions',
        ],
    },
}