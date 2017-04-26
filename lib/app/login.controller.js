'use strict'

/* npm modules */
const ImmutableCoreModelForm = require('immutable-core-model-form')
const bcrypt = require('bcrypt')
const httpError = require('immutable-app-http-error')
const httpRedirect = require('immutable-app-http-redirect')

/* controller specification */
module.exports = {
    paths: {
        '/login': {
            get: {
                method: getLogin,
                role: 'anonymous',
                template: 'login',
            },
            post: {
                input: {
                    email: 'body.email',
                    password: 'body.password',
                },
                method: postLogin,
                role: 'anonymous',
                template: 'login',
            },
        },
    },
}

/* register form */
var form = new ImmutableCoreModelForm({
    fields: [
        {
            inputType: 'text',
            name: 'email',
            placeholder: 'Email',
            required: true,
        },
        {
            inputType: 'password',
            name: 'password',
            placeholder: 'Password',
            required: true,
        },
    ],
    method: 'post',
    submit: {
        title: 'Login',
    },
})

/* controller functions */

/**
 * @function getLogin
 *
 * return register form
 */
function getLogin (args) {
    return {
        form: form,
    }
}

/**
 * @function postLogin
 *
 * handle login form post
 */
async function postLogin (args) {
    // check if email exists
    var auth = await this.model.auth.select.one.by.authProviderId(args.email)
    // if email already in use cannot register
    if (!auth) {
        // create new form instance with errors
        var newForm = form.newInstance({
            error: 'Email address not found',
            input: args,
        })
        // return form with errors
        return {
            form: newForm,
        }
    }
    // check password
    var allow = await bcrypt.compare(args.password, auth.data.passwordHash)
    // if password does not match hash return error
    if (!allow) {
        // create new form instance with errors
        var newForm = form.newInstance({
            error: 'Invalid password',
            input: args,
        })
        // return form with errors
        return {
            form: newForm,
        }
    }
    // create session account entry
    await this.model.sessionAccount.createMeta({
        accountId: auth.accountId,
    })
    // redirect
    return httpRedirect('/')
}